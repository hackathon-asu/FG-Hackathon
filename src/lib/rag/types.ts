export interface KnowledgeChunk {
  id: string;
  text: string;
  source: string;
  sourceUrl: string;
  category: string;
  title: string;
}

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
}
