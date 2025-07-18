import type { Resume } from "lib/redux/types";
import { 
  initialProfile,
  initialWorkExperience,
  initialEducation,
  initialProject,
  initialSkills,
  initialVolunteer,
  initialAward,
  initialCertificate,
  initialPublication,
  initialLanguage,
  initialInterest,
  initialReference,
  initialCustom
} from "lib/redux/resumeSlice";

// JSON Resume format interface - fully compliant with v1.0.0 schema
export interface JsonResume {
  $schema?: string;
  basics: {
    name: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
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
    location?: string;
    description?: string;
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
    description?: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
    roles?: string[];
    entity?: string;
    type?: string;
  }>;
  meta?: {
    canonical?: string;
    version?: string;
    lastModified?: string;
  };
}

/**
 * Converts date strings to ISO8601 format (YYYY-MM-DD, YYYY-MM, or YYYY)
 * Handles various input formats like "Jan 2020", "January 2020", "2020"
 */
function convertToISO8601(dateStr: string): string {
  if (!dateStr || dateStr === 'Present') return '';
  
  // If already in ISO format, return as-is
  if (/^\d{4}(-\d{2})?(-\d{2})?$/.test(dateStr)) {
    return dateStr;
  }
  
  // Handle "Month YYYY" format (e.g., "Jan 2020", "January 2020")
  const monthYearMatch = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const [, monthStr, year] = monthYearMatch;
    const monthMap: { [key: string]: string } = {
      'jan': '01', 'january': '01',
      'feb': '02', 'february': '02', 
      'mar': '03', 'march': '03',
      'apr': '04', 'april': '04',
      'may': '05',
      'jun': '06', 'june': '06',
      'jul': '07', 'july': '07',
      'aug': '08', 'august': '08',
      'sep': '09', 'september': '09',
      'oct': '10', 'october': '10',
      'nov': '11', 'november': '11',
      'dec': '12', 'december': '12'
    };
    const month = monthMap[monthStr.toLowerCase()];
    if (month) {
      return `${year}-${month}`;
    }
  }
  
  // Handle year only
  const yearMatch = dateStr.match(/^\d{4}$/);
  if (yearMatch) {
    return dateStr;
  }
  
  // Fallback: try to extract year
  const yearExtract = dateStr.match(/\d{4}/);
  if (yearExtract) {
    return yearExtract[0];
  }
  
  return dateStr; // Return original if no pattern matches
}

/**
 * Parse location string into structured format
 */
function parseLocation(locationStr: string) {
  if (!locationStr) return {};
  
  const parts = locationStr.split(',').map(part => part.trim());
  
  if (parts.length >= 2) {
    // Handle "City, State/Region" format
    const city = parts[0];
    const region = parts[1];
    
    // Check if there's a postal code in the region part
    const postalMatch = region.match(/^(.+?)\s+(\d{5}(-\d{4})?)$/);
    if (postalMatch) {
      return {
        city,
        region: postalMatch[1],
        postalCode: postalMatch[2]
      };
    }
    
    // Check for country code (2-letter codes)
    const countryMatch = region.match(/^(.+?)\s+([A-Z]{2})$/);
    if (countryMatch) {
      return {
        city,
        region: countryMatch[1],
        countryCode: countryMatch[2]
      };
    }
    
    return { city, region };
  }
  
  return { address: locationStr };
}

/**
 * Converts the internal resume format to JSON Resume format
 */
export function convertToJsonResume(resume: Resume): JsonResume {
  const { 
    profile, 
    workExperiences, 
    educations, 
    projects, 
    skills, 
    volunteer,
    awards,
    certificates,
    publications,
    languages,
    interests,
    references,
    custom 
  } = resume;

  const jsonResume: JsonResume = {
    basics: {
      name: profile.name || '',
      label: profile.label || '',
      image: profile.image || undefined,
      email: profile.email || '',
      phone: profile.phone || '',
      url: profile.url || '',
      summary: profile.summary || '',
      location: parseLocation(profile.location || ''),
      profiles: profile.profiles?.length > 0 ? profile.profiles : undefined,
    },
  };

  // Convert work experiences
  if (workExperiences.length > 0) {
    jsonResume.work = workExperiences.map(exp => {
      // Parse date range
      const [startDateStr, endDateStr] = exp.date.includes(' to ') 
        ? exp.date.split(' to ').map(d => d.trim())
        : [exp.date, undefined];

      const work = {
        name: exp.company || '',
        location: exp.location || undefined,
        description: exp.description || undefined,
        position: exp.jobTitle || '',
        url: exp.url || undefined,
        startDate: convertToISO8601(startDateStr || ''),
        summary: exp.summary || undefined,
        highlights: exp.descriptions || [],
      };

      // Add endDate only if it exists and isn't "Present"
      if (endDateStr && endDateStr !== 'Present') {
        (work as any).endDate = convertToISO8601(endDateStr);
      }

      return work;
    });
  }

  // Convert volunteer experiences
  if (volunteer.length > 0 && volunteer.some(v => v.organization)) {
    jsonResume.volunteer = volunteer
      .filter(v => v.organization) // Only include non-empty entries
      .map(vol => {
        const volunteerWork = {
          organization: vol.organization,
          position: vol.position || '',
          url: vol.url || undefined,
          startDate: convertToISO8601(vol.startDate || ''),
          summary: vol.summary || undefined,
          highlights: vol.highlights || [],
        };

        if (vol.endDate && vol.endDate !== 'Present') {
          (volunteerWork as any).endDate = convertToISO8601(vol.endDate);
        }

        return volunteerWork;
      });
  }

  // Convert education
  if (educations.length > 0) {
    jsonResume.education = educations.map(edu => {
      // Parse degree and area from degree field
      const degreeMatch = edu.degree.match(/^(.+?)\s+in\s+(.+)$/);
      const studyType = degreeMatch ? degreeMatch[1] : edu.degree || '';
      const area = degreeMatch ? degreeMatch[2] : '';

      // Parse date range
      const [startDateStr, endDateStr] = edu.date.includes(' to ') 
        ? edu.date.split(' to ').map(d => d.trim())
        : [edu.date, undefined];

      const education = {
        institution: edu.school || '',
        url: edu.url || undefined,
        area: area || edu.degree || '',
        studyType: studyType || '',
        startDate: convertToISO8601(startDateStr || ''),
        courses: edu.descriptions || [],
      };

      // Add optional fields
      if (edu.gpa) {
        (education as any).score = edu.gpa;
      }

      if (endDateStr && endDateStr !== 'Present') {
        (education as any).endDate = convertToISO8601(endDateStr);
      }

      return education;
    });
  }

  // Convert awards
  if (awards.length > 0 && awards.some(a => a.title)) {
    jsonResume.awards = awards
      .filter(a => a.title) // Only include non-empty entries
      .map(award => ({
        title: award.title,
        date: convertToISO8601(award.date || ''),
        awarder: award.awarder || '',
        summary: award.summary || undefined,
      }));
  }

  // Convert certificates
  if (certificates.length > 0 && certificates.some(c => c.name)) {
    jsonResume.certificates = certificates
      .filter(c => c.name) // Only include non-empty entries
      .map(cert => ({
        name: cert.name,
        date: convertToISO8601(cert.date || ''),
        url: cert.url || undefined,
        issuer: cert.issuer || '',
      }));
  }

  // Convert publications
  if (publications.length > 0 && publications.some(p => p.name)) {
    jsonResume.publications = publications
      .filter(p => p.name) // Only include non-empty entries
      .map(pub => ({
        name: pub.name,
        publisher: pub.publisher || '',
        releaseDate: convertToISO8601(pub.releaseDate || ''),
        url: pub.url || undefined,
        summary: pub.summary || undefined,
      }));
  }

  // Convert projects
  if (projects.length > 0) {
    jsonResume.projects = projects.map(proj => {
      // Parse date range
      const [startDateStr, endDateStr] = proj.date.includes(' to ') 
        ? proj.date.split(' to ').map(d => d.trim())
        : [proj.date, undefined];

      const project = {
        name: proj.project || '',
        description: proj.description || undefined,
        highlights: proj.descriptions || [],
        keywords: proj.keywords?.length > 0 ? proj.keywords : undefined,
        url: proj.url || undefined,
        roles: proj.roles?.length > 0 ? proj.roles : undefined,
        entity: proj.entity || undefined,
        type: proj.type || undefined,
      };

      // Add dates if they exist
      if (startDateStr) {
        (project as any).startDate = convertToISO8601(startDateStr);
      }

      if (endDateStr && endDateStr !== 'Present') {
        (project as any).endDate = convertToISO8601(endDateStr);
      }

      return project;
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

  // Convert languages
  if (languages.length > 0 && languages.some(l => l.language)) {
    jsonResume.languages = languages
      .filter(l => l.language) // Only include non-empty entries
      .map(lang => ({
        language: lang.language,
        fluency: lang.fluency || '',
      }));
  }

  // Convert interests
  if (interests.length > 0 && interests.some(i => i.name)) {
    jsonResume.interests = interests
      .filter(i => i.name) // Only include non-empty entries
      .map(interest => ({
        name: interest.name,
        keywords: interest.keywords?.length > 0 ? interest.keywords : undefined,
      }));
  }

  // Convert references
  if (references.length > 0 && references.some(r => r.name)) {
    jsonResume.references = references
      .filter(r => r.name) // Only include non-empty entries
      .map(ref => ({
        name: ref.name,
        reference: ref.reference || '',
      }));
  }

  // Convert custom section to interests (if no interests exist) or as additional interests
  if (custom.descriptions.length > 0) {
    if (!jsonResume.interests) {
      jsonResume.interests = [];
    }
    jsonResume.interests.push({
      name: 'Additional Information',
      keywords: custom.descriptions,
    });
  }

  // Add meta information
  jsonResume.meta = {
    version: 'v1.0.0',
    lastModified: new Date().toISOString(),
  };

  return jsonResume;
} 

/**
 * Converts JSON Resume format to the internal resume format
 */
export function convertFromJsonResume(jsonResume: JsonResume): Resume {
  const { 
    basics, 
    work = [], 
    volunteer = [],
    education = [], 
    skills = [], 
    projects = [],
    awards = [],
    certificates = [],
    publications = [],
    languages = [],
    interests = [],
    references = []
  } = jsonResume;

  // Map profile with all required fields
  const profile = {
    ...initialProfile,
    name: basics?.name || "",
    label: basics?.label || "",
    image: basics?.image || "",
    email: basics?.email || "",
    phone: basics?.phone || "",
    url: basics?.url || "",
    summary: basics?.summary || "",
    location: basics?.location 
      ? `${basics.location.city || ""}, ${basics.location.region || ""} ${basics.location.postalCode || ""}`.trim()
      : "",
    profiles: basics?.profiles?.map(profile => ({
      network: profile.network || "",
      username: profile.username || "",
      url: profile.url || "",
    })) || [],
  };

  // Map work experiences with all required fields
  const workExperiences = work.map(job => ({
    ...initialWorkExperience,
    company: job.name || "",
    location: job.location || "",
    description: job.description || job.summary || "",
    jobTitle: job.position || "",
    url: job.url || "",
    date: job.startDate && job.endDate 
      ? `${job.startDate} to ${job.endDate}`
      : job.startDate || "",
    summary: job.summary || "",
    descriptions: job.highlights || [],
  }));

  // Map volunteer experiences
  const volunteerExperiences = volunteer.map(vol => ({
    ...initialVolunteer,
    organization: vol.organization || "",
    position: vol.position || "",
    url: vol.url || "",
    startDate: vol.startDate || "",
    endDate: vol.endDate || "",
    summary: vol.summary || "",
    highlights: vol.highlights || [],
  }));

  // Map education with all required fields
  const educations = education.map(edu => ({
    ...initialEducation,
    school: edu.institution || "",
    url: edu.url || "",
    degree: `${edu.studyType || ""} in ${edu.area || ""}`.trim(),
    date: edu.startDate && edu.endDate 
      ? `${edu.startDate} to ${edu.endDate}`
      : edu.startDate || "",
    gpa: edu.score || "",
    descriptions: edu.courses || [],
  }));

  // Map projects with all required fields
  const mappedProjects = projects.map(proj => ({
    ...initialProject,
    project: proj.name || "",
    description: proj.description || "",
    date: proj.startDate && proj.endDate 
      ? `${proj.startDate} to ${proj.endDate}`
      : proj.startDate || "",
    url: proj.url || "",
    keywords: proj.keywords || [],
    roles: proj.roles || [],
    entity: proj.entity || "",
    type: proj.type || "",
    descriptions: proj.highlights || (proj.description ? [proj.description] : []),
  }));

  // Map awards
  const mappedAwards = awards.map(award => ({
    ...initialAward,
    title: award.title || "",
    date: award.date || "",
    awarder: award.awarder || "",
    summary: award.summary || "",
  }));

  // Map certificates
  const mappedCertificates = certificates.map(cert => ({
    ...initialCertificate,
    name: cert.name || "",
    date: cert.date || "",
    url: cert.url || "",
    issuer: cert.issuer || "",
  }));

  // Map publications
  const mappedPublications = publications.map(pub => ({
    ...initialPublication,
    name: pub.name || "",
    publisher: pub.publisher || "",
    releaseDate: pub.releaseDate || "",
    url: pub.url || "",
    summary: pub.summary || "",
  }));

  // Map languages
  const mappedLanguages = languages.map(lang => ({
    ...initialLanguage,
    language: lang.language || "",
    fluency: lang.fluency || "",
  }));

  // Map interests
  const mappedInterests = interests.map(interest => ({
    ...initialInterest,
    name: interest.name || "",
    keywords: interest.keywords || [],
  }));

  // Map references
  const mappedReferences = references.map(ref => ({
    ...initialReference,
    name: ref.name || "",
    reference: ref.reference || "",
  }));

  // Map skills
  const featuredSkills = skills.slice(0, 6).map(skill => ({
    skill: skill.name || "",
    rating: skill.level === "Master" ? 5 : 
            skill.level === "Advanced" ? 4 : 
            skill.level === "Intermediate" ? 3 : 
            skill.level === "Beginner" ? 2 : 3,
  }));

  // Ensure we have at least 6 featured skills (pad with empty ones if needed)
  while (featuredSkills.length < 6) {
    featuredSkills.push({ skill: "", rating: 1 });
  }

  const skillDescriptions = skills.flatMap(skill => 
    skill.keywords || []
  );

  return {
    profile,
    workExperiences: workExperiences.length > 0 ? workExperiences : [initialWorkExperience],
    educations: educations.length > 0 ? educations : [initialEducation],
    projects: mappedProjects.length > 0 ? mappedProjects : [initialProject],
    skills: {
      featuredSkills,
      descriptions: skillDescriptions,
    },
    volunteer: volunteerExperiences.length > 0 ? volunteerExperiences : [initialVolunteer],
    awards: mappedAwards.length > 0 ? mappedAwards : [initialAward],
    certificates: mappedCertificates.length > 0 ? mappedCertificates : [initialCertificate],
    publications: mappedPublications.length > 0 ? mappedPublications : [initialPublication],
    languages: mappedLanguages.length > 0 ? mappedLanguages : [initialLanguage],
    interests: mappedInterests.length > 0 ? mappedInterests : [initialInterest],
    references: mappedReferences.length > 0 ? mappedReferences : [initialReference],
    custom: initialCustom,
  };
} 