# start.ps1 — launches backend and frontend in separate windows
Write-Host "Starting TaskFlow..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; bun install; bun run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; bun install; bun run dev"

Write-Host ""
Write-Host "Backend  → http://localhost:3001" -ForegroundColor Green
Write-Host "Frontend → http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Open http://localhost:5173 in your browser." -ForegroundColor Yellow
