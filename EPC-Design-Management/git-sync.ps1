# EPC-Design-Management · 同步助手 (PowerShell 5.1 内置，无需安装)
#
# 位于 workbuddy/EPC-Design-Management/ 下，运行时：
#   1. 自动向上找到 workbuddy 仓库根
#   2. 只 git add 本子项目目录（EPC-Design-Management）
#   3. 用统一 scope 提交：feat(EPC-Design-Management): <msg>
#   4. pull --rebase --autostash 再 push 到 origin（当前分支）
#
# 用法（PowerShell，在 EPC-Design-Management/ 目录内运行）：
#   .\git-sync.ps1                              仅拉取远端最新并查看状态
#   .\git-sync.ps1 -Message "v0.2 细化 A05"     提交本子项目改动 → 拉取 → 推送
#
# 说明：凭证使用你本机的 SSH key / PAT / credential helper，无需硬编码。
#       冲突时会停下来，按提示 git status → 解决 → git rebase --continue。

param(
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"

# 脚本所在目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

# 向上找到仓库根、以及本子项目相对仓库根的路径
$RepoRoot = (git -C $ScriptDir rev-parse --show-toplevel | Out-String).Trim()
$SubDir   = (git -C $ScriptDir rev-parse --show-prefix   | Out-String).Trim() -replace '/$',''

if ([string]::IsNullOrEmpty($RepoRoot) -or [string]::IsNullOrEmpty($SubDir)) {
    Write-Host "[ERROR] 未在 git 仓库内运行（找不到 .git）。" -ForegroundColor Red
    exit 1
}

Set-Location $RepoRoot
$branch = ((git rev-parse --abbrev-ref HEAD 2>$null) -join "").Trim()
if ($branch -eq "") { $branch = "main" }

Write-Host "== 仓库: $RepoRoot ==" -ForegroundColor Cyan
Write-Host "== 分支: $branch | 同步子目录: $SubDir ==" -ForegroundColor Cyan

if ($Message -ne "") {
    Write-Host "== 提交本子项目改动 ==" -ForegroundColor Yellow
    git add $SubDir
    # git diff --cached --quiet 返回 0 表示无改动
    git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Host "（无改动可提交，跳过）" -ForegroundColor DarkYellow
    } else {
        git commit -m "feat(EPC-Design-Management): $Message"
    }
}

Write-Host "== 拉取远端最新（autostash）==" -ForegroundColor Yellow
git pull --rebase --autostash origin $branch
if ($LASTEXITCODE -ne 0) {
    Write-Host "拉取失败：很可能存在冲突。请 git status 查看并手动解决，再 git rebase --continue。" -ForegroundColor Red
    exit 1
}

Write-Host "== 推送到远端 ==" -ForegroundColor Yellow
git push origin $branch

Write-Host "== 同步完成，当前状态 ==" -ForegroundColor Green
git status -sb -- $SubDir
