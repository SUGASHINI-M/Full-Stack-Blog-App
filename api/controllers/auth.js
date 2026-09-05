import { users } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const registerUser = async () => {
    const existingUser = await users.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (existingUser) return res.status(409).json("User already exists!");

    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    await users.insertOne({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      img: null,
    });
    return res.status(200).json("User has been created.");
  };

  registerUser().catch((err) => {
    console.error("Register DB error:", err.message);
    return res.status(500).json("Database error. Try again.");
  });
};

export const login = (req, res) => {
  const loginUser = async () => {
    const user = await users.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("User not found!");
    if (!bcrypt.compareSync(req.body.password, user.password))
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET);
    const { password, _id, ...other } = user;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ ...other, id: _id.toString() });
  };

  loginUser().catch((err) => {
    console.error("Login DB error:", err.message);
    return res.status(500).json("Database error. Check the api folder and try again.");
  });
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true
  }).status(200).json("User has been logged out.")
};
