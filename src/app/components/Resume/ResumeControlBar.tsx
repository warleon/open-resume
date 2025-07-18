"use client";
import { useEffect, useState } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { convertToJsonResume } from "lib/convert-to-json-resume";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const resume = useAppSelector(selectResume);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.json-export-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      window.document.addEventListener('click', handleClickOutside);
      return () => window.document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const [instance, update] = usePDF({ document });

  // Hook to update pdf when document changes
  useEffect(() => {
    update();
  }, [update, document]);

  const downloadJson = () => {
    const jsonResume = convertToJsonResume(resume);
    const jsonResumeWithSchema = {
      "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
      ...jsonResume
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
      "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
      ...jsonResume
    };
    const jsonData = JSON.stringify(jsonResumeWithSchema, null, 2);
    try {
      await navigator.clipboard.writeText(jsonData);
      // You could add a toast notification here if desired
      console.log("JSON data copied to clipboard");
    } catch (err) {
      console.error("Failed to copy JSON to clipboard:", err);
      // Fallback for older browsers
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
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <div className="ml-1 flex items-center gap-2 lg:ml-8">
        {/* Download Resume Button */}
        <a
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100"
          href={instance.url!}
          download={fileName}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Download Resume</span>
        </a>
        {/* Export JSON Button with Dropdown */}
        <div className="relative json-export-dropdown">
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
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
