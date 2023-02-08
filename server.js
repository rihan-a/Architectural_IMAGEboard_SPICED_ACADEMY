// import node modules ---------------------------------------------------------->
const path = require("path");
const express = require("express");
const app = express();
const fs = require("fs");
require("dotenv").config();
const { PORT = 8080 } = process.env;

const aws = require("aws-sdk");

const { uploader } = require("./middleware");

var XMLHttpRequest = require('xhr2');


// import funciton from db script to interact with the database tables --------->
const {
    saveImgData,
    getImgsData,
    getImgById,
    getCommentsById,
    saveComment,
    getMoreImages,
} = require("./db");


// let secrets;
// if (process.env.NODE_ENV == "production") {
//   secrets = process.env; // in prod the secrets are environment variables
// } else {
//   secrets = require("./secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
// }

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//"https://s3.amazonaws.com/spicedling/filename";

app.post("/upload", uploader.single("file"), (req, res) => {
    console.log(req.file);
    if (req.file) {

        const { filename, mimetype, size, path } = req.file;
        const { imageTitle, imageDesc, userName } = req.body;

        const promise = s3
            .putObject({
                Bucket: "spicedling",
                ACL: "public-read",
                Key: filename,
                Body: fs.createReadStream(path),
                ContentType: mimetype,
                ContentLength: size,
            })
            .promise();

        promise
            .then(() => {
                console.log("success");
                let url = `https://s3.amazonaws.com/spicedling/${filename}`;
                //console.log(req.body);
                saveImgData({ url, username: userName, title: imageTitle, desc: imageDesc }).then((imageData) => {
                    //console.log(imageData);
                    return res.json(imageData);
                }).catch(err => console.log(err));
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({
            success: false,
            message: "File upload failed",
        });
        return res.sendStatus(500);
    }
});

// get all Images Route ---------------------------------------------------------------------->
// GET --------------------------------------------------------------------------------------->
app.get("/images", (req, res) => {

    var VisitorAPI = function (t, e, a) { var s = new XMLHttpRequest; s.onreadystatechange = function () { var t; s.readyState === XMLHttpRequest.DONE && (200 === (t = JSON.parse(s.responseText)).status ? e(t.data) : a(t.status, t.result)); }, s.open("GET", "https://api.visitorapi.com/api/?pid=" + t), s.send(null); };
    VisitorAPI(
        "hFLqTabWSVc01cJ0owTq",
        function (data) { console.log(data); },
        function (errorCode, errorMessage) { console.log(errorCode, errorMessage); }
    );

    getImgsData().then((imagesData) => {
        //console.log(imagesData);
        return res.json(imagesData);
    }).catch(err => console.log("there is an error here", err));




});

// get Images by img ID Route ------------------------------------------------------------------>
// GET ----------------------------------------------------------------------------------------->
app.get("/images/:imgId", (req, res) => {
    //console.log("id", req.params.imgId);

    getImgById(req.params.imgId).then(results => {


        return res.json(results);
    }).catch(err => console.log("there is an error here", err));
});

// get all Comments by img ID Route ------------------------------------------------------------------>
// GET ----------------------------------------------------------------------------------------------->
app.get("/comments/:imgId", (req, res) => {
    getCommentsById(req.params.imgId).then((result) => {
        //console.log("comments", result);

        return res.json(result.rows);

    }).catch(err => console.log("there is an error here", err));
});

// Post a Comments by img ID Route ------------------------------------------------------------------>
// POST --------------------------------------------------------------------------------------------->
app.post("/comments", (req, res) => {
    let commentData = req.body;
    //console.log("comment", commentData);
    saveComment(commentData).then((result) => {
        //console.log(result);
        return res.json(result.rows[0]);
    }).catch(err => console.log("there is an error here", err));
});

// Get more images using the last image id give ---------------------------------------------------->
// GET --------------------------------------------------------------------------------------------->
app.get("/loadmore/:lastId", (req, res) => {
    //console.log(req.params.lastId);
    getMoreImages(req.params.lastId).then(imgsData => {
        //console.log(imgsData);
        return res.json(imgsData);
    }).catch(err => console.log("there is an error here", err));


});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
