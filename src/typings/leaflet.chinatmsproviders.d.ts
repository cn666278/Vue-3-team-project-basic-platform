import { TileLayer } from "leaflet";

declare module 'leaflet' {
    namespace TileLayer {
        function chinaProvider(mapType: string, options: {key: string, minZoom: number, maxZoom: number}): TileLayer {

        }
    }
}