import multer from "multer"
import path from "path"
import fs from "fs"

const videoDir = path.join(process.cwd(), "uploads", "videos")
const materialDir = path.join(process.cwd(), "uploads", "materials")

if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true })
}

if (!fs.existsSync(materialDir)) {
    fs.mkdirSync(materialDir, { recursive: true })
}

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videoDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const materialStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, materialDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

export const uploadVideo = multer({ storage: videoStorage })
export const uploadMaterial = multer({ storage: materialStorage })
