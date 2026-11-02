import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Button,
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
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import type {DeliveryAddress} from '../../../types';

type Props = NativeStackScreenProps<RetailerStackParamList, 'Addresses'>;

export function AddressesScreen({navigation}: Props) {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const profile = await getAppApi().profile.getProfile();
        if (!cancelled) {
          setAddresses(profile.deliveryAddresses);
        }
      } catch {
        if (!cancelled) {
          setAddresses([]);
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

  return (
    <Screen
      edges={['top', 'left', 'right']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.inner}>
      <FlatList
        data={loading ? [] : addresses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <SubpageHero
              title="Delivery addresses"
              kicker="Fulfilment"
              description="Ship-to locations used when confirming wholesale orders."
              icon="mapMarker"
              tone="copper"
              onBack={() => navigation.goBack()}
            />
            {appConfig.enableDevPreview ? (
              <Text variant="caption" color="warning" style={styles.dev}>
                Development fixtures may populate saved addresses
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <LoadingState message="Loading addresses…" />
          ) : (
            <EmptyState
              title="No addresses saved"
              description="Add a warehouse or store location once the profile API supports address management."
            />
          )
        }
        ListFooterComponent={
          loading
            ? undefined
            : (
              <Button
                title="Add delivery address"
                fullWidth
                size="lg"
                style={styles.addBtn}
                onPress={() =>
                  Alert.alert(
                    'Backend required',
                    'Creating addresses will be enabled after the profile address contract is confirmed.',
                  )
                }
              />
            )
        }
        renderItem={({item}) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert(
                item.label,
                'Address editing requires a confirmed backend contract.',
              )
            }
            style={({pressed}) => [
              styles.card,
              pressed && styles.pressed,
            ]}>
            <View style={styles.cardIcon}>
              <Icon name="mapMarker" color="accent" size={18} />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <Text variant="h3" style={styles.flex}>
                  {item.label}
                </Text>
                {item.isDefault ? (
                  <Badge label="Default" variant="success" />
                ) : null}
              </View>
              <Text variant="bodySmall" color="secondary">
                {item.line1}
                {item.line2 ? `, ${item.line2}` : ''}
              </Text>
              <Text variant="caption" color="secondary">
                {item.city}
                {item.state ? `, ${item.state}` : ''} {item.postalCode}
              </Text>
              <Text variant="caption" color="tertiary">
                {item.country}
              </Text>
            </View>
            <Icon name="chevronRight" color="secondary" size={14} />
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: {flex: 1, paddingHorizontal: 0, paddingVertical: 0},
  list: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
    gap: spacing[3],
    flexGrow: 1,
  },
  dev: {marginBottom: spacing[3]},
  card: {
    ...cardShellElevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
  },
  pressed: {opacity: 0.94},
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {flex: 1, gap: 2},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  flex: {flex: 1},
  addBtn: {marginTop: spacing[2]},
});
