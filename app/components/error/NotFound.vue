<script setup lang="ts">
const goHome = async () => {
  await clearError({ redirect: '/' })
}
</script>

<template>
  <section :class="$style.root" aria-labelledby="error-not-found-title">
    <div :class="$style.stage">
      <div :class="$style.medal">
        <img
          :class="$style.ornament"
          src="/images/error/404-ornament.svg"
          alt=""
          width="631"
          height="630"
          decoding="async"
        >
        <img
          :class="$style.ring"
          src="/images/error/404-ring.svg"
          alt=""
          width="783"
          height="797"
          decoding="async"
        >
        <p :class="$style.code" aria-hidden="true">404</p>
      </div>
      <UiButton type="button" :class="$style.action" @click="goHome">
        На главную
      </UiButton>
    </div>

    <h1 id="error-not-found-title" :class="$style.title">Страница не найдена</h1>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-block: 0 rem(100);
  padding-inline: 0;

  @include from-desktop {
    justify-content: center;
    min-height: calc(100dvh - rem(280));
    padding-block: rem(72) rem(96);
    padding-inline: max(
      var(--fs-grid-margin),
      calc((100% - var(--fs-grid-content-max)) / 2)
    );
  }
}

.stage {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  max-width: rem(375);
  height: rem(350);

  @include from-tablet {
    max-width: rem(768);
    height: rem(710);
  }

  @include from-desktop {
    width: rem(632);
    max-width: none;
    height: rem(630);
  }
}

@mixin medal-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  max-width: none;
  height: auto;
  pointer-events: none;
  user-select: none;
  transform: translate(-50%, -50%);
}

.medal {
  position: relative;
  grid-area: 1 / 1;
  width: max-content;
  overflow: visible;
}

.ornament {
  @include medal-layer;

  width: 104%;
  aspect-ratio: 631 / 630;
}

.ring {
  @include medal-layer;

  width: 124%;
}

.code {
  position: relative;
  z-index: z('default');
  margin: 0;
  font-family: var(--fs-font-display);
  font-size: rem(120);
  font-weight: 400;
  line-height: 1;
  color: var(--fs-color-black);
  text-align: center;
  pointer-events: none;
  user-select: none;

  @include from-tablet {
    font-size: rem(248);
  }

  @include from-desktop {
    font-size: rem(286);
  }
}

.action {
  --fs-error-action-offset: #{rem(92)};

  position: absolute;
  top: calc(50% + var(--fs-error-action-offset));
  left: 50%;
  z-index: z('default');
  transform: translate(-50%, -50%);

  @include from-tablet {
    --fs-error-action-offset: #{rem(144)};
  }

  @include from-desktop {
    --fs-error-action-offset: #{rem(168)};
  }
}

.title {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
}
</style>
