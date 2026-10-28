<script setup lang="ts">
interface Principle {
  id: string
  title: string
  description: string
  iconSrc: string
  tone: 'light' | 'beige'
}

const principles: Principle[] = [
  {
    id: 'access',
    title: 'Доступная среда для маломобильных граждан',
    description:
      'Создание комфортных и безопасных условий пребывания, обеспечение необходимой инфраструктуры.',
    iconSrc: '/images/responsibility/icon-access.svg',
    tone: 'light',
  },
  {
    id: 'consume',
    title: 'Осознанное потребление',
    description:
      'Поддержка ответственного подхода к покупкам и использованию ресурсов.',
    iconSrc: '/images/responsibility/icon-recycle.svg',
    tone: 'beige',
  },
  {
    id: 'ecology',
    title: 'Забота об экологии',
    description:
      'Популяризация бережного отношения к природе и окружающей среде.',
    iconSrc: '/images/responsibility/icon-leaf.svg',
    tone: 'beige',
  },
  {
    id: 'charity',
    title: 'Благотворительные акции и проекты',
    description: 'Помощь социально уязвимым группам населения.',
    iconSrc: '/images/responsibility/icon-charity.svg',
    tone: 'light',
  },
]

const rows = [principles.slice(0, 2), principles.slice(2)]
</script>

<template>
  <section :class="$style.root" aria-labelledby="responsibility-principles-title">
    <img
      :class="$style.pattern"
      src="/images/responsibility/principles-pattern.svg"
      alt=""
      width="597"
      height="596"
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    >

    <div :class="$style.inner">
      <div :class="$style.head">
        <h2 id="responsibility-principles-title" :class="$style.title">
          Комфорт для всех и забота о будущем
        </h2>
        <p :class="$style.lead">
          ТРЦ «Щёлковский» поддерживает экологические и социальные инициативы, создавая комфортную и доступную среду для всех.
        </p>
      </div>

      <div :class="$style.scroller">
        <div :class="$style.board">
          <div
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            :class="$style.row"
          >
            <ResponsibilityPrincipleCard
              v-for="item in row"
              :key="item.id"
              :title="item.title"
              :description="item.description"
              :icon-src="item.iconSrc"
              :tone="item.tone"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  min-width: 0;
  overflow: clip;
}

.pattern {
  position: absolute;
  top: 0;
  left: 50%;
  width: rem(597);
  height: auto;
  pointer-events: none;
  transform: translate(-50%, -38%);

  @include from-tablet {
    width: rem(1018);
    transform: translate(-50%, -42%);
  }

  @include from-desktop {
    display: none;
  }
}

.inner {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  padding-top: rem(100);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-tablet {
    padding-top: rem(134);
  }

  @include from-desktop {
    gap: var(--fs-space-5);
    padding-top: 0;
  }
}

.head {
  display: flex;
  flex-direction: column;
  gap: rem(12);

  @include from-desktop {
    gap: var(--fs-space-2);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.lead {
  margin: 0;
  overflow-wrap: break-word;

  @include fs-text-lg;

  @include from-desktop {
    @include fs-text;
  }
}

.scroller {
  @include fs-carousel-viewport;

  /* Колонки листаются вместе, отдельных snap-точек нет. */
  overscroll-behavior-x: contain;
  scroll-snap-type: none;

  @include from-tablet {
    align-self: stretch;
    width: 100%;
    margin-right: 0;
    overflow-x: visible;
    padding-inline-end: 0;
  }
}

.board {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: max-content;

  @include from-tablet {
    width: 100%;
  }

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.row {
  display: flex;
  gap: var(--fs-space-2);

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}
</style>
