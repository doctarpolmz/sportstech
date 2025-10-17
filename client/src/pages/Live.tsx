import { useEffect, useRef, useState } from 'react';

export default function Live() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);

  useEffect(() => {
    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setRunning(true);
      }
    };
    start().catch(console.error);
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let prevImageData: ImageData | null = null;

    const loop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) { raf = requestAnimationFrame(loop); return; }
      const w = canvas.width = video.videoWidth || 640;
      const h = canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) { raf = requestAnimationFrame(loop); return; }
      ctx.drawImage(video, 0, 0, w, h);

      const curr = ctx.getImageData(0, 0, w, h);
      if (prevImageData) {
        let diffCount = 0;
        const t = 30; // threshold
        for (let i = 0; i < curr.data.length; i += 4) {
          const d = Math.abs(curr.data[i] - prevImageData.data[i])
                  + Math.abs(curr.data[i+1] - prevImageData.data[i+1])
                  + Math.abs(curr.data[i+2] - prevImageData.data[i+2]);
          if (d > t) {
            diffCount++;
            // highlight motion
            curr.data[i] = 255; curr.data[i+1] = 0; curr.data[i+2] = 0;
          }
        }
        setMotionLevel(Math.round((diffCount / (w*h)) * 100));
        ctx.putImageData(curr, 0, 0);
      }
      prevImageData = curr;
      raf = requestAnimationFrame(loop);
    };

    if (running) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Live Motion Detection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <video ref={videoRef} className="w-full rounded bg-black" muted playsInline />
        <canvas ref={canvasRef} className="w-full rounded border" />
      </div>
      <div className="text-sm text-gray-600">Estimated motion level: <span className="font-medium">{motionLevel}%</span></div>
      <p className="text-gray-600 text-sm">Note: For production-grade pose/motion, integrate Google Cloud Video Intelligence or MediaPipe.</p>
    </div>
  );
}
