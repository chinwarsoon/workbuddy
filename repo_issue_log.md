# Issue log — repository-wide

| ID | Date | Phase | Severity | Title | Description | Status | Tasks | Resolution |
|---|---|---|---|---|---|---|---|---|
| I001 | 2026-11-22 | — | 🟡 Medium | CRLF line-ending churn after git-sync | Windows tools wrote CRLF while HEAD used LF. No line-ending rule existed. Pull and rebase did not help because the changes were uncommitted. | ✅ RESOLVED | — | Close: `.gitattributes` fixed text files as `LF` and `.bat` files as `CRLF`. Clean clone confirmed. |
