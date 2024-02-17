const express = require('express')

const  router = express.Router()

router.get('/', (request, response) => {
    response.json({message:"Hi there!"})
})

router.get('/:id', (request,response) => {
    response.json({message:"ID triggered"})
})
module.exports = router