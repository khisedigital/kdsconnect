import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {elevation} from '../../theme/elevation';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Text} from '../ui/Text';

export type ToastType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  durationMs?: number;
}

interface ToastState extends Required<Omit<ToastOptions, 'type'>> {
  type: ToastType;
  visible: boolean;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastPalette: Record<
  ToastType,
  {background: string; text: 'inverse' | 'primary'}
> = {
  success: {background: colors.semantic.success, text: 'inverse'},
  warning: {background: colors.semantic.warning, text: 'inverse'},
  error: {background: colors.semantic.error, text: 'inverse'},
  info: {background: colors.semantic.info, text: 'inverse'},
  neutral: {background: colors.text.primary, text: 'inverse'},
};

const DEFAULT_DURATION = 3000;

export function ToastProvider({children}: {children: React.ReactNode}) {
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'neutral',
    durationMs: DEFAULT_DURATION,
    visible: false,
  });

  const hide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        setToast(prev => ({...prev, visible: false}));
      }
    });
  }, [opacity]);

  const show = useCallback(
    ({message, type = 'neutral', durationMs = DEFAULT_DURATION}: ToastOptions) => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      setToast({message, type, durationMs, visible: true});
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      hideTimerRef.current = setTimeout(hide, durationMs);
    },
    [hide, opacity],
  );

  const value = useMemo(() => ({show, hide}), [hide, show]);
  const palette = toastPalette[toast.type];

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast.visible ? (
        <View pointerEvents="box-none" style={styles.host}>
          <Animated.View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={[
              styles.toast,
              {backgroundColor: palette.background, opacity},
              elevation[2],
            ]}>
            <Text variant="bodySmall" color={palette.text} align="center">
              {toast.message}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  toast: {
    maxWidth: 480,
    width: '100%',
    borderRadius: radii.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
});
