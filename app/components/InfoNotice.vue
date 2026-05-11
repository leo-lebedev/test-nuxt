<script setup lang="ts">
import type { CatalogNotice } from '~/types/catalog'

const props = defineProps<{
  notice: CatalogNotice
}>()

const noticeClassName = computed(() => `info-notice--${props.notice.tone}`)
</script>

<template>
  <p class="info-notice" :class="noticeClassName">
    {{ notice.text }}
  </p>
</template>
