import { Investor, Prisma } from '@prisma/client';
import {
  FIELD_LENGTHS,
  AGE_CONSTRAINTS,
  ERROR_MESSAGES,
  isValidStateCode,
  calculateAge,
  isValidZipRange,
  ZIP_VALIDATION,
} from '@/lib/validation-constants';

/**
 * Re-export Prisma generated types
 */
export type { Investor } from '@prisma/client';

/**
 * Re-export validation utilities
 */
export { isValidStateCode } from '@/lib/validation-constants';

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
  files: FileList | File[]; // Multiple files supported
}

/**
 * Investor with only essential information
 * Used for list views and summaries
 */
export interface InvestorSummary {
  id: string; // UUID
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
  phoneNumber: string; // Normalized to 10 digits
  streetAddress: string;
  state: string; // 2-letter state code
  zipCode: string;
  files: Array<{
    filePath: string;
    fileOriginalName: string;
    fileSize: number;
    mimeType: string;
  }>;
}

/**
 * Input type for updating an existing investor
 * All fields are optional except id
 */
export interface UpdateInvestorInput {
  id: string; // UUID
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string; // Normalized to 10 digits
  streetAddress?: string;
  state?: string; // 2-letter state code
  zipCode?: string;
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
 * Type guard to check if dateOfBirth is valid (not in future, reasonable age)
 */
export function isValidDateOfBirth(date: Date | string): boolean {
  const age = calculateAge(typeof date === 'string' ? date : date.toISOString());
  return age >= AGE_CONSTRAINTS.MIN && age <= AGE_CONSTRAINTS.MAX;
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
    errors.firstName = ERROR_MESSAGES.FIRST_NAME_REQUIRED;
  } else if (
    data.firstName.trim().length < FIELD_LENGTHS.FIRST_NAME_MIN ||
    data.firstName.length > FIELD_LENGTHS.FIRST_NAME_MAX
  ) {
    errors.firstName = ERROR_MESSAGES.FIRST_NAME_LENGTH;
  }

  // Last name validation
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = ERROR_MESSAGES.LAST_NAME_REQUIRED;
  } else if (
    data.lastName.trim().length < FIELD_LENGTHS.LAST_NAME_MIN ||
    data.lastName.length > FIELD_LENGTHS.LAST_NAME_MAX
  ) {
    errors.lastName = ERROR_MESSAGES.LAST_NAME_LENGTH;
  }

  // Date of birth validation
  if (!data.dateOfBirth) {
    errors.dateOfBirth = ERROR_MESSAGES.DATE_OF_BIRTH_REQUIRED;
  } else {
    const dob = new Date(data.dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = 'Invalid date format';
    } else if (!isValidDateOfBirth(dob)) {
      errors.dateOfBirth = ERROR_MESSAGES.AGE_RANGE;
    }
  }

  // Phone number validation
  if (!data.phoneNumber || data.phoneNumber.trim().length === 0) {
    errors.phoneNumber = ERROR_MESSAGES.PHONE_REQUIRED;
  }

  // Street address validation
  if (!data.streetAddress || data.streetAddress.trim().length === 0) {
    errors.streetAddress = ERROR_MESSAGES.STREET_ADDRESS_REQUIRED;
  } else if (
    data.streetAddress.trim().length < FIELD_LENGTHS.STREET_ADDRESS_MIN ||
    data.streetAddress.length > FIELD_LENGTHS.STREET_ADDRESS_MAX
  ) {
    errors.streetAddress = ERROR_MESSAGES.STREET_ADDRESS_LENGTH;
  }

  // State validation
  if (!data.state || data.state.trim().length === 0) {
    errors.state = ERROR_MESSAGES.STATE_REQUIRED;
  } else if (data.state.length !== FIELD_LENGTHS.STATE_LENGTH) {
    errors.state = ERROR_MESSAGES.STATE_LENGTH;
  } else if (!isValidStateCode(data.state)) {
    errors.state = ERROR_MESSAGES.STATE_INVALID;
  }

  // Zip code validation
  if (!data.zipCode || data.zipCode.trim().length === 0) {
    errors.zipCode = ERROR_MESSAGES.ZIP_REQUIRED;
  } else if (!ZIP_VALIDATION.REGEX.test(data.zipCode)) {
    errors.zipCode = ERROR_MESSAGES.ZIP_FORMAT;
  } else if (!isValidZipRange(data.zipCode)) {
    errors.zipCode = ERROR_MESSAGES.ZIP_RANGE;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
