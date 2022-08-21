const express = require("express");
const cors = require("cors");
const multer = require("multer");
//knexとpsqlで作成したDBを繋げるコード↓
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    database: "fashionmemo",
    user: "tomomi",
  }
});

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
  console.log(file.originalname);
  //最初に try ブロック内のコードが実行され、例外がスローされた場合は catch ブロック内のコードが実行されます。
  try {
    await uploadBytes(imageRef, file.buffer, metatype);
    await knex("fashion").insert({ name: file.originalname , category: req.body.category, note: req.body.note });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  res.status(200).send();
});

//get all picture
app.get("/pictures", async(req, res) => {
  //↓↓fire storageに格納されているファイルを定数に格納している。
  const listRef = ref(storage);

  //↓↓配列にして、map関数で一つ一つ取り出してデータをJson形式で表示している。
  const productPictures = [];
  await listAll(listRef).then(async (pics) => {
  for(const item of pics.items){
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${item._location.bucket}/o/${item._location.path_}?alt=media`;
      const serachResult = await knex.select("category", "note").from("fashion").where("name", item.name).first();
      const category = serachResult?.category;
      const note = serachResult?.note;
      console.log(item.name);
      console.log(serachResult);
      productPictures.push({
        url: publicUrl,
        name: item._location.path_,
        category,
        note,
      });
  };
    res.status(200).send(productPictures);
  })
  .catch((err) => console.error(err));
})

//delete a picture
app.delete("/delete", async(req, res) => {
  const deletePic = req.body.name;
  const deleteRef = ref(storage, deletePic);
  //「deleteObject()」メソッドはfirebase側のdelete() メソッド
  try {
     await deleteObject(deleteRef);
     await knex("fashion").where("name", deletePic).del();
     res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
});


const PORT = 5000;
app.listen(PORT, ()=>{
  console.log(`server has started on port ${5000}`);
});