import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, 
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          position: 'absolute',
          bottom: 40,
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: '#111', 
          borderRadius: 30, 
          height: 64,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          paddingBottom: 0, 
          alignItems: 'center',
          justifyContent: 'center'
        },
      }}
    >
      {/* 1. HOME */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons name={focused ? "home" : "home-outline"} size={22} color={focused ? "#111" : "#fff"} />
              {focused && <View style={styles.dot} />}
            </View>
          ),
        }}
      />

      {/* 2. EXPLORE */}
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons name={focused ? "rocket" : "rocket-outline"} size={22} color={focused ? "#111" : "#fff"} />
            </View>
          ),
        }}
      />

      {/* 3. ACTIVITY */}
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={22} color={focused ? "#111" : "#fff"} />
            </View>
          ),
        }}
      />

      {/* 4. PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons name={focused ? "person" : "person-outline"} size={22} color={focused ? "#111" : "#fff"} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    top: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  activeIcon: {
    backgroundColor: '#D4F93D',
  },
  dot: {
    display: 'none' 
  }
});