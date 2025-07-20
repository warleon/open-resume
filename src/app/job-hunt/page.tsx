"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import { setJobUrl } from "lib/redux/jobHuntSlice";
import { URLInput, JobPreviewPanel, AnalysisPanel, InstructionsPanel } from "./components";
import type { JobPreviewPanelRef } from "./components/JobPreviewPanel";

function JobHuntContent() {
  const dispatch = useAppDispatch();
  const jobPreviewRef = useRef<JobPreviewPanelRef>(null);
  
  const { jobUrl, isValidUrl } = useAppSelector((state) => state.jobHunt);

  // Event handlers for child components
  const handleUrlChange = (url: string) => {
    dispatch(setJobUrl(url));
  };

  return (
    <main className="h-full w-full bg-gray-50">
      {/* URL Input Section */}
      <URLInput
        jobUrl={jobUrl}
        isValidUrl={isValidUrl}
        onUrlChange={handleUrlChange}
      />

      {/* Main Content - Job Preview and Analysis */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 h-[calc(100vh-140px)]">
        {/* Job Preview Panel */}
        <JobPreviewPanel
          ref={jobPreviewRef}
          jobUrl={jobUrl}
          isValidUrl={isValidUrl}
        />

        {/* Analysis Panel */}
        <AnalysisPanel
          jobPreviewRef={jobPreviewRef}
        />
      </div>

      {/* Instructions Panel */}
      <InstructionsPanel />
    </main>
  );
}

export default function JobHunt() {
  return (
    <Provider store={store}>
      <JobHuntContent />
    </Provider>
  );
} 