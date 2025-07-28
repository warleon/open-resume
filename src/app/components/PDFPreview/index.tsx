"use client";
import { useState, useEffect, useMemo, cloneElement } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { ResumePDF } from "components/Resume/ResumePDF";
import { usePDF } from "@react-pdf/renderer";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";
import { convertToJsonResume } from "lib/convert-to-json-resume";
import dynamic from "next/dynamic";

const PDFPreviewComponent = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoadingJsonTheme, setIsLoadingJsonTheme] = useState(false);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);

  // Check if JSON Resume theme is selected
  const isJsonResumeTheme = settings.jsonResumeTheme !== "default";

  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  const [instance, update] = usePDF({ document });

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  // Generate JSON Resume theme PDF
  useEffect(() => {
    const generateJsonThemePdf = async () => {
      if (!isJsonResumeTheme) return;

      setIsLoadingJsonTheme(true);

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

          // Clean up previous URL
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
          }

          // Create new object URL for JSON theme PDF
          const objectUrl = URL.createObjectURL(blob);
          setPdfUrl(objectUrl);
        } else {
          console.error("PDFPreview: Failed to generate JSON theme PDF");
        }
      } catch (error) {
        console.error("PDFPreview: Error generating JSON theme PDF:", error);
      } finally {
        setIsLoadingJsonTheme(false);
      }
    };

    if (isJsonResumeTheme) {
      generateJsonThemePdf();
    }
  }, [isJsonResumeTheme, settings.jsonResumeTheme, resume]);

  // Update PDF when document changes (for default theme only)
  useEffect(() => {
    if (!isJsonResumeTheme) {
      update(document);
    }
  }, [update, document, isJsonResumeTheme, resume, settings]);
  useEffect(() => {
    console.log(instance.error);
  }, [instance]);

  // Create object URL when PDF blob is ready (for default theme only)
  useEffect(() => {
    if (!isJsonResumeTheme && instance.blob) {
      // Clean up previous URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // Create new object URL
      const objectUrl = URL.createObjectURL(instance.blob);
      setPdfUrl(objectUrl);
    }
  }, [instance.blob, isJsonResumeTheme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".json-export-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      window.document.addEventListener("click", handleClickOutside);
      return () =>
        window.document.removeEventListener("click", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const fileName = `${resume.profile.name || "Resume"} - Resume.pdf`;

  const downloadJson = () => {
    const jsonResume = convertToJsonResume(resume);
    const jsonResumeWithSchema = {
      $schema:
        "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
      ...jsonResume,
    };
    const jsonData = JSON.stringify(jsonResumeWithSchema, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\.pdf$/, "")}.json`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsDropdownOpen(false);
  };

  const copyJsonToClipboard = async () => {
    const jsonResume = convertToJsonResume(resume);
    const jsonResumeWithSchema = {
      $schema:
        "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
      ...jsonResume,
    };
    const jsonData = JSON.stringify(jsonResumeWithSchema, null, 2);
    try {
      await navigator.clipboard.writeText(jsonData);
      console.log("JSON data copied to clipboard");
    } catch (err) {
      console.error("Failed to copy JSON to clipboard:", err);
      const textArea = window.document.createElement("textarea");
      textArea.value = jsonData;
      window.document.body.appendChild(textArea);
      textArea.select();
      window.document.execCommand("copy");
      window.document.body.removeChild(textArea);
    }
    setIsDropdownOpen(false);
  };

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex justify-center">
        <div className="relative w-full">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-hidden md:p-[var(--resume-padding)]">
            <div className="mx-auto h-full w-full">
              {pdfUrl ? (
                <iframe
                  src={`${pdfUrl}#navpanes=0`}
                  className="h-full w-full rounded-md border border-gray-300"
                  title={
                    isJsonResumeTheme
                      ? `JSON Resume - ${settings.jsonResumeTheme} theme`
                      : "Resume PDF Preview"
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-md border border-gray-300 bg-gray-100">
                  <div className="text-gray-500">
                    {isLoadingJsonTheme
                      ? `Generating ${settings.jsonResumeTheme} theme preview...`
                      : "Generating PDF preview..."}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Control Bar */}
          <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600">
            <div className="ml-1 flex items-center gap-2 lg:ml-8">
              {/* Download Resume Button */}
              <a
                className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100"
                href={isJsonResumeTheme ? pdfUrl || "#" : instance.url!}
                download={
                  isJsonResumeTheme
                    ? `${resume.profile.name || "Resume"} - ${
                        settings.jsonResumeTheme
                      }.pdf`
                    : fileName
                }
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span className="whitespace-nowrap">Download Resume</span>
              </a>
              {/* Export JSON Button with Dropdown */}
              <div className="json-export-dropdown relative">
                <button
                  className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  <span className="whitespace-nowrap">Export JSON</span>
                  <ChevronDownIcon className="h-3 w-3" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute bottom-full right-0 mb-1 w-48 rounded-md border border-gray-300 bg-white shadow-lg">
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50"
                      onClick={downloadJson}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span>Download JSON File</span>
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50"
                      onClick={copyJsonToClipboard}
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                      <span>Copy to Clipboard</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
      </div>
    </>
  );
};

/**
 * Load PDFPreview client side since it uses usePDF, which is a web specific API
 */
export const PDFPreview = dynamic(() => Promise.resolve(PDFPreviewComponent), {
  ssr: false,
});
