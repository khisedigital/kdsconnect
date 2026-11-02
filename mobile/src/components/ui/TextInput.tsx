import React, {useState} from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
} from 'react-native';

import {colors} from '../../theme/colors';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {fontSizes, typography} from '../../theme/typography';
import {Text} from './Text';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
}

export function TextInput({
  label,
  error,
  hint,
  leftAdornment,
  rightAdornment,
  secureTextEntry,
  editable = true,
  multiline = false,
  style,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const isDisabled = editable === false;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="label" color="primary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputRow,
          multiline && styles.inputRowMultiline,
          focused && styles.inputRowFocused,
          hasError && styles.inputRowError,
          isDisabled && styles.inputRowDisabled,
        ]}>
        {leftAdornment ? (
          <View style={styles.adornment}>{leftAdornment}</View>
        ) : null}
        <RNTextInput
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{disabled: isDisabled}}
          editable={editable}
          multiline={multiline}
          placeholderTextColor={colors.text.disabled}
          secureTextEntry={secureTextEntry}
          style={[styles.input, multiline && styles.inputMultiline, style]}
          textAlignVertical={multiline ? 'top' : undefined}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          {...rest}
        />
        {rightAdornment ? (
          <View style={styles.adornment}>{rightAdornment}</View>
        ) : null}
      </View>
      {hasError ? (
        <Text variant="caption" color="error" style={styles.feedback}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="secondary" style={styles.feedback}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: spacing[1],
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    minHeight: 96,
    paddingVertical: spacing[2],
  },
  inputMultiline: {
    minHeight: 72,
    paddingTop: spacing[1],
    paddingBottom: spacing[1],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing[3],
  },
  inputRowFocused: {
    borderColor: colors.borderFocus,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[3] - 0.5,
  },
  inputRowError: {
    borderColor: colors.semantic.error,
  },
  inputRowDisabled: {
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    paddingVertical: spacing[2],
    fontSize: fontSizes.md,
    fontWeight: typography.fontWeights.regular,
    color: colors.text.primary,
  },
  adornment: {
    marginHorizontal: spacing[1],
  },
  feedback: {
    marginTop: spacing[1],
  },
});
