// Tehtävät 3.1–3.11

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())

morgan.token('responsedata', function (req) {
    return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :responsedata :status :res[content-length] - :response-time ms')) //tiny

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Matti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
  ]  

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    const count_persons = persons.length
    const date = new Date()
    // Jostain syystä asentamillani versioilla ${persons.length} ja ${new Date()} eivät toimi
    res.send('<p> Puhelinluettelossa on ' + count_persons + ' henkilön tiedot </p> <p>' + date + '</p>')
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0 ? persons.map(person => person.id).sort().reverse()[0] : 1
    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    const names = persons.map(person => person.name)
  
    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    } else if (body.number === undefined) {
        return res.status(400).json({ error: 'number missing' })
    } else if (names.includes(body.name)) {
        return res.status(400).json({ error: 'name must be unique'})
    }
  
    const person = {
        name: body.name,
        number: body.number, // Tehtävä 3.5: '040-' + Math.floor(Math.random() * 999999) + 1,
        id: generateId()
    }
  
    persons = persons.concat(person)
  
    res.json(person)
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})