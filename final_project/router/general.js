const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books[isbn]) return res.send(books[isbn]);
  else return res.send("Book whit that ISBN does not exist!");
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let result = [];
  for(let isbn in books){
    if(books[isbn].author === author) 
        result.push(books[isbn])
  }
  if(result.length > 0)
    return res.send(result);
  else
    return res.send("Book with that author does not exist");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let result = [];
  for(let isbn in books){
    if(books[isbn].title === title)
        result.push(books[isbn]);
  }
  if(result.length > 0) return res.send(result);
  else return res.send("There are no books with that title!");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(!books[isbn]) return res.send("That book does not exist!");
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
