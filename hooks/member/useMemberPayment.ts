// hooks/member/useMemberPayment.ts
import { useCallback, useState } from 'react';
import courseApi, { PaymentPayload } from '../../api/courseApi';

const VIP_MEMBER_ID = "960e3154-51cd-487a-a8d6-570bb8aa1b27";
const VIP_PRICE = 99000;

export const useMemberPayment = () => {
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
  const [errorPayment, setErrorPayment] = useState<string | null>(null);

  const handleUpgradeVip = useCallback(async (returnUrl: string, cancelUrl: string) => {
    try {
      setLoadingPayment(true);
      setErrorPayment(null);

      const payload: PaymentPayload = {
        amount: VIP_PRICE,
        description: "Nâng cấp Member VIP",
        items: [
          {
            name: VIP_MEMBER_ID,
            quantity: 1,
            price: VIP_PRICE,
          },
        ],
        returnUrl,
        cancelUrl,
      };

      const data = await courseApi.createPayment(payload);
      return data;
    } catch (err: any) {
      console.error("Lỗi khi tạo giao dịch VIP:", err);
      setErrorPayment("Không thể tạo link thanh toán lúc này. Vui lòng thử lại!");
      return null;
    } finally {
      setLoadingPayment(false);
    }
  }, []);

  return {
    loadingPayment,
    errorPayment,
    handleUpgradeVip,
  };
};