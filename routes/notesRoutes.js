const express = require('express')
const notesController = require('./../controllers/notesController')
const authController = require('./../controllers/authController')

const router = express.Router();
router.use(authController.protect)
router.post('/newNote', notesController.newNote)
router.get('/getNotes', notesController.getNotes)
router.patch('/editNote/:id', notesController.editNote)
router.delete('/deleteNote/:id', notesController.deleteNote)

module.exports = router
