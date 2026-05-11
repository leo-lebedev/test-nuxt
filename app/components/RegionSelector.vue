<script setup lang="ts">
import type { Region } from '~/types/catalog'

const props = defineProps<{
  regions: Region[]
  selectedRegionId: string
}>()

const emit = defineEmits<{
  select: [regionId: string]
}>()

const regionItems = computed(() => props.regions.map((region) => {
  const isActive = region.id === props.selectedRegionId

  return {
    ...region,
    className: isActive ? 'region-selector__pill--active' : '',
    isActive,
  }
}))

const selectRegion = (regionId: string) => {
  emit('select', regionId)
}
</script>

<template>
  <fieldset class="region-selector" aria-label="Регион подписки">
    <legend class="sr-only">Регион подписки</legend>
    <label
      v-for="region in regionItems"
      :key="region.id"
      class="region-selector__pill"
      :class="region.className"
    >
      <input
        class="region-selector__input sr-only"
        type="radio"
        name="region"
        :value="region.id"
        :checked="region.isActive"
        @change="selectRegion(region.id)"
      >
      <span class="region-selector__flag" aria-hidden="true">{{ region.flag }}</span>
      <span class="region-selector__label">{{ region.label }}</span>
    </label>
  </fieldset>
</template>
