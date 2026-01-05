import { describe, it, expect } from "vitest";
import { signInSchema, signUpSchema } from "./auth-schema";

describe("signInSchema", () => {
  it("should validate correct sign-in data", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
    };
    const result = signInSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const invalidData = {
      email: "not-an-email",
      password: "password123",
    };
    const result = signInSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject missing password", () => {
    const invalidData = {
      email: "test@example.com",
    };
    const result = signInSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("signUpSchema", () => {
  it("should validate correct sign-up data", () => {
    const validData = {
      name: "John",
      email: "john@example.com",
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };
    const result = signUpSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject weak password without uppercase", () => {
    const invalidData = {
      name: "John",
      email: "john@example.com",
      password: "securepass123!",
      confirmPassword: "securepass123!",
    };
    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject weak password without number", () => {
    const invalidData = {
      name: "John",
      email: "john@example.com",
      password: "SecurePass!",
      confirmPassword: "SecurePass!",
    };
    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject password too short", () => {
    const invalidData = {
      name: "John",
      email: "john@example.com",
      password: "Pass1!",
      confirmPassword: "Pass1!",
    };
    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject mismatched passwords", () => {
    const invalidData = {
      name: "John",
      email: "john@example.com",
      password: "TestPassword123!",
      confirmPassword: "DifferentPassword123!",
    };
    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject missing name", () => {
    const invalidData = {
      name: "",
      email: "john@example.com",
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    };
    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
