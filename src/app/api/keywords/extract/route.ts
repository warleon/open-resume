import { db } from 'database/client';
import { job_title as job_titleTable, keywords as keywordsTable } from 'database/schemas';
import { NextRequest, NextResponse } from 'next/server';
import { Trie, Emit } from '@tanishiking/aho-corasick'
import { KeywordExtractionResult } from './types';

// Cached function to get all keywords and build AhoCorasick matcher
const getKeywordMatcher =
  async () => {
    const allKeywords = await db.select().from(keywordsTable);
    const keywordStrings = allKeywords.map(k => k.keyword.toLowerCase());
    const ac = new Trie(keywordStrings, { allowOverlaps: false, onlyWholeWords: true });
    console.log("keywords configured: ", keywordStrings.length);
    const extract = (text: string) => {
      return Array.from(new Set(ac.parseText(text.toLowerCase()).map(({ keyword }: Emit) => keyword)));
    }
    return { extract, keywordsLength: keywordStrings.length };
  };
const getJobTitleMatcher =
  async () => {
    const allJobTitles = await db.select().from(job_titleTable);
    const jobTitleStrings = allJobTitles.map(j => j.job_title.toLowerCase());
    const ac = new Trie(jobTitleStrings, { allowOverlaps: false, onlyWholeWords: true });
    console.log("job titles configured: ", jobTitleStrings.length);
    const extract = (text: string) => {
      return Array.from(new Set(ac.parseText(text.toLowerCase()).map(({ keyword }: Emit) => keyword)));
    }
    return { extract, jobTitlesLength: jobTitleStrings.length };
  }


// POST /api/keywords/extract - Extract keywords from text
export async function POST(request: NextRequest): Promise<NextResponse<KeywordExtractionResult>> {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      console.error("Invalid text input");
      return NextResponse.json<KeywordExtractionResult>({ keywords: [], jobTitles: [], error: 'Invalid text input', method: "error" }, { status: 400 });
    }

    // Get the cached keyword matcher
    const { extract: keywordExtract, keywordsLength } = await getKeywordMatcher();
    const { extract: jobTitleExtract, jobTitlesLength } = await getJobTitleMatcher();

    if (keywordsLength === 0 && jobTitlesLength === 0) {
      console.error("No keywords or job titles configured");
      return NextResponse.json<KeywordExtractionResult>({ keywords: [], jobTitles: [], method: "no keywords configured" });
    }

    // Use AhoCorasick to find all keyword matches in the text
    const keywords = keywordExtract(text);
    const jobTitles = jobTitleExtract(text);
    console.log("keywords found: ", keywords.length);
    console.log("job titles found: ", jobTitles.length);
    if (keywords.length === 0 && jobTitles.length === 0) {
      console.error("No keywords or job titles found");
      return NextResponse.json<KeywordExtractionResult>({ keywords: [], jobTitles: [], method: "no keywords found" });
    }

    return NextResponse.json<KeywordExtractionResult>({
      keywords,
      jobTitles,
      method: "api"
    });
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return NextResponse.json<KeywordExtractionResult>({ keywords: [], jobTitles: [], error: `Error extracting keywords: ${JSON.stringify(error)}`, method: "error" }, { status: 500 });
  }
} 