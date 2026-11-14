"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
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
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="inline-flex h-11 items-center gap-1 rounded-none border border-hairline bg-canvas px-4 text-xs font-semibold text-muted transition-colors duration-150 hover:border-primary-text hover:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50"
      aria-label={loading ? "Signing out" : "Sign out"}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="size-3.5" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">
        {loading ? "Signing out..." : "Sign out"}
      </span>
    </button>
  );
}
