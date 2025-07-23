import { env } from "@lib/env";
import { htmlToText } from "html-to-text";
import { KeywordExtractionResult } from "@api/keywords/extract/types";


export interface APIKeywordResponse {
    keywords: string[];
    jobTitles: string[];
}

// API-based keyword extraction function
async function extractKeywordsFromAPI(
    text: string
): Promise<KeywordExtractionResult> {
    try {
        const apiBaseUrl = env.PUBLIC_URL;
        console.error("Using API endpoint:", apiBaseUrl);

        const response = await fetch(`${apiBaseUrl}/api/keywords/extract`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const newError = new Error(`API request failed: ${response.status} ${response.statusText}`);
            console.error(newError);
            throw newError;
        }

        const data = await response.json();
        console.error("API response:", data);
        return data;

    } catch (error) {
        const newError = new Error(`Error calling keyword extraction API: ${JSON.stringify(error)}`);
        throw newError;
    }
}

// Simple keyword extraction function (fallback without external dependencies)
function extractKeywordsSimple(text: string): string[] {
    // Convert to lowercase and split into words
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ") // Remove punctuation
        .split(/\s+/)
        .filter((word) => word.length >= 3); // Only words 3+ characters

    // Common words to filter out
    const commonWords = new Set([
        "the",
        "and",
        "for",
        "are",
        "but",
        "not",
        "you",
        "all",
        "any",
        "can",
        "had",
        "her",
        "was",
        "one",
        "our",
        "out",
        "day",
        "get",
        "has",
        "him",
        "his",
        "how",
        "its",
        "may",
        "new",
        "now",
        "old",
        "see",
        "two",
        "who",
        "boy",
        "did",
        "she",
        "use",
        "way",
        "many",
        "will",
        "would",
        "could",
        "should",
        "might",
        "must",
        "shall",
        "about",
        "after",
        "before",
        "during",
        "while",
        "when",
        "where",
        "why",
        "what",
        "which",
        "this",
        "that",
        "these",
        "those",
        "with",
        "without",
        "within",
        "through",
        "between",
        "among",
        "above",
        "below",
        "under",
        "linkedin",
        "jobs",
        "job",
        "career",
        "careers",
        "apply",
        "application",
        "view",
        "show",
        "more",
        "less",
        "click",
        "here",
        "link",
        "page",
        "site",
        "website",
    ]);

    // Count word frequencies
    const wordCount = new Map<string, number>();
    words.forEach((word) => {
        if (!commonWords.has(word) && !/^\d+$/.test(word)) {
            wordCount.set(word, (wordCount.get(word) || 0) + 1);
        }
    });

    // Sort by frequency and return keywords
    return Array.from(wordCount.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([word]) => word);
}

class KeywordExtractor {
    constructor() {
        console.error("KeywordExtractor initialized");
    }

    // Advanced keyword extraction
    public async extractKeywords(url?: string): Promise<{ result: KeywordExtractionResult, textContent: string }> {
        console.error(
            "Starting keyword extraction for URL:",
            url || window.location.href
        );

        let result: KeywordExtractionResult = {
            keywords: [],
            jobTitles: [],
            method: "api"
        };
        let textContent = "";

        try {
            console.error("Attempting to extract HTML content from:", url);
            let htmlContent = "";

            // Detect if this is a LinkedIn job posting
            const isLinkedInJob =
                window.location.href.indexOf("linkedin.com") !== -1 &&
                window.location.href.indexOf("/jobs/") !== -1;

            // Method 1: Extract from current page DOM
            htmlContent = document.documentElement.outerHTML;

            console.error(
                `📊 HTML extraction successful. Content length: ${htmlContent.length} characters`
            );

            try {

                console.error("isLinkedInJob:", isLinkedInJob);
                if (isLinkedInJob) {
                    console.error("Extracting LinkedIn job description...");
                    textContent = htmlToText(htmlContent/*, {
                        selectors: [
                            ".jobs-description__content",
                            ".jobs-description-content",
                            ".jobs-description-content__text",
                            ".jobs-box__html-content",
                            ".jobs-description__container",
                            ".jobs-description",
                            //"not(#popup-root)"
                        ].map((selector) => ({
                            selector,
                        })),
                    }*/);
                } else {
                    console.error("Extracting non-LinkedIn job description...");
                    textContent = htmlToText(htmlContent/*, {
                        selectors: [
                            "body",
                            //"not(#popup-root)"
                        ].map((selector) => ({
                            selector,
                        })),
                    }*/);
                }
                console.error("successfully extracted textContent, length: ", textContent.length);
            } catch (error) {
                const newError = new Error(`Error extracting textContent: ${JSON.stringify(error)}`);
                throw newError;
            }

            // Try API-based extraction first, fallback to simple extraction
            try {
                console.error("Attempting API-based keyword extraction...");
                result = await extractKeywordsFromAPI(textContent);
                if (result.error) {
                    throw new Error(result.error);
                }
            } catch (apiError) {
                result.error = `API extraction failed, falling back to simple extraction: ${JSON.stringify(apiError)}`;
                console.error(result.error);

                const keywords = extractKeywordsSimple(textContent);
                result.keywords = keywords;
                result.jobTitles = [];
                result.method = "simple";
            }
        } catch (error) {
            result.keywords = [];
            result.jobTitles = [];
            result.method = "error";
            result.error = `Error extracting keywords: ${JSON.stringify(error)}`;
            console.error(result.error);
        }

        return { result, textContent: textContent.trim() };
    }

    // Check if current page is a job posting
    public hasJobContent(): boolean {
        const jobIndicators = [
            "job description",
            "responsibilities",
            "requirements",
            "qualifications",
            "apply now",
            "job opening",
            "position",
            "salary",
            "benefits",
            "job posting",
        ];

        const pageText = document.body.innerText.toLowerCase();
        const pageUrl = window.location.href.toLowerCase();

        // Check for job sites in URL
        const jobSites = [
            "linkedin.com/jobs",
            "indeed.com",
            "glassdoor.com",
            "monster.com",
            "ziprecruiter.com",
            "careerbuilder.com",
            "jobs.",
            "careers.",
            "/jobs/",
            "/careers/",
        ];

        const isJobSite = jobSites.some((site) => pageUrl.indexOf(site) !== -1);
        const hasJobKeywords = jobIndicators.some(
            (indicator) => pageText.indexOf(indicator) !== -1
        );

        const hasJob = isJobSite || hasJobKeywords;
        console.error(
            "Job content detection - isJobSite:",
            isJobSite,
            "hasJobKeywords:",
            hasJobKeywords,
            "result:",
            hasJob
        );

        return hasJob;
    }
}

export const extractor = new KeywordExtractor();