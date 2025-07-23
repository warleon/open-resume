import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import { extractKeywords } from "@utils/keywordExtractor";
import { KeywordExtractionResult } from "@api/keywords/extract/types";

interface PopupProps {}

const Popup: React.FC<PopupProps> = () => {
  const [currentTab, setCurrentTab] = React.useState<chrome.tabs.Tab | null>(
    null
  );
  const [currentTabHtml, setCurrentTabHtml] = React.useState<string | null>(
    null
  );
  const [isExtractingKeywords, setIsExtractingKeywords] = React.useState(false);
  const [keywordResults, setKeywordResults] =
    React.useState<KeywordExtractionResult | null>(null);
  const [extractedText, setExtractedText] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.error("in useEffect, tabs: ", tabs);
      if (tabs[0]) {
        const activeTabId = tabs[0].id;
        setCurrentTab(tabs[0]);
        if (activeTabId) {
          chrome.scripting
            .executeScript({
              target: { tabId: activeTabId },
              // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
              func: DOMtoString,
              args: ["body"], // you can use this to target what element to get the html for
            })
            .then((results) => {
              console.error(
                "in useEffect, results of HTML extraction: ",
                results
              );
              setCurrentTabHtml(results[0].result!);
            });
        }
      }
    });
  }, []);

  const AIPrompt = useMemo(() => {
    console.error("in AIPrompt, extractedText length: ", extractedText?.length);
    console.error("in AIPrompt, extractedText: ", extractedText);
    if (extractedText && extractedText.length > 0) {
      return `Please analyze the following job posting text and extract the key requirements, skills, technologies, and qualifications mentioned. Provide a summary of:

1. Required technical skills
2. Required soft skills  
3. Experience level needed
4. Key responsibilities
5. Company culture indicators
6. Education requirements
7. Keywords for resume optimization

Please provide the final result as a comma-separated list of keywords ready to be copied.

Job Posting Content:
${extractedText}`;
    }
    // Fallback to URL if no extracted text available
    return `Please analyze the job posting from this URL: ${currentTab?.url}. Extract the key requirements, skills, technologies, and qualifications mentioned. Provide a summary of:

1. Required technical skills
2. Required soft skills  
3. Experience level needed
4. Key responsibilities
5. Company culture indicators
6. Education requirements
7. Keywords for resume optimization

Please provide the final result as a comma-separated list of keywords ready to be copied.`;
  }, [extractedText, currentTab?.url]);

  const copyPromptOnly = async () => {
    try {
      const prompt = AIPrompt;
      await navigator.clipboard.writeText(prompt);

      // Show temporary success feedback
      setError("✅ Prompt copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy prompt:", error);
      setError("❌ Failed to copy prompt to clipboard");
    } finally {
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleExtractKeywords = async () => {
    if (!currentTab?.url || !currentTabHtml) return;

    setIsExtractingKeywords(true);
    setKeywordResults(null);
    setError(null);

    try {
      const { result, textContent } = await extractKeywords(
        currentTab.url,
        currentTabHtml
      );
      setKeywordResults(result);
      console.error("textContent length: ", textContent.length);
      setExtractedText(textContent);
      if (result.error) {
        console.error(result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      setError("❌ Failed to extract keywords from this page");
    } finally {
      setIsExtractingKeywords(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const copyKeywords = () => {
    if (keywordResults && keywordResults.keywords.length > 0) {
      navigator.clipboard.writeText(keywordResults.keywords.join(", "));
      setError("✅ Keywords copied to clipboard!");
      setTimeout(() => setError(null), 3000);
    }
  };

  const openOptions = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("options.html"),
    });
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="popup-title">OpenResume</h1>
            <p className="popup-subtitle">Resume Builder Extension</p>
          </div>
          <button
            className="settings-button"
            onClick={openOptions}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      <div className="popup-content">
        <div className="current-page">
          <h3>Current Page:</h3>
          <div className="scrollbar-none overflow-x-scroll">
            <p className="page-title">{currentTab?.title || "Unknown"}</p>
            <p className="page-url">{currentTab?.url || "Unknown"}</p>
          </div>
        </div>

        {error && (
          <div
            className={`error-message ${
              error.startsWith("✅") ? "success-message" : ""
            } absolute left-1/2 top-32 -translate-x-1/2`}
          >
            <p>{error}</p>
          </div>
        )}

        <div className="actions space-y-3">
          <button
            className="btn btn-primary w-full"
            onClick={handleExtractKeywords}
            disabled={isExtractingKeywords}
          >
            {isExtractingKeywords
              ? "Extracting Keywords..."
              : "🔍 Extract Keywords"}
          </button>
        </div>

        {keywordResults && (
          <>
            <div className="keyword-results">
              {keywordResults.error && (
                <div className="keywords-success">
                  <h4>✅ Keywords Extracted</h4>
                  <button className="btn btn-copy mb-2" onClick={copyKeywords}>
                    📋 Copy Keywords
                  </button>
                  <div className="keywords-list">
                    {[
                      ...keywordResults.keywords,
                      ...keywordResults.jobTitles,
                    ].join(", ")}
                  </div>
                  <p className="extraction-method">
                    Extraction Method:{" "}
                    {keywordResults.method === "api" &&
                      "🔗 API-based extraction"}
                    {keywordResults.method === "simple" &&
                      "📝 Simple fallback extraction"}
                    {keywordResults.method === "error" &&
                      "❌ Error extracting keywords"}
                    {keywordResults.method === "no keywords configured" &&
                      "🔍 No keywords configured"}
                    {keywordResults.method === "no keywords found" &&
                      "🔍 No keywords found, please run the AI prompt to extract keywords"}
                  </p>
                </div>
              )}
            </div>
            <div className="ai-prompt-preview">
              <h4>📝 AI Analysis Prompt Preview:</h4>

              <div className="ai-prompt-actions mb-2">
                <button
                  className="btn btn-ai-secondary"
                  onClick={copyPromptOnly}
                >
                  📋 Copy AI Prompt
                </button>
              </div>

              <div className="prompt-preview">{AIPrompt}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Initialize popup
const container = document.getElementById("popup-root");
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}

function DOMtoString(selector: string) {
  let selectedElement: HTMLElement | null = null;
  if (selector) {
    selectedElement = document.querySelector(selector);
    if (!selectedElement) console.error("querySelector failed to find node");
  } else {
    selectedElement = document.documentElement;
  }
  return selectedElement?.outerHTML;
}
