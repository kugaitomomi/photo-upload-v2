const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {
  ref,
  uploadBytes,
  listAll,
  deleteObject,
} = require("firebase/storage");
const storage = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

//multer
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

//add a picture
app.post("/addPicture", upload.single("pic"),async (req, res) => {
  const file = req.file;
  const imageRef = ref(storage, file.originalname);
  const metatype = { contentType: file.mimetype, name: file.originalname };
  await uploadBytes(imageRef, file.buffer, metatype).then((snapshot) => {
    console.log(imageRef);
    console.log(metatype);
      res.send("uploaded!");
    })
    .catch((err) => console.error(err.message));
});

//get all picture
app.get("/pictures", async(req, res) => {
  //↓↓fire storageに格納されているファイルを定数に格納している。
  const listRef = ref(storage);

  //↓↓配列にして、map関数で一つ一つ取り出してデータをJson形式で表示している。
  let prductPictures = [];
  await listAll(listRef).then((pics) => {
    prductPictures= pics.items.map((item) => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${item._location.bucket}/o/${item._location.path_}?alt=media`;
      console.log(listRef);
      return {
        url: publicUrl,
        name: item._location.path_,
      };
    });
    res.send(prductPictures);
  })
  .catch((err) => console.error(err.message));
})

//delete a picture
app.delete("/delete", async(req, res) => {
  const deletePic = req.body.name;
  const deleteRef = ref(storage, deletePic);
  //「deleteObject()」メソッドはfirebase側のdelete() メソッド
  await deleteObject(deleteRef).then(() => {
    res.send("deleted");
  }).catch((err) => console.error(err.message));
});


const PORT = 5000;
app.listen(PORT, ()=>{
  console.log(`server has started on port ${5000}`);
});