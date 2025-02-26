import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { sendMessage } from "./helper-dunction/WA-send-message";
// import extractLinkAndFetchData from "./helper-dunction/extractLinkAndMessage";
// import { extractPostIdFromUrl } from "./helper-dunction/extractPostIdFromUrl";
import processFacebookLink from "./helper-dunction/processFacebookLink";
import { createClient } from "@supabase/supabase-js";
import getProductIdFromPages from "./helper-dunction/getProductDetailsFromPages";
require("ts-node/register");
// Configure Supabase
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_KEY as string;

// Initialisation de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fonction pour récupérer tous les produits
const getAllProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error(
      "Erreur lors de la récupération des produits :",
      error.message
    );
    return [];
  }

  return data;
};
const app = express();
// Middleware pour parser le JSON
app.use(express.json());
// Middleware pour traiter les données x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Liste des mots-clés et leurs réponses
const keywordsResponses: { [key: string]: string } = {
  "vous êtes situés où ?":
    "Nous sommes situés à Douala, mais nous livrons dans tout le Cameroun.",
  "livrez moi l’article":
    "Veuillez préciser votre adresse et le délai souhaité. Nous organiserons la livraison rapidement !",
  "la livraison est gratuite":
    "La livraison est gratuite pour certains articles ou à partir d'un montant minimum. Contactez-nous pour plus de détails.",
  "la livraison c’est combien":
    "Les frais de livraison dépendent de votre emplacement. Veuillez nous indiquer votre adresse pour une estimation.",
  "la garantie est de combien de temps":
    "La garantie dépend de l'article. Généralement, elle varie entre 6 mois et 1 an.",
  "vous livrez": "Oui, nous livrons rapidement dans tout le Cameroun !",
  "livrer moi demain":
    "Nous ferons de notre mieux pour livrer demain. Merci de confirmer votre commande et votre adresse.",
  "quel est la procédure à suivre pour l’obtenir":
    "Pour obtenir l'article, veuillez confirmer votre commande et fournir vos coordonnées complètes.",
  "puis avoir votre catalogue":
    "Voici notre catalogue complet : [Insérez un lien ou une description].",
  "vous avez un catalogue":
    "Oui, nous avons un catalogue. Veuillez consulter ce lien : [Insérez un lien ou une description].",
  "envoyé moi les images reels":
    "Nous allons vous envoyer les images réelles dans un instant.",
  "donner moi la conduite à tenir":
    "La conduite à tenir dépend de la situation. Veuillez nous donner plus de détails pour vous aider au mieux.",
};
// FIN LISTE DES MOT CLEE

//! FONCTION POUR ANALYER LES MESSAGE DES MOT CLEE
const processMessage = (message: string): string => {
  // Normaliser le message (minuscule, sans accents, etc.)
  const normalizedMessage = message.toLowerCase();
  // Rechercher un mot-clé correspondant
  for (const keyword in keywordsResponses) {
    if (normalizedMessage.includes(keyword.toLowerCase())) {
      return keywordsResponses[keyword];
    }
  }
  // Réponse par défaut si aucun mot-clé ne correspond
  return "Merci pour votre message. Nous vous répondrons dans les plus brefs délais.";
};
//!FIN  FONCTION POUR ANALYER LES MESSAGE DES MOT CLEE
app.get("/", (req: Request, res: Response) => {
  res.send("Bienvenue sur le serveur Node.js avec TypeScript !");
});

app.post("/webhook/whatsapp", async (req, res) => {
  const { Body, From } = req.body;
  console.log(`Message reçu de ${From}: ${Body}`);
  // Traiter le message et générer une réponse
  console.log(req.body);
  try {
    console.log(`Message reçu de ${From}: ${Body}`);
    const responseMessage = processMessage(Body);

    // Envoyer une réponse via WhatsApp
    await sendMessage(responseMessage, From);
    console.log("Réponse envoyée avec succès !");
    res.status(200).send("Message traité avec succès.");
    // LOGIQUE FACEBOOK

    const logAllProducts = async () => {
      const products = await getAllProducts(); // Attendre la récupération des produits
      const productIds = products.map((product) => product.product_id); // recupere tout les produit id

      const chaine = Body;
      const recherche = productIds;
      // On utilise `find()` pour trouver la première chaîne du tableau qui existe dans `chaine`
      const correspondance = recherche.find((item) => chaine.includes(item));
      if (correspondance) {
        console.log("Il y a une correspondance avec : " + correspondance);
        async function getArticleByName(nom: string) {
          const { data, error } = await supabase
            .from("products") // Nom de la table dans Supabase
            .select("*") // Sélectionner tous les champs
            .eq("product_id", nom); // Filtrer par le champ 'nom'

          if (error) {
            console.error("Erreur de récupération des données:", error);
            return null;
          }

          return data;
        }

        // Appel de la fonction avec le nom d'article que vous recherchez
        getArticleByName(correspondance).then(async (product) => {
          if (product && product.length > 0) {
            const imageOne = product[0]?.images[0];
            const imageTwo = product[0]?.images[1];
            // const imageThree = product[0]?.images[2];
            // const imageFoor = product[0]?.images[3];

            console.log(product[0]);
            const messageone = `*${product[0].delivery_fee}*`;
            const messagetwo = `
1. *${product[0].question_1}*
2. *${product[0].question_2}*
3. *${product[0].question_3}*
`;

            await sendMessage(messageone, From, [imageOne]);
            await sendMessage(messagetwo, From, [imageTwo]);
          } else {
            console.log("Aucun article trouvé.");
          }
        });
      } else {
        console.log("Aucune correspondance trouvée.");
      }
    };
    logAllProducts();

    // Exemple d'utilisation
    const message = Body;
    const productidClient = await processFacebookLink(message);

    if (productidClient) {
      // console.log("Identifiant formaté:", productidClient.formattedId);
      // Exemple d'appel avec l'ID du produit
      const productId = productidClient.formattedId;
      // Exemple d'appel avec l'ID du produit

      getProductIdFromPages(productId).then((id) => {
        if (id) {
          // console.log("ID du produit:", id);

          /**
           * Récupérer un produit de la table 'product' en fonction de l'ID.
           * @param clientIdProductId - L'ID du produit reçu côté client.
           * @returns Les détails du produit ou une erreur.
           */
          async function getProductById(clientIdProductId: string) {
            try {
              const { data, error } = await supabase
                .from("products") // Nom de la table
                .select("*") // Sélectionner toutes les colonnes
                .eq("product_id", clientIdProductId) // Filtrer par productId
                .single(); // Retourner un seul résultat

              if (error) {
                throw new Error(
                  `Erreur lors de la récupération du produit : ${error.message}`
                );
              }

              return data; // Retourner les détails du produit
            } catch (error) {
              console.error("Erreur :", error);
              return null;
            }
          }

          // Exemple d'appel de la fonction
          const clientProductId = id; // ID reçu côté client
          getProductById(clientProductId).then(async (product) => {
            if (product) {
              const imageOne = product?.images[0];
              const imageTwo = product?.images[1];
              // console.log("Produit trouvé :", product.images[0]);
              const messageone = `*${product.delivery_fee}*`;
              const messagetwo = `
1. *${product.question_1}*
2. *${product.question_2}*
3. *${product.question_3}* 
`;

              await sendMessage(messageone, From, imageOne);
              await sendMessage(messagetwo, From, imageTwo);
            } else {
              console.log("Aucun produit trouvé pour cet ID.");
            }
          });
        } else {
          console.log("Aucun ID trouvé avec les deux tokens.");
        }
      });
    } else {
      console.log("Aucun lien trouvé ou erreur.");
    }
  } catch (error) {
    console.error("Erreur lors du traitement du message :", error);
    res.status(500).send("Erreur lors du traitement du message.");
  }
});
export default app;
