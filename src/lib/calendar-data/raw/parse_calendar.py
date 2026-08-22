import json
import re
import sys
from datetime import date

from diacritics_fix import restore_diacritics_ro

MONTHS_RO = {
    "IANUARIE": 1, "FEBRUARIE": 2, "MARTIE": 3, "APRILIE": 4, "MAI": 5, "IUNIE": 6,
    "IULIE": 7, "AUGUST": 8, "SEPTEMBRIE": 9, "OCTOMBRIE": 10, "NOIEMBRIE": 11, "DECEMBRIE": 12,
}
MONTHS_EN = {
    "JANUARY": 1, "FEBRUARY": 2, "MARCH": 3, "APRIL": 4, "MAY": 5, "JUNE": 6,
    "JULY": 7, "AUGUST": 8, "SEPTEMBER": 9, "OCTOBER": 10, "NOVEMBER": 11, "DECEMBER": 12,
}

DAY_START_RO = re.compile(r"^(\d{1,2})\s+([A-ZĂÎÂȘȚ])\s+(.*)$")
DAY_START_EN = re.compile(r"^(\d{1,2})\s+([A-Z])\s+(.*)$")

SUNDAY_START_RO = re.compile(r"^Duminica\b")
SUNDAY_START_EN = re.compile(r"^(\d+(st|nd|rd|th)\s+Sunday|Sunday\b)")


def dedupe_consecutive(lines):
    out = []
    for line in lines:
        norm = re.sub(r"\s+", " ", line).strip()
        if out and re.sub(r"\s+", " ", out[-1]).strip() == norm:
            continue
        out.append(line)
    return out


def clean_text(s):
    s = re.sub(r"\s+", " ", s).strip()
    return s


def extract_trailing_notes(text):
    """Pull only TRAILING parenthetical group(s) out as notes (liturgical/service
    instructions always sit at the end of an entry in this source). Parens embedded
    mid-name (e.g. a saint's alternate name or epithet) are left untouched in place."""
    notes = []
    text = text.strip()
    while text.endswith(")"):
        depth = 0
        start = None
        for i in range(len(text) - 1, -1, -1):
            if text[i] == ")":
                depth += 1
            elif text[i] == "(":
                depth -= 1
                if depth == 0:
                    start = i
                    break
        if start is None:
            break
        inner = text[start + 1:-1]
        notes.insert(0, clean_text(inner))
        text = text[:start].strip()
        # keep peeling only if another trailing paren group immediately follows
        if not text.endswith(")"):
            break
    return clean_text(text), notes


def strip_bullet_daggers(text):
    """Remove decorative '†)' bullets and bare '†' emphasis marks used throughout
    entries to flag individually-noteworthy saints; carries no separate meaning
    once separated from the leading '(†)' major-feast marker."""
    text = text.replace("†)", "")
    text = text.replace("†", "")
    return clean_text(text)


def parse_month_blocks(raw_text, month_map, day_start_re, sunday_start_re):
    lines = [l for l in raw_text.split("\n")]
    blocks = []  # list of dicts: {month, entries: [{day, weekday_letter, lines:[]}], pending_sunday_lines}
    current_month = None
    current_entries = []
    pending_sunday_lines = []
    buf_lines = None  # lines for the entry currently being accumulated

    def flush_entry():
        nonlocal buf_lines
        if buf_lines is not None:
            current_entries.append(buf_lines)
            buf_lines = None

    for raw_line in lines:
        line = raw_line.rstrip()
        stripped = line.strip()
        if not stripped:
            continue
        upper = stripped.upper()
        if upper in month_map:
            flush_entry()
            if current_month is not None:
                blocks.append({"month": current_month, "entries": current_entries})
            current_month = month_map[upper]
            current_entries = []
            pending_sunday_lines = []
            continue

        m_day = day_start_re.match(stripped)
        if m_day:
            flush_entry()
            day_num = int(m_day.group(1))
            weekday_letter = m_day.group(2)
            rest = m_day.group(3)
            buf_lines = {
                "day": day_num,
                "weekday_letter": weekday_letter,
                "lines": [rest] if rest else [],
                "sunday_lines": pending_sunday_lines,
            }
            pending_sunday_lines = []
            continue

        if sunday_start_re.match(stripped):
            # Start of a Sunday liturgical block; belongs to the NEXT day entry.
            flush_entry()
            pending_sunday_lines = [stripped]
            continue

        if buf_lines is not None:
            buf_lines["lines"].append(stripped)
        elif pending_sunday_lines:
            pending_sunday_lines.append(stripped)
        # else: stray line before any day (e.g. page furniture) -> drop

    flush_entry()
    if current_month is not None:
        blocks.append({"month": current_month, "entries": current_entries})
    return blocks


def parse_sunday_block(text, lang):
    text = clean_text(text)
    if lang == "ro":
        tone_m = re.search(r"Glas\s*(\d+)", text)
        voscr_m = re.search(r"voscr\.?\s*(\d+)", text)
        ap_m = re.search(r"Ap\.?\s*([^;]+);", text)
        ev_m = re.search(r"Ev\.?\s*([^.;]+)", text)
        title_m = re.match(r"^(Duminica[^.]*?)\.?\s*Ap\.", text)
        title = clean_text(title_m.group(1)) if title_m else None
    else:
        tone_m = re.search(r"Tone\s*(\d+)", text)
        voscr_m = re.search(r"Mat\.?\s*Gos\.?\s*(\d+)", text)
        ap_m = re.search(r"Epis\.?\s*([^;]+);", text)
        ev_m = re.search(r"Gos\.?\s*([^.;]+)", text)
        title_m = re.match(r"^(.*?Sunday[^.]*?)\.?\s*Epis\.", text)
        title = clean_text(title_m.group(1)) if title_m else None

    return {
        "title": title,
        "tone": int(tone_m.group(1)) if tone_m else None,
        "matinsGospel": int(voscr_m.group(1)) if voscr_m else None,
        "epistle": clean_text(ap_m.group(1)) if ap_m else None,
        "gospel": clean_text(ev_m.group(1)) if ev_m else None,
        "raw": text,
    }


def build_days(blocks, lang, year):
    day_start_re = DAY_START_RO if lang == "ro" else DAY_START_EN
    days = []
    for block in blocks:
        month = block["month"]
        for entry in block["entries"]:
            day_num = entry["day"]
            iso = date(year, month, day_num).isoformat()
            lines = dedupe_consecutive(entry["lines"])
            full_text = clean_text(" ".join(lines))
            is_major_feast = full_text.startswith("(†)")
            work_text = full_text[3:].strip() if is_major_feast else full_text
            work_text, notes = extract_trailing_notes(work_text)
            main_text = strip_bullet_daggers(work_text)

            sunday = None
            if entry["sunday_lines"]:
                sunday_text = clean_text(" ".join(dedupe_consecutive(entry["sunday_lines"])))
                sunday = parse_sunday_block(sunday_text, lang)

            if lang == "ro":
                main_text = restore_diacritics_ro(main_text)
                notes = [restore_diacritics_ro(n) for n in notes]
                if sunday:
                    sunday["title"] = restore_diacritics_ro(sunday["title"]) if sunday["title"] else None
                    sunday["epistle"] = restore_diacritics_ro(sunday["epistle"]) if sunday["epistle"] else None
                    sunday["gospel"] = restore_diacritics_ro(sunday["gospel"]) if sunday["gospel"] else None
                    sunday["raw"] = restore_diacritics_ro(sunday["raw"])

            days.append({
                "date": iso,
                "weekdayLetterSource": entry["weekday_letter"],
                "weekdayActual": date(year, month, day_num).strftime("%A"),
                "isMajorFeast": is_major_feast,
                "commemorations": main_text,
                "notes": notes,
                "sunday": sunday,
            })
    return days


def main():
    year = 2026
    with open("src/lib/calendar-data/raw/2026-ro.txt", encoding="utf-8") as f:
        ro_raw = f.read()
    with open("src/lib/calendar-data/raw/2026-en.txt", encoding="utf-8") as f:
        en_raw = f.read()

    ro_blocks = parse_month_blocks(ro_raw, MONTHS_RO, DAY_START_RO, SUNDAY_START_RO)
    en_blocks = parse_month_blocks(en_raw, MONTHS_EN, DAY_START_EN, SUNDAY_START_EN)

    ro_days = build_days(ro_blocks, "ro", year)
    en_days = build_days(en_blocks, "en", year)

    with open("src/lib/calendar-data/raw/2026-ro.json", "w", encoding="utf-8") as f:
        json.dump(ro_days, f, ensure_ascii=False, indent=2)
    with open("src/lib/calendar-data/raw/2026-en.json", "w", encoding="utf-8") as f:
        json.dump(en_days, f, ensure_ascii=False, indent=2)

    print(f"RO days parsed: {len(ro_days)}")
    print(f"EN days parsed: {len(en_days)}")

    # Sanity check: 2026 has 365 days
    expected = (date(2026, 12, 31) - date(2026, 1, 1)).days + 1
    print(f"Expected days in 2026: {expected}")

    ro_dates = {d["date"] for d in ro_days}
    en_dates = {d["date"] for d in en_days}
    all_dates = {date(2026, 1, 1).fromordinal(o).isoformat() for o in range(date(2026, 1, 1).toordinal(), date(2026, 12, 31).toordinal() + 1)}
    print("Missing in RO:", sorted(all_dates - ro_dates))
    print("Missing in EN:", sorted(all_dates - en_dates))
    print("Extra in RO (dup):", len(ro_days) - len(ro_dates))
    print("Extra in EN (dup):", len(en_days) - len(en_dates))


if __name__ == "__main__":
    main()
