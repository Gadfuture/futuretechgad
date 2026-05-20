"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  calculatePendingCoins,
  coinsPerUsd,
  getMinerPlan,
  minimumWithdrawCoins,
  tradeAssets
} from "@/lib/futuretech";

async function settleMining(supabase: ReturnType<typeof createAdminClient>, userId: string) {
  const { data: miners, error: minersError } = await supabase
    .from("user_miners")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");

  if (minersError) {
    throw new Error(minersError.message);
  }

  const pending = calculatePendingCoins(miners ?? []);

  if (pending > 0.0001) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("coin_balance")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const nextBalance = Number(profile?.coin_balance ?? 0) + pending;
    const { error: balanceError } = await supabase
      .from("profiles")
      .update({ coin_balance: nextBalance })
      .eq("id", userId);

    if (balanceError) {
      throw new Error(balanceError.message);
    }

    const { error: minerUpdateError } = await supabase
      .from("user_miners")
      .update({ last_claimed_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("status", "active");

    if (minerUpdateError) {
      throw new Error(minerUpdateError.message);
    }
  }

  return pending;
}

async function getCoinBalance(supabase: ReturnType<typeof createAdminClient>, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("coin_balance")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return Number(data?.coin_balance ?? 0);
}

export async function claimMiningAction() {
  const { user } = await requireUser();
  const supabase = createAdminClient();
  const pending = await settleMining(supabase, user.id);
  revalidatePath("/dashboard");
  redirect(`/dashboard?message=${encodeURIComponent(`Claimed ${pending.toFixed(2)} coins.`)}`);
}

export async function buyMinerAction(formData: FormData) {
  const { user } = await requireUser();
  const supabase = createAdminClient();
  const planId = String(formData.get("planId") ?? "");
  const plan = getMinerPlan(planId);

  if (!plan) {
    redirect("/dashboard?error=Miner plan not found.");
  }

  await settleMining(supabase, user.id);
  const balance = await getCoinBalance(supabase, user.id);

  if (balance < plan.cost) {
    redirect("/dashboard?error=Not enough coins for this miner.");
  }

  const { error: balanceError } = await supabase
    .from("profiles")
    .update({ coin_balance: balance - plan.cost })
    .eq("id", user.id);

  if (balanceError) {
    redirect(`/dashboard?error=${encodeURIComponent(balanceError.message)}`);
  }

  const { error: minerError } = await supabase.from("user_miners").insert({
    user_id: user.id,
    plan_id: plan.id,
    plan_name: plan.name,
    cost: plan.cost,
    daily_yield: plan.dailyYield,
    status: "active"
  });

  if (minerError) {
    redirect(`/dashboard?error=${encodeURIComponent(minerError.message)}`);
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?message=${encodeURIComponent(`${plan.name} activated.`)}`);
}

export async function createWithdrawalAction(formData: FormData) {
  const { user } = await requireUser();
  const supabase = createAdminClient();
  const amount = Number(formData.get("amount") ?? 0);
  const network = String(formData.get("network") ?? "");
  const walletAddress = String(formData.get("walletAddress") ?? "").trim();

  if (amount < minimumWithdrawCoins) {
    redirect(`/dashboard?error=Minimum withdraw is ${minimumWithdrawCoins} coins.`);
  }

  if (!["TRX", "BNB", "USDT"].includes(network) || walletAddress.length < 16) {
    redirect("/dashboard?error=Add a valid TRX, BNB, or USDT wallet address.");
  }

  await settleMining(supabase, user.id);
  const balance = await getCoinBalance(supabase, user.id);

  if (balance < amount) {
    redirect("/dashboard?error=Not enough coins for withdrawal.");
  }

  const usdValue = amount / coinsPerUsd;
  const { error: balanceError } = await supabase
    .from("profiles")
    .update({ coin_balance: balance - amount })
    .eq("id", user.id);

  if (balanceError) {
    redirect(`/dashboard?error=${encodeURIComponent(balanceError.message)}`);
  }

  const { error: withdrawError } = await supabase.from("withdrawal_requests").insert({
    user_id: user.id,
    amount_coins: amount,
    usd_value: usdValue,
    network,
    wallet_address: walletAddress,
    status: "pending"
  });

  if (withdrawError) {
    redirect(`/dashboard?error=${encodeURIComponent(withdrawError.message)}`);
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?message=${encodeURIComponent(`Withdrawal request created for $${usdValue.toFixed(2)}.`)}`);
}

export async function placeTradeAction(formData: FormData) {
  const { user } = await requireUser();
  const supabase = createAdminClient();
  const asset = String(formData.get("asset") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const stake = Number(formData.get("stake") ?? 0);

  if (!tradeAssets.includes(asset as (typeof tradeAssets)[number]) || !["buy", "sell"].includes(direction)) {
    redirect("/dashboard?error=Choose a supported market.");
  }

  if (stake < 10) {
    redirect("/dashboard?error=Minimum trade size is 10 coins.");
  }

  await settleMining(supabase, user.id);
  const balance = await getCoinBalance(supabase, user.id);

  if (balance < stake) {
    redirect("/dashboard?error=Not enough coins for this trade.");
  }

  const marketPulse = (Date.now() % 9) - 4;
  const pnlRate = direction === "buy" ? marketPulse / 100 : -marketPulse / 100;
  const pnl = Number((stake * pnlRate).toFixed(2));
  const nextBalance = balance + pnl;

  const { error: balanceError } = await supabase
    .from("profiles")
    .update({ coin_balance: nextBalance })
    .eq("id", user.id);

  if (balanceError) {
    redirect(`/dashboard?error=${encodeURIComponent(balanceError.message)}`);
  }

  const { error: tradeError } = await supabase.from("trade_orders").insert({
    user_id: user.id,
    asset,
    direction,
    stake,
    pnl,
    status: "closed"
  });

  if (tradeError) {
    redirect(`/dashboard?error=${encodeURIComponent(tradeError.message)}`);
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?message=${encodeURIComponent(`Trade closed with ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} coins.`)}`);
}
