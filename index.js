require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const personModel = require("./models/person");
const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("post-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-body"
  )
);

app.get("/api/persons", (req, res) => {
  personModel.fetchAll().then(people => res.json(people))
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  personModel
    .fetchOne(id)
    .then(person => {
      if (person)
        res.json(person)
      else res.status(404).json({ error: "person not found." });
    })
    .catch(err => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const person = req.body;

  personModel
    .createPerson(person.name, person.number)
    .then(newPerson => res.status(201).json(newPerson))
    .catch(err => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const person = req.body;
  const id = req.params.id;

  personModel
    .updatePerson(id, person)
    .then(newPerson => res.status(201).json(newPerson))
    .catch(err => next(err));
})

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  personModel
    .deletePerson(id)
    .then(() => res.status(204).end())
    .catch(err => next(err));
});

app.get("/info", (req, res) => {
  const html = (numPersons) =>
    `<div>
      <p>Phonebook has info for ${numPersons} people.</p>
      <p>${new Date().toUTCString()}</p>
    </div>`;

  personModel.fetchAll().then(people =>
    res.send(html(people.length))
  )
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  switch(error.name) {
    case "CastError":
      return res.status(400).json({message: "id not in the right format."});
    case "ValidationError":
      return res.status(400).json({ error: error.message });
    case "PersonAlreadyExistsError":
      return res.status(400).json({ error: error.message });
    default:
      next(error)
  }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
