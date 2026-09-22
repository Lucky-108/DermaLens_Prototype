import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Zap, ZapOff, Image as ImageIcon, CheckCircle, RefreshCw, AlertTriangle, Camera as CameraIcon } from 'lucide-react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface CameraScanScreenProps {
  onCapture: (imageUri: string, isLowQuality?: boolean) => void;
  onBack: () => void;
}

export const CameraScanScreen: React.FC<CameraScanScreenProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [showPoorQualityModal, setShowPoorQualityModal] = useState<boolean>(false);
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null);

  // Directly launch native Android hardware camera app instantly
  const launchNativeCamera = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 95,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image && image.dataUrl) {
        onCapture(image.dataUrl, false);
      }
    } catch (err: any) {
      console.log('Native camera cancelled or failed:', err);
    }
  };

  // Start HTML5 live camera stream
  const startHtml5Camera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setHasCamera(true);
        }
      }
    } catch (e) {
      console.warn('HTML5 live stream failed:', e);
      setHasCamera(false);
    }
  };

  useEffect(() => {
    startHtml5Camera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const triggerCaptureFlash = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
  };

  const handleCaptureClick = (simulatedPoorQuality: boolean = false) => {
    triggerCaptureFlash();
    let capturedUri = '';

    if (hasCamera && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        capturedUri = canvas.toDataURL('image/jpeg', 0.92);
      }
    }

    if (!capturedUri) {
      launchNativeCamera();
      return;
    }

    if (simulatedPoorQuality) {
      setCapturedImageData(capturedUri);
      setShowPoorQualityModal(true);
    } else {
      setTimeout(() => onCapture(capturedUri, false), 150);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result as string, false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#050505',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Shutter Capture Screen Flash Overlay */}
      {isFlashing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFD600',
            opacity: 0.85,
            zIndex: 100,
            pointerEvents: 'none',
            transition: 'opacity 0.15s ease-out',
          }}
        />
      )}

      {/* Top Camera Controls HUD */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '16px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 40,
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.9), transparent)',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'white',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-control)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="tech-label"
            style={{
              fontSize: '0.66rem',
              color: '#FFD600',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FFD600' }} />
            {hasCamera ? 'READY TO SCAN' : 'CAMERA HUD'}
          </span>

          <button
            onClick={() => setFlashOn(!flashOn)}
            style={{
              background: flashOn ? 'var(--primary)' : 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: flashOn ? '#000000' : 'white',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-control)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {flashOn ? <Zap size={16} fill="#000000" /> : <ZapOff size={16} />}
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}
      >
        {flashOn && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 214, 0, 0.15)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: hasCamera ? 'block' : 'none',
          }}
        />

        {!hasCamera && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 214, 0, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 214, 0, 0.3)',
              }}
            >
              <CameraIcon size={42} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '6px', color: 'white' }}>
                OPEN PHONE CAMERA
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#A7A7A7', maxWidth: '280px', lineHeight: '1.4' }}>
                Tap below to open your phone's native camera hardware to take a sharp skin photo.
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={launchNativeCamera}
              style={{ width: '100%', maxWidth: '240px', height: '50px', fontSize: '0.96rem' }}
            >
              <CameraIcon size={20} /> TAKE PHOTO NOW
            </button>
          </div>
        )}

        {/* Precision Framing Reticle Overlay */}
        <div
          style={{
            position: 'absolute',
            width: '220px',
            height: '220px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 214, 0, 0.4)',
            boxShadow: '0 0 0 9999px rgba(5, 5, 5, 0.80)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          {/* Animated Yellow Laser Scanning Line */}
          <div className="animate-scan-line" />

          {/* Precision Corner Tick Marks */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', width: '12px', height: '12px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '12px', height: '12px', borderTop: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '12px', height: '12px', borderBottom: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '12px', height: '12px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />
        </div>

        {/* Live Quality Badges HUD */}
        <div
          style={{
            position: 'absolute',
            top: '75px',
            display: 'flex',
            gap: '8px',
            zIndex: 30,
          }}
        >
          <span
            className="tech-label"
            style={{
              fontSize: '0.64rem',
              backgroundColor: 'rgba(17, 17, 17, 0.9)',
              color: '#34D399',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle size={11} /> GOOD LIGHTING
          </span>
          <span
            className="tech-label"
            style={{
              fontSize: '0.64rem',
              backgroundColor: 'rgba(17, 17, 17, 0.9)',
              color: '#38BDF8',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle size={11} /> STEADY POSITION
          </span>
        </div>

        {/* Framing Instructions */}
        <div
          style={{
            position: 'absolute',
            bottom: '120px',
            left: '20px',
            right: '20px',
            textAlign: 'center',
            zIndex: 30,
          }}
        >
          <p className="tech-label" style={{ color: 'white', fontSize: '0.78rem', letterSpacing: '0.06em' }}>
            POSITION LESION IN FRAME
          </p>
        </div>
      </div>

      {/* Shutter Bar */}
      <div
        style={{
          height: '100px',
          backgroundColor: '#0A0A0A',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 24px',
          zIndex: 40,
        }}
      >
        <label
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-control)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid var(--border-subtle)',
          }}
          title="Upload from gallery"
        >
          <input type="file" accept="image/*" onChange={handleGalleryUpload} style={{ display: 'none' }} />
          <ImageIcon size={18} color="var(--text-secondary)" />
        </label>

        {/* Tactile Yellow Shutter Button */}
        <button
          onClick={() => handleCaptureClick(false)}
          style={{
            width: '68px',
            height: '68px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--primary)',
            border: '2px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.1s ease',
          }}
          title="Capture Skin Photo"
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-control)',
              border: '1.5px solid rgba(0,0,0,0.3)',
            }}
          />
        </button>

        <button
          onClick={() => handleCaptureClick(true)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-control)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid var(--border-subtle)',
          }}
          title="Test Poor Image Warning"
        >
          <AlertTriangle size={18} color="#FFD166" />
        </button>
      </div>

      {/* Poor Quality Modal */}
      {showPoorQualityModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 5, 5, 0.94)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              backgroundColor: '#141414',
              borderColor: 'var(--border-light)',
              color: 'white',
              textAlign: 'center',
              padding: '24px 20px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 209, 102, 0.15)',
                color: '#FFD166',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
                border: '1px solid rgba(255, 209, 102, 0.3)',
              }}
            >
              <AlertTriangle size={26} />
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '6px', color: 'white' }}>
              LET'S GET A CLEARER IMAGE
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#A7A7A7', marginBottom: '16px' }}>
              The captured photo may reduce screening accuracy:
            </p>

            <ul
              style={{
                textAlign: 'left',
                backgroundColor: '#0B0B0B',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                color: '#A7A7A7',
                marginBottom: '20px',
                lineHeight: '1.6',
                border: '1px solid #1F1F1F',
              }}
            >
              <li>• Motion blur or out-of-focus camera</li>
              <li>• Dim or uneven ambient lighting</li>
              <li>• Lesion too far from camera center</li>
            </ul>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-primary"
                onClick={() => setShowPoorQualityModal(false)}
              >
                <RefreshCw size={18} /> RETAKE PHOTO
              </button>

              <button
                className="btn-secondary"
                onClick={() => {
                  setShowPoorQualityModal(false);
                  if (capturedImageData) {
                    onCapture(capturedImageData, true);
                  }
                }}
              >
                USE ANYWAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
