import { Paragraph } from "components/documentation";
import { cx } from "lib/cx";
import { Resume } from "lib/redux/types";
import {
  calculateDetailedResumeSimilarity,
  getSemaphoreColor,
} from "lib/resume-similarity";
import { useMemo } from "react";

interface props {
  resume: Resume;
}
export function Analysis({ resume }: props) {
  const similarityData = useMemo(() => {
    try {
      const originalResumeData = localStorage.getItem("originalResumeData");
      if (!originalResumeData) return null;

      const originalResume: Resume = JSON.parse(originalResumeData);
      const detailedSimilarity = calculateDetailedResumeSimilarity(
        originalResume,
        resume
      );
      const colorConfig = getSemaphoreColor(detailedSimilarity.overall);

      return {
        overall: detailedSimilarity.overall,
        sections: detailedSimilarity.sections,
        weights: detailedSimilarity.weights,
        percentage: Math.round(detailedSimilarity.overall * 100),
        ...colorConfig,
      };
    } catch (error) {
      console.error("Failed to calculate similarity:", error);
      return null;
    }
  }, [resume]);
  return (
    <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4">
      <Paragraph smallMarginTop={true}>
        <span className="font-semibold text-blue-800">
          Analyzing your generated resume!
        </span>{" "}
        This shows how your resume PDF would be parsed by Application Tracking
        Systems (ATS). The better the parsing results, the more ATS-friendly
        your resume is.
      </Paragraph>
      {similarityData && (
        <div
          className={cx(
            "mt-4 rounded-md border p-4",
            similarityData.bgColor,
            similarityData.borderColor
          )}
        >
          {/* Overall Score Header */}
          <div className="mb-4 flex items-center justify-between">
            <span className={cx("text-lg font-semibold", similarityData.color)}>
              ATS Similarity Score
            </span>
            <div
              className={cx(
                "rounded-full px-4 py-2 text-lg font-bold",
                similarityData.bgColor,
                similarityData.color,
                "ring-2 ring-white"
              )}
            >
              {similarityData.percentage}%
            </div>
          </div>

          {/* Overall Description */}
          <p className={cx("mb-4 text-sm", similarityData.color)}>
            This score indicates how accurately an ATS would parse your resume
            compared to your original data.
            {similarityData.percentage >= 80 &&
              " Excellent! Your resume is very ATS-friendly."}
            {similarityData.percentage >= 60 &&
              similarityData.percentage < 80 &&
              " Good, but there may be some parsing issues with certain fields."}
            {similarityData.percentage < 60 &&
              " Consider reformatting your resume for better ATS compatibility."}
          </p>

          {/* Section Breakdown */}
          <div className="space-y-3">
            <h4 className={cx("text-sm font-semibold", similarityData.color)}>
              Section Breakdown:
            </h4>

            {Object.entries(similarityData.sections).map(
              ([sectionKey, score]) => {
                const sectionScore = Math.round(score * 100);
                const sectionColors = getSemaphoreColor(score);
                const weight =
                  similarityData.weights[
                    sectionKey as keyof typeof similarityData.weights
                  ];
                const sectionLabels = {
                  profile: "Profile & Contact",
                  workExperiences: "Work Experience",
                  educations: "Education",
                  projects: "Projects",
                  skills: "Skills",
                  volunteer: "Volunteer Work",
                  awards: "Awards",
                  certificates: "Certificates",
                  publications: "Publications",
                  languages: "Languages",
                  interests: "Interests",
                  references: "References",
                  custom: "Custom Section",
                };

                // Get the appropriate progress bar color based on score
                const getProgressBarColor = (score: number) => {
                  if (score >= 0.8) return "#22c55e"; // green-500
                  if (score >= 0.6) return "#eab308"; // yellow-500
                  return "#ef4444"; // red-500
                };

                return (
                  <div
                    key={sectionKey}
                    className="flex items-center justify-between rounded bg-white/50 px-3 py-2"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        {
                          sectionLabels[
                            sectionKey as keyof typeof sectionLabels
                          ]
                        }
                      </span>
                      <span className="text-xs text-gray-500">
                        (weight: {Math.round(weight * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Progress bar */}
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${sectionScore}%`,
                            backgroundColor: getProgressBarColor(score),
                          }}
                        />
                      </div>
                      <span
                        className={cx(
                          "min-w-[3rem] rounded px-2 py-1 text-center text-xs font-semibold",
                          sectionColors.bgColor,
                          sectionColors.color
                        )}
                      >
                        {sectionScore}%
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}
