# Luxe Cart MERN Ecommerce

A full ecommerce website built with the MERN stack: React/Vite frontend, Express API, and MongoDB-ready product/order models.
A full MERN stack ecommerce website with React storefront, Express API, MongoDB-ready models, cart, product filtering, and checkout UI.

## Run locally

```bash
npm run install-all
npm run dev
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## Optional MongoDB

Create `server/.env`:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/luxe-cart
PORT=5000
```

If `MONGO_URI` is not set, the API serves seeded in-memory products so the storefront still works.
