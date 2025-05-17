const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Obtener todos los salones de todas las colecciones (edificios)
router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();
    let todosLosSalones = [];

    for (const coll of collections) {
      const nombreColeccion = coll.name;

      // Puedes filtrar si hay colecciones que no son edificios
      if (["usuarios", "admin", "otra"].includes(nombreColeccion)) continue;

      const coleccion = db.collection(nombreColeccion);
      const salones = await coleccion.find().toArray();

      salones.forEach((salon) => {
        if (!salon.EDIFICIO) {
          salon.EDIFICIO = nombreColeccion;
        }
      });

      todosLosSalones = todosLosSalones.concat(salones);
    }

    res.status(200).json(todosLosSalones);
  } catch (error) {
    console.error("Error al obtener los salones:", error);
    res.status(500).json({ error: "Error obteniendo salones" });
  }
});

// Obtener un salón por nombre Y edificio desde una colección específica
router.get("/:nombre", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const nombreParam = decodeURIComponent(req.params.nombre.trim());

    const partes = nombreParam.split("|||");
    if (partes.length !== 2) {
      return res.status(400).json({ error: "Formato de parámetro inválido" });
    }

    const nombreEdificio = partes[0];
    const nombreSalon = partes[1];

    const salon = await db.collection(nombreEdificio).findOne({
      "Salón": { $regex: `^${nombreSalon}$`, $options: "i" },
    });

    if (salon) {
      if (!salon.EDIFICIO) salon.EDIFICIO = nombreEdificio;
      return res.json(salon);
    }

    res.status(404).json({ error: "Salón no encontrado" });
  } catch (error) {
    console.error("Error al buscar el salón:", error);
    res.status(500).json({ error: "Error al buscar el salón" });
  }
});

module.exports = router;
