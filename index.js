import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "13121400MG",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

let error = "";

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM books ORDER BY id ASC");
  let books = result.rows;
  res.render("index.ejs", {
    books: books,
    error: error,
  });
});

app.get("/add", async (req, res) => {
  var currentdate = new Date();
  let year = currentdate.getFullYear();
  let month = currentdate.getMonth() + 1;

  if (month < 10) {
    month = "0" + month;
  }

  let day = currentdate.getDate();
  if (day < 10) {
    day = "0" + day;
  }

  var date = year + "-" + month + "-" + day;

  res.render("add.ejs", {
    date: date,
  });
});

app.post("/add", async (req, res) => {
  error = "";
  const isbn = req.body.isbn;
  const name = req.body.name;
  const author = req.body.author;
  const rating = req.body.rating;
  const cover_url = req.body.cover_url;
  const comment = req.body.comment;
  const created_at = req.body.created_at;
  const updated_at = created_at;
  const shopping_url = req.body.shopping_url;

  if (isbn) {
    await db.query(
      "INSERT INTO books (isbn, name, author, rating, cover_url, comment, created_at, updated_at, shopping_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        isbn,
        name,
        author,
        rating,
        cover_url,
        comment,
        created_at,
        updated_at,
        shopping_url,
      ]
    );
  } else {
    error = "ISBN must be inserted.";
  }
  res.redirect("/");
});

app.post("/cancel", (req, res) => {
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deletedBookId;
  await db.query("DELETE FROM books WHERE id = $1", [id]);
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const bookData = await db.query("SELECT * FROM books WHERE id = $1", [id]);
  const editedBook = bookData.rows;
  
  var currentdate = new Date();
  let year = currentdate.getFullYear();
  let month = currentdate.getMonth() + 1;

  if (month < 10) {
    month = "0" + month;
  }

  let day = currentdate.getDate();
  if (day < 10) {
    day = "0" + day;
  }

  var updateDate = year + "-" + month + "-" + day;

  res.render("edit.ejs", {
    book: editedBook[0],
    date: updateDate,
  });
 
});

app.post("/edit",async (req,res) =>{
  error = "";
  const id = req.body.EditedBookId;
  const isbn = req.body.isbn;
  const name = req.body.name;
  const author = req.body.author;
  const rating = req.body.rating;
  const cover_url = req.body.cover_url;
  const comment = req.body.comment;
  const created_at = req.body.created_at;
  const updated_at = created_at;
  const shopping_url = req.body.shopping_url;

  if (isbn) {
    await db.query(
      "UPDATE books SET isbn = $1, name = $2, author = $3, rating = $4, cover_url = $5, comment = $6, created_at = $7, updated_at = $8, shopping_url = $9 WHERE id = $10",
      [
        isbn,
        name,
        author,
        rating,
        cover_url,
        comment,
        created_at,
        updated_at,
        shopping_url,
        id,
      ]
    );
  } else {
    error = "ISBN must be inserted.";
  }
  res.redirect("/");

})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
