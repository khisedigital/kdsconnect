import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '../../components/ui/Button';
import { Header } from '../../components/ui/Header';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';
import { spacing } from '../../theme/spacing';

export interface FeaturePlaceholderScreenProps {
  title: string;
  featureModule: string;
}

export function FeaturePlaceholderScreen({ title, featureModule }: FeaturePlaceholderScreenProps) {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <Header
        title={title}
        left={
          navigation.canGoBack() ? (
            <Text
              variant="label"
              color="accent"
              onPress={() => navigation.goBack()}
              accessibilityRole="button">
              Back
            </Text>
          ) : undefined
        }
      />
      <Text variant="body" color="secondary">
        {featureModule} content is loading from feature modules. This route is wired in navigation
        so deep links and flows compile end-to-end.
      </Text>
      <Text variant="caption" color="secondary" style={styles.route}>
        Route: {route.name}
      </Text>
      {navigation.canGoBack() ? (
        <Button title="Go back" variant="secondary" onPress={() => navigation.goBack()} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[4],
    paddingBottom: spacing[8],
  },
  route: {
    marginTop: spacing[2],
  },
});
