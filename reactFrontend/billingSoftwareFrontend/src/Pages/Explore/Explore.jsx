import { useContext, useState } from 'react';
import './Explore.css';
import { AppContext } from '../../Context/AppContext';
import CustomerForm from '../../Components/CustomerForm/CustomerForm';
import CartItems from '../../Components/CartItems/CartItems';
import CartSummary from '../../Components/CartSummary/CartSummary';
import DisplayCategory from '../../Components/DisplayCategory/DisplayCtaegory';
import DisplayItems from '../../Components/DisplayItems/DisplayItems';

const Explore = () => {
    const { categories } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [mobileView, setMobileView] = useState("shop");

    return (
        <div className="explore-root">
            {/* Mobile tab toggle */}
            <div className="explore-mobile-tabs d-flex d-lg-none">
                <button
                    className={`explore-tab ${mobileView === "shop" ? "active" : ""}`}
                    onClick={() => setMobileView("shop")}
                >
                    <i className="bi bi-shop"></i> Browse
                </button>
                <button
                    className={`explore-tab ${mobileView === "cart" ? "active" : ""}`}
                    onClick={() => setMobileView("cart")}
                >
                    <i className="bi bi-cart3"></i> Cart
                </button>
            </div>

            {/* Products panel */}
            <div className={`explore-left ${mobileView !== "shop" ? "d-none d-lg-flex" : "d-flex"}`}>
                <div className="explore-categories">
                    <DisplayCategory
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories}
                    />
                </div>
                <div className="explore-divider" />
                <div className="explore-items">
                    <DisplayItems selectedCategory={selectedCategory} />
                </div>
            </div>

            {/* Cart panel */}
            <div className={`explore-right ${mobileView !== "cart" ? "d-none d-lg-flex" : "d-flex"}`}>
                <div className="explore-customer">
                    <CustomerForm
                        customerName={customerName}
                        mobileNumber={mobileNumber}
                        setCustomerName={setCustomerName}
                        setMobileNumber={setMobileNumber}
                    />
                </div>
                <div className="explore-divider" />
                <div className="explore-cart-items">
                    <CartItems />
                </div>
                <div className="explore-cart-summary">
                    <CartSummary
                        customerName={customerName}
                        mobileNumber={mobileNumber}
                        setMobileNumber={setMobileNumber}
                        setCustomerName={setCustomerName}
                    />
                </div>
            </div>
        </div>
    );
};

export default Explore;