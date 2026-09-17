import React, { useEffect, useState } from "react";
import { Button } from "../Button";
import { Loader } from "../ui/Loader";
import { Check, RotateCcw, Sparkles, X } from "lucide-react";
import {
  getAiImageStatus,
  standardizeImage,
  standardizeProductImage,
  approveProductImage,
  rejectProductImage,
} from "../../services/product.service";
import { getErrorMessage } from "../../services/apiClient";
import type { ImageStandardization } from "../../types/product";

/**
 * Admin "standardize with AI" workflow.
 *
 * When the backend has not been configured with an OpenAI key the whole control
 * is hidden (fail-safe) — the form keeps working exactly as before.
 *
 * Flow: generate → review candidate (clearly badged as AI-generated) →
 * approve (becomes the product image) / reject (current image untouched) /
 * regenerate. For existing products (`productId`) every decision is persisted
 * server-side; for the add-product form the approved candidate is returned via
 * `onStandardized` and the original is preserved by the caller.
 */
export interface AiImageStandardizationProps {
  productId?: string;
  imageUrl?: string;
  existing?: ImageStandardization;
  onStandardized: (candidate: string) => void;
  /**
   * Called with the source image right before a generation begins, so a
   * create-product form can preserve the pre-standardization upload.
   */
  onStandardizeStart?: (sourceImage: string) => void;
}

type Phase = "idle" | "generating" | "review" | "approved" | "rejected";

export const AiImageStandardization: React.FC<AiImageStandardizationProps> = ({
  productId,
  imageUrl,
  existing,
  onStandardized,
  onStandardizeStart,
}) => {
  const [available, setAvailable] = useState<boolean | null>(null);
  // Reopening a product with a candidate awaiting review resumes the flow.
  const [candidate, setCandidate] = useState<string | null>(() =>
    existing?.status === "needs_review" && existing.generatedImageUrl
      ? existing.generatedImageUrl
      : null
  );
  const [phase, setPhase] = useState<Phase>(() =>
    existing?.status === "needs_review" && existing.generatedImageUrl
      ? "review"
      : "idle"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // A failed status probe means "feature not available" — never render a
    // broken control.
    getAiImageStatus()
      .then(({ enabled }) => {
        if (!cancelled) setAvailable(enabled);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (available === null || available === false) return null;

  const canGenerate = Boolean(imageUrl);

  const runStandardize = async () => {
    if (!canGenerate) return;
    onStandardizeStart?.(imageUrl as string);
    setPhase("generating");
    setError(null);
    try {
      const result = productId
        ? await standardizeProductImage(productId, imageUrl)
        : await standardizeImage(imageUrl as string);
      const generated = productId
        ? (result as { product?: { imageStandardization?: ImageStandardization } })
            .product?.imageStandardization?.generatedImageUrl
        : (result as { imageUrl: string }).imageUrl;
      if (!generated) {
        throw new Error("The AI service returned no image.");
      }
      setCandidate(generated);
      setPhase("review");
    } catch (err) {
      setError(
        getErrorMessage(err, "AI standardization failed. Please try again.")
      );
      setPhase("idle");
    }
  };

  const handleApprove = async () => {
    if (!candidate) return;
    try {
      if (productId) await approveProductImage(productId);
      onStandardized(candidate);
      setError(null);
      setPhase("approved");
    } catch (err) {
      setError(
        getErrorMessage(err, "Could not approve the generated image.")
      );
    }
  };

  const handleReject = async () => {
    if (!candidate) return;
    try {
      if (productId) await rejectProductImage(productId);
      setCandidate(null);
      setError(null);
      setPhase("rejected");
    } catch (err) {
      setError(
        getErrorMessage(err, "Could not reject the generated image.")
      );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-gold/40 bg-gold/[0.04] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-gold" aria-hidden="true" />
        <p className="text-[11px] font-semibold uppercase tracking-widest text-black/60 dark:text-white/60">
          AI Image Standardization
        </p>
      </div>
      <p className="text-[11px] text-black/45 dark:text-white/45">
        Generate a professionally standardized studio product image from the
        current photo. You review every candidate before it replaces the live
        image — the original is always preserved.
      </p>

      {error && (
        <div
          role="alert"
          className="p-3 bg-red-950/50 border border-red-800 text-xs text-red-200 font-medium rounded-lg"
        >
          {error}
        </div>
      )}

      {phase === "idle" && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={runStandardize}
            disabled={!canGenerate}
            aria-label="Generate an AI-standardized image"
          >
            <Sparkles className="w-4 h-4" />
            Standardize with AI
          </Button>

          {existing?.status === "approved" && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              AI-standardized
            </span>
          )}

          {phase === "idle" && existing?.status === "failed" && existing?.lastError && (
            <span className="text-[11px] text-red-500/80">
              Last attempt failed: {existing.lastError}
            </span>
          )}
        </div>
      )}

      {phase === "generating" && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 py-3"
        >
          <Loader variant="ring" size="sm" />
          <span className="text-xs text-black/55 dark:text-white/55">
            Standardizing image… this can take up to a minute.
          </span>
        </div>
      )}

      {(phase === "review" || phase === "approved") && candidate && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {phase === "review" && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40 mb-1.5">
                  Current image
                </p>
                <div className="aspect-square w-full max-w-[140px] overflow-hidden rounded-lg border border-black/10 dark:border-white/15">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Current product image"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gold mb-1.5">
                AI-generated candidate
              </p>
              <div className="relative aspect-square w-full max-w-[140px] overflow-hidden rounded-lg border-2 border-dashed border-gold/60">
                <img
                  src={candidate}
                  alt="AI-standardized candidate"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 bg-black/70 text-[10px] font-bold uppercase tracking-wide text-white px-1.5 py-0.5 rounded">
                  <Sparkles className="w-3 h-3" />
                  AI
                </span>
              </div>
            </div>
          </div>

          {phase === "review" ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleApprove}
                aria-label="Approve the AI-generated image"
              >
                <Check className="w-4 h-4" />
                Approve
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleReject}
                aria-label="Reject the AI-generated image"
              >
                <X className="w-4 h-4" />
                Reject
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={runStandardize}
                aria-label="Regenerate a new AI image"
              >
                <RotateCcw className="w-4 h-4" />
                Regenerate
              </Button>
            </div>
          ) : (
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Approved — the AI-standardized image is now the live product image.
            </p>
          )}
        </div>
      )}

      {phase === "rejected" && (
        <p className="text-[11px] text-black/45 dark:text-white/45">
          Candidate rejected — the current image was left untouched. Regenerate
          a new candidate when ready.
        </p>
      )}
    </div>
  );
};