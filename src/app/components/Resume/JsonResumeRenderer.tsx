"use client";
import { useEffect, useState, useMemo } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { convertToJsonResume } from "lib/convert-to-json-resume";

export const JsonResumeRenderer = ({ theme }: { theme: string }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const resume = useAppSelector(selectResume);
  
  const jsonResume = useMemo(() => convertToJsonResume(resume), [resume]);

  useEffect(() => {
    const generateHtml = async () => {
      if (!theme || theme === "default") {
        return;
      }
      
      setIsLoading(true);
      setError("");
      
      try {
        const response = await fetch('/api/render-theme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resume: jsonResume,
            theme: theme,
            format: 'html'
          }),
        });

        if (response.ok) {
          const html = await response.text();
          setHtmlContent(html);
        } else {
          setError('Failed to generate preview');
        }
      } catch (error) {
        console.error('Error generating JSON Resume HTML:', error);
        setError('Error generating preview');
      } finally {
        setIsLoading(false);
      }
    };

    generateHtml();
  }, [theme, jsonResume]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading theme preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!htmlContent) {
    return null;
  }

  return (
    <iframe
      srcDoc={htmlContent}
      className="w-full h-full border-0"
      title={`JSON Resume - ${theme} theme`}
      style={{ backgroundColor: 'white' }}
    />
  );
}; 