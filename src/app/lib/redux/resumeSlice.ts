import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import type {
  FeaturedSkill,
  Resume,
  ResumeEducation,
  ResumeProfile,
  ResumeProfileLink,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
  ResumeVolunteer,
  ResumeAward,
  ResumeCertificate,
  ResumePublication,
  ResumeLanguage,
  ResumeInterest,
  ResumeReference,
} from "lib/redux/types";
import type { ShowForm } from "lib/redux/settingsSlice";

export const initialProfile: ResumeProfile = {
  name: "",
  label: "",
  image: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  url: "",
  profiles: [],
};

export const initialProfileLink: ResumeProfileLink = {
  network: "",
  username: "",
  url: "",
};

export const initialWorkExperience: ResumeWorkExperience = {
  company: "",
  location: "",
  description: "",
  jobTitle: "",
  url: "",
  date: "",
  summary: "",
  descriptions: [],
};

export const initialEducation: ResumeEducation = {
  school: "",
  url: "",
  degree: "",
  gpa: "",
  date: "",
  descriptions: [],
};

export const initialProject: ResumeProject = {
  project: "",
  description: "",
  date: "",
  url: "",
  keywords: [],
  roles: [],
  entity: "",
  type: "",
  descriptions: [],
};

export const initialFeaturedSkill: FeaturedSkill = {
  skill: "",
  rating: 1,
};

export const initialSkills: ResumeSkills = {
  featuredSkills: Array(6).fill(0).map(() => ({ ...initialFeaturedSkill })),
  descriptions: [],
};

export const initialVolunteer: ResumeVolunteer = {
  organization: "",
  position: "",
  url: "",
  startDate: "",
  endDate: "",
  summary: "",
  highlights: [],
};

export const initialAward: ResumeAward = {
  title: "",
  date: "",
  awarder: "",
  summary: "",
};

export const initialCertificate: ResumeCertificate = {
  name: "",
  date: "",
  url: "",
  issuer: "",
};

export const initialPublication: ResumePublication = {
  name: "",
  publisher: "",
  releaseDate: "",
  url: "",
  summary: "",
};

export const initialLanguage: ResumeLanguage = {
  language: "",
  fluency: "",
};

export const initialInterest: ResumeInterest = {
  name: "",
  keywords: [],
};

export const initialReference: ResumeReference = {
  name: "",
  reference: "",
};

export const initialCustom = {
  descriptions: [],
};

export const initialResumeState: Resume = {
  profile: initialProfile,
  workExperiences: [initialWorkExperience],
  educations: [initialEducation],
  projects: [initialProject],
  skills: initialSkills,
  volunteer: [initialVolunteer],
  awards: [initialAward],
  certificates: [initialCertificate],
  publications: [initialPublication],
  languages: [initialLanguage],
  interests: [initialInterest],
  references: [initialReference],
  custom: initialCustom,
};

// Keep the field & value type in sync with CreateHandleChangeArgsWithDescriptions (components\ResumeForm\types.ts)
export type CreateChangeActionWithDescriptions<T> = {
  idx: number;
} & (
  | {
      field: Exclude<keyof T, "descriptions" | "highlights" | "keywords" | "profiles">;
      value: string;
    }
  | { field: "descriptions" | "highlights" | "keywords"; value: string[] }
  | { field: "profiles"; value: ResumeProfileLink[] }
);

export const resumeSlice = createSlice({
  name: "resume",
  initialState: initialResumeState,
  reducers: {
    changeProfile: (
      draft,
      action: PayloadAction<{ field: keyof ResumeProfile; value: string | ResumeProfileLink[] }>
    ) => {
      const { field, value } = action.payload;
      (draft.profile as any)[field] = value;
    },
    changeWorkExperiences: (
      draft,
      action: PayloadAction<
        CreateChangeActionWithDescriptions<ResumeWorkExperience>
      >
    ) => {
      const { idx, field, value } = action.payload;
      const workExperience = draft.workExperiences[idx];
      (workExperience as any)[field] = value;
    },
    changeEducations: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeEducation>>
    ) => {
      const { idx, field, value } = action.payload;
      const education = draft.educations[idx];
      (education as any)[field] = value;
    },
    changeProjects: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeProject>>
    ) => {
      const { idx, field, value } = action.payload;
      const project = draft.projects[idx];
      (project as any)[field] = value;
    },
    changeVolunteer: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeVolunteer>>
    ) => {
      const { idx, field, value } = action.payload;
      const volunteer = draft.volunteer[idx];
      (volunteer as any)[field] = value;
    },
    changeAwards: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeAward>>
    ) => {
      const { idx, field, value } = action.payload;
      const award = draft.awards[idx];
      (award as any)[field] = value;
    },
    changeCertificates: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeCertificate>>
    ) => {
      const { idx, field, value } = action.payload;
      const certificate = draft.certificates[idx];
      (certificate as any)[field] = value;
    },
    changePublications: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumePublication>>
    ) => {
      const { idx, field, value } = action.payload;
      const publication = draft.publications[idx];
      (publication as any)[field] = value;
    },
    changeLanguages: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeLanguage>>
    ) => {
      const { idx, field, value } = action.payload;
      const language = draft.languages[idx];
      (language as any)[field] = value;
    },
    changeInterests: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeInterest>>
    ) => {
      const { idx, field, value } = action.payload;
      const interest = draft.interests[idx];
      (interest as any)[field] = value;
    },
    changeReferences: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeReference>>
    ) => {
      const { idx, field, value } = action.payload;
      const reference = draft.references[idx];
      (reference as any)[field] = value;
    },
    changeSkills: (
      draft,
      action: PayloadAction<
        | { field: "descriptions"; value: string[] }
        | {
            field: "featuredSkills";
            idx: number;
            skill: string;
            rating: number;
          }
      >
    ) => {
      const { field } = action.payload;
      if (field === "descriptions") {
        const { value } = action.payload;
        draft.skills.descriptions = value;
      } else {
        const { idx, skill, rating } = action.payload;
        const featuredSkill = draft.skills.featuredSkills[idx];
        featuredSkill.skill = skill;
        featuredSkill.rating = rating;
      }
    },
    changeCustom: (
      draft,
      action: PayloadAction<{ field: "descriptions"; value: string[] }>
    ) => {
      const { value } = action.payload;
      draft.custom.descriptions = value;
    },
    addSectionInForm: (draft, action: PayloadAction<{ form: ShowForm }>) => {
      const { form } = action.payload;
      switch (form) {
        case "workExperiences": {
          draft.workExperiences.push(structuredClone(initialWorkExperience));
          return draft;
        }
        case "educations": {
          draft.educations.push(structuredClone(initialEducation));
          return draft;
        }
        case "projects": {
          draft.projects.push(structuredClone(initialProject));
          return draft;
        }
        case "volunteer": {
          draft.volunteer.push(structuredClone(initialVolunteer));
          return draft;
        }
        case "awards": {
          draft.awards.push(structuredClone(initialAward));
          return draft;
        }
        case "certificates": {
          draft.certificates.push(structuredClone(initialCertificate));
          return draft;
        }
        case "publications": {
          draft.publications.push(structuredClone(initialPublication));
          return draft;
        }
        case "languages": {
          draft.languages.push(structuredClone(initialLanguage));
          return draft;
        }
        case "interests": {
          draft.interests.push(structuredClone(initialInterest));
          return draft;
        }
        case "references": {
          draft.references.push(structuredClone(initialReference));
          return draft;
        }
      }
    },
    moveSectionInForm: (
      draft,
      action: PayloadAction<{
        form: ShowForm;
        idx: number;
        direction: "up" | "down";
      }>
    ) => {
      const { form, idx, direction } = action.payload;
      if (form !== "skills" && form !== "custom") {
        const sections = draft[form] as any[];
        if (
          (idx === 0 && direction === "up") ||
          (idx === sections.length - 1 && direction === "down")
        ) {
          return draft;
        }

        const section = sections[idx];
        if (direction === "up") {
          sections[idx] = sections[idx - 1];
          sections[idx - 1] = section;
        } else {
          sections[idx] = sections[idx + 1];
          sections[idx + 1] = section;
        }
      }
    },
    deleteSectionInFormByIdx: (
      draft,
      action: PayloadAction<{ form: ShowForm; idx: number }>
    ) => {
      const { form, idx } = action.payload;
      if (form !== "skills" && form !== "custom") {
        (draft[form] as any[]).splice(idx, 1);
      }
    },
    setResume: (draft, action: PayloadAction<Resume>) => {
      return action.payload;
    },
  },
});

export const {
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeVolunteer,
  changeAwards,
  changeCertificates,
  changePublications,
  changeLanguages,
  changeInterests,
  changeReferences,
  changeSkills,
  changeCustom,
  addSectionInForm,
  moveSectionInForm,
  deleteSectionInFormByIdx,
  setResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;

export const selectResume = (state: RootState) => state.resume;
export const selectProfile = (state: RootState) => state.resume.profile;
export const selectWorkExperiences = (state: RootState) => state.resume.workExperiences;
export const selectEducations = (state: RootState) => state.resume.educations;
export const selectProjects = (state: RootState) => state.resume.projects;
export const selectSkills = (state: RootState) => state.resume.skills;
export const selectVolunteer = (state: RootState) => state.resume.volunteer;
export const selectAwards = (state: RootState) => state.resume.awards;
export const selectCertificates = (state: RootState) => state.resume.certificates;
export const selectPublications = (state: RootState) => state.resume.publications;
export const selectLanguages = (state: RootState) => state.resume.languages;
export const selectInterests = (state: RootState) => state.resume.interests;
export const selectReferences = (state: RootState) => state.resume.references;
export const selectCustom = (state: RootState) => state.resume.custom;
