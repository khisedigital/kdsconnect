import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {colors} from '../../theme/colors';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {elevation} from '../../theme/elevation';
import {Icon} from './Icon';
import {Text} from './Text';

export interface BottomSheetProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({visible, title, onClose, children}: BottomSheetProps) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close sheet" />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            {title ? (
              <Text variant="h3" style={styles.title}>
                {title}
              </Text>
            ) : (
              <View style={styles.titleSpacer} />
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}>
              <Icon name="close" color="secondary" />
            </Pressable>
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingBottom: spacing[6],
    maxHeight: '85%',
    ...elevation[3],
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.border,
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  title: {
    flex: 1,
  },
  titleSpacer: {
    flex: 1,
  },
  closeButton: {
    padding: spacing[1],
  },
  content: {
    paddingHorizontal: spacing[4],
  },
});
