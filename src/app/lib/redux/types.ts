export interface ResumeProfile {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: string;
  profiles: ResumeProfileLink[];
}

export interface ResumeProfileLink {
  network: string;
  username: string;
  url: string;
}

export interface ResumeWorkExperience {
  company: string;
  location: string;
  description: string;
  jobTitle: string;
  url: string;
  date: string;
  summary: string;
  descriptions: string[];
}

export interface ResumeEducation {
  school: string;
  url: string;
  degree: string;
  date: string;
  gpa: string;
  descriptions: string[];
}

export interface ResumeProject {
  project: string;
  description: string;
  date: string;
  url: string;
  keywords: string[];
  roles: string[];
  entity: string;
  type: string;
  descriptions: string[];
}

export interface FeaturedSkill {
  skill: string;
  rating: number;
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[];
  descriptions: string[];
}

export interface ResumeVolunteer {
  organization: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

export interface ResumeAward {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

export interface ResumeCertificate {
  name: string;
  date: string;
  url: string;
  issuer: string;
}

export interface ResumePublication {
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
}

export interface ResumeLanguage {
  language: string;
  fluency: string;
}

export interface ResumeInterest {
  name: string;
  keywords: string[];
}

export interface ResumeReference {
  name: string;
  reference: string;
}

export interface ResumeCustom {
  descriptions: string[];
}

export interface Resume {
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  volunteer: ResumeVolunteer[];
  awards: ResumeAward[];
  certificates: ResumeCertificate[];
  publications: ResumePublication[];
  languages: ResumeLanguage[];
  interests: ResumeInterest[];
  references: ResumeReference[];
  custom: ResumeCustom;
}

export type ResumeKey = keyof Resume;
