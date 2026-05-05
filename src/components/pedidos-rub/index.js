import { useState, useEffect, useRef, useCallback} from "react";
import Notificacion from "../../resources/notificacion.mp3";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* --- MENU --- */
const menu = {
  entrantes: [
    { name: "Patatas", price: 2.0 },
    { name: "Sweet Potatoes", price: 3.2 },
    { name: "Tequeños", price: 4.2 },
    { name: "Fingers de pollo", price: 4.2 },
    { name: "Nuggets", price: 3.5 },
    { name: "Vegan Nuggets", price: 4.2 },
    { name: "Patatas Gajo RUB", price: 2.9 }
  ],

  hamburguesas_ternera: [
    { name: "Hamburguesa Simple", price: 2.3 },
    { name: "Hamburguesa Especial", price: 5.1 },
    { name: "Mustang", price: 5.4 }
  ],

  hamburguesas_buey: [
    { name: "Toscana", price: 6.8, premium: true },
    { name: "Cowboy", price: 6.7, premium: true }
  ],

  black_angus: [
    { name: "Montecarlo", price: 8.6, premium: true },
    { name: "Angus SPECIAL RUB", price: 8.6, premium: true },
    { name: "Angus Custom", price: 8.6, premium: true },
    { name: "Toscana Supreme", price: 10.4, premium: true }
  ],

  ensaladas: [
    { name: "Fresca", price: 4.7 },
    { name: "Capresse", price: 5.2 },
    { name: "César", price: 5.2 }
  ],

  smash: [
    { name: "Smash Rub", price: 8.4, premium: true },
    { name: "Smash Montecarlo", price: 8.4, premium: true },
    { name: "Smash Supreme", price: 8.4, premium: true }
  ],

  pollo: [
    { name: "Pimpollo", price: 4.0 },
    { name: "Pimpollo Custom", price: 6.9, premium: true }
  ],

  pan_ligero: [
    { name: "Ana", price: 5.0, premium: true },
    { name: "Trufada", price: 5.0, premium: true },
    { name: "Española", price: 5.0, premium: true }
  ],

  sandwiches: [
    { name: "Mixto", price: 3.0 },
    { name: "Moñi", price: 3.0 },
    { name: "Ave", price: 3.8 },
    { name: "Especial", price: 5.5 },
    { name: "Jackson", price: 5.0 },
    { name: "Valyrio", price: 5.5 }
  ],

  pan_golden: [
    { name: "Serrano", price: 6.4, premium: true },
    { name: "Donosti", price: 6.4, premium: true },
    { name: "Máximo", price: 6.4, premium: true }
  ],

  perritos: [
    { name: "Perrito Simple", price: 2.7 },
    { name: "Perrito Especial", price: 3.7 },
    { name: "Wonder", price: 4.2 },
    { name: "Hindú", price: 3.5 },
    { name: "Zeppelin", price: 3.5 }
  ],

  baguettes: [
    { name: "Bacon y queso", price: 4.0 },
    { name: "Tortilla", price: 4.4 },
    { name: "Suizo", price: 5.0 },
    { name: "Serranito", price: 5.4 },
    { name: "Jackson", price: 5.9 },
    { name: "Especial", price: 5.7 }
  ],

  gondolitas: [
    { name: "York", price: 3.2 },
    { name: "Carbonara", price: 4.0 },
    { name: "Donatella", price: 5.4 },
    { name: "Carmen", price: 5.4 },
    { name: "Extremeña", price: 4.5 },
    { name: "Del Monte", price: 5.4 },
    { name: "Guay", price: 4.7 }
  ],

  vegetariano: [
    { name: "Veggie Burger", price: 8.0 },
    { name: "Sandwich Especial Veg", price: 6.0 },
    { name: "Sandwich Jackson Veg", price: 6.0 }
  ],

  bebidas: [
    { name: "Coca-Cola", price: 1.2 },
    { name: "Coca-Cola Zero", price: 1.2 },
    { name: "Fanta Naranja", price: 1.2 },
    { name: "Fanta Limón", price: 1.2 },
    { name: "Nestea", price: 1.2 },
    { name: "Agua", price: 1.2 }
  ],

  extras: [
    { name: "Bacon", price: 0.7 },
    { name: "Queso", price: 0.7 },
    { name: "Mayonesa", price: 0.7 },
    { name: "Barbacoa", price: 0.7 },
    { name: "Curry", price: 0.7 },
    { name: "Nevada", price: 0.7 },
    { name: "Volcán", price: 0.7}
  ]
};

/* --- Calles --- */
const callesLosPalacios = [
  "Calle Real",
  "Avenida de Sevilla",
  "Calle Muñoz Seca",
  "Calle Blas Infante",
  "Calle San Sebastián",
  "Avenida de Utrera",
  "Calle Federico García Lorca",
  "Calle Virgen de Consolación",
  "Calle Pablo Picasso",
  "Calle Antonio Machado",
  "Calle José María Pemán"
];

/* --- Sample --- */
const sampleOrders = [
  {
    id: 1,
    address: "Calle Real 12",
    type: "delivery",
    priority: "normal",
    status: "new",
    createdAt: Date.now(),
    items: [{ name: "Simple", price: 2.3, extras: [], quantity: 1 }]
  }
];

const statuses = [
  { id: "new", label: "🆕 Nuevos" },
  { id: "preparing", label: "👨‍🍳 Preparando" },
  { id: "ready", label: "📦 Listos" },
  { id: "delivered", label: "🚚 En reparto" }
];

/* --- Sidebar --- */
function Sidebar({ setSelected }) {
  return (
    <div className="sidebar">
      <button onClick={() => setSelected("dashboard")}>Pedidos hoy</button>
      <button onClick={() => setSelected("ordersPerDay")}>Pedidos por día</button>
      <button onClick={() => setSelected("weeklyAverage")}>Promedio semanal</button>
    </div>
  );
}

/* --- OrderCard --- */
function OrderCard({ order, moveOrder, openEditor }) {
  const [expanded, setExpanded] = useState(false);
  const minutes = Math.floor((Date.now() - order.createdAt) / 60000);

  let timeClass = "time-green";
  if (minutes >= 30) timeClass = "time-red";
  else if (minutes >= 20) timeClass = "time-orange";

  const total = order.items.reduce(
    (acc, i) => acc + i.price + i.extras.length * 0.7,
    0
  );

  return (
    <div className={`order-card priority-${order.priority}`} onClick={() => openEditor(order)}>
      <div className="order-header">
        <span className="order-title">Pedido #{order.id}</span>
        <span className={`order-time ${timeClass}`}>⏱ {minutes} min</span>
      </div>

      {order.type === "delivery" && (
        <div className="order-address">📍 {order.address}
        {order.type === "salon" && "🍽 En local"}
        {order.type === "recoger" && "🛍 Recogida en mostrador"}
        </div>
      )}

      <div className="order-type">
        {order.type === "salon" && "🍽 Salón"}
        {order.type === "recoger" && "🛍 Recoger"}
        {order.type === "delivery" && "🚚 Domicilio"}
      </div>

      <ul className="order-items">
      {(expanded ? order.items : order.items.slice(0, 2)).map((item, i) => (
        <li key={i}>
          • {item.name} ({item.extras.join(", ")})
        </li>
      ))}
      </ul>

      {order.items.length > 2 && (
      <button
        className="toggle-btn"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(prev => !prev);
        }}
      >
        {expanded ? "Ver menos" : `Ver más (${order.items.length - 2})`}
      </button>
    )}

      <div className="order-total">{total.toFixed(2)} €</div>

      <div className="actions">
        {order.status === "new" && (
          <button onClick={e => { e.stopPropagation(); moveOrder(order.id, "preparing"); }}>
            Empezar preparación
          </button>
        )}

        {order.status === "preparing" && (
          <button onClick={e => { e.stopPropagation(); moveOrder(order.id, "ready"); }}>
            Marcar como listo
          </button>
        )}

        {order.status === "ready" && order.type === "delivery" && (
          <button
            onClick={e => {
              e.stopPropagation();
              moveOrder(order.id, "delivered");
            }}
          >
            Entregar pedido
          </button>
        )}
      </div>
    </div>
  );
}

/* --- Modal Editor --- */
function EditOrderModal({ order, updateOrder,deleteOrder , close }) {
  if (!order) return null;

  const addItem = item => {
    updateOrder({
      ...order,
      items: [...order.items, { ...item, extras: [], quantity: 1 }]
    });
  };

  const removeItem = index => {
    updateOrder({
      ...order,
      items: order.items.filter((_, i) => i !== index)
    });
  };

  const addExtra = (index, extra) => {
    const items = [...order.items];
    items[index].extras.push(extra.name);
    updateOrder({ ...order, items });
  };

  const total = order.items.reduce(
    (acc, i) => acc + i.price + i.extras.length * 0.7,
    0
  );

  return (
    <div className="modal" onClick={close}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Editar Pedido #{order.id}</h2>

        {order.items.map((item, i) => (
          <div key={i}>
            <strong>{item.name}</strong>
            <div>
              Extras:
              {item.extras.length === 0 && " ninguno"}

              {item.extras.map((extra, idx) => (
                <span
                  key={idx}
                  className="extra-tag"
                  onClick={() => {
                    const items = [...order.items];
                    items[i].extras = items[i].extras.filter((_, eIdx) => eIdx !== idx);
                    updateOrder({ ...order, items });
                  }}
                >
                  {extra} ❌
                </span>
              ))}
            </div>

            <button className="eliminar" onClick={() => removeItem(i)}>Eliminar</button>

            {menu.extras.map(extra => (
              <button key={extra.name} onClick={() => addExtra(i, extra)}>
                + {extra.name}
              </button>
            ))}
          </div>
        ))}

        <h3>Añadir producto</h3>

        {Object.entries(menu).map(([cat, items]) => {
          if (cat === "extras") return null;

          return (
            <div key={cat}>
              <h4>{cat}</h4>
              {items.map(item => (
                <button key={item.name} onClick={() => addItem(item)}>
                  {item.name} - {item.price}€
                </button>
              ))}
            </div>
          );
        })}

        <h3>Total: {total.toFixed(2)} €</h3>

        <button
          className="eliminar"
          onClick={() => {
            if (window.confirm("¿Eliminar pedido?")) {
              deleteOrder(order.id);
            }
          }}
        >
          🗑 Eliminar pedido
        </button>

        <button onClick={close}>Cerrar</button>
              </div>
            </div>
          );
        }

/* --- Columns --- */
function OrdersColumn({ title, orders, moveOrder, openEditor }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} moveOrder={moveOrder} openEditor={openEditor} />
      ))}
    </div>
  );
}

/* --- Dashboard --- */
function DashboardContent({ orders, moveOrder, openEditor, viewType, typeFilter,setTypeFilter  }) {
  
  const isSpecialView = typeFilter !== "all";

  const visibleStatuses = isSpecialView
    ? statuses.filter(s => s.id !== "delivered")
    : statuses;

  const filteredOrders =
  typeFilter === "all"
    ? orders
    : orders.filter(o => o.type === typeFilter);

  return (
    <>
      <h1 className="logo">RUB</h1>

      <div className="filters">
      <button onClick={() => setTypeFilter("all")}>Todos</button>
      <button onClick={() => setTypeFilter("delivery")}>🚚 Domicilio</button>
      <button onClick={() => setTypeFilter("salon")}>🍽 Salón</button>
      <button onClick={() => setTypeFilter("recoger")}>🛍 Recoger</button>
    </div>

      <div className="stats">
        <div>Pedidos activos <span>{orders.length}</span></div>
        <div>Preparando <span>{orders.filter(o => o.status === "preparing").length}</span></div>
        <div>Listos <span>{orders.filter(o => o.status === "ready").length}</span></div>
      </div>

      <div className="columns">
        {visibleStatuses.map(status => (
          <OrdersColumn
              key={status.id}
              title={status.label}
              orders={filteredOrders.filter(o => o.status === status.id)}
              moveOrder={moveOrder}
              openEditor={openEditor}  
          />
        ))}
      </div>
      
    </>
  );
}

/* --- OrdersPerDay --- */
function OrdersPerDay({ orders }) {
  const grouped = orders.reduce((acc, order) => {
  const date = new Date(order.createdAt);

  const dayStr = `${date.getDate().toString().padStart(2, "0")}-${(
    date.getMonth() + 1
  ).toString().padStart(2, "0")}-${date.getFullYear()}`;

  const total = order.items.reduce(
    (sum, item) => sum + item.price + item.extras.length * 0.7,
    0
  );

  if (!acc[dayStr]) {
    acc[dayStr] = {
      count: 0,
      total: 0,
      delivery: 0,
      salon: 0,
      recoger: 0
    };
  }

  acc[dayStr].count += 1;
  acc[dayStr].total += total;

  // 👉 sumar por tipo
  acc[dayStr][order.type] += total;

  return acc;
}, {});

  const data = Object.entries(grouped);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pedidos por día</h2>

      <ul className="orders-day-list">
        {data.map(([date, info]) => (
        <li key={date}>
          📅 {date}: <strong>{info.count}</strong> pedidos <br />

          💰 Total: <strong>{info.total.toFixed(2)} €</strong><br />
          🚚 Delivery: {info.delivery.toFixed(2)} €<br />
          🍽 Salón: {info.salon.toFixed(2)} €<br />
          🛍 Recoger: {info.recoger.toFixed(2)} €
        </li>
      ))}
      </ul>
    </div>
  );
}

/* --- WeeklyAverage --- */
function WeeklyAverage({ orders }) {
  const days = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  const counts = Array(7).fill(0);

  orders.forEach(o => {
    let d = new Date(o.createdAt).getDay();
    d = d === 0 ? 6 : d - 1;
    counts[d]++;
  });

  const data = days.map((day, i) => ({
    day,
    average: counts[i]
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="average" />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* --- MAIN --- */
export default function OrdersDashboard() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [orders, setOrders] = useState(sampleOrders);
  const [nextId, setNextId] = useState(2);
  const [view, setView] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const notificationSound = useRef(new Audio(Notificacion));

  const moveOrder = (id, status) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  const updateOrder = updated => {
    setOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
    setSelectedOrder(updated);
  };

  const getRandomItemFromMenu = () => {
  const categories = Object.keys(menu).filter(k => k !== "extras");
  const randomCat = categories[Math.floor(Math.random() * categories.length)];
  const items = menu[randomCat];
  return items[Math.floor(Math.random() * items.length)];
};

const addOrder = useCallback(() => {
  const calle = callesLosPalacios[Math.floor(Math.random() * callesLosPalacios.length)];
  const numero = Math.floor(Math.random() * 120) + 1;

  const randomItemsCount = Math.floor(Math.random() * 4) + 1;

  const items = Array.from({ length: randomItemsCount }, () => {
    const item = getRandomItemFromMenu();
    return {
      ...item,
      extras: [],
      quantity: 1
    };
  });

  const types = ["delivery", "salon", "recoger"];

  const newOrder = {
    id: nextId,
    address: `${calle} ${numero}`,
    type: types[Math.floor(Math.random() * types.length)],
    priority: ["alta", "normal", "baja"][Math.floor(Math.random() * 3)],
    status: "new",
    createdAt: Date.now(),
    items
  };

  notificationSound.current.play().catch(() => {});
  setOrders(prev => [...prev, newOrder]);
  setNextId(prev => prev + 1);
}, [nextId]);

  const deleteOrder = (id) => {
  setOrders(prev => prev.filter(o => o.id !== id));
  setSelectedOrder(null);
};

  useEffect(() => {
    const interval = setInterval(addOrder, 15000);
    return () => clearInterval(interval);
  }, [addOrder]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setSelected={setView} />

      <div className="content">
        {view === "dashboard" && (
          <DashboardContent
            orders={orders}
            moveOrder={moveOrder}
            openEditor={setSelectedOrder}
            viewType="all"
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />
        )}

        {view === "salon" && (
          <DashboardContent
            orders={orders.filter(o => o.type === "salon")}
            moveOrder={moveOrder}
            openEditor={setSelectedOrder}
            viewType="salon"
          />
        )}

        {view === "recoger" && (
          <DashboardContent
            orders={orders.filter(o => o.type === "recoger")}
            moveOrder={moveOrder}
            openEditor={setSelectedOrder}
            viewType="recoger"
          />
        )}

        {view === "ordersPerDay" && <OrdersPerDay orders={orders} />}
        {view === "weeklyAverage" && <WeeklyAverage orders={orders} />}
      </div>

      <EditOrderModal
        order={selectedOrder}
        updateOrder={updateOrder}
        deleteOrder={deleteOrder}
        close={() => setSelectedOrder(null)}
      />
      
    </div>
  );
}