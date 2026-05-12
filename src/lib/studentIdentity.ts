/**
 * Student Identity System for CAPRES
 * 
 * Handles registration number parsing, semester calculation, and eligibility enforcement.
 * 
 * Registration Number Format: YYECCCCDDDD (10 digits)
 * - YY: Admission year (e.g., 22 = 2022)
 * - E: Entry type (0 = Regular, 2 = Lateral)
 * - CCCC: College/University code
 * - DDDD: Student serial number
 * 
 * Lateral Entry Rule:
 * - Lateral students are admitted ONE YEAR after the regular batch
 * - They directly join Semester 3
 * - They belong to the SAME original batch as regular students
 * - Example: 2321319001 → Lateral 2023 admission → Batch 2022-26
 */

export type EntryType = 'regular' | 'lateral';

export interface ParsedRegistration {
  admissionYear: number;
  entryType: EntryType;
  institutionalId: string;
  isValid: boolean;
}

export interface StudentIdentity {
  registrationNumber: string;
  admissionYear: number;
  entryType: EntryType;
  rollNumber: string;
  batch: string;
  currentSemester: number;
  eligibility: StudentEligibility;
}

export interface StudentEligibility {
  canSubmit: boolean;
  projectType: 'minor' | 'major' | 'internship' | null;
  status: 'eligible' | 'upcoming' | 'not-eligible';
  label: string;
  description: string;
}

/**
 * Parse a university registration number
 * Format: YYECCCCDDDD (10 digits)
 * - YY: Admission year (e.g., 22 = 2022)
 * - E: Entry type (0 = Regular, 2 = Lateral)
 * - CCCCDDDD: College code + Student serial
 */
export function parseRegistrationNumber(regNumber: string): ParsedRegistration {
  // Clean the input
  const cleaned = regNumber.trim().replace(/\s/g, '');
  
  // Validate format: should be 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return {
      admissionYear: 0,
      entryType: 'regular',
      institutionalId: '',
      isValid: false,
    };
  }
  
  // Extract components
  const yearCode = cleaned.substring(0, 2);
  const entryCode = cleaned.substring(2, 3);
  const institutionalId = cleaned.substring(3);
  
  // Parse admission year (assuming 2000s)
  const admissionYear = 2000 + parseInt(yearCode, 10);
  
  // Parse entry type
  const entryType: EntryType = entryCode === '2' ? 'lateral' : 'regular';
  
  return {
    admissionYear,
    entryType,
    institutionalId,
    isValid: true,
  };
}

/**
 * Calculate current semester based on admission year and entry type
 * 
 * Academic Calendar:
 * - Odd semesters: July - December
 * - Even semesters: January - June
 * 
 * Regular students start from Semester 1
 * Lateral entry students start from Semester 3
 */
export function calculateCurrentSemester(
  admissionYear: number,
  entryType: EntryType,
  referenceDate: Date = new Date()
): number {
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1; // 1-12
  
  // Base semester based on entry type
  const baseSemester = entryType === 'lateral' ? 3 : 1;
  
  // Calculate years since admission
  const yearsSinceAdmission = currentYear - admissionYear;
  
  // Determine if we're in odd (July-Dec) or even (Jan-June) semester period
  const isOddSemesterPeriod = currentMonth >= 7 && currentMonth <= 12;
  
  // Calculate semester offset from base
  // Each academic year has 2 semesters
  // Odd semester starts in July of admission year
  // Even semester starts in January of next year
  
  let semesterOffset = 0;
  
  if (yearsSinceAdmission === 0) {
    // First year of admission
    semesterOffset = isOddSemesterPeriod ? 0 : -1; // Before admission if Jan-June
  } else {
    // Subsequent years
    semesterOffset = (yearsSinceAdmission * 2) - (isOddSemesterPeriod ? 1 : 0);
  }
  
  const semester = baseSemester + semesterOffset;
  
  // Clamp to valid range (1-8 for regular, 3-8 for lateral)
  const minSemester = baseSemester;
  const maxSemester = 8;
  
  return Math.max(minSemester, Math.min(maxSemester, semester));
}

/**
 * Derive roll number from registration number
 * Roll numbers are DERIVED, not stored
 * 
 * Format:
 * - Regular: CSE<YY><NNN> (e.g., CSE22001)
 * - Lateral: CSE<YY>L<NN> (e.g., CSE23L01)
 * 
 * The sequence number is extracted from the last 3 digits of registration number
 */
export function deriveRollNumber(registrationNumber: string): string {
  const parsed = parseRegistrationNumber(registrationNumber);
  
  if (!parsed.isValid) {
    return '';
  }
  
  const yearCode = String(parsed.admissionYear).slice(-2);
  // Extract last 3 digits as sequence number
  const sequenceNumber = parseInt(parsed.institutionalId.slice(-3), 10);
  
  if (parsed.entryType === 'lateral') {
    // Lateral: CSE<YY>L<NN>
    const seq = String(sequenceNumber).padStart(2, '0');
    return `CSE${yearCode}L${seq}`;
  } else {
    // Regular: CSE<YY><NNN>
    const seq = String(sequenceNumber).padStart(3, '0');
    return `CSE${yearCode}${seq}`;
  }
}

/**
 * Legacy function - kept for backwards compatibility
 * @deprecated Use deriveRollNumber instead
 */
export function generateRollNumber(
  admissionYear: number,
  entryType: EntryType,
  sequenceNumber: number
): string {
  const yearCode = String(admissionYear).slice(-2);
  
  if (entryType === 'lateral') {
    const seq = String(sequenceNumber).padStart(2, '0');
    return `CSE${yearCode}L${seq}`;
  } else {
    const seq = String(sequenceNumber).padStart(3, '0');
    return `CSE${yearCode}${seq}`;
  }
}

/**
 * Validate roll number format
 */
export function isValidRollNumber(rollNumber: string): boolean {
  // Regular: CSE<YY><NNN> or Lateral: CSE<YY>L<NN>
  return /^CSE\d{2}(L\d{2}|\d{3})$/.test(rollNumber);
}

/**
 * Calculate academic batch from admission year and entry type
 * 
 * Lateral Entry Rule:
 * - Lateral students are admitted ONE YEAR after the regular batch
 * - They belong to the SAME original batch as regular students
 * - Example: 2023 lateral admission → Batch 2022-26 (NOT 2023-27)
 * 
 * Regular: admission year → +4 years (e.g., 2022 → 2022-26)
 * Lateral: admission year - 1 → +4 years (e.g., 2023 → 2022-26)
 */
export function calculateBatch(admissionYear: number, entryType: EntryType): string {
  // Lateral students join the batch that started one year before their admission
  const batchStartYear = entryType === 'lateral' ? admissionYear - 1 : admissionYear;
  const graduationYear = batchStartYear + 4;
  
  const endYear = String(graduationYear).slice(-2);
  return `${batchStartYear}-${endYear}`;
}

/**
 * Get expected graduation year
 */
export function getGraduationYear(admissionYear: number, entryType: EntryType): number {
  return admissionYear + (entryType === 'lateral' ? 3 : 4);
}

/**
 * Get student eligibility based on current semester
 * 
 * Rules:
 * - Semester 1-6: Read-only access to archived projects
 * - Semester 7: Eligible for Minor Project
 * - Semester 8: Eligible for Major Project OR Internship
 */
export function getStudentEligibility(semester: number): StudentEligibility {
  if (semester >= 8) {
    return {
      canSubmit: true,
      projectType: 'major',
      status: 'eligible',
      label: 'Major Project',
      description: 'You are eligible to submit your Major Project or Internship report (8th Semester)',
    };
  }
  
  if (semester === 7) {
    return {
      canSubmit: true,
      projectType: 'minor',
      status: 'eligible',
      label: 'Minor Project',
      description: 'You are eligible to submit your Minor Project (7th Semester)',
    };
  }
  
  if (semester === 6) {
    return {
      canSubmit: false,
      projectType: null,
      status: 'upcoming',
      label: 'Upcoming',
      description: 'Minor Project eligibility starts from Semester 7. You can browse archived projects.',
    };
  }
  
  return {
    canSubmit: false,
    projectType: null,
    status: 'not-eligible',
    label: 'Not Yet Eligible',
    description: `Project submission starts from Semester 7. You are currently in Semester ${semester}. You can browse archived projects.`,
  };
}

/**
 * Build complete student identity from registration number
 */
export function buildStudentIdentity(
  registrationNumber: string,
  referenceDate: Date = new Date()
): StudentIdentity | null {
  const parsed = parseRegistrationNumber(registrationNumber);
  
  if (!parsed.isValid) {
    return null;
  }
  
  const currentSemester = calculateCurrentSemester(
    parsed.admissionYear,
    parsed.entryType,
    referenceDate
  );
  
  const batch = calculateBatch(parsed.admissionYear, parsed.entryType);
  const eligibility = getStudentEligibility(currentSemester);
  const rollNumber = deriveRollNumber(registrationNumber);
  
  return {
    registrationNumber,
    admissionYear: parsed.admissionYear,
    entryType: parsed.entryType,
    rollNumber,
    batch,
    currentSemester,
    eligibility,
  };
}

/**
 * Get semester period name
 */
export function getSemesterPeriod(referenceDate: Date = new Date()): 'odd' | 'even' {
  const month = referenceDate.getMonth() + 1;
  return (month >= 7 && month <= 12) ? 'odd' : 'even';
}

/**
 * Get academic year string (e.g., "2024-25")
 */
export function getAcademicYear(referenceDate: Date = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;
  
  // Academic year starts in July
  const startYear = month >= 7 ? year : year - 1;
  const endYear = String(startYear + 1).slice(-2);
  
  return `${startYear}-${endYear}`;
}
