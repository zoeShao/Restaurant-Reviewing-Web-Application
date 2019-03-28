const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const GridFsStorage = require('multer-gridfs-storage')
const path = require('path')
const crypto = require('crypto')

const mongoURI = 'mongodb://localhost:27017/RestaurantRevAPI'
// connect to our database
mongoose.connect(mongoURI, { useNewUrlParser: true })
const conn = mongoose.connection
let gfs
conn.once('open', () =>{
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('images');
})

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'images'
            };
            resolve(fileInfo);
          });
        });
    }
})
module.exports = {mongoose, storage}