import pool from "../../config/database.js";

/**
 * Fetch all orders ordered by created_at DESC with their associated items
 * @returns {Promise<object[]>}
 */
export const getOrdersDb = async () => {
  const ordersResult = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  const orders = ordersResult.rows;
  
  const ordersWithItems = await Promise.all(orders.map(async (order) => {
    const itemsResult = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
    return {
      id: order.id,
      customerName: order.customer_name,
      mobile: order.mobile,
      address: order.address,
      city: order.city,
      pincode: order.pincode,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      subtotal: parseFloat(order.subtotal),
      tax: parseFloat(order.tax),
      delivery: parseFloat(order.delivery),
      total: parseFloat(order.total),
      utr: order.utr,
      screenshot: order.screenshot,
      date: order.created_at,
      items: itemsResult.rows.map(item => ({
        id: item.product_id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        images: item.images || []
      }))
    };
  }));
  
  return ordersWithItems;
};

/**
 * Create a new order with items and update product stock inside a transaction
 * @returns {Promise<object>}
 */
export const createOrderDb = async (orderData) => {
  const { orderId, customerName, mobile, address, city, pincode, paymentMethod, paymentStatus, orderStatus, items, subtotal, tax, delivery, total, utr, screenshot } = orderData;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // 1. Insert order
    const insertOrderQuery = `
      INSERT INTO orders (id, customer_name, mobile, address, city, pincode, payment_method, payment_status, order_status, subtotal, tax, delivery, total, utr, screenshot)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    const orderResult = await client.query(insertOrderQuery, [
      orderId, customerName, mobile, address, city, pincode, paymentMethod, paymentStatus, orderStatus, subtotal, tax, delivery, total, utr || "", screenshot || ""
    ]);
    
    // 2. Insert items and update product stock
    for (const item of items) {
      const insertItemQuery = `
        INSERT INTO order_items (order_id, product_id, name, price, quantity, images)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(insertItemQuery, [
        orderId, item.id, item.name, item.price, item.quantity, item.images || []
      ]);
      
      const updateStockQuery = `
        UPDATE products 
        SET stock = GREATEST(0, stock - $1),
            availability = CASE WHEN GREATEST(0, stock - $1) = 0 THEN 'Out of Stock' ELSE availability END
        WHERE id = $2
      `;
      await client.query(updateStockQuery, [item.quantity, item.id]);
    }
    
    await client.query("COMMIT");
    return orderResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get an order by id
 * @param {string} id 
 * @returns {Promise<object|null>}
 */
export const getOrderByIdDb = async (id) => {
  const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
  return rows[0] || null;
};

/**
 * Update order fields with a custom query and params
 * @returns {Promise<object>}
 */
export const updateOrderStatusDb = async (updateQuery, params) => {
  const { rows } = await pool.query(updateQuery, params);
  return rows[0];
};

/**
 * Get items associated with an order
 * @param {string} orderId 
 * @returns {Promise<object[]>}
 */
export const getOrderItemsDb = async (orderId) => {
  const { rows } = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [orderId]);
  return rows;
};
