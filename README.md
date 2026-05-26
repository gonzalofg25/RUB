# RUB Pedidos

Demo de un panel de gestión de pedidos para RUB. La aplicación simula la entrada de pedidos, permite moverlos entre estados, editar productos y extras, filtrar por tipo de pedido o repartidor, y consultar métricas básicas.

## Qué incluye

- Panel principal con pedidos nuevos, en preparación, listos y en reparto.
- Filtros por domicilio, salón, recogida y repartidor.
- Modal para editar pedidos, añadir productos, añadir extras o eliminar pedidos.
- Totales por pedido y resumen de pedidos por día.
- Gráfico de promedio semanal con Recharts.
- Generación automática de pedidos simulados cada 15 segundos para enseñar el flujo en una demo.

## Ejecutar en local

```bash
npm install
npm start
```

La app se abre en `http://localhost:3000`.

## Scripts

```bash
npm start
npm test
npm run build
```

## Despliegue

El proyecto está preparado para desplegarse como una SPA en Vercel. El archivo `vercel.json` redirige cualquier ruta a `index.html`.

## Nota

Esta versión es una demo: los pedidos no se guardan en una base de datos y se reinician al recargar la página.
