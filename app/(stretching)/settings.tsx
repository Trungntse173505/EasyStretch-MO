import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { STATION_META } from './data';
import { CustomNotifTime, getUserStationNotifTimes, saveUserStationNotifTimes } from '@/utils/stationNotificationHelper';

export default function StretchingSettingsScreen() {
  const router = useRouter();
  const [customTimes, setCustomTimes] = useState<CustomNotifTime[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const times = await getUserStationNotifTimes();
      setCustomTimes(times);
    };
    loadData();
  }, []);

  const handleSliderChange = (order: number, value: number) => {
    // value here is total minutes
    const hour = Math.floor(value / 60);
    const minute = value % 60;
    
    setCustomTimes(prev => prev.map(item => 
      item.order === order ? { ...item, hour, minute } : item
    ));
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    setSaving(true);
    await saveUserStationNotifTimes(customTimes);
    setSaving(false);
    Alert.alert("Thành công", "Đã lưu cài đặt thông báo!");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giờ Thông Báo</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#D4F93D" />
          <Text style={styles.infoText}>
            Bạn có thể tùy chỉnh giờ nhắc nhở cho từng mốc nhiệm vụ. Giờ được chọn phải nằm trong khoảng thời gian cho phép của mốc đó.
          </Text>
        </View>

        {STATION_META.map((station) => {
          const currentSetup = customTimes.find(c => c.order === station.order);
          const currentTotalMinutes = currentSetup 
            ? currentSetup.hour * 60 + currentSetup.minute 
            : station.notifHour * 60 + station.notifMinute;

          const minMinutes = station.windowStartHour * 60 + station.windowStartMinute;
          const maxMinutes = station.windowEndHour * 60 + station.windowEndMinute;

          return (
            <View key={station.order} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {station.icon} {station.name}
                </Text>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>
                    {formatTime(currentSetup?.hour || station.notifHour, currentSetup?.minute || station.notifMinute)}
                  </Text>
                </View>
              </View>

              <View style={styles.sliderSection}>
                <Text style={styles.rangeText}>{formatTime(station.windowStartHour, station.windowStartMinute)}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={minMinutes}
                  maximumValue={maxMinutes}
                  step={5}
                  value={currentTotalMinutes}
                  onValueChange={(val) => handleSliderChange(station.order, val)}
                  minimumTrackTintColor="#D4F93D"
                  maximumTrackTintColor="rgba(255,255,255,0.1)"
                  thumbTintColor="#D4F93D"
                />
                <Text style={styles.rangeText}>{formatTime(station.windowEndHour, station.windowEndMinute)}</Text>
              </View>
            </View>
          );
        })}

        <TouchableOpacity 
          style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Đang lưu...' : 'LƯU LẠI'}</Text>
        </TouchableOpacity>
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  
  content: { paddingHorizontal: 20, paddingTop: 10 },
  
  infoBox: {
    flexDirection: 'row', backgroundColor: 'rgba(212,249,61,0.08)',
    padding: 16, borderRadius: 16, gap: 12, marginBottom: 24,
    borderWidth: 1, borderColor: 'rgba(212,249,61,0.2)',
  },
  infoText: { flex: 1, color: '#A1A1AA', fontSize: 13, lineHeight: 20, fontWeight: '500' },

  card: {
    backgroundColor: '#161616', borderRadius: 20, padding: 20,
    marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  
  timeBadge: {
    backgroundColor: 'rgba(212,249,61,0.1)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: 'rgba(212,249,61,0.3)',
  },
  timeBadgeText: { color: '#D4F93D', fontSize: 16, fontWeight: '900' },

  sliderSection: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  slider: { flex: 1, height: 40 },
  rangeText: { color: '#64748B', fontSize: 12, fontWeight: '700' },

  saveBtn: {
    backgroundColor: '#D4F93D', borderRadius: 16, paddingVertical: 18,
    alignItems: 'center', marginTop: 10,
    shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8,
  },
  saveBtnText: { color: '#111', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
