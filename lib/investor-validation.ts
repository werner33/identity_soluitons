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
 * Validate investor data
 */
export function validateInvestorData(
  data: InvestorValidationData
): ValidationResult {
  const errors: ValidationError[] = [];

  // Normalize phone number to 10 digits only
  const phoneNumber = data.phoneNumber.replace(/\D/g, '');

  // Validate required fields
  if (!data.firstName?.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!data.lastName?.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!data.dateOfBirth) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
  }

  if (!phoneNumber) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
  }

  if (!data.streetAddress?.trim()) {
    errors.push({
      field: 'streetAddress',
      message: 'Street address is required',
    });
  }

  if (!data.state) {
    errors.push({ field: 'state', message: 'State is required' });
  }

  if (!data.zipCode) {
    errors.push({ field: 'zipCode', message: 'ZIP code is required' });
  }

  if (!data.files || data.files.length === 0) {
    errors.push({ field: 'files', message: 'At least one file is required' });
  }

  // If required fields are missing, return early
  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Validate first name length
  if (data.firstName.trim().length < 1 || data.firstName.length > 100) {
    errors.push({
      field: 'firstName',
      message: 'First name must be between 1 and 100 characters',
    });
  }

  // Validate last name length
  if (data.lastName.trim().length < 1 || data.lastName.length > 100) {
    errors.push({
      field: 'lastName',
      message: 'Last name must be between 1 and 100 characters',
    });
  }

  // Validate street address length
  if (
    data.streetAddress.trim().length < 1 ||
    data.streetAddress.length > 255
  ) {
    errors.push({
      field: 'streetAddress',
      message: 'Street address must be between 1 and 255 characters',
    });
  }

  // Validate state
  if (data.state.length !== 2) {
    errors.push({
      field: 'state',
      message: 'State must be a valid 2-letter state code',
    });
  } else if (!VALID_STATES.includes(data.state.toUpperCase())) {
    errors.push({ field: 'state', message: 'Invalid US state code' });
  }

  // Validate ZIP code format
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(data.zipCode)) {
    errors.push({
      field: 'zipCode',
      message:
        'Invalid ZIP code format. Must be 5 digits (e.g., 12345) or 9 digits (e.g., 12345-6789)',
    });
  } else {
    // Validate ZIP code range
    const zipNum = parseInt(data.zipCode.split('-')[0], 10);
    if (zipNum < 501 || zipNum > 99950) {
      errors.push({
        field: 'zipCode',
        message: 'ZIP code must be a valid US ZIP code (00501-99950)',
      });
    }
  }

  // Validate date of birth (age 18-120)
  const dob = new Date(data.dateOfBirth);
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

  // Validate phone number is exactly 10 digits
  if (phoneNumber.length !== 10) {
    errors.push({
      field: 'phoneNumber',
      message: 'Phone number must be exactly 10 digits',
    });
  }

  // Validate files
  for (let i = 0; i < data.files.length; i++) {
    const file = data.files[i];

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

    // Check filename length (database limit is 255 chars)
    if (file.name.length > 255) {
      errors.push({
        field: 'files',
        message: `File name "${file.name}" is too long. Maximum 255 characters allowed.`,
      });
    }

    // Check mime type length (database limit is 100 chars)
    if (file.type.length > 100) {
      errors.push({
        field: 'files',
        message: `File "${file.name}" has an invalid mime type.`,
      });
    }
  }

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
      phoneNumber, // Normalized
      streetAddress: data.streetAddress,
      state: data.state.toUpperCase(),
      zipCode: data.zipCode,
      files: data.files,
    },
  };
}
