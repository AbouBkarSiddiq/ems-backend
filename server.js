import express from "express";
import mongoose from "mongoose";
import router from "./controllers/userController.js"
import dotenv from "dotenv";
import cors from "cors";

const app = express();

dotenv.config();

app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));

app.options('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


app.use(express.json());

app.use("/api", router);

app.get("/", (req, res)=>{
  res.send("hello world")
});

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
      // useCreateIndex: true,
      // useUnifiedTopology: true
  })
  .then(() => console.log('DB Connected'));


const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})