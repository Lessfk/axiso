import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(express.json()) //支持post请求获取数据


app.get('/posts', (req, res) => {
    res.send(req.query)
})

app.post('/posts', (req, res) => {
    res.send(req.body)
})

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})