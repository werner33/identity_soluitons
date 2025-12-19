/**
 * Front-end form validation schemas and utilities
 * Uses Zod for runtime validation with React Hook Form
 */

import { z } from 'zod';
import {
  US_STATES,
  FILE_VALIDATION,
  FIELD_LENGTHS,
  AGE_CONSTRAINTS,
  PHONE_VALIDATION,
  ZIP_VALIDATION,
  calculateAge,
  isValidZipRange,
} from '@/lib/validation-constants';

export { US_STATES };

/**
 * First name validation schema
 */
const firstNameSchema = z
  .string()
  .min(FIELD_LENGTHS.FIRST_NAME_MIN, 'First name is required')
  .max(FIELD_LENGTHS.FIRST_NAME_MAX, 'First name must be 100 characters or less');

/**
 * Last name validation schema
 */
const lastNameSchema = z
  .string()
  .min(FIELD_LENGTHS.LAST_NAME_MIN, 'Last name is required')
  .max(FIELD_LENGTHS.LAST_NAME_MAX, 'Last name must be 100 characters or less');

/**
 * Date of birth validation schema
 * Must result in age between 18 and 120 years
 */
const dateOfBirthSchema = z
  .string()
  .min(1, 'Date of birth is required')
  .refine((date) => {
    const age = calculateAge(date);
    return age >= AGE_CONSTRAINTS.MIN && age <= AGE_CONSTRAINTS.MAX;
  }, 'Must be between 18 and 120 years old');

/**
 * Phone number validation schema
 * Accepts US/Canada formats: 1-951-526-3834 or (951) 526-3834
 */
const phoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    PHONE_VALIDATION.REGEX,
    `Invalid phone number. Format: ${PHONE_VALIDATION.FORMAT_EXAMPLE}`
  );

/**
 * Street address validation schema
 */
const streetAddressSchema = z
  .string()
  .min(FIELD_LENGTHS.STREET_ADDRESS_MIN, 'Street address is required')
  .max(FIELD_LENGTHS.STREET_ADDRESS_MAX, 'Street address must be 255 characters or less');

/**
 * State validation schema
 * Must be 2-letter US state code
 */
const stateSchema = z.string().length(FIELD_LENGTHS.STATE_LENGTH, 'Please select a state');

/**
 * ZIP code validation schema
 * Must be valid US ZIP code in 5 or 9 digit format
 * Range: 00501-99950
 */
const zipCodeSchema = z
  .string()
  .min(1, 'ZIP code is required')
  .regex(
    ZIP_VALIDATION.REGEX,
    `Invalid ZIP code. Must be ${ZIP_VALIDATION.FORMAT_EXAMPLE}`
  )
  .refine(
    (zip) => isValidZipRange(zip),
    'Invalid US ZIP code'
  );

/**
 * Files validation schema
 * Requires at least one file
 * Each file must be under 3MB
 * Only PDF, JPG, and PNG allowed
 */
const filesSchema = z
  .any()
  .refine((files) => files instanceof FileList && files.length > 0, {
    message: 'At least one document is required',
  })
  .refine(
    (files) => {
      if (!(files instanceof FileList)) return false;
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > FILE_VALIDATION.MAX_SIZE) return false;
      }
      return true;
    },
    {
      message: 'Each file must be less than 3MB',
    }
  )
  .refine(
    (files) => {
      if (!(files instanceof FileList)) return false;
      for (let i = 0; i < files.length; i++) {
        if (!FILE_VALIDATION.ALLOWED_TYPES.includes(files[i].type as typeof FILE_VALIDATION.ALLOWED_TYPES[number])) return false;
      }
      return true;
    },
    {
      message: 'Only PDF, JPG, and PNG files are allowed',
    }
  );

/**
 * Complete investor form validation schema
 */
export const investorSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  dateOfBirth: dateOfBirthSchema,
  phoneNumber: phoneNumberSchema,
  streetAddress: streetAddressSchema,
  state: stateSchema,
  zipCode: zipCodeSchema,
  files: filesSchema,
});

/**
 * Type inference from schema
 */
export type InvestorFormData = z.infer<typeof investorSchema>;
