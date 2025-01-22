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
const axios_1 = __importDefault(require("axios"));
function getProductIdFromPages(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Tokens d'accès des deux pages
        const accessTokenPage1 = "EAAZASXPS0t6cBO4guVWKP8LA5wGd20IvJkmt8C53HIRnzpFEz31XHjxrdmIT98YaJi25kjRe3zeIJER3N7NToVGxwBelpzZANX1GsZA4uSVTZAc1BDvH2rR7KzPqLjPwMTs6zZBsBv6SKcbPRRCYxkpMIc1iwTjGbNZCo80uCuT53pRyFeUEoMMfbIaMLwGiyBpcP33QZAKVOrM3Jvs";
        const accessTokenPage2 = "EAAZASXPS0t6cBO9rZCZBPHK65vQ8SDQ7IhZAtQlVTx8yP4TdXZBoZAav5kLiHevairecIxBhdOrqLdPoXavt6zinnGZCOQdDBGlvMKiCbvlvZA1vkutysZAA3NlGNIePL3REOv3KJjXStHbliKZCxxIhsbShWVN4hCA75v6UNgeYgoCsHZCzDT5DBZCjZA0ffazk82nEbxFZBmBWJGYWBxUusZD";
        const url = (productId, accessToken) => `https://graph.facebook.com/v21.0/${productId}?fields=id,message&access_token=${accessToken}`;
        // Fonction pour récupérer l'ID du produit
        const fetchProductId = (productId, accessToken) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(url(productId, accessToken));
                if (response.data && response.data.id) {
                    // console.log(`ID du produit trouvé: ${response.data.id}`);
                    return response.data.id;
                }
                else {
                    console.log("Aucun ID trouvé pour ce produit.");
                    return null;
                }
            }
            catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
                return null;
            }
        });
        // Essayer avec le premier token
        let productIdFound = yield fetchProductId(productId, accessTokenPage1);
        // Si aucune donnée trouvée, essayer avec le deuxième token
        if (!productIdFound) {
            console.log("Tentative avec le deuxième token d'accès...");
            productIdFound = yield fetchProductId(productId, accessTokenPage2);
        }
        return productIdFound;
    });
}
exports.default = getProductIdFromPages;
