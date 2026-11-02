import {z} from 'zod';

export const createSupportQuerySchema = z.object({
  category: z.enum(['orders', 'quotations', 'account', 'payments', 'other']),
  subject: z.string().trim().min(4).max(160),
  message: z.string().trim().min(10).max(2000),
});

export const updateSupportStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved']),
  adminNote: z.string().trim().max(500).optional(),
});
