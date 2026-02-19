// src/utils/shopify.js

const SHOPIFY_URL = `https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

/* =========================
FETCH BASE
========================= */
export async function shopifyFetch(query, variables = {}) {
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
console.error(json.errors);
throw new Error("Error en Shopify");
}

return json.data;
}

/* =========================
CREAR CARRITO
========================= */
export async function createCart() {
const mutation = `
mutation {
    cartCreate {
    cart {
        id
    }
    }
}
`;

const data = await shopifyFetch(mutation);
const cartId = data.cartCreate.cart.id;

localStorage.setItem("shopify_cart_id", cartId);

return cartId;
}

/* =========================
AGREGAR AL CARRITO
========================= */
export async function addToCart(variantId, quantity = 1) {
let cartId = localStorage.getItem("shopify_cart_id");

if (!cartId) {
cartId = await createCart();
}

const mutation = `
mutation addLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
        id
    }
    }
}
`;

await shopifyFetch(mutation, {
cartId,
lines: [
    {
    merchandiseId: variantId,
    quantity,
    },
],
});
}