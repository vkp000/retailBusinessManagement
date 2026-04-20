import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

    const [itemsData, setItemsData] = useState([]); 
    const [categories, setCategories] = useState([]);
    const [auth, setAuth] = useState({token: null, role: null});
    const [cartItems, setCartItems] = useState([]);

    // FIX: Match by itemId (unique) not name — same-name items won't collide
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

    useEffect(() => {
        async function loadData() {
            if (localStorage.getItem("token") && localStorage.getItem("role")) {
                setAuthData(
                    localStorage.getItem("token"),
                    localStorage.getItem("role")
                );
            }
            const response = await fetchCategories();
            const itemResponse = await fetchItems();
            setCategories(response.data);
            setItemsData(itemResponse.data);
        }
        loadData();
    }, [])

    const setAuthData = (token, role) => {
        setAuth({token, role});
    }

    const clearCart = () => {
        setCartItems([]);
    }

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