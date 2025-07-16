"use client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { ResumePDF } from "components/Resume/ResumePDF";
import { usePDF } from "@react-pdf/renderer";
import { Button } from "components/Button";
import dynamic from "next/dynamic";

const AnalyzeResumeButtonComponent = () => {
  const router = useRouter();
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  const [instance] = usePDF({ document });

  const handleAnalyzeResume = async () => {
    if (instance.blob) {
      try {
        // Create object URL from blob for PDF.js compatibility
        const objectUrl = URL.createObjectURL(instance.blob);
        
        // Store the object URL for the parser to use
        localStorage.setItem("generatedResumeUrl", objectUrl);
        localStorage.setItem("generatedResumeFileName", `${resume.profile.name || "Generated"} - Resume.pdf`);
        
        // Navigate to the parser page
        router.push("/resume-parser?source=builder");
      } catch (error) {
        console.error("Failed to process PDF for analysis:", error);
      }
    }
  };

  const isReady = !!instance.blob;

  return (
    <div className="absolute top-1/2 -translate-y-1/2 -right-2 z-10">
      <Button
        onClick={handleAnalyzeResume}
        disabled={!isReady}
        className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2 ${
          isReady 
            ? "text-gray-700 bg-white hover:bg-gray-50" 
            : "text-gray-400 bg-gray-100 cursor-not-allowed"
        }`}
      >
        <span>{isReady ? "Analyze Resume" : "Generating..."}</span>
        <span className="text-lg">→</span>
      </Button>
    </div>
  );
};

export const AnalyzeResumeButton = dynamic(
  () => Promise.resolve(AnalyzeResumeButtonComponent),
  {
    ssr: false,
  }
); 