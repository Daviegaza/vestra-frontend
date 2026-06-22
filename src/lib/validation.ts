export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return null;
}

export function validateKenyanPhone(phone: string): string | null {
  if (!phone) return 'Phone number is required';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) return null;
  if (cleaned.length === 10 && (cleaned.startsWith('07') || cleaned.startsWith('01'))) return null;
  if (cleaned.length === 12 && cleaned.startsWith('254')) return null;
  return 'Enter a valid Kenyan phone number (e.g., 0712 345 678)';
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return null;
}

export function validateMinLength(value: string, min: number, fieldName: string): string | null {
  if (!value || value.length < min) return `${fieldName} must be at least ${min} characters`;
  return null;
}

export function validatePositiveNumber(value: string | number, fieldName: string): string | null {
  const n = typeof value === 'string' ? Number(value) : value;
  if (isNaN(n) || n <= 0) return `${fieldName} must be a positive number`;
  return null;
}

export function validateInteger(value: string | number, fieldName: string): string | null {
  const n = typeof value === 'string' ? Number(value) : value;
  if (isNaN(n) || !Number.isInteger(n) || n < 0) return `${fieldName} must be a whole number`;
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  return null;
}

export interface FieldRules {
  [key: string]: (value: string) => string | null;
}

export function validate<T extends Record<string, string>>(values: T, rules: FieldRules): Record<string, string | null> {
  const errors: Record<string, string | null> = {};
  for (const [field, rule] of Object.entries(rules)) {
    errors[field] = rule(values[field] || '');
  }
  return errors;
}
