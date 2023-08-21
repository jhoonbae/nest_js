import { registerAs } from "@nestjs/config";

export default registerAs('email', () => ({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
  },
  baseUrl: process.env.EMAIL_BASE_URL,
}));