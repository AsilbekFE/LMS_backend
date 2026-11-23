import express from "express"
import { configDotenv } from "dotenv"
import appRouter from "./routers/index.router.js"
import fs from "fs"
import path from "path"


configDotenv()

const app = express()
app.use(express.json())
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))
app.use(appRouter)

app.use((error, req, res, next) => {
    if(error.status< 500){res.status(error.status).json({
        status: error.status,
        message: error.message
    })}else{
        fs.appendFileSync(path.join(process.cwd(),"src","log","logger.txt"),
    `[${new Date().toLocaleString()}]_${req.method}_${req.url}_${error.message}\n`) 
    
    res.status(500).json({
        status: 500,
        message: "Internal Server Error"
    })

    }


    
})

app.listen(process.env.PORT, () => console.log("sever is running...."))
