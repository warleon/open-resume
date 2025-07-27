import { Page, View, Document } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { ResumePDFVolunteer } from "components/Resume/ResumePDF/ResumePDFVolunteer";
import { ResumePDFAwards } from "components/Resume/ResumePDF/ResumePDFAwards";
import { ResumePDFCertificates } from "components/Resume/ResumePDF/ResumePDFCertificates";
import { ResumePDFPublications } from "components/Resume/ResumePDF/ResumePDFPublications";
import { ResumePDFLanguages } from "components/Resume/ResumePDF/ResumePDFLanguages";
import { ResumePDFInterests } from "components/Resume/ResumePDF/ResumePDFInterests";
import { ResumePDFReferences } from "components/Resume/ResumePDF/ResumePDFReferences";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";

/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */
export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const {
    profile,
    workExperiences,
    educations,
    projects,
    skills,
    custom,
    volunteer,
    awards,
    certificates,
    publications,
    languages,
    interests,
    references,
  } = resume;
  const { name } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;

  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["educations"]}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading["projects"]}
        projects={projects}
        themeColor={themeColor}
      />
    ),
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading["skills"]}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["skills"]}
      />
    ),
    volunteer: () => (
      <ResumePDFVolunteer
        heading={formToHeading["volunteer"]}
        volunteer={volunteer}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["volunteer"]}
      />
    ),
    awards: () => (
      <ResumePDFAwards
        heading={formToHeading["awards"]}
        awards={awards}
        themeColor={themeColor}
      />
    ),
    certificates: () => (
      <ResumePDFCertificates
        heading={formToHeading["certificates"]}
        certificates={certificates}
        themeColor={themeColor}
      />
    ),
    publications: () => (
      <ResumePDFPublications
        heading={formToHeading["publications"]}
        publications={publications}
        themeColor={themeColor}
      />
    ),
    languages: () => (
      <ResumePDFLanguages
        heading={formToHeading["languages"]}
        languages={languages}
        themeColor={themeColor}
      />
    ),
    interests: () => (
      <ResumePDFInterests
        heading={formToHeading["interests"]}
        interests={interests}
        themeColor={themeColor}
      />
    ),
    references: () => (
      <ResumePDFReferences
        heading={formToHeading["references"]}
        references={references}
        themeColor={themeColor}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["custom"]}
      />
    ),
  };

  return (
    <>
      <Document title={`${name} Resume`} author={name} producer={"OpenResume"}>
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            ...styles.flexCol,
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + "pt",
          }}
        >
          {Boolean(settings.themeColor) && (
            <View
              style={{
                width: spacing["full"],
                height: spacing[3.5],
                backgroundColor: themeColor,
              }}
            />
          )}
          <View
            style={{
              ...styles.flexCol,
              padding: `${spacing[0]} ${spacing[20]}`,
            }}
          >
            <ResumePDFProfile
              profile={profile}
              themeColor={themeColor}
              isPDF={isPDF}
            />
            {showFormsOrder.map((form) => {
              const Component = formTypeToComponent[form];
              return <Component key={form} />;
            })}
          </View>
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
