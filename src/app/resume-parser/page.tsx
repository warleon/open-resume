"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
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
import {
  calculateDetailedResumeSimilarity,
  getSemaphoreColor,
} from "lib/resume-similarity";
import type { Resume } from "lib/redux/types";
import { Examples } from "./Examples";
import { Analysis } from "./Analysis";

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

const getInitialFileUrl = (isFromBuilder: boolean) => {
  const defaultFileUrl = RESUME_EXAMPLES[0]["fileUrl"];
  if (isFromBuilder) {
    const generatedUrl = localStorage.getItem("generatedResumeUrl");
    return generatedUrl || defaultFileUrl;
  }
  return defaultFileUrl;
};

const useIsFromBuilder = () => {
  const searchParams = useSearchParams();
  return searchParams.get("source") === "builder";
};

function ResumeParser() {
  const router = useRouter();
  const isFromBuilder = useIsFromBuilder();
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [fileUrl, setFileUrl] = useState(() =>
    getInitialFileUrl(isFromBuilder)
  );

  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  // Calculate similarity score when coming from builder

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
          <div className="relative flex justify-center md:col-span-3  md:h-[calc(100vh-var(--top-nav-bar-height))]">
            {isFromBuilder && (
              <div className="absolute -left-2 top-1/2 z-10 -translate-y-1/2">
                <Button
                  onClick={handleReturnToBuilder}
                  className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="text-lg">←</span>
                  <span>Return to Builder</span>
                </Button>
              </div>
            )}
            <section className="mt-5 grow px-4">
              <div className="mx-auto h-full w-full md:p-[var(--resume-padding)]">
                <iframe
                  src={`${fileUrl}#navpanes=0`}
                  className="h-full w-full"
                />
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
            {isFromBuilder && <Analysis resume={resume}></Analysis>}
            {!isFromBuilder && (
              <Examples
                {...{ fileUrl, RESUME_EXAMPLES, setFileUrl }}
              ></Examples>
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

export default function SuspendedResumeParser() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeParser />
    </Suspense>
  );
}
