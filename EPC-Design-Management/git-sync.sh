#!/usr/bin/env bash
# EPC-Design-Management · 双向同步助手
#
# 用法（在 WSL / Git Bash 中运行）：
#   ./git-sync.sh                     仅拉取远端最新并查看状态
#   ./git-sync.sh "v0.2 更新 A05"      提交本地改动 → 拉取 → 推送
#
# 说明：拉取使用 --rebase --autostash，避免多余的 merge 提交，
#       同时自动暂存未提交的改动，冲突时会停下来交给你手动处理。

set -euo pipefail
cd "$(dirname "$0")"

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"
echo "== 当前分支: $branch =="

if [ $# -gt 0 ]; then
  echo "== 提交本地改动 =="
  git add -A
  git commit -m "$1"
fi

echo "== 拉取远端最新（rebase + autostash）=="
if ! git pull --rebase --autostash origin "$branch"; then
  echo "拉取失败：很可能存在冲突。请先 git status 查看，手动解决后 git rebase --continue。"
  exit 1
fi

echo "== 推送到远端 =="
git push origin "$branch"

echo "== 同步完成，当前状态 =="
git status -sb
