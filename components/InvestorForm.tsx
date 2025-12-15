'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  InputAdornment,
  Backdrop,
  Zoom,
} from '@mui/material';
import {
  Person,
  Phone,
  Home,
  Upload,
  CheckCircle,
  Refresh,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// US States
const US_STATES = [
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

// Validation schema
const investorSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or less'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or less'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const dob = new Date(date);
      const now = new Date();
      const age = now.getFullYear() - dob.getFullYear();
      return age >= 18 && age <= 120;
    }, 'Must be between 18 and 120 years old'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^(\+?1[-.\s]?)?\(?([2-9][0-9]{2})\)?[-.\s]?([2-9][0-9]{2})[-.\s]?([0-9]{4})$/,
      'Invalid phone number. Format: 1-951-526-3834 or (951) 526-3834'
    ),
  streetAddress: z
    .string()
    .min(1, 'Street address is required')
    .max(255, 'Street address must be 255 characters or less'),
  state: z.string().length(2, 'Please select a state'),
  zipCode: z
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
    }, 'Invalid US ZIP code'),
  file: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: 'Document is required',
    })
    .refine(
      (files) => files instanceof FileList && files[0]?.size <= 3 * 1024 * 1024,
      {
        message: 'File size must be less than 3MB',
      }
    )
    .refine(
      (files) =>
        files instanceof FileList &&
        ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(
          files[0]?.type
        ),
      {
        message: 'Only PDF, JPG, and PNG files are allowed',
      }
    ),
});

type InvestorFormData = z.infer<typeof investorSchema>;

export default function InvestorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvestorFormData>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      streetAddress: '',
      state: '',
      zipCode: '',
    },
  });

  const onSubmit = async (data: InvestorFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('dateOfBirth', data.dateOfBirth);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('streetAddress', data.streetAddress);
      formData.append('state', data.state);
      formData.append('zipCode', data.zipCode);
      formData.append('file', data.file[0]);

      const response = await fetch('/api/investors', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit form');
      }

      // Ensure minimum 400ms loading time
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 400 - elapsed);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      setSubmitSuccess(true);
      reset();
      setSelectedFileName('');

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setSubmitSuccess(false);
    setSubmitError(null);
    reset();
    setSelectedFileName('');
  };

  // Success View
  if (submitSuccess) {
    return (
      <Zoom in={submitSuccess}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'inline-block',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.7)',
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 0 20px rgba(255, 255, 255, 0)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)',
                  },
                },
              }}
            >
              <CheckCircle
                sx={{
                  fontSize: 80,
                  animation: 'checkmark 0.5s ease-in-out',
                  '@keyframes checkmark': {
                    '0%': {
                      transform: 'scale(0) rotate(0deg)',
                      opacity: 0,
                    },
                    '50%': {
                      transform: 'scale(1.2) rotate(180deg)',
                    },
                    '100%': {
                      transform: 'scale(1) rotate(360deg)',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Success!
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Your investor information has been submitted successfully.
          </Typography>

          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              p: 3,
              mb: 4,
            }}
          >
            <Typography variant="body1" sx={{ mb: 1 }}>
              ✓ Personal information saved
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              ✓ Address details recorded
            </Typography>
            <Typography variant="body1">
              ✓ Document uploaded securely
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={handleStartOver}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
            }}
          >
            Submit Another Entry
          </Button>
        </Paper>
      </Zoom>
    );
  }

  return (
    <>
      {/* Loading Overlay */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(0, 0, 0, 0.8)',
          position: 'absolute',
          borderRadius: 2,
        }}
        open={isSubmitting}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#667eea',
              mb: 2,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Submitting Your Information...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Please wait while we process your data
          </Typography>
        </Box>
      </Backdrop>

      <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Investor Information Form
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please provide your information below. All fields are required.
          </Typography>
        </Box>

        {submitError && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setSubmitError(null)}
          >
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Personal Information Section */}
            <Typography
              variant="h6"
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Person /> Personal Information
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              }}
            >
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    required
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    disabled={isSubmitting}
                  />
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    required
                    placeholder="1-951-526-3834"
                    error={!!errors.phoneNumber}
                    helperText={
                      errors.phoneNumber?.message ||
                      'US/Canada format: 1-951-526-3834 or (951) 526-3834'
                    }
                    disabled={isSubmitting}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Address Section */}
            <Typography
              variant="h6"
              sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Home /> Address Information
            </Typography>

            <Controller
              name="streetAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Street Address"
                  fullWidth
                  required
                  error={!!errors.streetAddress}
                  helperText={errors.streetAddress?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              }}
            >
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="State"
                    fullWidth
                    required
                    error={!!errors.state}
                    helperText={errors.state?.message}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="">
                      <em>Select a state</em>
                    </MenuItem>
                    {US_STATES.map((state) => (
                      <MenuItem key={state.value} value={state.value}>
                        {state.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ZIP Code"
                    fullWidth
                    required
                    placeholder="12345"
                    error={!!errors.zipCode}
                    helperText={
                      errors.zipCode?.message || 'US ZIP: 12345 or 12345-6789'
                    }
                    disabled={isSubmitting}
                    slotProps={{ htmlInput: { maxLength: 10 } }}
                  />
                )}
              />
            </Box>

            {/* Document Upload Section */}
            <Typography
              variant="h6"
              sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Upload /> Document Upload
            </Typography>

            <Controller
              name="file"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<Upload />}
                    disabled={isSubmitting}
                    sx={{ p: 2 }}
                  >
                    {selectedFileName ||
                      'Upload ID Document (PDF, JPG, PNG - Max 3MB)'}
                    <input
                      {...field}
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        onChange(e.target.files);
                        setSelectedFileName(e.target.files?.[0]?.name || '');
                      }}
                    />
                  </Button>
                  {errors.file && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      {String(errors.file.message)}
                    </Typography>
                  )}
                  {selectedFileName && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Selected: {selectedFileName}
                    </Typography>
                  )}
                </Box>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 2, py: 1.5 }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Submitting...
                </>
              ) : (
                'Submit Information'
              )}
            </Button>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
