import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';

import type {SalesStackParamList} from '../../../app/navigation/types';
import {AccountWorkspace} from '../../profile/components/AccountWorkspace';
import {useAuth} from '../../auth/AuthContext';

type Nav = NativeStackNavigationProp<SalesStackParamList>;

export function SalesAccountScreen() {
  const navigation = useNavigation<Nav>();
  const {user} = useAuth();

  return (
    <AccountWorkspace
      kicker="Sales workspace"
      description="Field sales profile, mobile verification, and password controls."
      signOutDescription="You will need to sign in again to continue field onboarding."
      menu={[
        {
          key: 'mobile',
          title: 'Mobile verification',
          subtitle: user?.phoneVerified
            ? 'Mobile number verified'
            : 'Validate your Indian mobile with OTP',
          icon: 'phone',
          tone: 'teal',
          onPress: () => navigation.navigate('VerifyMobile'),
        },
        {
          key: 'password',
          title: 'Reset password',
          subtitle: 'Change the password for this sales login',
          icon: 'lock',
          tone: 'copper',
          onPress: () => navigation.navigate('ChangePassword'),
        },
        {
          key: 'preferences',
          title: 'Preferences',
          subtitle: 'App environment and settings',
          icon: 'preferences',
          tone: 'mist',
          onPress: () => navigation.navigate('Preferences'),
        },
        {
          key: 'support',
          title: 'Support',
          subtitle: 'Send a query to admin and track status',
          icon: 'support',
          tone: 'copper',
          onPress: () => navigation.navigate('Support'),
        },
        {
          key: 'privacy',
          title: 'Privacy & security',
          subtitle: 'Session and data controls',
          icon: 'shield',
          tone: 'mist',
          onPress: () => navigation.navigate('Privacy'),
        },
      ]}
    />
  );
}
