<script setup lang="ts">
import type { VacancyItem } from '#shared/types/vacancies'

const props = withDefaults(
  defineProps<{
    items: readonly VacancyItem[]
    defaultOpenId?: string
  }>(),
  {
    defaultOpenId: '',
  },
)

const openId = ref(props.defaultOpenId || props.items[0]?.id || '')

const labels = {
  contacts: 'Контакты',
  phone: 'Телефон',
  email: 'Почта',
} as const

function toggle(id: string) {
  openId.value = openId.value === id ? '' : id
}

function isOpen(id: string) {
  return openId.value === id
}
</script>

<template>
  <ul :class="$style.list">
    <li
      v-for="item in items"
      :key="item.id"
      :class="$style.item"
    >
      <button
        type="button"
        :class="$style.trigger"
        :aria-expanded="isOpen(item.id)"
        :aria-controls="`vacancy-panel-${item.id}`"
        @click="toggle(item.id)"
      >
        <span :class="$style.title">{{ item.title }}</span>
        <span :class="$style.iconWrap" aria-hidden="true">
          <UIcon
            name="local:arrow-down"
            :class="[$style.icon, { [$style.iconOpen]: isOpen(item.id) }]"
          />
        </span>
      </button>

      <div
        :id="`vacancy-panel-${item.id}`"
        :class="$style.panel"
        :hidden="!isOpen(item.id)"
      >
        <div
          v-if="isOpen(item.id)"
          :class="$style.content"
        >
          <aside
            v-if="item.contacts"
            :class="$style.contacts"
          >
            <div
              :class="$style.contactsPattern"
              aria-hidden="true"
            >
              <img
                :class="$style.contactsPatternImage"
                src="/images/awards/card-pattern.svg"
                alt=""
                width="1220"
                height="1216"
                decoding="async"
              >
              <div :class="$style.contactsPatternFade" />
            </div>

            <div :class="$style.contactsBody">
              <p :class="$style.contactsTitle">{{ labels.contacts }}</p>
              <p :class="$style.contactsName">{{ item.contacts.name }}</p>

              <div :class="$style.contactsRows">
                <div :class="$style.contactsRow">
                  <span :class="$style.contactsLabel">
                    <UIcon
                      name="local:phone"
                      :class="$style.contactsIcon"
                    />
                    {{ labels.phone }}
                  </span>
                  <a
                    :class="$style.contactsValue"
                    :href="item.contacts.phoneHref"
                  >
                    {{ item.contacts.phone }}
                  </a>
                </div>

                <div :class="$style.contactsRow">
                  <span :class="$style.contactsLabel">
                    <UIcon
                      name="local:message"
                      :class="$style.contactsIcon"
                    />
                    {{ labels.email }}
                  </span>
                  <a
                    :class="$style.contactsValue"
                    :href="item.contacts.emailHref"
                  >
                    {{ item.contacts.email }}
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <div :class="$style.details">
            <div
              v-for="(section, sectionIndex) in item.sections"
              :key="`${item.id}-section-${sectionIndex}`"
              :class="$style.section"
            >
              <p :class="$style.sectionTitle">{{ section.title }}</p>
              <ul :class="$style.sectionList">
                <li
                  v-for="(bullet, bulletIndex) in section.items"
                  :key="`${item.id}-bullet-${sectionIndex}-${bulletIndex}`"
                  :class="$style.sectionItem"
                >
                  {{ bullet }}
                </li>
              </ul>
            </div>

            <div
              v-if="item.footnotes?.length"
              :class="$style.footnotes"
            >
              <p
                v-for="(note, noteIndex) in item.footnotes"
                :key="`${item.id}-note-${noteIndex}`"
                :class="$style.footnote"
              >
                {{ note }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style module lang="scss">
@use 'tools' as *;

.list {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    gap: rem(40);
  }
}

.item {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  padding-bottom: var(--fs-space-3);
  border-bottom: rem(2) solid var(--fs-color-light);

  @include from-desktop {
    gap: rem(24);
    padding-bottom: rem(40);
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

.title {
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
  min-width: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);

  @include from-desktop {
    flex-direction: row;
    gap: rem(80);
    align-items: flex-start;
    justify-content: space-between;
  }
}

.contacts {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
  padding: var(--fs-space-3);
  overflow: clip;
  background-color: var(--fs-color-light);
  border-radius: rem(24);

  @include from-desktop {
    flex: 0 0 rem(370);
    width: rem(370);
    border-radius: rem(32);
  }
}

.contactsPattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.contactsPatternImage {
  position: absolute;
  top: 50%;
  right: rem(-180);
  width: rem(420);
  height: auto;
  max-width: none;
  transform: translateY(-50%);
}

.contactsPatternFade {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    69deg,
    var(--fs-color-light) 17%,
    rgb(243 242 237 / 0%) 96%
  );
}

.contactsBody {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;
}

.contactsTitle {
  @include fs-h3;
  margin: 0;
}

.contactsName {
  @include fs-text-lg;
  margin: 0;
}

.contactsRows {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.contactsRow {
  display: flex;
  flex-wrap: wrap;
  gap: rem(8);
  align-items: center;
}

.contactsLabel {
  display: inline-flex;
  gap: rem(4);
  align-items: center;
  width: rem(120);
  @include fs-text-lg;
  color: var(--fs-color-gray);
}

.contactsIcon {
  width: rem(24);
  height: rem(24);
  color: var(--fs-color-black);
}

.contactsValue {
  @include fs-text-lg;
  color: var(--fs-color-black);
  text-decoration: none;
  overflow-wrap: anywhere;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.details {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    max-width: rem(768);
    gap: rem(32);
  }
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;
}

.sectionTitle {
  @include fs-text-md;
  margin: 0;
}

.sectionList {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  margin: 0;
  padding: 0;
  list-style: none;
}

.sectionItem {
  position: relative;
  padding-left: rem(16);
  @include fs-text-lg;
  overflow-wrap: break-word;

  &::before {
    position: absolute;
    top: rem(8);
    left: 0;
    width: rem(8);
    height: rem(8);
    content: '';
    background-color: var(--fs-color-black);
    border-radius: 50%;
  }
}

.footnotes {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.footnote {
  margin: 0;
  @include fs-text-lg;
  overflow-wrap: break-word;
}
</style>
