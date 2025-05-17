const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    let todosLosSalones = [];

    for (const coll of collections) {
      const nombreColeccion = coll.name;

      // Filtrar colecciones que no sean edificios
      if (["usuarios", "admin", "otra"].includes(nombreColeccion)) continue;

      const coleccion = db.collection(nombreColeccion);
      const salones = await coleccion.find().toArray();

      salones.forEach((s) => {
        if (!s.EDIFICIO) s.EDIFICIO = nombreColeccion;
        todosLosSalones.push(s);
      });
    }

    const contexto = `Esta es la información actual de los salones:\n${
      todosLosSalones.map(s => {
        return `Salón: ${s["Salón"]}, Capacidad: ${s.CAPACIDAD}, Edificio: ${s.EDIFICIO}, Piso: ${s.PISO}`;
      }).join("\n")
    }`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Responde solo basándote en los datos que te doy a continuación.\n${contexto}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error("Error al llamar a OpenAI:", error.message);
    res.status(500).json({ error: "Error al generar la respuesta del chat." });
  }
});

module.exports = router;
