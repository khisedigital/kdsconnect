import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import {
  Edge,
  SafeAreaView,
} from 'react-native-safe-area-context';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export interface ScreenProps extends ViewProps {
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  edges?: Edge[];
  backgroundColor?: string;
  contentContainerStyle?: ViewProps['style'];
  children: React.ReactNode;
}

export function Screen({
  scroll = false,
  keyboardAvoiding = false,
  edges = ['top', 'bottom', 'left', 'right'],
  backgroundColor = colors.background,
  style,
  contentContainerStyle,
  children,
  ...rest
}: ScreenProps) {
  const inner = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentContainerStyle]}>{children}</View>
  );

  const body = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.screen, {backgroundColor}, style]}
      {...rest}>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.screenPaddingVertical,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.screenPaddingVertical,
  },
});
