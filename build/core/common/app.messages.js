"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppMessages = void 0;
exports.AppMessages = {
    FAILURE: {
        INVALID_TOKEN_PROVIDED: 'Invalid token provided.',
        INVALID_CREDENTIALS: 'Invalid credentials provided.',
        ACCOUNT_EXISTS: 'A user with this email/phone number already exists. Please use a different email/phone number or log in to your existing account.',
        EMAIL_NOT_VERIFIED: 'Please verify your email address',
        FORBIDDEN_RESOURCE: 'Forbidden Resource. You do not have the required permissions to access this resource',
        VERIFY_ACCOUNT: "For your account's ongoing security, we require you to establish a new password.  Logging in with the default password is no longer possible due to enhanced security measures.",
    },
    SUCCESS: {
        LOGIN: 'Login successful.',
        ACCOUNT_CREATED: 'Account Created successfully.',
        ADMIN_INVITED: 'Invitation Sent successfully.',
        LOGOUT: 'Logged out successfully.',
        SIGNUP: 'Signup successful',
        EMAIL_SENT: 'If you have an account with us, You will receive a mail to',
        PASSWORD_RESET: 'Password reset successfully',
        TOKEN_REFRESHED: 'Token Refreshed Successfully',
        DATA_FETCHED: 'Data Retreived Successfully',
        BULK_CREATE_SUCCESS: 'Bulk user creation done successfully',
    },
    INFO: {
        INVALID_OPERATION: 'Invalid operation.',
        EMPTY_TOKEN_HEADER: 'Invalid authorization header',
    },
};
