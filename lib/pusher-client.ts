import Pusher from "pusher-js";

const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "";
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2";

let pusherClient: Pusher | null = null;

export function getPusherClient(): Pusher {
  if (!pusherClient) {
    pusherClient = new Pusher(key, {
      cluster,
      authEndpoint: "/api/pusher/auth",
    });
  }
  return pusherClient;
}

export function getRestaurantChannel(restaurantId: string) {
  const client = getPusherClient();
  return client.subscribe(`restaurant-${restaurantId}`);
}

export function unsubscribeFromChannel(restaurantId: string): void {
  if (pusherClient) {
    pusherClient.unsubscribe(`restaurant-${restaurantId}`);
  }
}
