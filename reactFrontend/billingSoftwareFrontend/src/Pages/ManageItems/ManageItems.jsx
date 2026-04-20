import { useState } from "react";
import ItemList from "../../Components/ItemList/ItemList";
import AddItemWizard from "../../Components/AddItemWizard/AddItemWizard";
import SyncBarcodes from "../../Components/SyncBarcodes/SyncBarcodes";
import "./ManageItems.css";

const ManageItems = () => {
    const [activeTab, setActiveTab] = useState("existing");

    return (
        <div className="mi-container">
            <div className="mi-header">
                <div className="mi-tabs">
                    <button className={`mi-tab ${activeTab === "existing" ? "active" : ""}`}
                        onClick={() => setActiveTab("existing")}>
                        <i className="bi bi-list-ul"></i>
                        <span>Manage Items</span>
                    </button>
                    <button className={`mi-tab ${activeTab === "add" ? "active" : ""}`}
                        onClick={() => setActiveTab("add")}>
                        <i className="bi bi-plus-circle"></i>
                        <span>Add New Item</span>
                    </button>
                </div>
                <SyncBarcodes />
            </div>
            <div className="mi-body">
                {activeTab === "existing"
                    ? <ItemList />
                    : <div className="wizard-wrapper">
                          <AddItemWizard onDone={() => setActiveTab("existing")} />
                      </div>
                }
            </div>
        </div>
    );
};

export default ManageItems;