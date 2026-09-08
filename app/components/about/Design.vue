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
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  overflow: clip;
  background-color: var(--fs-color-light);
  border-radius: rem(32);

  @include from-desktop {
    gap: rem(56);
    padding-top: rem(160);
    border-radius: rem(60);
  }
}

.top {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  padding: var(--fs-space-5) var(--fs-grid-margin) 0;

  @include from-desktop {
    flex-direction: row;
    gap: rem(158);
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    max-width: var(--fs-grid-content-max);
    margin-inline: auto;
    padding-inline: max(
      var(--fs-grid-margin),
      calc((100% - var(--fs-grid-content-max)) / 2)
    );
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;

  @include from-desktop {
    flex: 0 1 rem(635);
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
  @include fs-text-lg;
  overflow-wrap: break-word;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--fs-space-3) var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    flex: 0 1 rem(702);
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
  @include fs-h3;
  margin: 0;
}

.statLabel {
  margin: 0;
  @include fs-text-lg;
}

.video {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: clip;
  border-start-start-radius: rem(32);
  border-start-end-radius: rem(32);

  @include from-desktop {
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
  width: rem(72);
  height: rem(72);
  margin: 0;
  padding: 0;
  color: var(--fs-color-white);
  border: 0;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%);
  appearance: none;

  @include from-desktop {
    width: rem(100);
    height: rem(100);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-white);
    outline-offset: rem(4);
    border-radius: 50%;
  }
}

.playIcon {
  width: 100%;
  height: 100%;
}
</style>
