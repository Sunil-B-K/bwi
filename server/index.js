const express = require("express");
// const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserModel = require("./Models/Users");
// const userModel = require("./path/to/userModel");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

// mongoose.connect(
//   //   "mongodb://localhost:27017"
//   "mongodb+srv://sunilkuligod21:8olFzpfCktKAG0nh@cluster0.89fkcmn.mongodb.net/?retryWrites=true&w=majority/emloyee"
//   //   "mongodb+srv://sunilkuligod21:8olFzpfCktKAG0nh@cluster0.89fkcmn.mongodb.net/employee"
// );

mongoose.connect(
  // "mongodb+srv://sunilkuligod21:8olFzpfCktKAG0nh@cluster0.89fkcmn.mongodb.net/?retryWrites=true&w=majority/emloyee"
  "mongodb+srv://sunilkuligod21:8olFzpfCktKAG0nh@cluster0.89fkcmn.mongodb.net/emloyee"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database is connected");
});
// db();

// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await userModel.create({
//       name,
//       email,
//       password: hashedPassword,
//     });
//     res.json({ status: "ok" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.post("/register", async (req, res) => {
  //   UserModel.create(req.body)
  //     .then((employee) => res.json(employee))
  //     .catch((error) => res.json(error));
  // });
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ name, email, password: hash })
        .then((user) => res.json({ status: "ok" }))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { email: user.email, role: user.role },
            "jut-secret-key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ status: "success", role: user.role });
        } else {
          return res.json("The password is incorrect");
        }
      });
    } else {
      return res.json("No record existed");
    }
  });
});

app.get("/user", async (req, res) => {
  try {
    const userdata = await UserModel.find();
    if (!userdata) {
      return res.status(404).json({ msg: "user is not found" });
    }
    res.status(200).json(userdata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update user by ID
app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete user by ID
app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/userdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userExist = await UserModel.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "user is not found" });
    }
    res.status(200).json(userExist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => {
  console.log("server connect");
});

// const PORT = 3000;

// // Sample in-memory database
// const users = [];

// app.use(bodyParser.json());

// // User Signup
// app.post("/signup", async (req, res) => {
//   try {
//     const { email, phone, name, password } = req.body;

//     // Check if email or phone is provided
//     if (!email && !phone) {
//       return res.status(400).json({ error: "Email or phone is required" });
//     }

//     // Encrypt password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user details
//     const user = { email, phone, name, password: hashedPassword };
//     users.push(user);

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // User Login
// app.post("/login", async (req, res) => {
//   try {
//     const { email, phone, password } = req.body;

//     // Check if email or phone is provided
//     if (!email && !phone) {
//       return res.status(400).json({ error: "Email or phone is required" });
//     }

//     // Find user by email or phone
//     const user = users.find((u) => u.email === email || u.phone === phone);

//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Check password
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user.id }, "secretKey", {
//       expiresIn: "1h",
//     });

//     res.json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
