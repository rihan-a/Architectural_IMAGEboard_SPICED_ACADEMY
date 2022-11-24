const spicedPg = require("spiced-pg");
require("dotenv").config();

const { DATABASE_URL } = process.env;

const db = spicedPg(`${DATABASE_URL}`);

// function to save images data to the database
function saveImgData({ url, username, title, desc }) {
    return db
        .query(
            `INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, username, url`,
            [url, username, title, desc]
        ).then(result => {
            return result.rows[0];
        });
}

function getImgsData() {
    return db
        .query(`SELECT * FROM images 
        ORDER BY created_at DESC
        LIMIT 4`)
        .then((result) => result.rows);
}


const getImgById = (imgId) => {
    return db
        .query("SELECT * FROM images where id=$1", [imgId])
        .then((result) => {
            //console.log("img data in db", result.rows[0]);
            return result.rows[0];
        });
};


function getCommentsById(imgId) {
    return db.query(
        `SELECT * FROM comments WHERE image_id=$1 ORDER BY id DESC`,
        [imgId]
    );
}

function saveComment({ image_id, commenter, comment }) {
    return db.query(
        `INSERT INTO comments(image_id, commenter, comment) VALUES($1, $2, $3) 
        RETURNING * `,
        [image_id, commenter, comment]
    );
}



function getMoreImages(lastId) {
    return db.query(
        `SELECT *, (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId" 
         FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 4`,
        [lastId]
    ).then(
        ({ rows }) => rows
    );
}


module.exports = {
    saveImgData,
    getImgsData,
    getImgById,
    getCommentsById,
    saveComment,
    getMoreImages,
};


