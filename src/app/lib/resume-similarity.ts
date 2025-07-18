import type { Resume, ResumeProfile, ResumeWorkExperience, ResumeEducation, ResumeProject, ResumeSkills, ResumeVolunteer, ResumeAward, ResumeCertificate, ResumePublication, ResumeLanguage, ResumeInterest, ResumeReference, ResumeCustom } from "lib/redux/types";

/**
 * Calculate the similarity between two strings using Jaccard similarity
 * Jaccard similarity = |A ∩ B| / |A ∪ B|
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  if (!str1 && !str2) return 1; // Both empty strings are identical
  if (!str1 || !str2) return 0; // One empty, one not
  
  const normalize = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ');
  const s1 = normalize(str1);
  const s2 = normalize(str2);
  
  if (s1 === s2) return 1; // Exact match
  
  // Split into words for Jaccard similarity
  const words1 = new Set(s1.split(' ').filter(word => word.length > 0));
  const words2 = new Set(s2.split(' ').filter(word => word.length > 0));
  
  const intersection = new Set(Array.from(words1).filter(word => words2.has(word)));
  const union = new Set([...Array.from(words1), ...Array.from(words2)]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Calculate similarity between two arrays of strings
 */
function calculateArraySimilarity(arr1: string[], arr2: string[]): number {
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  // Compare each item in arr1 with the best match in arr2
  for (const item1 of arr1) {
    let bestMatch = 0;
    for (const item2 of arr2) {
      const similarity = calculateStringSimilarity(item1, item2);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  // Compare each item in arr2 with the best match in arr1
  for (const item2 of arr2) {
    let bestMatch = 0;
    for (const item1 of arr1) {
      const similarity = calculateStringSimilarity(item1, item2);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two profiles
 */
function calculateProfileSimilarity(profile1: ResumeProfile, profile2: ResumeProfile): number {
  const weights = {
    name: 0.25,
    email: 0.2,
    phone: 0.15,
    url: 0.1,
    summary: 0.2,
    location: 0.1,
  };
  
  let totalScore = 0;
  totalScore += calculateStringSimilarity(profile1.name, profile2.name) * weights.name;
  totalScore += calculateStringSimilarity(profile1.email, profile2.email) * weights.email;
  totalScore += calculateStringSimilarity(profile1.phone, profile2.phone) * weights.phone;
  totalScore += calculateStringSimilarity(profile1.url, profile2.url) * weights.url;
  totalScore += calculateStringSimilarity(profile1.summary, profile2.summary) * weights.summary;
  totalScore += calculateStringSimilarity(profile1.location, profile2.location) * weights.location;
  
  return totalScore;
}

/**
 * Calculate similarity between two work experience arrays
 */
function calculateWorkExperienceSimilarity(work1: ResumeWorkExperience[], work2: ResumeWorkExperience[]): number {
  if (work1.length === 0 && work2.length === 0) return 1;
  if (work1.length === 0 || work2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  // Compare each work experience in work1 with the best match in work2
  for (const exp1 of work1) {
    let bestMatch = 0;
    for (const exp2 of work2) {
      const companySim = calculateStringSimilarity(exp1.company, exp2.company);
      const titleSim = calculateStringSimilarity(exp1.jobTitle, exp2.jobTitle);
      const dateSim = calculateStringSimilarity(exp1.date, exp2.date);
      const descSim = calculateArraySimilarity(exp1.descriptions, exp2.descriptions);
      
      const similarity = (companySim * 0.3 + titleSim * 0.3 + dateSim * 0.1 + descSim * 0.3);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two education arrays
 */
function calculateEducationSimilarity(edu1: ResumeEducation[], edu2: ResumeEducation[]): number {
  if (edu1.length === 0 && edu2.length === 0) return 1;
  if (edu1.length === 0 || edu2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (const education1 of edu1) {
    let bestMatch = 0;
    for (const education2 of edu2) {
      const schoolSim = calculateStringSimilarity(education1.school, education2.school);
      const degreeSim = calculateStringSimilarity(education1.degree, education2.degree);
      const dateSim = calculateStringSimilarity(education1.date, education2.date);
      const gpaSim = calculateStringSimilarity(education1.gpa, education2.gpa);
      const descSim = calculateArraySimilarity(education1.descriptions, education2.descriptions);
      
      const similarity = (schoolSim * 0.3 + degreeSim * 0.3 + dateSim * 0.1 + gpaSim * 0.1 + descSim * 0.2);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two project arrays
 */
function calculateProjectSimilarity(proj1: ResumeProject[], proj2: ResumeProject[]): number {
  if (proj1.length === 0 && proj2.length === 0) return 1;
  if (proj1.length === 0 || proj2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (const project1 of proj1) {
    let bestMatch = 0;
    for (const project2 of proj2) {
      const projectSim = calculateStringSimilarity(project1.project, project2.project);
      const dateSim = calculateStringSimilarity(project1.date, project2.date);
      const descSim = calculateArraySimilarity(project1.descriptions, project2.descriptions);
      
      const similarity = (projectSim * 0.3 + dateSim * 0.1 + descSim * 0.6);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two skills objects
 */
function calculateSkillsSimilarity(skills1: ResumeSkills, skills2: ResumeSkills): number {
  // Compare featured skills
  const featuredSkillsNames1 = skills1.featuredSkills.map(fs => fs.skill);
  const featuredSkillsNames2 = skills2.featuredSkills.map(fs => fs.skill);
  const featuredSim = calculateArraySimilarity(featuredSkillsNames1, featuredSkillsNames2);
  
  // Compare skill descriptions
  const descSim = calculateArraySimilarity(skills1.descriptions, skills2.descriptions);
  
  return (featuredSim * 0.4 + descSim * 0.6);
}

/**
 * Calculate similarity between two volunteer arrays
 */
function calculateVolunteerSimilarity(vol1: ResumeVolunteer[], vol2: ResumeVolunteer[]): number {
  if (vol1.length === 0 && vol2.length === 0) return 1;
  if (vol1.length === 0 || vol2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (const volunteer1 of vol1) {
    let bestMatch = 0;
    for (const volunteer2 of vol2) {
      const organizationSim = calculateStringSimilarity(volunteer1.organization, volunteer2.organization);
      const positionSim = calculateStringSimilarity(volunteer1.position, volunteer2.position);
      const startDateSim = calculateStringSimilarity(volunteer1.startDate, volunteer2.startDate);
      const endDateSim = calculateStringSimilarity(volunteer1.endDate, volunteer2.endDate);
      const highlightsSim = calculateArraySimilarity(volunteer1.highlights, volunteer2.highlights);
      
      const similarity = (organizationSim * 0.3 + positionSim * 0.3 + startDateSim * 0.05 + endDateSim * 0.05 + highlightsSim * 0.3);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two awards arrays
 */
function calculateAwardsSimilarity(awards1: ResumeAward[], awards2: ResumeAward[]): number {
  if (awards1.length === 0 && awards2.length === 0) return 1;
  if (awards1.length === 0 || awards2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (const award1 of awards1) {
    let bestMatch = 0;
    for (const award2 of awards2) {
      const titleSim = calculateStringSimilarity(award1.title, award2.title);
      const dateSim = calculateStringSimilarity(award1.date, award2.date);
      const awarderSim = calculateStringSimilarity(award1.awarder, award2.awarder);
      const summarySim = calculateStringSimilarity(award1.summary, award2.summary);
      
      const similarity = (titleSim * 0.4 + dateSim * 0.2 + awarderSim * 0.2 + summarySim * 0.2);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two certificates arrays
 */
function calculateCertificatesSimilarity(certs1: ResumeCertificate[], certs2: ResumeCertificate[]): number {
  if (certs1.length === 0 && certs2.length === 0) return 1;
  if (certs1.length === 0 || certs2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (const cert1 of certs1) {
    let bestMatch = 0;
    for (const cert2 of certs2) {
      const nameSim = calculateStringSimilarity(cert1.name, cert2.name);
      const dateSim = calculateStringSimilarity(cert1.date, cert2.date);
      const issuerSim = calculateStringSimilarity(cert1.issuer, cert2.issuer);
      
      const similarity = (nameSim * 0.5 + dateSim * 0.2 + issuerSim * 0.3);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two publications arrays
 */
function calculatePublicationsSimilarity(pubs1: ResumePublication[], pubs2: ResumePublication[]): number {
  if (pubs1.length === 0 && pubs2.length === 0) return 1;
  if (pubs1.length === 0 || pubs2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (const pub1 of pubs1) {
    let bestMatch = 0;
    for (const pub2 of pubs2) {
      const nameSim = calculateStringSimilarity(pub1.name, pub2.name);
      const publisherSim = calculateStringSimilarity(pub1.publisher, pub2.publisher);
      const dateSim = calculateStringSimilarity(pub1.releaseDate, pub2.releaseDate);
      const summarySim = calculateStringSimilarity(pub1.summary, pub2.summary);
      
      const similarity = (nameSim * 0.4 + publisherSim * 0.2 + dateSim * 0.1 + summarySim * 0.3);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two languages arrays
 */
function calculateLanguagesSimilarity(langs1: ResumeLanguage[], langs2: ResumeLanguage[]): number {
  if (langs1.length === 0 && langs2.length === 0) return 1;
  if (langs1.length === 0 || langs2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (const lang1 of langs1) {
    let bestMatch = 0;
    for (const lang2 of langs2) {
      const languageSim = calculateStringSimilarity(lang1.language, lang2.language);
      const fluencySim = calculateStringSimilarity(lang1.fluency, lang2.fluency);
      
      const similarity = (languageSim * 0.7 + fluencySim * 0.3);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two interests arrays
 */
function calculateInterestsSimilarity(interests1: ResumeInterest[], interests2: ResumeInterest[]): number {
  if (interests1.length === 0 && interests2.length === 0) return 1;
  if (interests1.length === 0 || interests2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (const interest1 of interests1) {
    let bestMatch = 0;
    for (const interest2 of interests2) {
      const nameSim = calculateStringSimilarity(interest1.name, interest2.name);
      const keywordsSim = calculateArraySimilarity(interest1.keywords, interest2.keywords);
      
      const similarity = (nameSim * 0.6 + keywordsSim * 0.4);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two references arrays
 */
function calculateReferencesSimilarity(refs1: ResumeReference[], refs2: ResumeReference[]): number {
  if (refs1.length === 0 && refs2.length === 0) return 1;
  if (refs1.length === 0 || refs2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (const ref1 of refs1) {
    let bestMatch = 0;
    for (const ref2 of refs2) {
      const nameSim = calculateStringSimilarity(ref1.name, ref2.name);
      const referenceSim = calculateStringSimilarity(ref1.reference, ref2.reference);
      
      const similarity = (nameSim * 0.5 + referenceSim * 0.5);
      bestMatch = Math.max(bestMatch, similarity);
    }
    totalSimilarity += bestMatch;
    comparisons++;
  }
  
  return comparisons === 0 ? 0 : totalSimilarity / comparisons;
}

/**
 * Calculate similarity between two custom sections
 */
function calculateCustomSimilarity(custom1: ResumeCustom, custom2: ResumeCustom): number {
  return calculateArraySimilarity(custom1.descriptions, custom2.descriptions);
}

export interface DetailedSimilarityScore {
  overall: number;
  sections: {
    profile: number;
    workExperiences: number;
    educations: number;
    projects: number;
    skills: number;
    volunteer: number;
    awards: number;
    certificates: number;
    publications: number;
    languages: number;
    interests: number;
    references: number;
    custom: number;
  };
  weights: {
    profile: number;
    workExperiences: number;
    educations: number;
    projects: number;
    skills: number;
    volunteer: number;
    awards: number;
    certificates: number;
    publications: number;
    languages: number;
    interests: number;
    references: number;
    custom: number;
  };
}

/**
 * Calculate overall similarity between two resumes
 * @param originalResume - The original resume from the builder
 * @param parsedResume - The parsed resume from PDF parsing
 * @returns Similarity score between 0 and 1
 */
export function calculateResumeSimilarity(originalResume: Resume, parsedResume: Resume): number {
  const detailed = calculateDetailedResumeSimilarity(originalResume, parsedResume);
  return detailed.overall;
}

/**
 * Calculate detailed similarity between two resumes including section breakdowns
 * @param originalResume - The original resume from the builder
 * @param parsedResume - The parsed resume from PDF parsing
 * @returns Detailed similarity scores with section breakdowns
 */
export function calculateDetailedResumeSimilarity(originalResume: Resume, parsedResume: Resume): DetailedSimilarityScore {
  const weights = {
    profile: 0.20,
    workExperiences: 0.25,
    educations: 0.15,
    projects: 0.12,
    skills: 0.08,
    volunteer: 0.05,
    awards: 0.03,
    certificates: 0.03,
    publications: 0.03,
    languages: 0.02,
    interests: 0.02,
    references: 0.01,
    custom: 0.01,
  };
  
  const profileSim = calculateProfileSimilarity(originalResume.profile, parsedResume.profile);
  const workSim = calculateWorkExperienceSimilarity(originalResume.workExperiences, parsedResume.workExperiences);
  const eduSim = calculateEducationSimilarity(originalResume.educations, parsedResume.educations);
  const projSim = calculateProjectSimilarity(originalResume.projects, parsedResume.projects);
  const skillsSim = calculateSkillsSimilarity(originalResume.skills, parsedResume.skills);
  const volunteerSim = calculateVolunteerSimilarity(originalResume.volunteer, parsedResume.volunteer);
  const awardsSim = calculateAwardsSimilarity(originalResume.awards, parsedResume.awards);
  const certificatesSim = calculateCertificatesSimilarity(originalResume.certificates, parsedResume.certificates);
  const publicationsSim = calculatePublicationsSimilarity(originalResume.publications, parsedResume.publications);
  const languagesSim = calculateLanguagesSimilarity(originalResume.languages, parsedResume.languages);
  const interestsSim = calculateInterestsSimilarity(originalResume.interests, parsedResume.interests);
  const referencesSim = calculateReferencesSimilarity(originalResume.references, parsedResume.references);
  const customSim = calculateCustomSimilarity(originalResume.custom, parsedResume.custom);
  
  const totalSimilarity = (
    profileSim * weights.profile +
    workSim * weights.workExperiences +
    eduSim * weights.educations +
    projSim * weights.projects +
    skillsSim * weights.skills +
    volunteerSim * weights.volunteer +
    awardsSim * weights.awards +
    certificatesSim * weights.certificates +
    publicationsSim * weights.publications +
    languagesSim * weights.languages +
    interestsSim * weights.interests +
    referencesSim * weights.references +
    customSim * weights.custom
  );
  
  return {
    overall: Math.max(0, Math.min(1, totalSimilarity)),
    sections: {
      profile: Math.max(0, Math.min(1, profileSim)),
      workExperiences: Math.max(0, Math.min(1, workSim)),
      educations: Math.max(0, Math.min(1, eduSim)),
      projects: Math.max(0, Math.min(1, projSim)),
      skills: Math.max(0, Math.min(1, skillsSim)),
      volunteer: Math.max(0, Math.min(1, volunteerSim)),
      awards: Math.max(0, Math.min(1, awardsSim)),
      certificates: Math.max(0, Math.min(1, certificatesSim)),
      publications: Math.max(0, Math.min(1, publicationsSim)),
      languages: Math.max(0, Math.min(1, languagesSim)),
      interests: Math.max(0, Math.min(1, interestsSim)),
      references: Math.max(0, Math.min(1, referencesSim)),
      custom: Math.max(0, Math.min(1, customSim)),
    },
    weights,
  };
}

/**
 * Get semaphore color based on similarity score
 * @param score - Similarity score between 0 and 1
 * @returns Color configuration object
 */
export function getSemaphoreColor(score: number): { color: string; bgColor: string; borderColor: string } {
  if (score >= 0.8) {
    return {
      color: "text-green-800",
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
    };
  } else if (score >= 0.6) {
    return {
      color: "text-yellow-800",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-300",
    };
  } else {
    return {
      color: "text-red-800",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
    };
  }
} 