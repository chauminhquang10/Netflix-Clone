require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const SocketServer = require("./SocketServer");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  SocketServer(socket);
});

//Routes
app.use("/user", require("./routes/userRoutes"));
app.use("/api", require("./routes/uploadRoutes"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/genreRoutes"));
app.use("/api", require("./routes/listRoutes"));
app.use("/api", require("./routes/movieRoutes"));
app.use("/api", require("./routes/commentRoutes"));
app.use("/api", require("./routes/likeRoutes"));
app.use("/api", require("./routes/dislikeRoutes"));
app.use("/api", require("./routes/servicePackageRoutes"));
app.use("/api", require("./routes/paymentRoutes"));
app.use("/api", require("./routes/notifyRoutes"));
app.use("/api", require("./routes/stripeRoutes"));
app.use("/api", require("./routes/discountRoutes"));

// Connect to the database
const URI = process.env.MONGODB_URL;

mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to the database!");
  }
);

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
