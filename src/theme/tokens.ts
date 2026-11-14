export type LogStatus = "wishlist" | "playing" | "finished";

export const statusMeta: Record<LogStatus, { label: string }> = {
  wishlist: { label: "Wishlist" },
  playing: { label: "Playing" },
  finished: { label: "Finished" },
};
