import { useState } from "react";
import { DocumentArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useAppDispatch } from "lib/redux/hooks";
import { setResume } from "lib/redux/resumeSlice";
import { cx } from "lib/cx";
import type { Resume } from "lib/redux/types";
import { JsonResume, convertFromJsonResume } from "lib/convert-to-json-resume";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
};

export const JsonResumeDropzone = ({
  className,
}: {
  className?: string;
}) => {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasInvalidFile, setHasInvalidFile] = useState(false);
  const [error, setError] = useState<string>("");
  const dispatch = useAppDispatch();

  const hasFile = Boolean(file.name);

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl });
    setError("");
    setHasInvalidFile(false);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile.name.endsWith(".json")) {
      setNewFile(newFile);
    } else {
      setHasInvalidFile(true);
      setError("Only JSON files are supported");
    }
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFile = files[0];
    setNewFile(newFile);
  };

  const onRemove = () => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }
    setFile(defaultFileState);
    setError("");
    setHasInvalidFile(false);
  };

  const onImportClick = async () => {
    try {
      if (!file.fileUrl) return;

      const response = await fetch(file.fileUrl);
      const jsonText = await response.text();
      const jsonData: JsonResume = JSON.parse(jsonText);

      const resume = convertFromJsonResume(jsonData);
      dispatch(setResume(resume));
      
      setError("");
      onRemove(); // Clean up after successful import
    } catch (err) {
      setError("Invalid JSON file or unsupported format");
      console.error("JSON import error:", err);
    }
  };

  const getFileSizeString = (fileSizeB: number) => {
    const fileSizeKB = fileSizeB / 1024;
    const fileSizeMB = fileSizeKB / 1024;
    if (fileSizeKB < 1000) {
      return fileSizeKB.toPrecision(3) + " KB";
    } else {
      return fileSizeMB.toPrecision(3) + " MB";
    }
  };

  return (
    <div
      className={cx(
        "flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-8",
        isHoveredOnDropzone && "border-sky-400",
        className
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsHoveredOnDropzone(true);
      }}
      onDragLeave={() => setIsHoveredOnDropzone(false)}
      onDrop={onDrop}
    >
      <div className="text-center space-y-3">
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        
        {!hasFile ? (
          <>
            <p className="text-lg font-semibold text-gray-700">
              Drop JSON Resume file here
            </p>
            <p className="text-sm text-gray-500">
              Supports JSON Resume schema format
            </p>
            <p className="flex justify-center text-sm text-gray-500">
              <LockClosedIcon className="mr-1 mt-1 h-3 w-3 text-gray-400" />
              File data is used locally and never leaves your browser
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <div className="font-semibold text-gray-900">
              {file.name} - {getFileSizeString(file.size)}
            </div>
            <button
              type="button"
              className="outline-theme-blue rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              title="Remove file"
              onClick={onRemove}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        )}

        <div className="pt-4">
          {!hasFile ? (
            <label className="within-outline-theme-purple cursor-pointer rounded-full bg-primary px-6 pb-2.5 pt-2 font-semibold shadow-sm">
              Browse JSON file
              <input
                type="file"
                className="sr-only"
                accept=".json"
                onChange={onInputChange}
              />
            </label>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={onImportClick}
            >
              Import JSON Resume <span aria-hidden="true">→</span>
            </button>
          )}
          
          {(hasInvalidFile || error) && (
            <p className="mt-4 text-red-400">
              {error || "Only JSON files are supported"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 