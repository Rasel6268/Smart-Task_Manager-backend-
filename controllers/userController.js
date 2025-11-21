const User = require("../models/User");
exports.CreateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check existing user
    const isAlready = await User.findOne({ email });

    if (isAlready) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // Create user
    const newUser = new User({ name, email });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User Created Successfully!!",
      user: newUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  res.send("this api return all the user");
};
