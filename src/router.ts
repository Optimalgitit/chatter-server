import * as express from 'express'
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ "message": "Server is running" })
})

export = router