import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

    const [itemsData, setItemsData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [auth, setAuth] = useState({token: null, role: null});
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        const existingItem = cartItems.find(cartItem => cartItem.itemId === item.itemId);
        if (existingItem) {
            setCartItems(cartItems.map(cartItem =>
                cartItem.itemId === item.itemId
                    ? {...cartItem, quantity: cartItem.quantity + 1}
                    : cartItem
            ));
        } else {
            setCartItems([...cartItems, {...item, quantity: 1}]);
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.itemId !== itemId));
    }

    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(cartItems.map(item =>
            item.itemId === itemId ? {...item, quantity: newQuantity} : item
        ));
    }

    const setAuthData = (token, role) => {
        setAuth({token, role});
    }

    const clearCart = () => {
        setCartItems([]);
    }

    // Restore auth from localStorage on app start
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token && role) {
            setAuth({ token, role });
        }
    }, []);

    // Only fetch categories and items AFTER we have a valid token
    // This prevents unauthenticated requests on page load / login page
    useEffect(() => {
        if (!auth.token) return;

        async function loadData() {
            try {
                const [categoryResponse, itemResponse] = await Promise.all([
                    fetchCategories(),
                    fetchItems()
                ]);
                setCategories(categoryResponse.data);
                setItemsData(itemResponse.data);
            } catch (err) {
                console.error("Failed to load app data", err);
            }
        }

        loadData();
    }, [auth.token]); // re-runs whenever token changes (login/logout)

    const contextValue = {
        categories,
        setCategories,
        auth,
        setAuthData,
        itemsData,
        setItemsData,
        addToCart,
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
}