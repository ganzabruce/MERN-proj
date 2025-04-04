require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const session =  require('express')
const MongoStore = require('connect-mongo')
const bodyParser = require('body-parser');
const PORT = process.env.PORT
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload');
const cors = require('cors');

//routes
const userPath = require('./routes/user')
const mentorPath =  require('./routes/mentor')


//schemas
const Mentor = require('./models/mentor')
const User = require('./models/user')

//middlewares
app.use(cookieParser())
app.use(bodyParser.json())
app.use(fileUpload());
app.use(express.static('uploads'));
app.use(cors());


const mentorAuthenticator = (req,res,next) =>{
  const mentorToken = req.cookies.mentorToken
  try {
    if(!mentorToken){
      return res.json({message : "session timeout"})
    }
    const verifiedToken = jwt.verify(mentorToken,process.env.JWT_SECRET)
    req.mentorId = verifiedToken.mentorId
    next()
  } catch (error) {
    return res.json({message:"user not authenticated"})
  }
}
const userAuthenticator = (req,res,next) =>{
  const userToken = req.cookies.userToken
  try {
    if(!userToken){
      return res.json({message : "no user logged in"})
    }
    const verifiedToken = jwt.verify(userToken,process.env.JWT_SECRET)
    req.userId = verifiedToken.userId
    next()
  } catch (error) {
    return res.json({message:"user not authenticated"})
  }
}


// const menteeAuthenticator = async (req,res) =>{
//   const 
// }

app.use(session({
  secret : process.env.JWT_SECRET,
  resave: false,
  saveUninitiased : true,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL
  })
}))

// Routes


// Connect to db
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("DB connected..");
    app.listen(PORT, () => {
      console.log(`Server is up and running `)
    })
  })

  .catch((error) => {
    console.log("Error on db connection: ", error)
  })


app.post('/mentor/register',mentorPath)
app.post('/mentor/login',mentorPath)
app.post('/user/register',userPath)
app.post('/user/login',userPath)
app.post('/logout/mentor',mentorAuthenticator,mentorPath)
app.post('/logout/user',userAuthenticator,userPath)
app.post('/requestSession',userAuthenticator,userPath)
app.post('/respondSession',mentorAuthenticator,mentorPath)
app.get('/pendingSessions',mentorAuthenticator,mentorPath)

app.get('/mentors',userAuthenticator,userPath)


