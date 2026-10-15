<script setup lang="ts">
import type { UiSearchOption } from '~/components/ui/Search.vue'
import {
  catalogFilterTexts,
  type CatalogFiltersVariant,
} from '#shared/utils/catalogFilterTexts'

const props = withDefaults(
  defineProps<{
    variant?: CatalogFiltersVariant
    options?: UiSearchOption[]
  }>(),
  {
    variant: 'shops',
    options: () => [],
  },
)

const query = defineModel<string>({ default: '' })
const texts = computed(() => catalogFilterTexts(props.variant))
</script>

<template>
  <UiSearch
    v-model="query"
    :label="texts.searchLabel"
    :placeholder="texts.searchPlaceholder"
    :options="options"
  />
</template>
