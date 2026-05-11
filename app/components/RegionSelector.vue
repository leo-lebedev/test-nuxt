<script setup lang="ts">
import type { Region, RegionId } from '~/types/catalog'

const props = defineProps<{
  regions: Region[]
  selectedRegionId: RegionId
}>()

const emit = defineEmits<{
  select: [regionId: RegionId]
}>()

const regionItems = computed(() => props.regions.map((region) => {
  const isActive = region.id === props.selectedRegionId

  return {
    ...region,
    className: isActive ? 'region-selector__pill--active' : '',
    isActive,
  }
}))

const selectRegion = (regionId: RegionId) => {
  emit('select', regionId)
}
</script>

<template>
  <div class="region-selector" role="radiogroup" aria-label="Регион подписки">
    <button
      v-for="region in regionItems"
      :key="region.id"
      class="region-selector__pill"
      :class="region.className"
      type="button"
      role="radio"
      :aria-checked="region.isActive"
      @click="selectRegion(region.id)"
    >
      <img class="region-selector__flag" :src="region.flagUrl" alt="" aria-hidden="true">
      <span class="region-selector__label">{{ region.label }}</span>
    </button>
  </div>
</template>
