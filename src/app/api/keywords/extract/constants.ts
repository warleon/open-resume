import { keywords as keywordsTable } from 'database/schemas';
import { unstable_cache } from 'next/cache';
import { db } from "database/client";
import AhoCorasick from 'ahocorasick';

export const KEYWORDS_TAG = 'keywords';
export const JOB_TITLE_TAG = 'job_title';

// Cached function to get all keywords and build AhoCorasick matcher
export const getCachedKeywordMatcher = unstable_cache(
    async () => {
        const allKeywords = await db.select().from(keywordsTable);
        const keywordStrings = allKeywords.map(k => k.keyword.toLowerCase());

        const ac = new AhoCorasick(keywordStrings);
        return { matcher: ac, keywords: keywordStrings };
    },
    ['keyword-matcher'],
    {
        tags: [KEYWORDS_TAG],
        revalidate: 3600 * 24, // Cache for 1 day
    }
);
