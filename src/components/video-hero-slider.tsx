import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX,
} from "lucide-react";

export type HeroSlide = {
  kind: "mp4" | "youtube" | "vimeo" | "image";
  src: string; // mp4 url, youtube id, vimeo id, or image url
  poster?: string;
  tag: string;
  title: string;
  sub: string;
  cta1: { label: string; to: string };
  cta2?: { label: string; to: string };
};

type Props = { slides: HeroSlide[]; intervalMs?: number };

/** Industrial video hero — supports MP4, YouTube, Vimeo and image. */
export function VideoHeroSlider({ slides, intervalMs = 8000 }: Props) {
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const [muted, setMuted] = React.useState(true);
  const timer = React.useRef<number | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const next = React.useCallback(() => setI((x) => (x + 1) % slides.length), [slides.length]);
  const prev = () => setI((x) => (x - 1 + slides.length) % slides.length);

  React.useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(next, intervalMs);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [playing, next, intervalMs]);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (playing) v.play().catch(() => {}); else v.pause();
  }, [muted, playing, i]);

  const s = slides[i];

  return (
    <section className="relative overflow-hidden bg-[var(--brand-navy)] text-white">
      {/* Media background */}
      <div className="absolute inset-0">
        {s.kind === "mp4" && (
          <video ref={videoRef} key={s.src} className="h-full w-full object-cover"
            src={s.src} poster={s.poster} autoPlay muted={muted} loop={slides.length === 1} playsInline />
        )}
        {s.kind === "youtube" && (
          <iframe className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${s.src}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${s.src}&modestbranding=1&playsinline=1&rel=0`}
            title={s.title} allow="autoplay; encrypted-media" allowFullScreen />
        )}
        {s.kind === "vimeo" && (
          <iframe className="absolute inset-0 h-full w-full"
            src={`https://player.vimeo.com/video/${s.src}?autoplay=1&muted=${muted ? 1 : 0}&loop=1&background=1`}
            title={s.title} allow="autoplay; fullscreen" />
        )}
        {s.kind === "image" && (
          <img src={s.src} alt={s.title} className="h-full w-full object-cover" />
        )}
        {/* Darken + grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/95 via-[var(--brand-navy)]/70 to-[var(--brand-navy)]/40" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      {/* Foreground content */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <Badge className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange)] text-white border-0 mb-5">{s.tag}</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">{s.title}</h1>
          <p className="mt-5 text-lg text-white/80 max-w-xl">{s.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white shadow-glow">
              <Link to={s.cta1.to}>{s.cta1.label} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            {s.cta2 && (
              <Button asChild size="lg" variant="outline" className="bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white">
                <Link to={s.cta2.to}>{s.cta2.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur">
        <button onClick={prev} aria-label="Previous" className="h-8 w-8 grid place-items-center rounded-full text-white/80 hover:bg-white/15">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}
          className="h-8 w-8 grid place-items-center rounded-full text-white/90 hover:bg-white/15">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"}
          className="h-8 w-8 grid place-items-center rounded-full text-white/90 hover:bg-white/15">
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <div className="mx-2 flex gap-1.5">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[var(--brand-orange)]" : "w-3 bg-white/40"}`} />
          ))}
        </div>
        <button onClick={next} aria-label="Next" className="h-8 w-8 grid place-items-center rounded-full text-white/80 hover:bg-white/15">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}