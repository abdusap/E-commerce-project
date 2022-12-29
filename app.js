const express= require('express')
const app=express()
const session = require('express-session')
const path=require('path')
const fileupload=require('express-fileupload')
const userRoute=require('./Routes/userRoute')
const adminRoute=require('./Routes/adminRoute')
// const config=require('./Config/config')

// Database section
require('./Model/databaseConnection')


//For not storing Cache
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

// Session
app.use(session({
  secret: 'Tech-Kart-ecommerce-site',
  name: 'TechKart-Session',
  resave: false,
  saveUninitialized: true
}))



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
app.use("/Public", express.static(path.join(__dirname, "Public")));


// routing
// app.use('/',userRoute)

app.use('/',userRoute)

app.use('/admin',adminRoute)


app.listen(port,()=>console.log(`Server is running at  http://localhost:${port}`))