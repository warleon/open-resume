import { Link, Paragraph } from "components/documentation";
import { ResumeDropzone } from "components/ResumeDropzone";
import { cx } from "lib/cx";
import { Dispatch, SetStateAction, useState } from "react";

interface props {
  RESUME_EXAMPLES: { fileUrl: string; description: JSX.Element }[];
  fileUrl: string;
  setFileUrl: Dispatch<SetStateAction<string>>;
}
// Helper function to get initial file URL

export function Examples({ RESUME_EXAMPLES, fileUrl, setFileUrl }: props) {
  const [resumeExamples, setResumeExamples] = useState(() => {
    return RESUME_EXAMPLES;
  });
  return (
    <>
      <Paragraph smallMarginTop={true}>
        This playground showcases the OpenResume resume parser and its ability
        to parse information from a resume PDF. Click around the PDF examples
        below to observe different parsing results.
      </Paragraph>
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
              if (["Enter", " "].includes(e.key)) setFileUrl(example.fileUrl);
            }}
            tabIndex={0}
          >
            <h1 className="font-semibold">Resume Example {idx + 1}</h1>
            <p className="mt-2 text-sm text-gray-500">{example.description}</p>
          </article>
        ))}
      </div>
      <Paragraph>
        You can also{" "}
        <span className="font-semibold">add your resume below</span> to access
        how well your resume would be parsed by similar Application Tracking
        Systems (ATS) used in job applications. The more information it can
        parse out, the better it indicates the resume is well formatted and easy
        to read. It is beneficial to have the name and email accurately parsed
        at the very least.
      </Paragraph>
      <div className="mt-3">
        <ResumeDropzone
          onFileUrlChange={(fileUrl) => setFileUrl(fileUrl)}
          playgroundView={true}
        />
      </div>
    </>
  );
}
