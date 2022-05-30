import express from "express";
import cors from "cors";
import path from "path";
import env from "dotenv";
import cron from "node-cron";
import token_routes from "./routes/token_routes";
import conn from "./prisma/conn";
env.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));

const cetakText = cron.schedule("*/1 * * * * *", async () => {
  let token = await conn.token.findMany();

  if (token.length == 0) {
    return;
  }

  let checkToken = await token.forEach((e) => {
    if (e.expiritedAt < Date.now()) {
      conn.token
        .delete({
          where: {
            id: e.id,
          },
        })
        .then((result) => {
          console.info("Token Has Been DESTROYED !!");
          return true;
        })
        .catch((err) => console.error(err));
    }
  });
});

app.use("/api", token_routes);

app.listen(PORT, () => {
  console.log(`
       L I S T E N  P O R T ${PORT}`);
  cetakText;
});
