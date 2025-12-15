import { Investor, Prisma } from '@prisma/client';

/**
 * Re-export Prisma generated types
 */
export type { Investor } from '@prisma/client';

/**
 * Form data type for creating/updating investors
 * Used for client-side form submissions
 */
export interface InvestorFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string from form input
  phoneNumber: string;
  streetAddress: string;
  state: string;
  zipCode: string;
  file?: File; // File object from form input
}

/**
 * Investor without file information
 * Used for API responses where file details aren't needed
 */
export type InvestorWithoutFile = Omit<
  Investor,
  'filePath' | 'fileOriginalName'
>;

/**
 * Investor with only essential information
 * Used for list views and summaries
 */
export interface InvestorSummary {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
  createdAt: Date;
}

/**
 * Input type for creating a new investor
 * Validated and sanitized data ready for database insertion
 */
export interface CreateInvestorInput {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  streetAddress: string;
  state: string;
  zipCode: string;
  filePath: string;
  fileOriginalName: string;
}

/**
 * Input type for updating an existing investor
 * All fields are optional except id
 */
export interface UpdateInvestorInput {
  id: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  streetAddress: string;
  state?: string;
  zipCode?: string;
  filePath?: string;
  fileOriginalName?: string;
}

/**
 * Search/Filter parameters for investors
 */
export interface InvestorSearchParams {
  query?: string; // Search across name fields
  state?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
  sortBy?: 'firstName' | 'lastName' | 'createdAt' | 'dateOfBirth';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Type-safe where clause for Prisma queries
 */
export type InvestorWhereInput = Prisma.InvestorWhereInput;

/**
 * Type-safe order by clause for Prisma queries
 */
export type InvestorOrderByInput = Prisma.InvestorOrderByWithRelationInput;

/**
 * Type-safe select clause for Prisma queries
 */
export type InvestorSelect = Prisma.InvestorSelect;

/**
 * API response type for investor operations
 */
export interface InvestorResponse {
  success: boolean;
  data?: Investor;
  error?: string;
}

/**
 * API response type for investor list operations
 */
export interface InvestorListResponse {
  success: boolean;
  data?: Investor[];
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
}

/**
 * Type guard to check if a value is a valid US state code
 */
export function isValidStateCode(state: string): boolean {
  const validStates = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
    'DC',
  ];
  return validStates.includes(state.toUpperCase());
}

/**
 * Type guard to check if dateOfBirth is valid (not in future, reasonable age)
 */
export function isValidDateOfBirth(date: Date): boolean {
  const now = new Date();
  const minDate = new Date();
  minDate.setFullYear(now.getFullYear() - 120); // Max age 120 years

  return date <= now && date >= minDate;
}

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate investor form data
 */
export function validateInvestorFormData(
  data: InvestorFormData
): ValidationResult {
  const errors: Record<string, string> = {};

  // First name validation
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.length > 100) {
    errors.firstName = 'First name must be 100 characters or less';
  }

  // Last name validation
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.length > 100) {
    errors.lastName = 'Last name must be 100 characters or less';
  }

  // Date of birth validation
  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(data.dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = 'Invalid date format';
    } else if (!isValidDateOfBirth(dob)) {
      errors.dateOfBirth = 'Invalid date of birth';
    }
  }

  // Phone number validation
  if (!data.phoneNumber || data.phoneNumber.trim().length === 0) {
    errors.phoneNumber = 'Phone number is required';
  } else if (data.phoneNumber.length > 20) {
    errors.phoneNumber = 'Phone number must be 20 characters or less';
  }

  // Street address validation
  if (!data.streetAddress || data.streetAddress.trim().length === 0) {
    errors.streetAddress = 'Street address is required';
  } else if (data.streetAddress.length > 255) {
    errors.streetAddress = 'Street address must be 255 characters or less';
  }

  // State validation
  if (!data.state || data.state.trim().length === 0) {
    errors.state = 'State is required';
  } else if (!isValidStateCode(data.state)) {
    errors.state = 'Invalid state code';
  }

  // Zip code validation
  if (!data.zipCode || data.zipCode.trim().length === 0) {
    errors.zipCode = 'Zip code is required';
  } else if (data.zipCode.length > 10) {
    errors.zipCode = 'Zip code must be 10 characters or less';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
