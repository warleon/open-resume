// Content script for OpenResume extension
// This script runs on web pages and extracts keywords from job postings

// Log that the script is starting to load
console.log('OpenResume content script starting to load...');

interface KeywordExtractionResult {
  extractedText: string;
  extractedKeywords: string[];
  extractionMethod: string;
  success: boolean;
  error?: string;
}

// Simple keyword extraction function (fallback without external dependencies)
function extractKeywordsSimple(text: string): string[] {
  // Convert to lowercase and split into words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length >= 3); // Only words 3+ characters

  // Common words to filter out
  const commonWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 
    'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 
    'use', 'way', 'many', 'will', 'would', 'could', 'should', 'might', 'must', 
    'shall', 'about', 'after', 'before', 'during', 'while', 'when', 'where', 
    'why', 'what', 'which', 'this', 'that', 'these', 'those', 'with', 'without', 
    'within', 'through', 'between', 'among', 'above', 'below', 'under',
    'linkedin', 'jobs', 'job', 'career', 'careers', 'apply', 'application', 'view',
    'show', 'more', 'less', 'click', 'here', 'link', 'page', 'site', 'website'
  ]);

  // Count word frequencies
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    if (!commonWords.has(word) && !/^\d+$/.test(word)) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
  });

  // Sort by frequency and return keywords
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

// Simple HTML to text conversion
function htmlToTextSimple(html: string): string {
  try {
    // Create a temporary div to parse HTML
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Remove script and style elements
    const scripts = div.querySelectorAll('script, style');
    scripts.forEach(script => script.remove());
    
    // Get text content and normalize whitespace
    return div.textContent || div.innerText || '';
  } catch (error) {
    console.error('Error converting HTML to text:', error);
    return '';
  }
}

class KeywordExtractor {
  constructor() {
    console.log('KeywordExtractor initialized');
  }

  // Advanced keyword extraction
  public async extractKeywords(url?: string): Promise<KeywordExtractionResult> {
    console.log('Starting keyword extraction for URL:', url || window.location.href);
    
    const result: KeywordExtractionResult = {
      extractedText: '',
      extractedKeywords: [],
      extractionMethod: '',
      success: false
    };

    try {
      let htmlContent = '';
      let extractionMethod = '';

      // Method 1: Extract from current page DOM
      htmlContent = document.documentElement.outerHTML;
      extractionMethod = 'direct-dom';
      
      if (!htmlContent || htmlContent.length < 50) {
        throw new Error('No meaningful content found on the current page.');
      }

      console.log(`📊 Extraction successful via ${extractionMethod}. Content length: ${htmlContent.length} characters`);

      // Detect if this is a LinkedIn job posting
      const isLinkedInJob = window.location.href.indexOf('linkedin.com') !== -1 && window.location.href.indexOf('/jobs/') !== -1;

      let textContent = '';

      if (isLinkedInJob) {
        // For LinkedIn, try to extract job description specifically
        const jobDescSelectors = [
          '.jobs-description__content',
          '.jobs-description-content',
          '.jobs-description-content__text',
          '.jobs-box__html-content',
          '.jobs-description__container',
          '.jobs-description'
        ];
        
        for (const selector of jobDescSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            textContent = element.textContent || '';
            console.log('Found LinkedIn job description via selector:', selector);
            break;
          }
        }
        
        // Fallback to general extraction
        if (!textContent.trim()) {
          textContent = htmlToTextSimple(htmlContent);
          console.log('Using fallback text extraction for LinkedIn');
        }
      } else {
        // For other sites, use general extraction
        textContent = htmlToTextSimple(htmlContent);
        console.log('Using general text extraction');
      }

      result.extractedText = textContent;

      // Extract keywords using simple extraction
      const keywords = extractKeywordsSimple(textContent);

      result.extractedKeywords = keywords;
      result.extractionMethod = extractionMethod;
      result.success = true;

      console.log('🎯 Keywords extracted successfully:', keywords.length, 'keywords found');
      
    } catch (error) {
      console.error('Error extracting keywords:', error instanceof Error ? error.message : String(error));
      result.error = error instanceof Error ? error.message : 'Unknown error occurred during keyword extraction';
    }

    return result;
  }

  // Check if current page is a job posting
  public hasJobContent(): boolean {
    const jobIndicators = [
      'job description',
      'responsibilities',
      'requirements',
      'qualifications',
      'apply now',
      'job opening',
      'position',
      'salary',
      'benefits',
      'job posting'
    ];

    const pageText = document.body.innerText.toLowerCase();
    const pageUrl = window.location.href.toLowerCase();
    
    // Check for job sites in URL
    const jobSites = [
      'linkedin.com/jobs',
      'indeed.com',
      'glassdoor.com',
      'monster.com',
      'ziprecruiter.com',
      'careerbuilder.com',
      'jobs.',
      'careers.',
      '/jobs/',
      '/careers/'
    ];

    const isJobSite = jobSites.some(site => pageUrl.indexOf(site) !== -1);
    const hasJobKeywords = jobIndicators.some(indicator => pageText.indexOf(indicator) !== -1);

    const hasJob = isJobSite || hasJobKeywords;
    console.log('Job content detection - isJobSite:', isJobSite, 'hasJobKeywords:', hasJobKeywords, 'result:', hasJob);
    
    return hasJob;
  }
}

// Initialize content script
console.log('Initializing KeywordExtractor...');
const extractor = new KeywordExtractor();

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request.action);
  
  try {
    if (request.action === 'ping') {
      // Simple ping response to check if content script is loaded
      console.log('Responding to ping');
      sendResponse({ status: 'loaded' });
    } else if (request.action === 'extractKeywords') {
      // Handle async keyword extraction
      console.log('Starting keyword extraction...');
      extractor.extractKeywords(request.url).then(result => {
        console.log('Keywords extracted:', result);
        sendResponse(result);
      }).catch(error => {
        console.error('Keyword extraction error:', error);
        sendResponse({
          extractedText: '',
          extractedKeywords: [],
          extractionMethod: '',
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      });
      return true; // Keep message channel open for async response
    } else if (request.action === 'checkJobContent') {
      console.log('Checking job content...');
      const hasJobContent = extractor.hasJobContent();
      console.log('Job content check result:', hasJobContent);
      sendResponse({ hasJobContent });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ error: error instanceof Error ? error.message : String(error) });
  }
  
  return true; // Keep message channel open for async response
});

// Auto-extract on page load if enabled
try {
  chrome.storage.sync.get({ autoExtract: true }, (result: any) => {
    console.log('Auto-extract setting:', result.autoExtract);
    if (result.autoExtract) {
      if (extractor.hasJobContent()) {
        console.log('Auto-extracting keywords from job posting...');
        // Auto-extract keywords from job postings
        extractor.extractKeywords().then(keywordResult => {
          if (keywordResult.success) {
            console.log('Auto-extraction successful, sending to background script');
            chrome.runtime.sendMessage({
              action: 'keywordsExtracted',
              data: keywordResult
            });
          }
        }).catch(error => {
          console.error('Auto-extraction failed:', error);
        });
      }
    }
  });
} catch (error) {
  console.error('Error during auto-extract initialization:', error);
}

console.log('OpenResume content script loaded with keyword extraction'); 