const express = require("express");
const axios = require("axios");
const pool = require("../config/db");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/user/profile
router.get("/profile", async (req, res) => {
  try {
    try {
      const [users] = await pool.query(
        "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
        [req.user.id],
      );
      if (users.length > 0) {
        return res.json({ user: users[0] });
      }
    } catch (dbErr) {
      console.warn("DB unavailable for profile, returning token data");
    }
    // Fallback: return user info from JWT token
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/user/predict
router.post("/predict", async (req, res) => {
  try {
    const {
      age,
      gender,
      bmi,
      smoker,
      num_dependents,
      region,
      existing_conditions,
      income_lakhs,
      genetical_risk,
      insurance_plan,
      employment_status,
      marital_status,
      reason,
    } = req.body;

    if (age == null || bmi == null) {
      return res.status(400).json({ message: "Age and BMI are required." });
    }

    // Call ML microservice with all fields
    const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    const mlResponse = await axios.post(`${mlUrl}/predict`, {
      age: parseInt(age),
      gender: gender || "male",
      bmi: parseFloat(bmi),
      smoker: parseInt(smoker) || 0,
      num_dependents: parseInt(num_dependents) || 0,
      region: region || "northeast",
      existing_conditions: existing_conditions || "",
      income_lakhs: parseFloat(income_lakhs) || 5.0,
      insurance_plan: parseInt(insurance_plan) || 1,
      genetical_risk: parseInt(genetical_risk) || 0,
      marital_status: marital_status || "married",
      employment_status: employment_status || "salaried",
    });

    const predictedPremium = mlResponse.data.predicted_premium;

    // Determine risk category
    let riskCategory = "Low";
    if (predictedPremium > 10000) {
      riskCategory = "High";
    } else if (predictedPremium >= 5000) {
      riskCategory = "Medium";
    }

    // Build personalized explanation
    const explanationParts = [];
    const recommendationParts = [];

    // Age factor
    const ageVal = parseInt(age);
    if (ageVal < 25) {
      explanationParts.push(
        `At ${ageVal}, you're in a younger age group which generally means lower base premiums.`,
      );
      recommendationParts.push(
        "Starting insurance early locks in lower rates and builds long-term coverage.",
      );
    } else if (ageVal < 40) {
      explanationParts.push(
        `At ${ageVal}, you're in the prime working age group with moderate health risk.`,
      );
      recommendationParts.push(
        "This is the ideal time to secure comprehensive coverage before premiums increase with age.",
      );
    } else if (ageVal < 55) {
      explanationParts.push(
        `At ${ageVal}, health risks begin to increase, which impacts your premium.`,
      );
      recommendationParts.push(
        "Getting insured now protects you from escalating medical costs as you age.",
      );
    } else {
      explanationParts.push(
        `At ${ageVal}, you're in a higher risk age bracket which significantly affects the premium.`,
      );
      recommendationParts.push(
        "Insurance is critical at this stage to cover potential hospitalization and chronic condition costs.",
      );
    }

    // BMI factor
    const bmiVal = parseFloat(bmi);
    if (bmiVal < 18.5) {
      explanationParts.push(
        "Your BMI indicates underweight status, which can signal nutritional or health concerns.",
      );
    } else if (bmiVal >= 25 && bmiVal < 30) {
      explanationParts.push(
        "Your BMI falls in the overweight range, which slightly increases health risk and premium.",
      );
    } else if (bmiVal >= 30) {
      explanationParts.push(
        "Your BMI is in the obese range, which is a significant risk factor for heart disease, diabetes, and other conditions — driving up the premium.",
      );
      recommendationParts.push(
        "With a higher BMI, medical expenses can be unpredictable. Insurance provides a safety net.",
      );
    }

    // Smoking factor
    const smokerVal = parseInt(smoker) || 0;
    if (smokerVal === 2) {
      explanationParts.push(
        "Regular smoking is one of the biggest premium drivers — it dramatically increases risk of cancer, lung disease, and heart conditions.",
      );
      recommendationParts.push(
        "As a regular smoker, your medical costs are statistically much higher. Insurance is essential to avoid catastrophic out-of-pocket expenses.",
      );
    } else if (smokerVal === 1) {
      explanationParts.push(
        "Occasional smoking still elevates your risk for respiratory and cardiovascular conditions, impacting your premium.",
      );
      recommendationParts.push(
        "Even occasional smoking increases long-term health risks. Insurance provides a valuable safety net.",
      );
    }

    // Dependents factor
    const depsVal = parseInt(num_dependents) || 0;
    if (depsVal > 0) {
      explanationParts.push(
        `You have ${depsVal} dependent(s), which means your family relies on your health and financial stability.`,
      );
      recommendationParts.push(
        "With dependents counting on you, insurance ensures your family is protected if anything happens.",
      );
    }

    // Existing conditions
    const conditions = existing_conditions || "";
    if (conditions.trim() && conditions.trim().toLowerCase() !== "no disease") {
      explanationParts.push(
        `Your medical history (${conditions}) increases the likelihood of future medical claims, raising the premium.`,
      );
      recommendationParts.push(
        "Pre-existing conditions make insurance even more valuable — it covers ongoing treatment and prevents financial burden.",
      );
    }

    // Income factor
    const incomeVal = parseFloat(income_lakhs) || 5.0;
    if (incomeVal < 3) {
      explanationParts.push(
        `Your income level (${incomeVal}L) is on the lower side, which the model considers when assessing affordable coverage.`,
      );
    } else if (incomeVal > 15) {
      explanationParts.push(
        `With an income of ${incomeVal}L, you have access to higher-tier plans and can afford more comprehensive coverage.`,
      );
    }

    // Genetical risk factor
    const geneticalVal = parseInt(genetical_risk) || 0;
    if (geneticalVal >= 3) {
      explanationParts.push(
        `Your genetical risk score of ${geneticalVal}/5 is high, indicating a family history of health conditions that significantly raises your premium.`,
      );
      recommendationParts.push(
        "High genetical risk means you're more likely to face hereditary health issues. Insurance helps manage these future costs.",
      );
    } else if (geneticalVal >= 1) {
      explanationParts.push(
        `Your genetical risk score of ${geneticalVal}/5 indicates some family health history, moderately affecting the premium.`,
      );
    }

    // Insurance plan factor
    const planVal = parseInt(insurance_plan) || 1;
    const planNames = { 1: "Bronze", 2: "Silver", 3: "Gold" };
    explanationParts.push(
      `You selected the ${planNames[planVal] || "Bronze"} plan tier, which affects the coverage level and premium amount.`,
    );

    // Employment status factor
    const empStatus = employment_status || "salaried";
    if (empStatus === "freelancer") {
      explanationParts.push(
        "As a freelancer, you may have less stable income which is factored into premium calculation.",
      );
    } else if (empStatus === "self-employed") {
      explanationParts.push(
        "Being self-employed, your income stability profile slightly influences the premium.",
      );
    }

    // Marital status factor
    const maritalVal = marital_status || "married";
    if (maritalVal === "unmarried") {
      explanationParts.push(
        "Being unmarried is a factor the model considers, as it may correlate with different lifestyle risk profiles.",
      );
    }

    // Risk-based recommendation
    if (riskCategory === "High") {
      recommendationParts.push(
        "⚠️ Your profile is HIGH RISK. We strongly recommend getting insured immediately to protect against potentially very high medical costs.",
      );
    } else if (riskCategory === "Medium") {
      recommendationParts.push(
        "Your profile shows moderate risk. Insurance at this stage gives you peace of mind and financial protection.",
      );
    } else {
      recommendationParts.push(
        "Your risk profile is low — this is the best time to get affordable coverage and stay protected.",
      );
    }

    const explanation = explanationParts.join(" ");
    const recommendation = recommendationParts.join(" ");

    // Try saving to database (non-critical)
    let insertId = null;
    try {
      const smokerVal = parseInt(smoker) || 0;
      const [result] = await pool.query(
        `INSERT INTO predictions (user_id, age, gender, bmi, smoker, num_dependents, region, existing_conditions, predicted_premium, risk_category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          age,
          gender,
          bmi,
          smokerVal,
          num_dependents || 0,
          region,
          existing_conditions,
          predictedPremium,
          riskCategory,
        ],
      );
      insertId = result.insertId;
    } catch (dbErr) {
      console.warn("DB unavailable, skipping prediction save");
    }

    res.json({
      prediction: {
        id: insertId,
        predicted_premium: predictedPremium,
        risk_category: riskCategory,
        age,
        gender,
        bmi,
        smoker: parseInt(smoker) || 0,
        num_dependents,
        region,
        existing_conditions,
        income_lakhs: parseFloat(income_lakhs) || 5.0,
        genetical_risk: parseInt(genetical_risk) || 0,
        insurance_plan: parseInt(insurance_plan) || 1,
        employment_status: employment_status || "salaried",
        marital_status: marital_status || "married",
        explanation,
        recommendation,
      },
    });
  } catch (err) {
    console.error("Prediction error:", err);
    if (err.response) {
      return res
        .status(502)
        .json({ message: "ML service error.", detail: err.response.data });
    }
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/user/predictions
router.get("/predictions", async (req, res) => {
  try {
    try {
      const [predictions] = await pool.query(
        "SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC",
        [req.user.id],
      );
      return res.json({ predictions });
    } catch (dbErr) {
      console.warn("DB unavailable for predictions history");
      return res.json({ predictions: [] });
    }
  } catch (err) {
    console.error("Predictions error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/user/purchase
router.post("/purchase", async (req, res) => {
  try {
    const {
      prediction_id,
      plan_name,
      coverage_amount,
      premium_amount,
      duration_years,
    } = req.body;

    if (!plan_name || !coverage_amount || !premium_amount) {
      return res.status(400).json({
        message: "Plan name, coverage amount, and premium amount are required.",
      });
    }

    let purchaseId = Date.now(); // fallback ID
    try {
      const [result] = await pool.query(
        `INSERT INTO purchases (user_id, prediction_id, plan_name, coverage_amount, premium_amount, duration_years)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          prediction_id || null,
          plan_name,
          coverage_amount,
          premium_amount,
          duration_years || 1,
        ],
      );
      purchaseId = result.insertId;
    } catch (dbErr) {
      console.warn("DB unavailable, purchase not persisted but confirmed");
    }

    res.json({
      message: "Insurance purchased successfully!",
      purchase: {
        id: purchaseId,
        plan_name,
        coverage_amount,
        premium_amount,
        duration_years: duration_years || 1,
        status: "active",
        purchased_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Purchase error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/user/purchases
router.get("/purchases", async (req, res) => {
  try {
    try {
      const [purchases] = await pool.query(
        "SELECT * FROM purchases WHERE user_id = ? ORDER BY purchased_at DESC",
        [req.user.id],
      );
      return res.json({ purchases });
    } catch (dbErr) {
      console.warn("DB unavailable for purchases");
      return res.json({ purchases: [] });
    }
  } catch (err) {
    console.error("Purchases error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
