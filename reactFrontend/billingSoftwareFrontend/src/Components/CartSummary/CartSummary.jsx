import { useContext, useState } from "react";
import "./CartSummary.css";
import { AppContext } from "../../Context/AppContext";
import ReceiptPopup from "../ReceiptPopup/ReceiptPopup";
import { createOrder, deleteOrder } from "../../Service/OrderService";
import { createRazorpayOrder, verifyPayment } from "../../Service/PaymentService";
import { AppConstants } from "../../Util/Constants";
import toast from "react-hot-toast";

const CartSummary = ({ customerName, mobileNumber, setMobileNumber, setCustomerName }) => {
  const { cartItems, clearCart } = useContext(AppContext);

  const [orderDetails, setOrderDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  // NEW: discount state
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  // NEW: discount calculation
  const discountAmount = subtotal * (discountPercent / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.18;
  const grandTotal = discountedSubtotal + tax;

  const clearAll = () => {
    setCustomerName("");
    setMobileNumber("");
    setDiscountPercent(0);
    clearCart();
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const deleteOrderOnFailure = async (orderId) => {
    try {
      await deleteOrder(orderId);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong..");
    }
  };

  const completePayment = async (paymentMode) => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // CHANGED: customer details optional — fallback to defaults
    const finalCustomerName = customerName.trim() || "Walk-in Customer";
    const finalPhone = mobileNumber.trim() || "0000000000";

    const orderData = {
      customerName: finalCustomerName,
      phoneNumber: finalPhone,
      cartItems,
      subtotal: discountedSubtotal,
      tax,
      grandTotal,
      discount: discountAmount,
      discountPercent,
      paymentMethod: paymentMode.toUpperCase(),
    };

    setIsProcessing(true);
    try {
      const response = await createOrder(orderData);
      const savedData = response.data;

      if (response.status === 201 && paymentMode === "cash") {
        toast.success("Cash received ✓");
        setOrderDetails(savedData);
        // CHANGED: auto-show receipt immediately, no separate "Place Order" button
        setShowPopup(true);
      } else if (response.status === 201 && paymentMode === "upi") {
        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded) {
          toast.error("Unable to load Razorpay");
          await deleteOrderOnFailure(savedData.orderId);
          return;
        }

        const razorpayResponse = await createRazorpayOrder({
          amount: grandTotal,
          currency: "INR",
        });

        const options = {
          key: AppConstants.RAZORPAY_KEY_ID,
          amount: razorpayResponse.data.amount,
          currency: razorpayResponse.data.currency,
          order_id: razorpayResponse.data.id,
          name: "My Retail Shop",
          description: "Order payment",
          handler: async function (response) {
            await verifyPaymentHandler(response, savedData);
          },
          prefill: { name: finalCustomerName, contact: finalPhone },
          theme: { color: "#3399cc" },
          modal: {
            ondismiss: async () => {
              await deleteOrderOnFailure(savedData.orderId);
              toast.error("Payment cancelled");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", async (response) => {
          await deleteOrderOnFailure(savedData.orderId);
          toast.error("Payment failed");
          console.error(response.error.description);
        });
        rzp.open();
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPaymentHandler = async (response, savedOrder) => {
    const paymentData = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      orderId: savedOrder.orderId,
    };
    try {
      const paymentResponse = await verifyPayment(paymentData);
      if (paymentResponse.status === 200) {
        toast.success("Payment successful ✓");
        const updatedOrder = {
          ...savedOrder,
          paymentDetails: {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
        };
        setOrderDetails(updatedOrder);
        // CHANGED: auto-show receipt after UPI success too
        setShowPopup(true);
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    }
  };

  return (
    <div className="mt-2 px-2">
      {/* NEW: Discount Field */}
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="text-light small col-5">Discount %</span>
        <input
          type="number"
          className="form-control form-control-sm"
          min="0"
          max="100"
          value={discountPercent}
          onChange={(e) => {
            const val = Math.min(100, Math.max(0, Number(e.target.value)));
            setDiscountPercent(val);
          }}
          placeholder="0"
        />
        <span className="text-warning small">-₹{discountAmount.toFixed(2)}</span>
      </div>

      <div className="cart-summary-details">
        <div className="d-flex justify-content-between mb-1">
          <span className="text-light small">Subtotal:</span>
          <span className="text-light small">₹{subtotal.toFixed(2)}</span>
        </div>
        {discountPercent > 0 && (
          <div className="d-flex justify-content-between mb-1">
            <span className="text-success small">Discount ({discountPercent}%):</span>
            <span className="text-success small">-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="d-flex justify-content-between mb-1">
          <span className="text-light small">Tax (18% GST):</span>
          <span className="text-light small">₹{tax.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2 border-top pt-1">
          <span className="text-light fw-bold">Total:</span>
          <span className="text-warning fw-bold">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* CHANGED: No separate "Place Order" button — Cash/UPI directly show receipt */}
      <div className="d-flex gap-2">
        <button
          className="btn btn-success flex-grow-1"
          onClick={() => completePayment("cash")}
          disabled={isProcessing || cartItems.length === 0}
        >
          {isProcessing ? "Processing..." : "💵 Cash"}
        </button>
        <button
          className="btn btn-primary flex-grow-1"
          onClick={() => completePayment("upi")}
          disabled={isProcessing || cartItems.length === 0}
        >
          {isProcessing ? "Processing..." : "📱 UPI"}
        </button>
      </div>

      {showPopup && orderDetails && (
        <ReceiptPopup
          orderDetails={{
            ...orderDetails,
            discountAmount,
            discountPercent,
            razorpayOrderId: orderDetails.paymentDetails?.razorpayOrderId,
            razorpayPaymentId: orderDetails.paymentDetails?.razorpayPaymentId,
          }}
          onClose={() => { setShowPopup(false); clearAll(); }}
          onPrint={handlePrintReceipt}
        />
      )}
    </div>
  );
};

export default CartSummary;