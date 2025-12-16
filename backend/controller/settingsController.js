const Settings = require("../model/settingsModel");

const createNewSetting = async (req, res) => {
  try {
    const createSetting = new Settings(req.body);
    const saveSetting = await createSetting.save();

    res.status(201).json({
      success: true,
      message: "School information saved successfully",
      data: saveSetting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to save school information",
    });
  }
};

const getAllSetting = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { getAllSetting, createNewSetting };
