import { useEffect, useRef, useState } from "react";

export function VideoPlayer({
  src,
  live,
  onProgress,
}: {
  src: string;
  live?: boolean | undefined;
  onProgress?: ((current: number, duration: number) => void) | undefined;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    setError(null);
    let destroy = () => {};
    let cancelled = false;

    const isHls = src.includes(".m3u8");
    if (isHls && !video.canPlayType("application/vnd.apple.mpegurl")) {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) {
          setError("متصفحك لا يدعم هذا النوع من البث.");
          return;
        }
        const hls = new Hls({ lowLatencyMode: true, enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) setError("انقطع البث أو أن القناة غير متاحة حالياً.");
        });
        destroy = () => hls.destroy();
      });
    } else {
      video.src = src;
    }
    video.play().catch(() => {});
    return () => {
      cancelled = true;
      destroy();
    };
  }, [src, attempt]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black">
      <video
        ref={ref}
        controls
        playsInline
        autoPlay
        className="aspect-video w-full bg-black"
        onError={() => setError("تعذّر تشغيل هذا المصدر.")}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (!live && v.duration) onProgress?.(v.currentTime, v.duration);
        }}
      />
      {live ? (
        <span className="pointer-events-none absolute top-3 start-3 flex items-center gap-2 rounded-md bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
          <span className="live-dot size-2 rounded-full bg-destructive-foreground" /> مباشر
        </span>
      ) : null}
      {error ? (
        <div className="absolute inset-0 grid place-items-center bg-background/90 p-6 text-center">
          <div>
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => setAttempt((a) => a + 1)}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
