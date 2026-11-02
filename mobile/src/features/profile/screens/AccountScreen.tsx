import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {AccountWorkspace} from '../components/AccountWorkspace';
import {useAuth} from '../../auth/AuthContext';

type Nav = NativeStackNavigationProp<RetailerStackParamList>;

export function AccountScreen() {
  const navigation = useNavigation<Nav>();
  const {user} = useAuth();

  return (
    <AccountWorkspace
      kicker="Your workspace"
      description="Retailer profile, verification, and account security."
      signOutDescription="You will need to authenticate again to access orders, RFQs, and account settings."
      menu={[
        {
          key: 'profile',
          title: 'Business profile',
          subtitle: 'Company details and contact',
          icon: 'building',
          tone: 'teal',
          onPress: () => navigation.navigate('BusinessProfile'),
        },
        {
          key: 'mobile',
          title: 'Mobile verification',
          subtitle: user?.phoneVerified
            ? 'Mobile number verified'
            : 'Validate your Indian mobile with OTP',
          icon: 'phone',
          tone: 'mist',
          onPress: () => navigation.navigate('VerifyMobile'),
        },
        {
          key: 'password',
          title: 'Reset password',
          subtitle: 'Change the password for this login',
          icon: 'lock',
          tone: 'copper',
          onPress: () => navigation.navigate('ChangePassword'),
        },
        {
          key: 'kyc',
          title: 'Aadhaar KYC',
          subtitle: 'Verify identity to trade as a valid user',
          icon: 'idCard',
          tone: 'mist',
          onPress: () => navigation.navigate('Kyc'),
        },
        {
          key: 'businessVerification',
          title: 'Business verification',
          subtitle: 'Udyam Aadhaar and phone photos of premises',
          icon: 'camera',
          tone: 'copper',
          onPress: () => navigation.navigate('BusinessVerification'),
        },
        {
          key: 'addresses',
          title: 'Delivery addresses',
          subtitle: 'Ship-to locations for orders',
          icon: 'mapMarker',
          tone: 'teal',
          onPress: () => navigation.navigate('Addresses'),
        },
        {
          key: 'notifications',
          title: 'Notifications',
          subtitle: 'Order, RFQ, and campaign alerts',
          icon: 'bell',
          tone: 'mist',
          onPress: () => navigation.navigate('Notifications'),
        },
        {
          key: 'preferences',
          title: 'Preferences',
          subtitle: 'App environment and settings',
          icon: 'preferences',
          tone: 'teal',
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
