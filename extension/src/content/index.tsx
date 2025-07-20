// Content script for OpenResume extension
// This script runs on web pages and extracts resume-relevant data

interface ResumeData {
  profile?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
  };
  workExperiences?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills?: Array<{
    category: string;
    skills: string[];
  }>;
}

class ResumeExtractor {
  private extractedData: ResumeData = {};

  // Extract profile information
  private extractProfile(): ResumeData['profile'] {
    const profile: ResumeData['profile'] = {};

    // Try to find name
    const nameSelectors = [
      'h1[class*="name"]',
      '[class*="profile"] h1',
      '[class*="header"] h1',
      '.name',
      '#name',
      '[data-testid*="name"]'
    ];
    
    for (const selector of nameSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) {
        profile.name = element.textContent.trim();
        break;
      }
    }

    // Try to find email
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const bodyText = document.body.innerText;
    const emailMatch = bodyText.match(emailRegex);
    if (emailMatch) {
      profile.email = emailMatch[0];
    }

    // Try to find phone
    const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const phoneMatch = bodyText.match(phoneRegex);
    if (phoneMatch) {
      profile.phone = phoneMatch[0];
    }

    // Try to find location
    const locationSelectors = [
      '[class*="location"]',
      '[class*="address"]',
      '[class*="city"]'
    ];
    
    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) {
        profile.location = element.textContent.trim();
        break;
      }
    }

    return profile;
  }

  // Extract work experience
  private extractWorkExperience(): ResumeData['workExperiences'] {
    const experiences: ResumeData['workExperiences'] = [];
    
    // Common selectors for job listings and profiles
    const experienceSelectors = [
      '[class*="experience"]',
      '[class*="job"]',
      '[class*="position"]',
      '[class*="work"]',
      '.employment',
      '#experience'
    ];

    for (const selector of experienceSelectors) {
      const sections = document.querySelectorAll(selector);
      sections.forEach(section => {
        const company = section.querySelector('[class*="company"], [class*="employer"]')?.textContent?.trim();
        const position = section.querySelector('[class*="title"], [class*="role"], [class*="position"]')?.textContent?.trim();
        const description = section.querySelector('[class*="description"], [class*="summary"]')?.textContent?.trim();
        
        if (company && position) {
          experiences.push({
            company,
            position,
            startDate: '',
            endDate: '',
            description: description || ''
          });
        }
      });
    }

    return experiences.length > 0 ? experiences : undefined;
  }

  // Extract education
  private extractEducation(): ResumeData['education'] {
    const education: ResumeData['education'] = [];
    
    const educationSelectors = [
      '[class*="education"]',
      '[class*="school"]',
      '[class*="university"]',
      '[class*="degree"]'
    ];

    for (const selector of educationSelectors) {
      const sections = document.querySelectorAll(selector);
      sections.forEach(section => {
        const school = section.querySelector('[class*="school"], [class*="university"], [class*="institution"]')?.textContent?.trim();
        const degree = section.querySelector('[class*="degree"], [class*="certification"]')?.textContent?.trim();
        
        if (school || degree) {
          education.push({
            school: school || '',
            degree: degree || '',
            field: '',
            startDate: '',
            endDate: ''
          });
        }
      });
    }

    return education.length > 0 ? education : undefined;
  }

  // Extract skills
  private extractSkills(): ResumeData['skills'] {
    const skills: ResumeData['skills'] = [];
    
    const skillSelectors = [
      '[class*="skill"]',
      '[class*="technology"]',
      '[class*="competenc"]',
      '.tags',
      '.chips'
    ];

    const allSkills: string[] = [];
    
    for (const selector of skillSelectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const text = element.textContent?.trim();
        if (text && text.length < 50) { // Likely a skill if short
          allSkills.push(text);
        }
      });
    }

    if (allSkills.length > 0) {
      skills.push({
        category: 'General',
        skills: allSkills
      });
    }

    return skills.length > 0 ? skills : undefined;
  }

  // Main extraction method
  public extractResumeData(): ResumeData {
    this.extractedData = {
      profile: this.extractProfile(),
      workExperiences: this.extractWorkExperience(),
      education: this.extractEducation(),
      skills: this.extractSkills()
    };

    return this.extractedData;
  }

  // Check if current page contains resume-like content
  public hasResumeContent(): boolean {
    const resumeIndicators = [
      'experience',
      'education',
      'skills',
      'resume',
      'cv',
      'curriculum vitae',
      'work history',
      'employment',
      'qualifications'
    ];

    const pageText = document.body.innerText.toLowerCase();
    return resumeIndicators.some(indicator => pageText.includes(indicator));
  }
}

// Initialize content script
const extractor = new ResumeExtractor();

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractResumeData') {
    const data = extractor.extractResumeData();
    sendResponse(data);
  } else if (request.action === 'checkResumeContent') {
    const hasContent = extractor.hasResumeContent();
    sendResponse({ hasResumeContent: hasContent });
  }
  
  return true; // Keep message channel open for async response
});

// Auto-extract on page load if enabled
chrome.storage.sync.get({ autoExtract: true }, (result: any) => {
  if (result.autoExtract && extractor.hasResumeContent()) {
    // Notify background script that resume content was found
    chrome.runtime.sendMessage({
      action: 'resumeContentFound',
      data: extractor.extractResumeData()
    });
  }
});

console.log('OpenResume content script loaded'); 