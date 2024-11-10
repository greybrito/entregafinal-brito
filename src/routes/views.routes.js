import { Router } from "express";
import { readFileSync } from "../fileManager.js";
const router = Router();

// Inicializacion products
let products = [];

//GET ALL products real time
router.get("/realtimeproducts", async (req, res) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!page) page = 1;
  if (!limit) limit = 10;

  let result = await readFileSync.paginate(
    {},
    { limit: limit, page: page, lean: true }
  );

  // validacion de extremos en la plantilla de hbs
  result.isValid = !(page <= 0 || page > result.totalPages);

  try {
    const products = await readFileSync("productos.json");
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error al leer el archivo productos.json:", error);
    res.status(500).send("Error interno del servidor");
  }
});

//GET ALL products
router.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : false;
    products = await readFileSync("productos.json");
    if (limit) {
      products = products.slice(0, limit);
    }
    res.render("home", { products });
  } catch (error) {
    console.error("Error al leer el archivo productos.json:", error);
    res.status(500).send("Error interno del servidor");
  }
});

//exportamos router
export default router;
