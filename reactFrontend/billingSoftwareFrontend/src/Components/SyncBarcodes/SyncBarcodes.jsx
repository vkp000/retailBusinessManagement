import { useState } from "react";
import { getPendingSync, getPendingSyncCount, clearPendingSync } from "../../Service/BarcodeStore";
import { syncBarcodes } from "../../Service/ItemService";
import toast from "react-hot-toast";
import "./SyncBarcodes.css";

const SyncBarcodes = () => {
    const [syncing, setSyncing] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const pendingCount = getPendingSyncCount();
    const pending = getPendingSync();

    if (pendingCount === 0) {
        return (
            <div className="sync-status synced">
                <i className="bi bi-cloud-check-fill"></i>
                <span>All synced</span>
            </div>
        );
    }

    const handleSync = async () => {
        setSyncing(true);
        try {
            const mappings = Object.entries(pending).map(([barcode, data]) => ({
                barcode, productId: data.productId,
                isReassignment: data.isReassignment || false,
            }));
            await syncBarcodes(mappings);
            clearPendingSync();
            toast.success(`${mappings.length} barcode(s) synced ✓`);
        } catch (err) {
            toast.error("Sync failed — saved locally, retry later");
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="sync-panel">
            <div className="sync-row">
                <button className="sync-status pending" onClick={() => setShowDetails(!showDetails)}>
                    <i className="bi bi-cloud-upload"></i>
                    <span>{pendingCount} unsynced</span>
                    <i className={`bi bi-chevron-${showDetails ? "up" : "down"} sync-chevron`}></i>
                </button>
                <button className="sync-btn" onClick={handleSync} disabled={syncing}>
                    {syncing
                        ? <><span className="spinner-border spinner-border-sm"></span> Syncing...</>
                        : <><i className="bi bi-cloud-arrow-up"></i> Sync</>
                    }
                </button>
            </div>
            {showDetails && (
                <div className="sync-details">
                    {Object.entries(pending).slice(0, 5).map(([barcode, data]) => (
                        <div key={barcode} className="sync-detail-row">
                            <span className="sync-detail-code">{barcode}</span>
                            <span className="sync-detail-product">→ {data.productName}</span>
                            {data.isReassignment && <span className="sync-reassign-dot"></span>}
                        </div>
                    ))}
                    {pendingCount > 5 && <div className="sync-more">+{pendingCount - 5} more</div>}
                </div>
            )}
        </div>
    );
};

export default SyncBarcodes;