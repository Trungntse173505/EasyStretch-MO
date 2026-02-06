//utils/validators.ts
export const isEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email.trim());

export const validateEmail = (email: string) => {
  if (!email.trim()) return "Vui lòng nhập email";
  return isEmail(email) ? "" : "Email không hợp lệ";
};

export const validatePassword = (password: string) => {
  if (!password.trim()) return "Vui lòng nhập mật khẩu";
  if (password.replace(/\*/g, "").length > 0 && password.length < 6)
    return "Mật khẩu tối thiểu 6 ký tự";
  return "";
};

export const validateConfirmPassword = (password: string, confirm: string) => {
  if (!confirm.trim()) return "Vui lòng xác nhận mật khẩu";
  if (!password.trim()) return "Vui lòng nhập mật khẩu";
  return confirm !== password ? "Mật khẩu không khớp!" : "";
};
