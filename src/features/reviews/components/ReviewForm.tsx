"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button, Label, Textarea } from "@/components/gm";

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
  const [hovered, setHovered] = useState<number | null>(null);
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
  const preview = hovered ?? rating;

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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className="flex flex-wrap items-center gap-2.5"
            role="radiogroup"
            aria-label="Rating"
            onMouseLeave={() => setHovered(null)}
          >
            {[1, 2, 3, 4, 5].map((value) => {
              const active = value <= preview;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  onMouseEnter={() => setHovered(value)}
                  onFocus={() => setHovered(value)}
                  onBlur={() => setHovered(null)}
                  onClick={() =>
                    setValue("rating", value, { shouldValidate: true })
                  }
                  className="flex size-[52px] items-center justify-center rounded-button transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900"
                >
                  <Star
                    strokeWidth={2}
                    className={
                      active
                        ? "size-10 fill-star-fill text-brown-900"
                        : "size-10 text-brown-900"
                    }
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <span className="text-base text-text-soft">
            {rating > 0 ? `${rating}/5` : "Pick a rating"}
          </span>
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-error">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="review-body" className="text-base font-normal text-text-soft">
          Write a review
        </Label>
        <Textarea
          id="review-body"
          rows={3}
          maxLength={2000}
          placeholder="What did you think about this game?"
          {...register("body")}
          className="mt-2"
        />
        <div className="mt-1 flex items-start justify-between gap-4 text-sm">
          <span className="text-error">{errors.body?.message}</span>
          <span className="ml-auto text-text-soft">{body.length}/2000</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button type="submit" disabled={isSubmitting} className="h-10 text-base">
          {isSubmitting ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Send aria-hidden="true" />
          )}
          {hasReview ? "Update" : "Post"}
        </Button>

        {hasReview && (
          <Button
            variant="secondary"
            onClick={onDelete}
            disabled={isSubmitting}
            className="h-10 text-base"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
