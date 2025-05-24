const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app= express();
const path=require("path");
const { count } = require('console');
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password:'Lipi@2004'
});

let createRandomUser =() => {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.username(), // before version 9.1.0, use userName()
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}
app.get("/" ,(req,res) =>{
    let q= `SELECT count(*) FROM user`;
    try {
       connection.query(q, (err, result) => {
          if (err) throw err;
          let count = result[0]["count(*)"];
          console.log(result[0]["count(*)"]);
          res.render("home.ejs",{count});  
       });
    } catch (err) {
        console.log(err);
        res.send("some error in the DB");
    }
});

//show 
app.get("/user",(req,res)=>{
    let q=`SELECT * FROM user`;
    try {
       connection.query(q, (err, users) => {
          if (err) throw err;
          res.render("show.ejs",{users}); 
       });
    } catch (err) {
        console.log(err);
        res.send("some error in the DB");
    }
});
//edit

app.get("/user/:id/edit",(req,res)=>{
   let {id} = req.params;
   let q=`SELECT * FROM user WHERE id=${id}`;
   try {
       connection.query(q, (err, result) => {
          if (err) throw err;
          res.render("edit.ejs",{ user: result[0] }); 
       });
    } catch (err) {
        console.log(err);
        res.send("some error in the DB");
    }
});

//EDIT UPDATE
app.patch("/user/:id",(req,res) =>{
    let {id} = req.params;
    let {password : formPass ,name: newUsername}=req.body;
   let q=`SELECT * FROM user WHERE id=${id}`;
   try {
       connection.query(q, (err, result) => {
          if (err) throw err;
          let user=result[0];
          if(formPass != user.password){
             return res.send("WRONG PASSWORD");
          }else{
              let q2 = `UPDATE user SET name='${newUsername}' WHERE id='${id}'`;
               connection.query(q2,(err,result)=>{
                   if(err) throw err;
                   res.redirect("/user");
               });
          }
          
       });
    } catch (err) {
        console.log(err);
        res.send("some error in the DB");
    }
});

app.listen("8080" ,() =>{
    console.log("server is listening");
});

