const express = require('express')
const app = express()
const cors = require('cors')
const aiRoutes = require('./routes/ai.routes')


app.use(express.json())

app.use(cors({
    origin: ['https://ai-code-reviewer-henna.vercel.app/ '],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}))


app.get('/', (req, res) => {
    res.send("Server is live")
})


app.use('/api/ai', aiRoutes)

module.exports = app