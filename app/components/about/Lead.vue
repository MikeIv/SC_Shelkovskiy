<script setup lang="ts">
const { title, description, watermarkSrc } = defineProps<{
  title: string
  description: string
  watermarkSrc: string
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="about-lead-title">
    <img
      :class="$style.watermark"
      :src="watermarkSrc"
      alt=""
      width="1348"
      height="1344"
      aria-hidden="true"
      decoding="async"
    >

    <div :class="$style.inner">
      <h2 id="about-lead-title" :class="$style.title">{{ title }}</h2>
      <p :class="$style.desc">{{ description }}</p>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  padding-block: var(--fs-space-6) rem(60);
  overflow: clip;

  @include from-desktop {
    padding-block: rem(160) rem(80);
  }
}

.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(100%, rem(900));
  height: auto;
  pointer-events: none;
  opacity: 0.08;
  transform: translate(-50%, -45%);

  @include from-desktop {
    width: rem(1348);
  }
}

.inner {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: center;
  max-width: rem(1296);
  margin-inline: auto;
  padding-inline: var(--fs-grid-margin);
  text-align: center;

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
  @include fs-text-lg;
  max-width: rem(844);
  overflow-wrap: break-word;
}
</style>
