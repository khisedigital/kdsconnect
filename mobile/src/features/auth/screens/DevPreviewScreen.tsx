import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import type {AuthStackParamList} from '../../../app/navigation/types';
import {Button} from '../../../components/ui/Button';
import {Card} from '../../../components/ui/Card';
import {Header} from '../../../components/ui/Header';
import {Screen} from '../../../components/ui/Screen';
import {Text} from '../../../components/ui/Text';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import type {UserRole} from '../../../types';
import {useAuth} from '../AuthContext';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'DevPreview'>;

export function DevPreviewScreen() {
  const navigation = useNavigation<Nav>();
  const {enterDevPreview} = useAuth();
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectRole = async (role: UserRole) => {
    setError(null);
    setLoadingRole(role);
    try {
      await enterDevPreview(role);
    } catch {
      setError('Could not start dev preview session.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <Header
        title="Development preview"
        left={
          <Text
            variant="label"
            color="accent"
            onPress={() => navigation.goBack()}
            accessibilityRole="button">
            Back
          </Text>
        }
      />

      <Card padding="lg" style={styles.warningCard}>
        <Text variant="label" color="warning">
          LABELED DEV ONLY
        </Text>
        <Text variant="bodySmall" color="secondary" style={styles.warningBody}>
          Fixture sessions only. Not production authentication.
        </Text>
      </Card>

      <Text variant="body" color="secondary" style={styles.lead}>
        Pick a role to explore navigation and sample data.
      </Text>

      <View style={styles.actions}>
        <Button
          title="Preview as retailer"
          variant="secondary"
          fullWidth
          loading={loadingRole === 'retailer'}
          disabled={loadingRole !== null && loadingRole !== 'retailer'}
          onPress={() => void selectRole('retailer')}
        />
        <Button
          title="Preview as supplier / wholesaler"
          variant="primary"
          fullWidth
          loading={loadingRole === 'supplier'}
          disabled={loadingRole !== null && loadingRole !== 'supplier'}
          onPress={() => void selectRole('supplier')}
        />
        <Button
          title="Preview as sales"
          variant="secondary"
          fullWidth
          loading={loadingRole === 'sales'}
          disabled={loadingRole !== null && loadingRole !== 'sales'}
          onPress={() => void selectRole('sales')}
        />
        <Button
          title="Preview as admin"
          variant="outline"
          fullWidth
          loading={loadingRole === 'admin'}
          disabled={loadingRole !== null && loadingRole !== 'admin'}
          onPress={() => void selectRole('admin')}
        />
      </View>

      {error ? (
        <Text variant="bodySmall" color="error" align="center">
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 0,
    gap: spacing[4],
    paddingBottom: spacing[8],
  },
  warningCard: {
    marginHorizontal: spacing.screenPaddingHorizontal,
    borderColor: colors.semantic.warning,
    backgroundColor: colors.statusBadge.warning.background,
    gap: spacing[2],
  },
  warningBody: {
    marginTop: spacing[1],
  },
  lead: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  actions: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    gap: spacing[3],
  },
});
