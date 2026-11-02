import {z} from 'zod';

export const createRfqSchema = z.object({
  title: z.string().trim().min(3).max(200),
  dueDate: z.string().datetime().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid().optional(),
        description: z.string().trim().min(2).max(300),
        quantity: z.number().positive(),
        unit: z.string().trim().max(32).optional(),
        targetPrice: z.number().nonnegative().optional(),
        notes: z.string().trim().max(500).optional(),
      }),
    )
    .min(1)
    .max(50),
});

export const createOrderSchema = z.object({
  supplierId: z.string().uuid(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().positive(),
      }),
    )
    .min(1)
    .max(100),
});
