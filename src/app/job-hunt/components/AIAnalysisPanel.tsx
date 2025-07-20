import { useRef } from "react";
import { useAppSelector } from "lib/redux/hooks";

interface AIAnalysisPanelProps {}

export const AIAnalysisPanel = ({}: AIAnalysisPanelProps) => {
  const { jobUrl, extractedText } = useAppSelector((state) => state.jobHunt);
  const chatGptTabRef = useRef<Window | null>(null);

  // Function to navigate to ChatGPT tab or create new one
  const navigateToChatGPT = () => {
    // Try to find existing ChatGPT tab by checking all open tabs
    // Note: Due to browser security, we can't actually iterate through all tabs
    // but we can try to focus our stored reference or open a new one
    if (chatGptTabRef.current && !chatGptTabRef.current.closed) {
      // Focus the existing tab
      chatGptTabRef.current.focus();
    } else {
      // Open ChatGPT tab with target="_blank" but try to reuse existing tab name
      chatGptTabRef.current = window.open('https://chatgpt.com', 'chatgpt-tab');
    }
  };

  // Function to copy prompt and navigate to ChatGPT
  const copyPromptAndNavigate = () => {
    let prompt = '';
    
    if (extractedText && extractedText.trim()) {
      // Use extracted text instead of URL
      prompt = `Please analyze the following job posting text and extract the key requirements, skills, technologies, and qualifications mentioned. Provide a summary of:

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
    } else {
      // Fallback to URL if no extracted text available
      prompt = `Please analyze the job posting from this URL: ${jobUrl}. Extract the key requirements, skills, technologies, and qualifications mentioned. Provide a summary of:

1. Required technical skills
2. Required soft skills  
3. Experience level needed
4. Key responsibilities
5. Company culture indicators
6. Education requirements
7. Keywords for resume optimization

Please provide the final result as a comma-separated list of keywords ready to be copied.`;
    }

    navigator.clipboard.writeText(prompt).then(() => {
      navigateToChatGPT();
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      // Still navigate even if copy fails
      navigateToChatGPT();
    });
  };

  const copyPromptOnly = () => {
    let prompt = '';
    
    if (extractedText && extractedText.trim()) {
      // Use extracted text instead of URL
      prompt = `Please analyze the following job posting text and extract the key requirements, skills, technologies, and qualifications mentioned. Provide a summary of:

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
    } else {
      // Fallback to URL if no extracted text available
      prompt = `Please analyze the job posting from this URL: ${jobUrl}. Extract the key requirements, skills, technologies, and qualifications mentioned. Provide a summary of:

1. Required technical skills
2. Required soft skills  
3. Experience level needed
4. Key responsibilities
5. Company culture indicators
6. Education requirements
7. Keywords for resume optimization

Please provide the final result as a comma-separated list of keywords ready to be copied.`;
    }
    
    navigator.clipboard.writeText(prompt);
  };

  const generatePromptPreview = () => {
    if (extractedText && extractedText.trim()) {
      // Show a truncated version for preview
      const truncatedText = extractedText.length > 500 
        ? extractedText.substring(0, 500) + '...[text continues]'
        : extractedText;
        
      return `Please analyze the following job posting text and extract the key requirements, skills, technologies, and qualifications mentioned. 
Provide a summary of:

1. Required technical skills
2. Required soft skills  
3. Experience level needed
4. Key responsibilities
5. Company culture indicators
6. Education requirements
7. Keywords for resume optimization

Please provide the final result as a comma-separated list of keywords ready to be copied.

Job Posting Content:
${truncatedText}`;
    } else {
      return `Please analyze the job posting from this URL: ${jobUrl}. 
Extract the key requirements, skills, technologies, and qualifications mentioned. 
Provide a summary of:

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

  return (
    <div className="space-y-6">
      {/* AI Analysis Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={copyPromptAndNavigate}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>🚀</span>
          Copy Enhanced Prompt & Go to ChatGPT
        </button>
        
        <button
          onClick={copyPromptOnly}
          className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <span>📋</span>
          Copy Enhanced Prompt Only
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2 text-sm">How it works:</h4>
        <ol className="text-xs text-blue-700 space-y-1">
          <li>1. Text is automatically extracted when you enter a URL</li>
          <li>2. Copy extracted keywords directly or use enhanced AI prompt</li>
          <li>3. Enhanced prompt uses extracted text for better AI analysis</li>
          <li>4. Use both automated and AI-generated keywords to optimize your resume</li>
        </ol>
      </div>

      {/* Enhanced Prompt Preview */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800">
            Enhanced Analysis Prompt Preview
            {extractedText && extractedText.trim() && (
              <span className="ml-2 text-xs text-green-600 font-normal">
                (includes extracted text)
              </span>
            )}
          </h3>
        </div>
        <div className="p-4">
          <div className="bg-gray-50 rounded p-3 text-xs text-gray-700 max-h-48 overflow-y-auto">
            <code className="whitespace-pre-wrap">
              {generatePromptPreview()}
            </code>
          </div>
        </div>
      </div>

      {/* Tab Status */}
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <div className="flex items-center gap-2">
          <span className="text-green-600">ℹ️</span>
          <span className="text-xs text-green-700">
            Smart tab management: Will reuse existing ChatGPT tab or create a new one
          </span>
        </div>
      </div>
    </div>
  );
}; 