import { NextRequest, NextResponse } from 'next/server';
import { db } from "@database/client"
import { keywords as keywordsTable } from "database/schemas/keywords"
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { KEYWORDS_TAG } from './extract/route';



/* ENDPOINTS REMOVED TO AVOID MALICIOUS USE */
// POST /api/keywords - Add a new keyword
//export async function POST(request: NextRequest) {
//  try {
//    const { keywords: keyword } = await request.json();
//    
//    if (!keyword || typeof keyword !== 'string') {
//      return NextResponse.json({ error: 'Invalid keyword' }, { status: 400 });
//    }
//
//    const result = await db.insert(keywordsTable).values({ keyword: keyword }).returning();
//    
//    // Revalidate the keyword matcher cache
//    revalidateTag(KEYWORDS_TAG);
//    
//    return NextResponse.json(result[0], { status: 201 });
//  } catch (error) {
//    console.error('Error adding keyword:', error);
//    return NextResponse.json({ error: 'Failed to add keyword' }, { status: 500 });
//  }
//}
//
//// DELETE /api/keywords?keyword=... - Delete a keyword
//export async function DELETE(request: NextRequest) {
//  try {
//    const { searchParams } = new URL(request.url);
//    const keyword = searchParams.get('keyword');
//    
//    if (!keyword) {
//      return NextResponse.json({ error: 'Keyword parameter required' }, { status: 400 });
//    }
//
//    await db.delete(keywordsTable).where(eq(keywordsTable.keyword, keyword));
//    
//    // Revalidate the keyword matcher cache
//    revalidateTag(KEYWORDS_TAG);
//    
//    return NextResponse.json({ success: true });
//  } catch (error) {
//    console.error('Error deleting keyword:', error);
//    return NextResponse.json({ error: 'Failed to delete keyword' }, { status: 500 });
//  }
//} 