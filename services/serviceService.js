async function bookRoom(userId, roomId, startDate, endDate) {
    const booking = new Booking({ userId, roomId, startDate, endDate });
    await booking.save();
    return "Đặt phòng thành công!";
  }
  
  async function cancelBooking(id) {
    await Booking.findByIdAndDelete(id);
    return "Hủy đặt phòng thành công!";
  }
  
  module.exports = {
    bookRoom,
    cancelBooking
  };