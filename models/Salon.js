const mongoose = require("mongoose");

const SalonSchema = new mongoose.Schema({
  "Salón": { type: String, required: true, unique: true },
  "EDIFICIO": String,
  "PISO": Number,
  "CAPACIDAD": Number,
  "PUESTOS CONTADOS": Number,
  "COMENTARIOS": String,
  "CARACTERÍSTICA EN PEOPLE": String,
  "Tipo de Aula": String,
  "Tipo de mesa": String,
  "Tipo de silla": String,
  "Tipo de tablero": String,
  "Equipamiento Tecnológico ": String,
  "Tomacorriente": String,
  "Movilidad": String,
  "Entorno": String,
  "Contacto de reserva": String,
  "ESTADO": String,
  "USABLE RESERVAS RA": String,
  "Foto": String
});

module.exports = mongoose.model("Guaduales", SalonSchema);
