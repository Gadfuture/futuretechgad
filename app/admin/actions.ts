"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";

export async function updateRequestStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  const status = String(formData.get("status") ?? "");
  const recipient = String(formData.get("recipient") ?? "");

  const { error } = await supabase.from("service_requests").update({ status }).eq("id", requestId);
  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  if (recipient) {
    await sendTransactionalEmail({
      to: recipient,
      subject: "FUTURETECHGAD request status updated",
      html: `
        <h1>Status updated</h1>
        <p>Your request status has been updated to <strong>${status}</strong>.</p>
        <p>Sign in to the client dashboard to review the latest details.</p>
      `
    });
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin?message=Status updated.");
}

export async function addAdminMessageAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  const message = String(formData.get("message") ?? "");

  const { error } = await supabase.from("request_messages").insert({
    request_id: requestId,
    author_role: "admin",
    message
  });

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin?message=Admin note sent.");
}
