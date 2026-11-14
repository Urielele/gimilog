"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, CheckCircle2, Gamepad2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const INK = "#171525";

const STATUSES = [
  { value: "wishlist", label: "Wishlist", icon: Bookmark },
  { value: "playing", label: "Playing", icon: Gamepad2 },
  { value: "finished", label: "Finished", icon: CheckCircle2 },
] as const;

export function LogButtons({
  gameId,
  current,
}: {
  gameId: number;
  current: string | null;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function setStatus(status: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    setPending(status);

    const isRemoving = current === status;
    const { error } = isRemoving
      ? await supabase
          .from("game_logs")
          .delete()
          .eq("game_id", gameId)
          .eq("user_id", user.id)
      : await supabase.from("game_logs").upsert(
          {
            user_id: user.id,
            game_id: gameId,
            status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,game_id" }
        );

    setPending(null);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(isRemoving ? "Removed from backlog" : "Backlog updated");
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => {
          const Icon = status.icon;
          const active = current === status.value;
          const busy = pending === status.value;

          return (
            <button
              key={status.value}
              type="button"
              onClick={() => setStatus(status.value)}
              disabled={pending !== null}
              aria-pressed={active}
              className={
                active
                  ? "inline-flex h-10 items-center gap-2 rounded-[12px] bg-[#FF6B00] px-4 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:bg-[#E66000] disabled:pointer-events-none disabled:opacity-60"
                  : "inline-flex h-10 items-center gap-2 rounded-[12px] border bg-white px-4 text-[0.875rem] font-semibold transition-colors duration-200 hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:pointer-events-none disabled:opacity-60"
              }
              style={active ? undefined : { borderColor: "#E2E8F0", color: INK }}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Icon className="size-4" />
              )}
              {status.label}
            </button>
          );
        })}
      </div>

      {current && (
        <p className="mt-2 text-[0.75rem]" style={{ color: "#64748B" }}>
          Click the active status again to remove it from your backlog.
        </p>
      )}
    </div>
  );
}
