"use client";
import { useState } from "react";

export default function JobHunt() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const extensionUrl = "https://github.com/xitanggg/open-resume/tree/main/extension";
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="text-4xl">🚀</div>
            <h1 className="text-4xl font-bold text-gray-900">
              OpenResume Browser Extension
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhanced job analysis and keyword extraction directly in your browser. 
            Works seamlessly with LinkedIn, Indeed, and any job posting site.
          </p>
        </div>

        {/* Main CTA */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Ready to supercharge your job hunt?
            </h2>
            <p className="text-gray-600">
              Install the extension to get AI-powered keyword extraction and resume optimization
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={extensionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <span>📥</span>
              Download Extension
            </a>
            <button
              onClick={() => copyToClipboard(extensionUrl, "Extension URL")}
              className="inline-flex items-center justify-center gap-3 bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors"
            >
              <span>📋</span>
              {copiedText === "Extension URL" ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎯</span>
              <h3 className="text-xl font-semibold text-gray-900">Smart Keyword Extraction</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Automatically identify and extract key skills, technologies, and requirements from any job posting.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Works on any job site (LinkedIn, Indeed, company sites)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>No CORS or iframe limitations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Instant keyword copying to clipboard</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-xl font-semibold text-gray-900">AI-Powered Analysis</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Generate enhanced ChatGPT prompts with extracted job content for deep analysis and optimization tips.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Auto-generated prompts with job content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Smart ChatGPT tab management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>One-click copy and navigate workflow</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚡</span>
              <h3 className="text-xl font-semibold text-gray-900">Seamless Integration</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Works directly in your browser as you browse job postings. No need to copy URLs or switch tabs.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Direct page content access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Auto-detection of job postings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Lightweight and fast</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔒</span>
              <h3 className="text-xl font-semibold text-gray-900">Privacy Focused</h3>
            </div>
            <p className="text-gray-600 mb-4">
              All processing happens locally in your browser. Your job search data stays private and secure.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>No data sent to external servers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Open source and transparent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Minimal permissions required</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Install Extension</h3>
              <p className="text-sm text-gray-600">Download and install the OpenResume browser extension</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Browse Jobs</h3>
              <p className="text-sm text-gray-600">Navigate to any job posting on LinkedIn, Indeed, or company sites</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Extract Keywords</h3>
              <p className="text-sm text-gray-600">Click the extension icon and extract keywords instantly</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 text-orange-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Optimize Resume</h3>
              <p className="text-sm text-gray-600">Use extracted keywords and AI analysis to improve your resume</p>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Installation Instructions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Download the Extension</p>
                <p className="text-sm text-gray-600">Visit the GitHub repository and follow the installation guide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Enable Developer Mode</p>
                <p className="text-sm text-gray-600">Open Chrome Extensions page and enable "Developer mode"</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Load Extension</p>
                <p className="text-sm text-gray-600">Click "Load unpacked" and select the extension folder</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                4
              </div>
              <div>
                <p className="font-medium text-gray-900">Start Using</p>
                <p className="text-sm text-gray-600">Navigate to any job posting and click the extension icon</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <a
              href={extensionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              📖 View Detailed Installation Guide
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 