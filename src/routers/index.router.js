import express from "express"
import authRouter from "./auth.router.js"
import adminRouter from "./admin.router.js"
import teacherRouter from "./teacher.router.js"
import studentRouter from "./student.router.js"
import assistantRouter from "./assistant.router.js"
import courseRouter from "./course.router.js"
import categoryRouter from "./category.router.js"
import orderRouter from "./order.router.js"
import roleRouter from "./roles.routers.js"
import userRouter from "./users.router.js"
import sectionRouter from "./section.router.js"
import lessonRouter from "./lesson.router.js"
import materialRouter from "./material.router.js"
import questionRouter from "./question.router.js"
import studentDashboardRouter from "./student-dashboard.router.js"
import homeworkRouter from "./homework.router.js"

const appRouter = express.Router()

appRouter.use("/api/v1", authRouter)
appRouter.use("/api/v1", adminRouter)
appRouter.use("/api/v1", teacherRouter)
appRouter.use("/api/v1", studentRouter)
appRouter.use("/api/v1", assistantRouter)
appRouter.use("/api/v1", courseRouter)
appRouter.use("/api/v1", categoryRouter)
appRouter.use("/api/v1", sectionRouter)
appRouter.use("/api/v1", lessonRouter)
appRouter.use("/api/v1", materialRouter)
appRouter.use("/api/v1", questionRouter)
appRouter.use("/api/v1", homeworkRouter)
appRouter.use("/api/v1", studentDashboardRouter)
appRouter.use("/api/v1", orderRouter)
appRouter.use("/api/v1", roleRouter)
appRouter.use("/api/v1", userRouter)

export default appRouter
