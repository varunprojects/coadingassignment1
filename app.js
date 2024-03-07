const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const format = require('date-fns/format')
const isMatch = require('date-fns/isMatch')
var isValid = require('date-fns/isValid')
const app = express()
app.use(express.json())

let database
const initializeDBandServer = async () => {
  try {
    database = await open({
      filename: path.join(__dirname, 'todoApplication.db'),
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000/')
    })
  } catch (error) {
    console.log(`DataBase error is ${error.message}`)
    process.exit(1)
  }
}
initializeDBandServer()
const hasStatus = requestQuery => {
  return requestQuery.status !== undefined
}
const hasPriority = requestQuery => {
  return requestQuery.priority !== undefined
}
const hasProrityandStatus = requestQuery => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  )
}
const hasSearchq = requestQuery => {
  return requestQuery.search_q !== undefined
}
const hascategoryandStatus = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  )
}
const hascategory = requestQuery => {
  return requestQuery.category !== undefined
}
const hascategoryandProirity = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  )
}
const OutputResult = dataObject => {
  return {
    id: dataObject.id,
    todo: dataObject.todo,
    priority: dataObject.priority,
    category: dataObject.category,
    status: dataObject.status,
    duedate: dataObject.duedate,
  }
}
app.get('/todos/', async (request, response) => {
  let data = null
  let query = ''
  const {search_q = '', priority, status, category} = request.query
  switch (true) {
    case hasPriority(request.query):
      if (priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW') {
        query = `
      SELECT * FROM todo WHERE priority = '${priority}';`
        data = await database.all(query)
        response.send(data.map(eachItem => OutputResult(eachItem)))
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
      }
      break
    case hasStatus(request.query):
      if (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') {
        query = `SELECT * FROM todo WHERE status = '${status}';`
        data = await database.all(query)
        response.send(data.map(eachItem => OutputResult(eachItem)))
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
      }
      break
  }
})
