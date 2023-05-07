const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID="713111109679-uff67s7tb8n9gu833lk8g78devi73r6c.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET="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"
const session = require('express-session');

//app.use(cors());
app.use(
    cors({
         origin: "http://localhost:3000", // allow to server to accept request from different origin
         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
         credentials: true, // allow session cookie from browser to pass through
   })
);
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
  }));
app.use(passport.initialize());
app.use(passport.session());
let userid = -1;
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'330993',
    database: 'keeper'
});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mysql server!");
  });

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/keeper"
  },
  function(accessToken, refreshToken, profile, cb) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //return cb(err, user);
        db.query("SELECT * FROM users WHERE email = ?",
        [profile.emails[0].value],
        (err,result)=>{
            if(err){
                return cb(err);
            }else if(result.length>0){
                userid = result[0].id;
                console.log(userid);
                return cb(err,result);
            }else{
                db.query("INSERT INTO users (name, email) VALUES (?,?)",
                [profile.displayName,profile.emails[0].value]);
                var user = {
                    id: id,
                    name: profile.displayName
                  };
                return cb(null,user);
            }
        })
    //});
  }
));
passport.serializeUser(function (user, done) {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
})

/*app.get("/register",(req,res)=>{
    console.log(req.query);
})*/
app.post("/register", (req,res)=> {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;
    db.query("INSERT INTO users (name, email, password) VALUES (?,?,?)",
    [username, email, password],
    (err,result)=>{
        console.log(err);
    });
})
app.post("/login", (req,res)=>{
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    db.query("SELECT * FROM users WHERE email = ? AND password = ?",
    [username,password],
    (err,result)=>{
        if(err){
            console.log(err);
        }
        else if(result.length>0){
            userid = result[0].id;
            db.query("SELECT * FROM tasks WHERE user_id = ?",userid,
            (error,resultTasks)=>{
                res.send(resultTasks);
            })
        }else{
            res.send({message:"Wrong username/password combination"});
        }
    });
})
app.post("/note",(req,res)=>{
    var title = req.body.title;
    var description = req.body.description;
    console.log(userid);
    db.query("INSERT INTO tasks (user_id, title, description) VALUES (?,?,?)",
    [userid, title,description],
    (err,result)=>{
        if(err){
            console.log(err)
        }else{
            db.query("SELECT * FROM tasks WHERE user_id = ?",userid,
            (error,resultTasks)=>{
                res.send(resultTasks);
            })
        }
    } )
})
app.post("/delnote",(req,res)=>{
    var title = req.body.title;
    var description = req.body.description;
    console.log('title: '+title+'description: '+description);
    db.query("DELETE FROM tasks WHERE title = ? AND description = ?",
    [title,description],
    (err,result)=>{
        if(err){
            console.log(err)
        }else{
            db.query("SELECT * FROM tasks WHERE user_id = ?",userid,
            (error,resultTasks)=>{
                console.log(resultTasks);
                res.send(resultTasks);
            })
        }
    })
})

app.get("/googleUser",function(req,res){
    console.log(req.user);
    res.send(req.user);
})


app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile","email"] })
);
app.get("/auth/google/keeper",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    console.log("redirect")
    res.redirect("http://localhost:3000");
  });

app.listen(5000,()=>{
    console.log("app is up and running on port 5000");
});
