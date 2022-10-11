import "leaflet/dist/leaflet.css";
import L, { MapOptions, Layer, Map } from "leaflet";
import { useAppStore } from '@/store';
import { getViewportOffset } from '@/utils/domUtils';
import "leaflet.chinatmsproviders";

const appStore = useAppStore();

/**
 * 创建插件地图
 * @param {String} domId 显示地图的标签ID
 * @param {MapOptions} options 生成地图所需参数
 * @param {Object} mapType 在线地图图层列表
 * @returns {Object} map对象
 */
export * from 'leaflet';
export function createPluginsMap(domId: string, options: MapOptions, mapType: Object): Map{
    let layer = {};
    let count = 0;
    for (const key in mapType) {
        // const element = object[key];
        let layers: Layer[] = [];
        mapType[key].forEach((mapItem: string) => {
            layers.push(
                L.tileLayer['chinaProvider'](mapItem, {
                    key: 'a610e8f2535f6ed27bca653867b49be5',
                    minZoom: options.minZoom,
                    maxZoom: 18,
                })
            );
        });
        layer[key] = L.layerGroup(layers);
        if(count < 1) {
            options.layers = layer[key];
        }
        count++;
    }
    let map = L.map(domId, options);
    L.control.layers(layer).addTo(map);
    map.setView(options.center as L.LatLngExpression, options.zoom);
    return map
}

export function computeMapHeight(map: any, mapHeadClass?: string): number {
    let tagsHeight = 0;
    let mapHeadHeight = 0;
    if(!map) return 0;
    const headEl = document.querySelector('.layout_content_header') as HTMLElement;
    if(mapHeadClass) {
        const mapHead = document.querySelector(mapHeadClass) as HTMLElement;
        mapHeadHeight = mapHead.offsetHeight;
    }
    if(appStore.tagTabsVisible) {
        const tagsEl = document.querySelector('.tag_tab') as HTMLElement;
        tagsHeight = tagsEl.offsetHeight;
    };
    const { bottomIncludeBody } = getViewportOffset(headEl);
    return (bottomIncludeBody - tagsHeight - mapHeadHeight - 100)
}