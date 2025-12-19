/**
 * Server-side validation for investor data
 * Provides comprehensive validation matching front-end rules
 */

import {
  US_STATES_LIST,
  FILE_VALIDATION,
  FIELD_LENGTHS,
  AGE_CONSTRAINTS,
  ZIP_VALIDATION,
  ERROR_MESSAGES,
  normalizePhoneNumber,
  calculateAge,
  isValidZipRange,
  isValidStateCode,
} from '@/lib/validation-constants';

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
 * Validate first name
 */
function validateFirstName(firstName: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!firstName?.trim()) {
    errors.push({ field: 'firstName', message: ERROR_MESSAGES.FIRST_NAME_REQUIRED });
    return errors;
  }

  if (firstName.trim().length < FIELD_LENGTHS.FIRST_NAME_MIN || firstName.length > FIELD_LENGTHS.FIRST_NAME_MAX) {
    errors.push({
      field: 'firstName',
      message: ERROR_MESSAGES.FIRST_NAME_LENGTH,
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
    errors.push({ field: 'lastName', message: ERROR_MESSAGES.LAST_NAME_REQUIRED });
    return errors;
  }

  if (lastName.trim().length < FIELD_LENGTHS.LAST_NAME_MIN || lastName.length > FIELD_LENGTHS.LAST_NAME_MAX) {
    errors.push({
      field: 'lastName',
      message: ERROR_MESSAGES.LAST_NAME_LENGTH,
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
      message: ERROR_MESSAGES.STREET_ADDRESS_REQUIRED,
    });
    return errors;
  }

  if (streetAddress.trim().length < FIELD_LENGTHS.STREET_ADDRESS_MIN || streetAddress.length > FIELD_LENGTHS.STREET_ADDRESS_MAX) {
    errors.push({
      field: 'streetAddress',
      message: ERROR_MESSAGES.STREET_ADDRESS_LENGTH,
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
    errors.push({ field: 'state', message: ERROR_MESSAGES.STATE_REQUIRED });
    return errors;
  }

  if (state.length !== FIELD_LENGTHS.STATE_LENGTH) {
    errors.push({
      field: 'state',
      message: ERROR_MESSAGES.STATE_LENGTH,
    });
    return errors;
  }

  if (!isValidStateCode(state)) {
    errors.push({ field: 'state', message: ERROR_MESSAGES.STATE_INVALID });
  }

  return errors;
}

/**
 * Validate ZIP code
 */
function validateZipCode(zipCode: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!zipCode) {
    errors.push({ field: 'zipCode', message: ERROR_MESSAGES.ZIP_REQUIRED });
    return errors;
  }

  if (!ZIP_VALIDATION.REGEX.test(zipCode)) {
    errors.push({
      field: 'zipCode',
      message: ERROR_MESSAGES.ZIP_FORMAT,
    });
    return errors;
  }

  if (!isValidZipRange(zipCode)) {
    errors.push({
      field: 'zipCode',
      message: ERROR_MESSAGES.ZIP_RANGE,
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
    errors.push({ field: 'dateOfBirth', message: ERROR_MESSAGES.DATE_OF_BIRTH_REQUIRED });
    return errors;
  }

  const age = calculateAge(dateOfBirth);

  if (age < AGE_CONSTRAINTS.MIN || age > AGE_CONSTRAINTS.MAX) {
    errors.push({
      field: 'dateOfBirth',
      message: ERROR_MESSAGES.AGE_RANGE,
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
    errors.push({ field: 'phoneNumber', message: ERROR_MESSAGES.PHONE_REQUIRED });
    return errors;
  }

  if (normalized.length !== FIELD_LENGTHS.PHONE_LENGTH) {
    errors.push({
      field: 'phoneNumber',
      message: ERROR_MESSAGES.PHONE_LENGTH,
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
    errors.push({ field: 'files', message: ERROR_MESSAGES.FILES_REQUIRED });
    return errors;
  }

  for (const file of files) {
    if (file.size > FILE_VALIDATION.MAX_SIZE) {
      errors.push({
        field: 'files',
        message: ERROR_MESSAGES.FILE_SIZE(file.name),
      });
    }

    if (!FILE_VALIDATION.ALLOWED_TYPES.includes(file.type as typeof FILE_VALIDATION.ALLOWED_TYPES[number])) {
      errors.push({
        field: 'files',
        message: ERROR_MESSAGES.FILE_TYPE(file.name),
      });
    }

    if (file.name.length > FILE_VALIDATION.MAX_FILENAME_LENGTH) {
      errors.push({
        field: 'files',
        message: ERROR_MESSAGES.FILE_NAME_LENGTH(file.name),
      });
    }

    if (file.type.length > FILE_VALIDATION.MAX_MIME_TYPE_LENGTH) {
      errors.push({
        field: 'files',
        message: ERROR_MESSAGES.FILE_MIME_TYPE(file.name),
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
