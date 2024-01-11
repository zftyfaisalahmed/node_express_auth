const fileRoute = require("express").Router()
const { uploadFile, readFile, readSingleFile, deleteFile } = require("../controller/fileController")
const auth = require('../middleware/auth')

fileRoute.post(`/upload`, auth, uploadFile)

fileRoute.get(`/all`, auth, readFile)

fileRoute.get(`/single/:id`, auth, readSingleFile)

fileRoute.delete(`/delete/:id`, auth, deleteFile)

module.exports = fileRoute