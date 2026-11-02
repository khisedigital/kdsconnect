/**
 * App icon names mapped to Font Awesome 5 Solid glyph names.
 * Rendered by `src/components/ui/Icon.tsx` via react-native-vector-icons.
 */
export type IconName =
  | 'home'
  | 'products'
  | 'cart'
  | 'orders'
  | 'account'
  | 'search'
  | 'filter'
  | 'chevron'
  | 'chevronRight'
  | 'chevronLeft'
  | 'chevronDown'
  | 'chevronUp'
  | 'check'
  | 'close'
  | 'alert'
  | 'package'
  | 'quote'
  | 'group'
  | 'bell'
  | 'plus'
  | 'minus'
  | 'building'
  | 'mapMarker'
  | 'support'
  | 'preferences'
  | 'shield'
  | 'idCard'
  | 'camera'
  | 'truck'
  | 'calendar'
  | 'percentage'
  | 'clock'
  | 'lock'
  | 'envelope'
  | 'book'
  | 'phone';

export interface IconDefinition {
  /** Font Awesome 5 Solid icon name */
  fa: string;
  label: string;
}

export const icons: Record<IconName, IconDefinition> = {
  home: {fa: 'home', label: 'Home'},
  products: {fa: 'th-large', label: 'Products'},
  cart: {fa: 'shopping-cart', label: 'Cart'},
  orders: {fa: 'clipboard-list', label: 'Orders'},
  account: {fa: 'user-circle', label: 'Account'},
  search: {fa: 'search', label: 'Search'},
  filter: {fa: 'sliders-h', label: 'Filter'},
  chevron: {fa: 'chevron-right', label: 'Chevron'},
  chevronRight: {fa: 'chevron-right', label: 'Chevron right'},
  chevronLeft: {fa: 'chevron-left', label: 'Chevron left'},
  chevronDown: {fa: 'chevron-down', label: 'Chevron down'},
  chevronUp: {fa: 'chevron-up', label: 'Chevron up'},
  check: {fa: 'check', label: 'Check'},
  close: {fa: 'times', label: 'Close'},
  alert: {fa: 'exclamation-triangle', label: 'Alert'},
  package: {fa: 'box', label: 'Package'},
  quote: {fa: 'file-invoice-dollar', label: 'Quote'},
  group: {fa: 'users', label: 'Group'},
  bell: {fa: 'bell', label: 'Notifications'},
  plus: {fa: 'plus', label: 'Add'},
  minus: {fa: 'minus', label: 'Remove'},
  building: {fa: 'building', label: 'Business'},
  mapMarker: {fa: 'map-marker-alt', label: 'Address'},
  support: {fa: 'headset', label: 'Support'},
  preferences: {fa: 'cog', label: 'Preferences'},
  shield: {fa: 'shield-alt', label: 'Privacy'},
  idCard: {fa: 'id-card', label: 'KYC'},
  camera: {fa: 'camera', label: 'Camera'},
  truck: {fa: 'truck', label: 'Shipping'},
  calendar: {fa: 'calendar-alt', label: 'Calendar'},
  percentage: {fa: 'percent', label: 'Discount'},
  clock: {fa: 'clock', label: 'Time'},
  lock: {fa: 'lock', label: 'Security'},
  envelope: {fa: 'envelope', label: 'Email'},
  book: {fa: 'book', label: 'Guide'},
  phone: {fa: 'phone', label: 'Phone'},
};
