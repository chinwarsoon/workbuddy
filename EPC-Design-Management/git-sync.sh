#!/usr/bin/env bash
# EPC-Design-Management · 同步助手（在 workbuddy 仓库内，只同步本子项目）
#
# 本脚本位于 workbuddy/EPC-Design-Management/ 下，运行时：
#   1. 自动向上找到 workbuddy 仓库根（含 .git 的目录）
#   2. 只 git add 本子项目目录（EPC-Design-Management）
#   3. 用统一 scope 提交：feat(EPC-Design-Management): <msg>
#   4. pull --rebase --autostash 再 push 到 origin（当前分支）
#
# 用法（WSL / Git Bash，在 EPC-Design-Management/ 目录内运行）：
#   ./git-sync.sh                          仅拉取远端最新并查看状态
#   ./git-sync.sh "v0.2 细化 A05 采购联动"  提交本子项目改动 → 拉取 → 推送
#
# 说明：凭证使用你本机的 SSH key / PAT / credential helper，无需硬编码。
#       冲突时会停下来，按提示 git status → 解决 → git rebase --continue。

set -euo pipefail

# 脚本所在目录（EPC-Design-Management）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 向上找到仓库根 + 本子项目相对仓库根的路径
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
SUBDIR="$(git -C "$SCRIPT_DIR" rev-parse --show-prefix)"
SUBDIR="${SUBDIR%/}"   # 去掉结尾斜杠，例如 EPC-Design-Management

if [ -z "$REPO_ROOT" ] || [ -z "$SUBDIR" ]; then
  echo "[ERROR] 未在 git 仓库内运行（找不到 .git）。" >&2
  exit 1
fi

cd "$REPO_ROOT"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"
echo "== 仓库: $REPO_ROOT =="
echo "== 分支: $branch | 同步子目录: $SUBDIR =="

if [ $# -gt 0 ]; then
  echo "== 提交本子项目改动 =="
  git add "$SUBDIR"
  if git diff --cached --quiet; then
    echo "（无改动可提交，跳过）"
  else
    git commit -m "feat(EPC-Design-Management): $1"
  fi
fi

echo "== 拉取远端最新（rebase + autostash）=="
if ! git pull --rebase --autostash origin "$branch"; then
  echo "拉取失败：很可能存在冲突。请先 git status 查看，手动解决后 git rebase --continue。" >&2
  exit 1
fi

echo "== 推送到远端 =="
git push origin "$branch"

echo "== 同步完成，当前状态 =="
git status -sb -- "$SUBDIR"
