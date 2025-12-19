/**
 * Shared validation constants and rules
 * Single source of truth for validation across front-end and back-end
 */

/**
 * US States for validation and dropdown selection
 */
export const US_STATES_LIST = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
] as const;

/**
 * US States with labels for form dropdowns
 */
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
] as const;

/**
 * File upload constraints
 */
export const FILE_VALIDATION = {
  MAX_SIZE: 3 * 1024 * 1024, // 3MB in bytes
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ] as const,
  MAX_FILENAME_LENGTH: 255,
  MAX_MIME_TYPE_LENGTH: 100,
  MAX_PATH_LENGTH: 500,
} as const;

/**
 * Field length constraints
 */
export const FIELD_LENGTHS = {
  FIRST_NAME_MIN: 1,
  FIRST_NAME_MAX: 100,
  LAST_NAME_MIN: 1,
  LAST_NAME_MAX: 100,
  STREET_ADDRESS_MIN: 1,
  STREET_ADDRESS_MAX: 255,
  STATE_LENGTH: 2,
  PHONE_LENGTH: 10, // After normalization
} as const;

/**
 * Age constraints
 */
export const AGE_CONSTRAINTS = {
  MIN: 18,
  MAX: 120,
} as const;

/**
 * Phone number validation
 */
export const PHONE_VALIDATION = {
  // US/Canada format: optional country code, area code 2-9, exchange 2-9
  REGEX: /^(\+?1[-.\s]?)?\(?([2-9][0-9]{2})\)?[-.\s]?([2-9][0-9]{2})[-.\s]?([0-9]{4})$/,
  FORMAT_EXAMPLE: '1-951-526-3834 or (951) 526-3834',
} as const;

/**
 * ZIP code validation
 */
export const ZIP_VALIDATION = {
  // 5 digits or 5+4 format
  REGEX: /^\d{5}(-\d{4})?$/,
  MIN_RANGE: 501, // 00501 is the lowest valid US ZIP
  MAX_RANGE: 99950,
  FORMAT_EXAMPLE: '12345 or 12345-6789',
} as const;

/**
 * Validation error messages
 */
export const ERROR_MESSAGES = {
  FIRST_NAME_REQUIRED: 'First name is required',
  FIRST_NAME_LENGTH: 'First name must be between 1 and 100 characters',
  LAST_NAME_REQUIRED: 'Last name is required',
  LAST_NAME_LENGTH: 'Last name must be between 1 and 100 characters',
  DATE_OF_BIRTH_REQUIRED: 'Date of birth is required',
  AGE_RANGE: 'Age must be between 18 and 120 years',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: `Invalid phone number. Format: ${PHONE_VALIDATION.FORMAT_EXAMPLE}`,
  PHONE_LENGTH: 'Phone number must be exactly 10 digits',
  STREET_ADDRESS_REQUIRED: 'Street address is required',
  STREET_ADDRESS_LENGTH: 'Street address must be between 1 and 255 characters',
  STATE_REQUIRED: 'State is required',
  STATE_LENGTH: 'State must be a valid 2-letter state code',
  STATE_INVALID: 'Invalid US state code',
  ZIP_REQUIRED: 'ZIP code is required',
  ZIP_FORMAT: `Invalid ZIP code format. Must be ${ZIP_VALIDATION.FORMAT_EXAMPLE}`,
  ZIP_RANGE: `ZIP code must be a valid US ZIP code (00501-99950)`,
  FILES_REQUIRED: 'At least one document is required',
  FILE_SIZE: (filename: string) => `File "${filename}" exceeds maximum allowed size (3MB)`,
  FILE_TYPE: (filename: string) => `File "${filename}" has invalid type. Only PDF, JPG, and PNG are allowed`,
  FILE_NAME_LENGTH: (filename: string) => `File name "${filename}" is too long. Maximum 255 characters allowed.`,
  FILE_MIME_TYPE: (filename: string) => `File "${filename}" has an invalid mime type.`,
  FILE_PATH_LENGTH: (filename: string) => `File name "${filename}" results in a path that is too long. Please use a shorter filename.`,
} as const;

/**
 * Helper function to check if a state code is valid
 */
export function isValidStateCode(state: string): boolean {
  return US_STATES_LIST.includes(state.toUpperCase() as typeof US_STATES_LIST[number]);
}

/**
 * Helper function to normalize phone number to 10 digits
 */
export function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

/**
 * Helper function to calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  const age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  const dayDiff = now.getDate() - dob.getDate();

  // Adjust age if birthday hasn't occurred this year
  return monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
}

/**
 * Helper function to validate ZIP code range
 */
export function isValidZipRange(zipCode: string): boolean {
  const zipNum = parseInt(zipCode.split('-')[0], 10);
  return zipNum >= ZIP_VALIDATION.MIN_RANGE && zipNum <= ZIP_VALIDATION.MAX_RANGE;
}
