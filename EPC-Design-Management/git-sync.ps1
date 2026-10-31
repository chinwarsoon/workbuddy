# EPC-Design-Management · 双向同步助手 (PowerShell 5.1 内置，无需安装任何东西)
#
# 用法（PowerShell 中运行）：
#   .\git-sync.ps1                    仅拉取远端最新并查看状态
#   .\git-sync.ps1 -Message "v0.2 更新 A05"   提交本地改动 → 拉取 → 推送

param(
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"

Write-Host "== 同步 EPC-Design-Management ==" -ForegroundColor Cyan

if ($Message -ne "") {
    Write-Host "== 提交本地改动 ==" -ForegroundColor Yellow
    git add -A
    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { Write-Host "提交失败（可能没有改动）。继续执行拉取。" -ForegroundColor DarkYellow }
}

Write-Host "== 拉取远端最新（autostash）==" -ForegroundColor Yellow
git pull --rebase --autostash
if ($LASTEXITCODE -ne 0) {
    Write-Host "拉取失败：很可能存在冲突。请 git status 查看并手动解决，再 git rebase --continue。" -ForegroundColor Red
    exit 1
}

Write-Host "== 推送到远端 ==" -ForegroundColor Yellow
git push

Write-Host "== 同步完成，当前状态 ==" -ForegroundColor Green
git status -sb
