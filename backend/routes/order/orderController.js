import { getOrdersDb, createOrderDb, getOrderByIdDb, updateOrderStatusDb, getOrderItemsDb } from "./orderSqlc.js";

// GET all orders
export const getOrders = async (req, res) => {
  try {
    const ordersWithItems = await getOrdersDb();
    res.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// POST create an order
export const createOrder = async (req, res) => {
  try {
    const { customerName, mobile, address, city, pincode, paymentMethod, paymentStatus, items, subtotal, tax, delivery, total, utr, screenshot } = req.body;
    
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const orderStatus = "Order Placed";
    
    const order = await createOrderDb({
      orderId, customerName, mobile, address, city, pincode, paymentMethod, paymentStatus, orderStatus, items, subtotal, tax, delivery, total, utr, screenshot
    });
    
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
    console.error("Error creating order", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// PUT update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    
    // Fetch current order to see payment method
    const currentOrder = await getOrderByIdDb(id);
    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    let updateQuery = "UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *";
    let params = [orderStatus, id];
    
    if (orderStatus === "Delivered" && currentOrder.payment_method === "Cash On Delivery") {
      updateQuery = "UPDATE orders SET order_status = $1, payment_status = 'Paid' WHERE id = $2 RETURNING *";
    }
    
    const order = await updateOrderStatusDb(updateQuery, params);
    const items = await getOrderItemsDb(id);
    
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
      items: items.map(item => ({
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
    const updateQuery = "UPDATE orders SET payment_status = 'Paid', order_status = 'Confirmed' WHERE id = $1 RETURNING *";
    const order = await updateOrderStatusDb(updateQuery, [id]);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const items = await getOrderItemsDb(id);
    
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
      items: items.map(item => ({
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
