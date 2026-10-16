<script setup lang="ts">
import type { AboutStat } from '#shared/types/about'

const { title, description, stats, videoPosterSrc, videoPosterAlt } =
  defineProps<{
    title: string
    description: string
    stats: AboutStat[]
    videoPosterSrc: string
    videoPosterAlt: string
  }>()
</script>

<template>
  <section aria-labelledby="about-design-title">
    <div :class="$style.panel">
      <div :class="$style.top">
        <div :class="$style.copy">
          <h2 id="about-design-title" :class="$style.title">{{ title }}</h2>
          <p :class="$style.desc">{{ description }}</p>
        </div>

        <ul :class="$style.stats">
          <li
            v-for="stat in stats"
            :key="stat.id"
            :class="$style.stat"
          >
            <p :class="$style.statValue">{{ stat.value }}</p>
            <p :class="$style.statLabel">{{ stat.label }}</p>
          </li>
        </ul>
      </div>

      <div :class="$style.video">
        <img
          :class="$style.poster"
          :src="videoPosterSrc"
          :alt="videoPosterAlt"
          width="1920"
          height="770"
          loading="lazy"
          decoding="async"
        >
        <button
          type="button"
          :class="$style.play"
          aria-label="Смотреть видео"
        >
          <UIcon name="local:play" :class="$style.playIcon" aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.panel {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  padding-top: rem(100);
  border-radius: rem(32);
  background-color: var(--fs-color-light);
  overflow: clip;

  @include from-desktop {
    gap: rem(56);
    padding-top: rem(160);
    border-radius: rem(60);
  }
}

.top {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  padding: 0 var(--fs-grid-margin);

  @include from-desktop {
    display: grid;
    grid-template-columns: minmax(0, 635fr) minmax(0, 702fr);
    gap: clamp(#{rem(32)}, 8vw, #{rem(158)});
    align-items: start;
    max-width: var(--fs-grid-content-max);
    margin-inline: auto;
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.desc {
  margin: 0;
  overflow-wrap: break-word;
  @include fs-text-lg;
}

.stats {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--fs-space-4) var(--fs-space-3);
  }
}

.stat {
  display: flex;
  flex-direction: column;
  gap: rem(8);
  min-width: 0;
}

.statValue {
  @include fs-h4;
  margin: 0;
}

.statLabel {
  margin: 0;
  @include fs-text-lg;
}

.video {
  position: relative;
  width: 100%;
  height: rem(400);
  overflow: clip;
  border-start-start-radius: rem(32);
  border-start-end-radius: rem(32);

  @include from-desktop {
    height: auto;
    aspect-ratio: 1920 / 770;
    border-start-start-radius: rem(60);
    border-start-end-radius: rem(60);
  }
}

.poster {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.play {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(50);
  height: rem(50);
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--fs-color-white);
  background: transparent;
  cursor: pointer;
  appearance: none;
  transform: translate(-50%, -50%);

  @include from-desktop {
    width: rem(100);
    height: rem(100);
  }

  &:focus-visible {
    border-radius: 50%;
    outline: rem(2) solid var(--fs-color-white);
    outline-offset: rem(4);
  }
}

.playIcon {
  width: 100%;
  height: 100%;
}
</style>
