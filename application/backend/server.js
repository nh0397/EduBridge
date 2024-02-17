require('dotenv').config()

// Import to the express app
const express = require('express')
const routes = require('./routes/routes')

// Create an express app by invoking the function 
const app = express()

// Setting up the middleware so as to log the path 
app.use((request, response, next) => {
    console.log(request.path, request.method)
    next()
} )

// Setting up the route handler
app.use(routes)



// We need to keep listening for requests now 
app.listen(process.env.PORT, () => {
    console.log("Listening to the port number:",process.env.PORT)
})
