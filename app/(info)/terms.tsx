import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsOfUseScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Điều Khoản & Chính Sách</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainTitle}>ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ (TERMS OF USE)</Text>
        <Text style={styles.paragraph}>
          Chào mừng bạn đến với Ứng dụng Giãn cơ & Tập luyện (sau đây gọi tắt là "Ứng dụng" hoặc "Chúng tôi"). Bằng việc tải xuống, cài đặt, truy cập hoặc sử dụng Ứng dụng, bạn đồng ý tuân thủ các Điều khoản sử dụng dưới đây. Vui lòng đọc kỹ trước khi bắt đầu sử dụng.
        </Text>

        <View style={styles.divider} />

        {/* Section 1 */}
        <Text style={styles.sectionTitle}>1. MIỄN TRỪ TRÁCH NHIỆM Y TẾ (QUAN TRỌNG)</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>
            <Text style={styles.boldText}>Không phải lời khuyên y tế:</Text> Ứng dụng cung cấp các bài tập thể chất, bài tập giãn cơ và thông tin chăm sóc sức khỏe mang tính chất tham khảo. Chúng tôi <Text style={styles.boldText}>không</Text> cung cấp các chẩn đoán, phác đồ điều trị hay lời khuyên y tế chuyên môn.
          </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>
            <Text style={styles.boldText}>Rủi ro chấn thương:</Text> Việc tập luyện luôn tiềm ẩn rủi ro chấn thương. Bạn hoàn toàn chịu trách nhiệm về cơ thể và sức khỏe của mình. Nếu bạn có tiền sử bệnh lý, chấn thương cột sống, xương khớp, tim mạch hoặc đang mang thai, <Text style={styles.boldText}>hãy tham khảo ý kiến bác sĩ trước khi bắt đầu bất kỳ bài tập nào.</Text>
          </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>
            <Text style={styles.boldText}>Dừng tập khi thấy đau:</Text> Vui lòng dừng tập ngay lập tức và tìm kiếm sự trợ giúp y tế nếu bạn cảm thấy đau nhức bất thường, chóng mặt, buồn nôn hoặc khó thở trong quá trình sử dụng Ứng dụng.
          </Text>
        </View>

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>2. TÀI KHOẢN VÀ BẢO MẬT</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Để sử dụng các tính năng cá nhân hóa (Nhiệm vụ, Điểm thưởng), bạn cần tạo tài khoản.</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Bạn cam kết cung cấp thông tin chính xác và có trách nhiệm bảo mật thông tin đăng nhập của mình (tên đăng nhập, mật khẩu).</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Bạn phải chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của mình. Nếu phát hiện truy cập trái phép, vui lòng thông báo ngay cho chúng tôi để được hỗ trợ.</Text>
        </View>

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>3. GÓI CƯỚC, THANH TOÁN VÀ HOÀN TIỀN</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>
             <Text style={styles.boldText}>Nội dung Miễn phí & Trả phí:</Text> Ứng dụng cung cấp cả bài tập "Miễn phí" (Free) và bài tập độc quyền cho "Hội viên" (Member - Premium).
          </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>
             <Text style={styles.boldText}>Thanh toán:</Text> Để mở khóa các bài tập cho Hội viên, bạn cần đăng ký các gói trả phí theo tháng/năm. Thanh toán sẽ được trừ trực tiếp qua cổng thanh toán được tích hợp sẵn hoặc thông qua App Store/Google Play.
          </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>
             <Text style={styles.boldText}>Tự động gia hạn:</Text> Gói cước có thể tự động gia hạn vào cuối chu kỳ. Bạn có thể Hủy tự động gia hạn ít nhất 24 giờ trước khi chu kỳ tiếp theo bắt đầu.
          </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>
             <Text style={styles.boldText}>Hoàn tiền:</Text> Việc hủy gói cước sẽ không được hoàn trả lại khoảng thời gian chưa sử dụng (trừ khi có quy định khác tùy theo nền tảng của Apple/Google).
          </Text>
        </View>

        {/* Section 4 */}
        <Text style={styles.sectionTitle}>4. QUY ĐỊNH VỀ SỬ DỤNG</Text>
        <Text style={styles.paragraph}>Bạn đồng ý sử dụng Ứng dụng cho mục đích cá nhân, phi thương mại. Bạn tuyệt đối KHÔNG được:</Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Sao chép, tải xuống trái phép, phân phối lại hoặc bán các video/nội dung bài tập của hệ thống.</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Sử dụng các phần mềm tự động (bot, tool...) để cheat điểm thưởng, vượt ải nhiệm vụ hoặc hack hệ thống.</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>Xâm phạm hoặc phá hoại hệ thống an ninh mạng của Ứng dụng.</Text>
        </View>
        <Text style={[styles.paragraph, { marginTop: 8 }]}>Nếu phát hiện vi phạm, Chúng tôi có quyền đơn phương khóa tài khoản của bạn vĩnh viễn mà không cần hoàn tiền hay báo trước.</Text>

        {/* Section 5 */}
        <Text style={styles.sectionTitle}>5. BẢN QUYỀN VÀ SỞ HỮU TRÍ TUỆ</Text>
        <Text style={styles.paragraph}>
          Toàn bộ nội dung trên Ứng dụng bao gồm: văn bản, hình ảnh động, video bài tập, logo, mã nguồn, thuật toán xếp lịch tập (Game Giãn cơ) là tài sản trí tuệ thuộc quyền sở hữu của Chúng tôi và được pháp luật bảo hộ.
        </Text>

        {/* Section 6 */}
        <Text style={styles.sectionTitle}>6. SỬA ĐỔI ĐIỀU KHOẢN</Text>
        <Text style={styles.paragraph}>
          Chúng tôi có thể cập nhật, sửa đổi toàn bộ hoặc một phần của Điều Khoản Sử Dụng này theo thời gian. Phiên bản mới sẽ có hiệu lực ngay khi được đăng tải công khai trên Ứng dụng. Việc bạn tiếp tục sử dụng Ứng dụng đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
        </Text>

        {/* Section 7 */}
        <Text style={styles.sectionTitle}>7. LIÊN HỆ</Text>
        <Text style={styles.paragraph}>
          Nếu bạn có bất kỳ thắc mắc nào liên quan đến Hỗ trợ tài khoản, Hủy gói cước hoặc Góp ý bài tập, vui lòng liên hệ với bộ phận CSKH của chúng tôi qua:
        </Text>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Email hỗ trợ: <Text style={styles.boldText}>thaingocdg2003@gmail.com</Text></Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Hotline: <Text style={styles.boldText}>0909090909</Text></Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>Fanpage/Website: <Text style={{ color: '#0EA5E9', textDecorationLine: 'underline' }}>https://www.facebook.com/people/EasyStretch/61587162646480</Text></Text>
        </View>

        <View style={{ height: 20 }} />
        <Text style={styles.footerText}>*Cập nhật lần cuối: Ngày 08 tháng 04 năm 2026*</Text>
        
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  
  scrollContent: { padding: 24, paddingBottom: 60 },
  
  mainTitle: { fontSize: 24, fontWeight: "900", color: "#111", marginBottom: 16, lineHeight: 32, letterSpacing: -0.5 },
  paragraph: { fontSize: 15, color: "#475569", lineHeight: 24, marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 24 },
  
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111", marginTop: 16, marginBottom: 12 },
  
  listItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start', paddingRight: 10 },
  bullet: { fontSize: 18, color: "#111", fontWeight: '900', marginRight: 10, marginTop: -2 },
  listText: { fontSize: 15, color: "#475569", lineHeight: 24, flex: 1 },
  
  boldText: { fontWeight: "800", color: "#111" },
  footerText: { fontSize: 14, color: "#94A3B8", fontStyle: "italic", textAlign: "center", marginTop: 20 }
});
