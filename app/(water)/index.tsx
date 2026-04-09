// app/water/index.tsx
import { useUser } from '@/hooks/auth/useUser';
import { useWaterLog } from '@/hooks/water/useWaterLog';
import { useWaterLogByDay, WaterLogEntry } from '@/hooks/water/useWaterLogByDay';
import { useWaterProgress } from '@/hooks/water/useWaterProgress';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WaterHomeScreen() {
  const router = useRouter();
  const { user } = useUser();

  const { progress, loading, fetchProgress } = useWaterProgress();
  const { isDrinking, addWaterLog } = useWaterLog();
  const { logs, loading: logsLoading, fetchLogByDay } = useWaterLogByDay();

  // State cho Modal nhập tay
  const [isModalVisible, setModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('250');

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchProgress(user.id);
        const today = new Date().toISOString().split('T')[0];
        fetchLogByDay(user.id, today);
      }
    }, [user?.id, fetchProgress, fetchLogByDay])
  );

  const handleDrinkWater = async (amount: number) => {
    if (!user?.id) return;

    const result = await addWaterLog(user.id, amount);

    if (result.success) {
      const today = new Date().toISOString().split('T')[0];
      fetchProgress(user.id);
      fetchLogByDay(user.id, today);
      setModalVisible(false);
    } else {
      Alert.alert("Lỗi", result.message);
    }
  };

  const submitCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Thông báo", "Vui lòng nhập số hợp lệ lớn hơn 0");
      return;
    }
    handleDrinkWater(amount);
  };

  const fillPercentage = progress ? Math.min(progress.percentage, 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lượng nước</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={() => router.push('/(water)/statistics')}>
            <Ionicons name="bar-chart-outline" size={26} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(water)/settings')}>
            <Ionicons name="settings-outline" size={26} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      {loading && !progress ? (
        <ActivityIndicator size="large" color="#0EA5E9" style={{ marginTop: 50 }} />
      ) : (
        <View style={styles.content}>

          {/* VÒNG TRÒN NƯỚC */}
          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <View style={[styles.waterWave, { height: `${fillPercentage}%` }]} />
              <View style={styles.circleContentText}>
                <View style={styles.dropIconWrapper}>
                  <Ionicons name="water" size={36} color="#0EA5E9" />
                </View>
                <Text style={styles.consumedText}>
                  {progress?.consumed_ml || 0}
                </Text>
                <Text style={styles.goalText}>
                  / {progress?.goal_ml || 2000} mL
                </Text>
              </View>
            </View>
          </View>

          {/* CỤM NÚT ACTION */}
          <View style={styles.actionRow}>
            {/* Nút uống nhanh mặc định */}
            <TouchableOpacity
              style={styles.drinkBtnMain}
              onPress={() => handleDrinkWater(300)}
              disabled={isDrinking}
              activeOpacity={0.85}
            >
              {isDrinking ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.drinkBtnText}>Uống nhanh 300mL</Text>
              )}
            </TouchableOpacity>

            {/* Nút phụ mở Modal Tùy chỉnh */}
            <TouchableOpacity
              style={styles.drinkBtnSecondary}
              onPress={() => setModalVisible(true)}
              disabled={isDrinking}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="cup-water" size={26} color="#0EA5E9" />
            </TouchableOpacity>
          </View>

          {/* KHUNG LỊCH SỬ */}
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Lịch sử hôm nay</Text>
            </View>
            {logsLoading ? (
              <ActivityIndicator color="#0EA5E9" style={{ marginTop: 20 }} />
            ) : logs.length === 0 ? (
              <Text style={styles.historyEmptyText}>
                Bắt đầu ghi lại lượng nước bạn uống để duy trì cơ thể khỏe mạnh mỗi ngày!
              </Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {logs.map((item: WaterLogEntry, index: number) => {
                  const time = new Date(item.consumed_at || (item as any).logged_at);
                  const hhmm = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
                  return (
                    <View key={item.id || index} style={styles.logItem}>
                      <View style={styles.logIconWrap}>
                        <Ionicons name="water" size={20} color="#0EA5E9" />
                      </View>
                      <Text style={styles.logAmount}>+{item.amount_ml} mL</Text>
                      <Text style={styles.logTime}>{hhmm}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

        </View>
      )}

      {/* MODAL TÙY CHỈNH LƯỢNG NƯỚC */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập lượng nước (mL)</Text>

            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={customAmount}
              onChangeText={setCustomAmount}
              placeholder="VD: 500"
              autoFocus
            />

            {/* Các nút gợi ý nhanh */}
            <View style={styles.quickSelectRow}>
              {[150, 250, 500].map(val => (
                <TouchableOpacity key={val} style={styles.quickSelectBtn} onPress={() => setCustomAmount(val.toString())} activeOpacity={0.7}>
                  <Text style={styles.quickSelectText}>{val} mL</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)} activeOpacity={0.8}>
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalConfirmBtn} onPress={submitCustomAmount} disabled={isDrinking} activeOpacity={0.8}>
                {isDrinking ? <ActivityIndicator color="#FFF" /> : <Text style={styles.modalConfirmText}>Ghi nhận</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', paddingTop: 10, paddingBottom: 15 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#111' },

  content: { flex: 1, alignItems: 'center', paddingTop: 40 },

  circleOuter: { width: 280, height: 280, borderRadius: 140, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginBottom: 40, borderWidth: 8, borderColor: '#E0F2FE', shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  circleInner: { width: 240, height: 240, borderRadius: 120, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  waterWave: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#0EA5E9', opacity: 0.8 },
  circleContentText: { alignItems: 'center', zIndex: 10 },
  dropIconWrapper: { marginBottom: 4 },
  consumedText: { fontSize: 48, fontWeight: '900', color: '#111', letterSpacing: -1 },
  goalText: { fontSize: 16, fontWeight: '700', color: '#64748B', marginTop: 2 },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 40 },
  drinkBtnMain: { backgroundColor: '#0EA5E9', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 30, shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  drinkBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  drinkBtnSecondary: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0F2FE', shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },

  historySection: { width: '100%', paddingHorizontal: 24, flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 10 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  historyTitle: { fontSize: 19, fontWeight: '800', color: '#111' },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { color: '#0EA5E9', fontSize: 14, fontWeight: '700' },
  historyEmptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 14, marginTop: 20, fontStyle: 'italic', paddingHorizontal: 20, lineHeight: 22 },

  // Styles cho từng dòng log uống nước
  logItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 12 },
  logIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center' },
  logAmount: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111' },
  logTime: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },

  // STYLES CHO MODAL NHẬP NƯỚC
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalContent: { width: '100%', backgroundColor: '#FFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 19, fontWeight: '800', color: '#111', marginBottom: 20, textAlign: 'center' },
  modalInput: { backgroundColor: '#F8FAFC', borderRadius: 16, fontSize: 36, fontWeight: '900', color: '#0EA5E9', textAlign: 'center', paddingVertical: 20, marginBottom: 20 },
  quickSelectRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  quickSelectBtn: { flex: 1, backgroundColor: '#F0F9FF', paddingVertical: 12, borderRadius: 12, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#E0F2FE' },
  quickSelectText: { color: '#0EA5E9', fontWeight: '800', fontSize: 15 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  modalCancelText: { color: '#64748B', fontWeight: '700', fontSize: 16 },
  modalConfirmBtn: { flex: 1, backgroundColor: '#0EA5E9', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  modalConfirmText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
});