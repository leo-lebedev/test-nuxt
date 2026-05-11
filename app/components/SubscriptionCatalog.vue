<script setup lang="ts">
const catalogStore = useCatalogStore()

const activePanelId = computed(() => `panel-${catalogStore.activeTabId}`)
const activePanelLabelledBy = computed(() => `tab-${catalogStore.activeTabId}`)
</script>

<template>
  <section class="catalog" aria-labelledby="page-title">
    <h1 id="page-title" class="sr-only">Каталог подписок Spotify</h1>

    <CatalogTabs
      :tabs="catalogStore.catalogTabs"
      :active-tab-id="catalogStore.activeTabId"
      @select="catalogStore.selectTab"
    />

    <section
      :id="activePanelId"
      class="catalog__content"
      role="tabpanel"
      :aria-labelledby="activePanelLabelledBy"
    >
      <RegionSelector
        :regions="catalogStore.regions"
        :selected-region-id="catalogStore.selectedRegionId"
        @select="catalogStore.selectRegion"
      />

      <div class="catalog__groups">
        <CatalogGroup
          v-for="group in catalogStore.visibleGroups"
          :key="group.id"
          :group="group"
          @select-plan="catalogStore.selectPlan"
        />
      </div>
    </section>
  </section>
</template>
