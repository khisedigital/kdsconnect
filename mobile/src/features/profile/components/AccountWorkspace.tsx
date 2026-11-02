import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Avatar} from '../../../components/ui/Avatar';
import {Button} from '../../../components/ui/Button';
import {Dialog} from '../../../components/ui/Dialog';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Icon} from '../../../components/ui/Icon';
import {Screen} from '../../../components/ui/Screen';
import {TabPageHeader} from '../../../components/ui/TabPageHeader';
import {Text} from '../../../components/ui/Text';
import {colors} from '../../../theme/colors';
import {elevation} from '../../../theme/elevation';
import type {IconName} from '../../../theme/icons';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import {useAuth} from '../../auth/AuthContext';

export interface AccountMenuItem {
  key: string;
  title: string;
  subtitle: string;
  icon: IconName;
  tone: 'teal' | 'copper' | 'mist';
  onPress: () => void;
}

export interface AccountWorkspaceProps {
  kicker?: string;
  description?: string;
  menu: AccountMenuItem[];
  signOutDescription?: string;
}

const toneBg = {
  teal: colors.primarySoft,
  copper: colors.accentSoft,
  mist: colors.surfaceMuted,
} as const;

/**
 * Shared account chrome for every role — same hero, menu card, and sign-out.
 */
export function AccountWorkspace({
  kicker = 'Your workspace',
  description,
  menu,
  signOutDescription = 'You will need to authenticate again to continue.',
}: AccountWorkspaceProps) {
  const insets = useSafeAreaInsets();
  const {user, signOut} = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const handleSignOut = async () => {
    setConfirmSignOut(false);
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Screen
      scroll
      backgroundColor={colors.background}
      edges={['left', 'right', 'bottom']}
      contentContainerStyle={[
        styles.content,
        {paddingTop: insets.top + spacing[2]},
      ]}>
      <TabPageHeader
        kicker={kicker}
        title="Account"
        description={description}
      />

      <FadeIn delay={80}>
        <View style={[styles.profileHero, elevation[2]]}>
          <View style={styles.heroOrb} />
          <View style={styles.profileRow}>
            <Avatar
              name={user?.displayName ?? user?.businessName ?? 'User'}
              size="lg"
            />
            <View style={styles.profileText}>
              <Text variant="h2" color="inverse" numberOfLines={1}>
                {user?.displayName ?? 'Signed in user'}
              </Text>
              <Text variant="bodySmall" color="inverse" style={styles.email}>
                {user?.email}
              </Text>
              {user?.phone ? (
                <Text variant="caption" color="inverse" style={styles.business}>
                  {user.phone}
                  {user.phoneVerified ? ' · verified' : ' · verify mobile'}
                </Text>
              ) : (
                <Text variant="caption" color="inverse" style={styles.business}>
                  Mobile not linked
                </Text>
              )}
              {user?.businessName ? (
                <Text variant="caption" color="inverse" style={styles.business}>
                  {user.businessName}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.roleChip}>
              <Text variant="caption" color="inverse" style={styles.roleLabel}>
                {(user?.role ?? 'retailer').toUpperCase()}
              </Text>
            </View>
            <View style={styles.secureChip}>
              <Icon name="shield" color="inverse" size={12} />
              <Text variant="caption" color="inverse">
                Secure session
              </Text>
            </View>
          </View>
        </View>
      </FadeIn>

      <FadeIn delay={140}>
        <View style={styles.menuCard}>
          {menu.map((item, index) => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              onPress={item.onPress}
              style={({pressed}) => [
                styles.menuRow,
                index < menu.length - 1 && styles.menuDivider,
                pressed && styles.pressed,
              ]}>
              <View
                style={[styles.menuIcon, {backgroundColor: toneBg[item.tone]}]}>
                <Icon
                  name={item.icon}
                  color={item.tone === 'copper' ? 'accent' : 'primary'}
                  size={18}
                />
              </View>
              <View style={styles.menuCopy}>
                <Text variant="h3">{item.title}</Text>
                <Text variant="caption" color="secondary">
                  {item.subtitle}
                </Text>
              </View>
              <Icon name="chevronRight" color="secondary" size={14} />
            </Pressable>
          ))}
        </View>
      </FadeIn>

      <Button
        title="Sign out"
        variant="outline"
        fullWidth
        loading={signingOut}
        onPress={() => setConfirmSignOut(true)}
      />

      <Text
        variant="caption"
        color="secondary"
        align="center"
        style={styles.footerNote}>
        Khise Digital Solution · KDS Wholesale Connect
      </Text>

      <Dialog
        visible={confirmSignOut}
        title="Sign out?"
        description={signOutDescription}
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        destructive
        loading={signingOut}
        onConfirm={() => void handleSignOut()}
        onCancel={() => setConfirmSignOut(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[5],
    paddingBottom: spacing[12],
  },
  profileHero: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: spacing[5],
    overflow: 'hidden',
    gap: spacing[4],
  },
  heroOrb: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.brand.light,
    opacity: 0.35,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  profileText: {
    flex: 1,
    gap: spacing[1],
  },
  email: {opacity: 0.9},
  business: {opacity: 0.8, letterSpacing: 0.4},
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  roleChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  roleLabel: {letterSpacing: 0.8},
  secureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  menuCard: {
    ...cardShellElevated,
    backgroundColor: colors.surface,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  menuDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {backgroundColor: colors.surfaceMuted},
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCopy: {flex: 1, gap: 2},
  footerNote: {marginTop: spacing[2]},
});
