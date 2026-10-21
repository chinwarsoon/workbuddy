# -*- coding: utf-8 -*-
"""
Build a unified "monthly submissions" dataset from:
  - TWRP C3B2 - Master Document List.xlsx   (forward plan: 7,410 documents)
  - TWRP C3B2 - Document Submittal Log.xlsx (actual submissions: 168 records)
Output: TWRP C3B2 - Monthly Submissions Dataset.xlsx
"""
import openpyxl, datetime, collections, os, re

ROOT = r"C:/Users/frank/WorkBuddy/workbuddy"
BASE = os.path.join(ROOT, "MDL")            # source workbooks (read-only, do not move)
MDL = os.path.join(BASE, "TWRP C3B2 - Master Document List.xlsx")
LOG = os.path.join(BASE, "TWRP C3B2 - Document Submittal Log.xlsx")
OUTDIR = os.path.join(ROOT, "sub")          # generated artefacts, sibling of MDL
OUT = os.path.join(OUTDIR, "TWRP C3B2 - Monthly Submissions Dataset.xlsx")

SHEETS = ["Project", "Construction", "QAQC", "ICA", "Process", "BS",
          "Mech", "Piping", "Electrical", "CSA", "BIM"]

DISC_MAP = {"Building Services": "BS", "Mechanical": "Mech", "ICA": "ICA",
            "Electrical": "Electrical", "Process": "Process", "CSA": "CSA",
            "Piping": "Piping", "BIM": "BIM"}

SUB_STATUS = {
    "SUR": "SUR - Under SO Review",
    "RTR": "RTR - Returned for Resubmission",
    "NTS": "NTS - No Resubmission Required",
}
APPR_STATUS = {
    "APP": "APP - Approved",
    "AWC": "AWC - Approved with Comments",
    "NAP": "NAP - Not Approved",
    "REJ": "REJ - Rejected",
    "INF": "INF - For Information",
}


def clean(v):
    if v is None:
        return None
    if isinstance(v, str):
        s = v.strip()
        if s == "" or s.startswith("#"):
            return None
        return s
    return v


def first_of_month(v):
    """Return datetime.date for the 1st day of v's month, or None."""
    if isinstance(v, datetime.datetime):
        return datetime.date(v.year, v.month, 1)
    if isinstance(v, datetime.date):
        return datetime.date(v.year, v.month, 1)
    return None


def as_date(v):
    if isinstance(v, datetime.datetime):
        return v.date()
    if isinstance(v, datetime.date):
        return v
    return None


# ------------------------------------------------------------------ 1. MDL
wb = openpyxl.load_workbook(MDL, read_only=True, data_only=True)
mdl = {}          # docno -> attributes   (for enriching submitted rows)
mdl_rows = []     # raw planned rows
dups = collections.Counter()

for sh in SHEETS:
    ws = wb[sh]
    for r in ws.iter_rows(min_row=2, values_only=True):
        sno, stage, disc = clean(r[0]), clean(r[1]), clean(r[2])
        if sno is None and stage is None:
            continue                      # group header row e.g. "STAGE 1 VENDOR APPROVAL"
        system = clean(r[5])
        prefix = clean(r[7])
        doctype = clean(r[8])
        docno = clean(r[12])
        title = clean(r[13])
        vendor = clean(r[17])
        planned = r[18]
        forecast = r[19]
        actual_issue = r[20]
        if docno is None and title is None:
            continue
        rec = dict(discipline=sh, stage=stage or "Unassigned", system=system,
                   prefix=prefix, doctype=doctype or "NA", docno=docno,
                   title=title, vendor=vendor,
                   planned=first_of_month(planned) or first_of_month(forecast),
                   planned_exact=as_date(planned),
                   forecast_exact=as_date(forecast),
                   issued=as_date(actual_issue))
        mdl_rows.append(rec)
        if docno:
            dups[docno] += 1
            mdl.setdefault(docno, rec)

print("MDL rows: %d | unique docno: %d" % (len(mdl_rows), len(mdl)))

# ------------------------------------------------------------ 2. Submittal Log
wb2 = openpyxl.load_workbook(LOG, read_only=True, data_only=True)
ws = wb2["SubmittalLog"]
log_rows = []
cur = None
GROUP = {"ICA", "Electrical", "Mechanical", "Building Services", "Process",
         "CSA", "Piping", "BIM", "Project", "Construction", "QAQC"}
for r in ws.iter_rows(min_row=2, values_only=True):
    sno = clean(r[0])
    subj = clean(r[3])
    if sno is None and subj in GROUP:
        cur = subj
        continue
    if sno is None:
        continue
    docno = clean(r[4])
    m = mdl.get(docno)
    # Discipline: the submittal log's own group header is authoritative.
    # (MDL Document No. is heavily duplicated - only 377 unique across 7,394
    #  rows - so joining on it would mis-assign disciplines.)
    disc = DISC_MAP.get(cur, cur)
    # Doc Type: parse from Document No.  <Project>-<Prefix>-<DocType>-<Disc>-<No>
    dt = None
    if docno:
        parts = str(docno).split("-")
        if len(parts) >= 4:
            dt = parts[2]
    if not dt:
        dt = (m["doctype"] if m else "NA")
    delay = clean(r[12])
    turn = clean(r[11])
    try:
        delay = float(delay) if delay is not None else None
    except (TypeError, ValueError):
        delay = None
    try:
        turn = float(turn) if turn is not None else None
    except (TypeError, ValueError):
        turn = None
    appr = clean(r[14])
    log_rows.append(dict(
        sno=sno, prolog=clean(r[1]), docno=docno, rev=clean(r[5]),
        by=clean(r[6]), sdate=as_date(r[7]),
        review_period=clean(r[8]), target=as_date(r[9]), aret=as_date(r[10]),
        turn=turn, delay=delay,
        sub_stat=clean(r[13]), appr=appr, resub=clean(r[15]),
        subject=clean(r[3]),
        month=first_of_month(r[7]),
        discipline=disc,
        stage=(m["stage"] if m else "Unassigned"),
        system=(m["system"] if m else None),
        prefix=(m["prefix"] if m else None),
        doctype=dt,
        title=(m["title"] if m else subj),
        vendor=(m["vendor"] if m else None),
        planned=(m["planned"] if m else None),
    ))

print("Log rows: %d | joined to MDL: %d" % (
    len(log_rows), sum(1 for x in log_rows if x["docno"] in mdl)))

# ------------------------------------------------------------ 3. Unified table
COLS = ["Record Type", "Month", "Discipline", "Stage", "Doc Type", "System",
        "Project Prefix", "Vendor Data", "Document No.", "Document Title",
        "Submission Date", "Target Return Date", "Actual Return Date",
        "Submitted By", "Revision", "Review Period Days",
        "Review Turnaround Days", "Review Delay Days",
        "Submission Status", "Approval Status", "Resubmission Required",
        "Timeliness", "Prolog No.", "Count Submitted", "Count Planned",
        "Flag Approved", "Flag On Time", "Flag Delayed", "Flag Resubmission"]

rows = []

# --- actual submissions
for x in log_rows:
    appr = x["appr"]
    appr_lbl = APPR_STATUS.get(appr, "Pending Review" if appr is None else appr)
    if x["delay"] is None:
        time_lbl, f_ot, f_dl = None, None, None
    elif x["delay"] > 0:
        time_lbl, f_ot, f_dl = "Delayed", 0, 1
    else:
        time_lbl, f_ot, f_dl = "On Time", 1, 0
    if appr in ("APP", "AWC"):
        f_ap = 1
    elif appr in ("NAP", "REJ"):
        f_ap = 0
    else:
        f_ap = None
    f_rs = 1 if x["resub"] == "YES" else (0 if x["resub"] == "NO" else None)
    rows.append([
        "Submitted", x["month"], x["discipline"], x["stage"], x["doctype"],
        x["system"], x["prefix"], x["vendor"], x["docno"], x["title"],
        x["sdate"], x["target"], x["aret"], x["by"], x["rev"],
        x["review_period"], x["turn"], x["delay"],
        SUB_STATUS.get(x["sub_stat"], x["sub_stat"] or "Unknown"),
        appr_lbl, x["resub"] or "Pending", time_lbl, x["prolog"],
        1, 0, f_ap, f_ot, f_dl, f_rs,
    ])

# --- forward plan (MDL)
for m in mdl_rows:
    rows.append([
        "Planned", m["planned"], m["discipline"], m["stage"], m["doctype"],
        m["system"], m["prefix"], m["vendor"], m["docno"], m["title"],
        None, None, None, None, None, None, None, None,
        "Not Yet Submitted", "Not Yet Submitted", None, None, None,
        0, 1, None, None, None, None,
    ])

# ------------------------------------------------------------ 4. Write output
wbo = openpyxl.Workbook()
wso = wbo.active
wso.title = "MonthlySubmissions"
wso.append(COLS)
for r in rows:
    wso.append(r)
for c in range(1, len(COLS) + 1):
    wso.cell(row=1, column=c).font = openpyxl.styles.Font(bold=True)
wbo.save(OUT)

print("Wrote %s : %d data rows" % (OUT, len(rows)))
print("  Submitted:", sum(1 for r in rows if r[0] == "Submitted"))
print("  Planned  :", sum(1 for r in rows if r[0] == "Planned"))
