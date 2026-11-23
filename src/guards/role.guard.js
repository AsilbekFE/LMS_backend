import pool from "../config/db.js"

export const roleGuard = (...roles) => {
    const allowed = roles.flat().map(r => r.toLowerCase() === "techer" ? "teacher" : r.toLowerCase())

    return async (req, res, next) => {
        try {
            const user = req.user
            if (!user) {
                return res.status(401).json({
                    status: 401,
                    message: "avtorizatsiyadan otilmagan"
                })
            }

            let roleName = user.role_name

            if (!roleName && user.role_id) {
                const roleData = await pool.query("SELECT name FROM roles WHERE id=$1", [user.role_id])
                if (roleData.rows.length) {
                    roleName = roleData.rows[0].name
                }
            }

            if (!roleName) {
                return res.status(403).json({
                    status: 403,
                    message: "rolingiz aniqlanmadi"
                })
            }

            const currentRole = roleName.toLowerCase() === "techer" ? "teacher" : roleName.toLowerCase()

            if (!allowed.includes(currentRole)) {
                return res.status(403).json({
                    status: 403,
                    message: "sizda bu amalni bajarish uchun ruxsat yoq"
                })
            }

            next()
        } catch (err) {
            return next(err)
        }
    }
}
