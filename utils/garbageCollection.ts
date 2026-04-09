import AsyncStorage from '@react-native-async-storage/async-storage';

export const runGarbageCollection = async () => {
    try {
        const lastRun = await AsyncStorage.getItem('GC_LAST_RUN');
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Chỉ quét xoá rác 1 lần duy nhất mỗi ngày lúc boot app để không làm chậm hiệu năng
        if (lastRun === todayStr) return;
        
        const keys = await AsyncStorage.getAllKeys();
        
        // Lọc ra các key lưu lịch sử tập giãn cơ: MISSION_DONE_YYYY-MM-DD_exId
        const missionKeys = keys.filter(k => k.startsWith('MISSION_DONE_'));
        
        // Lấy ngưỡng lùi lại 30 ngày
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - 30);
        const thresholdStr = thresholdDate.toISOString().split('T')[0];
        
        const keysToDelete = missionKeys.filter(key => {
             const parts = key.split('_');
             // Format: MISSION(0) _ DONE(1) _ DATE(2) _ EXERCISE_ID(3)
             if (parts.length >= 3) {
                 const datePart = parts[2]; 
                 // So sánh chuỗi ngày YYYY-MM-DD: Xoá nếu bị nhỏ hơn (đứng trước) ngày giới hạn
                 if (datePart < thresholdStr) return true;
             }
             return false;
        });
        
        if (keysToDelete.length > 0) {
            await AsyncStorage.multiRemove(keysToDelete);
            console.log(`[GC Optimization] Đã dọn dẹp ${keysToDelete.length} tệp dữ liệu rác cũ mèm (>30 ngày) khỏi máy!`);
        }
        
        // Cập nhật lại ngày quét cuối
        await AsyncStorage.setItem('GC_LAST_RUN', todayStr);
    } catch (e) {
        console.log('[GC Error] Lỗi khi dọn rác bộ nhớ:', e);
    }
};
