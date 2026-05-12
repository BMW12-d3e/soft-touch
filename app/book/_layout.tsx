import { Tabs } from 'expo-router';
import { BookPlus, Library, Sparkles } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const COLORS = {
  light: {
    background: '#ffffff',
    border: '#e5e5e5',
    active: '#171717',
    inactive: '#737373',
  },
  dark: {
    background: '#0a0a0a',
    border: '#262626',
    active: '#fafafa',
    inactive: '#a3a3a3',
  },
};

export default function BookLayout() {
  const { colorScheme } = useColorScheme();
  const colors = COLORS[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bookshelf',
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Book',
          tabBarIcon: ({ color, size }) => <BookPlus color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: 'Recommendations',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
