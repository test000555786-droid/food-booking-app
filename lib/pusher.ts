import Pusher from "pusher";

const appId = process.env.PUSHER_APP_ID || "";
const key = process.env.PUSHER_KEY || "";
const secret = process.env.PUSHER_SECRET || "";
const cluster = process.env.PUSHER_CLUSTER || "ap2";

export const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});

export function isPusherConfigured(): boolean {
  return Boolean(appId && key && secret);
}

export function getRestaurantChannel(restaurantId: string): string {
  return `restaurant-${restaurantId}`;
}

export async function triggerNewOrder(restaurantId: string, order: unknown): Promise<void> {
  if (!isPusherConfigured()) {
    console.warn("Pusher is not configured. Skipping new-order trigger.");
    return;
  }
  try {
    const channel = getRestaurantChannel(restaurantId);
    await pusher.trigger(channel, "new-order", order);
  } catch (error) {
    console.error("Pusher trigger error (new-order):", error);
  }
}

export async function triggerOrderUpdated(restaurantId: string, order: unknown): Promise<void> {
  if (!isPusherConfigured()) return;
  try {
    const channel = getRestaurantChannel(restaurantId);
    await pusher.trigger(channel, "order-updated", order);
  } catch (error) {
    console.error("Pusher trigger error (order-updated):", error);
  }
}

export async function triggerWaiterCall(restaurantId: string, call: unknown): Promise<void> {
  if (!isPusherConfigured()) return;
  try {
    const channel = getRestaurantChannel(restaurantId);
    await pusher.trigger(channel, "waiter-call", call);
  } catch (error) {
    console.error("Pusher trigger error (waiter-call):", error);
  }
}

export async function triggerBillRequest(restaurantId: string, call: unknown): Promise<void> {
  if (!isPusherConfigured()) return;
  try {
    const channel = getRestaurantChannel(restaurantId);
    await pusher.trigger(channel, "bill-request", call);
  } catch (error) {
    console.error("Pusher trigger error (bill-request):", error);
  }
}

export async function triggerCallResolved(restaurantId: string, callId: string): Promise<void> {
  if (!isPusherConfigured()) return;
  try {
    const channel = getRestaurantChannel(restaurantId);
    await pusher.trigger(channel, "call-resolved", { callId });
  } catch (error) {
    console.error("Pusher trigger error (call-resolved):", error);
  }
}
