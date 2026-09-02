"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { signUpSchema, loginSchema } from "@/lib/schema/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export interface AuthFormState {
  status: "idle" | "error";
  message?: string;
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const result = signUpSchema.safeParse(raw);
  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { status: "error", message: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, passwordHash } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/search?onboarding=1" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: "Account created, but sign-in failed. Try logging in." };
    }
    throw error;
  }

  return { status: "idle" };
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirectTo: "/search",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: "Incorrect email or password." };
    }
    throw error;
  }

  return { status: "idle" };
}
