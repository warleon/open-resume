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
import { ThemeSelector } from "components/ResumeForm/ThemeSelector";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { CollapsibleSection } from "components/ResumeForm/CollapsibleSection";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { JsonResumeDropzone } from "components/JsonResumeDropzone";
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
  const [isThemeSelectorExpanded, setIsThemeSelectorExpanded] = useState(false);
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

  const toggleThemeSelector = () => {
    setIsThemeSelectorExpanded(!isThemeSelectorExpanded);
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
          
          <CollapsibleSection
            title="Manual Entry"
            isExpanded={isManualEntryExpanded}
            onToggle={toggleManualEntry}
          >
            <div className="space-y-8">
              <ProfileForm />
              {formsOrder.map((form) => {
                const Component = formTypeToComponent[form];
                return <Component key={form} />;
              })}
            </div>
          </CollapsibleSection>
          
          {/* Theme Form - Outside of collapsible block */}
          <div className="border-t border-gray-200 pt-6">
            <ThemeForm />
          </div>
          
          {/* Theme Selector - Collapsible */}
          <CollapsibleSection
            title="Theme Selector"
            isExpanded={isThemeSelectorExpanded}
            onToggle={toggleThemeSelector}
          >
            <ThemeSelector />
          </CollapsibleSection>
        </div>
        <br />
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};
