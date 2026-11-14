"use client";

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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <span className="block text-xs font-semibold text-ink">
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
                onClick={() =>
                  setValue("rating", value, { shouldValidate: true })
                }
                className="flex size-11 items-center justify-center rounded-none transition-colors duration-150 hover:bg-primary-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Star
                  className={
                    active
                      ? "size-6 fill-rating text-rating"
                      : "size-6 text-star-empty"
                  }
                  aria-hidden="true"
                />
              </button>
            );
          })}
          <span className="ml-2 text-xs font-semibold text-ink">
            {rating > 0 ? `${rating}/5` : "Pick a rating"}
          </span>
        </div>
        {errors.rating && (
          <p className="mt-1 text-xs text-error-text">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="review-body">
          Review <span className="font-normal text-muted">(optional)</span>
        </Label>
        <Textarea
          id="review-body"
          rows={4}
          maxLength={2000}
          placeholder="What did you think about this game?"
          {...register("body")}
          className="mt-2"
        />
        <div className="mt-1 flex items-start justify-between gap-4 text-xs">
          <span className="text-error-text">{errors.body?.message}</span>
          <span className="text-muted">{body.length}/2000</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send aria-hidden="true" />
          )}
          {hasReview ? "Update review" : "Post review"}
        </Button>

        {hasReview && (
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isSubmitting}
          >
            <Trash2 aria-hidden="true" />
            Delete review
          </Button>
        )}
      </div>
    </form>
  );
}
