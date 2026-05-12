import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export default function RecommendationsTab() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text variant="h3">Recommendations</Text>
      <Text variant="muted" className="mt-2 text-center">
        Buchempfehlungen erscheinen hier.
      </Text>
    </View>
  );
}
