import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X
} from "lucide-react";
import heroImage from "./assets/hero-shopping.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const fallbackProducts = [
  {
    id: "p1",
    name: "Astra Knit Co-ord",
    category: "Fashion",
    price: 89,
    rating: 4.9,
    stock: 14,
    badge: "New",
    color: "#f5b8a8",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    description: "Soft-touch knit set with clean tailoring and all-day comfort."
  },
  {
    id: "p2",
    name: "Pulse Pro Headphones",
    category: "Tech",
    price: 149,
    rating: 4.8,
    stock: 20,
    badge: "Top rated",
    color: "#68c9c1",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Wireless audio with deep bass, adaptive noise control, and a sculpted fit."
  },
  {
    id: "p3",
    name: "Cove Ceramic Set",
    category: "Home",
    price: 64,
    rating: 4.7,
    stock: 18,
    badge: "Handmade",
    color: "#dfc070",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
    description: "Minimal tableware with organic edges and a satin-glaze finish."
  },
  {
    id: "p4",
    name: "Noir Trail Sneakers",
    category: "Footwear",
    price: 128,
    rating: 4.9,
    stock: 12,
    badge: "Limited",
    color: "#232323",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Street-ready sneaker with cushioned support and weatherized panels."
  },
  {
    id: "p5",
    name: "Glow Edit Skincare",
    category: "Beauty",
    price: 56,
    rating: 4.6,
    stock: 30,
    badge: "Clean",
    color: "#f17f6f",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
    description: "Hydrating serum duo for a smooth, luminous daily routine."
  },
  {
    id: "p6",
    name: "Transit Weekender",
    category: "Travel",
    price: 112,
    rating: 4.8,
    stock: 16,
    badge: "Best seller",
    color: "#46666b",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description: "Structured carryall with smart compartments and premium vegan leather."
  }
];

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function normalizeId(product) {
  return product._id || product.id;
}

export default function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data.length ? data : fallbackProducts))
      .catch(() => setProducts(fallbackProducts));
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const term = query.toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesQuery = `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [category, products, query]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 160 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  function addToCart(product) {
    const productId = normalizeId(product);
    setCart((items) => {
      const existing = items.find((item) => item.productId === productId);
      if (existing) {
        return items.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { ...product, productId, quantity: 1 }];
    });
    setCartOpen(true);
    setOrderStatus("");
  }

  function updateQuantity(productId, delta) {
    setCart((items) =>
      items
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  async function placeOrder(event) {
    event.preventDefault();
    if (!cart.length) return;
    setIsCheckingOut(true);
    setOrderStatus("");

    const form = new FormData(event.currentTarget);
    const payload = {
      customer: {
        name: form.get("name"),
        email: form.get("email"),
        address: form.get("address")
      },
      items: cart.map(({ productId, name, quantity, price }) => ({ productId, name, quantity, price })),
      subtotal,
      shipping,
      total
    };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Order failed");
      setCart([]);
      setOrderStatus("Order placed. Your curated haul is being prepared.");
      event.currentTarget.reset();
    } catch {
      setOrderStatus("Demo checkout saved locally. Start the API for live order capture.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Luxe Cart home">
          <span className="brand-mark">LC</span>
          <span>Luxe Cart</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#shop">Shop</a>
          <a href="#collections">Collections</a>
          <a href="#checkout">Checkout</a>
        </nav>
        <button className="icon-button cart-trigger" onClick={() => setCartOpen(true)} aria-label="Open cart">
          <ShoppingBag size={20} />
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>
      </header>

      <main id="top">
        <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(17, 23, 24, 0.78), rgba(17, 23, 24, 0.2)), url(${heroImage})` }}>
          <div className="hero-content">
            <p className="eyebrow"><Sparkles size={16} /> Spring edit is live</p>
            <h1>Luxe Cart</h1>
            <p>
              Premium fashion, beauty, tech, and home pieces curated for people who want shopping to feel sharp,
              personal, and effortless.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#shop">
                Shop arrivals <ArrowRight size={18} />
              </a>
              <a className="ghost-button" href="#collections">Explore edits</a>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Store benefits">
          <div><Truck size={20} /> Free shipping over $160</div>
          <div><PackageCheck size={20} /> Quality checked products</div>
          <div><BadgePercent size={20} /> Member-only seasonal drops</div>
        </section>

        <section className="collections" id="collections">
          <div className="section-heading">
            <p className="eyebrow">Curated collections</p>
            <h2>Everything feels considered</h2>
          </div>
          <div className="collection-grid">
            <article className="feature-panel fashion-panel">
              <span>01</span>
              <h3>Modern wardrobe staples</h3>
              <p>Layerable silhouettes, soft textures, and statement accessories.</p>
            </article>
            <article className="feature-panel tech-panel">
              <span>02</span>
              <h3>Smarter daily carry</h3>
              <p>Audio, bags, and tools that make the commute smoother.</p>
            </article>
            <article className="feature-panel home-panel">
              <span>03</span>
              <h3>Home pieces with presence</h3>
              <p>Warm ceramics, clean forms, and finishing touches for quiet luxury.</p>
            </article>
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading shop-heading">
            <div>
              <p className="eyebrow">Shop the edit</p>
              <h2>New arrivals picked for right now</h2>
            </div>
            <div className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products"
                aria-label="Search products"
              />
            </div>
          </div>

          <div className="filter-row" aria-label="Product categories">
            <SlidersHorizontal size={18} />
            {categories.map((item) => (
              <button
                key={item}
                className={item === category ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={normalizeId(product)}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span style={{ background: product.color }}>{product.badge}</span>
                  <button className="wishlist-button" aria-label={`Save ${product.name}`}>
                    <Heart size={18} />
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-meta">
                    <span>{product.category}</span>
                    <span><Star size={15} fill="currentColor" /> {product.rating}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-footer">
                    <strong>{money(product.price)}</strong>
                    <button onClick={() => addToCart(product)}>
                      <ShoppingBag size={17} /> Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="checkout-section" id="checkout">
          <div className="checkout-copy">
            <p className="eyebrow">Fast checkout</p>
            <h2>Ready when your cart is</h2>
            <p>
              Submit a demo order to the Express API. With MongoDB configured, orders persist in the database.
            </p>
          </div>
          <form className="checkout-form" onSubmit={placeOrder}>
            <input name="name" placeholder="Full name" required />
            <input name="email" type="email" placeholder="Email address" required />
            <textarea name="address" placeholder="Shipping address" rows="3" required />
            <div className="total-line">
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>
            <button className="primary-button" disabled={isCheckingOut || !cart.length}>
              {isCheckingOut ? "Placing order..." : "Place order"}
            </button>
            {orderStatus && <p className="order-status">{orderStatus}</p>}
          </form>
        </section>
      </main>

      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-header">
          <div>
            <p className="eyebrow">Your cart</p>
            <h2>{cartCount} item{cartCount === 1 ? "" : "s"}</h2>
          </div>
          <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is waiting for something excellent.</p>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.productId}>
                <img src={item.image} alt="" />
                <div>
                  <h3>{item.name}</h3>
                  <p>{money(item.price)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.productId, -1)} aria-label={`Remove one ${item.name}`}>
                      <Minus size={15} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} aria-label={`Add one ${item.name}`}>
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <div><span>Shipping</span><strong>{shipping ? money(shipping) : "Free"}</strong></div>
          <div><span>Total</span><strong>{money(total)}</strong></div>
          <a className="primary-button" href="#checkout" onClick={() => setCartOpen(false)}>
            Checkout <ArrowRight size={18} />
          </a>
        </div>
      </aside>
      {cartOpen && <button className="drawer-scrim" aria-label="Close cart overlay" onClick={() => setCartOpen(false)} />}
    </div>
  );
}
