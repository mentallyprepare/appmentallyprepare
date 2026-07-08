param(
  [string]$DatabasePath = "mentally-prepare.db",
  [string]$BackupDir = "./backups"
)

$RetentionDaily = 7
$RetentionWeekly = 4

if (-not (Test-Path $DatabasePath) -and -not (Test-Path "$DatabasePath-wal")) {
  Write-Host "No database found at $DatabasePath"
  exit 0
}

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

$Date = Get-Date -Format "yyyyMMdd_HHmmss"
$DayOfWeek = (Get-Date).DayOfWeek.value__

# Daily backup
Copy-Item $DatabasePath "$BackupDir/daily-$Date.db" -ErrorAction SilentlyContinue

# Clean old daily (keep last 7)
Get-ChildItem "$BackupDir/daily-*.db" | Sort-Object Name -Descending | Select-Object -Skip $RetentionDaily | Remove-Item -Force -ErrorAction SilentlyContinue

# Weekly backup (Sunday)
if ($DayOfWeek -eq 0) {
  Copy-Item $DatabasePath "$BackupDir/weekly-$Date.db" -ErrorAction SilentlyContinue
  Get-ChildItem "$BackupDir/weekly-*.db" | Sort-Object Name -Descending | Select-Object -Skip $RetentionWeekly | Remove-Item -Force -ErrorAction SilentlyContinue
}

Write-Host "Backup saved: $BackupDir/daily-$Date.db"
