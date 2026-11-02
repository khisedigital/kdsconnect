import {
  forgotPasswordSchema,
  registerRetailerSchema,
  signInSchema,
} from '../../src/features/auth/schemas';

describe('signInSchema', () => {
  it('accepts email and password', () => {
    const result = signInSchema.safeParse({
      identifier: 'retailer@example.com',
      password: 'securePass1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty identifier', () => {
    const result = signInSchema.safeParse({
      identifier: '',
      password: 'securePass1',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerRetailerSchema', () => {
  it('requires matching passwords', () => {
    const result = registerRetailerSchema.safeParse({
      businessName: 'Corner Mart',
      contactName: 'Asha',
      email: 'asha@example.com',
      phone: '9876543210',
      password: 'securePass1',
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid retailer registration', () => {
    const result = registerRetailerSchema.safeParse({
      businessName: 'Corner Mart',
      contactName: 'Asha',
      email: 'asha@example.com',
      phone: '',
      password: 'securePass1',
      confirmPassword: 'securePass1',
    });
    expect(result.success).toBe(true);
  });
});

describe('forgotPasswordSchema', () => {
  it('requires email', () => {
    expect(forgotPasswordSchema.safeParse({email: 'bad'}).success).toBe(false);
    expect(
      forgotPasswordSchema.safeParse({email: 'reset@example.com'}).success,
    ).toBe(true);
  });
});
