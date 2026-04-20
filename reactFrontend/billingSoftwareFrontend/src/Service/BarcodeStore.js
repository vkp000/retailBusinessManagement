// Local-first barcode store using localStorage
// No backend calls here — pure local operations

const STORE_KEY = "barcode_mappings";
const PENDING_KEY = "barcode_pending_sync";

// --- Barcode Mappings ---
// Structure: { [barcode]: { productId, productName, productImg, categoryId, assignedAt } }

export const getAllMappings = () => {
    try {
        return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    } catch {
        return {};
    }
};

export const getMapping = (barcode) => {
    const all = getAllMappings();
    return all[barcode] || null;
};

export const setMapping = (barcode, productData) => {
    const all = getAllMappings();
    const isReassignment = !!all[barcode];
    all[barcode] = {
        ...productData,
        assignedAt: new Date().toISOString(),
        isReassignment,
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
    markPendingSync(barcode, all[barcode]);
    return { barcode, ...all[barcode], isReassignment };
};

export const deleteMapping = (barcode) => {
    const all = getAllMappings();
    delete all[barcode];
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
};

export const getMappingsByProduct = (productId) => {
    const all = getAllMappings();
    return Object.entries(all)
        .filter(([, val]) => val.productId === productId)
        .map(([barcode, val]) => ({ barcode, ...val }));
};

export const countStock = (productId) => {
    return getMappingsByProduct(productId).length;
};

// --- Pending Sync Queue ---
const markPendingSync = (barcode, data) => {
    const pending = getPendingSync();
    pending[barcode] = data;
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
};

export const getPendingSync = () => {
    try {
        return JSON.parse(localStorage.getItem(PENDING_KEY) || "{}");
    } catch {
        return {};
    }
};

export const clearPendingSync = () => {
    localStorage.removeItem(PENDING_KEY);
};

export const getPendingSyncCount = () => {
    return Object.keys(getPendingSync()).length;
};