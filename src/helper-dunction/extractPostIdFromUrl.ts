export const extractPostIdFromUrl = (url: string): string | null => {
  // Expression régulière pour extraire l'ID après "/videos/"
  const regex = /\/videos\/(\d+)\//;

  const match = url.match(regex);

  if (match && match[1]) {
    return match[1]; // Retourne l'ID extrait
  } else {
    console.log("Aucun ID trouvé dans l'URL.");
    return null;
  }
};
