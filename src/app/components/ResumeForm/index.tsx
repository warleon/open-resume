"use client";
import { useState, useEffect } from "react";
import {
  useAppSelector,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import { ShowForm, selectFormsOrder } from "lib/redux/settingsSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "components/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "components/ResumeForm/EducationsForm";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { JsonResumeDropzone } from "components/JsonResumeDropzone";
import { ExpanderWithHeightTransition } from "components/ExpanderWithHeightTransition";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);
  const resume = useAppSelector(selectResume);
  const [isHover, setIsHover] = useState(false);
  const [isManualEntryExpanded, setIsManualEntryExpanded] = useState(true);
  const [previousResumeString, setPreviousResumeString] = useState("");

  // Auto-collapse manual entry when JSON resume is imported
  useEffect(() => {
    const currentResumeString = JSON.stringify(resume);
    if (previousResumeString && currentResumeString !== previousResumeString) {
      // Check if this was likely a JSON import (significant change in resume data)
      const hasContentInMultipleSections = [
        resume.profile.name,
        resume.workExperiences.some(exp => exp.company),
        resume.educations.some(edu => edu.school),
        resume.projects.some(proj => proj.project),
        resume.skills.descriptions.length > 0
      ].filter(Boolean).length >= 2;

      if (hasContentInMultipleSections) {
        setIsManualEntryExpanded(false);
      }
    }
    setPreviousResumeString(currentResumeString);
  }, [resume, previousResumeString]);

  const toggleManualEntry = () => {
    setIsManualEntryExpanded(!isManualEntryExpanded);
  };

  return (
    <div
      className={cx(
        "flex justify-center scrollbar-thin scrollbar-track-gray-100 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end md:overflow-y-scroll",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section className="flex max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Import from JSON Resume
            </h2>
            <JsonResumeDropzone />
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Manual Entry
              </h2>
              <button
                type="button"
                onClick={toggleManualEntry}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isManualEntryExpanded ? (
                  <>
                    Collapse
                    <ChevronUpIcon className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Expand
                    <ChevronDownIcon className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            
            <ExpanderWithHeightTransition expanded={isManualEntryExpanded}>
              <div className="space-y-8">
                <ProfileForm />
                {formsOrder.map((form) => {
                  const Component = formTypeToComponent[form];
                  return <Component key={form} />;
                })}
              </div>
            </ExpanderWithHeightTransition>
          </div>
          
          {/* Theme Form - Outside of collapsible block */}
          <div className="border-t border-gray-200 pt-6">
            <ThemeForm />
          </div>
        </div>
        <br />
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};
