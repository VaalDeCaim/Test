export const DEMO_EMAIL = "vaal.de.caim@gmail.com";
export const DEMO_PASSWORD = "password123!";

const isProd = process.env.NODE_ENV === "production";

export const loginDefaultValues = {
  email: isProd ? "" : DEMO_EMAIL,
  password: isProd ? "" : DEMO_PASSWORD,
};

export const signupDefaultValues = {
  name: isProd ? "" : "Test User",
  email: isProd ? "" : DEMO_EMAIL,
  password: isProd ? "" : DEMO_PASSWORD,
  confirmPassword: isProd ? "" : DEMO_PASSWORD,
  terms: isProd ? false : true,
};

export const forgotPasswordDefaultValues = {
  email: isProd ? "" : DEMO_EMAIL,
};

export const resetPasswordDefaultValues = {
  password: isProd ? "" : DEMO_PASSWORD,
  confirmPassword: isProd ? "" : DEMO_PASSWORD,
};

