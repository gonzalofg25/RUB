import { useState, useEffect, useRef, useCallback } from "react";
import Notificacion from "../../resources/notificacion.mp3";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// --- Datos de ejemplo ---
const sampleOrders = [
  { id: 1, address: "Calle Real 12", total: 14.9, priority: "normal", status: "new", createdAt: Date.now(), items: ["Burger clásica", "Patatas", "Coca-cola"] },
  { id: 2, address: "Avenida Andalucía 45", total: 11.5, priority: "alta", status: "preparing", createdAt: Date.now(), items: ["Burger doble", "Sin cebolla"] }
];

const statuses = [
  { id: "new", label: "🆕 Nuevos" },
  { id: "preparing", label: "👨‍🍳 Preparando" },
  { id: "ready", label: "📦 Listos" },
  { id: "delivered", label: "🚚 En reparto" }
];

// --- Sidebar ---
function Sidebar({ selected, setSelected }) {
  return (
    <div className="sidebar">
      <button onClick={() => setSelected("dashboard")}>Pedidos hoy</button>
      <button onClick={() => setSelected("ordersPerDay")}>Pedidos por día</button>
      <button onClick={() => setSelected("weeklyAverage")}>Promedio semanal</button>
    </div>
  );
}

// --- OrderCard ---
function OrderCard({ order, moveOrder }) {
  const [expanded, setExpanded] = useState(false);
  const minutes = Math.floor((Date.now() - order.createdAt) / 60000);

  return (
    <div className={`order-card priority-${order.priority}`}>
      <div className="order-header">
        <span>Pedido #{order.id}</span>
        <span className="order-time">⏱ {minutes} min</span>
      </div>
      <div className="order-address">📍 {order.address}</div>
      <ul className="order-items">
        {(expanded ? order.items : order.items.slice(0,3)).map((item,i)=>(<li key={i}>• {item}</li>))}
      </ul>
      {order.items.length > 3 && (
        <button className="toggle-btn" onClick={()=>setExpanded(!expanded)}>
          {expanded ? "Ver menos" : "Ver pedido completo"}
        </button>
      )}
      <div className="order-total">{order.total.toFixed(2)} €</div>
      <div className="actions">
        {order.status === "new" && <button onClick={()=>moveOrder(order.id,"preparing")}>Empezar preparación</button>}
        {order.status === "preparing" && <button onClick={()=>moveOrder(order.id,"ready")}>Marcar como listo</button>}
        {order.status === "ready" && <button onClick={()=>moveOrder(order.id,"delivered")}>Entregar pedido</button>}
      </div>
    </div>
  );
}

// --- OrdersColumn ---
function OrdersColumn({ title, orders, moveOrder }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      {orders.map(order => <OrderCard key={order.id} order={order} moveOrder={moveOrder} />)}
    </div>
  );
}

// --- DashboardContent ---
function DashboardContent({ orders, moveOrder }) {
  return (
    <>
      <h1 className="logo">RUB</h1>
      <div className="stats">
        <div>Pedidos activos <span>{orders.length}</span></div>
        <div>Preparando <span>{orders.filter(o=>o.status==="preparing").length}</span></div>
        <div>Listos <span>{orders.filter(o=>o.status==="ready").length}</span></div>
      </div>
      <div className="columns">
        {statuses.map(status => (
          <OrdersColumn
            key={status.id}
            title={status.label}
            orders={orders.filter(o => o.status === status.id)}
            moveOrder={moveOrder}
          />
        ))}
      </div>
    </>
  );
}

// --- OrdersPerDay ---
function OrdersPerDay({ orders }) {
  const grouped = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt);
    // Formato dd-mm-yyyy
    const dayStr = `${date.getDate().toString().padStart(2,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getFullYear()}`;
    acc[dayStr] = (acc[dayStr] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([date, count]) => ({ date, count }));

  return (
    <div style={{ padding: "20px" }}> {/* contenedor normal, no centrado */}
      <h2>Pedidos por día</h2>
      <ul>
        {data.map(d => (
          <li key={d.date}>{d.date}: {d.count} pedidos</li>
        ))}
      </ul>
    </div>
  );
}

// --- WeeklyAverage ---
function WeeklyAverage({ orders }) {
  const days = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  const counts = Array(7).fill(0);

  if (orders.length === 0) return <div>No hay pedidos aún</div>;

  const timestamps = orders.map(o => o.createdAt);
  const firstDate = new Date(Math.min(...timestamps));
  const lastDate = new Date(Math.max(...timestamps));
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const numberOfWeeks = Math.max(1, Math.ceil((lastDate - firstDate) / msPerWeek));

  // Contar pedidos por día, con lunes = índice 0
  orders.forEach(o => {
    let day = new Date(o.createdAt).getDay(); // 0=Domingo
    day = day === 0 ? 6 : day - 1;            // lunes=0, domingo=6
    counts[day]++;
  });

  const data = days.map((day,i) => ({
    day,
    average: (counts[i] / numberOfWeeks).toFixed(2)
  }));

  return (
    <div className="center-screen">
      <h2>Promedio de pedidos por día de la semana</h2>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="average" fill="#949190" />
      </BarChart>
    </div>
  );
}

// --- Componente principal ---
export default function OrdersDashboard() {
  const [orders,setOrders] = useState(sampleOrders);
  const [nextId,setNextId] = useState(sampleOrders.length + 1);
  const [selectedView,setSelectedView] = useState("dashboard");
  const notificationSound = useRef(new Audio(Notificacion));

  const moveOrder = (id,status) => {
    setOrders(prev => prev.map(order => order.id===id ? {...order,status} : order));
  };

  const addOrder = useCallback(() => {
    const priorities = ["alta","normal","baja"];
    const newOrder = {
      id: nextId,
      address: "Calle Nueva " + Math.floor(Math.random()*100),
      total: Number((Math.random()*20+8).toFixed(2)),
      priority: priorities[Math.floor(Math.random()*3)],
      status: "new",
      createdAt: Date.now(),
      items: ["Burger RUB", "Patatas", "Coca-cola"]
    };
    notificationSound.current.play().catch(()=>{});
    setOrders(prev => [...prev,newOrder]);
    setNextId(prev => prev+1);
  }, [nextId]);

  useEffect(() => {
    const interval = setInterval(addOrder,15000);
    return () => clearInterval(interval);
  }, [addOrder]);

  return (
    <div style={{ display:"flex" }}>
      <Sidebar selected={selectedView} setSelected={setSelectedView} />
      <div style={{ marginLeft:220, padding:20, flex:1 }}>
        {selectedView==="dashboard" && <DashboardContent orders={orders} moveOrder={moveOrder} />}
        {selectedView==="ordersPerDay" && <OrdersPerDay orders={orders} />}
        {selectedView==="weeklyAverage" && <WeeklyAverage orders={orders} />}
      </div>
    </div>
  );
}