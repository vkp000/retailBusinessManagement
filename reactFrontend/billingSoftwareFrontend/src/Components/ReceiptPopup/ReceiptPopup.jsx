import "./ReceiptPopup.css";
import "./Print.css";

// NEW: Shop details — apni shop ki details yahan bharo
const SHOP_INFO = {
  name: "My Retail Shop",
  address: "123, Main Market, Your City - 400001",
  phone: "9876543210",
  gstin: "27AAAAA0000A1Z5",  // apna GSTIN daalo
};

const ReceiptPopup = ({ orderDetails, onClose, onPrint }) => {
  // NEW: Invoice number from orderId last 6 chars
  const invoiceNumber = `INV-${orderDetails.orderId?.slice(-8).toUpperCase()}`;

  const formattedDate = new Date(orderDetails.createdAt).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="receipt-popup-overlay text-dark">
      <div className="receipt-popup">

        {/* Shop Header */}
        <div className="text-center mb-3">
          <h4 className="fw-bold mb-0">{SHOP_INFO.name}</h4>
          <p className="small text-muted mb-0">{SHOP_INFO.address}</p>
          <p className="small text-muted mb-0">Ph: {SHOP_INFO.phone}</p>
          <p className="small text-muted">GSTIN: {SHOP_INFO.gstin}</p>
        </div>

        <div className="text-center mb-3">
          <i className="bi bi-check-circle-fill text-success fs-3"></i>
          <h5 className="mt-1 mb-0">Tax Invoice</h5>
        </div>

        <hr className="my-2" />

        {/* Invoice + Customer Info */}
        <div className="d-flex justify-content-between mb-1">
          <span><strong>Invoice:</strong> {invoiceNumber}</span>
          <span className="text-muted small">{formattedDate}</span>
        </div>
        <p className="mb-1"><strong>Customer:</strong> {orderDetails.customerName}</p>
        <p className="mb-1"><strong>Phone:</strong> {orderDetails.phoneNumber}</p>

        <hr className="my-2" />

        {/* Items */}
        <h6 className="mb-2">Items</h6>
        <div className="cart-items-scrollable">
          {/* Header row */}
          <div className="d-flex justify-content-between mb-1 text-muted small border-bottom pb-1">
            <span className="col-6">Item</span>
            <span className="col-2 text-center">Qty</span>
            <span className="col-2 text-end">Rate</span>
            <span className="col-2 text-end">Amt</span>
          </div>
          {orderDetails.items.map((item, index) => (
            <div key={index} className="d-flex justify-content-between mb-1 small">
              <span className="col-6">{item.name}</span>
              <span className="col-2 text-center">{item.quantity}</span>
              <span className="col-2 text-end">₹{item.price?.toFixed(2)}</span>
              <span className="col-2 text-end">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <hr className="my-2" />

        {/* Totals */}
        <div className="d-flex justify-content-between mb-1 small">
          <span>Subtotal:</span>
          <span>₹{(orderDetails.subtotal + (orderDetails.discountAmount || 0)).toFixed(2)}</span>
        </div>
        {orderDetails.discountPercent > 0 && (
          <div className="d-flex justify-content-between mb-1 small text-success">
            <span>Discount ({orderDetails.discountPercent}%):</span>
            <span>-₹{orderDetails.discountAmount?.toFixed(2)}</span>
          </div>
        )}
        <div className="d-flex justify-content-between mb-1 small">
          <span>GST (18%):</span>
          <span>₹{orderDetails.tax?.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2 fw-bold border-top pt-1">
          <span>Grand Total:</span>
          <span>₹{orderDetails.grandTotal?.toFixed(2)}</span>
        </div>

        {/* Payment */}
        <p className="mb-1 small">
          <strong>Payment:</strong>{" "}
          <span className={`badge ${orderDetails.paymentMethod === "CASH" ? "bg-success" : "bg-primary"}`}>
            {orderDetails.paymentMethod}
          </span>
        </p>

        {orderDetails.paymentMethod === "UPI" && (
          <div className="small text-muted">
            <p className="mb-0"><strong>Razorpay Order ID:</strong> {orderDetails.razorpayOrderId}</p>
            <p className="mb-0"><strong>Payment ID:</strong> {orderDetails.razorpayPaymentId}</p>
          </div>
        )}

        <hr className="my-2" />
        <p className="text-center text-muted small mb-3">Thank you for shopping with us! 🙏</p>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-warning btn-sm" onClick={onPrint}>
            <i className="bi bi-printer me-1"></i>Print
          </button>
          <button className="btn btn-danger btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPopup;