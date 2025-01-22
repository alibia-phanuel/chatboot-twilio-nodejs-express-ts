import axios from "axios";

async function getProductIdFromPages(productId: string) {
  // Tokens d'accès des deux pages
  const accessTokenPage1 =
    "EAAZASXPS0t6cBO4guVWKP8LA5wGd20IvJkmt8C53HIRnzpFEz31XHjxrdmIT98YaJi25kjRe3zeIJER3N7NToVGxwBelpzZANX1GsZA4uSVTZAc1BDvH2rR7KzPqLjPwMTs6zZBsBv6SKcbPRRCYxkpMIc1iwTjGbNZCo80uCuT53pRyFeUEoMMfbIaMLwGiyBpcP33QZAKVOrM3Jvs";
  const accessTokenPage2 =
    "EAAZASXPS0t6cBO9rZCZBPHK65vQ8SDQ7IhZAtQlVTx8yP4TdXZBoZAav5kLiHevairecIxBhdOrqLdPoXavt6zinnGZCOQdDBGlvMKiCbvlvZA1vkutysZAA3NlGNIePL3REOv3KJjXStHbliKZCxxIhsbShWVN4hCA75v6UNgeYgoCsHZCzDT5DBZCjZA0ffazk82nEbxFZBmBWJGYWBxUusZD";

  const url = (productId: string, accessToken: string) =>
    `https://graph.facebook.com/v21.0/${productId}?fields=id,message&access_token=${accessToken}`;

  // Fonction pour récupérer l'ID du produit
  const fetchProductId = async (productId: string, accessToken: string) => {
    try {
      const response = await axios.get(url(productId, accessToken));
      if (response.data && response.data.id) {
        // console.log(`ID du produit trouvé: ${response.data.id}`);
        return response.data.id;
      } else {
        console.log("Aucun ID trouvé pour ce produit.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return null;
    }
  };

  // Essayer avec le premier token
  let productIdFound = await fetchProductId(productId, accessTokenPage1);

  // Si aucune donnée trouvée, essayer avec le deuxième token
  if (!productIdFound) {
    console.log("Tentative avec le deuxième token d'accès...");
    productIdFound = await fetchProductId(productId, accessTokenPage2);
  }

  return productIdFound;
}

export default getProductIdFromPages;
