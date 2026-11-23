/**
 * @maataa/ui/ai/docsSearch
 * Keyword search (BM25) over a set of documents, to give a local model the
 * few passages it needs to answer a question about them. Runs in the browser
 * or Node with no index server and no embeddings model.
 */

export interface DocChunk {
  id: string;
  /** Short heading, e.g. "DatePicker" or "Themes › Let people choose". */
  title: string;
  text: string;
  /** Where it came from, e.g. "forms/DatePicker.tsx". */
  source?: string;
  href?: string;
}

export interface DocHit {
  chunk: DocChunk;
  score: number;
}

const STOP = new Set(
  "a an and are as at be by can do does for from how i in is it of on or the this to use what when where which who why with you your".split(
    " "
  )
);

/** Words in `text`, lower-cased; "DatePicker" also yields "date" and "picker". */
export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const word of text.match(/[\p{L}\p{N}]+/gu) ?? []) {
    const lower = word.toLowerCase();
    if (!STOP.has(lower)) out.push(lower);
    const parts = word.split(/(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/);
    if (parts.length > 1) {
      for (const part of parts) {
        const p = part.toLowerCase();
        if (p.length > 1 && !STOP.has(p)) out.push(p);
      }
    }
  }
  return out;
}

/**
 * Builds a search function over `chunks`. Titles count three times as much as
 * body text, so a question naming a component finds that component first.
 */
export function createKeywordRetriever(chunks: readonly DocChunk[]) {
  const k1 = 1.2;
  const b = 0.75;
  const docs = chunks.map((chunk) => {
    const terms = [...tokenize(chunk.title), ...tokenize(chunk.title), ...tokenize(chunk.title)];
    terms.push(...tokenize(chunk.text));
    const tf = new Map<string, number>();
    for (const term of terms) tf.set(term, (tf.get(term) ?? 0) + 1);
    return { chunk, tf, length: terms.length };
  });
  const avg = docs.reduce((sum, d) => sum + d.length, 0) / Math.max(docs.length, 1);
  const df = new Map<string, number>();
  for (const d of docs) for (const term of d.tf.keys()) df.set(term, (df.get(term) ?? 0) + 1);
  const idf = (term: string) => {
    const n = df.get(term) ?? 0;
    return Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
  };

  return function search(query: string, limit = 5): DocHit[] {
    const terms = [...new Set(tokenize(query))];
    if (!terms.length) return [];
    return docs
      .map((d) => {
        let score = 0;
        for (const term of terms) {
          const f = d.tf.get(term);
          if (!f) continue;
          score += (idf(term) * (f * (k1 + 1))) / (f + k1 * (1 - b + (b * d.length) / avg));
        }
        return { chunk: d.chunk, score };
      })
      .filter((hit) => hit.score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, limit);
  };
}

/** The passages as numbered context for a prompt, cut to about `maxChars`. */
export function formatContext(hits: readonly DocHit[], maxChars = 6000): string {
  let used = 0;
  const parts: string[] = [];
  hits.forEach((hit, i) => {
    const header = `[${i + 1}] ${hit.chunk.title}${hit.chunk.source ? ` (${hit.chunk.source})` : ""}`;
    const room = maxChars - used - header.length - 2;
    if (room < 200) return;
    const body =
      hit.chunk.text.length > room ? hit.chunk.text.slice(0, room) + "…" : hit.chunk.text;
    parts.push(`${header}\n${body}`);
    used += header.length + body.length + 2;
  });
  return parts.join("\n\n");
}
