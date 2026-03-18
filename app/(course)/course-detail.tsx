import { useCoursePayment } from '@/hooks/course/useCoursePayment';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, AppState, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id, title, price, img_url, status } = useLocalSearchParams();
  const { hasBought, loadingPayment, checkOwnership, handleCreatePayment } = useCoursePayment();

  useEffect(() => {
    if (id) checkOwnership(id as string);
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && id) checkOwnership(id as string);
    });
    return () => subscription.remove();
  }, [id, status, checkOwnership]);

  const onBuyCourse = () => {
    Alert.alert("Xác nhận", `Mua khóa học "${title}" với giá ${Number(price).toLocaleString('vi-VN')} đ?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: async () => {
          const redirectLink = Linking.createURL('course-detail'); 
          const payload = {
            amount: Math.floor(Number(price)), 
            description: "Thanh toan khoa hoc", 
            items: [{ name: id as string, quantity: 1, price: Math.floor(Number(price)) }],
            returnUrl: redirectLink, 
            cancelUrl: redirectLink
          };
          const data = await handleCreatePayment(payload);
          if (data?.checkoutUrl) {
            Linking.openURL(data.checkoutUrl).catch(() => Alert.alert("Lỗi", "Không thể mở trang thanh toán."));
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* HEADER COVER */}
      <ImageBackground source={{ uri: (img_url as string) || 'https://via.placeholder.com/400' }} style={styles.headerCover}>
        <View style={styles.overlay} />
        <SafeAreaView edges={['top']} style={styles.backButtonSafeArea}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>

      {/* CONTENT */}
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          <View style={styles.dragPill} />
          
          <View style={styles.tagWrap}>
             <Text style={styles.tagText}>Khóa phục hồi chuyên sâu</Text>
             <Ionicons name="sparkles" size={14} color="#F59E0B" style={{marginLeft: 6}} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>Khóa học này sẽ giúp bạn giãn cơ sâu, giảm đau mỏi nhanh chóng và cải thiện tư thế chỉ với 15 phút mỗi ngày với sự kết hợp của Yoga và giãn cơ cơ bản.</Text>
          
          <Text style={styles.sectionHeader}>Lợi ích khóa học</Text>
          <View style={styles.featureList}>
            {['Khắc phục gù lưng, mỏi cổ', 'Tăng cường tuần hoàn máu', 'Video hướng dẫn chi tiết từ HLV'].map((f, i) => (
              <View key={i} style={styles.featureItem}>
                 <Ionicons name="checkmark-circle" size={20} color="#111" />
                 <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* FLOATING ACTION BOTTOM */}
      <View style={styles.bottomBar}>
        {loadingPayment ? (
          <ActivityIndicator size="large" color="#111" />
        ) : hasBought ? (
          <View style={styles.actionRow}>
            <View style={{flex: 1}}>
              <Text style={styles.ownedText}>Đã sở hữu</Text>
              <Text style={styles.readyText}>Sẵn sàng luyện tập</Text>
            </View>
            <TouchableOpacity style={styles.playButton} activeOpacity={0.9} onPress={() => router.push({ pathname: "/(course)/course-player", params: { id: id, title: title } })}>
              <Text style={styles.playButtonText}>Bắt đầu</Text>
              <Ionicons name="play" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <View style={{flex: 1}}>
              <Text style={styles.priceLabel}>Chỉ từ</Text>
              <Text style={styles.priceText}>{Number(price).toLocaleString('vi-VN')}đ</Text>
            </View>
            <TouchableOpacity style={styles.buyButton} onPress={onBuyCourse} activeOpacity={0.9}>
              <Text style={styles.buyButtonText}>Mua ngay</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerCover: { width: '100%', height: 350 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  backButtonSafeArea: { position: 'absolute', top: 0, left: 20, zIndex: 10 },
  backButton: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  
  contentContainer: { flex: 1, marginTop: -40, backgroundColor: '#FFF', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 24, paddingTop: 16 },
  dragPill: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 24 },
  
  tagWrap: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 16 },
  tagText: { fontSize: 13, fontWeight: '800', color: '#D97706' },
  
  title: { fontSize: 28, fontWeight: '900', color: '#111', marginBottom: 16, lineHeight: 36, letterSpacing: -0.5 },
  description: { fontSize: 16, color: '#475569', lineHeight: 26, marginBottom: 24 },
  
  sectionHeader: { fontSize: 19, fontWeight: '900', color: '#111', marginBottom: 16 },
  featureList: { gap: 14 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureText: { fontSize: 15, color: '#334155', fontWeight: '600' },
  
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', paddingHorizontal: 24, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 24 : 40, borderTopWidth: 1, borderTopColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  priceLabel: { fontSize: 13, color: '#64748B', fontWeight: '700', textTransform: 'uppercase' },
  priceText: { fontSize: 28, fontWeight: '900', color: '#111', letterSpacing: -1 },
  buyButton: { backgroundColor: '#111', paddingHorizontal: 32, paddingVertical: 18, borderRadius: 30, shadowColor: '#111', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  buyButtonText: { color: '#D4F93D', fontSize: 16, fontWeight: '900' },
  
  ownedText: { fontSize: 14, color: '#059669', fontWeight: '800', textTransform: 'uppercase' },
  readyText: { fontSize: 20, fontWeight: '900', color: '#111' },
  playButton: { backgroundColor: '#D4F93D', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 18, borderRadius: 30, shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  playButtonText: { color: '#111', fontSize: 16, fontWeight: '900' },
});