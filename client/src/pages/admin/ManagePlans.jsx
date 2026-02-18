import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';

export default function ManagePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ plan_name: '', coverage_amount: '', base_price: '', description: '' });

  const fetchPlans = async () => {
    try {
      const res = await API.get('/admin/plans');
      setPlans(res.data.plans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ plan_name: '', coverage_amount: '', base_price: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditing(plan);
    setForm({ plan_name: plan.plan_name, coverage_amount: plan.coverage_amount, base_price: plan.base_price, description: plan.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.plan_name || !form.coverage_amount || !form.base_price) {
      toast.error('Fill in required fields');
      return;
    }
    try {
      if (editing) {
        await API.put(`/admin/plans/${editing.id}`, form);
        toast.success('Plan updated');
      } else {
        await API.post('/admin/plans', form);
        toast.success('Plan created');
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving plan');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await API.delete(`/admin/plans/${id}`);
      toast.success('Plan deleted');
      fetchPlans();
    } catch (err) {
      toast.error('Error deleting plan');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-bold">Manage <span className="gradient-text">Plans</span></h1>
            <p className="text-slate-400 mt-1">{plans.length} insurance plans</p>
          </div>
          <button onClick={openCreate} className="btn-primary">
            <HiPlus /> Add Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeInUp">
          {plans.map(plan => (
            <div key={plan.id} className="card !p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold">{plan.plan_name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(plan)} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors">
                    <HiPencil />
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors">
                    <HiTrash />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400">Coverage</span>
                  <p className="font-semibold">NPR {parseFloat(plan.coverage_amount).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Base Price</span>
                  <p className="font-semibold text-sky-400">NPR {parseFloat(plan.base_price).toLocaleString()}/yr</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="card !p-8 w-full max-w-lg mx-4 relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <HiX className="text-xl" />
              </button>
              <h2 className="text-xl font-bold mb-6">{editing ? 'Edit' : 'Create'} Plan</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Plan Name *</label>
                  <input className="input-field" value={form.plan_name} onChange={e => setForm({ ...form, plan_name: e.target.value })} placeholder="e.g., Premium Gold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Coverage (NPR) *</label>
                    <input type="number" className="input-field" value={form.coverage_amount} onChange={e => setForm({ ...form, coverage_amount: e.target.value })} placeholder="500000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Price (NPR) *</label>
                    <input type="number" className="input-field" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })} placeholder="5000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea className="input-field resize-none" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Plan description..." />
                </div>
                <button type="submit" className="btn-primary w-full justify-center !py-3">
                  {editing ? 'Update Plan' : 'Create Plan'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
