<script setup lang="ts">
import type { GiftCardsFaqItem } from '#shared/types/giftCards'

const props = withDefaults(
  defineProps<{
    title: string
    items: GiftCardsFaqItem[]
    defaultOpenId?: string
  }>(),
  {
    defaultOpenId: '',
  },
)

const openId = ref(props.defaultOpenId || props.items[0]?.id || '')

function toggle(id: string) {
  openId.value = openId.value === id ? '' : id
}
</script>

<template>
  <section :class="$style.root" aria-labelledby="gift-cards-faq-title">
    <h2 id="gift-cards-faq-title" :class="$style.title">{{ title }}</h2>

    <ul :class="$style.list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.item"
      >
        <button
          type="button"
          :class="$style.trigger"
          :aria-expanded="openId === item.id"
          :aria-controls="`gift-faq-${item.id}`"
          @click="toggle(item.id)"
        >
          <span :class="$style.question">{{ item.question }}</span>
          <span :class="$style.iconWrap" aria-hidden="true">
            <UIcon
              name="local:arrow-down"
              :class="[$style.icon, { [$style.iconOpen]: openId === item.id }]"
            />
          </span>
        </button>

        <div
          :id="`gift-faq-${item.id}`"
          :class="$style.panel"
          :hidden="openId !== item.id"
        >
          <p :class="$style.answer">{{ item.answer }}</p>
        </div>
      </li>
    </ul>
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

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    gap: rem(32);
  }
}

.item {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  padding-bottom: var(--fs-space-3);
  border-bottom: rem(2) solid var(--fs-color-light);

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  @include from-desktop {
    gap: rem(16);
    padding-bottom: rem(32);

    &:last-child {
      padding-bottom: 0;
    }
  }
}

.trigger {
  display: flex;
  gap: var(--fs-space-3);
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 0;
  text-align: left;
  color: inherit;
  cursor: pointer;
  background: none;
  border: 0;
}

.question {
  @include fs-h2;
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: break-word;
}

.iconWrap {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: rem(40);
  height: rem(40);

  @include from-desktop {
    width: rem(50);
    height: rem(50);
  }
}

.icon {
  width: rem(24);
  height: rem(24);
  color: var(--fs-color-black);
  transition: transform 0.2s ease;
}

.iconOpen {
  transform: rotate(180deg);
}

.panel {
  max-width: rem(775);
}

.answer {
  margin: 0;
  @include fs-text-lg;
  overflow-wrap: break-word;
}
</style>
