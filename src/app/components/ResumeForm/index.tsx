"use client";
import { useState, useEffect, useRef } from "react";
import {
  useAppSelector,
  useAppDispatch,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import { ShowForm, selectFormsOrder, selectFormToShow, changeShowForm, setSettings, selectSettings } from "lib/redux/settingsSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "components/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "components/ResumeForm/EducationsForm";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { VolunteerForm } from "components/ResumeForm/VolunteerForm";
import { AwardsForm } from "components/ResumeForm/AwardsForm";
import { CertificatesForm } from "components/ResumeForm/CertificatesForm";
import { PublicationsForm } from "components/ResumeForm/PublicationsForm";
import { LanguagesForm } from "components/ResumeForm/LanguagesForm";
import { InterestsForm } from "components/ResumeForm/InterestsForm";
import { ReferencesForm } from "components/ResumeForm/ReferencesForm";
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
  volunteer: VolunteerForm,
  awards: AwardsForm,
  certificates: CertificatesForm,
  publications: PublicationsForm,
  languages: LanguagesForm,
  interests: InterestsForm,
  references: ReferencesForm,
  custom: CustomForm,
};

// Complete list of all sections for migration
const COMPLETE_FORMS_ORDER: ShowForm[] = [
  "workExperiences",
  "educations", 
  "projects", 
  "skills",
  "volunteer",
  "awards",
  "certificates",
  "publications",
  "languages",
  "interests",
  "references",
  "custom"
];

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const dispatch = useAppDispatch();
  const formsOrder = useAppSelector(selectFormsOrder);
  const formToShow = useAppSelector(selectFormToShow);
  const settings = useAppSelector(selectSettings);
  const resume = useAppSelector(selectResume);
  const [isHover, setIsHover] = useState(false);
  const [isManualEntryExpanded, setIsManualEntryExpanded] = useState(true);
  const [isThemeSelectorExpanded, setIsThemeSelectorExpanded] = useState(false);
  
  // Track previous resume state to detect bulk imports
  const previousResumeRef = useRef<string>("");

  // Migration logic for existing users - run immediately and only once per session
  useEffect(() => {
    const runMigration = () => {
      let needsUpdate = false;
      const updatedSettings = { ...settings };

      // Check if new sections are missing from formsOrder
      const missingForms = COMPLETE_FORMS_ORDER.filter(form => !formsOrder.includes(form));
      
      if (missingForms.length > 0) {
        const updatedOrder = [...formsOrder];
        
        missingForms.forEach(form => {
          // Find the ideal position for this form based on COMPLETE_FORMS_ORDER
          const idealIndex = COMPLETE_FORMS_ORDER.indexOf(form);
          
          // Find the best insertion point in the current order
          let insertIndex = updatedOrder.length;
          for (let i = idealIndex + 1; i < COMPLETE_FORMS_ORDER.length; i++) {
            const nextForm = COMPLETE_FORMS_ORDER[i];
            const nextFormIndex = updatedOrder.indexOf(nextForm);
            if (nextFormIndex !== -1) {
              insertIndex = nextFormIndex;
              break;
            }
          }
          
          updatedOrder.splice(insertIndex, 0, form);
        });
        
        updatedSettings.formsOrder = updatedOrder;
        needsUpdate = true;
      }

      // Check if new sections need to be enabled in formToShow
      const newSections: ShowForm[] = ["volunteer", "awards", "certificates", "publications", "languages", "interests", "references"];
      const missingVisibility = newSections.filter(section => !formToShow[section]);
      
      if (missingVisibility.length > 0) {
        newSections.forEach(section => {
          if (!formToShow[section]) {
            updatedSettings.formToShow[section] = true;
            needsUpdate = true;
          }
        });
      }

      if (needsUpdate) {
        dispatch(setSettings(updatedSettings));
        return true;
      }

      return false;
    };

    // Run migration immediately when component mounts
    runMigration();
  }, []);

  // Auto-collapse manual entry when JSON resume is imported
  // Only collapse if this looks like a bulk import (multiple sections changed simultaneously)
  useEffect(() => {
    const currentResumeString = JSON.stringify(resume);
    const previousResumeString = previousResumeRef.current;
    
    if (previousResumeString && currentResumeString !== previousResumeString) {
      try {
        const previousResume = JSON.parse(previousResumeString);
        
        // Check how many major sections changed in this update
        const sectionsChanged = [
          JSON.stringify(previousResume.profile) !== JSON.stringify(resume.profile),
          JSON.stringify(previousResume.workExperiences) !== JSON.stringify(resume.workExperiences),
          JSON.stringify(previousResume.educations) !== JSON.stringify(resume.educations),
          JSON.stringify(previousResume.projects) !== JSON.stringify(resume.projects),
          JSON.stringify(previousResume.skills) !== JSON.stringify(resume.skills),
        ].filter(Boolean).length;
        
        // Only auto-collapse if multiple sections changed simultaneously (likely JSON import)
        // Single keystroke updates typically only change one section
        if (sectionsChanged >= 2) {
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
      } catch (error) {
        // If JSON parsing fails, don't auto-collapse
        console.warn("Failed to parse previous resume state for auto-collapse detection");
      }
    }
    
    previousResumeRef.current = currentResumeString;
  }, [resume]);

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
