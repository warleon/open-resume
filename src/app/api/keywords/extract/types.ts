export type KeywordExtractionResult = {
    keywords: string[];
    jobTitles: string[];
    error?: string;
    method: "api" | "simple" | "error" | "no keywords configured" | "no keywords found";
}
