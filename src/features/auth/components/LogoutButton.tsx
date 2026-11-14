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
      className="inline-flex h-9 items-center gap-1.5 rounded-[12px] border bg-white px-3 text-[0.8125rem] font-medium transition-colors duration-200 hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:pointer-events-none disabled:opacity-60"
      style={{ borderColor: "rgba(23, 21, 37, 0.12)", color: "#64748B" }}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <LogOut className="size-3.5" />
      )}
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
