import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {elevation} from '../../theme/elevation';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Icon} from './Icon';
import {TextInput, TextInputProps} from './TextInput';

export interface SearchBarProps extends Omit<TextInputProps, 'leftAdornment'> {
  onFilterPress?: () => void;
}

export function SearchBar({
  placeholder = 'Search products, orders…',
  onFilterPress,
  style,
  ...rest
}: SearchBarProps) {
  return (
    <View style={[styles.container, elevation[1]]}>
      <TextInput
        leftAdornment={<Icon name="search" color="secondary" size={18} />}
        placeholder={placeholder}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        style={[styles.input, style]}
        {...rest}
      />
      {onFilterPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter"
          onPress={onFilterPress}
          style={({pressed}) => [
            styles.filterButton,
            pressed && styles.filterPressed,
          ]}>
          <Icon name="filter" color="primary" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[1],
  },
  input: {
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  filterPressed: {
    opacity: 0.85,
  },
});
