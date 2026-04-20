import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { assets } from "../../assets/Asset";
import { addItem } from "../../Service/ItemService";
import { setMapping, getMapping, getMappingsByProduct, countStock, deleteMapping } from "../../Service/BarcodeStore";
import BarcodeScanner from "../BarcodeScanner/BarcodeScanner";
import toast from "react-hot-toast";
import "./AddItemWizard.css";

const STEPS = [
    { label: "Category", icon: "bi-tags" },
    { label: "Product", icon: "bi-box-seam" },
    { label: "Barcode", icon: "bi-upc-scan" },
];

const AddItemWizard = ({ onDone }) => {
    const { categories, itemsData, setItemsData, setCategories } = useContext(AppContext);
    const [step, setStep] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [productMode, setProductMode] = useState("select");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProductData, setNewProductData] = useState({ name: "", price: "", description: "" });
    const [newProductImage, setNewProductImage] = useState(null);
    const [productLoading, setProductLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState("");
    const [scannedBarcodes, setScannedBarcodes] = useState([]);
    const [bulkMode, setBulkMode] = useState(false);
    const [lastScanResult, setLastScanResult] = useState(null);

    const categoryItems = itemsData.filter(item => item.categoryId === selectedCategoryId);
    const currentStock = selectedProduct ? countStock(selectedProduct.itemId) : 0;
    const currentBarcodes = selectedProduct ? getMappingsByProduct(selectedProduct.itemId) : [];

    const handleCategorySelect = (catId) => {
        setSelectedCategoryId(catId);
        setStep(1);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setStep(2);
    };

    const handleCreateProduct = async () => {
        if (!newProductData.name || !newProductData.price || !newProductImage) {
            toast.error("Name, price and image are required");
            return;
        }
        setProductLoading(true);
        try {
            const formData = new FormData();
            formData.append("item", JSON.stringify({ ...newProductData, categoryId: selectedCategoryId }));
            formData.append("file", newProductImage);
            const response = await addItem(formData);
            if (response.status === 201) {
                const created = response.data;
                setItemsData(prev => [...prev, created]);
                setCategories(prev => prev.map(c =>
                    c.categoryId === selectedCategoryId ? { ...c, items: c.items + 1 } : c
                ));
                setSelectedProduct(created);
                toast.success("Product created!");
                setStep(2);
            }
        } catch (err) {
            toast.error("Failed to create product");
        } finally {
            setProductLoading(false);
        }
    };

    const processBarcode = (code) => {
        if (!selectedProduct) return;
        const existing = getMapping(code);
        const isReassignment = existing && existing.productId !== selectedProduct.itemId;
        setMapping(code, {
            productId: selectedProduct.itemId,
            productName: selectedProduct.name,
            productImg: selectedProduct.imgUrl,
            categoryId: selectedCategoryId,
        });
        const info = { barcode: code, isNew: !existing, isReassignment, previousProduct: isReassignment ? existing?.productName : null };
        setLastScanResult(info);
        if (isReassignment) {
            toast(`Reassigned from "${existing.productName}"`, { icon: "🔄" });
        } else {
            toast.success("Barcode saved ✓");
        }
        if (bulkMode) {
            setScannedBarcodes(prev => [info, ...prev]);
        } else {
            setTimeout(() => setStep(3), 600);
        }
    };

    const handleManualBarcode = (e) => {
        e.preventDefault();
        if (barcodeInput.trim()) { processBarcode(barcodeInput.trim()); setBarcodeInput(""); }
    };

    const resetWizard = () => {
        setStep(0); setSelectedProduct(null); setSelectedCategoryId("");
        setScannedBarcodes([]); setLastScanResult(null); setNewProductData({ name: "", price: "", description: "" });
        setNewProductImage(null); setProductMode("select");
    };

    // Done Screen
    if (step === 3) {
        return (
            <div className="wiz-done">
                <div className="wiz-done-icon"><i className="bi bi-check-circle-fill"></i></div>
                <h4>Done!</h4>
                <p className="wiz-done-sub">
                    <strong>{selectedProduct?.name}</strong><br />
                    <span>{currentStock} barcode(s) assigned</span>
                </p>
                <div className="wiz-done-actions">
                    <button className="wiz-btn-secondary" onClick={() => { setStep(2); setScannedBarcodes([]); setLastScanResult(null); }}>
                        <i className="bi bi-plus"></i> More Barcodes
                    </button>
                    <button className="wiz-btn-secondary" onClick={resetWizard}>
                        <i className="bi bi-arrow-repeat"></i> New Product
                    </button>
                    <button className="wiz-btn-primary" onClick={onDone}>
                        Finish <i className="bi bi-check-lg"></i>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="wiz-root">
            {/* Step Indicator */}
            <div className="wiz-stepper">
                {STEPS.map((s, i) => (
                    <div key={s.label} className={`wiz-step-item ${i === step ? "active" : i < step ? "done" : ""}`}>
                        <button
                            className="wiz-step-btn"
                            onClick={() => i < step && setStep(i)}
                            disabled={i >= step}
                        >
                            <div className="wiz-step-circle">
                                {i < step ? <i className="bi bi-check-lg" /> : <i className={`bi ${s.icon}`} />}
                            </div>
                            <span className="wiz-step-label">{s.label}</span>
                        </button>
                        {i < STEPS.length - 1 && <div className="wiz-step-connector" />}
                    </div>
                ))}
            </div>

            <div className="wiz-content">

                {/* ── Step 0: Category ── */}
                {step === 0 && (
                    <div className="wiz-section">
                        <div className="wiz-section-title">
                            <i className="bi bi-tags"></i>
                            Select a Category
                        </div>
                        {categories.length === 0 ? (
                            <div className="wiz-empty">No categories yet. Create one in Manage Categories.</div>
                        ) : (
                            <div className="wiz-cat-grid">
                                {categories.map(cat => (
                                    <button
                                        key={cat.categoryId}
                                        className="wiz-cat-card"
                                        style={{ "--cat-color": cat.bgColor || "#f59e0b" }}
                                        onClick={() => handleCategorySelect(cat.categoryId)}
                                    >
                                        <div className="wiz-cat-img-wrap">
                                            {cat.imgUrl
                                                ? <img src={cat.imgUrl} alt={cat.name} />
                                                : <i className="bi bi-tags"></i>
                                            }
                                        </div>
                                        <div className="wiz-cat-info">
                                            <span className="wiz-cat-name">{cat.name}</span>
                                            <span className="wiz-cat-count">{cat.items} items</span>
                                        </div>
                                        <i className="bi bi-chevron-right wiz-cat-arrow"></i>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Step 1: Product ── */}
                {step === 1 && (
                    <div className="wiz-section">
                        <div className="wiz-nav-row">
                            <button className="wiz-back-btn" onClick={() => setStep(0)}>
                                <i className="bi bi-arrow-left"></i> Back
                            </button>
                            <div className="wiz-section-title">
                                <i className="bi bi-box-seam"></i>
                                Select or Create Product
                            </div>
                        </div>

                        <div className="wiz-mode-toggle">
                            <button
                                className={`wiz-mode-btn ${productMode === "select" ? "active" : ""}`}
                                onClick={() => setProductMode("select")}
                            >
                                <i className="bi bi-search"></i> Select Existing
                            </button>
                            <button
                                className={`wiz-mode-btn ${productMode === "create" ? "active" : ""}`}
                                onClick={() => setProductMode("create")}
                            >
                                <i className="bi bi-plus-circle"></i> Create New
                            </button>
                        </div>

                        {productMode === "select" ? (
                            categoryItems.length === 0 ? (
                                <div className="wiz-empty">
                                    <i className="bi bi-inbox"></i>
                                    <p>No products in this category.</p>
                                    <button className="wiz-link" onClick={() => setProductMode("create")}>
                                        Create one →
                                    </button>
                                </div>
                            ) : (
                                <div className="wiz-product-list">
                                    {categoryItems.map(item => (
                                        <button
                                            key={item.itemId}
                                            className="wiz-product-row"
                                            onClick={() => handleProductSelect(item)}
                                        >
                                            <img
                                                src={item.imgUrl || assets.upload}
                                                alt={item.name}
                                                className="wiz-product-img"
                                            />
                                            <div className="wiz-product-info">
                                                <span className="wiz-product-name">{item.name}</span>
                                                <span className="wiz-product-meta">
                                                    ₹{item.price} &bull; {countStock(item.itemId)} in stock
                                                </span>
                                            </div>
                                            <i className="bi bi-chevron-right wiz-product-arrow"></i>
                                        </button>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="wiz-create-form">
                                <label htmlFor="wiz-img" className="wiz-img-upload">
                                    {newProductImage ? (
                                        <img src={URL.createObjectURL(newProductImage)} alt="preview" />
                                    ) : (
                                        <div className="wiz-img-placeholder">
                                            <i className="bi bi-camera"></i>
                                            <span>Tap to upload image</span>
                                        </div>
                                    )}
                                    <input
                                        type="file" id="wiz-img" hidden accept="image/*"
                                        onChange={e => setNewProductImage(e.target.files[0])}
                                    />
                                </label>

                                <div className="wiz-field-group">
                                    <div className="wiz-field">
                                        <label>Product Name *</label>
                                        <input
                                            className="wiz-input"
                                            placeholder="e.g. Maggi 2-Minute Noodles"
                                            value={newProductData.name}
                                            onChange={e => setNewProductData(p => ({ ...p, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="wiz-field">
                                        <label>Price (₹) *</label>
                                        <input
                                            className="wiz-input"
                                            type="number"
                                            placeholder="0.00"
                                            value={newProductData.price}
                                            onChange={e => setNewProductData(p => ({ ...p, price: e.target.value }))}
                                        />
                                    </div>
                                    <div className="wiz-field">
                                        <label>Description <span className="wiz-optional">(optional)</span></label>
                                        <input
                                            className="wiz-input"
                                            placeholder="Brief description..."
                                            value={newProductData.description}
                                            onChange={e => setNewProductData(p => ({ ...p, description: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <button
                                    className="wiz-btn-primary w-100 mt-3"
                                    onClick={handleCreateProduct}
                                    disabled={productLoading}
                                >
                                    {productLoading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</>
                                    ) : (
                                        <>Create & Continue <i className="bi bi-arrow-right ms-1"></i></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Step 2: Barcode ── */}
                {step === 2 && selectedProduct && (
                    <div className="wiz-section">
                        <div className="wiz-nav-row">
                            <button className="wiz-back-btn" onClick={() => setStep(1)}>
                                <i className="bi bi-arrow-left"></i> Back
                            </button>
                            <div className="wiz-section-title">
                                <i className="bi bi-upc-scan"></i>
                                Assign Barcode
                            </div>
                        </div>

                        {/* Selected Product Preview */}
                        <div className="wiz-product-preview">
                            <img
                                src={selectedProduct.imgUrl || assets.upload}
                                alt={selectedProduct.name}
                            />
                            <div>
                                <div className="wiz-preview-name">{selectedProduct.name}</div>
                                <div className="wiz-preview-meta">
                                    ₹{selectedProduct.price}
                                    <span className="wiz-stock-badge">
                                        <i className="bi bi-upc-scan"></i> {currentStock} barcodes
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bulk Mode Toggle */}
                        <div className="wiz-bulk-toggle">
                            <div className="wiz-bulk-label">
                                <i className="bi bi-lightning-charge"></i>
                                <div>
                                    <div className="wiz-bulk-title">Bulk Mode</div>
                                    <div className="wiz-bulk-sub">Scan multiple barcodes continuously</div>
                                </div>
                            </div>
                            <div className="wiz-switch-wrap">
                                <input
                                    type="checkbox" id="bulk-switch" className="wiz-switch-input"
                                    checked={bulkMode}
                                    onChange={e => { setBulkMode(e.target.checked); setScannedBarcodes([]); }}
                                />
                                <label htmlFor="bulk-switch" className="wiz-switch-label"></label>
                            </div>
                        </div>

                        {/* Barcode Input */}
                        <div className="wiz-barcode-area">
                            <form onSubmit={handleManualBarcode} className="wiz-barcode-form">
                                <div className="wiz-barcode-input-wrap">
                                    <i className="bi bi-upc wiz-barcode-icon"></i>
                                    <input
                                        type="text"
                                        className="wiz-barcode-input"
                                        placeholder="Enter or scan barcode here..."
                                        value={barcodeInput}
                                        onChange={e => setBarcodeInput(e.target.value)}
                                        autoFocus
                                    />
                                    <button type="submit" className="wiz-barcode-submit">
                                        <i className="bi bi-check-lg"></i>
                                    </button>
                                </div>
                            </form>
                            <button
                                className="wiz-camera-btn"
                                onClick={() => setShowScanner(true)}
                            >
                                <i className="bi bi-camera-fill"></i>
                                <span>Camera</span>
                            </button>
                        </div>

                        {/* Scan Feedback */}
                        {lastScanResult && (
                            <div className={`wiz-scan-feedback ${lastScanResult.isReassignment ? "warn" : "ok"}`}>
                                <i className={`bi ${lastScanResult.isReassignment ? "bi-arrow-repeat" : "bi-check-circle-fill"}`}></i>
                                <span>
                                    {lastScanResult.isReassignment
                                        ? `Reassigned from "${lastScanResult.previousProduct}"`
                                        : `Saved: ${lastScanResult.barcode}`
                                    }
                                </span>
                            </div>
                        )}

                        {/* Bulk List */}
                        {bulkMode && scannedBarcodes.length > 0 && (
                            <div className="wiz-bulk-list">
                                <div className="wiz-bulk-list-header">
                                    <span>{scannedBarcodes.length} scanned this session</span>
                                </div>
                                {scannedBarcodes.slice(0, 8).map((s, i) => (
                                    <div key={i} className="wiz-bulk-row">
                                        <i className="bi bi-upc-scan text-muted"></i>
                                        <span>{s.barcode}</span>
                                        {s.isReassignment && <span className="wiz-reassign-badge">Reassigned</span>}
                                    </div>
                                ))}
                                {scannedBarcodes.length > 8 && (
                                    <div className="wiz-bulk-more">+{scannedBarcodes.length - 8} more</div>
                                )}
                            </div>
                        )}

                        {/* Existing Barcodes */}
                        {currentBarcodes.length > 0 && (
                            <details className="wiz-existing-barcodes">
                                <summary>
                                    <i className="bi bi-list-ul"></i>
                                    View assigned barcodes ({currentBarcodes.length})
                                </summary>
                                <div className="wiz-barcode-list">
                                    {currentBarcodes.map(b => (
                                        <div key={b.barcode} className="wiz-barcode-row">
                                            <span className="wiz-barcode-code">{b.barcode}</span>
                                            <button
                                                className="wiz-barcode-del"
                                                onClick={() => {
                                                    deleteMapping(b.barcode);
                                                    toast("Removed", { icon: "🗑️" });
                                                }}
                                            >
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )}

                        {/* Done / Finish */}
                        <button
                            className={`wiz-btn-primary w-100 mt-3 ${bulkMode ? "" : "wiz-btn-outline"}`}
                            onClick={() => setStep(3)}
                        >
                            {bulkMode
                                ? `Finish Bulk (${scannedBarcodes.length} scanned)`
                                : "Done with this product"
                            }
                        </button>

                        {showScanner && (
                            <BarcodeScanner
                                title={`Scan → ${selectedProduct.name}`}
                                onScan={(code) => { setShowScanner(false); processBarcode(code); }}
                                onClose={() => setShowScanner(false)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddItemWizard;