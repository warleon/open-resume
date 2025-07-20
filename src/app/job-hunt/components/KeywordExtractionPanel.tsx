import keyword_extractor from "keyword-extractor";
import { htmlToText } from "html-to-text";
import { forwardRef, useImperativeHandle } from "react";
import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import { store } from "lib/redux/store";
import { 
  setExtractedText, 
  setExtractedKeywords, 
  setIsExtracting, 
  setExtractionError 
} from "lib/redux/jobHuntSlice";
import type { JobPreviewPanelRef } from "./JobPreviewPanel";

interface KeywordExtractionPanelProps {
  jobPreviewRef: React.RefObject<JobPreviewPanelRef>;
}

interface KeywordExtractionPanelRef {
  extractKeywords: () => void;
}

export const KeywordExtractionPanel = forwardRef<KeywordExtractionPanelRef, KeywordExtractionPanelProps>(({
  jobPreviewRef,
}, ref) => {
  const dispatch = useAppDispatch();
  const {
    jobUrl,
    isValidUrl,
    extractedKeywords,
    isExtracting,
    extractionError,
    iframeLoaded,
  } = useAppSelector((state) => state.jobHunt);
  
  const extractKeywords = async () => {
    if (!isValidUrl || !jobPreviewRef.current) return;

    dispatch(setIsExtracting(true));

    let htmlContent = '';
    let extractionMethod = '';

    try {
      // Step 1: Always wait for iframe to be fully loaded first
      console.log('⏳ Ensuring iframe is fully loaded before extraction...');
      
      if (!iframeLoaded) {
        console.log('📍 Iframe not loaded yet, waiting for load event...');
        
        // Wait for iframe to load with timeout
        const loadTimeout = 15000; // 15 seconds timeout
        const startTime = Date.now();
        
        while (!iframeLoaded && (Date.now() - startTime) < loadTimeout) {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Check current iframe state from Redux
          const currentState = store.getState?.() || ({ jobHunt: { iframeLoaded: false } } as any);
          if (currentState.jobHunt?.iframeLoaded) {
            console.log('✅ Iframe loaded during wait');
            break;
          }
        }
        
        if (!iframeLoaded) {
          console.log('⚠️ Iframe load timeout, proceeding with extraction anyway...');
        }
      } else {
        console.log('✅ Iframe already loaded, proceeding with extraction');
      }

      // Step 2: Wait additional time for content to be fully rendered
      console.log('⏳ Waiting for iframe content to be fully rendered...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Now attempt iframe content extraction
      console.log('🔍 Attempting iframe content extraction...');
      htmlContent = await jobPreviewRef.current.waitForIframeContent(8, 1500) || '';
      
      if (htmlContent && htmlContent.length > 100) {
        extractionMethod = 'iframe';
        console.log('✅ Success: Iframe content extraction completed');
      } else {
        throw new Error('Iframe content empty or inaccessible after full loading');
      }
    } catch (iframeError) {
      console.log('❌ Iframe extraction failed, falling back to allorigins proxy:', 
        iframeError instanceof Error ? iframeError.message : String(iframeError));
      
      try {
        // Fallback: Use allorigins proxy
        console.log('🔄 Attempting allorigins proxy fallback...');
        extractionMethod = 'allorigins';
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(jobUrl)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch job posting content via proxy');
        }

        const data = await response.json();
        htmlContent = data.contents;
        console.log('✅ Success: Allorigins proxy extraction');
      } catch (fallbackError) {
        console.error('❌ All extraction methods failed:', 
          fallbackError instanceof Error ? fallbackError.message : String(fallbackError));
        throw new Error('Unable to extract content: Both iframe and proxy methods failed. The job posting may be protected against scraping.');
      }
    }

    if (!htmlContent || htmlContent.length < 50) {
      throw new Error('No meaningful content could be extracted from the job posting.');
    }

    console.log(`📊 Extraction successful via ${extractionMethod}. Content length: ${htmlContent.length} characters`);

    try {
      // Detect if this is a LinkedIn job posting
      const isLinkedInJob = jobUrl.includes('linkedin.com') && jobUrl.includes('/jobs/');

      let textContent = '';

      if (isLinkedInJob) {
        // Updated LinkedIn selectors - using only simple selectors (no combinators)
        textContent = htmlToText(htmlContent, {
          wordwrap: false,
          preserveNewlines: false,
          baseElements: {
            selectors: [
              '.jobs-description__content',
              '.jobs-description-content',
              '.jobs-description-content__text',
              '.jobs-description-content__text--stretch',
              '.jobs-box__html-content',
              '.jobs-description__container',
              '.jobs-description',
              '#job-details',
              '.jobs-description-content__text--stretch'
            ],
            orderBy: 'selectors',
            returnDomByDefault: false
          },
          selectors: [
            { selector: 'a', options: { ignoreHref: true } },
            { selector: 'img', format: 'skip' },
            { selector: 'nav', format: 'skip' },
            { selector: 'header', format: 'skip' },
            { selector: 'footer', format: 'skip' },
            { selector: '.jobs-unified-top-card', format: 'skip' },
            { selector: '.jobs-apply-button', format: 'skip' },
            { selector: '.jobs-company', format: 'skip' },
            { selector: '.jobs-poster__apply-button', format: 'skip' },
            { selector: '.jobs-save-button', format: 'skip' },
            { selector: '.jobs-details-top-card', format: 'skip' }
          ]
        });
      } else {
        // For other job sites, use general extraction
        textContent = htmlToText(htmlContent, {
          wordwrap: false,
          preserveNewlines: false,
          selectors: [
            { selector: 'a', options: { ignoreHref: true } },
            { selector: 'img', format: 'skip' },
            { selector: 'nav', format: 'skip' },
            { selector: 'header', format: 'skip' },
            { selector: 'footer', format: 'skip' },
            { selector: '.navigation', format: 'skip' },
            { selector: '.sidebar', format: 'skip' },
            { selector: '.menu', format: 'skip' }
          ]
        });
      }

      // Fallback if no text was extracted with specific selectors
      if (!textContent.trim() && isLinkedInJob) {
        // Try a more aggressive extraction approach
        textContent = htmlToText(htmlContent, {
          wordwrap: false,
          preserveNewlines: false,
          selectors: [
            { selector: 'a', options: { ignoreHref: true } },
            { selector: 'img', format: 'skip' },
            { selector: 'nav', format: 'skip' },
            { selector: 'header', format: 'skip' },
            { selector: 'footer', format: 'skip' },
            { selector: 'script', format: 'skip' },
            { selector: 'style', format: 'skip' }
          ]
        });
        
        // Only alert if we still don't have meaningful content
        if (!textContent.trim() || textContent.length < 100) {
          console.warn('Unable to extract job description from LinkedIn. The page structure may have changed or access may be restricted.');
        } else {
          console.log('Used fallback extraction for LinkedIn - got', textContent.length, 'characters');
        }
      }

      // Store the extracted text in Redux
      dispatch(setExtractedText(textContent));

      // Extract keywords
      const keywords = keyword_extractor.extract(textContent, {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
      });

      // Enhanced filtering for job-related keywords
      const commonWords = [
        'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 
        'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 
        'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 
        'use', 'her', 'way', 'many', 'will', 'would', 'could', 'should', 'might', 
        'must', 'shall', 'about', 'after', 'before', 'during', 'while', 'when', 
        'where', 'why', 'what', 'which', 'this', 'that', 'these', 'those', 'with', 
        'without', 'within', 'through', 'between', 'among', 'above', 'below', 'under',
        'linkedin', 'jobs', 'job', 'career', 'careers', 'apply', 'application', 'view',
        'show', 'more', 'less', 'click', 'here', 'link', 'page', 'site', 'website'
      ];

      const filteredKeywords = keywords
        .filter(keyword => keyword.length >= 3)
        .filter(keyword => !commonWords.includes(keyword.toLowerCase()))
        .filter(keyword => !/^\d+$/.test(keyword)) // Remove pure numbers
        .slice(0, 30); // Limit to top 30 keywords

      dispatch(setExtractedKeywords(filteredKeywords));
      
      // Add a success message indicating which extraction method was used
      switch (extractionMethod) {
        case 'iframe':
          console.log('🎯 Keywords extracted from iframe content (after full loading)');
          break;
        case 'allorigins':
          console.log('🎯 Keywords extracted via allorigins proxy');
          break;
        default:
          console.log('🎯 Keywords extracted successfully');
      }
      
    } catch (error) {
      console.error('Error extracting keywords:', error instanceof Error ? error.message : String(error));
      dispatch(setExtractionError('Failed to extract keywords. This might be due to CORS restrictions or network issues.'));
    } finally {
      dispatch(setIsExtracting(false));
    }
  };

  // Expose extractKeywords function to parent component
  useImperativeHandle(ref, () => ({
    extractKeywords,
  }));

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-green-800">
          🤖 Automated Text & Keyword Extraction
        </h3>
        <button
          onClick={extractKeywords}
          disabled={isExtracting}
          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isExtracting ? "Extracting..." : "Re-extract"}
        </button>
      </div>

      {isExtracting && (
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <div className="animate-spin w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"></div>
          Analyzing job posting...
        </div>
      )}

      {extractionError && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          {extractionError}
        </div>
      )}

      {extractedKeywords.length > 0 && !isExtracting && (
        <div>
          <div className="bg-white border border-green-200 rounded p-3 mb-3">
            <div className="text-xs text-green-700 mb-2">
              Found {extractedKeywords.length} keywords:
            </div>
            <div className="text-sm text-gray-700 max-h-24 overflow-y-auto">
              {extractedKeywords.join(', ')}
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(extractedKeywords.join(', '));
            }}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>📋</span>
            Copy Keywords
          </button>
        </div>
      )}
    </div>
  );
});

KeywordExtractionPanel.displayName = "KeywordExtractionPanel"; 