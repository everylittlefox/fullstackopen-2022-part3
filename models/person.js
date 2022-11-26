const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "the minimum allowed length for 'name' is 3 characters"],
  },
  number: {
    type: String,
    minLength: [8, "the minimum allowed length for 'number' is 8 characters"],
    validate: {
      validator(v) {
        return /\d{2,3}-\d{3,}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: true,
  },
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

// personSchema.pre("save", () => {
//   const re = new RegExp(this.name, "i");
//   console.log(re);
  
//   return Person.findOne({ name: re }).then(p => {
//     if (p)
//       return Promise.reject({ name: "PersonAlreadyExistsError", message: `person with name ${p.name} is already in phonebook`})
    
//     return Promise.resolve()
//   })
// })

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to mongodb")
  })
  .catch((err) => console.log(err))


const fetchAll = () => Person.find({});

const fetchOne = (id) => Person.findById(id)

const createPerson = (name, number) => new Person({ name, number }).save()

const updatePerson = (id, person) => Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: "query" })

const deletePerson = (id) => Person.findByIdAndRemove(id)

module.exports = { fetchAll, fetchOne, createPerson, updatePerson, deletePerson };