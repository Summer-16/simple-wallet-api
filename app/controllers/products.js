const db = require("../db");
const Products = db.products;

exports.list = async (req, res) => {
  try {

    const { id } = { ...req.params, ...req.body };
    const filter = {};

    if (id) {
      filter._id = id;
    }

    const result = await Products.find(filter);
    return res.json({ success: true, message: "", data: result });

  } catch (err) {
    console.error("Error in Product list", err);
    return res.json({ success: false, message: err.message || "An error occurred in getting Product list" });
  }
}