import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { CameraOff, Loader2, ArrowLeft } from 'lucide-react';

interface ScannerProps {
    onScan: (barcode: string) => void;
    onClose: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string>('');
    const [isInitializing, setIsInitializing] = useState(true);

    // Create an instance of the reader
    const readerRef = useRef(new BrowserMultiFormatReader());

    useEffect(() => {
        let mounted = true;

        const startScanner = async () => {
            try {
                const videoInputDevices = await readerRef.current.listVideoInputDevices();
                if (videoInputDevices.length === 0) {
                    throw new Error("No cameras found.");
                }

                // Grab the rear camera if possible
                const backendCamera = videoInputDevices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('traseira')) || videoInputDevices[0];

                if (videoRef.current && mounted) {
                    await readerRef.current.decodeFromVideoDevice(
                        backendCamera.deviceId,
                        videoRef.current,
                        (result, err) => {
                            if (result && mounted) {
                                // Return just the GTIN / barcode text
                                onScan(result.getText());
                            }
                            if (err && !(err instanceof NotFoundException)) {
                                // Ignore NotFoundException as It simply means "not detecting a barcode right now"
                                console.error("Scanning Error:", err);
                            }
                        }
                    );
                    setIsInitializing(false);
                }
            } catch (err: any) {
                console.error("Camera Init Error:", err);
                if (mounted) {
                    setError(err.message || 'Error accessing camera. Please check permissions.');
                    setIsInitializing(false);
                }
            }
        };

        startScanner();

        return () => {
            mounted = false;
            readerRef.current.reset();
        };
    }, [onScan]);

    return (
        <div className="scanner-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'var(--color-dark)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>

            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
                <button
                    onClick={onClose}
                    style={{
                        padding: '10px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(8px)',
                        color: '#fff',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <ArrowLeft size={20} /> Voltar
                </button>
            </div>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                {isInitializing && !error && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        color: 'var(--color-primary)',
                        zIndex: 20
                    }}>
                        <Loader2 className="animate-spin" size={48} />
                        <p style={{ fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Iniciando câmera...</p>
                    </div>
                )}

                {error && (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-error)', zIndex: 20 }}>
                        <CameraOff size={64} style={{ margin: '0 auto 16px' }} />
                        <p>{error}</p>
                        <button onClick={onClose} style={{ marginTop: '24px' }}>Voltar</button>
                    </div>
                )}

                <video
                    ref={videoRef}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: error ? 'none' : 'block' }}
                />

                {/* Viewfinder Overlay Layer */}
                {!error && !isInitializing && (
                    <>
                        <div className="scanner-viewfinder">
                            <div className="scanner-line"></div>
                        </div>
                        <div style={{ position: 'absolute', bottom: '15%', width: '100%', textAlign: 'center', zIndex: 10 }}>
                            <p style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', display: 'inline-block', padding: '8px 16px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                                Posicione o código de barras no centro
                            </p>
                        </div>
                    </>
                )}

            </div>

        </div>
    );
};
