import type {
  Brand,
  CatalogCardStateRule,
  CatalogGroup,
  CatalogGrouping,
  CatalogModel,
  CatalogNotice,
  CatalogPlan,
  CatalogTab,
  CurrencyCode,
  Period,
  Region,
  SubscriptionType,
} from '~/types/catalog'
import {
  BRAND_ID,
  CARD_STATE,
  CATALOG_GROUP_ID,
  CATALOG_TAB_KIND,
  CURRENCY_CODE,
  NOTICE_ID,
  PERIOD_ID,
  PLAN_ACCENT,
  REGION_ID,
  SUBSCRIPTION_TYPE_ID,
  TAB_ID,
} from '~/stores/catalog.constants'

export const CURRENCY_FORMATTERS: Record<CurrencyCode, (amount: number) => string> = {
  [CURRENCY_CODE.rub]: (amount) => `${amount} ₽`,
}

export const DEFAULT_GROUPING_ID = 'by-catalog-group'

export const DEFAULT_TAB_ID = TAB_ID.subscriptions
export const DEFAULT_REGION_ID = REGION_ID.egypt

export const CATALOG_TABS: CatalogTab[] = [
  { id: TAB_ID.subscriptions, label: 'Подписки', kind: CATALOG_TAB_KIND.subscriptions },
  { id: TAB_ID.giftCards, label: 'Подарочные карты', kind: CATALOG_TAB_KIND.giftCards },
]

export const REGIONS: Region[] = [
  { id: REGION_ID.egypt, label: 'Египет', flagUrl: '/figma/region-flag.svg' },
  { id: REGION_ID.india, label: 'Индия', flagUrl: '/figma/region-flag.svg' },
  { id: REGION_ID.nigeria, label: 'Нигерия', flagUrl: '/figma/region-flag.svg' },
  { id: REGION_ID.netherlands, label: 'Нидерланды', flagUrl: '/figma/region-flag.svg' },
  { id: REGION_ID.brazil, label: 'Бразилия', flagUrl: '/figma/region-flag.svg' },
]

export const PERIODS: Period[] = [
  { id: PERIOD_ID.oneMonth, label: '1 месяц', months: 1, order: 1 },
  { id: PERIOD_ID.threeMonths, label: '3 месяц', months: 3, order: 3 },
  { id: PERIOD_ID.sixMonths, label: '6 месяц', months: 6, order: 6 },
  { id: PERIOD_ID.twelveMonths, label: '12 месяц', months: 12, order: 12 },
]

export const SUBSCRIPTION_TYPES: SubscriptionType[] = [
  { id: SUBSCRIPTION_TYPE_ID.individual, label: 'Individual', title: 'Индивидуальные подписки', order: 1 },
  { id: SUBSCRIPTION_TYPE_ID.duo, label: 'Duo', title: 'Парные подписки', order: 2 },
  { id: SUBSCRIPTION_TYPE_ID.family, label: 'Family', title: 'Семейные подписки', order: 3 },
  { id: SUBSCRIPTION_TYPE_ID.platinum, label: 'Platinum', title: 'Платиновая подписка', order: 4 },
  { id: SUBSCRIPTION_TYPE_ID.gift, label: 'Gift', title: 'Подарочные карты', order: 1 },
]

export const CATALOG_GROUPS: CatalogGroup[] = [
  { id: CATALOG_GROUP_ID.individual, label: 'Individual', title: 'Индивидуальные подписки', order: 1 },
  { id: CATALOG_GROUP_ID.duo, label: 'DUO', title: 'Парные подписки', order: 2, noticeId: NOTICE_ID.duoLimit },
  { id: CATALOG_GROUP_ID.family, label: 'Family', title: 'Семейные подписки', order: 3, noticeId: NOTICE_ID.familyLimit },
  { id: CATALOG_GROUP_ID.platinum, label: 'Platinum', title: 'Платиновая подписка', order: 4, noticeId: NOTICE_ID.platinumLimit },
  { id: CATALOG_GROUP_ID.giftCard, label: 'Gift', title: 'Подарочные карты', order: 1, noticeId: NOTICE_ID.giftCardsNotice },
]

export const BRANDS: Brand[] = [
  { id: BRAND_ID.spotify, label: 'Spotify', title: 'Spotify', logoUrl: '/figma/spotify.svg', order: 1 },
]

export const CATALOG_GROUPINGS: CatalogGrouping[] = [
  { id: 'by-catalog-group', label: 'По группам каталога', source: 'group', dictionary: 'groups', noticeDictionary: 'groups' },
  { id: 'by-type', label: 'По типу подписки', source: 'type', dictionary: 'subscriptionTypes' },
  { id: 'by-period', label: 'По периоду', source: 'period', dictionary: 'periods' },
  { id: 'by-brand', label: 'По бренду', source: 'brand', dictionary: 'brands' },
]

export const CARD_STATE_RULES: CatalogCardStateRule[] = [
  {
    state: CARD_STATE.disabled,
    priority: 100,
    matches: ({ plan, isRegionAvailable }) => !isRegionAvailable || Boolean(plan.attributes.stateFlags?.includes(CARD_STATE.disabled)),
  },
  {
    state: CARD_STATE.selected,
    priority: 50,
    matches: ({ plan, selectedPlanId }) => selectedPlanId === plan.id,
  },
]

export const CATALOG_NOTICES: CatalogNotice[] = [
  {
    id: NOTICE_ID.duoLimit,
    groupId: CATALOG_GROUP_ID.duo,
    tone: 'success',
    text: 'В подписку может входить до 2 аккаунтов. Регион подписки: Египет или Нигерия (случайным образом)',
  },
  {
    id: NOTICE_ID.familyLimit,
    groupId: CATALOG_GROUP_ID.family,
    tone: 'success',
    text: 'В подписку может входить до 6 аккаунтов. Регион подписки: Египет или Нигерия (случайным образом)',
  },
  {
    id: NOTICE_ID.platinumLimit,
    groupId: CATALOG_GROUP_ID.platinum,
    tone: 'success',
    text: 'В подписку может входить до 3 аккаунтов с регионом Индия.',
  },
  {
    id: NOTICE_ID.giftCardsNotice,
    groupId: CATALOG_GROUP_ID.giftCard,
    tone: 'info',
    text: 'Подарочные карты доступны для всех регионов и не требуют выбора типа подписки.',
  },
]

const commonPrice = { amount: 263, currency: CURRENCY_CODE.rub }
const allRegionIds = [
  REGION_ID.egypt,
  REGION_ID.india,
  REGION_ID.nigeria,
  REGION_ID.netherlands,
  REGION_ID.brazil,
]
const randomEgyptOrNigeriaRegionIds = [REGION_ID.egypt, REGION_ID.nigeria]

export const CATALOG_PLANS: CatalogPlan[] = [
  {
    id: 'individual-1-month',
    attributes: {
      tab: TAB_ID.subscriptions,
      group: CATALOG_GROUP_ID.individual,
      type: SUBSCRIPTION_TYPE_ID.individual,
      period: PERIOD_ID.oneMonth,
      brand: BRAND_ID.spotify,
      regionIds: allRegionIds,
      accent: PLAN_ACCENT.rose,
    },
    price: commonPrice,
  },
  {
    id: 'individual-3-months',
    attributes: {
      tab: TAB_ID.subscriptions,
      group: CATALOG_GROUP_ID.individual,
      type: SUBSCRIPTION_TYPE_ID.individual,
      period: PERIOD_ID.threeMonths,
      brand: BRAND_ID.spotify,
      regionIds: allRegionIds,
      accent: PLAN_ACCENT.rose,
    },
    price: commonPrice,
  },
  {
    id: 'individual-6-months',
    attributes: {
      tab: TAB_ID.subscriptions,
      group: CATALOG_GROUP_ID.individual,
      type: SUBSCRIPTION_TYPE_ID.individual,
      period: PERIOD_ID.sixMonths,
      brand: BRAND_ID.spotify,
      regionIds: allRegionIds,
      accent: PLAN_ACCENT.rose,
    },
    price: commonPrice,
  },
  {
    id: 'individual-12-months',
    attributes: {
      tab: TAB_ID.subscriptions,
      group: CATALOG_GROUP_ID.individual,
      type: SUBSCRIPTION_TYPE_ID.individual,
      period: PERIOD_ID.twelveMonths,
      brand: BRAND_ID.spotify,
      regionIds: allRegionIds,
      accent: PLAN_ACCENT.rose,
    },
    price: commonPrice,
  },
  {
    id: 'duo-1-month',
    attributes: {
      tab: TAB_ID.subscriptions,
      group: CATALOG_GROUP_ID.duo,
      type: SUBSCRIPTION_TYPE_ID.duo,
      period: PERIOD_ID.oneMonth,
      brand: BRAND_ID.spotify,
      regionIds: randomEgyptOrNigeriaRegionIds,
      accent: PLAN_ACCENT.amber,
    },
    price: commonPrice,
  },
  {
    id: 'duo-3-months',
    attributes: {
      tab: TAB_ID.subscriptions,
      group: CATALOG_GROUP_ID.duo,
      type: SUBSCRIPTION_TYPE_ID.duo,
      period: PERIOD_ID.threeMonths,
      brand: BRAND_ID.spotify,
      regionIds: randomEgyptOrNigeriaRegionIds,
      accent: PLAN_ACCENT.amber,
    },
    price: commonPrice,
  },
  {
    id: 'duo-12-months',
    attributes: {
      tab: TAB_ID.subscriptions,
      group: CATALOG_GROUP_ID.duo,
      type: SUBSCRIPTION_TYPE_ID.duo,
      period: PERIOD_ID.twelveMonths,
      brand: BRAND_ID.spotify,
      regionIds: randomEgyptOrNigeriaRegionIds,
      accent: PLAN_ACCENT.amber,
    },
    price: commonPrice,
  },
  {
    id: 'family-6-months',
    attributes: {
      tab: TAB_ID.subscriptions,
      group: CATALOG_GROUP_ID.family,
      type: SUBSCRIPTION_TYPE_ID.family,
      period: PERIOD_ID.sixMonths,
      brand: BRAND_ID.spotify,
      regionIds: randomEgyptOrNigeriaRegionIds,
      accent: PLAN_ACCENT.blue,
    },
    price: commonPrice,
  },
  {
    id: 'platinum-6-months',
    attributes: {
      tab: TAB_ID.subscriptions,
      group: CATALOG_GROUP_ID.platinum,
      type: SUBSCRIPTION_TYPE_ID.platinum,
      period: PERIOD_ID.sixMonths,
      brand: BRAND_ID.spotify,
      regionIds: [REGION_ID.india],
      accent: PLAN_ACCENT.lavender,
      labelOverride: 'Family',
    },
    price: commonPrice,
  },
  {
    id: 'gift-card-1-month',
    attributes: {
      tab: TAB_ID.giftCards,
      group: CATALOG_GROUP_ID.giftCard,
      type: SUBSCRIPTION_TYPE_ID.gift,
      period: PERIOD_ID.oneMonth,
      brand: BRAND_ID.spotify,
      regionIds: allRegionIds,
      accent: PLAN_ACCENT.amber,
    },
    price: { amount: 500, currency: CURRENCY_CODE.rub },
  },
  {
    id: 'gift-card-3-months',
    attributes: {
      tab: TAB_ID.giftCards,
      group: CATALOG_GROUP_ID.giftCard,
      type: SUBSCRIPTION_TYPE_ID.gift,
      period: PERIOD_ID.threeMonths,
      brand: BRAND_ID.spotify,
      regionIds: allRegionIds,
      accent: PLAN_ACCENT.rose,
    },
    price: { amount: 1200, currency: CURRENCY_CODE.rub },
  },
]

export const DEFAULT_SELECTED_PLAN_ID = 'duo-12-months'

export const CATALOG_MODEL: CatalogModel = {
  tabs: CATALOG_TABS,
  regions: REGIONS,
  periods: PERIODS,
  subscriptionTypes: SUBSCRIPTION_TYPES,
  groups: CATALOG_GROUPS,
  brands: BRANDS,
  notices: CATALOG_NOTICES,
  plans: CATALOG_PLANS,
  groupings: CATALOG_GROUPINGS,
}
