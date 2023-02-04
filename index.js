const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.set('strictQuery', false)

mongoose.connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => {
    console.log('Mongodb atlas connected...')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`)
})