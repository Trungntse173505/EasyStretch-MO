// app/nutrition/_layout.tsx
import { Stack } from 'expo-router';

export default function NutritionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="log" />
      <Stack.Screen name="add" options={{ presentation: 'modal', headerShown: true, title: 'Thêm Bữa Ăn' }} />
    </Stack>
  );
}