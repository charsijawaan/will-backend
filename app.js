var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const config = require("config");
const dotenv = require("dotenv");

var Jimp = require("jimp");
var fileUpload = require("express-fileupload");

dotenv.config();
const connectDB = require("./config/db");

connectDB();
console.log("NODE_ENV: " + config.util.getEnv("NODE_ENV"));

var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var balanceRouter = require("./routes/balanceReq");
var flyerRouter = require("./routes/flyer");
var willRouter = require("./routes/basicWill");
var willcreation = require("./routes/willcreation");
var managewill = require("./routes/manageWill");

const port = process.env.PORT || 61550;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload({ useTempFiles: true }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/balance", balanceRouter);
app.use("/flyer", flyerRouter);
app.use("/will", willRouter);
app.use("/willcreation", willcreation);
app.use("/managewill", managewill);

app.post("/getimg", async (req, res) => {
    var fullUrl = req.protocol + ":\\\\" + req.get("host") + "\\";

    let imgURL = req.body.imgURL;
    let code = req.body.code;

    var loadedImage;

    let d = new Date();

    var newFileName = d.getTime() + "." + imgURL.split(".").pop();

    Jimp.read(imgURL)
        .then(function (image) {
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        })
        .then(function (font) {
            loadedImage
                .print(
                    font,
                    5,
                    1,
                    {
                        text: code,
                        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                        alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
                    },
                    loadedImage.bitmap.width,
                    loadedImage.bitmap.height
                )
                .write(path.join("public", "uploads", newFileName));
        })
        .catch(function (err) {
            console.error(err);
        });

    res.send({
        imgURL: fullUrl + path.join("uploads", newFileName),
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(port, () => console.log(`App listening on port : ${port}`));
module.exports = app;
