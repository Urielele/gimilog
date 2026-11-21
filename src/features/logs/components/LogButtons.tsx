"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, CheckCircle2, Gamepad2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/gm";

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
    <div className="min-w-0">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:flex md:flex-col md:gap-8">
        {STATUSES.map((status) => {
          const Icon = status.icon;
          const active = current === status.value;
          const busy = pending === status.value;

          return (
            <Button
              key={status.value}
              variant="status"
              onClick={() => setStatus(status.value)}
              disabled={pending !== null}
              aria-pressed={active}
              className={`h-[38px] w-full justify-start gap-2 text-[18px] leading-none md:w-[146px] [&_svg]:size-5 ${
                active ? "bg-brown-500-active hover:bg-brown-500-active" : ""
              }`}
            >
              {busy ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Icon aria-hidden="true" />
              )}
              {status.label}
            </Button>
          );
        })}
      </div>

      {/* {current && (
        <p className="mt-3 text-xs text-text-soft md:mt-8">
          Click the active status again to remove it from your backlog.
        </p>
      )} */}
    </div>
  );
}
