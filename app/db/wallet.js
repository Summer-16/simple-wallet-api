module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      balance: { type: Number, default: 0 },
      name: { type: String, default: '' }
    },
    {
      collection: "wallet",
      autoCreate: true,
      timestamps: true
    }
  );

  schema.pre('save', function (next) {
    this.balance = Number(this.balance).toFixed(4);
    next();
  });

  schema.pre('update', function (next) {
    this.balance = Number(this.balance).toFixed(4);
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    this.balance = Number(this.balance).toFixed(4);
    next();
  });

  const Wallet = mongoose.model("wallet", schema);
  return Wallet;
};
