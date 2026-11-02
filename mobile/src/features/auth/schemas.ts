import { z } from 'zod';

import { isValidIndianMobile, normalizeIndianMobile } from '../../utils/phone';

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long');

const confirmPasswordField = z.string().min(1, 'Confirm your password');

const emailField = z.string().trim().email('Enter a valid email address');

const phoneField = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .transform(value => (value === '' ? undefined : value))
  .refine(
    value => value == null || isValidIndianMobile(value),
    'Enter a valid 10-digit Indian mobile number',
  );

/** Required Indian mobile for sales onboarding. */
export const requiredIndianMobileField = z
  .string()
  .trim()
  .refine(isValidIndianMobile, 'Enter a valid 10-digit Indian mobile number')
  .transform(value => normalizeIndianMobile(value)!);

const optionalGstField = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .transform(value => (value === '' ? undefined : value));

const passwordMatchRefine = <T extends { password: string; confirmPassword: string }>(
  schema: z.ZodType<T>,
) =>
  schema.refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/** Email or phone — backend contract TBD; accept non-empty identifier. */
export const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Enter your email or phone number'),
  password: z.string().min(1, 'Enter your password'),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const registerRetailerSchema = passwordMatchRefine(
  z.object({
    businessName: z.string().trim().min(2, 'Business name is required'),
    contactName: z.string().trim().min(2, 'Contact name is required'),
    email: emailField,
    phone: phoneField,
    password: passwordField,
    confirmPassword: confirmPasswordField,
    gstNumber: optionalGstField,
  }),
);

export type RegisterRetailerFormValues = z.infer<typeof registerRetailerSchema>;

export const registerSupplierSchema = passwordMatchRefine(
  z.object({
    businessName: z.string().trim().min(2, 'Company name is required'),
    contactName: z.string().trim().min(2, 'Contact name is required'),
    email: emailField,
    phone: phoneField,
    password: passwordField,
    confirmPassword: confirmPasswordField,
    taxId: optionalGstField,
  }),
);

export type RegisterSupplierFormValues = z.infer<typeof registerSupplierSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Enter your email or mobile number')
    .refine(
      value => value.includes('@') || isValidIndianMobile(value),
      'Enter a valid email or 10-digit Indian mobile',
    ),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
