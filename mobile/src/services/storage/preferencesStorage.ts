import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  onboardingCompleted: '@kdsconnect/prefs/onboardingCompleted',
  lastRolePreview: '@kdsconnect/prefs/lastRolePreview',
} as const;

export type LastRolePreview = 'retailer' | 'supplier' | 'sales' | 'admin';

const ROLE_PREVIEW_VALUES: LastRolePreview[] = [
  'retailer',
  'supplier',
  'sales',
  'admin',
];

export async function getOnboardingCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.onboardingCompleted);
  return value === 'true';
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.onboardingCompleted, completed ? 'true' : 'false');
}

export async function getLastRolePreview(): Promise<LastRolePreview | null> {
  const value = await AsyncStorage.getItem(KEYS.lastRolePreview);
  if (value && ROLE_PREVIEW_VALUES.includes(value as LastRolePreview)) {
    return value as LastRolePreview;
  }
  return null;
}

export async function setLastRolePreview(role: LastRolePreview): Promise<void> {
  await AsyncStorage.setItem(KEYS.lastRolePreview, role);
}

export async function clearPreferences(): Promise<void> {
  await AsyncStorage.removeMany([KEYS.onboardingCompleted, KEYS.lastRolePreview]);
}
