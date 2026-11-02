import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {elevation} from '../../theme/elevation';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Button} from './Button';
import {Text} from './Text';

export interface DialogProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function Dialog({
  visible,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} accessibilityLabel="Dismiss dialog" />
        <View style={styles.dialog} accessibilityViewIsModal>
          <Text variant="h3">{title}</Text>
          {description ? (
            <Text variant="bodySmall" color="secondary" style={styles.description}>
              {description}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button
              title={cancelLabel}
              variant="outline"
              onPress={onCancel}
              disabled={loading}
              style={styles.actionButton}
            />
            <Button
              title={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing[5],
    ...elevation[3],
  },
  description: {
    marginTop: spacing[2],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2],
    marginTop: spacing[5],
  },
  actionButton: {
    flex: 1,
  },
});
