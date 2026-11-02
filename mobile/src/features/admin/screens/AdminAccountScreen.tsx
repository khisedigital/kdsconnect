import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';

import type {AdminStackParamList} from '../../../app/navigation/types';
import {AccountWorkspace} from '../../profile/components/AccountWorkspace';

type Nav = NativeStackNavigationProp<AdminStackParamList>;

export function AdminAccountScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <AccountWorkspace
      kicker="Platform admin"
      description="Administrator profile, support inbox, and password controls."
      signOutDescription="You will need to authenticate again for admin access."
      menu={[
        {
          key: 'support-queries',
          title: 'Support queries',
          subtitle: 'Catch retailer and wholesaler queries',
          icon: 'support',
          tone: 'copper',
          onPress: () => navigation.navigate('SupportQueries'),
        },
        {
          key: 'password',
          title: 'Reset password',
          subtitle: 'Change the password for this admin login',
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
