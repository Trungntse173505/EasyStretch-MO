// app/water/settings.tsx
import { useUser } from '@/hooks/auth/useUser';
import { useWaterSettings } from '@/hooks/water/useWaterSettings';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleWaterReminders } from '@/utils/waterNotificationHelper';

export default function WaterSettingsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { isUpdating, updateSettings } = useWaterSettings();

  // Khởi tạo state cho các form input (Giá trị mặc định để user lười gõ cũng có sẵn)
  const [dailyGoal, setDailyGoal] = useState('2000');
  const [wakeTime, setWakeTime] = useState('08:00');
  const [sleepTime, setSleepTime] = useState('22:00');
  const [interval, setInterval] = useState('60');

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      return;
    }

    // Validate cơ bản
    if (!dailyGoal || !wakeTime || !sleepTime || !interval) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ các thông tin!');
      return;
    }

    const payload = {
      user_id: user.id,
      daily_goal_ml: Number(dailyGoal),
      wake_time: wakeTime,
      sleep_time: sleepTime,
      reminder_interval_mins: Number(interval)
    };

    const result = await updateSettings(payload);

    if (result.success) {
      // Hẹn giờ local notification
      await scheduleWaterReminders(wakeTime, sleepTime, Number(interval));

      Alert.alert(
        "Thành công", 
        "Đã cập nhật mục tiêu và lịch nhắc nhở uống nước!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } else if (!result.success) {
      Alert.alert("Lỗi", result.message ?? "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt Mục tiêu</Text>
        {/* Spacer để title ra giữa */}
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionDescription}>
            Thiết lập mục tiêu uống nước hằng ngày và hệ thống sẽ tính toán lịch nhắc nhở phù hợp cho bạn.
          </Text>

          {/* 1. MỤC TIÊU NƯỚC */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="water" size={20} color="#0EA5E9" />
              <Text style={styles.cardTitle}>Mục tiêu hằng ngày</Text>
            </View>
            <View style={styles.inputGroupRow}>
              <TextInput
                style={[styles.input, styles.inputBig]}
                keyboardType="numeric"
                value={dailyGoal}
                onChangeText={setDailyGoal}
                placeholder="VD: 2000"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.unitText}>mL</Text>
            </View>
          </View>

          {/* 2. LỊCH SINH HOẠT (Thức/Ngủ) */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="moon" size={20} color="#8B5CF6" />
              <Text style={styles.cardTitle}>Lịch sinh hoạt</Text>
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Giờ thức dậy</Text>
                <TextInput
                  style={styles.input}
                  value={wakeTime}
                  onChangeText={setWakeTime}
                  placeholder="08:00"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Giờ đi ngủ</Text>
                <TextInput
                  style={styles.input}
                  value={sleepTime}
                  onChangeText={setSleepTime}
                  placeholder="22:00"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </View>

          {/* 3. TẦN SUẤT NHẮC NHỞ */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="notifications" size={20} color="#F59E0B" />
              <Text style={styles.cardTitle}>Chu kỳ nhắc nhở</Text>
            </View>
            <Text style={styles.inputLabel}>Khoảng cách giữa các lần uống</Text>
            <View style={styles.inputGroupRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                keyboardType="numeric"
                value={interval}
                onChangeText={setInterval}
                placeholder="VD: 60"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.unitText}>phút / lần</Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* NÚT LƯU */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={isUpdating}
          activeOpacity={0.8}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Lưu cài đặt</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', paddingTop: 10, paddingBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  sectionDescription: { fontSize: 15, color: '#64748B', marginBottom: 24, lineHeight: 22, fontWeight: '500' },
  
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
  },
  
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
  inputBig: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0EA5E9',
    flex: 1,
    paddingVertical: 16,
  },
  inputGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
  },
  
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },

  footer: {
    padding: 24,
    backgroundColor: '#FAFAFA',
  },
  saveButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  }
});