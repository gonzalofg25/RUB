import { useState, useEffect, useRef, useCallback } from "react";
import Notificacion from '../../resources/notificacion.mp3'; // Importar audio

// Datos iniciales
const sampleOrders = [
  {
    id: 1,
    address: "Calle Real 12",
    total: 14.9,
    priority: "normal",
    items: [
      "Burger clásica",
      "Patatas",
      "Coca-cola",
      "Extra queso",
      "Salsa BBQ"
    ]
  },
  {
    id: 2,
    address: "Avenida Andalucía 45",
    total: 11.5,
    priority: "alta",
    items: [
      "Burger doble",
      "Sin cebolla"
    ]
  },
  {
    id: 3,
    address: "Calle Sevilla 8",
    total: 17.2,
    priority: "baja",
    items: [
      "Burger pollo",
      "Patatas grandes",
      "Fanta",
      "Salsa mayo",
      "Extra bacon",
      "Sin tomate"
    ]
  }
];

// Componente de cada pedido
function OrderCard({ order, onComplete }) {
  const [expanded, setExpanded] = useState(false);
  const maxItems = 3;
  const isLong = order.items.length > maxItems;
  const visibleItems = expanded ? order.items : order.items.slice(0, maxItems);

  return (
    <div className={`order-card priority-${order.priority}`}>
      <div className="order-title">Pedido #{order.id}</div>
      <div className="order-address">📍 {order.address}</div>

      <ul className="order-items">
        {visibleItems.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>

      {isLong && (
        <button onClick={() => setExpanded(!expanded)} className="toggle-btn">
          {expanded ? "Ver menos" : "Ver pedido completo"}
        </button>
      )}

      <div className="order-total">Total: {order.total.toFixed(2)} €</div>

      <button className="complete-btn" onClick={() => onComplete(order.id)}>
        Marcar como completado
      </button>
    </div>
  );
}

// Componente principal
export default function OrdersScreen() {
  const [orders, setOrders] = useState(sampleOrders);
  const [nextId, setNextId] = useState(sampleOrders.length + 1);

  const notificationSound = useRef(new Audio(Notificacion));

  // Completar pedido
  const completeOrder = useCallback((id) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  }, []);

  // Agregar nuevo pedido
  const addOrder = useCallback((newOrder) => {
    newOrder.id = nextId;
    setNextId(prev => prev + 1);

    // Reproducir sonido de notificación
    notificationSound.current.play().catch(e => console.log("No se pudo reproducir el audio:", e));

    setOrders(prev => [...prev, newOrder]);
  }, [nextId]);

  // Efecto para generar pedidos nuevos cada 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const priorities = ["alta", "normal", "baja"];
      const newOrder = {
        address: "Calle Nueva " + Math.floor(Math.random() * 100),
        total: Number((Math.random() * 20 + 8).toFixed(2)),
        priority: priorities[Math.floor(Math.random() * 3)],
        items: ["Burger RUB", "Patatas", "Coca-cola"]
      };
      addOrder(newOrder);
    }, 15000);

    return () => clearInterval(interval);
  }, [addOrder]);

  return (
    <div className="app-container">
      <div className="content">
        <h1 id="rub" className="title">RUB</h1>
        <h1 className="title">Pedidos en preparación</h1>

        <div className="orders-grid">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onComplete={completeOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
}