import pool from "../config/db.js"

export const allAdminGuard = async (req, res, next) => {
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

        if (roleName && roleName.toLowerCase() === "admin") {
            return next()
        }

        const targetId = Number(req.params.id)

        if (Number(user.id) === targetId) {
            return next()
        }

        return res.status(403).json({
            status: 403,
            message: "siz faqat ozingizning malumotingizni tahrirlashingiz yoki ochirishingiz mumkin"
        })
    } catch (err) {
        return next(err)
    }
}
