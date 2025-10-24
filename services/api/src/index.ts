import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import authRouter from './routes/auth.js'
import farmerRouter from './routes/farmers.js'
import loanRouter from './routes/loans.js'
import dashboardRouter from './routes/dashboard.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN?.split(',') || '*' } })

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/farmers', farmerRouter)
app.use('/api/loans', loanRouter)
app.use('/api/dashboard', dashboardRouter)

io.on('connection', (socket) => {
  socket.emit('welcome', { message: 'Connected to ARIP realtime' })
})

const port = Number(process.env.PORT || 4000)
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`ARIP API listening on ${port}`)
})
