const connectToMongo =require('./db');
const authRouter=require('./routes/auth')
const notesRouter=require('./routes/notes')
const express = require('express')
const cors=require('cors')
const app = express()
const port = 5000
app.use(cors());
app.use(express.json());
connectToMongo();
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/auth',authRouter)
app.use('/notes',notesRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})