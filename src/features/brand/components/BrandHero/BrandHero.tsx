"use client";

import { PauseIcon, PlayIcon, ReplayIcon } from "@/components/ui";
import { AV1_MIME, MEDIA_QUERY, getHeroMedia, type HeroMediaAvailability } from "@/config/media";
import { SECTION_ID } from "@/config/routes";
import type { BrandSlug, HeroContent } from "@/content/schema";
import { useHeroVideo, type HeroVideoStatus } from "./useHeroVideo";
import styles from "./BrandHero.module.css";

interface BrandHeroProps {
  slug: BrandSlug;
  /** Nama brand; dipakai sebagai <h1> tersembunyi jika hero.headline dikosongkan. */
  brandName: string;
  hero: HeroContent;
  availability: HeroMediaAvailability;
}

const CONTROL_LABEL: Record<HeroVideoStatus, string> = {
  loading: "Putar video",
  playing: "Jeda video",
  paused: "Putar video",
  ended: "Putar ulang video",
  static: "Putar video",
};

export function BrandHero({ slug, brandName, hero, availability }: BrandHeroProps) {
  const media = getHeroMedia(slug);
  const { videoRef, status, toggle, videoEvents, markFailed } = useHeroVideo();

  const hasVideo = availability.landscape.mp4;
  const hasEndFrame = availability.landscape.endFrame;
  const usePortrait = hero.portraitOnMobile && availability.portrait.mp4;
  const showStage = hasVideo || hasEndFrame;
  const showEndFrame = hasEndFrame && (!hasVideo || status === "static");

  return (
    <section
      id={SECTION_ID.overview}
      className={styles.hero}
      data-surface={hero.surface}
      data-has-media={showStage || undefined}
      aria-labelledby="hero-judul"
    >
      <div className={styles.content}>
        {/* Halaman selalu punya satu <h1>; tanpa headline, judulnya hanya untuk pembaca layar */}
        <h1 id="hero-judul" className={hero.headline ? styles.eyebrow : "sr-only"}>
          {hero.headline ?? brandName}
        </h1>
        <p className={styles.tagline}>{hero.tagline}</p>
      </div>

      {showStage && (
        <div className={styles.stageArea}>
          <div
            className={styles.stage}
            data-portrait={usePortrait || undefined}
            style={{ background: hero.background }}
          >
            {hasVideo && (
              <video
                ref={videoRef}
                className={styles.media}
                data-hidden={status === "static"}
                loop={hero.loop}
                muted
                playsInline
                preload="none"
                {...videoEvents}
              >
                {usePortrait && availability.portrait.av1 && (
                  <source
                    media={MEDIA_QUERY.portraitPhone}
                    src={media.portrait.av1}
                    type={AV1_MIME}
                  />
                )}
                {usePortrait && (
                  <source
                    media={MEDIA_QUERY.portraitPhone}
                    src={media.portrait.mp4}
                    type="video/mp4"
                  />
                )}
                {availability.landscape.av1 && <source src={media.landscape.av1} type={AV1_MIME} />}
                <source src={media.landscape.mp4} type="video/mp4" onError={markFailed} />
              </video>
            )}

            {showEndFrame && (
              <picture className={styles.endFrame}>
                {usePortrait && availability.portrait.endFrame && (
                  <source media={MEDIA_QUERY.portraitPhone} srcSet={media.portrait.endFrame} />
                )}
                <img src={media.landscape.endFrame} alt="" fetchPriority="high" />
              </picture>
            )}

            {hasVideo && status !== "loading" && (
              <button type="button" className={styles.control} onClick={toggle}>
                <span className="sr-only">{CONTROL_LABEL[status]}</span>
                {status === "playing" ? (
                  <PauseIcon size={14} weight="fill" aria-hidden />
                ) : status === "ended" ? (
                  <ReplayIcon size={16} weight="bold" aria-hidden />
                ) : (
                  <PlayIcon size={14} weight="fill" aria-hidden />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
