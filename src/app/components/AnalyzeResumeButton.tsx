"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { ResumePDF } from "components/Resume/ResumePDF";
import { usePDF } from "@react-pdf/renderer";
import { Button } from "components/Button";
import dynamic from "next/dynamic";
import { convertToJsonResume } from "lib/convert-to-json-resume";

const AnalyzeResumeButtonComponent = () => {
  const router = useRouter();
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPdfBlob, setCurrentPdfBlob] = useState<Blob | null>(null);

  // Check if JSON Resume theme is selected
  const isJsonResumeTheme = settings.jsonResumeTheme !== "default";

  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  const [instance] = usePDF({ document });

  // Generate JSON Resume theme PDF when custom theme is selected
  useEffect(() => {
    const generateJsonThemePdf = async () => {
      if (!isJsonResumeTheme) {
        setCurrentPdfBlob(null);
        return;
      }

      setIsGenerating(true);

      try {
        const jsonResume = convertToJsonResume(resume);

        const response = await fetch("/api/render-theme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume: jsonResume,
            theme: settings.jsonResumeTheme,
            format: "pdf",
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          setCurrentPdfBlob(blob);
        } else {
          console.error(
            "AnalyzeResumeButton: Failed to generate JSON theme PDF"
          );
          setCurrentPdfBlob(null);
        }
      } catch (error) {
        console.error(
          "AnalyzeResumeButton: Error generating JSON theme PDF:",
          error
        );
        setCurrentPdfBlob(null);
      } finally {
        setIsGenerating(false);
      }
    };

    if (isJsonResumeTheme) {
      generateJsonThemePdf();
    }
  }, [isJsonResumeTheme, settings.jsonResumeTheme, resume]);

  // Use the appropriate blob based on theme selection
  const activePdfBlob = isJsonResumeTheme ? currentPdfBlob : instance.blob;

  const handleAnalyzeResume = async () => {
    if (activePdfBlob) {
      try {
        // Create object URL from blob for PDF.js compatibility
        const objectUrl = URL.createObjectURL(activePdfBlob);

        // Store the object URL for the parser to use
        localStorage.setItem("generatedResumeUrl", objectUrl);
        localStorage.setItem(
          "generatedResumeFileName",
          `${resume.profile.name || "Generated"} - Resume.pdf`
        );

        // Store the original resume data for similarity comparison
        localStorage.setItem("originalResumeData", JSON.stringify(resume));

        // Navigate to the parser page
        router.push("/resume-parser?source=builder");
      } catch (error) {
        console.error("Failed to process PDF for analysis:", error);
      }
    }
  };

  const isReady = !!activePdfBlob && !isGenerating;

  return (
    <div className="absolute -right-2 top-1/2 z-10 -translate-y-1/2">
      <Button
        onClick={handleAnalyzeResume}
        disabled={!isReady}
        className={`flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isReady
            ? "bg-white text-gray-700 hover:bg-gray-50"
            : "cursor-not-allowed bg-gray-100 text-gray-400"
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
