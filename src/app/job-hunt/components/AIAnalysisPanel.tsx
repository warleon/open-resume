import { useAppSelector } from "lib/redux/hooks";

interface AIAnalysisPanelProps {}

export const AIAnalysisPanel = ({}: AIAnalysisPanelProps) => {
  const { jobUrl } = useAppSelector((state) => state.jobHunt);

  const installExtension = () => {
    window.open('https://github.com/xitanggg/open-resume/tree/main/extension', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Extension Promotion */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🚀</span>
          <h3 className="text-lg font-semibold text-blue-900">
            Moved to Browser Extension!
          </h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-blue-800">
            AI prompt generation and ChatGPT navigation have been enhanced and moved to our browser extension for better performance and functionality.
          </p>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">Extension Benefits:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Direct access to any job posting page</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Smart ChatGPT tab management</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Enhanced keyword extraction</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Works on LinkedIn, Indeed, and more</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Auto-prompt generation with extracted content</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>One-click copy and navigate workflow</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={installExtension}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>📥</span>
              Install Extension
            </button>
          </div>
        </div>
      </div>

      {/* Instructions for Extension Usage */}
      {jobUrl && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">How to use with the extension:</h4>
          <ol className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
              <span>Install the OpenResume browser extension</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
              <span>Navigate to the job posting: <code className="bg-blue-100 px-1 rounded text-xs">{jobUrl}</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
              <span>Click the extension icon and use "Extract Keywords"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
              <span>Use "Copy AI Prompt & Go to ChatGPT" for enhanced analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">5</span>
              <span>Paste the prompt in ChatGPT and get detailed analysis</span>
            </li>
          </ol>
        </div>
      )}

      {/* Fallback Manual Prompt */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Manual Analysis (Fallback):</h4>
        <p className="text-sm text-gray-600 mb-3">
          If you prefer not to use the extension, you can manually copy this basic prompt:
        </p>
        
        <div className="bg-white border border-gray-200 rounded p-3 text-xs text-gray-700">
          <code className="whitespace-pre-wrap">
{`Please analyze the job posting from this URL: ${jobUrl || '[YOUR_JOB_URL]'}

Extract the key requirements, skills, technologies, and qualifications mentioned. Provide a summary of:

1. Required technical skills
2. Required soft skills  
3. Experience level needed
4. Key responsibilities
5. Company culture indicators
6. Education requirements
7. Keywords for resume optimization

Please provide the final result as a comma-separated list of keywords ready to be copied.`}
          </code>
        </div>
        
        <button
          onClick={() => {
            const prompt = `Please analyze the job posting from this URL: ${jobUrl || '[YOUR_JOB_URL]'}

Extract the key requirements, skills, technologies, and qualifications mentioned. Provide a summary of:

1. Required technical skills
2. Required soft skills  
3. Experience level needed
4. Key responsibilities
5. Company culture indicators
6. Education requirements
7. Keywords for resume optimization

Please provide the final result as a comma-separated list of keywords ready to be copied.`;
            navigator.clipboard.writeText(prompt);
          }}
          className="mt-3 bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
        >
          📋 Copy Basic Prompt
        </button>
      </div>

      {/* Extension Download Info */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600">💡</span>
          <h4 className="font-semibold text-green-800">Pro Tip:</h4>
        </div>
        <p className="text-sm text-green-700">
          The extension provides the best experience with automatic keyword extraction, enhanced prompts that include the actual job posting content, and seamless ChatGPT integration with smart tab management.
        </p>
      </div>
    </div>
  );
}; 