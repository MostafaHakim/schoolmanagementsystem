const Fees = require("../model/feesModel");

const createFee = async (req, res) => {
  try {
    const { feesName, feesAmount, feesClass } = req.body;

    // Check if fee already exists
    const isExist = await Fees.findOne({ feesName, feesClass });
    if (isExist) {
      return res
        .status(400)
        .json({ message: "Fee already exists for this class" });
    }

    // Create fee
    const fee = new Fees({
      feesName,
      feesAmount,
      feesClass,
    });
    const saveFee = await fee.save();

    res.status(201).json({ message: "Fee created successfully", saveFee });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllFees = async (req, res) => {
  try {
    const getFee = await Fees.find();
    res.status(200).json(getFee);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteFees = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFees = await Fees.findByIdAndDelete(id);

    if (!deletedFees) {
      return res.status(404).json({ message: "Fees not found" });
    }

    res.status(200).json({ message: "Fees deleted successfully", deletedFees });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createFee, getAllFees, deleteFees };
