const express= require('express')
const app=express()
// const session = require('express-session')
const path=require('path')
const userRoute=require('./Routes/userRoute')
const adminRoute=require('./Routes/adminRoute')
// const config=require('./Config/config')

// Database section
require('./Model/databaseConnection')
// require('./Model/userModel')
// require('./Model/adminModel')

//For not storing Cache
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });


// Creating a session
// app.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: config.sessionSecret,
    
// }))


// for parsing the url to json,string or array format
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// port specified
const port= process.env.PORT || 9000

const staticPath=path.join(__dirname,'Public')


//  Setting view Engine
app.set('view engine', 'ejs')

// for adding external files to view engine
app.use(express.static(staticPath))

//routing

app.use(userRoute)
app.use(adminRoute)


app.listen(port,()=>console.log(`Server is running at  http://localhost:${port}/login`))