import { SiteShell } from "@/components/site-shell";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { addAdminMessageAction, updateRequestStatusAction } from "@/app/admin/actions";
import type { Profile, RequestMessage, ServiceRequest } from "@/lib/types";

type AdminPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

type RequestWithProfile = ServiceRequest & {
  profiles?: {
    email: string;
    full_name: string | null;
  };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();

  const [{ data: users }, { data: requests }, { data: messages }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase
      .from("service_requests")
      .select("*, profiles(email, full_name)")
      .order("created_at", { ascending: false }),
    supabase.from("request_messages").select("*").order("created_at", { ascending: false })
  ]);

  return (
    <SiteShell>
      <section className="dashboard-layout">
        <div className="dashboard-head">
          <div>
            <span className="eyebrow">Admin Console</span>
            <h1>Operations dashboard</h1>
            <p>Review users, verify request flow, and manage communications from one screen.</p>
          </div>
        </div>
        {params.error ? <div className="notice">{params.error}</div> : null}
        {params.message ? <div className="chip">{params.message}</div> : null}
        <div className="dashboard-main">
          <div className="table-card">
            <h3>Users</h3>
            <div className="request-list">
              {(users as Profile[] | null)?.map((profile) => (
                <div key={profile.id} className="request-item">
                  <div className="table-row">
                    <strong>{profile.full_name ?? "Unnamed user"}</strong>
                    <span className="status">{profile.role}</span>
                  </div>
                  <p>{profile.email}</p>
                  <p>{profile.company ?? "No company provided"}</p>
                  <p>Joined {formatDate(profile.created_at)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="table-card">
            <h3>Service requests</h3>
            <div className="request-list">
              {(requests as RequestWithProfile[] | null)?.map((request) => {
                const thread = (messages as RequestMessage[] | null)?.filter(
                  (message) => message.request_id === request.id
                );

                return (
                  <article key={request.id} className="request-item">
                    <div className="table-row">
                      <strong>{request.category}</strong>
                      <span className={`status ${request.status}`}>{request.status}</span>
                    </div>
                    <p>Client: {request.profiles?.full_name ?? request.profiles?.email ?? "Unknown"}</p>
                    <p>{request.description}</p>
                    <p>Created: {formatDate(request.created_at)}</p>
                    <form action={updateRequestStatusAction}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <input type="hidden" name="recipient" value={request.profiles?.email ?? ""} />
                      <label>
                        Status
                        <select name="status" defaultValue={request.status}>
                          <option value="new">new</option>
                          <option value="reviewing">reviewing</option>
                          <option value="in_progress">in_progress</option>
                          <option value="completed">completed</option>
                        </select>
                      </label>
                      <button type="submit">Update status</button>
                    </form>
                    <div className="stack">
                      {(thread ?? []).slice(0, 3).map((message) => (
                        <div key={message.id} className="chip">
                          <strong>{message.author_role}</strong>: {message.message}
                        </div>
                      ))}
                    </div>
                    <form action={addAdminMessageAction}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <label>
                        Admin message
                        <textarea name="message" required placeholder="Send an update to the client." />
                      </label>
                      <button type="submit" className="button secondary">
                        Send message
                      </button>
                    </form>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
