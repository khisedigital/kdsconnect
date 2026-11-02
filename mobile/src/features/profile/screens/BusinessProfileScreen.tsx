import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {
  RetailerStackParamList,
  SupplierStackParamList,
} from '../../../app/navigation/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  LoadingState,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import type {BusinessProfile} from '../../../types';
import {useAuth} from '../../auth/AuthContext';

type Props =
  | NativeStackScreenProps<RetailerStackParamList, 'BusinessProfile'>
  | NativeStackScreenProps<SupplierStackParamList, 'BusinessProfile'>;

export function BusinessProfileScreen({navigation}: Props) {
  const {user} = useAuth();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAppApi().profile.getProfile();
        if (!cancelled) {
          setProfile(data);
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Screen backgroundColor={colors.background}>
        <SubpageHero
          title="Business profile"
          kicker="Account"
          icon="building"
          onBack={() => navigation.goBack()}
        />
        <LoadingState message="Loading profile…" />
      </Screen>
    );
  }

  if (!profile && !user) {
    return (
      <Screen backgroundColor={colors.background} scroll>
        <SubpageHero
          title="Business profile"
          kicker="Account"
          icon="building"
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          title="Profile unavailable"
          description="Business profile requires a confirmed profile API contract."
          action={{label: 'Go back', onPress: () => navigation.goBack()}}
        />
      </Screen>
    );
  }

  const businessName = profile?.businessName ?? user?.businessName ?? 'Your business';
  const email = profile?.contactEmail ?? user?.email ?? '—';
  const phone = profile?.contactPhone ?? 'Not provided';
  const taxId = profile?.taxId ?? 'Not provided';
  const role = profile?.role ?? user?.role ?? 'retailer';

  return (
    <Screen scroll backgroundColor={colors.background}>
      <SubpageHero
        title="Business profile"
        kicker="Account"
        description="Company identity used across RFQs, quotations, and orders."
        icon="building"
        onBack={() => navigation.goBack()}
      />

      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Showing development profile data when fixtures are enabled
        </Text>
      ) : null}

      <Card style={styles.card}>
        <View style={styles.identity}>
          <View style={styles.mark}>
            <Icon name="building" color="inverse" size={22} />
          </View>
          <View style={styles.flex}>
            <Text variant="h2">{businessName}</Text>
            <Badge label={role} variant="info" />
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text variant="label" style={styles.sectionLabel}>
          Contact
        </Text>
        <InfoRow icon="account" label="Primary contact" value={user?.displayName ?? '—'} />
        <InfoRow icon="envelope" label="Email" value={email} />
        <InfoRow icon="phone" label="Phone" value={phone} />
      </Card>

      <Card style={styles.card}>
        <Text variant="label" style={styles.sectionLabel}>
          Compliance
        </Text>
        <InfoRow icon="shield" label="Tax / GST ID" value={taxId} />
        {profile?.billingAddress ? (
          <InfoRow
            icon="mapMarker"
            label="Billing address"
            value={`${profile.billingAddress.line1}, ${profile.billingAddress.city}`}
          />
        ) : (
          <InfoRow
            icon="mapMarker"
            label="Billing address"
            value="Add once profile API supports billing details"
          />
        )}
      </Card>

      <Button
        title="Request profile update"
        variant="secondary"
        fullWidth
        onPress={() =>
          Alert.alert(
            'Backend required',
            'Profile edits will be available after the profile update contract is confirmed.',
          )
        }
      />
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: 'account' | 'envelope' | 'phone' | 'shield' | 'mapMarker';
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Icon name={icon} color="primary" size={16} />
      </View>
      <View style={styles.flex}>
        <Text variant="caption" color="secondary">
          {label}
        </Text>
        <Text variant="body">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dev: {marginBottom: spacing[3]},
  card: {marginBottom: spacing[3], gap: spacing[3]},
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  mark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {flex: 1, gap: spacing[2]},
  sectionLabel: {marginBottom: spacing[1]},
  infoRow: {
    flexDirection: 'row',
    gap: spacing[3],
    alignItems: 'flex-start',
    paddingVertical: spacing[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
