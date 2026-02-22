import { Stack } from "expo-router";
import React from "react";
import { OnboardingProvider } from "../../context/OnboardingContext";

export default function InfoLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="age" />
        <Stack.Screen name="weight" />
        <Stack.Screen name="gender" />
        <Stack.Screen name="goal" />
      </Stack>
    </OnboardingProvider>
  );
}