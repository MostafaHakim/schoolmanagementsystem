const User = require("../model/userModel");

const createNewUser = async (req, res) => {
  try {
    const { userName, password, userType, userMobile, userEmail } = req.body;
    if (!userName || !password || !userType || !userMobile || !userEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ userType: "admin" });
    if (user && user.userType === userType) {
      return res.status(400).json({
        success: false,
        massage: "user already exist",
      });
    }
    const createUser = new User({
      userName,
      password,
      userType,
      userMobile,
      userEmail,
    });
    const saveUser = await createUser.save();
    if (!saveUser) {
      return res.status(400).json({ message: "Something Wrong", error });
    }
    res.status(201).json({
      success: true,
      massage: "user created successfully",
      data: saveUser,
    });
  } catch (error) {
    console.error(error);
  }
};

const getUserByRole = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ userName });
    if (user.password !== password) {
      return res.status(400).json({ message: "Password Dose Not match" });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("获取事件错误:", error);
    res.status(500).json({
      success: false,
      message: error.message || "服务器错误",
    });
  }
};

module.exports = { createNewUser, getUserByRole };
