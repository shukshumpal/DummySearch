export interface searchResponse {
  cachedPageUrl: string;
  dateLastCrawled: Date;
  displayUrl: string;
  id: string;
  isFamilyFriendly: boolean;
  isNavigational: boolean;
  language: string;
  name: string;
  snippet: string;
  url: string;
}

export interface webPages {
  totalEstimatedMatches: number;
  value: searchResponse[];
}
