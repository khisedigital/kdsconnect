import React from 'react';
import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';

import {TextInput, TextInputProps} from '../ui/TextInput';

export interface FormTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'error'> {
  control: Control<TFieldValues>;
  name: TName;
  rules?: RegisterOptions<TFieldValues, TName>;
}

export function FormTextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  rules,
  ...rest
}: FormTextFieldProps<TFieldValues, TName>) {
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
      {...rest}
    />
  );
}
