import type { Resume } from "lib/redux/types";

// JSON Resume format interface
export interface JsonResume {
  basics: {
    name: string;
    label?: string;
    image?: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location?: {
      address?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
      region?: string;
    };
    profiles?: Array<{
      network: string;
      username: string;
      url: string;
    }>;
  };
  work?: Array<{
    name: string;
    position: string;
    url?: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  volunteer?: Array<{
    organization: string;
    position: string;
    url?: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    institution: string;
    url?: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate?: string;
    score?: string;
    courses?: string[];
  }>;
  awards?: Array<{
    title: string;
    date: string;
    awarder: string;
    summary?: string;
  }>;
  certificates?: Array<{
    name: string;
    date: string;
    url?: string;
    issuer: string;
  }>;
  publications?: Array<{
    name: string;
    publisher: string;
    releaseDate: string;
    url?: string;
    summary?: string;
  }>;
  skills?: Array<{
    name: string;
    level?: string;
    keywords?: string[];
  }>;
  languages?: Array<{
    language: string;
    fluency: string;
  }>;
  interests?: Array<{
    name: string;
    keywords?: string[];
  }>;
  references?: Array<{
    name: string;
    reference: string;
  }>;
  projects?: Array<{
    name: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    highlights?: string[];
    url?: string;
  }>;
}

/**
 * Converts the internal resume format to JSON Resume format
 */
export function convertToJsonResume(resume: Resume): JsonResume {
  const { profile, workExperiences, educations, projects, skills, custom } = resume;

  // Parse location from the location string
  const parseLocation = (locationStr: string) => {
    if (!locationStr) return {};
    
    // Simple parsing - can be enhanced based on patterns
    const parts = locationStr.split(', ');
    if (parts.length >= 2) {
      return {
        city: parts[0],
        region: parts[1],
      };
    }
    return { address: locationStr };
  };

  const jsonResume: JsonResume = {
    basics: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      url: profile.url,
      summary: profile.summary,
      location: parseLocation(profile.location),
    },
  };

  // Convert work experiences
  if (workExperiences.length > 0) {
    jsonResume.work = workExperiences.map(exp => {
      // Parse date range
      const [startDate, endDate] = exp.date.includes(' to ') 
        ? exp.date.split(' to ').map(d => d.trim())
        : [exp.date, undefined];

      return {
        name: exp.company,
        position: exp.jobTitle,
        startDate: startDate || '',
        endDate: endDate === 'Present' ? undefined : endDate,
        highlights: exp.descriptions,
      };
    });
  }

  // Convert education
  if (educations.length > 0) {
    jsonResume.education = educations.map(edu => {
      // Parse degree and area from degree field
      const degreeMatch = edu.degree.match(/^(.+?)\s+in\s+(.+)$/);
      const studyType = degreeMatch ? degreeMatch[1] : edu.degree;
      const area = degreeMatch ? degreeMatch[2] : '';

      // Parse date range
      const [startDate, endDate] = edu.date.includes(' to ') 
        ? edu.date.split(' to ').map(d => d.trim())
        : [edu.date, undefined];

      return {
        institution: edu.school,
        area,
        studyType,
        startDate: startDate || '',
        endDate: endDate === 'Present' ? undefined : endDate,
        score: edu.gpa,
        courses: edu.descriptions,
      };
    });
  }

  // Convert projects
  if (projects.length > 0) {
    jsonResume.projects = projects.map(proj => {
      // Parse date range
      const [startDate, endDate] = proj.date.includes(' to ') 
        ? proj.date.split(' to ').map(d => d.trim())
        : [proj.date, undefined];

      return {
        name: proj.project,
        startDate: startDate || undefined,
        endDate: endDate === 'Present' ? undefined : endDate,
        highlights: proj.descriptions,
      };
    });
  }

  // Convert skills
  if (skills.featuredSkills.length > 0 || skills.descriptions.length > 0) {
    jsonResume.skills = [];

    // Add featured skills
    skills.featuredSkills.forEach(featuredSkill => {
      if (featuredSkill.skill) {
        const level = featuredSkill.rating >= 4 ? 'Advanced' : 
                     featuredSkill.rating >= 3 ? 'Intermediate' : 'Beginner';
        
        jsonResume.skills!.push({
          name: featuredSkill.skill,
          level,
        });
      }
    });

    // Add general skills from descriptions
    skills.descriptions.forEach(desc => {
      jsonResume.skills!.push({
        name: desc,
        keywords: [desc],
      });
    });
  }

  // Add custom section as additional skills or interests
  if (custom.descriptions.length > 0) {
    if (!jsonResume.interests) {
      jsonResume.interests = [];
    }
    jsonResume.interests.push({
      name: 'Additional Information',
      keywords: custom.descriptions,
    });
  }

  return jsonResume;
} 