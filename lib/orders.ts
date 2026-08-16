import "server-only";
import type { CartItem } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "fulfilling"
  | "fulfilled"
  | "failed"
  | "cancelled";

export interface ShippingAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal_p: number;
  shipping_p: number;
  total_p: number;
  currency: string;
  shipping_address: ShippingAddress | null;
  created_at: string;
}

/**
 * Order history for the signed-in user. Returns an empty list rather than
 * throwing if the table doesn't exist yet (e.g. the migration hasn't been
 * run against this Supabase project) — the account UI shows an empty state.
 */
export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, items, subtotal_p, shipping_p, total_p, currency, shipping_address, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load orders:", error.message);
    return [];
  }
  return (data as Order[]) ?? [];
}

export async function getOrderById(
  userId: string,
  orderId: string,
): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, items, subtotal_p, shipping_p, total_p, currency, shipping_address, created_at",
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load order:", error.message);
    return null;
  }
  return data as Order | null;
}
