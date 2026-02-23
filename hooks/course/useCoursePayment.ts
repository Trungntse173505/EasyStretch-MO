// hooks/course/useCoursePayment.ts
import { useCallback, useState } from 'react';
import courseApi, { PaymentPayload } from '../../api/courseApi';

export const useCoursePayment = () => {
  const [hasBought, setHasBought] = useState<boolean>(false);
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
  const [errorPayment, setErrorPayment] = useState<string | null>(null);

  // Hàm 1: Kiểm tra quyền sở hữu khóa học
  const checkOwnership = useCallback(async (courseId: string) => {
    try {
      setLoadingPayment(true);
      setErrorPayment(null);
      
      const res = await courseApi.checkPaymentStatus(courseId);
      
      // Nếu gọi thành công (Status 200), user đã mua khóa học
      if (res.status === 200) {
        setHasBought(true);
      }
    } catch (err: any) {
      // Nếu BE trả về lỗi (403, 404...) tức là chưa mua hoặc không tìm thấy lịch sử
      setHasBought(false);
      console.log("Khóa học này chưa được mua.");
    } finally {
      setLoadingPayment(false);
    }
  }, []);

  // Hàm 2: Gọi API tạo thanh toán PayOS
  const handleCreatePayment = async (payload: PaymentPayload) => {
    try {
      setLoadingPayment(true);
      setErrorPayment(null);
      
      const data = await courseApi.createPayment(payload);
      return data; // Trả về dữ liệu (chứa link checkout) để UI tự động mở trình duyệt
      
    } catch (err: any) {
      console.error("Lỗi khi tạo giao dịch:", err);
      setErrorPayment("Không thể tạo link thanh toán lúc này. Vui lòng thử lại!");
      return null;
    } finally {
      setLoadingPayment(false);
    }
  };

  return {
    hasBought,
    loadingPayment,
    errorPayment,
    checkOwnership,
    handleCreatePayment
  };
};