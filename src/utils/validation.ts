/**
 * Form and input validation utilities for ZAANISUNG e-commerce
 */

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  // Standard RFC 5322 compatible regex check
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(email.trim());
}

export function validateGhanaPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // Ghana local: 10 digits starting with 02, 05, 03 (e.g. 0244123456)
  // Ghana intl: +233 followed by 9 digits (e.g. +233244123456 or 233244123456)
  const localMatch = /^0[235][0-9]{8}$/.test(cleaned);
  const intlMatch = /^(\+?233)[235][0-9]{8}$/.test(cleaned);
  return localMatch || intlMatch;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}
