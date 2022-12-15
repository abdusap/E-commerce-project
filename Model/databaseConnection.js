const mongoose=require('mongoose')

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/Techkart').then(()=>{
console.log('database connect successfully')}
).catch((err)=>{
console.log(err)
})

