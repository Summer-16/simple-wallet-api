const db = require("../db");
const Wallet = db.wallet;
const Transaction = db.transactions;
const Products = db.products;

exports.create = async (req, res) => {
  try {
    const { balance, name } = req.body;

    if (!name) {
      throw new Error("Name must be provided");
    }

    const alreadyExists = await Wallet.findOne({ name });
    if (alreadyExists) {
      throw new Error("A wallet with the same name already exists");
    }

    const wallet = new Wallet({
      balance: balance ? balance : 0,
      name: name,
    })

    const resultWal = await wallet.save();

    const transaction = new Transaction({
      type: "Wallet Created",
      description: `A new Wallet is created by the name of ${name}`,
      walletId: resultWal._id,
      balance: resultWal.balance
    })
    const resultTxn = await transaction.save();
    const responseJSON = {
      walletId: resultWal._id,
      balance: resultWal.balance,
      transactionId: resultTxn._id,
      name: resultWal.name,
      date: new Date()
    }

    return res.json({ success: true, message: "New wallet created", data: responseJSON });

  } catch (err) {
    console.error("Error in create wallet", err);
    return res.json({ success: false, message: err.message || "An error occured in create wallet" });
  }
}

exports.detail = async (req, res) => {
  try {

    const { id } = req.params;
    if (!id) {
      throw new Error("Id must be provided");
    }

    const result = await Wallet.findById(id);
    const responseJSON = {
      walletId: result._id,
      balance: result.balance,
      name: result.name,
      createdAt: new Date(result.createdAt)
    }
    return res.json({ success: true, message: "", data: responseJSON });

  } catch (err) {
    console.error("Error in wallet detail", err);
    return res.json({ success: false, message: err.message || "An error occured in getting wallet details" });
  }
}

exports.addCredit = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const { id } = req.params;

    if (!amount) {
      throw new Error("Amount must be provided");
    }
    if (!description) {
      throw new Error("Description must be provided");
    }

    const oldRecord = await Wallet.findById(id);
    const newBalance = (Number(oldRecord.balance) + Number(amount)).toFixed(4);

    let updateRes = await Wallet.findOneAndUpdate({ _id: id }, { balance: newBalance }, { returnOriginal: false });

    console.log(updateRes)

    const transaction = new Transaction({
      type: "Credit Added",
      description: description || `${amount} credited in wallet of ${oldRecord.name}`,
      walletId: oldRecord._id,
      balance: updateRes.balance
    })
    const resultTxn = await transaction.save();
    const responseJSON = {
      balance: updateRes.balance,
      transactionId: resultTxn._id,
      description: resultTxn.description,
      type: resultTxn.type,
      createdAt: new Date(resultTxn.createdAt)
    }

    return res.json({ success: true, message: "Credit added", data: responseJSON });

  } catch (err) {
    console.error("Error in create wallet", err);
    return res.json({ success: false, message: err.message || "An error occurred in add Credit" });
  }
}


exports.purchase = async (req, res) => {
  try {
    const { productId } = req.body;
    const { id } = req.params;

    if (!productId) {
      throw new Error("Product Id must be provided");
    }

    const walletData = await Wallet.findById(id);
    if (!walletData) {
      throw new Error("Wallet not found");
    }
    const productData = await Products.findById(productId);
    if (!productData) {
      throw new Error("Wallet not found");
    }

    if (Number(productData.amount) > Number(walletData.balance)) {
      throw new Error("You do not have sufficient balance to purchase this product!");
    }

    const newBalance = (Number(walletData.balance) - Number(productData.amount)).toFixed(4);
    let updateRes = await Wallet.findOneAndUpdate({ _id: id }, { balance: newBalance }, { returnOriginal: false });

    const transaction = new Transaction({
      type: "Debit: Product Purchased",
      description: `${productData.amount} debited from wallet, ${productData.description} Purchased`,
      walletId: walletData._id,
      productId: productData._id,
      balance: updateRes.balance
    })
    const resultTxn = await transaction.save();

    const responseJSON = {
      balance: updateRes.balance,
      transactionId: resultTxn._id,
      description: resultTxn.description,
      type: resultTxn.type,
      productId: resultTxn.productId,
      createdAt: new Date(resultTxn.createdAt)
    }

    return res.json({ success: true, message: "Product Purchased", data: responseJSON });

  } catch (err) {
    console.error("Error in Product Purchase", err);
    return res.json({ success: false, message: err.message || "An error occurred in Purchasing Product" });
  }
}


exports.listTxn = async (req, res) => {
  try {

    const { id } = req.params;
    const { page, limit } = req.body;
    const filter = { "walletId": id };
    const pagination = {};

    if ((page || page === 0) && limit) {
      pagination.skip = Number(page) * Number(limit);
      pagination.limit = Number(limit);
    }

    const result = await Transaction.find(filter, {}, pagination);
    return res.json({ success: true, message: "", data: result });

  } catch (err) {
    console.error("Error in Transaction list", err);
    return res.json({ success: false, message: err.message || "An error occurred in getting Transaction list" });
  }
}