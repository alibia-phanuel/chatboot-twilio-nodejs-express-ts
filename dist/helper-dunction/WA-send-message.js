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
exports.sendMessage = void 0;
const dotenv_1 = require("dotenv");
const twilio_1 = __importDefault(require("twilio"));
// Charger les variables d'environnement
(0, dotenv_1.config)();
// Valider les variables d'environnement
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
if (!accountSid || !authToken) {
    throw new Error("Les variables TWILIO_ACCOUNT_SID et TWILIO_AUTH_TOKEN doivent être définies.");
}
// Initialiser le client Twilio
const client = (0, twilio_1.default)(accountSid, authToken); // Pas besoin de typer explicitement
/**
 * Fonction pour envoyer un message sur WhatsApp
 * @param message - Le contenu du message à envoyer
 * @param senderID - L'ID du destinataire (WhatsApp)
 */
const sendMessage = (message_1, senderID_1, ...args_1) => __awaiter(void 0, [message_1, senderID_1, ...args_1], void 0, function* (message, senderID, imageUrls = [] // Valeur par défaut : tableau vide
) {
    try {
        yield client.messages.create({
            to: senderID,
            body: message,
            from: `whatsapp:+24177395120`, // Remplacer par votre numéro Twilio WhatsApp
            mediaUrl: imageUrls.length > 0 ? imageUrls : undefined, // Vérifier si le tableau est vide
        });
        console.log(`Message envoyé à ${senderID}`);
    }
    catch (error) {
        console.error(`Erreur lors de l'envoi du message --> ${error}`);
    }
});
exports.sendMessage = sendMessage;
// Exporter le client Twilio pour d'autres utilisations
exports.default = client;
