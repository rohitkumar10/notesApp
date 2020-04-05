const mongoose = require('mongoose')
const app = require('./app')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const port = 3000;

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD); 
mongoose.connect(process.env.DATABASE_LOCAL, {  
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((con) => { 
    console.log('DB connection successful !');
}).catch(()=> {
    console.log('Error in database connection !') 
})

app.listen(port, () => {
    console.log(`App is running on port: ${port}`)
})
