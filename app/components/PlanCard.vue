<script setup lang="ts">
import type { PlanViewModel } from '~/types/catalog'

const props = defineProps<{
  plan: PlanViewModel
  groupId: string
}>()

const emit = defineEmits<{
  select: [groupId: string, planId: string]
}>()

const cardClassName = computed(() => [
  `plan-card--${props.plan.attributes.accent}`,
  `plan-card--${props.plan.state}`,
])
const isSelected = computed(() => props.plan.state === 'selected')
const isDisabled = computed(() => props.plan.state === 'disabled')

const selectPlan = () => {
  emit('select', props.groupId, props.plan.id)
}
</script>

<template>
  <button
    class="plan-card"
    :class="cardClassName"
    type="button"
    :aria-pressed="isSelected"
    :disabled="isDisabled"
    @click="selectPlan"
  >
    <span class="plan-card__logo" aria-hidden="true">
      <img :src="plan.brandLogoUrl" alt="">
    </span>
    <span v-if="isSelected" class="plan-card__badge">Выбрано</span>
    <span class="plan-card__body">
      <span class="plan-card__subtitle">{{ plan.subtitle }}</span>
      <strong class="plan-card__price">{{ plan.formattedPrice }}</strong>
    </span>
  </button>
</template>
