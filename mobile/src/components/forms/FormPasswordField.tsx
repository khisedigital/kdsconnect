import React, {useState} from 'react';
import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import {Pressable, StyleSheet} from 'react-native';

import {TextInput, TextInputProps} from '../ui/TextInput';
import {Text} from '../ui/Text';

export interface FormPasswordFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Omit<
    TextInputProps,
    'value' | 'onChangeText' | 'onBlur' | 'error' | 'secureTextEntry'
  > {
  control: Control<TFieldValues>;
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
}

export function FormPasswordField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  rules,
  ...rest
}: FormPasswordFieldProps<TFieldValues, TName>) {
  const [visible, setVisible] = useState(false);
  const {
    field: {value, onChange, onBlur},
    fieldState: {error},
  } = useController({control, name, rules});

  return (
    <TextInput
      value={value == null ? '' : String(value)}
      onChangeText={onChange}
      onBlur={onBlur}
      error={error?.message}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      rightAdornment={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          hitSlop={8}
          onPress={() => setVisible(current => !current)}
          style={styles.toggle}>
          <Text variant="caption" color="primary">
            {visible ? 'Hide' : 'Show'}
          </Text>
        </Pressable>
      }
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  toggle: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});
