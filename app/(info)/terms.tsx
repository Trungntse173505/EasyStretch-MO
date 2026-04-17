import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsOfUseScreen() {
  const router = useRouter();

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log("Cannot open URL", error);
    }
  };

  const TermCard = ({ icon, title, children, iconBg = "#F1F5F9", iconColor = "#111" }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Điều Khoản Sử Dụng</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.welcomeBox}>
          <Ionicons name="hand-right" size={28} color="#D4F93D" style={{ marginBottom: 12 }} />
          <Text style={styles.mainTitle}>Chào mừng bạn đến với EasyStretch!</Text>
          <Text style={styles.welcomeDesc}>
            Bằng việc tải xuống, cài đặt hoặc sử dụng Ứng dụng, bạn đồng ý tuân thủ các Điều khoản dưới đây. Vui lòng đọc kỹ để chúng ta cùng tạo ra một cộng đồng tập luyện văn minh.
          </Text>
        </View>

        <TermCard icon="warning" title="1. Miễn Trừ Y Tế (Quan Trọng)" iconBg="#FEF2F2" iconColor="#EF4444">
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>• Không phải lời khuyên y tế:</Text> Chúng tôi cung cấp các bài tập mang tính chất tham khảo, <Text style={styles.boldText}>không</Text> thay thế chẩn đoán hay phác đồ điều trị chuyên môn.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>• Rủi ro chấn thương:</Text> Việc tập luyện luôn tiềm ẩn rủi ro. Hãy tham khảo ý kiến bác sĩ nếu bạn có bệnh lý nề, bệnh cột sống, tim mạch hoặc đang mang thai.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>• Dừng tập khi đau:</Text> Dừng ngay lập tức nếu thấy đau nhức bất thường, chóng mặt hay khó thở.
          </Text>
        </TermCard>

        <TermCard icon="shield-checkmark" title="2. Tài Khoản & Bảo Mật" iconBg="#F0FDF4" iconColor="#22C55E">
          <Text style={styles.paragraph}>
             Để tích lũy điểm thưởng và tham gia nhiệm vụ, bạn cần đăng ký tài khoản. Bạn cam kết cung cấp thông tin chính xác và tự bảo mật thông tin đăng nhập cá nhân.
          </Text>
          <Text style={styles.paragraph}>
             Nếu phát hiện tài khoản bị xâm nhập trái phép, hãy báo ngay cho chúng tôi để được hỗ trợ kịp thời.
          </Text>
        </TermCard>

        <TermCard icon="card" title="3. Gói Cước & Thanh Toán" iconBg="#EFF6FF" iconColor="#3B82F6">
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>• Miễn phí & Trả phí:</Text> Chúng tôi có bài tập Miễn phí (Free) và bài tập VIP dành riêng cho Hội viên (Premium).
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>• Thanh toán & Gia hạn:</Text> Gói Hội viên có thể tự động gia hạn vào cuối chu kỳ thanh toán. Bạn có thể Hủy tự động gia hạn ít nhất 24h trước khi chu kỳ tiếp theo bắt đầu.
          </Text>
        </TermCard>

        <TermCard icon="document-text" title="4. Quy Định Sử Dụng" iconBg="#FEFCE8" iconColor="#EAB308">
          <Text style={styles.paragraph}>Bạn đồng ý sử dụng Ứng dụng vì mục đích cá nhân. Tuyệt đối KHÔNG:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>- Sao chép, phát tán trái phép video bài tập ra ngoài.</Text>
            <Text style={styles.bulletItem}>- Dùng phần mềm gian lận (bot, cheat) để lấy điểm thưởng.</Text>
            <Text style={styles.bulletItem}>- Phá hoại hệ thống an ninh mạng của Ứng dụng.</Text>
          </View>
          <Text style={[styles.paragraph, { marginTop: 8, fontStyle: 'italic', color: '#EF4444' }]}>
            Vi phạm có thể dẫn tới khóa tài khoản vĩnh viễn không hoàn tiền.
          </Text>
        </TermCard>

        <TermCard icon="bulb" title="5. Sở Hữu Trí Tuệ" iconBg="#F5F3FF" iconColor="#8B5CF6">
          <Text style={styles.paragraph}>
            Mọi nội dung: văn bản, video, âm thanh, logo và thuật toán xếp lịch nội bộ đều thuộc quyền sở hữu của EasyStretch và được bảo hộ pháp lý.
          </Text>
        </TermCard>

        <TermCard icon="headset" title="6. Hỗ Trợ & Liên Hệ" iconBg="#FFFBEB" iconColor="#F59E0B">
          <Text style={styles.paragraph}>Nếu bạn cần hỗ trợ về tài khoản, hãy liên hệ với đội ngũ CSKH:</Text>
          
          <TouchableOpacity style={styles.contactRow} onPress={() => handleOpenLink("mailto:thaingocdg2003@gmail.com")} activeOpacity={0.7}>
            <Ionicons name="mail" size={20} color="#64748B" />
            <Text style={styles.contactText}>thaingocdg2003@gmail.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactRow} onPress={() => handleOpenLink("tel:0909090909")} activeOpacity={0.7}>
            <Ionicons name="call" size={20} color="#64748B" />
            <Text style={styles.contactText}>Hotline: 0909090909</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={() => handleOpenLink("https://www.facebook.com/people/EasyStretch/61587162646480")} activeOpacity={0.7}>
            <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            <Text style={[styles.contactText, { color: '#1877F2' }]}>Cộng đồng Fanpage</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={() => handleOpenLink("https://www.tiktok.com/@easystretchhiha")} activeOpacity={0.7}>
            <Ionicons name="logo-tiktok" size={20} color="#111" />
            <Text style={[styles.contactText, { color: '#111', fontWeight: '800' }]}>TikTok: @easystretchhiha</Text>
          </TouchableOpacity>
        </TermCard>

        <Text style={styles.footerText}>* Cập nhật lần cuối: 08/04/2026 *</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 3 },
    })
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: "900", color: "#111", letterSpacing: -0.3 },
  
  scrollContent: { padding: 20, paddingTop: 24, paddingBottom: 60 },
  
  welcomeBox: {
    backgroundColor: '#111',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#111', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8
  },
  mainTitle: { fontSize: 22, fontWeight: "900", color: "#FFF", marginBottom: 10, lineHeight: 30 },
  welcomeDesc: { fontSize: 14, color: "#94A3B8", lineHeight: 22, fontWeight: '500' },
  
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconWrapper: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: "800", color: "#111", flex: 1 },
  cardContent: { paddingLeft: 4 },
  
  paragraph: { fontSize: 15, color: "#475569", lineHeight: 24, marginBottom: 12 },
  boldText: { fontWeight: "800", color: "#1E293B" },
  
  bulletList: { paddingLeft: 8, marginVertical: 4 },
  bulletItem: { fontSize: 15, color: "#475569", lineHeight: 24, marginBottom: 6 },
  
  contactRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, marginBottom: 10 },
  contactText: { fontSize: 15, fontWeight: '700', color: '#475569', marginLeft: 12 },
  
  footerText: { fontSize: 13, color: "#94A3B8", fontStyle: "italic", textAlign: "center", marginTop: 24, fontWeight: '600' }
});
