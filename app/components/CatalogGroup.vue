<script setup lang="ts">
import type { CatalogNotice, PlanViewModel } from '~/types/catalog'

const props = defineProps<{
  group: {
    id: string
    title: string
    notice?: CatalogNotice
    plans: PlanViewModel[]
  }
}>()

const emit = defineEmits<{
  selectPlan: [groupId: string, planId: string]
}>()

const titleId = computed(() => `group-${props.group.id}`)
const gridClassName = computed(() => `plan-grid--count-${Math.min(props.group.plans.length, 4)}`)
const plans = computed(() => props.group.plans)

const selectPlan = (groupId: string, planId: string) => {
  emit('selectPlan', groupId, planId)
}
</script>

<template>
  <section class="catalog-group" :aria-labelledby="titleId">
    <header class="catalog-group__header">
      <h2 :id="titleId" class="catalog-group__title">
        {{ group.title }}
      </h2>
      <img class="catalog-group__help" src="/figma/info.svg" alt="Информация о группе">
    </header>

    <InfoNotice v-if="group.notice" :notice="group.notice" />

    <ul class="plan-grid" :class="gridClassName">
      <li v-for="plan in plans" :key="plan.id" class="plan-grid__item">
        <PlanCard :plan="plan" :group-id="group.id" @select="selectPlan" />
      </li>
    </ul>
  </section>
</template>
