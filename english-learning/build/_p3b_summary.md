# P3-B Cross-Pack Polysemy Audit
Generated: 2026-09-06
## Stats
| Metric | Count ||---|---:|| Total unique lemmas | 4558 || Single-pack lemmas | 4151 || Multi-pack lemmas | 407 || Same def across packs | 28 || Subset def across packs | 247 || Different def (likely contextual) | 130 || **Suspicious (def-vs-ex / def-too-narrow)** | **2** |
## Top 20 most-shared lemmas (appear in ≥2 packs)
| lemma | packCount | packs ||---|---:|---|| patient | 3 | freq-1k, freq-2k, nce2 || exercise | 3 | freq-1k, freq-2k, nce2 || decision | 3 | freq-1k, freq-2k, nce2 || responsibility | 3 | freq-1k, freq-2k, nce3 || perspective | 3 | freq-2k, general, nce4 || wisdom | 3 | freq-3k, general, nce3 || skip | 3 | freq-3k, freq-4k, nce2 || area | 2 | freq-1k, nce2 || park | 2 | freq-1k, nce2 || business | 2 | freq-1k, nce2 || play | 2 | freq-1k, nce2 || important | 2 | freq-1k, nce2 || trip | 2 | freq-1k, freq-2k || village | 2 | freq-1k, freq-2k || rest | 2 | freq-1k, freq-2k || hospital | 2 | freq-1k, freq-2k || doctor | 2 | freq-1k, freq-2k || disease | 2 | freq-1k, freq-2k || drug | 2 | freq-1k, freq-2k || damage | 2 | freq-1k, freq-2k |
## Suspicious (top 30) — def too narrow OR ex-empty
### bear
- [freq-1k] def="熊" | defEn=massive plantigrade carnivorous or omnivorous mammals with l | ex="We saw a bear near the campsite."
- [nce2] def="忍受" | defEn=to tolerate; to put up with | ex="I can't bear the noise any longer."
  → reasons: freq-1k(def-too-narrow)
### piece
- [freq-1k] def="块" | defEn=a separate part of a whole | ex="Would you like a piece of cake?"
- [nce2] def="碎片；件" | defEn=a part broken off; an item | ex="The vase fell to pieces."
  → reasons: freq-1k(def-too-narrow)
