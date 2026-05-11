import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  CardState,
  CatalogDictionaryItem,
  CatalogDictionaryName,
  CatalogGrouping,
  CatalogPlan,
  CatalogVisibleGroup,
  PlanViewModel,
  RegionId,
  TabId,
} from '~/types/catalog'
import {
  CARD_STATE_RULES,
  CATALOG_MODEL,
  CURRENCY_FORMATTERS,
  DEFAULT_GROUPING_ID,
  DEFAULT_REGION_ID,
  DEFAULT_SELECTED_PLAN_ID,
  DEFAULT_TAB_ID,
} from '~/stores/catalog.data'
import { CARD_STATE } from '~/stores/catalog.constants'

const formatMoney = (price: CatalogPlan['price']) => {
  const formatter = CURRENCY_FORMATTERS[price.currency]

  return formatter ? formatter(price.amount) : String(price.amount)
}

export const useCatalogStore = defineStore('catalog', () => {
  const catalog = ref(CATALOG_MODEL)
  const activeTabId = ref<TabId>(DEFAULT_TAB_ID)
  const activeGroupingId = ref<string>(DEFAULT_GROUPING_ID)
  const selectedRegionId = ref<RegionId>(DEFAULT_REGION_ID)
  const selectedPlanId = ref<string | undefined>(DEFAULT_SELECTED_PLAN_ID)

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

  const getType = (typeId: CatalogPlan['attributes']['type']) => catalog.value.subscriptionTypes.find((type) => type.id === typeId)
  const getPeriod = (periodId: CatalogPlan['attributes']['period']) => catalog.value.periods.find((period) => period.id === periodId)
  const getBrand = (brandId: CatalogPlan['attributes']['brand']) => catalog.value.brands.find((brand) => brand.id === brandId)
  const getNotice = (noticeId?: string) => catalog.value.notices.find((notice) => notice.id === noticeId)

  const isRegionAvailableForPlan = (plan: CatalogPlan) => plan.attributes.regionIds.includes(selectedRegionId.value)

  const getDictionary = (dictionaryName: CatalogDictionaryName): CatalogDictionaryItem[] => catalog.value[dictionaryName]

  const getDictionaryItem = (dictionaryName: CatalogDictionaryName, itemId: string) =>
    getDictionary(dictionaryName).find((item) => item.id === itemId)

  const getDictionaryOrder = (dictionaryName: CatalogDictionaryName, itemId: string) =>
    getDictionaryItem(dictionaryName, itemId)?.order ?? 0

  const getDictionaryTitle = (dictionaryName: CatalogDictionaryName, itemId: string) => {
    const item = getDictionaryItem(dictionaryName, itemId)

    if (!item) {
      return itemId
    }

    if ('title' in item && item.title && 'label' in item && item.label) {
      return `${item.title} (${item.label})`
    }

    return item.label ?? itemId
  }

  const getCardState = (plan: CatalogPlan, visibleGroupId: string): CardState => {
    const isRegionAvailable = isRegionAvailableForPlan(plan)
    const matchedRule = [...CARD_STATE_RULES]
      .sort((left, right) => right.priority - left.priority)
      .find((rule) => rule.matches({
        plan,
        visibleGroupId,
        selectedPlanId: selectedPlanId.value,
        selectedRegionId: selectedRegionId.value,
        isRegionAvailable,
      }))

    return matchedRule?.state ?? CARD_STATE.available
  }

  const getGroupingKey = (plan: CatalogPlan, grouping: CatalogGrouping) => plan.attributes[grouping.source]

  const getGroupingOrder = (groupId: string, grouping: CatalogGrouping) => getDictionaryOrder(grouping.dictionary, groupId)

  const getGroupingNotice = (groupId: string, grouping: CatalogGrouping) => {
    if (!grouping.noticeDictionary) {
      return undefined
    }

    const item = getDictionaryItem(grouping.noticeDictionary, groupId)
    const noticeId = item && 'noticeId' in item ? item.noticeId : undefined

    return getNotice(noticeId)
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
      .filter((plan) => plan.attributes.tab === activeTabId.value)
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
          .sort((left, right) => {
            const leftOrder = left.attributes.displayOrder ?? getPeriod(left.attributes.period)?.months ?? 0
            const rightOrder = right.attributes.displayOrder ?? getPeriod(right.attributes.period)?.months ?? 0

            return leftOrder - rightOrder
          })
          .map((plan) => {
            const period = getPeriod(plan.attributes.period)
            const type = getType(plan.attributes.type)
            const brand = getBrand(plan.attributes.brand)
            const planLabel = plan.attributes.labelOverride ?? type?.label ?? plan.attributes.type

            return {
              ...plan,
              title: planLabel,
              subtitle: `${planLabel} · ${period?.label ?? plan.attributes.period}`,
              periodLabel: period?.label ?? plan.attributes.period,
              formattedPrice: formatMoney(plan.price),
              brandLogoUrl: brand?.logoUrl ?? '',
              state: getCardState(plan, groupId),
            }
          })

        return {
          id: groupId,
          title: getDictionaryTitle(grouping.dictionary, groupId),
          notice: getGroupingNotice(groupId, grouping),
          plans: groupPlans,
        }
      })
  })

  const selectTab = (tabId: TabId) => {
    if (catalog.value.tabs.some((tab) => tab.id === tabId)) {
      activeTabId.value = tabId
    }
  }

  const selectGrouping = (groupingId: string) => {
    if (catalog.value.groupings.some((grouping) => grouping.id === groupingId)) {
      activeGroupingId.value = groupingId
    }
  }

  const selectRegion = (regionId: RegionId) => {
    if (!catalog.value.regions.some((region) => region.id === regionId)) {
      return
    }

    selectedRegionId.value = regionId

    const selectedPlan = catalog.value.plans.find((plan) => plan.id === selectedPlanId.value)
    if (!selectedPlan || !isRegionAvailableForPlan(selectedPlan) || selectedPlan.attributes.tab !== activeTabId.value) {
      selectedPlanId.value = undefined
    }
  }

  const selectPlan = (visibleGroupId: string, planId: string) => {
    const plan = catalog.value.plans.find((item) => item.id === planId)

    if (!plan || !isPlanInVisibleGroup(plan, visibleGroupId) || getCardState(plan, visibleGroupId) === CARD_STATE.disabled || plan.attributes.tab !== activeTabId.value) {
      return
    }

    selectedPlanId.value = planId
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
    selectedPlanId,
    selectedRegion,
    selectedRegionId,
    visibleGroups,
    selectGrouping,
    selectPlan,
    selectRegion,
    selectTab,
  }
})
