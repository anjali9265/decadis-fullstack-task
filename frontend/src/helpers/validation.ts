import type { UserInput, ValidationResult } from "@/types";

export function validateUserInput(data: UserInput): ValidationResult {
  if (!data.firstname || !data.lastname || !data.email) {
    return { valid: false, error: "Firstname, lastname and email are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  return { valid: true, error: ""};
}
