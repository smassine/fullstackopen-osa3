// Tehtävät 3.1–3.13 & 3.15–3.16 & 3.18 & 3.20 & 3.22 done

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('responsedata', function (req) {
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :responsedata :status :res[content-length] - :response-time ms')) //tiny

const formatPerson = (person) => {
    return {
      name: person.name,
      number: person.number,
      id: person._id
    }
}

app.get('/api/persons', (req, res) => {

    Person
        .find({})
        .then(persons => {
            res.json(persons.map(formatPerson))
        })

})

app.get('/api/info', (req, res) => {

    // Jostain syystä ${persons.length} ja ${new Date()} eivät toimi
    Person
        .find({})
        .then(persons => {
            const count_persons = persons.length
            const date = new Date()
            res.send('<p> Puhelinluettelossa on ' + count_persons + ' henkilön tiedot </p> <p>' + date + '</p>')
        })

})

app.get('/api/persons/:id', (req, res) => {
    
    Person
        .findById(req.params.id)
        .then(personByID => {
            if (personByID) {
                res.json(formatPerson(personByID))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })

})

app.delete('/api/persons/:id', (req, res) => {
  
    Person
        .findByIdAndRemove(req.params.id)
        .then(deletedPerson => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })

})

app.post('/api/persons', (req, res) => {
    const body = req.body
  
    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    } else if (body.number === undefined) {
        return res.status(400).json({ error: 'number missing' })
    }
  
    const person = new Person({
        name: body.name,
        number: body.number // Tehtävä 3.5: '040-' + Math.floor(Math.random() * 999999) + 1,
    })
  
    person
        .save()
        .then(savedPerson => {
            res.json(formatPerson(savedPerson))
        })

})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
