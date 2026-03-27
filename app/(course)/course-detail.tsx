import { useCourseOwnership } from '@/hooks/course/useCourseOwnership';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, AppState, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id, title, img_url } = useLocalSearchParams();
  const { hasBought, loading, checkOwnership } = useCourseOwnership();

  useEffect(() => {
    if (id) checkOwnership(id as string);
    
    // Tự động kiểm tra lại khi user từ trình duyệt (web) quay trở lại app
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && id) checkOwnership(id as string);
    });
    return () => subscription.remove();
  }, [id, checkOwnership]);

  const handleShowGuidance = async () => {
    const websiteUrl = "myfitness-web.com";

    Alert.alert(
      "Khóa học chưa kích hoạt", 
      `Để bắt đầu tập luyện, bạn cần kích hoạt khóa học này.\n\nVui lòng truy cập website:\n${websiteUrl}\nđể quản lý tài khoản và đăng ký.`,
      [
        { text: "Đóng", style: "cancel" },
        { 
          text: "Sao chép Website", 
          onPress: async () => {
            await Clipboard.setStringAsync(websiteUrl);
            Alert.alert("Thành công", "Đã sao chép địa chỉ website. Bạn hãy mở trình duyệt (Safari/Chrome) và dán vào nhé!");
          } 
        }
      ]
    );
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
            <Ionicons name="leaf" size={14} color="#10B981" style={{ marginRight: 6 }} />
            <Text style={styles.tagText}>Khóa phục hồi chuyên sâu</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>Khóa học này sẽ giúp bạn giãn cơ sâu, giảm đau mỏi nhanh chóng và cải thiện tư thế chỉ với 15 phút mỗi ngày với sự kết hợp của Yoga và giãn cơ cơ bản.</Text>
        </ScrollView>
      </View>

      {/* FLOATING ACTION BOTTOM */}
      <View style={styles.bottomBar}>
        {loading ? (
          <ActivityIndicator size="large" color="#111" />
        ) : hasBought ? (
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
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
            <View style={{ flex: 1 }}>
              <Text style={styles.priceLabel}>Trạng thái</Text>
              <Text style={styles.notOwnedText}>Chưa kích hoạt</Text>
            </View>
            <TouchableOpacity style={styles.buyButton} onPress={handleShowGuidance} activeOpacity={0.9}>
              <Text style={styles.buyButtonText}>Kích hoạt trên Web</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerCover: { width: '100%', height: 380 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.4)' },
  backButtonSafeArea: { position: 'absolute', top: 0, left: 20, zIndex: 10 },
  backButton: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },

  contentContainer: { flex: 1, marginTop: -50, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 15, elevation: 10 },
  dragPill: { width: 48, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 28 },

  tagWrap: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#ECFDF5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginBottom: 16 },
  tagText: { fontSize: 13, fontWeight: '800', color: '#10B981' },

  title: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginBottom: 12, lineHeight: 36, letterSpacing: -0.5 },
  description: { fontSize: 16, color: '#64748B', lineHeight: 26, marginBottom: 28 },

  sectionHeader: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  featureBox: { gap: 14, backgroundColor: '#F8FAFC', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIconWrap: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  featureText: { fontSize: 15, color: '#334155', fontWeight: '600', flexShrink: 1 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 18, marginHorizontal: 4, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  statIcon: { marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },

  bottomBar: { position: 'absolute', bottom: 10, width: '100%', backgroundColor: '#FFF', paddingHorizontal: 24, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 24 : 40, borderTopLeftRadius: 36, borderTopRightRadius: 36, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 20, borderWidth: 1, borderColor: '#F8FAFC' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  ownedText: { fontSize: 14, color: '#10B981', fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
  readyText: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  playButton: { backgroundColor: '#D4F93D', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 18, borderRadius: 100, shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  playButtonText: { color: '#1E293B', fontSize: 16, fontWeight: '900' },

  priceLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  notOwnedText: { fontSize: 22, fontWeight: '900', color: '#64748B', letterSpacing: -0.5 },
  buyButton: { backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 18, borderRadius: 100, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  buyButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});