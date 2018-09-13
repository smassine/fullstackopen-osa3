const mongoose = require('mongoose')

// Ei salasanaa GitHubiin!
const url = 'mongodb://smassine:<dbpassword>@ds155492.mlab.com:55492/fullstack-persons'

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
    name: String,
    number: String
  })

module.exports = Person