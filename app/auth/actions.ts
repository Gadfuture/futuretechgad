"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseConfig } from "@/lib/supabase/config";

async function getRedirectUrl() {
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${origin}/auth/callback?next=/dashboard`;
}

export async function signUpAction(formData: FormData) {
  if (!hasPublicSupabaseConfig()) {
    redirect("/auth/sign-up?error=Add Supabase keys to .env.local before creating accounts.");
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const company = String(formData.get("company") ?? "");
  const phone = String(formData.get("phone") ?? "");

  const supabase = await createClient();
  const redirectUrl = await getRedirectUrl();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
        company,
        phone
      }
    }
  });

  if (error) {
    redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth/login?message=Check your inbox to verify your account.");
}

export async function signInAction(formData: FormData) {
  if (!hasPublicSupabaseConfig()) {
    redirect("/auth/login?error=Add Supabase keys to .env.local before logging in.");
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function forgotPasswordAction(formData: FormData) {
  if (!hasPublicSupabaseConfig()) {
    redirect("/auth/forgot-password?error=Add Supabase keys to .env.local before resetting passwords.");
  }

  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/login`
  });

  if (error) {
    redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth/login?message=Password reset email sent.");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
