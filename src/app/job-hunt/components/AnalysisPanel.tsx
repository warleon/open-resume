"use client";
import { useEffect, useRef } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { KeywordExtractionPanel } from "./KeywordExtractionPanel";
import { AIAnalysisPanel } from "./AIAnalysisPanel";
import type { JobPreviewPanelRef } from "./JobPreviewPanel";

interface AnalysisPanelProps {
  jobPreviewRef: React.RefObject<JobPreviewPanelRef>;
}

export const AnalysisPanel = ({ jobPreviewRef }: AnalysisPanelProps) => {
  const keywordExtractionRef = useRef<{ extractKeywords: () => void } | null>(null);
  
  const {
    jobUrl,
    isValidUrl,
    extractedKeywords,
    extractedText,
    isExtracting,
    extractionError,
    iframeLoaded,
  } = useAppSelector((state) => state.jobHunt);

  // Auto-extract keywords when iframe loads
  useEffect(() => {
    if (isValidUrl && iframeLoaded && keywordExtractionRef.current) {
      // Now that we have proper loading detection, start extraction with a smaller delay
      console.log('🔄 Iframe fully loaded, scheduling keyword extraction...');
      setTimeout(() => {
        if (keywordExtractionRef.current) {
          console.log('⚡ Starting automatic keyword extraction...');
          keywordExtractionRef.current.extractKeywords();
        }
      }, 500); // Reduced delay since we now wait properly in the extraction function
    }
  }, [isValidUrl, iframeLoaded]);

  return (
    <div className="bg-white">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">
          AI Analysis Tool
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Generate prompts and navigate to ChatGPT for analysis
        </p>
      </div>
      
      <div className="flex-1">
        {isValidUrl ? (
          <div className="flex-1 p-6 space-y-6">
            {/* Automated Keyword Extraction */}
            <KeywordExtractionPanel
              ref={keywordExtractionRef}
              jobPreviewRef={jobPreviewRef}
            />

            {/* AI Analysis */}
            <AIAnalysisPanel />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Enter a Job URL
              </h3>
              <p className="text-gray-600 text-sm">
                Add a job posting URL above to generate analysis prompts for ChatGPT
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 