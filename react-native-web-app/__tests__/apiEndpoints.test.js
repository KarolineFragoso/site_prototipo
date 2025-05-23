import fetch from 'node-fetch';

const API_URL = "https://joaozinho-celular.onrender.com";

describe("API Endpoints", () => {
  test("GET /products returns products list", async () => {
    const response = await fetch(API_URL + '/products');
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("POST /products creates a new product", async () => {
    const newProduct = {
      name: "Produto Teste API",
      retail_price: 10.5,
      wholesale_price: 8,
      quantity: 5,
    };
    const response = await fetch(API_URL + '/products', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.name).toBe(newProduct.name);
  });

  test("PUT /products/:id updates a product", async () => {
    // First get a product to update
    const productsResponse = await fetch(API_URL + '/products');
    const products = await productsResponse.json();
    if (products.length === 0) {
      return;
    }
    const product = products[0];
    const updatedProduct = {
      name: product.name + " Updated",
      retail_price: product.retail_price + 1,
      wholesale_price: product.wholesale_price + 1,
      quantity: product.quantity + 1,
    };
    const response = await fetch(API_URL + '/products/' + product.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.name).toBe(updatedProduct.name);
  });

  test("GET /sales returns sales list", async () => {
    const response = await fetch(API_URL + '/sales');
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("POST /sales creates a new sale", async () => {
    // First get a product to sell
    const productsResponse = await fetch(API_URL + '/products');
    const products = await productsResponse.json();
    if (products.length === 0) {
      return;
    }
    const product = products[0];
    const newSale = {
      product_id: product.id,
      quantity: 1,
    };
    const response = await fetch(API_URL + '/sales', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSale),
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.product).toBeDefined();
  });
});
