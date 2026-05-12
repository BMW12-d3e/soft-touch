import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { Book } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-5xl font-black">Welcome to Soft-touch</Text>
      <View className="mt-5 flex-row gap-4">
        <Link href="/book" asChild>
          <Button>
            <Text>Books</Text>
            <Icon as={Book} className="size-5 text-primary-foreground" />
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
