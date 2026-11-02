import * as Keychain from 'react-native-keychain';

const TOKEN_SERVICE = 'com.khisedigital.kdsconnect.auth.tokens';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export async function setTokens(tokens: StoredTokens): Promise<void> {
  const result = await Keychain.setGenericPassword(
    tokens.accessToken,
    tokens.refreshToken,
    {
      service: TOKEN_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    },
  );
  if (result === false) {
    throw new Error('Failed to store credentials in secure storage');
  }
}

export async function getTokens(): Promise<StoredTokens | null> {
  const credentials = await Keychain.getGenericPassword({
    service: TOKEN_SERVICE,
  });
  if (credentials === false) {
    return null;
  }
  return {
    accessToken: credentials.username,
    refreshToken: credentials.password,
  };
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
}
