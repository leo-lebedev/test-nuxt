import type {
  CatalogGroup,
  CatalogGrouping,
  CatalogModel,
  CatalogNotice,
  CatalogPlan,
  CatalogTab,
  Period,
  Region,
  SubscriptionType,
} from '~/types/catalog'

export const CURRENCY_RUB = 'RUB'
export const DEFAULT_GROUPING_ID = 'by-catalog-group'

export const TAB_ID = {
  subscriptions: 'subscriptions',
  giftCards: 'gift-cards',
} as const

export const REGION_ID = {
  egypt: 'egypt',
  india: 'india',
  nigeria: 'nigeria',
  netherlands: 'netherlands',
  brazil: 'brazil',
} as const

export const PERIOD_ID = {
  oneMonth: '1-month',
  threeMonths: '3-months',
  sixMonths: '6-months',
  twelveMonths: '12-months',
} as const

export const SUBSCRIPTION_TYPE_ID = {
  individual: 'individual',
  duo: 'duo',
  family: 'family',
  platinum: 'platinum',
  gift: 'gift',
} as const

export const CATALOG_GROUP_ID = {
  individual: 'individual',
  duo: 'duo',
  family: 'family',
  platinum: 'platinum',
  giftCard: 'gift-card',
} as const

export const NOTICE_ID = {
  duoLimit: 'duo-limit',
  familyLimit: 'family-limit',
  platinumLimit: 'platinum-limit',
  giftCardsNotice: 'gift-cards-notice',
} as const

export const DEFAULT_TAB_ID = TAB_ID.subscriptions
export const DEFAULT_REGION_ID = REGION_ID.egypt

export const CARD_STATE = {
  available: 'available',
  selected: 'selected',
  disabled: 'disabled',
} as const

export const PLAN_ACCENT = {
  rose: 'rose',
  amber: 'amber',
  blue: 'blue',
  lavender: 'lavender',
} as const

export const CATALOG_TABS: CatalogTab[] = [
  { id: TAB_ID.subscriptions, label: 'Подписки', kind: 'subscriptions' },
  { id: TAB_ID.giftCards, label: 'Подарочные карты', kind: 'giftCards' },
]

export const REGIONS: Region[] = [
  { id: REGION_ID.egypt, label: 'Египет', flag: '🇪🇬' },
  { id: REGION_ID.india, label: 'Индия', flag: '🇮🇳' },
  { id: REGION_ID.nigeria, label: 'Нигерия', flag: '🇳🇬' },
  { id: REGION_ID.netherlands, label: 'Нидерланды', flag: '🇳🇱' },
  { id: REGION_ID.brazil, label: 'Бразилия', flag: '🇧🇷' },
]

export const PERIODS: Period[] = [
  { id: PERIOD_ID.oneMonth, label: '1 месяц', months: 1 },
  { id: PERIOD_ID.threeMonths, label: '3 месяца', months: 3 },
  { id: PERIOD_ID.sixMonths, label: '6 месяцев', months: 6 },
  { id: PERIOD_ID.twelveMonths, label: '12 месяцев', months: 12 },
]

export const SUBSCRIPTION_TYPES: SubscriptionType[] = [
  { id: SUBSCRIPTION_TYPE_ID.individual, label: 'Individual', title: 'Индивидуальные подписки' },
  { id: SUBSCRIPTION_TYPE_ID.duo, label: 'Duo', title: 'Парные подписки' },
  { id: SUBSCRIPTION_TYPE_ID.family, label: 'Family', title: 'Семейные подписки' },
  { id: SUBSCRIPTION_TYPE_ID.platinum, label: 'Platinum', title: 'Платиновая подписка' },
  { id: SUBSCRIPTION_TYPE_ID.gift, label: 'Gift', title: 'Подарочные карты' },
]

export const CATALOG_GROUPS: CatalogGroup[] = [
  { id: CATALOG_GROUP_ID.individual, typeId: SUBSCRIPTION_TYPE_ID.individual, order: 1 },
  { id: CATALOG_GROUP_ID.duo, typeId: SUBSCRIPTION_TYPE_ID.duo, order: 2, noticeId: NOTICE_ID.duoLimit },
  { id: CATALOG_GROUP_ID.family, typeId: SUBSCRIPTION_TYPE_ID.family, order: 3, noticeId: NOTICE_ID.familyLimit },
  { id: CATALOG_GROUP_ID.platinum, typeId: SUBSCRIPTION_TYPE_ID.platinum, order: 4, noticeId: NOTICE_ID.platinumLimit },
  { id: CATALOG_GROUP_ID.giftCard, typeId: SUBSCRIPTION_TYPE_ID.gift, order: 1, noticeId: NOTICE_ID.giftCardsNotice },
]

export const CATALOG_GROUPINGS: CatalogGrouping[] = [
  { id: 'by-catalog-group', label: 'По группам каталога', source: 'groupId' },
  { id: 'by-type', label: 'По типу подписки', source: 'typeId' },
  { id: 'by-period', label: 'По периоду', source: 'periodId' },
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

const commonPrice = { amount: 263, currency: CURRENCY_RUB }
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
    tabId: TAB_ID.subscriptions,
    groupId: CATALOG_GROUP_ID.individual,
    typeId: SUBSCRIPTION_TYPE_ID.individual,
    periodId: PERIOD_ID.oneMonth,
    regionIds: allRegionIds,
    price: commonPrice,
    accent: PLAN_ACCENT.rose,
  },
  {
    id: 'individual-3-months',
    tabId: TAB_ID.subscriptions,
    groupId: CATALOG_GROUP_ID.individual,
    typeId: SUBSCRIPTION_TYPE_ID.individual,
    periodId: PERIOD_ID.threeMonths,
    regionIds: allRegionIds,
    price: commonPrice,
    accent: PLAN_ACCENT.rose,
  },
  {
    id: 'individual-6-months',
    tabId: TAB_ID.subscriptions,
    groupId: CATALOG_GROUP_ID.individual,
    typeId: SUBSCRIPTION_TYPE_ID.individual,
    periodId: PERIOD_ID.sixMonths,
    regionIds: allRegionIds,
    price: commonPrice,
    accent: PLAN_ACCENT.rose,
  },
  {
    id: 'individual-12-months',
    tabId: TAB_ID.subscriptions,
    groupId: CATALOG_GROUP_ID.individual,
    typeId: SUBSCRIPTION_TYPE_ID.individual,
    periodId: PERIOD_ID.twelveMonths,
    regionIds: allRegionIds,
    price: commonPrice,
    accent: PLAN_ACCENT.rose,
  },
  {
    id: 'duo-1-month',
    tabId: TAB_ID.subscriptions,
    groupId: CATALOG_GROUP_ID.duo,
    typeId: SUBSCRIPTION_TYPE_ID.duo,
    periodId: PERIOD_ID.oneMonth,
    regionIds: randomEgyptOrNigeriaRegionIds,
    price: commonPrice,
    accent: PLAN_ACCENT.amber,
  },
  {
    id: 'duo-3-months',
    tabId: TAB_ID.subscriptions,
    groupId: CATALOG_GROUP_ID.duo,
    typeId: SUBSCRIPTION_TYPE_ID.duo,
    periodId: PERIOD_ID.threeMonths,
    regionIds: randomEgyptOrNigeriaRegionIds,
    price: commonPrice,
    accent: PLAN_ACCENT.amber,
  },
  {
    id: 'duo-12-months',
    tabId: TAB_ID.subscriptions,
    groupId: CATALOG_GROUP_ID.duo,
    typeId: SUBSCRIPTION_TYPE_ID.duo,
    periodId: PERIOD_ID.twelveMonths,
    regionIds: randomEgyptOrNigeriaRegionIds,
    price: commonPrice,
    accent: PLAN_ACCENT.amber,
  },
  {
    id: 'family-6-months',
    tabId: TAB_ID.subscriptions,
    groupId: CATALOG_GROUP_ID.family,
    typeId: SUBSCRIPTION_TYPE_ID.family,
    periodId: PERIOD_ID.sixMonths,
    regionIds: randomEgyptOrNigeriaRegionIds,
    price: commonPrice,
    accent: PLAN_ACCENT.blue,
  },
  {
    id: 'platinum-6-months',
    tabId: TAB_ID.subscriptions,
    groupId: CATALOG_GROUP_ID.platinum,
    typeId: SUBSCRIPTION_TYPE_ID.platinum,
    periodId: PERIOD_ID.sixMonths,
    regionIds: [REGION_ID.india],
    price: commonPrice,
    accent: PLAN_ACCENT.lavender,
  },
  {
    id: 'gift-card-1-month',
    tabId: TAB_ID.giftCards,
    groupId: CATALOG_GROUP_ID.giftCard,
    typeId: SUBSCRIPTION_TYPE_ID.gift,
    periodId: PERIOD_ID.oneMonth,
    regionIds: allRegionIds,
    price: { amount: 500, currency: CURRENCY_RUB },
    accent: PLAN_ACCENT.amber,
  },
  {
    id: 'gift-card-3-months',
    tabId: TAB_ID.giftCards,
    groupId: CATALOG_GROUP_ID.giftCard,
    typeId: SUBSCRIPTION_TYPE_ID.gift,
    periodId: PERIOD_ID.threeMonths,
    regionIds: allRegionIds,
    price: { amount: 1200, currency: CURRENCY_RUB },
    accent: PLAN_ACCENT.rose,
  },
]

export const DEFAULT_SELECTED_PLAN_BY_GROUP_ID: Record<string, string> = {
  [CATALOG_GROUP_ID.duo]: 'duo-12-months',
}

export const CATALOG_MODEL: CatalogModel = {
  tabs: CATALOG_TABS,
  regions: REGIONS,
  periods: PERIODS,
  subscriptionTypes: SUBSCRIPTION_TYPES,
  groups: CATALOG_GROUPS,
  notices: CATALOG_NOTICES,
  plans: CATALOG_PLANS,
  groupings: CATALOG_GROUPINGS,
}
