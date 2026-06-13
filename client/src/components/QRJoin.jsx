import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QRJoin({ roomCode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !roomCode) return;

    const joinUrl = `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? ":" + window.location.port : ""
    }/?join=${roomCode}`;

    QRCode.toCanvas(
      canvasRef.current,
      joinUrl,
      {
        width: 160,
        margin: 1,
        color: {
          dark: "#09090b",
          light: "#ffffff"
        }
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  }, [roomCode]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl">
      <canvas ref={canvasRef} className="rounded-lg" />
      <span className="text-[10px] text-zinc-500 font-mono mt-2 uppercase tracking-wider">
        Scan to join room
      </span>
    </div>
  );
}
