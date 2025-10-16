import { useEffect, useRef, useState } from 'react'

export default function Live() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [running, setRunning] = useState(false)
  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    if (videoRef.current) { (videoRef.current as any).srcObject = stream; await (videoRef.current as any).play() }
    setRunning(true)
  }
  function stop() {
    const stream = (videoRef.current as any)?.srcObject as MediaStream | null
    stream?.getTracks().forEach((t) => t.stop())
    if (videoRef.current) (videoRef.current as any).srcObject = null
    setRunning(false)
  }
  useEffect(() => () => stop(), [])
  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Live Analysis (Beta)</h2>
      <video ref={videoRef} className="w-full max-w-xl rounded border" />
      <div className="flex gap-2">
        {!running ? <button className="bg-blue-600 text-white rounded px-3 py-2" onClick={start}>Start Camera</button>
                   : <button className="border rounded px-3 py-2" onClick={stop}>Stop</button>}
      </div>
      <div className="text-sm text-gray-600">Pose detection can be enabled with MediaPipe Tasks. This demo shows live camera feed.</div>
    </div>
  )
}
