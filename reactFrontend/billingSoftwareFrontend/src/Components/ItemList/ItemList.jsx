import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { deleteItem } from "../../Service/ItemService";
import { countStock } from "../../Service/BarcodeStore";
import toast from "react-hot-toast";
import "./ItemList.css";

const ItemList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { itemsData, setItemsData } = useContext(AppContext);

    const filteredItems = itemsData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const removeItem = async (itemId) => {
        try {
            const response = await deleteItem(itemId);
            if (response.status === 204) {
                setItemsData(prev => prev.filter(item => item.itemId !== itemId));
                toast.success("Item deleted");
            } else {
                toast.error("Unable to delete item");
            }
        } catch (err) {
            toast.error("Error deleting item");
        }
    };

    return (
        <div className="item-list-root">
            <div className="item-list-search">
                <div className="item-search-wrap">
                    <i className="bi bi-search item-search-icon"></i>
                    <input
                        className="item-search-input"
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="item-list-body">
                {filteredItems.length === 0 ? (
                    <div className="item-list-empty">
                        <i className="bi bi-inbox"></i>
                        <p>No items found</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <div key={item.itemId} className="item-card">
                            <img
                                src={item.imgUrl}
                                alt={item.name}
                                className="item-card-img"
                            />
                            <div className="item-card-info">
                                <div className="item-card-name">{item.name}</div>
                                <div className="item-card-cat">{item.categoryName}</div>
                                <div className="item-card-badges">
                                    <span className="item-badge-price">₹{item.price}</span>
                                    <span className="item-badge-stock">
                                        <i className="bi bi-upc-scan"></i>
                                        {countStock(item.itemId)} stock
                                    </span>
                                </div>
                            </div>
                            <button
                                className="item-card-del"
                                onClick={() => removeItem(item.itemId)}
                                title="Delete item"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ItemList;