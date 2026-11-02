/** Indian mobile helpers for sales / auth validation. */

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Accepts 10-digit mobile, or 12-digit with leading 91, or +91 prefixed input.
 * Returns canonical 10-digit local number, or null if invalid.
 */
export function normalizeIndianMobile(value: string): string | null {
  let digits = digitsOnly(value);
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  if (!/^[6-9]\d{9}$/.test(digits)) {
    return null;
  }
  return digits;
}

export function isValidIndianMobile(value: string): boolean {
  return normalizeIndianMobile(value) != null;
}

export function formatIndianMobileDisplay(value: string): string {
  const normalized = normalizeIndianMobile(value);
  if (!normalized) {
    return value.trim();
  }
  return `+91 ${normalized.slice(0, 5)} ${normalized.slice(5)}`;
}

export function maskIndianMobile(value: string): string {
  const normalized = normalizeIndianMobile(value);
  if (!normalized) {
    return '••••••••••';
  }
  return `+91 ••••••${normalized.slice(-4)}`;
}
