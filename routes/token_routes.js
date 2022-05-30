import express from "express";
import path from "path";
import env from "dotenv";
import jwt from "jsonwebtoken";
import cryptoJs from "crypto-js";
import conn from "../prisma/conn";
import moment from "moment";
env.config();

const token_routes = express.Router();

token_routes.post("/token_create", async (req, res) => {
  try {
    const data = await req.body;
    const sign = await jwt.sign(data, process.env.API_SECRET);
    const token = await cryptoJs.AES.encrypt(
      sign,
      process.env.API_SECRET
    ).toString();
    const postToken = await conn.token.create({
      data: {
        token: token,
        expiritedAt: new Date(moment().add(20, "s")),
      },
    });
    res.status(200).json({
      success: true,
      msg: "Berhasil Buat Token",
      query: token,
    });
  } catch (error) {
    res.status(500).json *
      +{
        success: false,
        error: error.message,
      };
  }
});

export default token_routes;
