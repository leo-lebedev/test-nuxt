<script setup lang="ts">
import type { CatalogTab } from '~/types/catalog'

const props = defineProps<{
  tabs: CatalogTab[]
  activeTabId: string
}>()

const emit = defineEmits<{
  select: [tabId: string]
}>()

const tabItems = computed(() => props.tabs.map((tab) => {
  const isActive = tab.id === props.activeTabId

  return {
    ...tab,
    buttonId: `tab-${tab.id}`,
    panelId: `panel-${tab.id}`,
    className: isActive ? 'catalog-tabs__button--active' : '',
    isActive,
  }
}))

const selectTab = (tabId: string) => {
  emit('select', tabId)
}
</script>

<template>
  <div class="catalog-tabs" role="tablist" aria-label="Разделы каталога">
    <button
      v-for="tab in tabItems"
      :id="tab.buttonId"
      :key="tab.id"
      class="catalog-tabs__button"
      :class="tab.className"
      type="button"
      role="tab"
      :aria-selected="tab.isActive"
      :aria-controls="tab.panelId"
      @click="selectTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
