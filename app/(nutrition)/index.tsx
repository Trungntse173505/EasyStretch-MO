import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const bgImage = require('../../assets/images/Nutrition.png');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = async () => {
    try {
      await AsyncStorage.setItem("HAS_SEEN_NUTRITION_INTRO", "true");
    } catch (e) {
      console.log("Lỗi lưu trạng thái intro:", e);
    }
    router.replace('/(nutrition)/log');
  };

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Nút Back về Home ở góc trái cùng */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Dinh dưỡng cá{'\n'}nhân hóa bắt đầu{'\n'}từ đây
          </Text>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Khám phá</Text>
          <Ionicons name="arrow-forward" size={20} color="#111" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  headerRow: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 24, paddingBottom: 50 },
  textContainer: { flex: 1, justifyContent: 'center', paddingBottom: 60 },
  title: { fontSize: 42, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 52, letterSpacing: -1, textShadowColor: 'rgba(0, 0, 0, 0.6)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10 },
  button: { backgroundColor: '#D4F93D', paddingVertical: 18, borderRadius: 30, alignItems: 'center', width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 8, shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  buttonText: { fontSize: 17, fontWeight: '900', color: '#111' },
});