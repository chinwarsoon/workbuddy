"""Backfill missing definitions for Phase 1 (freq-1k) / Phase 3 (freq-3k) from ECDICT.

Only touches entries that currently have NO `def`. Writes ipa/pos/def/defEn/emoji.
Example sentences are NOT generated here — they are hand-authored via
`build/_gen_pack_examples.js` + `build/_p1_curated/*.json` (the 12.1 pipeline),
because template sentences are exactly the defect 12.1 had to undo.

Usage:  python build/_gen_p1_words.py           # dry run
        python build/_gen_p1_words.py --apply   # write both content/ and pwa/content/
"""
import csv, json, sys, re

csv.field_size_limit(sys.maxsize)
DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning"
APPLY = "--apply" in sys.argv
TARGETS = ["freq-1k", "freq-3k"]

# ---------- ECDICT ----------
ec = {}
with open(DIR + "/build/ecdict.csv", encoding="utf-8", errors="replace") as f:
    for row in csv.DictReader(f):
        w = row["word"].strip().lower()
        if w not in ec:
            ec[w] = row
print("ECDICT loaded:", len(ec))

# ---------- text helpers (mirrors _gen_p2_words.py) ----------
PHON_MAP = {"ә": "ə", "ɛ": "e", "ˌ": "", "ʾ": ""}


def norm_phone(p):
    if not p:
        return ""
    for k, v in PHON_MAP.items():
        p = p.replace(k, v)
    return p.strip()


def clean(s):
    return (s or "").replace("\r", " ").replace("\n", " ").strip()


POS_RE = re.compile(r"^\s*(?:\([^)]*\)\s*)?(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)", re.I)
ANY_POS_RE = re.compile(r"(?:^|[\s,;])(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)", re.I)
ABBREV = {"n.": "n.", "v.": "v.", "vt.": "v.", "vi.": "v.", "adj.": "adj.", "a.": "adj.",
          "adv.": "adv.", "prep.": "prep.", "conj.": "conj.", "int.": "int.",
          "abbr.": "abbr.", "art.": "art.", "pron.": "pron."}
DISCIPLINE_RE = re.compile(r"\[[^\]]*\]")
INLINE_POS_RE = re.compile(r"(?:^|[\s,，、])(vt\.|vi\.|v\.|n\.|adj\.|adv\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)\s*")


def detect_pos(s):
    if not s:
        return ""
    m = POS_RE.match(s)
    if m:
        return ABBREV.get(m.group(1).lower(), "")
    m2 = ANY_POS_RE.search(s)
    if m2:
        return ABBREV.get(m2.group(1).lower(), "")
    return ""


def en_def(s):
    s = (s or "").replace("\r", " ").replace("\\n", "\n")
    if not s.strip():
        return ""
    first = s.split("\n")[0].strip()
    m = POS_RE.match(first)
    if m:
        first = POS_RE.sub("", first, count=1).strip()
    first = DISCIPLINE_RE.sub("", first).strip().strip(" .;")
    first = re.sub(r"\s+", " ", first).strip()
    if len(first) > 160:
        cut = re.split(r"(?<=[a-z])[;,)]", first)
        first = cut[0].strip()
        if len(first) > 160:
            first = first[:157].rsplit(" ", 1)[0]
    return first[:200]


def zh_def(s):
    s = (s or "").replace("\r", " ").replace("\n", " ").replace("\\n", " ").replace("\t", " ")
    s = re.sub(r"\s+", " ", s).strip()
    if not s:
        return ""
    s = re.sub(r"^[a-zA-Z]+\.\s*", "", s).strip()
    s = DISCIPLINE_RE.sub("", s).strip()
    s = INLINE_POS_RE.sub("", s)
    s = re.sub(r"\s+", " ", s).strip()
    parts = [p.strip() for p in s.split(",") if p.strip()]
    if not parts:
        return ""
    return ", ".join(parts[:2])[:60]


POS_EMOJI = {"n.": "📦", "v.": "🔧", "adj.": "⭐", "adv.": "⏩", "prep.": "🔗",
             "conj.": "🔗", "int.": "💬", "abbr.": "🔤"}


def alts(w):
    out = [w + "s", w + "es", w + "ed", w + "ing"]
    if w.endswith("e"):
        out.append(w[:-1] + "ing")
    if w.endswith("y"):
        out.append(w[:-1] + "ies")
    return out


# ---------- process each pack ----------
summary = []
for pack_id in TARGETS:
    path = DIR + "/content/%s.json" % pack_id
    pack = json.load(open(path, encoding="utf-8"))
    words = pack["words"]
    todo = [w for w in words if not w.get("def")]
    print("\n=== %s ===  entries=%d  missing def=%d" % (pack_id, len(words), len(todo)))

    filled, miss = 0, []
    for w in todo:
        word = w["word"]
        row = ec.get(word.lower())
        if not row:
            for a in alts(word):
                if ec.get(a.lower()):
                    row = ec[a.lower()]
                    break
        if not row:
            miss.append(word)
            continue
        ph = norm_phone(clean(row["phonetic"]))
        pos = clean(row["pos"]) or detect_pos(row["definition"]) or detect_pos(row["translation"])
        pos = ABBREV.get(pos.lower(), pos) if pos else ""
        if not pos:
            lead = en_def(row["definition"]).lower()
            if lead.startswith("to ") or lead.startswith("an act") or lead.startswith("the act"):
                pos = "v."
            elif lead.startswith("in a ") or lead.startswith("with "):
                pos = "adv."
            else:
                pos = "n."
        w["ipa"] = ("/" + ph + "/") if ph else ""
        w["pos"] = pos
        w["def"] = zh_def(row["translation"]) or "（常用词）"
        w["defEn"] = en_def(row["definition"]) or "a common English word."
        w["emoji"] = POS_EMOJI.get(pos, "📘")
        filled += 1

    total_def = sum(1 for w in words if w.get("def"))
    summary.append((pack_id, len(words), total_def, filled, len(miss)))
    print("  ECDICT filled: %d | still missing: %d | pack now has def: %d/%d"
          % (filled, len(miss), total_def, len(words)))
    if miss:
        print("  still missing:", " ".join(miss[:60]), ("..." if len(miss) > 60 else ""))

    if APPLY:
        out = json.dumps(pack, ensure_ascii=False, indent=1)
        open(path, "w", encoding="utf-8").write(out)
        open(DIR + "/pwa/content/%s.json" % pack_id, "w", encoding="utf-8").write(out)

print("\n---------- SUMMARY ----------")
for pack_id, n, d, f, m in summary:
    print("  %-9s %4d words | def %4d/%d | filled %3d | unresolved %3d" % (pack_id, n, d, n, f, m))
print("\nMODE:", "APPLIED (both content/ and pwa/content/ rewritten)" if APPLY else "DRY RUN (nothing written)")
print("NOTE: ex/exzh/exEn are still empty for these entries — hand-author them next.")
