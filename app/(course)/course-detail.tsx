import { useCoursePayment } from '@/hooks/course/useCoursePayment'; // Đảm bảo đường dẫn này đúng với project của bạn
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseDetailScreen() {
  const router = useRouter();
  
  const { id, title, price, img_url, status } = useLocalSearchParams();

  const { hasBought, loadingPayment, checkOwnership, handleCreatePayment } = useCoursePayment();

  useEffect(() => {
    if (id) {
      checkOwnership(id as string);
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && id) {
        console.log("App vừa được bật lại từ nền -> Tự động check lại giao dịch!");
        checkOwnership(id as string);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [id, status, checkOwnership]);

  const onBuyCourse = () => {
    Alert.alert(
      "Xác nhận thanh toán",
      `Bạn có chắc chắn muốn mua khóa học "${title}" với giá ${Number(price).toLocaleString('vi-VN')} đ không?`,
      [
        {
          text: "Để sau",
          style: "cancel",
        },
        {
          text: "Đồng ý mua",
          onPress: async () => {
            const redirectLink = Linking.createURL('course-detail'); 

            const payload = {
              amount: Math.floor(Number(price)), 
              description: "Thanh toan khoa hoc", 
              items: [
                { 
                  name: id as string, 
                  quantity: 1, 
                  price: Math.floor(Number(price)) 
                }
              ],
              returnUrl: redirectLink, 
              cancelUrl: redirectLink
            };

            console.log("Dữ liệu gửi lên PayOS:", payload);

            const data = await handleCreatePayment(payload);
            
            if (data?.checkoutUrl) {
              console.log("Mở link thanh toán PayOS:", data.checkoutUrl);
              Linking.openURL(data.checkoutUrl).catch((err) => {
                console.error("Không thể mở link:", err);
                Alert.alert("Lỗi", "Không thể mở trang thanh toán lúc này.");
              });
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCover}>
        <Image source={{ uri: img_url as string || 'https://via.placeholder.com/400' }} style={styles.coverImage} />
        <View style={styles.overlay} />
        
        <SafeAreaView edges={['top']} style={styles.backButtonSafeArea}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentHeader}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Phục hồi</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>
            Khóa học này sẽ giúp bạn giãn cơ sâu, giảm đau mỏi nhanh chóng và cải thiện tư thế chỉ với 15 phút mỗi ngày.
          </Text>
        </View>

        <View style={styles.actionSection}>
          {loadingPayment ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#D4F93D" />
              <Text style={styles.loadingText}>Đang cập nhật dữ liệu khóa học...</Text>
            </View>
          ) : hasBought ? (
            <View style={styles.ownedBox}>
              <View style={styles.ownedHeader}>
                <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                <Text style={styles.ownedText}>Bạn đã sở hữu khóa học này</Text>
              </View>

              {/* 1. CHỖ NÀY ĐÃ ĐƯỢC SỬA: Thêm sự kiện onPress trỏ sang màn hình học */}
              <TouchableOpacity 
                style={styles.playButton} 
                activeOpacity={0.8}
                onPress={() => {
                  router.push({
                    // Đảm bảo đường dẫn này khớp với vị trí bạn lưu file course-player.tsx
                    pathname: "/(course)/course-player", 
                    params: { id: id, title: title }
                  });
                }}
              >
                <Ionicons name="play" size={20} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.playButtonText}>Bắt Đầu Tập Luyện</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buyBox}>
              <Text style={styles.priceLabel}>Giá khóa học</Text>
              <Text style={styles.priceText}>{Number(price).toLocaleString('vi-VN')} đ</Text>
              
              <TouchableOpacity style={styles.buyButton} onPress={onBuyCourse} activeOpacity={0.8}>
                <Text style={styles.buyButtonText}>Mua Khóa Học Ngay</Text>
              </TouchableOpacity>
              <Text style={styles.guaranteeText}>🛡️ Thanh toán an toàn qua PayOS</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerCover: { width: '100%', height: 300, position: 'relative' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  backButtonSafeArea: { position: 'absolute', top: 0, left: 20, zIndex: 10 },
  backButton: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  
  contentContainer: { flex: 1, marginTop: -30, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingTop: 30 },
  contentHeader: { marginBottom: 30 },
  tag: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 12 },
  tagText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  title: { fontSize: 28, fontWeight: '900', color: '#111', marginBottom: 16, lineHeight: 36 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  
  actionSection: { marginTop: 10 },
  
  loadingBox: { padding: 40, alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 24 },
  loadingText: { marginTop: 16, fontSize: 14, color: '#6B7280', fontWeight: '500' },
  
  buyBox: { backgroundColor: '#F9FAFB', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#F3F4F6' },
  priceLabel: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 4 },
  priceText: { fontSize: 32, fontWeight: '900', color: '#111', marginBottom: 20 },
  buyButton: { backgroundColor: '#111', paddingVertical: 18, borderRadius: 100, alignItems: 'center' },
  buyButtonText: { color: '#D4F93D', fontSize: 16, fontWeight: '800' },
  guaranteeText: { textAlign: 'center', marginTop: 16, fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  
  ownedBox: { backgroundColor: '#F0FFF4', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#DCFCE7' },
  ownedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  ownedText: { fontSize: 16, fontWeight: '700', color: '#166534', marginLeft: 10 },
  playButton: { backgroundColor: '#D4F93D', flexDirection: 'row', paddingVertical: 18, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  playButtonText: { color: '#111', fontSize: 16, fontWeight: '800' },
});