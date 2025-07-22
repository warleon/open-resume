import { db } from 'database/client';
import { job_title as job_titleTable, keywords as keywordsTable } from 'database/schemas';
import { NextRequest, NextResponse } from 'next/server';
import { Trie, Emit } from '@tanishiking/aho-corasick'
import { JOB_TITLE_TAG, KEYWORDS_TAG } from './constants';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

// Cached function to get all keywords and build AhoCorasick matcher
const getCachedKeywordMatcher =
  async () => {
    const allKeywords = await db.select().from(keywordsTable);
    const keywordStrings = allKeywords.map(k => k.keyword.toLowerCase());
    const ac = new Trie(keywordStrings);
    const extract = async (text: string) => {
      return new Promise((resolve) => {
        resolve(Array.from(new Set(ac.parseText(text.toLowerCase()).map(({ keyword }: Emit) => keyword))));
      });
    }
    return { extract, keywordsLength: keywordStrings.length };
  };
const getCachedJobTitleMatcher =
  async () => {
    const allJobTitles = await db.select().from(job_titleTable);
    const jobTitleStrings = allJobTitles.map(j => j.job_title.toLowerCase());
    const ac = new Trie(jobTitleStrings);
    const extract = async (text: string) => {
      return new Promise((resolve) => {
        resolve(Array.from(new Set(ac.parseText(text.toLowerCase()).map(({ keyword }: Emit) => keyword))));
      });
    }
    return { extract, jobTitlesLength: jobTitleStrings.length };
  }


// POST /api/keywords/extract - Extract keywords from text
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid text input' }, { status: 400 });
    }

    // Get the cached keyword matcher
    const { extract: keywordExtract, keywordsLength } = await getCachedKeywordMatcher();
    const { extract: jobTitleExtract, jobTitlesLength } = await getCachedJobTitleMatcher();

    if (keywordsLength === 0 && jobTitlesLength === 0) {
      return NextResponse.json({ keywords: [], matches: [] });
    }

    // Use AhoCorasick to find all keyword matches in the text
    const keywords = await keywordExtract(text);
    const jobTitles = await jobTitleExtract(text);

    return NextResponse.json({
      keywords,
      jobTitles,
    });
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return NextResponse.json({ error: 'Failed to extract keywords' }, { status: 500 });
  }
} 