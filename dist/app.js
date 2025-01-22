"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const WA_send_message_1 = require("./helper-dunction/WA-send-message");
// import extractLinkAndFetchData from "./helper-dunction/extractLinkAndMessage";
// import { extractPostIdFromUrl } from "./helper-dunction/extractPostIdFromUrl";
const processFacebookLink_1 = __importDefault(require("./helper-dunction/processFacebookLink"));
const supabase_js_1 = require("@supabase/supabase-js");
const getProductDetailsFromPages_1 = __importDefault(require("./helper-dunction/getProductDetailsFromPages"));
require("ts-node/register");
// Configure Supabase
const SUPABASE_URL = "https://njythokucbnxigcwzvqj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeXRob2t1Y2JueGlnY3d6dnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNDA4NjAsImV4cCI6MjA1MjgxNjg2MH0.WPfZ7PGRd_mASeos2Gw_XdHaMqcXkBWhiNSQnx4DoFk";
// Initialisation de Supabase
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
// Fonction pour récupérer tous les produits
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase.from("products").select("*");
    if (error) {
        console.error("Erreur lors de la récupération des produits :", error.message);
        return [];
    }
    return data;
});
const app = (0, express_1.default)();
// Middleware pour parser le JSON
app.use(express_1.default.json());
// Middleware pour traiter les données x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Liste des mots-clés et leurs réponses
const keywordsResponses = {
    "vous êtes situés où ?": "Nous sommes situés à Douala, mais nous livrons dans tout le Cameroun.",
    "livrez moi l’article": "Veuillez préciser votre adresse et le délai souhaité. Nous organiserons la livraison rapidement !",
    "la livraison est gratuite": "La livraison est gratuite pour certains articles ou à partir d'un montant minimum. Contactez-nous pour plus de détails.",
    "la livraison c’est combien": "Les frais de livraison dépendent de votre emplacement. Veuillez nous indiquer votre adresse pour une estimation.",
    "la garantie est de combien de temps": "La garantie dépend de l'article. Généralement, elle varie entre 6 mois et 1 an.",
    "vous livrez": "Oui, nous livrons rapidement dans tout le Cameroun !",
    "livrer moi demain": "Nous ferons de notre mieux pour livrer demain. Merci de confirmer votre commande et votre adresse.",
    "quel est la procédure à suivre pour l’obtenir": "Pour obtenir l'article, veuillez confirmer votre commande et fournir vos coordonnées complètes.",
    "puis avoir votre catalogue": "Voici notre catalogue complet : [Insérez un lien ou une description].",
    "vous avez un catalogue": "Oui, nous avons un catalogue. Veuillez consulter ce lien : [Insérez un lien ou une description].",
    "envoyé moi les images reels": "Nous allons vous envoyer les images réelles dans un instant.",
    "donner moi la conduite à tenir": "La conduite à tenir dépend de la situation. Veuillez nous donner plus de détails pour vous aider au mieux.",
};
// FIN LISTE DES MOT CLEE
//! FONCTION POUR ANALYER LES MESSAGE DES MOT CLEE
const processMessage = (message) => {
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
app.get("/", (req, res) => {
    res.send("Bienvenue sur le serveur Node.js avec TypeScript !");
});
app.post("/webhook/whatsapp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Body, From } = req.body;
    console.log(`Message reçu de ${From}: ${Body}`);
    // Traiter le message et générer une réponse
    console.log(req.body);
    try {
        console.log(`Message reçu de ${From}: ${Body}`);
        const responseMessage = processMessage(Body);
        // Envoyer une réponse via WhatsApp
        yield (0, WA_send_message_1.sendMessage)(responseMessage, From);
        console.log("Réponse envoyée avec succès !");
        res.status(200).send("Message traité avec succès.");
        // LOGIQUE FACEBOOK
        const logAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
            const products = yield getAllProducts(); // Attendre la récupération des produits
            const productIds = products.map((product) => product.product_id); // recupere tout les produit id
            const chaine = Body;
            const recherche = productIds;
            // On utilise `find()` pour trouver la première chaîne du tableau qui existe dans `chaine`
            const correspondance = recherche.find((item) => chaine.includes(item));
            if (correspondance) {
                console.log("Il y a une correspondance avec : " + correspondance);
                function getArticleByName(nom) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { data, error } = yield supabase
                            .from("products") // Nom de la table dans Supabase
                            .select("*") // Sélectionner tous les champs
                            .eq("product_id", nom); // Filtrer par le champ 'nom'
                        if (error) {
                            console.error("Erreur de récupération des données:", error);
                            return null;
                        }
                        return data;
                    });
                }
                // Appel de la fonction avec le nom d'article que vous recherchez
                getArticleByName(correspondance).then((product) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a, _b;
                    if (product && product.length > 0) {
                        const imageOne = (_a = product[0]) === null || _a === void 0 ? void 0 : _a.images[0];
                        const imageTwo = (_b = product[0]) === null || _b === void 0 ? void 0 : _b.images[1];
                        // const imageThree = product[0]?.images[2];
                        // const imageFoor = product[0]?.images[3];
                        console.log(product[0]);
                        const messageone = `*${product[0].delivery_fee}*`;
                        const messagetwo = `
1. *${product[0].question_1}*
2. *${product[0].question_2}*
3. *${product[0].question_3}*
`;
                        yield (0, WA_send_message_1.sendMessage)(messageone, From, [imageOne]);
                        yield (0, WA_send_message_1.sendMessage)(messagetwo, From, [imageTwo]);
                    }
                    else {
                        console.log("Aucun article trouvé.");
                    }
                }));
            }
            else {
                console.log("Aucune correspondance trouvée.");
            }
        });
        logAllProducts();
        // Exemple d'utilisation
        const message = Body;
        const productidClient = yield (0, processFacebookLink_1.default)(message);
        if (productidClient) {
            // console.log("Identifiant formaté:", productidClient.formattedId);
            // Exemple d'appel avec l'ID du produit
            const productId = productidClient.formattedId;
            // Exemple d'appel avec l'ID du produit
            (0, getProductDetailsFromPages_1.default)(productId).then((id) => {
                if (id) {
                    // console.log("ID du produit:", id);
                    /**
                     * Récupérer un produit de la table 'product' en fonction de l'ID.
                     * @param clientIdProductId - L'ID du produit reçu côté client.
                     * @returns Les détails du produit ou une erreur.
                     */
                    function getProductById(clientIdProductId) {
                        return __awaiter(this, void 0, void 0, function* () {
                            try {
                                const { data, error } = yield supabase
                                    .from("products") // Nom de la table
                                    .select("*") // Sélectionner toutes les colonnes
                                    .eq("product_id", clientIdProductId) // Filtrer par productId
                                    .single(); // Retourner un seul résultat
                                if (error) {
                                    throw new Error(`Erreur lors de la récupération du produit : ${error.message}`);
                                }
                                return data; // Retourner les détails du produit
                            }
                            catch (error) {
                                console.error("Erreur :", error);
                                return null;
                            }
                        });
                    }
                    // Exemple d'appel de la fonction
                    const clientProductId = id; // ID reçu côté client
                    getProductById(clientProductId).then((product) => __awaiter(void 0, void 0, void 0, function* () {
                        if (product) {
                            const imageOne = product === null || product === void 0 ? void 0 : product.images[0];
                            const imageTwo = product === null || product === void 0 ? void 0 : product.images[1];
                            // console.log("Produit trouvé :", product.images[0]);
                            const messageone = `*${product.delivery_fee}*`;
                            const messagetwo = `
1. *${product.question_1}*
2. *${product.question_2}*
3. *${product.question_3}* 
`;
                            yield (0, WA_send_message_1.sendMessage)(messageone, From, imageOne);
                            yield (0, WA_send_message_1.sendMessage)(messagetwo, From, imageTwo);
                        }
                        else {
                            console.log("Aucun produit trouvé pour cet ID.");
                        }
                    }));
                }
                else {
                    console.log("Aucun ID trouvé avec les deux tokens.");
                }
            });
        }
        else {
            console.log("Aucun lien trouvé ou erreur.");
        }
    }
    catch (error) {
        console.error("Erreur lors du traitement du message :", error);
        res.status(500).send("Erreur lors du traitement du message.");
    }
}));
exports.default = app;
