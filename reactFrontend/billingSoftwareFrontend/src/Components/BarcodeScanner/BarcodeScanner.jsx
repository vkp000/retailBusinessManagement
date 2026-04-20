import { useEffect, useRef, useState } from "react";
import "./BarcodeScanner.css";

// Uses ZXing library for camera barcode scanning
// Loaded via CDN in index.html — add this line:
// <script src="https://unpkg.com/@zxing/library@latest/umd/index.min.js"></script>

const BarcodeScanner = ({ onScan, onClose, title = "Scan Barcode" }) => {
    const videoRef = useRef(null);
    const [manualCode, setManualCode] = useState("");
    const [mode, setMode] = useState("manual"); // "camera" | "manual"
    const [cameraError, setCameraError] = useState(null);
    const [scanning, setScanning] = useState(false);
    const readerRef = useRef(null);

    useEffect(() => {
        if (mode === "camera") {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [mode]);

    const startCamera = async () => {
        try {
            setScanning(true);
            setCameraError(null);

            if (!window.ZXing) {
                setCameraError("ZXing library not loaded. Add CDN script to index.html.");
                setScanning(false);
                return;
            }

            const codeReader = new window.ZXing.BrowserMultiFormatReader();
            readerRef.current = codeReader;

            const devices = await codeReader.listVideoInputDevices();
            if (devices.length === 0) {
                setCameraError("No camera found on this device.");
                setScanning(false);
                return;
            }

            // Prefer rear camera on mobile
            const deviceId = devices.find(d =>
                d.label.toLowerCase().includes("back") ||
                d.label.toLowerCase().includes("rear")
            )?.deviceId || devices[0].deviceId;

            await codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
                if (result) {
                    onScan(result.getText());
                    stopCamera();
                    setMode("manual");
                }
            });
        } catch (err) {
            setCameraError("Camera access denied or not available.");
            setScanning(false);
        }
    };

    const stopCamera = () => {
        if (readerRef.current) {
            readerRef.current.reset();
            readerRef.current = null;
        }
        setScanning(false);
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualCode.trim()) {
            onScan(manualCode.trim());
            setManualCode("");
        }
    };

    return (
        <div className="barcode-scanner-overlay">
            <div className="barcode-scanner-modal">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold">{title}</h6>
                    <button className="btn-close btn-close-white" onClick={onClose} />
                </div>

                {/* Mode Toggle */}
                <div className="d-flex gap-2 mb-3">
                    <button
                        className={`btn btn-sm flex-grow-1 ${mode === "manual" ? "btn-warning" : "btn-outline-secondary"}`}
                        onClick={() => setMode("manual")}
                    >
                        <i className="bi bi-keyboard me-1"></i>Manual Entry
                    </button>
                    <button
                        className={`btn btn-sm flex-grow-1 ${mode === "camera" ? "btn-warning" : "btn-outline-secondary"}`}
                        onClick={() => setMode("camera")}
                    >
                        <i className="bi bi-camera me-1"></i>Camera Scan
                    </button>
                </div>

                {mode === "camera" ? (
                    <div className="camera-container">
                        {cameraError ? (
                            <div className="alert alert-danger small">{cameraError}</div>
                        ) : (
                            <>
                                <video ref={videoRef} className="scanner-video" />
                                <div className="scanner-overlay-line" />
                                {scanning && (
                                    <p className="text-center text-warning small mt-2">
                                        <i className="bi bi-camera-video me-1"></i>Scanning...
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleManualSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter or scan barcode..."
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="btn btn-warning">
                                <i className="bi bi-check-lg"></i>
                            </button>
                        </div>
                        <small className="text-muted">
                            Press Enter or click ✓ to confirm
                        </small>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BarcodeScanner;