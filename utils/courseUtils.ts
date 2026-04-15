/**
 * Chuyển đổi nhãn cấp độ khóa học sang tiếng Việt
 * @param level Cấp độ gốc từ API (ví dụ: 'Recover', 'Relaxation')
 * @returns Nhãn tiếng Việt tương ứng
 */
export const getCourseLevelLabel = (level: string): string => {
  if (!level) return "";
  const l = level.toLowerCase();
  
  switch (l) {
    case 'recover':
      return 'Phục hồi';
    case 'relaxation':
      return 'Giãn cơ';
    default:
      // Trả về level gốc nếu không có trong danh sách ánh xạ, 
      // nhưng viết hoa chữ cái đầu cho đẹp
      return level.charAt(0).toUpperCase() + level.slice(1);
  }
};
