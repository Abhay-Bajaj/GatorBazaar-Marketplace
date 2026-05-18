const express = require('express')
const router = express.Router()
const { getUser, getLoggedUser } = require('../controllers/userController')

router.get('/loggedUser', getLoggedUser)
router.get('/:id', getUser)

module.exports = router;
