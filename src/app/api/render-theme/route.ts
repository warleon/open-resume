import { NextRequest, NextResponse } from "next/server";
import { render } from "resumed";
import puppeteer from "puppeteer";
import { AVAILABLE_THEMES, JsonResumeTheme } from "./themes";

interface RenderRequest {
  resume: object; // JSON Resume format
  theme: JsonResumeTheme;
  format: "html" | "pdf";
}

export async function POST(request: NextRequest) {
  try {
    const { resume, theme, format }: RenderRequest = await request.json();

    if (!resume || !theme) {
      return NextResponse.json(
        { error: "Resume data and theme are required" },
        { status: 400 }
      );
    }

    if (!(theme in AVAILABLE_THEMES)) {
      return NextResponse.json(
        { error: `Theme "${theme}" not available. Available themes: ${Object.keys(AVAILABLE_THEMES).join(", ")}` },
        { status: 400 }
      );
    }

    const selectedTheme = AVAILABLE_THEMES[theme];

    // Render resume to HTML using the selected theme
    const html = await render(resume as any, selectedTheme as any);

    if (format === "html") {
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    if (format === "pdf") {
      let browser;
      try {
        // Launch puppeteer
        browser = await puppeteer.launch({
          headless: "new",
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        // Generate PDF
        const pdfBuffer = await page.pdf({
          printBackground: true,
          width: "210mm", // A4 width
          height: `${await page.evaluate(() => document.body.scrollHeight)}px`,
          preferCSSPageSize: true,
        });

        return new NextResponse(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${(resume as any).basics?.name || 'resume'}-${theme}.pdf"`,
          },
        });
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    }

    return NextResponse.json(
      { error: "Invalid format. Use 'html' or 'pdf'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error rendering theme:", error);
    return NextResponse.json(
      { error: "Failed to render theme" },
      { status: 500 }
    );
  }
}

// GET endpoint to list available themes
export async function GET() {
  try {
    const themes = Object.keys(AVAILABLE_THEMES).map(key => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
    }));

    return NextResponse.json({ themes });
  } catch (error) {
    console.error("Error getting themes:", error);
    return NextResponse.json(
      { error: "Failed to get available themes" },
      { status: 500 }
    );
  }
}