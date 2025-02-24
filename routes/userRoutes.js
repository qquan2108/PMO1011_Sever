const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const router = express.Router();
// [RQ03] Lấy danh sách tất cả người dùng
router.get('/ttusers', async (req, res) => {
  try {
      const users = await User.find().select('-password'); // Loại bỏ mật khẩu để bảo mật
      res.json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
});

router.get('/bookings', async (req, res) => {
  try {
      const customers = await Booking.find().populate('userId').select('userId').distinct('userId');
      const users = await User.find({ _id: { $in: customers } });
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
      const { name, email, password } = req.body;
      let updateData = { name, email };

      // Nếu có password, mã hóa trước khi cập nhật
      if (password) {
          const salt = await bcrypt.genSalt(10);
          updateData.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updatedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });
      
      res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

router.put('/:id/role', async (req, res) => {
  try {
      const { role } = req.body;
      if (!['user', 'staff', 'admin'].includes(role)) {
          return res.status(400).json({ message: "Vai trò không hợp lệ" });
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
      if (!updatedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });

      res.json({ message: "Cập nhật vai trò thành công", user: updatedUser });
  } catch (error) {
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});

// [RQ04] Xóa người dùng
router.delete('/:id', async (req, res) => {
  try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });
      
      res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// [RQ01] Đăng ký người dùng
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Ensure the password is a string
    if (typeof password !== 'string') {
      return res.status(400).json({ message: 'Password must be a string' });
    }

    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Use the hashed password here
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// [RQ02] Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Không tìm thấy tài khoản" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// [RQ10] Xem thông tin phòng đã đặt
router.get('/:userId/bookings', async (req, res) => {
    const bookings = await Booking.find({ user: req.params.userId });
    res.json(bookings);
});

module.exports = router;