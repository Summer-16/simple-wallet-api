module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      type: { type: String, default: '' },
      description: { type: String, default: '' },
      balance: { type: Number, default: 0 },
      walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'wallet' },
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    },
    {
      collection: "transactions",
      autoCreate: true,
      timestamps: true
    }
  );

  const Transactions = mongoose.model("transactions", schema);
  return Transactions;
};
