import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type Props = { lon: number, lat: number }

export function FarmMap({ lon, lat }: Props){
  return (
    <div className="card" style={{ height: 320 }}>
      <MapContainer center={[lat, lon]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>Farm Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
