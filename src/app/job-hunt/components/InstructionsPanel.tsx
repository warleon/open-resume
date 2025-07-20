import { useAppSelector } from "lib/redux/hooks";

interface InstructionsPanelProps {}

export const InstructionsPanel = ({}: InstructionsPanelProps) => {
  const { jobUrl } = useAppSelector((state) => state.jobHunt);
  
  if (jobUrl) return null;

  return (
    <div className="absolute bottom-8 left-8 right-8 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        How to use Job Hunt Analyzer
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            1
          </div>
          <div>
            <strong>Enter Job URL:</strong> Paste the link to the job posting you're interested in
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            2
          </div>
          <div>
            <strong>Auto Keywords:</strong> Keywords are automatically extracted from the job posting
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            3
          </div>
          <div>
            <strong>Enhanced AI:</strong> Use enhanced prompts with extracted keywords for better analysis
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            4
          </div>
          <div>
            <strong>Optimize Resume:</strong> Use both automated and AI keywords to improve your resume
          </div>
        </div>
      </div>
    </div>
  );
}; 