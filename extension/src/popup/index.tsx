import React from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import { extractor, KeywordExtractionResult } from "@utils/keywordExtractor";

interface PopupProps {}

const Popup: React.FC<PopupProps> = () => {
  const [currentTab, setCurrentTab] = React.useState<chrome.tabs.Tab | null>(
    null
  );
  const [isExtractingKeywords, setIsExtractingKeywords] = React.useState(false);
  const [keywordResults, setKeywordResults] =
    React.useState<KeywordExtractionResult | null>(null);
  const [hasJobContent, setHasJobContent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [contentScriptLoaded, setContentScriptLoaded] = React.useState<
    boolean | null
  >(null);

  React.useEffect(() => {
    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentTab(tabs[0]);

        // Check if content script is loaded and if current page has job content
        if (tabs[0].id) {
          checkContentScriptStatus(tabs[0].id);
        }
      }
    });
  }, []);

  const checkContentScriptStatus = async (tabId: number) => {
    try {
      // Try to ping the content script
      chrome.tabs.sendMessage(tabId, { action: "ping" }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not loaded, try to inject it
          setContentScriptLoaded(false);
          console.error("Content script not loaded, attempting injection...");
        } else if (response && response.status === "loaded") {
          setContentScriptLoaded(true);
          console.error("Content script is loaded");

          // Check for job content
          chrome.tabs.sendMessage(
            tabId,
            { action: "checkJobContent" },
            (response) => {
              if (response && response.hasJobContent) {
                setHasJobContent(true);
              }
            }
          );
        }
      });
    } catch (error) {
      console.error("Error checking content script status:", error);
      setContentScriptLoaded(false);
    }
  };

  const generateAIPrompt = (): string => {
    if (
      keywordResults &&
      keywordResults.extractedText &&
      keywordResults.extractedText.trim()
    ) {
      // Use extracted text for better analysis
      const fullExtractedText = keywordResults.extractedText;

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
${fullExtractedText}`;
    } else {
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
    }
  };

  const copyPromptOnly = async () => {
    try {
      const prompt = generateAIPrompt();
      await navigator.clipboard.writeText(prompt);

      // Show temporary success feedback
      setError("✅ Prompt copied to clipboard!");
      setTimeout(() => setError(null), 2000);
    } catch (error) {
      console.error("Failed to copy prompt:", error);
      setError("❌ Failed to copy prompt to clipboard");
    }
  };

  const handleExtractKeywords = async () => {
    if (!currentTab?.id) return;

    setIsExtractingKeywords(true);
    setKeywordResults(null);
    setError(null);

    try {
      const data = await extractor.extractKeywords(currentTab.url);

      setKeywordResults(data);
    } catch (error) {
      console.error("Error extracting keywords:", error);
      setKeywordResults({
        extractedText: "",
        extractedKeywords: [],
        extractionMethod: "",
        success: false,
        error: "Failed to extract keywords from this page",
      });
    } finally {
      setIsExtractingKeywords(false);
    }
  };

  const copyKeywords = () => {
    if (keywordResults && keywordResults.extractedKeywords.length > 0) {
      navigator.clipboard.writeText(
        keywordResults.extractedKeywords.join(", ")
      );

      // Show temporary success feedback
      const originalError = error;
      setError("✅ Keywords copied to clipboard!");
      setTimeout(() => setError(originalError), 2000);
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
          <p className="page-title">{currentTab?.title || "Unknown"}</p>
          <p className="page-url">{currentTab?.url || "Unknown"}</p>

          {contentScriptLoaded === false && (
            <div className="content-script-status">
              <span className="status-badge error">
                ⚠️ Content script not loaded
              </span>
            </div>
          )}
          {contentScriptLoaded === true && (
            <div className="content-script-status">
              <span className="status-badge success">✅ Extension ready</span>
            </div>
          )}
          {contentScriptLoaded === null && (
            <div className="content-script-status">
              <span className="status-badge loading">
                🔄 Checking extension status...
              </span>
            </div>
          )}

          {hasJobContent && (
            <div className="job-indicator mt-2">
              <span className="job-badge">🎯 Job Posting Detected</span>
            </div>
          )}
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
          <div className="keyword-results">
            {keywordResults.success ? (
              <div className="keywords-success">
                <h4>
                  ✅ Keywords Extracted (
                  {keywordResults.extractedKeywords.length})
                </h4>
                <button className="btn btn-copy mb-2" onClick={copyKeywords}>
                  📋 Copy Keywords
                </button>
                <div className="keywords-list">
                  {keywordResults.extractedKeywords.join(", ")}
                </div>
                <p className="extraction-method">
                  Method:{" "}
                  {keywordResults.extractionMethod === "api-based"
                    ? "🔗 API-based extraction"
                    : "📝 Simple fallback extraction"}
                </p>
              </div>
            ) : (
              <div className="keywords-error">
                <h4>❌ Extraction Failed</h4>
                <p>{keywordResults.error}</p>
              </div>
            )}
          </div>
        )}

        {keywordResults && keywordResults.success && (
          <div className="ai-prompt-preview">
            <h4>📝 AI Analysis Prompt Preview:</h4>

            <div className="ai-prompt-actions mb-2">
              <button className="btn btn-ai-secondary" onClick={copyPromptOnly}>
                📋 Copy AI Prompt
              </button>
            </div>

            <div className="prompt-preview">{generateAIPrompt()}</div>
          </div>
        )}

        <div className="help-text space-y-2">
          <p className="mb-2">Use this extension to:</p>
          <ul className="space-y-1">
            <li>Extract keywords from job postings</li>
            <li>Generate AI analysis prompts</li>
            <li>Optimize your resume with extracted insights</li>
          </ul>
        </div>
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
