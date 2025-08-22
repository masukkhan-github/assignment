import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


// Signup
export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" ,error: error.message});
  }
};


// Login
export const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" ,error: error.message});
  }
};


// Get Profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({"name":user.name,"email":user.email,"id":user._id});
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    // If no fields were provided
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully",  });
  } catch (error) {
    res.status(500).json({ message: "Server error" ,error: error.message});
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" ,error: error.message});
  }
};
