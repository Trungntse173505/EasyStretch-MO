import { Stack } from 'expo-router';

export default function StretchingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="day/[id]" />
      <Stack.Screen name="exercise-play" />
    </Stack>
  );
}
