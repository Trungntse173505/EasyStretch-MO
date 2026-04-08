// app/water/settings.tsx
import { useUser } from '@/hooks/auth/useUser';
import { useWaterSettings } from '@/hooks/water/useWaterSettings';
import { scheduleWaterReminders } from '@/utils/waterNotificationHelper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native-safe-area-context';

const SETTINGS_KEY = '@water_settings';

export default function WaterSettingsScreen() {
  const router = useRouter();
  const { user } = useUser();

  // Gọi hook: UI chỉ lấy biến isLoading, hàm lấy data và hàm đồng bộ
  const { isLoading, fetchSettings, syncToBackend } = useWaterSettings();

  const [dailyGoal, setDailyGoal] = useState('2000');
  const [wakeTime, setWakeTime] = useState('08:00');
  const [sleepTime, setSleepTime] = useState('22:00');
  const [interval, setInterval] = useState('60');

  const [isWakePickerVisible, setWakePickerVisibility] = useState(false);
  const [isSleepPickerVisible, setSleepPickerVisibility] = useState(false);

  // LOGIC UI: Chờ lấy data sạch từ Hook và đổ vào Input
  useEffect(() => {
    if (user?.id) {
      const loadData = async () => {
        const cleanData = await fetchSettings(user.id);

        if (cleanData) {
          if (cleanData.daily_goal_ml) setDailyGoal(cleanData.daily_goal_ml.toString());
          if (cleanData.wake_time) setWakeTime(cleanData.wake_time);
          if (cleanData.sleep_time) setSleepTime(cleanData.sleep_time);
          if (cleanData.reminder_interval_mins) setInterval(cleanData.reminder_interval_mins.toString());
        }
      };
      loadData();
    }
  }, [user?.id]);

  // HÀM FORMAT GIỜ
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleConfirmWakeTime = (date: Date) => {
    setWakeTime(formatTime(date));
    setWakePickerVisibility(false);
  };

  const handleConfirmSleepTime = (date: Date) => {
    setSleepTime(formatTime(date));
    setSleepPickerVisibility(false);
  };

  // HÀM LƯU TẠI UI
  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      return;
    }

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

    try {
      // Lưu xuống máy -> Hẹn giờ -> Đẩy ngầm BE -> Báo thành công
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
      await scheduleWaterReminders(wakeTime, sleepTime, Number(interval));
      syncToBackend(payload);

      Alert.alert(
        "Thành công",
        "Đã cập nhật mục tiêu và lịch nhắc nhở uống nước!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu cài đặt vào thiết bị.");
    }
  };

  // HÀM CHUẨN BỊ GIỜ CHO DATE PICKER
  const getDateFromString = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date;
  };

  // TRẠNG THÁI LOADING UI
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '500' }}>Đang đồng bộ dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt Mục tiêu</Text>
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

          {/* 2. LỊCH SINH HOẠT */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="moon" size={20} color="#8B5CF6" />
              <Text style={styles.cardTitle}>Lịch sinh hoạt</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Giờ thức dậy</Text>
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setWakePickerVisibility(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeText}>{wakeTime}</Text>
                  <Ionicons name="time-outline" size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Giờ đi ngủ</Text>
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setSleepPickerVisibility(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeText}>{sleepTime}</Text>
                  <Ionicons name="time-outline" size={20} color="#94A3B8" />
                </TouchableOpacity>
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
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Lưu cài đặt</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL CHỌN GIỜ THỨC */}
      <DateTimePickerModal
        isVisible={isWakePickerVisible}
        mode="time"
        date={getDateFromString(wakeTime)}
        onConfirm={handleConfirmWakeTime}
        onCancel={() => setWakePickerVisibility(false)}
        confirmTextIOS="Xong"
        cancelTextIOS="Hủy"
      />

      {/* MODAL CHỌN GIỜ NGỦ */}
      <DateTimePickerModal
        isVisible={isSleepPickerVisible}
        mode="time"
        date={getDateFromString(sleepTime)}
        onConfirm={handleConfirmSleepTime}
        onCancel={() => setSleepPickerVisibility(false)}
        confirmTextIOS="Xong"
        cancelTextIOS="Hủy"
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', paddingTop: 10, paddingBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  sectionDescription: { fontSize: 15, color: '#64748B', marginBottom: 24, lineHeight: 22, fontWeight: '500' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#111' },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, fontSize: 16, color: '#111', fontWeight: '600' },
  inputBig: { fontSize: 28, fontWeight: '900', color: '#0EA5E9', flex: 1, paddingVertical: 16 },
  inputGroupRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  unitText: { fontSize: 16, fontWeight: '700', color: '#94A3B8' },
  row: { flexDirection: 'row', gap: 16 },
  halfInput: { flex: 1 },
  timeInput: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 16, color: '#111', fontWeight: '600' },
  footer: { padding: 50, backgroundColor: '#FAFAFA' },
  saveButton: { backgroundColor: '#0EA5E9', paddingVertical: 18, borderRadius: 100, alignItems: 'center', shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  saveButtonText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});