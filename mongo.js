// Tehtävä 3.12

const mongoose = require('mongoose')

// Ei salasanaa Githubiin!
const url = 'mongodb://smassine:<dbpassword>@ds155492.mlab.com:55492/fullstack-persons'

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const person = new Person({
  name: process.argv[2],
  number: process.argv[3]
})

if (person.name) {
  console.log('lisätään henkilö', person.name, 'numero', person.number, 'luetteloon')
  person
    .save()
    .then(response => {
      console.log('person saved!')
      mongoose.connection.close()
    })
  return
}

console.log('puhelinluettelo:')
Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })