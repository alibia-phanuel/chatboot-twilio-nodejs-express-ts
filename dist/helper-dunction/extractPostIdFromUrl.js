"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPostIdFromUrl = void 0;
const extractPostIdFromUrl = (url) => {
    // Expression régulière pour extraire l'ID après "/videos/"
    const regex = /\/videos\/(\d+)\//;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1]; // Retourne l'ID extrait
    }
    else {
        console.log("Aucun ID trouvé dans l'URL.");
        return null;
    }
};
exports.extractPostIdFromUrl = extractPostIdFromUrl;
