import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, Switch, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {
  AdminStackParamList,
  RetailerStackParamList,
  SalesStackParamList,
  SupplierStackParamList,
} from '../../../app/navigation/types';
import {
  Card,
  Icon,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {colors} from '../../../theme/colors';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';

type Props =
  | NativeStackScreenProps<RetailerStackParamList, 'Preferences'>
  | NativeStackScreenProps<SupplierStackParamList, 'Preferences'>
  | NativeStackScreenProps<SalesStackParamList, 'Preferences'>
  | NativeStackScreenProps<AdminStackParamList, 'Preferences'>;

export function PreferencesScreen({navigation}: Props) {
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [rfqAlerts, setRfqAlerts] = useState(true);
  const [groupBuyAlerts, setGroupBuyAlerts] = useState(true);

  const showBackendNotice = () => {
    Alert.alert(
      'Preference sync pending',
      'These controls are local for now. Syncing requires confirmed notification preference endpoints.',
    );
  };

  return (
    <Screen scroll backgroundColor={colors.background}>
      <SubpageHero
        title="Preferences"
        kicker="Settings"
        description="Control alerts and review the app environment for this device."
        icon="preferences"
        onBack={() => navigation.goBack()}
      />

      <Text variant="label" style={styles.sectionTitle}>
        Notifications
      </Text>
      <Card style={styles.card}>
        <ToggleRow
          icon="truck"
          title="Order updates"
          subtitle="Status changes and delivery milestones"
          value={orderAlerts}
          onChange={next => {
            setOrderAlerts(next);
            showBackendNotice();
          }}
        />
        <ToggleRow
          icon="quote"
          title="RFQ & quotations"
          subtitle="New quotes and RFQ responses"
          value={rfqAlerts}
          onChange={next => {
            setRfqAlerts(next);
            showBackendNotice();
          }}
        />
        <ToggleRow
          icon="group"
          title="Group buy campaigns"
          subtitle="Progress and threshold alerts"
          value={groupBuyAlerts}
          onChange={next => {
            setGroupBuyAlerts(next);
            showBackendNotice();
          }}
          last
        />
      </Card>

      <Text variant="label" style={styles.sectionTitle}>
        App environment
      </Text>
      <Card style={styles.card}>
        <InfoRow label="Environment" value={appConfig.environment} />
        <InfoRow
          label="Development preview"
          value={appConfig.enableDevPreview ? 'Enabled (__DEV__ only)' : 'Disabled'}
        />
        <InfoRow label="API base URL" value={appConfig.apiBaseUrl} last />
      </Card>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          // Shared screen is registered on both retailer and supplier stacks.
          (navigation as {navigate: (route: 'Privacy') => void}).navigate(
            'Privacy',
          );
        }}
        style={({pressed}) => [styles.linkCard, pressed && styles.pressed]}>
        <View style={styles.linkIcon}>
          <Icon name="shield" color="primary" size={18} />
        </View>
        <View style={styles.flex}>
          <Text variant="h3">Privacy & security</Text>
          <Text variant="caption" color="secondary">
            Session handling and data controls
          </Text>
        </View>
        <Icon name="chevronRight" color="secondary" size={14} />
      </Pressable>
    </Screen>
  );
}

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onChange,
  last,
}: {
  icon: 'truck' | 'quote' | 'group';
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (next: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.toggleRow, !last && styles.rowBorder]}>
      <View style={styles.toggleIcon}>
        <Icon name={icon} color="primary" size={16} />
      </View>
      <View style={styles.flex}>
        <Text variant="h3">{title}</Text>
        <Text variant="caption" color="secondary">
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{false: colors.border, true: colors.primaryMuted}}
        thumbColor={colors.surface}
      />
    </View>
  );
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && styles.rowBorder]}>
      <Text variant="caption" color="secondary">
        {label}
      </Text>
      <Text variant="bodySmall">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: spacing[2],
    marginTop: spacing[2],
  },
  card: {
    marginBottom: spacing[3],
    paddingVertical: spacing[1],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {flex: 1, gap: 2},
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoRow: {
    gap: spacing[1],
    paddingVertical: spacing[3],
  },
  linkCard: {
    ...cardShellElevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    marginTop: spacing[2],
  },
  pressed: {opacity: 0.94},
  linkIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
