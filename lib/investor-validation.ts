/**
 * Server-side validation for investor data
 * Provides comprehensive validation matching front-end rules
 */

export interface InvestorValidationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  streetAddress: string;
  state: string;
  zipCode: string;
  files: File[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  data?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string; // Normalized to 10 digits
    streetAddress: string;
    state: string;
    zipCode: string;
    files: File[];
  };
}

/**
 * Valid US state codes
 */
const VALID_STATES = [
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

/**
 * Allowed file MIME types
 */
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

/**
 * Maximum file size (3MB)
 */
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '3145728', 10);

/**
 * Normalize phone number to 10 digits only
 */
function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

/**
 * Validate first name
 */
function validateFirstName(firstName: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!firstName?.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
    return errors;
  }

  if (firstName.trim().length < 1 || firstName.length > 100) {
    errors.push({
      field: 'firstName',
      message: 'First name must be between 1 and 100 characters',
    });
  }

  return errors;
}

/**
 * Validate last name
 */
function validateLastName(lastName: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!lastName?.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
    return errors;
  }

  if (lastName.trim().length < 1 || lastName.length > 100) {
    errors.push({
      field: 'lastName',
      message: 'Last name must be between 1 and 100 characters',
    });
  }

  return errors;
}

/**
 * Validate street address
 */
function validateStreetAddress(streetAddress: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!streetAddress?.trim()) {
    errors.push({
      field: 'streetAddress',
      message: 'Street address is required',
    });
    return errors;
  }

  if (streetAddress.trim().length < 1 || streetAddress.length > 255) {
    errors.push({
      field: 'streetAddress',
      message: 'Street address must be between 1 and 255 characters',
    });
  }

  return errors;
}

/**
 * Validate state code
 */
function validateState(state: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!state) {
    errors.push({ field: 'state', message: 'State is required' });
    return errors;
  }

  if (state.length !== 2) {
    errors.push({
      field: 'state',
      message: 'State must be a valid 2-letter state code',
    });
    return errors;
  }

  if (!VALID_STATES.includes(state.toUpperCase())) {
    errors.push({ field: 'state', message: 'Invalid US state code' });
  }

  return errors;
}

/**
 * Validate ZIP code
 */
function validateZipCode(zipCode: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!zipCode) {
    errors.push({ field: 'zipCode', message: 'ZIP code is required' });
    return errors;
  }

  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipCode)) {
    errors.push({
      field: 'zipCode',
      message:
        'Invalid ZIP code format. Must be 5 digits (e.g., 12345) or 9 digits (e.g., 12345-6789)',
    });
    return errors;
  }

  const zipNum = parseInt(zipCode.split('-')[0], 10);
  if (zipNum < 501 || zipNum > 99950) {
    errors.push({
      field: 'zipCode',
      message: 'ZIP code must be a valid US ZIP code (00501-99950)',
    });
  }

  return errors;
}

/**
 * Validate date of birth and age
 */
function validateDateOfBirth(dateOfBirth: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!dateOfBirth) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
    return errors;
  }

  const dob = new Date(dateOfBirth);
  const now = new Date();
  const age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  const dayDiff = now.getDate() - dob.getDate();

  // Adjust age if birthday hasn't occurred this year
  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

  if (actualAge < 18 || actualAge > 120) {
    errors.push({
      field: 'dateOfBirth',
      message: 'Age must be between 18 and 120 years',
    });
  }

  return errors;
}

/**
 * Validate phone number
 */
function validatePhoneNumber(phoneNumber: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const normalized = normalizePhoneNumber(phoneNumber);

  if (!normalized) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
    return errors;
  }

  if (normalized.length !== 10) {
    errors.push({
      field: 'phoneNumber',
      message: 'Phone number must be exactly 10 digits',
    });
  }

  return errors;
}

/**
 * Validate files
 */
function validateFiles(files: File[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!files || files.length === 0) {
    errors.push({ field: 'files', message: 'At least one file is required' });
    return errors;
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      errors.push({
        field: 'files',
        message: `File "${file.name}" exceeds maximum allowed size (3MB)`,
      });
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      errors.push({
        field: 'files',
        message: `File "${file.name}" has invalid type. Only PDF, JPG, and PNG are allowed`,
      });
    }

    if (file.name.length > 255) {
      errors.push({
        field: 'files',
        message: `File name "${file.name}" is too long. Maximum 255 characters allowed.`,
      });
    }

    if (file.type.length > 100) {
      errors.push({
        field: 'files',
        message: `File "${file.name}" has an invalid mime type.`,
      });
    }
  }

  return errors;
}

/**
 * Validate investor data
 */
export function validateInvestorData(
  data: InvestorValidationData
): ValidationResult {
  const errors: ValidationError[] = [];

  // Run all validations
  errors.push(...validateFirstName(data.firstName));
  errors.push(...validateLastName(data.lastName));
  errors.push(...validateStreetAddress(data.streetAddress));
  errors.push(...validateState(data.state));
  errors.push(...validateZipCode(data.zipCode));
  errors.push(...validateDateOfBirth(data.dateOfBirth));
  errors.push(...validatePhoneNumber(data.phoneNumber));
  errors.push(...validateFiles(data.files));

  // Return validation result
  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      phoneNumber: normalizePhoneNumber(data.phoneNumber),
      streetAddress: data.streetAddress,
      state: data.state.toUpperCase(),
      zipCode: data.zipCode,
      files: data.files,
    },
  };
}
