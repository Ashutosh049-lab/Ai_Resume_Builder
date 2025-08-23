export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true // Phone is optional
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

export function validateUrl(url: string): boolean {
  if (!url) return true // URL is optional
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`)
    return true
  } catch {
    return false
  }
}

export function validatePersonalInfo(data: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.fullName?.trim()) {
    errors.push({ field: "fullName", message: "Full name is required" })
  }

  if (!data.email?.trim()) {
    errors.push({ field: "email", message: "Email is required" })
  } else if (!validateEmail(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email address" })
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push({ field: "phone", message: "Please enter a valid phone number" })
  }

  if (data.website && !validateUrl(data.website)) {
    errors.push({ field: "website", message: "Please enter a valid website URL" })
  }

  if (data.linkedIn && !data.linkedIn.includes("linkedin.com")) {
    errors.push({ field: "linkedIn", message: "Please enter a valid LinkedIn profile URL" })
  }

  return errors
}

export function validateExperience(experience: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!experience.company?.trim()) {
    errors.push({ field: "company", message: "Company name is required" })
  }

  if (!experience.position?.trim()) {
    errors.push({ field: "position", message: "Position is required" })
  }

  if (!experience.startDate) {
    errors.push({ field: "startDate", message: "Start date is required" })
  }

  if (!experience.current && !experience.endDate) {
    errors.push({ field: "endDate", message: "End date is required for past positions" })
  }

  if (experience.startDate && experience.endDate && experience.startDate > experience.endDate) {
    errors.push({ field: "endDate", message: "End date must be after start date" })
  }

  return errors
}

export function validateEducation(education: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!education.institution?.trim()) {
    errors.push({ field: "institution", message: "Institution name is required" })
  }

  if (!education.degree?.trim()) {
    errors.push({ field: "degree", message: "Degree is required" })
  }

  if (!education.startDate) {
    errors.push({ field: "startDate", message: "Start date is required" })
  }

  if (!education.endDate) {
    errors.push({ field: "endDate", message: "End date is required" })
  }

  if (education.startDate && education.endDate && education.startDate > education.endDate) {
    errors.push({ field: "endDate", message: "End date must be after start date" })
  }

  if (
    education.gpa &&
    (isNaN(Number.parseFloat(education.gpa)) ||
      Number.parseFloat(education.gpa) < 0 ||
      Number.parseFloat(education.gpa) > 4)
  ) {
    errors.push({ field: "gpa", message: "GPA must be a number between 0 and 4" })
  }

  return errors
}

export function calculateCompletionPercentage(resumeData: any): number {
  let completed = 0
  let total = 0

  // Personal Info (40% weight)
  total += 40
  if (resumeData.personalInfo.fullName) completed += 10
  if (resumeData.personalInfo.email) completed += 10
  if (resumeData.personalInfo.phone) completed += 5
  if (resumeData.personalInfo.location) completed += 5
  if (resumeData.personalInfo.summary) completed += 10

  // Experience (30% weight)
  total += 30
  if (resumeData.experience.length > 0) {
    completed += 30
  }

  // Education (20% weight)
  total += 20
  if (resumeData.education.length > 0) {
    completed += 20
  }

  // Skills (10% weight)
  total += 10
  if (resumeData.skills.length > 0) {
    completed += 10
  }

  return Math.round((completed / total) * 100)
}
