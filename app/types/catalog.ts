export type CurrencyCode = string

export type CatalogTabKind = string

export type SubscriptionKind = string

export type CardState = 'available' | 'selected' | 'disabled'

export type PlanAccent = 'rose' | 'amber' | 'blue' | 'lavender'

export type CatalogGroupingSource = 'groupId' | 'typeId' | 'periodId'

export interface CatalogTab {
  id: string
  label: string
  kind: CatalogTabKind
}

export interface Region {
  id: string
  label: string
  flag: string
}

export interface Period {
  id: string
  label: string
  months: number
}

export interface SubscriptionType {
  id: SubscriptionKind
  label: string
  title: string
}

export interface Money {
  amount: number
  currency: CurrencyCode
}

export interface CatalogPlan {
  id: string
  tabId: string
  groupId: string
  typeId: SubscriptionKind
  periodId: string
  regionIds: string[]
  price: Money
  accent: PlanAccent
  disabled?: boolean
}

export interface CatalogNotice {
  id: string
  groupId: string
  text: string
  tone: 'success' | 'info'
}

export interface CatalogGroup {
  id: string
  typeId: SubscriptionKind
  order: number
  noticeId?: string
}

export interface CatalogGrouping {
  id: string
  label: string
  source: CatalogGroupingSource
}

export interface CatalogModel {
  tabs: CatalogTab[]
  regions: Region[]
  periods: Period[]
  subscriptionTypes: SubscriptionType[]
  groups: CatalogGroup[]
  notices: CatalogNotice[]
  plans: CatalogPlan[]
  groupings: CatalogGrouping[]
}

export interface PlanViewModel extends CatalogPlan {
  title: string
  subtitle: string
  periodLabel: string
  formattedPrice: string
  state: CardState
}

export interface CatalogVisibleGroup {
  id: string
  title: string
  notice?: CatalogNotice
  plans: PlanViewModel[]
}
