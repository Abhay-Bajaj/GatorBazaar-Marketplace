// Saves listing photos to uploads/images; filenames are unique to avoid collisions.
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images')
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)

    cb(null, uniqueName)
  }
})

const upload = multer({ storage })

module.exports = upload