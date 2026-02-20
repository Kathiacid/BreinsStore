const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

export async function shopifyFetch(query, variables = {}) {
try {
const res = await fetch(SHOPIFY_URL, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
});
const json = await res.json();
if (json.errors) {
    console.error("Errores de GraphQL:", json.errors);
    return { errors: json.errors };
}
return json.data;
} catch (error) {
console.error("Error en shopifyFetch:", error);
throw error;
}
}

export async function createCart() {
const mutation = `mutation { cartCreate { cart { id checkoutUrl } } }`;
const data = await shopifyFetch(mutation);
const cartId = data.cartCreate.cart.id;
localStorage.setItem("shopify_cart_id", cartId);
return cartId;
}

export async function getCart() {
const cartId = localStorage.getItem("shopify_cart_id");
if (!cartId) return null;

const query = `
query getCart($cartId: ID!) {
    cart(id: $cartId) {
    id
    totalQuantity
    checkoutUrl
    lines(first: 20) {
        edges {
        node {
            id
            quantity
            merchandise {
            ... on ProductVariant {
                id
                title
                price { amount }
                compareAtPrice { amount }
                image { url }
                product { title }
            }
            }
        }
        }
    }
    cost { totalAmount { amount } }
    }
}
`;

const data = await shopifyFetch(query, { cartId });

// Si Shopify devuelve null (el carrito expiró o ya se pagó), limpiamos local
if (!data || !data.cart) {
localStorage.removeItem("shopify_cart_id");
return null;
}

return data.cart;
}

export async function addToCart(variantId, quantity = 1) {
let cartId = localStorage.getItem("shopify_cart_id");

if (!cartId) {
cartId = await createCart();
}

const mutation = `
mutation addLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { id }
    userErrors { field message }
    }
}
`;

const data = await shopifyFetch(mutation, { 
cartId, 
lines: [{ merchandiseId: variantId, quantity }] 
});

// Si hay errores de usuario (como ID de carrito inválido)
if (data.errors || (data.cartLinesAdd?.userErrors && data.cartLinesAdd.userErrors.length > 0)) {
console.warn("Carrito inválido detectado. Limpiando y reintentando...");
localStorage.removeItem("shopify_cart_id");
// Reintento automático: se llama a sí mismo para crear uno nuevo
return addToCart(variantId, quantity);
}

window.dispatchEvent(new Event("cartUpdated"));
window.dispatchEvent(new Event("openCart"));
}

export async function updateCartQuantity(lineId, quantity) {
const cartId = localStorage.getItem("shopify_cart_id");
const mutation = `
mutation update($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } }
}
`;
await shopifyFetch(mutation, { cartId, lines: [{ id: lineId, quantity: parseInt(quantity) }] });
window.dispatchEvent(new Event("cartUpdated"));
}

export async function removeFromCart(lineId) {
const cartId = localStorage.getItem("shopify_cart_id");
const mutation = `
mutation remove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } }
}
`;
await shopifyFetch(mutation, { cartId, lineIds: [lineId] });
window.dispatchEvent(new Event("cartUpdated"));
}