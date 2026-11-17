const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  
    let validusers = users.filter((item) => { return (item.username === username && item.password === password)});

    if(validusers.length > 0){
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if(!username || !password){
      return res.status(404).json({message : "Error logging in!"});
    }
  
    if(authenticatedUser(username, password)){
          let accessToken = jwt.sign({ data: password}, 'access', { expiresIn: 60 * 60 });
          req.session.authorization = { accessToken, username };
  
          return res.send("Successfully logged in!");
    } else {
      res.send("Ivalid login! Check username or password");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if(!req.session.authorization){
    return res.send("First login!");
  }

  const username = req.session.authorization.username;

  if(books[isbn]){
    books[isbn].reviews[username] = review;
    return res.send("Added review!");
  }
  return res.send("That book does not exist!");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if(!req.session.authorization){
        return res.send("First login!");
    }
     const username = req.session.authorization.username;

     if (!books[isbn]) {
        return res.status(404).send("Book does not exist!");
    }

    if (Object.hasOwn(books[isbn].reviews, username)) {
        delete books[isbn].reviews[username];
        return res.send("Review successfully deleted!");
    }

    return res.status(404).send("You have not reviewed this book!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
