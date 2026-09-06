"""Clean the ECDICT backfill in freq-1k / freq-3k.

The first backfill (_gen_p1_words.py --apply) filled 705 (p1) + 156 (p3) empty
defs from ECDICT, but ECDICT lists senses in dictionary order, so function/aux
words got garbage (a->"第一个字母 A...", at->"100 at equal 1 kip in Laos",
as->"n a very poisonous metallic element"). This script:

  1. Applies a hand-authored override for FUNCTION/AUX/PRONOUN words
     (build/_p1_func_override.json) -> full clean fields incl. example.
  2. For the remaining CONTENT words (no example, still ECDICT-filled),
     re-extracts a clean SINGLE first-sense gloss only (def = first Chinese
     gloss; defEn = first English sense), removing the multi-sense junk.

Entries that already have a non-empty `ex` (the 351 golden TAUGHT entries) are
left untouched.

Usage:  python build/_clean_p1.py          # dry run
        python build/_clean_p1.py --apply  # write content/ and pwa/content/
"""
import csv, json, sys, re

csv.field_size_limit(sys.maxsize)
DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning"
APPLY = "--apply" in sys.argv
TARGETS = ["freq-1k", "freq-3k"]

# ---------- curated overrides ----------
OVERRIDE = json.load(open(DIR + "/build/_p1_func_override.json", encoding="utf-8"))
OVERRIDE_LC = {k.lower(): v for k, v in OVERRIDE.items()}
CONTENT_OV = json.load(open(DIR + "/build/_p1_content_override.json", encoding="utf-8"))
CONTENT_OV_LC = {k.lower(): v for k, v in CONTENT_OV.items()}
# taught words (have an example sentence) whose def/defEn were garbage -> fix
# def/defEn from ECDICT while PRESERVING the existing example.
TAUGHT_FIX = json.load(open(DIR + "/build/_p1_taught_fix.json", encoding="utf-8"))
TAUGHT_FIX_LC = {k.lower(): v for k, v in TAUGHT_FIX.items()}

# ---------- ECDICT ----------
ec = {}
with open(DIR + "/build/ecdict.csv", encoding="utf-8", errors="replace") as f:
    for row in csv.DictReader(f):
        w = row["word"].strip().lower()
        if w not in ec:
            ec[w] = row
print("ECDICT loaded:", len(ec))

# ---------- text helpers ----------
PHON_MAP = {"ә": "ə", "ɛ": "e", "ˌ": "", "ʾ": ""}
DISCIPLINE_RE = re.compile(r"\[[^\]]*\]")
INLINE_POS_RE = re.compile(r"(?:^|[\s,，、])(vt\.|vi\.|v\.|n\.|adj\.|adv\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)\s*")
POS_RE = re.compile(r"^\s*(?:\([^)]*\)\s*)?(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)", re.I)
ANY_POS_RE = re.compile(r"(?:^|[\s,;])(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)", re.I)
ABBREV = {"n.": "n.", "v.": "v.", "vt.": "v.", "vi.": "v.", "adj.": "adj.", "a.": "adj.",
          "adv.": "adv.", "prep.": "prep.", "conj.": "conj.", "int.": "int.",
          "abbr.": "abbr.", "art.": "art.", "pron.": "pron."}
POS_EMOJI = {"n.": "📦", "v.": "🔧", "adj.": "⭐", "adv.": "⏩", "prep.": "🔗",
             "conj.": "🔗", "int.": "💬", "abbr.": "🔤", "art.": "🔤", "aux.": "🔧", "pron.": "💬", "det.": "🔤"}


def norm_phone(p):
    if not p:
        return ""
    for k, v in PHON_MAP.items():
        p = p.replace(k, v)
    return p.strip()


def clean(s):
    return (s or "").replace("\r", " ").replace("\n", " ").strip()


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


def zh_first(s):
    # ECDICT stores newlines as literal "\n"; normalize to real newlines first
    s = (s or "").replace("\\n", "\n").replace("\r", " ")
    # ECDICT separates homograph senses by newlines; keep only the FIRST sense.
    line = s.split("\n")[0].strip()
    line = re.sub(r"^[a-zA-Z]+\.\s*", "", line)   # strip leading pos tag
    line = DISCIPLINE_RE.sub("", line).strip()
    line = INLINE_POS_RE.sub("", line)
    # split on commas / Chinese commas / semicolons / whitespace so duplicated
    # glosses like "在下面 在下面" / "国际象棋 雀麦" keep only the first token
    parts = [p.strip() for p in re.split(r"[\s,，、；;]+", line) if p.strip()]
    if not parts:
        return ""
    # first concise gloss only; drop obvious junk (digits / too long)
    g = parts[0]
    if any(ch.isdigit() for ch in g) or len(g) > 14:
        return parts[1] if len(parts) > 1 else ""
    return g[:16]


def en_first(s):
    # ECDICT stores newlines as literal "\n"; normalize first
    s = (s or "").replace("\\n", "\n").replace("\r", " ")
    # try each newline-separated sense; pick the first substantive definition
    for raw in [l.strip() for l in s.split("\n") if l.strip()]:
        first = raw
        m = POS_RE.match(first)
        if m:
            first = POS_RE.sub("", first, count=1).strip()
        first = DISCIPLINE_RE.sub("", first).strip().strip(" .;")
        first = re.sub(r"\s+", " ", first).strip()
        if ". " in first:                      # first sentence only
            first = first.split(". ")[0]
        first = first.rstrip(".").strip()
        # skip trivial fragments like "r" / "r." (glossary abbreviations)
        if len(first) >= 3 and not re.fullmatch(r"[a-z]\.?", first):
            if len(first) > 120:
                first = first[:117].rsplit(" ", 1)[0]
            return first[:140]
    return "a common English word."


def alts(w):
    out = [w + "s", w + "es", w + "ed", w + "ing"]
    if w.endswith("e"):
        out.append(w[:-1] + "ing")
    if w.endswith("y"):
        out.append(w[:-1] + "ies")
    return out


summary = []
for pack_id in TARGETS:
    path = DIR + "/content/%s.json" % pack_id
    pack = json.load(open(path, encoding="utf-8"))
    words = pack["words"]
    ov = 0
    tf = 0
    reex = 0
    miss = []
    for w in words:
        word = w["word"]
        key = word.lower()
        ex = (w.get("ex") or "").strip()
        if key in OVERRIDE_LC:
            ipa, pos, dzh, den, ex, exzh, exEn, emo = OVERRIDE_LC[key]
            w["ipa"] = ipa
            w["pos"] = pos
            w["def"] = dzh
            w["defEn"] = den
            w["ex"] = ex
            w["exzh"] = exzh
            w["exEn"] = exEn
            w["emoji"] = emo
            ov += 1
            continue
        if key in TAUGHT_FIX_LC:
            # taught word (has example) with a garbage def -> fix def/defEn,
            # PRESERVING the existing example sentence.
            dzh, den = TAUGHT_FIX_LC[key]
            w["def"] = dzh
            w["defEn"] = den
            tf += 1
            continue
        if key in CONTENT_OV_LC:
            dzh, den = CONTENT_OV_LC[key]
            row = ec.get(key)
            if not row:
                for a in alts(word):
                    if ec.get(a.lower()):
                        row = ec[a.lower()]
                        break
            ph = norm_phone(clean(row["phonetic"])) if row else ""
            pos = (clean(row["pos"]) or detect_pos(row["definition"]) or detect_pos(row["translation"]) or "n.") if row else "n."
            pos = ABBREV.get(pos.lower(), pos) if pos else "n."
            w["ipa"] = ("/" + ph + "/") if ph else ""
            w["pos"] = pos
            w["def"] = dzh
            w["defEn"] = den
            w["emoji"] = POS_EMOJI.get(pos, "📘")
            # ex / exzh / exEn left as-is (recognition scaffold)
            reex += 1
            continue
        if not ex:
            # content scaffold word (no example): re-extract clean first sense
            row = ec.get(key)
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
            pos = ABBREV.get(pos.lower(), pos) if pos else "n."
            w["ipa"] = ("/" + ph + "/") if ph else ""
            w["pos"] = pos
            w["def"] = zh_first(row["translation"]) or "（常用词）"
            w["defEn"] = en_first(row["definition"]) or "a common English word."
            w["emoji"] = POS_EMOJI.get(pos, "📘")
            # leave ex / exzh / exEn empty (recognition scaffold)
            reex += 1
        # else: taught word with a good def -> leave untouched

    summary.append((pack_id, len(words), ov, tf, reex, len(miss)))
    print("\n=== %s ===  entries=%d" % (pack_id, len(words)))
    print("  curated func: %d | taught-fix: %d | re-extracted content: %d | missing: %d"
          % (ov, tf, reex, len(miss)))
    if miss:
        print("  missing:", " ".join(miss[:40]), ("..." if len(miss) > 40 else ""))

    if APPLY:
        out = json.dumps(pack, ensure_ascii=False, indent=1)
        open(path, "w", encoding="utf-8").write(out)
        open(DIR + "/pwa/content/%s.json" % pack_id, "w", encoding="utf-8").write(out)

print("\n---------- SUMMARY ----------")
for pack_id, n, o, t, r, m in summary:
    print("  %-9s %4d entries | func %3d | taught %3d | reextract %3d | missing %3d"
          % (pack_id, n, o, t, r, m))
print("\nMODE:", "APPLIED" if APPLY else "DRY RUN (nothing written)")
