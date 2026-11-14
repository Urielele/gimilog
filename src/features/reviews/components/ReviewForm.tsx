"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

/* DESIGN2 tokens
   primary #FF6B00 · surface #F8FAFC
   radius: sm 12px                                                   */

const INK = "#171525";
const MUTED = "#64748B";

const schema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Pick a rating from 1 to 5")
    .max(5),
  body: z.string().max(2000, "Maximum 2000 characters"),
});

type FormValues = z.infer<typeof schema>;

export function ReviewForm({
  gameId,
  initial,
}: {
  gameId: number;
  initial?: { rating: number; body: string | null } | null;
}) {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: initial?.rating ?? 0,
      body: initial?.body ?? "",
    },
  });

  const rating = useWatch({ control, name: "rating" }) ?? 0;
  const body = useWatch({ control, name: "body" }) ?? "";
  const hasReview = Boolean(initial);

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    const { error } = await supabase.from("reviews").upsert(
      {
        user_id: user.id,
        game_id: gameId,
        rating: values.rating,
        body: values.body.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,game_id" }
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(hasReview ? "Review updated" : "Review posted");
    router.refresh();
  }

  async function onDelete() {
    if (!window.confirm("Delete your review for this game?")) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("game_id", gameId)
      .eq("user_id", user.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    reset({ rating: 0, body: "" });
    toast.success("Review deleted");
    router.refresh();
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <span className="text-[0.8125rem] font-medium tracking-[0.02em]">
          Your rating
        </span>
        <div
          className="mt-2 flex flex-wrap items-center gap-1"
          role="radiogroup"
          aria-label="Rating"
        >
          {[1, 2, 3, 4, 5].map((value) => {
            const active = value <= rating;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                onClick={() => setValue("rating", value, { shouldValidate: true })}
                className="flex size-10 items-center justify-center rounded-[10px] transition-colors duration-200 hover:bg-[#FFF4EC]"
              >
                <Star
                  className="size-6"
                  style={
                    active
                      ? { fill: "#FF6B00", color: "#FF6B00" }
                      : { color: "#CBD5E1" }
                  }
                />
              </button>
            );
          })}
          <span className="ml-2 text-[0.8125rem]" style={{ color: MUTED }}>
            {rating > 0 ? `${rating}/5` : "Pick a rating"}
          </span>
        </div>
        {errors.rating && (
          <p className="mt-1 text-[0.8125rem] text-red-600">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="review-body"
          className="text-[0.8125rem] font-medium tracking-[0.02em]"
        >
          Review <span style={{ color: MUTED }}>(optional)</span>
        </label>
        <textarea
          id="review-body"
          rows={4}
          maxLength={2000}
          placeholder="What did you think about this game?"
          {...register("body")}
          className="mt-2 w-full resize-y rounded-[12px] border bg-white p-3 text-[0.95rem] leading-[1.6] outline-none transition-shadow duration-200 placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
          style={{ borderColor: "#E2E8F0", color: INK }}
        />
        <div className="mt-1 flex items-start justify-between gap-4 text-[0.75rem]">
          <span className="text-red-600">{errors.body?.message}</span>
          <span style={{ color: MUTED }}>{body.length}/2000</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#FF6B00] px-4 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_6px_16px_rgba(255,107,0,0.28)] disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          {hasReview ? "Update review" : "Post review"}
        </button>

        {hasReview && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] border bg-white px-4 text-[0.875rem] font-semibold text-red-600 transition-colors duration-200 hover:border-red-300 hover:bg-red-50 disabled:pointer-events-none disabled:opacity-60"
            style={{ borderColor: "rgba(220, 38, 38, 0.22)" }}
          >
            <Trash2 className="size-4" />
            Delete review
          </button>
        )}
      </div>
    </form>
  );
}
