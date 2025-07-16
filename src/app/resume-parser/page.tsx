"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "components/ResumeDropzone";
import { cx } from "lib/cx";
import { Heading, Link, Paragraph } from "components/documentation";
import { ResumeTable } from "resume-parser/ResumeTable";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { ResumeParserAlgorithmArticle } from "resume-parser/ResumeParserAlgorithmArticle";
import { Button } from "components/Button";
import { calculateDetailedResumeSimilarity, getSemaphoreColor } from "lib/resume-similarity";
import type { Resume } from "lib/redux/types";

const RESUME_EXAMPLES = [
  {
    fileUrl: "resume-example/laverne-resume.pdf",
    description: (
      <span>
        Borrowed from University of La Verne Career Center -{" "}
        <Link href="https://laverne.edu/careers/wp-content/uploads/sites/15/2010/12/Undergraduate-Student-Resume-Examples.pdf">
          Link
        </Link>
      </span>
    ),
  },
  {
    fileUrl: "resume-example/openresume-resume.pdf",
    description: (
      <span>
        Created with OpenResume resume builder -{" "}
        <Link href="/resume-builder">Link</Link>
      </span>
    ),
  },
];

let CURRENT_RESUME_EXAMPLES = [...RESUME_EXAMPLES];

const defaultFileUrl = RESUME_EXAMPLES[0]["fileUrl"];

// Helper function to get initial file URL
const getInitialFileUrl = (isFromBuilder: boolean) => {
  if (isFromBuilder) {
    const generatedUrl = localStorage.getItem("generatedResumeUrl");
    return generatedUrl || defaultFileUrl;
  }
  return defaultFileUrl;
};

export default function ResumeParser() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFromBuilder = searchParams.get("source") === "builder";
  const [fileUrl, setFileUrl] = useState(() => getInitialFileUrl(isFromBuilder));
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [resumeExamples, setResumeExamples] = useState(() => {
    if (isFromBuilder) {
      const generatedUrl = localStorage.getItem("generatedResumeUrl");
      if (generatedUrl) {
        const generatedExample = {
          fileUrl: generatedUrl,
          description: (
            <span>
              Generated from OpenResume builder -{" "}
              <Link href="/resume-builder">Return to builder</Link>
            </span>
          ),
        };
        return [generatedExample, ...RESUME_EXAMPLES];
      }
    }
    return CURRENT_RESUME_EXAMPLES;
  });
  
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  // Calculate similarity score when coming from builder
  const similarityData = useMemo(() => {
    if (!isFromBuilder) return null;
    
    try {
      const originalResumeData = localStorage.getItem("originalResumeData");
      if (!originalResumeData) return null;
      
      const originalResume: Resume = JSON.parse(originalResumeData);
      const detailedSimilarity = calculateDetailedResumeSimilarity(originalResume, resume);
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
  }, [isFromBuilder, resume]);



  useEffect(() => {
    const loadPdf = async () => {
      const textItems = await readPdf(fileUrl);
      setTextItems(textItems);
    };
    loadPdf();
  }, [fileUrl]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      const generatedUrl = localStorage.getItem("generatedResumeUrl");
      if (generatedUrl && generatedUrl.startsWith("blob:")) {
        URL.revokeObjectURL(generatedUrl);
      }
      // Clean up original resume data
      localStorage.removeItem("originalResumeData");
    };
  }, []);

  const handleReturnToBuilder = () => {
    // Clean up blob URLs
    const generatedUrl = localStorage.getItem("generatedResumeUrl");
    if (generatedUrl && generatedUrl.startsWith("blob:")) {
      URL.revokeObjectURL(generatedUrl);
    }
    localStorage.removeItem("generatedResumeUrl");
    localStorage.removeItem("generatedResumeFileName");
    localStorage.removeItem("originalResumeData");
    
    router.push("/resume-builder");
  };

  return (
    <main className="h-full w-full overflow-hidden">
      <div className="grid md:grid-cols-6">
        {true && (
          <div className="flex justify-center md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))]  relative">
            {isFromBuilder && (
              <div className="absolute top-1/2 -translate-y-1/2 -left-2 z-10">
                <Button
                  onClick={handleReturnToBuilder}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2 text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span className="text-lg">←</span>
                  <span>Return to Builder</span>
                </Button>
              </div>
            )}
            <section className="mt-5 grow px-4">
              <div className="w-full h-full mx-auto md:p-[var(--resume-padding)]">
                <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full" />
              </div>
            </section>
          </div>
        )}
        <div className="flex px-6 text-gray-900 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll">
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
          <section className="max-w-[600px] grow">
            <Heading className="text-primary !mt-4">
              Resume Parser Playground
            </Heading>
            {isFromBuilder ? (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <Paragraph smallMarginTop={true}>
                  <span className="font-semibold text-blue-800">
                    Analyzing your generated resume!
                  </span>{" "}
                  This shows how your resume PDF would be parsed by Application
                  Tracking Systems (ATS). The better the parsing results, the more
                  ATS-friendly your resume is.
                </Paragraph>
                {similarityData && (
                  <div className={cx(
                    "mt-4 p-4 rounded-md border",
                    similarityData.bgColor,
                    similarityData.borderColor
                  )}>
                    {/* Overall Score Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={cx("font-semibold text-lg", similarityData.color)}>
                        ATS Similarity Score
                      </span>
                      <div className={cx(
                        "px-4 py-2 rounded-full text-lg font-bold",
                        similarityData.bgColor,
                        similarityData.color,
                        "ring-2 ring-white"
                      )}>
                        {similarityData.percentage}%
                      </div>
                    </div>
                    
                    {/* Overall Description */}
                    <p className={cx("text-sm mb-4", similarityData.color)}>
                      This score indicates how accurately an ATS would parse your resume compared to your original data.
                      {similarityData.percentage >= 80 && " Excellent! Your resume is very ATS-friendly."}
                      {similarityData.percentage >= 60 && similarityData.percentage < 80 && " Good, but there may be some parsing issues with certain fields."}
                      {similarityData.percentage < 60 && " Consider reformatting your resume for better ATS compatibility."}
                    </p>

                    {/* Section Breakdown */}
                    <div className="space-y-3">
                      <h4 className={cx("font-semibold text-sm", similarityData.color)}>
                        Section Breakdown:
                      </h4>
                      
                                             {Object.entries(similarityData.sections).map(([sectionKey, score]) => {
                         const sectionScore = Math.round(score * 100);
                         const sectionColors = getSemaphoreColor(score);
                         const weight = similarityData.weights[sectionKey as keyof typeof similarityData.weights];
                         const sectionLabels = {
                           profile: "Profile & Contact",
                           workExperiences: "Work Experience", 
                           educations: "Education",
                           projects: "Projects",
                           skills: "Skills"
                         };
                         
                         // Get the appropriate progress bar color based on score
                         const getProgressBarColor = (score: number) => {
                           if (score >= 0.8) return "#22c55e"; // green-500
                           if (score >= 0.6) return "#eab308"; // yellow-500
                           return "#ef4444"; // red-500
                         };
                         
                         return (
                           <div key={sectionKey} className="flex items-center justify-between py-2 px-3 bg-white/50 rounded">
                             <div className="flex items-center space-x-2">
                               <span className="text-sm font-medium text-gray-700">
                                 {sectionLabels[sectionKey as keyof typeof sectionLabels]}
                               </span>
                               <span className="text-xs text-gray-500">
                                 (weight: {Math.round(weight * 100)}%)
                               </span>
                             </div>
                             <div className="flex items-center space-x-2">
                               {/* Progress bar */}
                               <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div 
                                   className="h-full transition-all duration-300 rounded-full"
                                   style={{ 
                                     width: `${sectionScore}%`,
                                     backgroundColor: getProgressBarColor(score)
                                   }}
                                 />
                               </div>
                               <span className={cx(
                                 "px-2 py-1 rounded text-xs font-semibold min-w-[3rem] text-center",
                                 sectionColors.bgColor,
                                 sectionColors.color
                               )}>
                                 {sectionScore}%
                               </span>
                             </div>
                           </div>
                         );
                       })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Paragraph smallMarginTop={true}>
                This playground showcases the OpenResume resume parser and its
                ability to parse information from a resume PDF. Click around the
                PDF examples below to observe different parsing results.
              </Paragraph>
            )}
            {!isFromBuilder && (
              <div className="mt-3 flex gap-3">
                {resumeExamples.map((example, idx) => (
                  <article
                    key={idx}
                    className={cx(
                      "flex-1 cursor-pointer rounded-md border-2 px-4 py-3 shadow-sm outline-none hover:bg-gray-50 focus:bg-gray-50",
                      example.fileUrl === fileUrl
                        ? "border-blue-400"
                        : "border-gray-300"
                    )}
                    onClick={() => setFileUrl(example.fileUrl)}
                    onKeyDown={(e) => {
                      if (["Enter", " "].includes(e.key))
                        setFileUrl(example.fileUrl);
                    }}
                    tabIndex={0}
                  >
                    <h1 className="font-semibold">Resume Example {idx + 1}</h1>
                    <p className="mt-2 text-sm text-gray-500">
                      {example.description}
                    </p>
                  </article>
                ))}
              </div>
            )}
            {!isFromBuilder && (
              <>
                <Paragraph>
                  You can also{" "}
                  <span className="font-semibold">add your resume below</span> to
                  access how well your resume would be parsed by similar Application
                  Tracking Systems (ATS) used in job applications. The more
                  information it can parse out, the better it indicates the resume
                  is well formatted and easy to read. It is beneficial to have the
                  name and email accurately parsed at the very least.
                </Paragraph>
                <div className="mt-3">
                  <ResumeDropzone
                    onFileUrlChange={(fileUrl) =>
                      setFileUrl(fileUrl || defaultFileUrl)
                    }
                    playgroundView={true}
                  />
                </div>
              </>
            )}
            <Heading level={2} className="!mt-[1.2em]">
              Resume Parsing Results
            </Heading>
            <ResumeTable resume={resume} />
            <ResumeParserAlgorithmArticle
              textItems={textItems}
              lines={lines}
              sections={sections}
            />
            <div className="pt-24" />
          </section>
        </div>
      </div>
    </main>
  );
}
