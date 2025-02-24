const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  return { message: "Đăng ký thành công!" };
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Không tìm thấy tài khoản");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Sai mật khẩu");
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return { token };
}

module.exports = {
  register,
  login
};