import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {
  AdminStackParamList,
  RetailerStackParamList,
  SalesStackParamList,
  SupplierStackParamList,
} from '../../../app/navigation/types';
import {
  Button,
  Card,
  Icon,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {colors} from '../../../theme/colors';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import {useAuth} from '../../auth/AuthContext';

type Props =
  | NativeStackScreenProps<RetailerStackParamList, 'Privacy'>
  | NativeStackScreenProps<SupplierStackParamList, 'Privacy'>
  | NativeStackScreenProps<SalesStackParamList, 'Privacy'>
  | NativeStackScreenProps<AdminStackParamList, 'Privacy'>;

export function PrivacySecurityScreen({navigation}: Props) {
  const {user, signOut} = useAuth();

  return (
    <Screen scroll backgroundColor={colors.background}>
      <SubpageHero
        title="Privacy & security"
        kicker="Trust"
        description="How KDS Connect protects session data on this device."
        icon="shield"
        tone="deep"
        onBack={() => navigation.goBack()}
      />

      <Card style={styles.card}>
        <SecurityRow
          icon="shield"
          title="Secure token storage"
          body="Access tokens are stored in the platform Keychain / Keystore — never in AsyncStorage or Redux persistence."
        />
        <SecurityRow
          icon="lock"
          title="Encrypted transport"
          body="Production API traffic uses HTTPS. TLS validation is never disabled in the mobile client."
        />
        <SecurityRow
          icon="account"
          title="Active session"
          body={
            user
              ? `Signed in as ${user.email}. Client navigation is for usability only; the backend remains authoritative.`
              : 'No active authenticated session on this device.'
          }
          last
        />
      </Card>

      <Card style={styles.card}>
        <Text variant="label" style={styles.sectionLabel}>
          Data controls
        </Text>
        <Text variant="bodySmall" color="secondary" style={styles.copy}>
          Clearing the local session removes tokens from secure storage on this
          device. Server-side revocation still depends on the logout API
          contract.
        </Text>
        <Button
          title="Sign out on this device"
          variant="outline"
          fullWidth
          onPress={() => {
            Alert.alert(
              'Sign out?',
              'This clears the local secure session on this device.',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Sign out',
                  style: 'destructive',
                  onPress: () => {
                    void signOut();
                  },
                },
              ],
            );
          }}
        />
      </Card>
    </Screen>
  );
}

function SecurityRow({
  icon,
  title,
  body,
  last,
}: {
  icon: 'shield' | 'lock' | 'account';
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.iconWrap}>
        <Icon name={icon} color="primary" size={16} />
      </View>
      <View style={styles.flex}>
        <Text variant="h3">{title}</Text>
        <Text variant="bodySmall" color="secondary">
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: spacing[3], gap: spacing[2]},
  sectionLabel: {marginBottom: spacing[1]},
  copy: {marginBottom: spacing[3], lineHeight: 22},
  row: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingVertical: spacing[3],
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {flex: 1, gap: spacing[1]},
});
