import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {CartScreen} from '../../features/cart/screens/CartScreen';
import {GroupBuyDetailsScreen} from '../../features/groupBuying/screens/GroupBuyDetailsScreen';
import {GroupBuyingScreen} from '../../features/groupBuying/screens/GroupBuyingScreen';
import {HomeScreen} from '../../features/home/screens/HomeScreen';
import {NotificationsScreen} from '../../features/notifications/screens/NotificationsScreen';
import {OrderDetailsScreen} from '../../features/orders/screens/OrderDetailsScreen';
import {OrdersScreen} from '../../features/orders/screens/OrdersScreen';
import {ProductDetailsScreen} from '../../features/products/screens/ProductDetailsScreen';
import {ProductSearchScreen} from '../../features/products/screens/ProductSearchScreen';
import {ProductsScreen} from '../../features/products/screens/ProductsScreen';
import {AddressesScreen} from '../../features/profile/screens/AddressesScreen';
import {AccountScreen} from '../../features/profile/screens/AccountScreen';
import {BusinessProfileScreen} from '../../features/profile/screens/BusinessProfileScreen';
import {BusinessVerificationScreen} from '../../features/profile/screens/BusinessVerificationScreen';
import {ChangePasswordScreen} from '../../features/profile/screens/ChangePasswordScreen';
import {KycScreen} from '../../features/profile/screens/KycScreen';
import {PreferencesScreen} from '../../features/profile/screens/PreferencesScreen';
import {PrivacySecurityScreen} from '../../features/profile/screens/PrivacySecurityScreen';
import {SupportScreen} from '../../features/profile/screens/SupportScreen';
import {VerifyMobileScreen} from '../../features/profile/screens/VerifyMobileScreen';
import {QuotationCompareScreen} from '../../features/quotations/screens/QuotationCompareScreen';
import {QuotationDetailsScreen} from '../../features/quotations/screens/QuotationDetailsScreen';
import {RfqCreateScreen} from '../../features/rfqs/screens/RfqCreateScreen';
import {RfqDetailsScreen} from '../../features/rfqs/screens/RfqDetailsScreen';
import {RfqListScreen} from '../../features/rfqs/screens/RfqListScreen';
import {Icon} from '../../components/ui/Icon';
import {colors} from '../../theme/colors';
import type {RetailerStackParamList, RetailerTabParamList} from './types';

const Tab = createBottomTabNavigator<RetailerTabParamList>();
const Stack = createNativeStackNavigator<RetailerStackParamList>();

function HomeTabIcon({focused}: {focused: boolean}) {
  return <Icon name="home" color={focused ? 'accent' : 'secondary'} />;
}

function ProductsTabIcon({focused}: {focused: boolean}) {
  return <Icon name="products" color={focused ? 'accent' : 'secondary'} />;
}

function GroupBuyTabIcon({focused}: {focused: boolean}) {
  return <Icon name="group" color={focused ? 'accent' : 'secondary'} />;
}

function OrdersTabIcon({focused}: {focused: boolean}) {
  return <Icon name="orders" color={focused ? 'accent' : 'secondary'} />;
}

function AccountTabIcon({focused}: {focused: boolean}) {
  return <Icon name="account" color={focused ? 'accent' : 'secondary'} />;
}

function RetailerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarIcon: HomeTabIcon}}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{tabBarIcon: ProductsTabIcon}}
      />
      <Tab.Screen
        name="GroupBuying"
        component={GroupBuyingScreen}
        options={{title: 'Group buy', tabBarIcon: GroupBuyTabIcon}}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{tabBarIcon: OrdersTabIcon}}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{tabBarIcon: AccountTabIcon}}
      />
    </Tab.Navigator>
  );
}

export function RetailerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="RetailerTabs" component={RetailerTabs} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="ProductSearch" component={ProductSearchScreen} />
      <Stack.Screen name="RfqList" component={RfqListScreen} />
      <Stack.Screen name="RfqCreate" component={RfqCreateScreen} />
      <Stack.Screen name="RfqDetails" component={RfqDetailsScreen} />
      <Stack.Screen name="QuotationCompare" component={QuotationCompareScreen} />
      <Stack.Screen name="QuotationDetails" component={QuotationDetailsScreen} />
      <Stack.Screen name="GroupBuyDetails" component={GroupBuyDetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} />
      <Stack.Screen name="Kyc" component={KycScreen} />
      <Stack.Screen
        name="BusinessVerification"
        component={BusinessVerificationScreen}
      />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="VerifyMobile" component={VerifyMobileScreen} />
      <Stack.Screen name="Privacy" component={PrivacySecurityScreen} />
    </Stack.Navigator>
  );
}
