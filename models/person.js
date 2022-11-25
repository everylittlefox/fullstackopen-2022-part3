const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to mongodb")
  })
  .catch((err) => console.log(err))

const Person = mongoose.model('Person', personSchema)

const fetchAll = () => Person.find({});

const fetchOne = (id) => Person.findById(id)

const createPerson = (name, number) => new Person({ name, number }).save()

const updatePerson = (person) => Person.findByIdAndUpdate(person.id, person, { new: true })

const deletePerson = (id) => Person.findByIdAndRemove(id)

module.exports = { fetchAll, fetchOne, createPerson, updatePerson, deletePerson };