import { env } from "@lib/env";
import { htmlToText } from "html-to-text";

export interface KeywordExtractionResult {
    extractedText: string;
    extractedKeywords: string[];
    extractionMethod: string;
    success: boolean;
    error?: string;
}

export interface APIKeywordResponse {
    keywords: string[];
    jobTitles: string[];
}

// API-based keyword extraction function
async function extractKeywordsFromAPI(
    text: string
): Promise<{ keywords: string[]; jobTitles: string[] }> {
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
            throw new Error(
                `API request failed: ${response.status} ${response.statusText}`
            );
        }

        const data: APIKeywordResponse = await response.json();
        return {
            keywords: data.keywords || [],
            jobTitles: data.jobTitles || [],
        };
    } catch (error) {
        console.error("Error calling keyword extraction API:", error);
        throw error;
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
    public async extractKeywords(url?: string): Promise<KeywordExtractionResult> {
        console.error(
            "Starting keyword extraction for URL:",
            url || window.location.href
        );

        const result: KeywordExtractionResult = {
            extractedText: "",
            extractedKeywords: [],
            extractionMethod: "",
            success: false,
        };

        try {
            let htmlContent = "";
            let extractionMethod = "";

            // Detect if this is a LinkedIn job posting
            const isLinkedInJob =
                window.location.href.indexOf("linkedin.com") !== -1 &&
                window.location.href.indexOf("/jobs/") !== -1;

            // Method 1: Extract from current page DOM
            htmlContent = document.documentElement.outerHTML;
            extractionMethod = "direct-dom";

            console.error(
                `📊 Extraction successful via ${extractionMethod}. Content length: ${htmlContent.length} characters`
            );

            let textContent = "";

            if (isLinkedInJob) {
                // For LinkedIn, try to extract job description specifically
                const jobDescSelectors = [
                    ".jobs-description__content",
                    ".jobs-description-content",
                    ".jobs-description-content__text",
                    ".jobs-box__html-content",
                    ".jobs-description__container",
                    ".jobs-description",
                ];

                textContent = htmlToText(htmlContent, {
                    selectors: jobDescSelectors.map((selector) => ({
                        selector,
                    })),
                });
            } else {
                textContent = htmlToText(htmlContent);
            }
            result.extractedText = textContent;

            // Try API-based extraction first, fallback to simple extraction
            try {
                console.error("Attempting API-based keyword extraction...");
                const apiResult = await extractKeywordsFromAPI(textContent);

                // Combine keywords and job titles
                const allKeywords = [...apiResult.keywords, ...apiResult.jobTitles]; // TODO: display as different sets for better UX

                result.extractedKeywords = allKeywords;
                result.extractionMethod = "api-based";
                result.success = true;

                console.error(
                    "🎯 API-based keywords extracted successfully:",
                    allKeywords.length,
                    "keywords found"
                );
                console.error("Keywords:", apiResult.keywords);
                console.error("Job Titles:", apiResult.jobTitles);
            } catch (apiError) {
                console.warn(
                    "API extraction failed, falling back to simple extraction:",
                    apiError
                );

                // Fallback to simple extraction
                const keywords = extractKeywordsSimple(textContent);
                result.extractedKeywords = keywords;
                result.extractionMethod = "simple-fallback";
                result.success = true;

                console.error(
                    "🎯 Fallback keywords extracted successfully:",
                    keywords.length,
                    "keywords found"
                );
            }
        } catch (error) {
            console.error(
                "Error extracting keywords:",
                error instanceof Error ? error.message : String(error)
            );
            result.error =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred during keyword extraction";
        }

        return result;
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