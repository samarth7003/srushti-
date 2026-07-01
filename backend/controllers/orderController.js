import pool, * as db from "../db/db.js";

// GET all orders
export const getOrders = async (req, res) => {
  try {
    const ordersResult = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
    const orders = ordersResult.rows;
    
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const itemsResult = await db.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
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
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// POST create an order
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { customerName, mobile, address, city, pincode, paymentMethod, paymentStatus, items, subtotal, tax, delivery, total, utr, screenshot } = req.body;
    
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const orderStatus = "Order Placed";
    
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
    
    const order = orderResult.rows[0];
    const createdOrder = {
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
      items: items
    };
    
    res.status(201).json(createdOrder);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order", error);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
};

// PUT update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    
    // Fetch current order to see payment method
    const orderCheck = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    const currentOrder = orderCheck.rows[0];
    
    let updateQuery = "UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *";
    
    if (orderStatus === "Delivered" && currentOrder.payment_method === "Cash On Delivery") {
      updateQuery = "UPDATE orders SET order_status = $1, payment_status = 'Paid' WHERE id = $2 RETURNING *";
    }
    
    const { rows } = await db.query(updateQuery, [orderStatus, id]);
    const order = rows[0];
    const itemsResult = await db.query("SELECT * FROM order_items WHERE order_id = $1", [id]);
    
    res.json({
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
    });
  } catch (error) {
    console.error("Error updating order status", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// PUT approve UPI payment
export const approveUpiPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      "UPDATE orders SET payment_status = 'Paid', order_status = 'Confirmed' WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const order = rows[0];
    const itemsResult = await db.query("SELECT * FROM order_items WHERE order_id = $1", [id]);
    
    res.json({
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
    });
  } catch (error) {
    console.error("Error approving payment", error);
    res.status(500).json({ error: "Failed to approve payment" });
  }
};
