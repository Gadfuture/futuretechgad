"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";

export async function createRequestAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const category = String(formData.get("category") ?? "");
  const projectName = String(formData.get("projectName") ?? "");
  const network = String(formData.get("network") ?? "");
  const walletAddress = String(formData.get("walletAddress") ?? "");
  const description = String(formData.get("description") ?? "");

  if (!user.email_confirmed_at) {
    redirect("/dashboard?error=Please verify your email before sending a request.");
  }

  const { error } = await supabase.from("service_requests").insert({
    user_id: user.id,
    category,
    project_name: projectName || null,
    network: network || null,
    wallet_address: walletAddress || null,
    description,
    status: "new"
  });

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  if (user.email) {
    await sendTransactionalEmail({
      to: user.email,
      subject: "FUTURETECHGAD request received",
      html: `
        <h1>Request received</h1>
        <p>Your request for <strong>${category}</strong> has been received by FUTURETECHGAD.</p>
        <p>We will review it and update the status from your dashboard.</p>
      `
    });
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?message=Request submitted successfully.");
}

export async function addClientMessageAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const requestId = String(formData.get("requestId") ?? "");
  const message = String(formData.get("message") ?? "");

  const { error } = await supabase.from("request_messages").insert({
    request_id: requestId,
    author_role: "client",
    message,
    user_id: user.id
  });

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?message=Message sent.");
}
