import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseConfig } from "@/lib/supabase/config";
import type { Profile } from "@/lib/types";

export async function getSessionContext() {
  if (!hasPublicSupabaseConfig()) {
    return { supabase: null, user: null, profile: null };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;

  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  return { supabase, user, profile };
}

export async function requireUser() {
  const ctx = await getSessionContext();
  if (!ctx.user || !ctx.supabase) {
    redirect("/auth/login");
  }
  return {
    supabase: ctx.supabase,
    user: ctx.user,
    profile: ctx.profile
  };
}

export async function requireAdmin() {
  const ctx = await requireUser();
  if (ctx.profile?.role !== "admin") {
    redirect("/dashboard");
  }
  return ctx;
}
