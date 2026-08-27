<script setup lang="ts">
const { label } = getSiteNavItem('/news')
</script>

<template>
  <LayoutInnerPage :title="label" />
</template>
