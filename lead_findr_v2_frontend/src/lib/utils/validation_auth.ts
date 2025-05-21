export type ValidationResult = {
    fieldErrors: Partial<Record<"email" | "password" | "confirm" | "name", string[]>>;
    formErrors: string[];
};

export function validateEmail(email: string): string | null {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!regex.test(email)) return "Invalid email format.";
    return null;
}

export function validatePasswordStrength(password: string): string[] {
    const errors: string[] = [];
    if (!password) errors.push("Password is required.");
    else {
        if (password.length < 8) errors.push("Must be at least 8 characters.");
        if (!/[a-z]/.test(password)) errors.push("Include a lowercase letter.");
        if (!/[A-Z]/.test(password)) errors.push("Include an uppercase letter.");
        if (!/\d/.test(password)) errors.push("Include a number.");
    }
    return errors;
}

// ───── Login ─────────────────────────────
export function validateLogin(email: string, password: string): ValidationResult {
    const fieldErrors: ValidationResult["fieldErrors"] = {};
    const formErrors: string[] = [];

    // Email validation
    if (!email.trim()) {
        fieldErrors.email = ["Email is required."];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        fieldErrors.email = ["Please enter a valid email address."];
    }

    // Password validation
    if (!password.trim()) {
        fieldErrors.password = ["Password is required."];
    } else if (password.length < 6) {
        fieldErrors.password = ["Password must be at least 6 characters."];
    }
    return { fieldErrors, formErrors };

}

// ───── Signup ────────────────────────────
export function validateSignup(email: string, password: string, confirm: string): ValidationResult {
    const fieldErrors: ValidationResult["fieldErrors"] = {};
    const formErrors: string[] = [];

    const emailError = validateEmail(email);
    if (emailError) fieldErrors.email = [emailError];

    const passErrors = validatePasswordStrength(password);
    if (passErrors.length > 0) fieldErrors.password = passErrors.slice(0, 5);

    if (confirm !== password) fieldErrors.confirm = ["Passwords do not match."];

    return { fieldErrors, formErrors };
}

// ───── Forgot Password ───────────────────
export function validateForgotPassword(email: string): ValidationResult {
    const fieldErrors: ValidationResult["fieldErrors"] = {};
    const formErrors: string[] = [];

    const emailError = validateEmail(email);
    if (emailError) fieldErrors.email = [emailError];

    return { fieldErrors, formErrors };
}

// ───── Reset Password ────────────────────
export function validateResetPassword(password: string, confirm: string): ValidationResult {
    const fieldErrors: ValidationResult["fieldErrors"] = {};
    const formErrors: string[] = [];

    const passErrors = validatePasswordStrength(password);
    if (passErrors.length > 0) fieldErrors.password = passErrors.slice(0, 5);

    if (confirm !== password) fieldErrors.confirm = ["Passwords do not match."];

    return { fieldErrors, formErrors };
}

// ───── Change Password ───────────────────
export function validateChangePassword(current: string, next: string, confirm: string): ValidationResult {
    const fieldErrors: ValidationResult["fieldErrors"] = {};
    const formErrors: string[] = [];

    if (!current) fieldErrors.password = ["Current password is required."];

    if (current === next) {
        fieldErrors.confirm = ["New password must be different from current."];
    } else {
        const nextErrors = validatePasswordStrength(next);
        if (nextErrors.length > 0) fieldErrors.confirm = nextErrors.slice(0, 5);

        if (confirm !== next) {
            if (!fieldErrors.confirm) fieldErrors.confirm = [];
            fieldErrors.confirm.push("Passwords do not match.");
        }
    }

    return { fieldErrors, formErrors };
}
