# Reset MySQL root password
Write-Host "Stopping MySQL..."
Stop-Service MySQL80 -Force
Start-Sleep -Seconds 3

Write-Host "Starting MySQL with skip-grant-tables..."
$mysqld = Start-Process -FilePath "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" -ArgumentList "--skip-grant-tables","--shared-memory" -PassThru
Start-Sleep -Seconds 5

Write-Host "Resetting root password..."
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'rootpassword';" 2>&1
Start-Sleep -Seconds 2

Write-Host "Stopping mysqld..."
Stop-Process -Id $mysqld.Id -Force
Start-Sleep -Seconds 3

Write-Host "Starting MySQL service..."
Start-Service MySQL80
Start-Sleep -Seconds 3

Write-Host "Done!"
