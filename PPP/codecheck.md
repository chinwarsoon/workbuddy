# Procurement Dashboard Audit: Findings & Recommended Fixes

## Overview
This document summarizes the bugs, logic flaws, and usability issues identified during a comprehensive code audit of `Procurement-Dashboard.html`, alongside practical recommendations to resolve them.

---

## 1. Critical Syntax & Logic Bugs

### Invalid RegEx for CSV Parsing
* **Issue:** `parseCSV()` uses `line.split(/(?<!"),(?=")|,(?=\d|\w)/)`, which breaks or truncates fields when double quotes, escaped commas, or line breaks exist inside cell values.
* **Impact:** Corrupts parsed CSV data during import.
* **Recommendation:** Replace the regular expression split with a standard RFC 4180-compliant CSV parser or a proper state-machine string parser.

### Criticality View Renders Empty (Type Mismatch)
* **Issue:** Strict comparison `String(p.criticality) === k` in `critItems()` fails when raw Excel input imports criticality values as numbers (`0`, `1`, `2`) while filter keys are strings, or vice versa.
* **Impact:** The Criticality View displays no records or incorrect groupings.
* **Recommendation:** Normalize criticality values during data ingestion using explicit coercion (e.g., `String(p.criticality).trim()`).

### Unsafe Inline SVG Scaling in PNG Conversion
* **Issue:** `chartToPng()` reads `svgEl.width.baseVal.value`, which evaluates to `0` in WebKit/Safari when SVG dimensions are set using CSS percentages or relative units (`width: 100%`).
* **Impact:** Exporting charts to PNG produces a broken `0x0` pixel image.
* **Recommendation:** Use `getBoundingClientRect()` to compute explicit render dimensions before drawing to the canvas context.

---

## 2. Validation & Data Mapping Issues

### Fragile Row Index Calculations
* **Issue:** `parseCodeSheet()` and `validate()` perform zero-index conversions (e.g., `(Number(codeMeta['Header Row']) || 1) - 1`) assuming fixed sheet offsets.
* **Impact:** Empty preceding rows inside Excel `<sheetData>` cause row offsets, resulting in misaligned header and data mappings.
* **Recommendation:** Dynamically search for the first non-empty row to establish the header index rather than relying on fixed numeric subtractions.

### Duplicate Identifier False Positives
* **Issue:** Duplicate package checks (`noCount[p.packageNo]`) perform direct string matches without trimming surrounding whitespace.
* **Impact:** Entries like `" PKG-01 "` and `"PKG-01"` are treated as distinct packages, bypassing validation.
* **Recommendation:** Normalize string keys before validation using `.trim().toLowerCase()`.

---

## 3. UI, UX & Accessibility Issues

### Category Filter Dropdown Truncation
* **Issue:** `.tf-panel` applies `max-height: 320px` without adjusting container `min-width` or dynamic text clipping.
* **Impact:** Longer category names are cut off on small screens or high-DPI displays.
* **Recommendation:** Add `min-width: fit-content` and set text overflow handling (`text-overflow: ellipsis`) with tooltips for long names.

### Missing Keyboard Accessibility
* **Issue:** The file drop zone (`#drop`) uses `role="presentation"` and lacks keyboard event handlers.
* **Impact:** Users relying on screen readers or keyboard navigation cannot interact with the upload area.
* **Recommendation:** Add `tabindex="0"` and an `onkeydown` listener targeting `Enter` and `Space` keys to trigger file selection.

---

## Recommended Code Fixes

### SVG to PNG Conversion (`chartToPng`)
```javascript
async function chartToPng(svgEl) {
  const xml = new XMLSerializer().serializeToString(svgEl);
  const svg64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 2; // Output scale factor for higher DPI
      const rect = svgEl.getBoundingClientRect();
      const w = rect.width || 760;
      const h = rect.height || 280;

      const canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(blob => {
        blob ? resolve(blob) : reject(new Error('Canvas export failed'));
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Failed to render SVG image'));
    img.src = svg64;
  });
}