export const BASE_API_ENDPOINT = "/api/v1";

export const APP_ROUTES = {
  API_AUTH: "/auth",
  LOGIN: "/auth/login",
  VERIFY: "/auth/:token",
};

export const AUTH_ROUTES = {
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
};
export const MAIL_ROUTES = {
  SEND_MAIL: "/send",
};

export const USER_EMAIL_MANAGEMENT_ROUTES = {
  ADD_EMAIL: "/add-email",
  GET_ALL_EMAILS: "/get-all-emails",
  DELETE_EMAIL: "/delete-email",
  GET_EMAIL_PASSWORD: "/get-email-password",
};
