import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import { CLIENT_URL, UPLOAD_DIR } from "./config/env.js"
import { errorHandler, notFound } from "./middlewares/errorHandler.js"
import routes from "./routes/index.js"

const app = express()

app.disable("x-powered-by")
app.set("trust proxy", 1)

app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(cookieParser())

app.use(`/${UPLOAD_DIR}`, express.static(UPLOAD_DIR, { maxAge: "30d" }))

app.use("/api", routes)

app.use(notFound)
app.use(errorHandler)

export default app
