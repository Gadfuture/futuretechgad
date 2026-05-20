export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  coin_balance: number;
  role: "client" | "admin";
  created_at: string;
};

export type ServiceRequest = {
  id: string;
  user_id: string;
  category: string;
  project_name: string | null;
  network: string | null;
  wallet_address: string | null;
  description: string;
  status: "new" | "reviewing" | "in_progress" | "completed";
  created_at: string;
};

export type RequestMessage = {
  id: string;
  request_id: string;
  author_role: "client" | "admin";
  message: string;
  created_at: string;
};
