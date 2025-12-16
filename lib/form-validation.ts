/**
 * Front-end form validation schemas and utilities
 * Uses Zod for runtime validation with React Hook Form
 */

import { z } from 'zod';

/**
 * US States for dropdown selection
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
];

/**
 * Validation constants
 */
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

/**
 * First name validation schema
 */
const firstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .max(100, 'First name must be 100 characters or less');

/**
 * Last name validation schema
 */
const lastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .max(100, 'Last name must be 100 characters or less');

/**
 * Date of birth validation schema
 * Must result in age between 18 and 120 years
 */
const dateOfBirthSchema = z
  .string()
  .min(1, 'Date of birth is required')
  .refine((date) => {
    const dob = new Date(date);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 120;
  }, 'Must be between 18 and 120 years old');

/**
 * Phone number validation schema
 * Accepts US/Canada formats: 1-951-526-3834 or (951) 526-3834
 */
const phoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    /^(\+?1[-.\s]?)?\(?([2-9][0-9]{2})\)?[-.\s]?([2-9][0-9]{2})[-.\s]?([0-9]{4})$/,
    'Invalid phone number. Format: 1-951-526-3834 or (951) 526-3834'
  );

/**
 * Street address validation schema
 */
const streetAddressSchema = z
  .string()
  .min(1, 'Street address is required')
  .max(255, 'Street address must be 255 characters or less');

/**
 * State validation schema
 * Must be 2-letter US state code
 */
const stateSchema = z.string().length(2, 'Please select a state');

/**
 * ZIP code validation schema
 * Must be valid US ZIP code in 5 or 9 digit format
 * Range: 00501-99950
 */
const zipCodeSchema = z
  .string()
  .min(1, 'ZIP code is required')
  .regex(
    /^\d{5}(-\d{4})?$/,
    'Invalid ZIP code. Must be 5 digits (e.g., 12345) or 9 digits (e.g., 12345-6789)'
  )
  .refine((zip) => {
    const zipOnly = zip.split('-')[0];
    const zipNum = parseInt(zipOnly, 10);
    // Valid US ZIP codes range from 00501 to 99950
    return zipNum >= 501 && zipNum <= 99950;
  }, 'Invalid US ZIP code');

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
        if (files[i].size > MAX_FILE_SIZE) return false;
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
        if (!ALLOWED_FILE_TYPES.includes(files[i].type)) return false;
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
