export const VALIDATION_PATTERNS = {
    EMAIL: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Enter a valid email address'
    },
    PHONENUMBER: { 
        value: /^\d{10,15}$/,
        message: 'Enter a valid phone number (10-15 digits)',
    },
    LASTNAME: {
        value: /^[A-Za-zÀ-ÿ'\-\s]*$/,
        message: 'Last name must contain only letters',
    },

    FIRSTNAME: {
        value: /^[A-Za-zÀ-ÿ'\-\s]+$/,
        message: 'First name must contain only letters or valid characters',
    },
}