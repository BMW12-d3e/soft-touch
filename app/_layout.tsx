import '@/global.css';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogOut, MoonStarIcon, SunIcon, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Cog, House, SquareLibrary, Store } from 'lucide-react';


export { ErrorBoundary } from 'expo-router';

function HeaderActions() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="flex-row items-center gap-1 mr-2">
      <Link href="/(auth)/login" asChild>
        <Button size="icon" variant="ghost">
          <Icon as={LogOut} className="size-5" />
        </Button>
      </Link>
      <Link href="/profilePage" asChild>
        <Button size="icon" variant="ghost">
          <Icon as={User} className="size-5" />
        </Button>
      </Link>
      <Button
        onPressIn={toggleColorScheme}
        size="icon"
        variant="ghost"
        className="ios:size-9 rounded-full">
        <Icon as={colorScheme === 'dark' ? MoonStarIcon : SunIcon} className="size-5" />
      </Button>
      <Link href="/settingsPage" asChild>
        <Button size="icon" variant="ghost">
          <Icon as={Cog} className="size-5" />
        </Button>
      </Link>
    </View>
  );
}


export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {/* <Stack screenOptions={{ headerRight: () => <HeaderActions /> }} /> */}
      <Tabs screenOptions={{
        headerShown: true,
        headerRight: () => (
          <HeaderActions />
        ),
      }}>
        <Tabs.Screen
          name="shopping"
          options={{
            title: 'Bookstore',
            tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="book"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => <SquareLibrary color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profilePage"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
            href: null
          }}
        />
        <Tabs.Screen
          name="settingsPage"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Cog color={color} size={size} />,
            href: null
          }}
        />
        <Tabs.Screen
          name="(auth)"
          options={{
            href: null
          }}
        />
      </Tabs>
      <PortalHost />
    </ThemeProvider>
  );
}