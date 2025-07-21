"use server";
import { db } from 'database/client';
import { job_title as job_titleTable } from 'database/schemas';
import { unstable_cache } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import AhoCorasick from 'ahocorasick';
import { JOB_TITLE_TAG, getCachedKeywordMatcher } from './constants';

export const getCachedJobTitleMatcher = unstable_cache(
  async () => {
    const allJobTitles = await db.select().from(job_titleTable);
    const jobTitleStrings = allJobTitles.map(j => j.job_title.toLowerCase());
    const ac = new AhoCorasick(jobTitleStrings);
    return { matcher: ac, jobTitles: jobTitleStrings };
  },
  ['job_title-matcher'],
  {
    tags: [JOB_TITLE_TAG],
    revalidate: 3600 * 24, // Cache for 1 day
  }
);

// POST /api/keywords/extract - Extract keywords from text
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid text input' }, { status: 400 });
    }

    // Get the cached keyword matcher
    const { matcher: keywordMatcher, keywords } = await getCachedKeywordMatcher();
    const { matcher: jobTitleMatcher, jobTitles } = await getCachedJobTitleMatcher();

    if (keywords.length === 0) {
      return NextResponse.json({ keywords: [], matches: [] });
    }

    // Use AhoCorasick to find all keyword matches in the text
    const results = keywordMatcher.search(text.toLowerCase());
    const jobTitleResults = jobTitleMatcher.search(text.toLowerCase());

    // Extract unique keywords found and their positions
    const foundKeywords = new Set<string>();
    const foundJobTitles = new Set<string>();
    results.forEach((result: any) => {
      const keyword = keywords[result[1][0]];
      foundKeywords.add(keyword);
    });
    jobTitleResults.forEach((result: any) => {
      const jobTitle = jobTitles[result[1][0]];
      foundJobTitles.add(jobTitle);
    });
    return NextResponse.json({
      keywords: Array.from(foundKeywords),
      jobTitles: Array.from(foundJobTitles),
    });
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return NextResponse.json({ error: 'Failed to extract keywords' }, { status: 500 });
  }
} 