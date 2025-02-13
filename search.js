require("dotenv").config();
const axios = require("axios");

async function searchGoogle(query) {
  const API_KEY = process.env.SEARCHAPI_KEY;
  const URL = `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(query)}&api_key=${API_KEY}`;

  try {
    const response = await axios.get(URL);
    const organic_results = response.data.organic_results;
    console.log("-------");

    if (
      organic_results && organic_results.length > 0 ) {
      const primerosResultados = organic_results.slice(0, 5);
      console.log(primerosResultados);
    } else {
      console.log("No hay resultados orgánicos disponibles.");
    }
  } catch (error) {
    console.error(
      "❌ Error en la consulta:",
      error.response?.data || error.message
    );
  }
}

// Leer el término de búsqueda desde la línea de comandos
const query = process.argv.slice(2).join(" ");
if (!query) {
  console.log("⚠️  Debes ingresar un término de búsqueda.");
} else {
  searchGoogle(query);
}
