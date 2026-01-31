import { useEffect, useState } from "react";

type ImageEntry = {
  id: string;
  src: string;
  speaker: string;
  dialogue: string;
};

type Stretch = {
  start: number;
  end: number;
};

const WINDOW_SIZE = 5;
const SLOT_WIDTH = 300;
const MAX_IMAGES = 10;

export function Backlogger() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowStart, setWindowStart] = useState(0);

  // Stretch state
  const [stretches, setStretches] = useState<Stretch[]>([]);
  const [isMarkingStretch, setIsMarkingStretch] = useState(false);
  const [pendingStretchStart, setPendingStretchStart] =
    useState<number | null>(null);

  // Toasts
  const [toast, setToast] = useState<string | null>(null);
  const [persistentToast, setPersistentToast] =
    useState<string | null>(null);

  const totalSlots = images.length + 1;
  const visibleCount = Math.min(WINDOW_SIZE, totalSlots);
  const activeImage =
    activeIndex < images.length ? images[activeIndex] : null;

  /* ---------------- Toast auto-clear ---------------- */

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---------------- Export helper ---------------- */

  const exportRange = (start: number, end: number) => {
    if (start < 0 || end >= images.length || start > end) {
      setToast("Nothing to export");
      return;
    }

    const text = images
      .slice(start, end + 1)
      .map(img => {
        if (!img.speaker && !img.dialogue) return null;
        if (img.speaker && img.dialogue) {
          return `${img.speaker}: ${img.dialogue}`;
        }
        return img.speaker || img.dialogue;
      })
      .filter(Boolean)
      .join("\n");

    if (!text) {
      setToast("Nothing to export");
      return;
    }

    navigator.clipboard.writeText(text);
    setToast("Copied to clipboard");
  };

  /* ---------------- Clipboard paste ---------------- */

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const item = e.clipboardData?.items[0];
      if (!item || !item.type.startsWith("image/")) return;

      const blob = item.getAsFile();
      if (!blob) return;

      const url = URL.createObjectURL(blob);

      setImages(prev => {
        const next = [...prev];

        if (activeIndex < next.length) {
          URL.revokeObjectURL(next[activeIndex].src);
          next[activeIndex] = { ...next[activeIndex], src: url };
        } else {
          next.push({
            id: crypto.randomUUID(),
            src: url,
            speaker: "",
            dialogue: "",
          });
        }

        // HARD CAP: evict oldest images
        while (next.length > MAX_IMAGES) {
          const removed = next.shift();
          if (removed) {
            URL.revokeObjectURL(removed.src);
          }

          setStretches([]); // invalidate stretches
          setIsMarkingStretch(false);
          setPendingStretchStart(null);
          setPersistentToast(null);

          setActiveIndex(i => Math.max(i - 1, 0));
          setWindowStart(w => Math.max(w - 1, 0));
        }

        return next;
      });
    };

    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [activeIndex]);

  /* ---------------- Keyboard navigation ---------------- */

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        setActiveIndex(i => Math.min(i + 1, images.length));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex(i => Math.max(i - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length]);

  /* ---------------- Keep active slot visible ---------------- */

  useEffect(() => {
    if (activeIndex < windowStart) {
      setWindowStart(activeIndex);
    } else if (activeIndex >= windowStart + visibleCount) {
      setWindowStart(activeIndex - visibleCount + 1);
    }
  }, [activeIndex, windowStart, visibleCount]);

  /* ---------------- Cleanup URLs ---------------- */

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.src));
    };
  }, []);

  const hasLeftOverflow = windowStart > 0;
  const hasRightOverflow =
    windowStart + visibleCount < totalSlots;

  const slots = Array.from({ length: visibleCount }, (_, i) => {
    const idx = windowStart + i;
    return images[idx] ?? null;
  });

  const isInStretch = (idx: number) =>
    stretches.some(s => idx >= s.start && idx <= s.end);

  /* ---------------- Card click ---------------- */

  const handleCardClick = (idx: number) => {
    setActiveIndex(idx);
    if (idx >= images.length) return;
    if (!isMarkingStretch) return;

    if (pendingStretchStart === null) {
      setPendingStretchStart(idx);
      setPersistentToast("Start set. Click end image");
      return;
    }

    if (idx > pendingStretchStart) {
      setStretches([{ start: pendingStretchStart, end: idx }]);
      setToast("Stretch created");
    } else {
      setToast("Create stretch failed");
    }

    setIsMarkingStretch(false);
    setPendingStretchStart(null);
    setPersistentToast(null);
  };

  /* ---------------- Copy image for Anki ---------------- */

  async function copyImageForAnki(imgSrc: string, setToast: (msg: string) => void) {
    try {
      const res = await fetch(imgSrc);
      const blob = await res.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setToast("Image copied to clipboard");
    } catch (err) {
      console.error(err);
      setToast("Failed to copy image");
    }
  }


  /* ---------------- Render ---------------- */

  return (
    <div className="p-4">
      <h2 className="text-xl mb-3">Backlogger</h2>

      {persistentToast && (
        <div className="mb-2 px-4 py-2 bg-slate-700 text-white rounded">
          {persistentToast}
        </div>
      )}

      {toast && (
        <div className="mb-2 px-4 py-2 bg-black text-white rounded">
          {toast}
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <button
          className="px-3 py-1 border rounded bg-teal-400 hover:bg-teal-600"
          onClick={() => {
            setIsMarkingStretch(true);
            setPendingStretchStart(null);
            setPersistentToast("Click start image");
          }}
        >
          Mark stretch start/end
        </button>

        <button
          className="px-3 py-1 border rounded bg-teal-400 hover:bg-teal-600"
          onClick={() => {
            if (stretches.length === 0) {
              setToast("No active stretch");
              return;
            }
            exportRange(stretches[0].start, stretches[0].end);
          }}
        >
          Export stretch
        </button>
      </div>

      <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
        {hasLeftOverflow && <span>← more</span>}
        <span className="flex-1" />
        {hasRightOverflow && <span>more →</span>}
      </div>

      <div className="flex gap-4">
        {slots.map((img, slotIdx) => {
          const globalIndex = windowStart + slotIdx;
          const isActive = globalIndex === activeIndex;
          const inStretch = isInStretch(globalIndex);

          return (
            <div
              key={globalIndex}
              onClick={() => handleCardClick(globalIndex)}
              className={`flex-shrink-0 p-2 cursor-pointer ${
                isActive
                  ? "border-4 border-emerald-400"
                  : "border border-gray-300"
              }`}
              style={{ width: SLOT_WIDTH }}
            >
              {inStretch && (
                <div className="h-2 bg-yellow-400 mb-1 rounded" />
              )}

              {img ? (
                <>
                  <img src={img.src} className="w-full mb-2" />

                  <button
                    className="mb-1 text-sm text-blue-600 underline"
                    onClick={e => {
                      e.stopPropagation();
                      exportRange(globalIndex, globalIndex);
                    }}
                  >
                    Export
                  </button>
                  
                  <br />

                  <button
                    onClick={() => copyImageForAnki(img.src, setToast)}
                    className="px-2 py-1 text-sm border rounded"
                  >
                    Copy image
                  </button>


                  <input
                    placeholder="Speaker"
                    value={img.speaker}
                    onChange={e => {
                      const value = e.target.value;
                      setImages(prev =>
                        prev.map((i, idx) =>
                          idx === globalIndex
                            ? { ...i, speaker: value }
                            : i
                        )
                      );
                    }}
                    className="border w-full mb-1 px-1"
                  />

                  <textarea
                    placeholder="Dialogue"
                    value={img.dialogue}
                    onChange={e => {
                      const value = e.target.value;
                      setImages(prev =>
                        prev.map((i, idx) =>
                          idx === globalIndex
                            ? { ...i, dialogue: value }
                            : i
                        )
                      );
                    }}
                    className="border w-full px-1"
                    rows={4}
                  />
                </>
              ) : (
                <div className="h-[240px] flex items-center justify-center text-gray-400">
                  Empty
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 border rounded p-4">
        {activeImage ? (
          <div className="overflow-auto max-h-[70vh]">
            <img
              src={activeImage.src}
              alt="Active full-size"
              className="max-w-full h-auto mx-auto"
            />

            {activeImage && (activeImage.speaker || activeImage.dialogue) && (
              <>
                {/* Read-only mirror for dictionary lookup (Yomitan-compatible) */}
                <div className="mt-4 p-3 border rounded bg-background-light text-base select-text whitespace-pre-wrap">
                  {activeImage.speaker && (
                    <strong>{activeImage.speaker}：</strong>
                  )}
                  {activeImage.dialogue}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-12">
            No image selected
          </div>
        )}
      </div>
    </div>
  );
}
