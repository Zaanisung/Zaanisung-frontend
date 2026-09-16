import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

export interface CarouselProps<T> {
  items: T[];
  keyExtractor: (item: T, index: number) => React.Key;
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Extra classes applied to every slide wrapper. */
  itemClassName?: string;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  ariaLabel?: string;
}

const DOTS_THRESHOLD = 12;

/**
 * Responsive, drag-to-scroll carousel with snap, arrows and dots.
 * Slide width is fluid (responsive via the shared itemClassName), so the
 * carousel degrades gracefully to a single "page" on every screen size.
 */
export const Carousel = <T,>({
  items,
  keyExtractor,
  renderItem,
  itemClassName,
  className,
  showArrows = true,
  showDots = true,
  ariaLabel = "Carousel",
}: CarouselProps<T>) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const justDragged = useRef(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const ratio = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setProgress(ratio);
    setCanGoPrev(el.scrollLeft > 4);
    setCanGoNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateState();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateState]);

  // Vertical wheel over the carousel must scroll the PAGE, never the track.
  // Without this the browser consumes vertical wheel as horizontal carousel
  // movement, which makes scrolling past the section feel stuck. Horizontal
  // scrolling stays available via drag/swipe, the arrows and Shift+wheel.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaY });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const scrollByUnit = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.85, 240), behavior: "smooth" });
  }, []);

  const scrollToSlide = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.children[index] as HTMLElement | undefined;
    if (!slide) return;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  const handleDragStart = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const el = trackRef.current;
    if (!el) return;
    const deltaX = e.clientX - startX.current;
    if (Math.abs(deltaX) > 6) justDragged.current = true;
    el.scrollLeft -= deltaX;
    startX.current = e.clientX;
  };

  const handleDragEnd = () => {
    startX.current = null;
    setIsDragging(false);
  };

  /** Swallow the click immediately following a drag gesture. */
  const handleTrackClick = (e: React.MouseEvent) => {
    if (justDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      justDragged.current = false;
    }
  };

  const visibleDots = showDots && items.length <= DOTS_THRESHOLD;
  const dotCount = visibleDots ? items.length : 0;
  const activeDot =
    dotCount <= 1 ? 0 : Math.min(dotCount - 1, Math.max(0, Math.round(progress * (dotCount - 1))));

  return (
    <div className={cn("relative", items.length === 0 && "hidden", className)}>
      <div
        ref={trackRef}
        role="region"
        aria-label={ariaLabel}
        onScroll={updateState}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
        onClick={handleTrackClick}
        className={cn(
          "flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden scrollbar-none snap-x snap-proximity scroll-smooth select-none py-1",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{ overscrollBehaviorX: "contain" }}
      >
        {items.map((item, index) => (
          <div
            key={keyExtractor(item, index)}
            className={cn(
              "shrink-0 snap-start w-[86%] min-[460px]:w-[46%] md:w-[31%] xl:w-[30%] min-w-0",
              itemClassName
            )}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {(showArrows || visibleDots) && (
        <div className="mt-7 flex items-center justify-center gap-3">
          {showArrows && (
            <>
              <button
                type="button"
                onClick={() => scrollByUnit(-1)}
                disabled={!canGoPrev}
                aria-label="Previous slide"
                className="min-w-[44px] min-h-[40px] px-2 inline-flex items-center justify-center rounded-lg border border-black/15 dark:border-white/20 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:border-gold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {visibleDots && (
                <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
                  {Array.from({ length: dotCount }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={cn(
                        "min-h-[44px] min-w-[44px] px-2 inline-flex items-center justify-center transition-all focus-visible:outline-none",
                        activeDot === i ? "min-w-[56px]" : "opacity-40 hover:opacity-80"
                      )}
                    >
                      <span
                        className={cn(
                          "h-[3px] w-full rounded-full transition-colors",
                          activeDot === i ? "bg-gold" : "bg-black/30 dark:bg-white/30"
                        )}
                      />
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => scrollByUnit(1)}
                disabled={!canGoNext}
                aria-label="Next slide"
                className="min-w-[44px] min-h-[40px] px-2 inline-flex items-center justify-center rounded-lg border border-black/15 dark:border-white/20 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:border-gold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};