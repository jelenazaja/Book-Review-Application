const express = require('express');
let books = require("./booksdb.js");
const { authenticated } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const userExist = (username) => {
    let userwithusername = users.filter((user) => user.username === username);
    if(userwithusername.length > 0) return true;
    else return false;
}

public_users.post("/register", (req,res) => {
   const username = req.body.username;
   const password = req.body.password;

    if(username && password){

        if(userExist(username)){
            return res.send("This user already exists!");
        }else{
            users.push({"username": username, "password": password})
            return res.send("User successfully registered! Now you can login in!")
        }
    }
    return res.send("Unable to register user!");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).send(JSON.stringify(books, null, 4));
});

const getAllBooks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error.message);
        throw error;
    }
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books[isbn]) return res.send(books[isbn]);
  else return res.send("Book whit that ISBN does not exist!");
 });

 const getBookDetails = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting details:", error.message);
        throw error;
    }
};
  
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

const getBookDetailsAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting details based on author:", error.message);
        throw error;
    }
};

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

const getBookDetailsTitle = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting details based on title:", error.message);
        throw error;
    }
};

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(!books[isbn]) return res.send("That book does not exist!");
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
