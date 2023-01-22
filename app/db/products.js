module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      amount: { type: Number, default: 0 },
      description: { type: String, default: '' }
    },
    {
      collection: "products",
      autoCreate: true,
      timestamps: true
    }
  );

  const Products = mongoose.model("products", schema);
  return Products;
};
