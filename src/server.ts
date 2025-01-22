import { config } from "dotenv";
// Charger les variables d'environnement
config();
import app from "./app";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
