import {z} from 'zod';

const email = z.string().trim().email().max(255);
const password = z.string().min(8).max(128);
const indianPhone = z
  .string()
  .trim()
  .regex(/^(?:\+91[\s-]?)?[6-9]\d{9}$/, 'Enter a valid Indian mobile number');

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export const registerRetailerSchema = z.object({
  email,
  password,
  displayName: z.string().trim().min(2).max(120),
  businessName: z.string().trim().min(2).max(200),
  phone: indianPhone.optional(),
});

export const registerSupplierSchema = z.object({
  email,
  password,
  displayName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(200),
  taxId: z.string().trim().max(64).optional(),
  phone: indianPhone.optional(),
});

export const passwordResetSchema = z.object({
  email: email.optional(),
  phone: indianPhone.optional(),
}).refine(data => data.email || data.phone, {
  message: 'Provide email or phone',
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: password,
});

export const startMobileSchema = z.object({
  phone: indianPhone,
});

export const verifyMobileSchema = z.object({
  phone: indianPhone,
  otp: z.string().trim().length(6),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});
