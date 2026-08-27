<script setup lang="ts">
const { label } = getSiteNavItem('/cafes')
</script>

<template>
  <LayoutInnerPage :title="label" />
</template>
