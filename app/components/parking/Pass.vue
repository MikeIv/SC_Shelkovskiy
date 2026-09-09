<script setup lang="ts">
import type { ParkingPass } from '#shared/types/parking'

const { title, description, contact, phone, phoneHref, items } = defineProps<{
  title: string
  description: string
  contact: string
  phone: string
  phoneHref: string
  items: ParkingPass[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="parking-pass-title">
    <div :class="$style.heading">
      <h2 id="parking-pass-title" :class="$style.title">{{ title }}</h2>
      <p :class="$style.desc">{{ description }}</p>
    </div>

    <div :class="$style.banners">
      <div :class="$style.cards">
        <article
          v-for="item in items"
          :key="item.id"
          :class="$style.card"
          :data-variant="item.id"
        >
          <div :class="$style.panel">
            <div :class="$style.copy">
              <p :class="$style.label">{{ item.label }}</p>
              <p :class="$style.price">
                <span :class="$style.amount">{{ item.price }}</span>
                <span :class="$style.unit">{{ item.unit }}</span>
              </p>
            </div>

            <span :class="$style.accent" aria-hidden="true" />
          </div>

          <div :class="$style.visual" aria-hidden="true">
            <img
              :class="$style.vehicle"
              :src="item.imageSrc"
              alt=""
              width="420"
              height="280"
              loading="lazy"
              decoding="async"
            >
          </div>
        </article>
      </div>

      <p :class="$style.contact">
        {{ contact }}
        <a :class="$style.phone" :href="phoneHref">{{ phone }}</a>
      </p>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    gap: rem(40);
  }
}

.heading {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.desc {
  margin: 0;
  @include fs-h4;
  font-weight: 400;
  overflow-wrap: break-word;

  @include from-desktop {
    max-width: rem(907);
  }
}

.banners {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  min-width: 0;
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: rem(12);
  min-width: 0;

  @include from-desktop {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: rem(24);
  }
}

.card {
  position: relative;
  width: 100%;
  max-width: rem(768);
  height: rem(200);
  overflow: hidden;

  @include from-tablet {
    height: rem(260);
  }

  @include from-desktop {
    height: rem(306);
  }
}

.panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--fs-color-light);
  border-radius: rem(24);

  @include from-desktop {
    width: rem(503);
    max-width: 65.5%;
    border-radius: rem(32);
  }
}

.copy {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: rem(8);
  justify-content: center;
  height: 100%;
  min-width: 0;
  padding: var(--fs-space-3);

  @include from-desktop {
    padding-block: rem(40);
    padding-inline: rem(40);
  }
}

.label {
  margin: 0;
  @include fs-h4;
  font-weight: 400;
}

.price {
  display: flex;
  flex-wrap: wrap;
  gap: rem(8);
  align-items: baseline;
  margin: 0;
}

.amount {
  @include fs-h2;
}

.unit {
  @include fs-h3;
}

.accent {
  position: absolute;
  top: 50%;
  right: 0;
  width: rem(220);
  height: rem(220);
  background-color: var(--fs-color-beige);
  border-radius: 50%;
  transform: translate(50%, -50%);

  @include from-desktop {
    width: rem(335);
    height: rem(335);
  }
}

.visual {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: z('default');
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 55%;
  max-width: rem(420);
  pointer-events: none;
  transform: translateY(-50%);

  @include from-desktop {
    width: rem(400);
  }
}

.vehicle {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  transform: scaleX(-1);
}

.card[data-variant='motorcycle'] .vehicle {
  max-width: rem(300);

  @include from-desktop {
    max-width: rem(360);
  }
}

.card[data-variant='car'] .vehicle {
  max-width: rem(320);

  @include from-desktop {
    max-width: rem(400);
  }
}

.contact {
  margin: 0;
  padding: var(--fs-space-3);
  @include fs-text-lg;
  background-color: var(--fs-color-light);
  border-radius: rem(24);
  overflow-wrap: break-word;

  @include from-desktop {
    border-radius: rem(32);
  }
}

.phone {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}
</style>
