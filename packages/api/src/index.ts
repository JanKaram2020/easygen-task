import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9\s]/,
      'Password must contain at least one special character',
    ),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(3, 'Name must be at least 3 characters'),
});
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
