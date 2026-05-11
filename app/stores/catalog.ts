import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  CardState,
  CatalogGrouping,
  CatalogPlan,
  CatalogVisibleGroup,
  PlanViewModel,
} from '~/types/catalog'
import {
  CARD_STATE,
  CATALOG_MODEL,
  DEFAULT_GROUPING_ID,
  DEFAULT_REGION_ID,
  DEFAULT_SELECTED_PLAN_BY_GROUP_ID,
  DEFAULT_TAB_ID,
} from '~/stores/catalog.data'

const formatMoney = (price: CatalogPlan['price']) => {
  if (price.currency === 'RUB') {
    return `${price.amount} ₽`
  }

  return String(price.amount)
}

export const useCatalogStore = defineStore('catalog', () => {
  const catalog = ref(CATALOG_MODEL)
  const activeTabId = ref<string>(DEFAULT_TAB_ID)
  const activeGroupingId = ref<string>(DEFAULT_GROUPING_ID)
  const selectedRegionId = ref<string>(DEFAULT_REGION_ID)
  const selectedPlanByGroupId = ref<Record<string, string>>({ ...DEFAULT_SELECTED_PLAN_BY_GROUP_ID })

  const activeTab = computed(() =>
    catalog.value.tabs.find((tab) => tab.id === activeTabId.value) ?? catalog.value.tabs[0],
  )
  const selectedRegion = computed(() =>
    catalog.value.regions.find((region) => region.id === selectedRegionId.value) ?? catalog.value.regions[0],
  )
  const groupings = computed(() => catalog.value.groupings)
  const activeGrouping = computed(() =>
    groupings.value.find((grouping) => grouping.id === activeGroupingId.value) ?? groupings.value[0],
  )

  const getType = (typeId: string) => catalog.value.subscriptionTypes.find((type) => type.id === typeId)
  const getPeriod = (periodId: string) => catalog.value.periods.find((period) => period.id === periodId)
  const getNotice = (noticeId?: string) => catalog.value.notices.find((notice) => notice.id === noticeId)

  const isRegionAvailableForPlan = (plan: CatalogPlan) => plan.regionIds.includes(selectedRegionId.value)

  const getCardState = (plan: CatalogPlan, visibleGroupId: string): CardState => {
    if (plan.disabled || !isRegionAvailableForPlan(plan)) {
      return CARD_STATE.disabled
    }

    return selectedPlanByGroupId.value[visibleGroupId] === plan.id ? CARD_STATE.selected : CARD_STATE.available
  }

  const getGroupingKey = (plan: CatalogPlan, grouping: CatalogGrouping) => plan[grouping.source]

  const getGroupingOrder = (groupId: string, grouping: CatalogGrouping) => {
    if (grouping.source === 'groupId') {
      return catalog.value.groups.find((group) => group.id === groupId)?.order ?? 0
    }

    if (grouping.source === 'periodId') {
      return getPeriod(groupId)?.months ?? 0
    }

    return catalog.value.subscriptionTypes.findIndex((type) => type.id === groupId)
  }

  const getGroupingTitle = (groupId: string, grouping: CatalogGrouping) => {
    if (grouping.source === 'groupId') {
      const group = catalog.value.groups.find((item) => item.id === groupId)
      const type = getType(group?.typeId ?? groupId)

      return `${type?.title ?? groupId} (${type?.label ?? groupId})`
    }

    if (grouping.source === 'periodId') {
      return getPeriod(groupId)?.label ?? groupId
    }

    const type = getType(groupId)

    return `${type?.title ?? groupId} (${type?.label ?? groupId})`
  }

  const getGroupingNotice = (groupId: string, grouping: CatalogGrouping) => {
    if (grouping.source !== 'groupId') {
      return undefined
    }

    const group = catalog.value.groups.find((item) => item.id === groupId)

    return getNotice(group?.noticeId)
  }

  const isPlanInVisibleGroup = (plan: CatalogPlan, visibleGroupId: string) => {
    const grouping = activeGrouping.value

    return Boolean(grouping && getGroupingKey(plan, grouping) === visibleGroupId)
  }

  const visibleGroups = computed<CatalogVisibleGroup[]>(() => {
    const grouping = activeGrouping.value

    if (!grouping) {
      return []
    }

    const plansByGroupId = catalog.value.plans
      .filter((plan) => plan.tabId === activeTabId.value)
      .reduce<Record<string, CatalogPlan[]>>((groups, plan) => {
        const groupId = getGroupingKey(plan, grouping)

        groups[groupId] = groups[groupId] ?? []
        groups[groupId].push(plan)

        return groups
      }, {})

    return Object.entries(plansByGroupId)
      .sort(([leftId], [rightId]) => getGroupingOrder(leftId, grouping) - getGroupingOrder(rightId, grouping))
      .map(([groupId, plans]) => {
        const groupPlans: PlanViewModel[] = [...plans]
          .sort((left, right) => (getPeriod(left.periodId)?.months ?? 0) - (getPeriod(right.periodId)?.months ?? 0))
          .map((plan) => {
            const period = getPeriod(plan.periodId)
            const type = getType(plan.typeId)

            return {
              ...plan,
              title: type?.label ?? plan.typeId,
              subtitle: `${type?.label ?? plan.typeId} · ${period?.label ?? plan.periodId}`,
              periodLabel: period?.label ?? plan.periodId,
              formattedPrice: formatMoney(plan.price),
              state: getCardState(plan, groupId),
            }
          })

        return {
          id: groupId,
          title: getGroupingTitle(groupId, grouping),
          notice: getGroupingNotice(groupId, grouping),
          plans: groupPlans,
        }
      })
  })

  const selectTab = (tabId: string) => {
    if (catalog.value.tabs.some((tab) => tab.id === tabId)) {
      activeTabId.value = tabId
    }
  }

  const selectGrouping = (groupingId: string) => {
    if (catalog.value.groupings.some((grouping) => grouping.id === groupingId)) {
      activeGroupingId.value = groupingId
      selectedPlanByGroupId.value = {}
    }
  }

  const selectRegion = (regionId: string) => {
    if (!catalog.value.regions.some((region) => region.id === regionId)) {
      return
    }

    selectedRegionId.value = regionId

    const nextSelection = { ...selectedPlanByGroupId.value }
    for (const [groupId, planId] of Object.entries(nextSelection)) {
      const plan = catalog.value.plans.find((item) => item.id === planId)
      if (!plan || !isPlanInVisibleGroup(plan, groupId) || !isRegionAvailableForPlan(plan) || plan.tabId !== activeTabId.value) {
        delete nextSelection[groupId]
      }
    }
    selectedPlanByGroupId.value = nextSelection
  }

  const selectPlan = (groupId: string, planId: string) => {
    const plan = catalog.value.plans.find((item) => item.id === planId)

    if (!plan || !isPlanInVisibleGroup(plan, groupId) || plan.disabled || plan.tabId !== activeTabId.value || !isRegionAvailableForPlan(plan)) {
      return
    }

    selectedPlanByGroupId.value = {
      ...selectedPlanByGroupId.value,
      [groupId]: planId,
    }
  }

  return {
    activeGrouping,
    activeGroupingId,
    activeTab,
    activeTabId,
    catalog,
    catalogTabs: computed(() => catalog.value.tabs),
    groupings,
    regions: computed(() => catalog.value.regions),
    selectedPlanByGroupId,
    selectedRegion,
    selectedRegionId,
    visibleGroups,
    selectGrouping,
    selectPlan,
    selectRegion,
    selectTab,
  }
})
