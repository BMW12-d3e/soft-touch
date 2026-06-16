import { Tabs } from 'expo-router';
import { BookPlus, Library, Sparkles } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function BookLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
