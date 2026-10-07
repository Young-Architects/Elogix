"use client";

/**
 * YouTubeFacade — a YouTube embed that loads nothing until it is played.
 *
 * Until the visitor presses play this is a poster image and a button. The
 * iframe is mounted on click, which matters for two reasons:
 *
 *  - A YouTube iframe pulls roughly a megabyte of player JavaScript on mount.
 *    That is a lot to spend on every visitor for a video most never start.
 *  - YouTube sets its cookies the moment the iframe loads. Deferring it is
 *    what keeps the site's Cookie Policy accurate — social-media cookies drop
 *    when someone chooses to play, not when a page happens to render. The
 *    embed also uses `youtube-nocookie.com`.
 *
 * `autoplay=1` is safe here precisely because the iframe only mounts as the
 * direct result of a click, so the browser counts it as user-initiated.
 *
 * Note: FeaturesVideo on the home page has its own inline version of this,
 * woven into the 3D browser mockup it sits in. The logic is the same; the
 * chrome is not, which is why it was not folded into this component.
 */

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export default function YouTubeFacade({
  videoId,
  title,
  className = "",
}: {
  /** The 11-character YouTube id. */
  videoId: string;
  /** Used as the poster's alt text and the iframe's accessible name. */
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  // maxres stills do not exist for every upload; fall back to hqdefault,
  // which YouTube always generates.
  const [quality, setQuality] = useState<"maxresdefault" | "hqdefault">(
    "maxresdefault"
  );

  return (
    <div
      className={`group relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl ${className}`}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/${quality}.jpg`}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-80"
            onError={() => setQuality("hqdefault")}
          />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play: ${title}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-md transition-all group-hover:scale-105 group-hover:bg-white/20 sm:h-20 sm:w-20">
              <Play className="ml-1 h-6 w-6 fill-current drop-shadow-md sm:h-8 sm:w-8" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
