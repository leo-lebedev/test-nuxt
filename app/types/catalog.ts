import type {
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

export type CurrencyCode = typeof CURRENCY_CODE[keyof typeof CURRENCY_CODE]

export type CatalogTabKind = typeof CATALOG_TAB_KIND[keyof typeof CATALOG_TAB_KIND]

export type TabId = typeof TAB_ID[keyof typeof TAB_ID]

export type RegionId = typeof REGION_ID[keyof typeof REGION_ID]

export type PeriodId = typeof PERIOD_ID[keyof typeof PERIOD_ID]

export type SubscriptionTypeId = typeof SUBSCRIPTION_TYPE_ID[keyof typeof SUBSCRIPTION_TYPE_ID]

export type CatalogGroupId = typeof CATALOG_GROUP_ID[keyof typeof CATALOG_GROUP_ID]

export type BrandId = typeof BRAND_ID[keyof typeof BRAND_ID]

export type NoticeId = typeof NOTICE_ID[keyof typeof NOTICE_ID]

export type CardState = typeof CARD_STATE[keyof typeof CARD_STATE]

export type CatalogPlanStateFlag = CardState

export type PlanAccent = typeof PLAN_ACCENT[keyof typeof PLAN_ACCENT]

export type CatalogPlanId = string

export interface CatalogTab {
  id: TabId
  label: string
  kind: CatalogTabKind
}

export interface Region {
  id: RegionId
  label: string
  flagUrl: string
}

export interface Period {
  id: PeriodId
  label: string
  months: number
  order: number
}

export interface SubscriptionType {
  id: SubscriptionTypeId
  label: string
  title: string
  order: number
}

export interface Brand {
  id: BrandId
  label: string
  title: string
  logoUrl: string
  order: number
}

export type CatalogDictionaryItem = CatalogGroup | Period | SubscriptionType | Brand

export interface Money {
  amount: number
  currency: CurrencyCode
}

export interface CatalogGroupableAttributes {
  group: CatalogGroupId
  type: SubscriptionTypeId
  period: PeriodId
  brand: BrandId
}

export interface CatalogPlanAttributes extends CatalogGroupableAttributes {
  tab: TabId
  regionIds: readonly RegionId[]
  accent: PlanAccent
  displayOrder?: number
  labelOverride?: string
  stateFlags?: readonly CatalogPlanStateFlag[]
}

export interface CatalogPlan {
  id: CatalogPlanId
  attributes: CatalogPlanAttributes
  price: Money
}

export interface CatalogNotice {
  id: NoticeId
  groupId: CatalogGroupId
  text: string
  tone: 'success' | 'info'
}

export interface CatalogGroup {
  id: CatalogGroupId
  label: string
  title: string
  order: number
  noticeId?: NoticeId
}

export type GroupableAttributeKey = keyof CatalogGroupableAttributes

export interface CatalogGrouping {
  id: string
  label: string
  source: GroupableAttributeKey
  dictionary: CatalogDictionaryName
  noticeDictionary?: CatalogDictionaryName
}

export interface CatalogCardStateContext {
  plan: CatalogPlan
  visibleGroupId: string
  selectedPlanId?: string
  selectedRegionId: RegionId
  isRegionAvailable: boolean
}

export interface CatalogCardStateRule {
  state: CardState
  priority: number
  matches: (context: CatalogCardStateContext) => boolean
}

export interface CatalogModel {
  tabs: CatalogTab[]
  regions: Region[]
  periods: Period[]
  subscriptionTypes: SubscriptionType[]
  groups: CatalogGroup[]
  brands: Brand[]
  notices: CatalogNotice[]
  plans: CatalogPlan[]
  groupings: CatalogGrouping[]
}

export type CatalogDictionaryName = {
  [Key in keyof CatalogModel]: CatalogModel[Key] extends CatalogDictionaryItem[] ? Key : never
}[keyof CatalogModel]

export interface PlanViewModel extends CatalogPlan {
  title: string
  subtitle: string
  periodLabel: string
  formattedPrice: string
  brandLogoUrl: string
  state: CardState
}

export interface CatalogVisibleGroup {
  id: string
  title: string
  notice?: CatalogNotice
  plans: PlanViewModel[]
}
