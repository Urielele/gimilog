"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({
  className,
  onDone,
}: {
  className?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    const { error } = await createClient().auth.signOut();
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed out");
    onDone?.();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className={cn(
        "inline-flex h-[38px] items-center justify-center gap-2 rounded-button bg-brown-900 px-4 text-[22px] leading-none font-medium text-on-brown shadow-button transition-colors duration-150 hover:bg-brown-900-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      aria-label={loading ? "Signing out" : "Sign out"}
    >
      {loading && (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      )}
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
