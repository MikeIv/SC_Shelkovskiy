<script setup lang="ts">
interface Initiative {
  id: string
  title: string
  paragraphs: string[]
}

const entranceImage = {
  src: '/images/responsibility/initiative-entrance.jpg',
  alt: 'Стеклянный вход в торговый центр: двери, пандус и тактильная плитка',
  width: 668,
  height: 500,
}

const initiatives: Initiative[] = [
  {
    id: 'access',
    title: 'Среда для маломобильных граждан',
    paragraphs: [
      'ТРЦ «Щёлковский» оборудован пандусами, лифтами, кнопками вызова персонала, машиноместами и специализированными санузлами.',
      'Также в торгово-развлекательном центре предусмотрены широкие галереи, низкие навигационные стойки и медицинская поддержка для обеспечения удобного доступа ко всем зонам комплекса.',
    ],
  },
  {
    id: 'container',
    title: 'Контейнер для сбора ненужных вещей',
    paragraphs: [
      'Совместно с проектом «Зеленая капля» на 0 этаже ТРЦ «Щёлковский» установлен специальный бокс, в который можно сдать бывшие в употреблении и уже ненужные вещи. Дать старым вещам второй шанс – это не только возможность помочь незащищённым слоям населения, но и укрепление этичного отношения к природным ресурсам, поскольку собранная одежда не отправится на полигоны и не будет оказывать негативное воздействие на атмосферу и почву.',
      'Сдать можно в любом состоянии как одежду, обувь и аксессуары, так и книги, игрушки, технику и посуду. Вещи в хорошем состоянии будут переданы тем, кто в них особенно нуждается, а в плохом – пойдут на вторичную переработку, что снизит нагрузку на экологию.',
    ],
  },
]

const activeId = ref(initiatives[0]?.id ?? '')

const active = computed(
  () => initiatives.find((item) => item.id === activeId.value) ?? initiatives[0],
)
</script>

<template>
  <section :class="$style.root" aria-labelledby="responsibility-initiatives-title">
    <h2 id="responsibility-initiatives-title" :class="$style.title">
      Социальные инициативы
    </h2>

    <div
      :class="$style.tabs"
      role="tablist"
      aria-label="Социальные инициативы"
    >
      <UiTab
        v-for="item in initiatives"
        :id="`responsibility-initiative-tab-${item.id}`"
        :key="item.id"
        role="tab"
        :selected="item.id === active?.id"
        :aria-selected="item.id === active?.id"
        aria-controls="responsibility-initiative-panel"
        @click="activeId = item.id"
      >
        {{ item.title }}
      </UiTab>
    </div>

    <div
      v-if="active"
      id="responsibility-initiative-panel"
      :class="$style.card"
      role="tabpanel"
      :aria-labelledby="`responsibility-initiative-tab-${active.id}`"
    >
      <div :class="$style.copy">
        <h3 :class="$style.cardTitle">
          {{ active.title }}
        </h3>
        <div :class="$style.body">
          <p
            v-for="(paragraph, index) in active.paragraphs"
            :key="`${active.id}-${index}`"
            :class="$style.paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <div :class="$style.media">
        <img
          :class="$style.image"
          :src="entranceImage.src"
          :alt="entranceImage.alt"
          :width="entranceImage.width"
          :height="entranceImage.height"
          loading="lazy"
          decoding="async"
        >
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

/* Кроп кадра Figma: видна левая часть фото, около 69% ширины. */
$initiative-crop-top: -22.19%;
$initiative-crop-left: -0.13%;
$initiative-crop-width: 144.6%;
$initiative-crop-height: 144.3%;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.tabs {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex-shrink: 0;
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  min-width: 0;
  padding: var(--fs-space-2);
  border-radius: var(--fs-radius-2xl);
  background-color: var(--fs-color-light);

  @include from-desktop {
    flex-direction: row;
    gap: rem(56);
    align-items: flex-start;
    justify-content: space-between;
    padding: rem(56);
    border-radius: var(--fs-radius-4xl);
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  min-width: 0;
  padding: var(--fs-space-1);

  @include from-desktop {
    flex: 0 1 rem(635);
    gap: var(--fs-space-3);
    max-width: rem(635);
    padding: 0;
  }
}

.cardTitle {
  @include fs-h2;
  margin: 0;
  overflow-wrap: break-word;
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.paragraph {
  margin: 0;
  overflow-wrap: break-word;

  @include fs-text-lg;
}

.media {
  position: relative;
  order: -1;
  height: rem(240);
  border-radius: var(--fs-radius-2xl);
  overflow: hidden;

  @include from-tablet {
    height: rem(286);
  }

  @include from-desktop {
    flex: 0 1 rem(645);
    order: 0;
    width: rem(645);
    height: auto;
    aspect-ratio: 645 / 484;
    border-radius: var(--fs-radius-4xl);
  }
}

.image {
  position: absolute;
  top: $initiative-crop-top;
  left: $initiative-crop-left;
  display: block;
  width: $initiative-crop-width;
  max-width: none;
  height: $initiative-crop-height;

  @include from-tablet {
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @include from-desktop {
    inset: auto;
    top: $initiative-crop-top;
    left: $initiative-crop-left;
    width: $initiative-crop-width;
    height: $initiative-crop-height;
    object-fit: fill;
  }
}
</style>
