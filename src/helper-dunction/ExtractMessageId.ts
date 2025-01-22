import axios from "axios";

// Fonction pour récupérer le message du post pour une page donnée
const getPostMessageFromPage = async (
  pageId: string,
  accessToken: string,
  postId: string
): Promise<string | null> => {
  const url = `https://graph.facebook.com/v21.0/${postId}?fields=message&access_token=${accessToken}`;

  try {
    const response = await axios.get(url);

    // Si le message existe dans la réponse
    if (response.data && response.data.message) {
      console.log(
        `Message trouvé pour la page ${pageId}:`,
        response.data.message
      );
      return response.data.message;
    } else {
      console.log(
        `Aucun message trouvé pour le post ${postId} sur la page ${pageId}.`
      );
      return null;
    }
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du message pour le post ${postId} sur la page ${pageId}:`,
      error
    );
    return null;
  }
};

// Fonction pour traiter plusieurs pages et récupérer le message dès qu'il est trouvé
const fetchMessagesFromPages = async (
  accessTokenPage1: string,
  accessTokenPage2: string,
  postId: string
) => {
  // Liste des pages à traiter
  const pages = [
    { pageId: "Page1", accessToken: accessTokenPage1 },
    { pageId: "Page2", accessToken: accessTokenPage2 },
  ];

  for (const page of pages) {
    const message = await getPostMessageFromPage(
      page.pageId,
      page.accessToken,
      postId
    );

    if (message) {
      // Si un message valide est trouvé, on arrête et on renvoie le message
      return {
        pageId: page.pageId,
        message: message,
      };
    }
  }

  // Si aucun message valide n'est trouvé
  return null;
};

// Exemple d'utilisation
const accessTokenPage1 =
  "EAAZASXPS0t6cBO4guVWKP8LA5wGd20IvJkmt8C53HIRnzpFEz31XHjxrdmIT98YaJi25kjRe3zeIJER3N7NToVGxwBelpzZANX1GsZA4uSVTZAc1BDvH2rR7KzPqLjPwMTs6zZBsBv6SKcbPRRCYxkpMIc1iwTjGbNZCo80uCuT53pRyFeUEoMMfbIaMLwGiyBpcP33QZAKVOrM3Jvs";
const accessTokenPage2 =
  "EAAZASXPS0t6cBO9rZCZBPHK65vQ8SDQ7IhZAtQlVTx8yP4TdXZBoZAav5kLiHevairecIxBhdOrqLdPoXavt6zinnGZCOQdDBGlvMKiCbvlvZA1vkutysZAA3NlGNIePL3REOv3KJjXStHbliKZCxxIhsbShWVN4hCA75v6UNgeYgoCsHZCzDT5DBZCjZA0ffazk82nEbxFZBmBWJGYWBxUusZD";

const postId = "981551527115325"; // L'ID du post à récupérer

fetchMessagesFromPages(accessTokenPage1, accessTokenPage2, postId)
  .then((result) => {
    if (result) {
      console.log(
        `Message trouvé sur la page ${result.pageId}: ${result.message}`
      );
    } else {
      console.log("Aucun message trouvé sur les deux pages.");
    }
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des messages: ", error);
  });
