import User from "../models/UserModel.js"
import express from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv";
import bcrypt from "bcrypt"
import userValidationSchema from "../validators/userValidator.js"
dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
  destination: "techlift"
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Working 

router.post("/signup", upload.single('image'), async (req, res) => {
  try {
    
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { name, email, password, isAdmin } = req.body;
    const image = req.file;
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!image) {
      return res.status(400).json({ error: 'Please upload an image!' });
    }

    cloudinary.uploader.upload(image.path, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to upload image!', err });
      }

      const imageUrl = result.secure_url;


      const user = new User({ name, email, password: hashedPassword, isAdmin, imageUrl });

      user.save()
        .then(userData => {
          res.status(201).json({ message: "User created successfully.", data: userData });
        })
        .catch(error => {
          res.status(400).json({ message: "User not created .", error });
        });
    });
  } catch (error) {
    res.status(400).json({ message: "User not created .", error });
  }
});

// Working

router.get("/users", async (req, res) => {
  try {
    const userData = await User.find()
    res.status(200).send({ messsage: "Users data fetched successfully.", data: userData })
  } catch (error) {
    res.status(404).send({ messsage: "Users data not found.", error })
  }
})

// Working 

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params
    const userData = await User.findById(id)
    res.status(200).send({ messsage: "Single user data fetched successfully.", data: userData })
  } catch (error) {
    res.status(404).send({ messsage: "Single user data fetched successfully.", error })
  }
})

// Working

router.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.status(201).send({ messsage: "User deleted successfully." })
  } catch (error) {
    res.status(201).send({ messsage: "User not deleted.", error })
  }
})


// Working

router.put("/user/:id", upload.single("image"), async (req, res) => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { id } = req.params;
    const { name, email, password, isAdmin } = req.body;
    // console.log(payload)
    const image = req.file; // Get the uploaded image

    if (!image) {
      return res.status(400).json({ error: "Please upload an image!" });
    }

    cloudinary.uploader.upload(image.path, (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Failed to upload image!", error });
      }

      const imageUrl = result.secure_url;


      // Update the user data with the new values
      const updatedData = {
        name: name,
        email: email,
        password: password,
        isAdmin: isAdmin,
        imageUrl: imageUrl, // Assign the new image URL
      };

      // Update the user document in the database
      User.findByIdAndUpdate(id, updatedData, { new: true }) // Set { new: true } to return the updated document
        .then((userData) => {
          res.status(200).json({ message: "User updated successfully.", data: userData });
        })
        .catch((error) => {
          res.status(400).json({ message: "Couldn't update user.", error });
        });
    });
  } catch (error) {
    res.status(400).json({ message: "Couldn't update user.", error });
  }
});

// Working

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        res.status(200).json({ message: "User login successful.", user });
      } else {
        res.status(401).json({ message: "Invalid email or password." });
      }
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
});



export default router;