const mongoose = require('mongoose')


if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://user1:${password}@cluster0.ukz79.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const People = mongoose.model('Person', personSchema)


if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new People({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`added ${name} with number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
if (process.argv.length === 3) {
  People.find({}).then(result => {
    console.log('phonebook')
    result.forEach(p => {
      console.log(p.name, p.number)
    })
    mongoose.connection.close()
  })
}
