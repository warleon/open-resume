import { INPUT_CLASS_NAME } from "components/ResumeForm/Form/InputGroup";

interface URLInputProps {
  jobUrl: string;
  isValidUrl: boolean;
  onUrlChange: (url: string) => void;
}

export const URLInput = ({ jobUrl, isValidUrl, onUrlChange }: URLInputProps) => {
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUrlChange(e.target.value);
  };

  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Job Opening URL
        </label>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <input
              type="url"
              value={jobUrl}
              onChange={handleUrlChange}
              placeholder="https://company.com/jobs/software-engineer"
              className={`${INPUT_CLASS_NAME} text-lg py-3`}
            />
            {jobUrl && !isValidUrl && (
              <p className="mt-2 text-sm text-red-600">
                Please enter a valid URL
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                jobUrl
                  ? isValidUrl
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-gray-300"
              }`}
            />
            <span className="text-sm text-gray-600">
              {jobUrl
                ? isValidUrl
                  ? "Valid URL"
                  : "Invalid URL"
                : "Enter URL"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 