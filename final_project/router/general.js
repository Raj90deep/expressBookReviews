const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios").default;


//Function to check if the user exists
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  var isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  var author = req.params.author;
  Object.keys(books).forEach(function(book, index) {
    if(books[book].author == author) {
        res.status(200).send(JSON.stringify(books[book]))
    } 
  });
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    var title = req.params.title;
    Object.keys(books).forEach(function(book, index) {
      if(books[book].title == title) {
          res.status(200).send(JSON.stringify(books[book]))
      } 
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    var get_book = books[req.params.isbn];
    res.status(200).send(JSON.stringify(get_book.reviews));
});

const getBooks = async(url) => {
    const connect = axios.get(url);
    let listOfBooks = (await connect);
    console.log(listOfBooks)
};
getBooks("https://rajdeepchowd-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/");

const getBookByISBN = (url) => {
    axios.get(url)
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
};

getBookByISBN("https://rajdeepchowd-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/2")

const getBookByAuthor = async(url) => {
    const connect = axios.get(url);
    let books = (await connect);
    console.log("Samuel", books);
};
getBookByAuthor("https://rajdeepchowd-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/Samuel%20Beckett");

const getBookByTitle = async(url) => {
    const connect = axios.get(url);
    let book = (await connect);
    console.log("Fairy tales", book);
};
getBookByTitle("https://rajdeepchowd-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/Fairy%20tales");


module.exports.general = public_users;
