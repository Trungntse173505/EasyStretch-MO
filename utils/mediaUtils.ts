/**
 * Tiện ích xử lý và tối ưu hóa Media (Hình ảnh và Video)
 */

export const transformMediaUrl = (url: string | undefined | null, type: 'video' | 'image' = 'image'): string | undefined => {
  if (!url || typeof url !== 'string' || url.trim() === '') return undefined;

  const isCloudinary = url.includes('cloudinary.com') || url.includes('res.cloudinary.com');

  if (isCloudinary) {
    // Nếu là link Cloudinary, chèn f_auto,q_auto để tối ưu hóa định dạng và chất lượng tự động
    // Cấu trúc: .../upload/[transformations]/v123.../...
    if (url.includes('/upload/') && !url.includes('f_auto')) {
      // Đối với ảnh có thể thêm giới hạn chiều rộng để nhẹ hơn, video thì chỉ cần f_auto,q_auto
      const transformations = type === 'image' ? 'f_auto,q_auto,w_800,c_limit' : 'f_auto,q_auto';
      return url.replace('/upload/', `/upload/${transformations}/`);
    }
  }

  // Loại bỏ logic Google Drive vì đã chuyển sang Cloudinary
  return url;
};
