async function addPromotion(name, discount, description) {
    const promotion = new Promotion({ name, discount, description });
    await promotion.save();
    return { message: "Khuyến mãi đã được thêm!" };
  }
  
  module.exports = {
    addPromotion
  };