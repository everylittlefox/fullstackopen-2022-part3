const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("post-body", (req, res) => {
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  return res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const person = persons.find((p) => p.id === id);
  return person
    ? res.json(person)
    : res.status(404).json({ error: "person not found." });
});

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!person.name)
    return res.status(400).json({ error: "name cannot be empty." });
  if (!person.number)
    return res.status(400).json({ error: "number cannot be empty." });

  const personWithNameExists = persons.some(
    (p) => p.name.toLowerCase() === person.name.toLowerCase()
  );
  if (personWithNameExists)
    return res.status(400).json({ error: "name must be unique" });

  const newPerson = { ...person, id: Math.floor(Math.random() * 1000000) };
  persons.push(newPerson);

  return res.status(201).json(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const person = persons.find((p) => p.id === id);

  if (!person) return res.status(404).json({ error: "person not found." });

  persons = persons.filter((p) => p.id !== id);

  return res.status(204).end();
});

app.get("/info", (req, res) => {
  const html = `<div>
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date().toUTCString()}</p>
    </div>`;
  return res.send(html);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
