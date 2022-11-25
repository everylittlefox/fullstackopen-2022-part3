const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phonebook:${password}@cluster0.klegwfx.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    const name = process.argv[3]
    const number = process.argv[4]

    if (name && number) {
      const person = new Person({
        name, number
      })

      return person.save().then(() => console.log(`added ${name} number ${number} to phonebook`))
    } else {
      return Person.find({}).then(res => {
        console.log("phonebook")
        res.forEach(r => console.log(r.name, r.number))
      })
    }
  })
  .then(() => {
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))