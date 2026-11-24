import multer from "multer"
import path from "path"
import fs from "fs"

const videoDir = path.join(process.cwd(), "uploads", "videos")
const materialDir = path.join(process.cwd(), "uploads", "materials")
const homeworkDir = path.join(process.cwd(), "uploads", "homeworks")

if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true })
}

if (!fs.existsSync(materialDir)) {
    fs.mkdirSync(materialDir, { recursive: true })
}

if (!fs.existsSync(homeworkDir)) {
    fs.mkdirSync(homeworkDir, { recursive: true })
}

const documentFilter = (req, file, cb) => {
    const allowed = [".pdf", ".txt", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".zip", ".rar", ".png", ".jpg", ".jpeg"]
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Faqat PDF, TXT, DOC, ZIP yoki rasm formatidagi fayllar qabul qilinadi"), false)
    }
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

const homeworkStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, homeworkDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

export const uploadVideo = multer({ storage: videoStorage })
export const uploadMaterial = multer({ storage: materialStorage, fileFilter: documentFilter })
export const uploadHomework = multer({ storage: homeworkStorage, fileFilter: documentFilter })
