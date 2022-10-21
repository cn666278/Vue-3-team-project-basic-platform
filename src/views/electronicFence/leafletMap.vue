<template>
    <div id="Map" class="Map"></div>
</template>
<script setup lang="ts">
import L from "leaflet";
import { onMounted, ref, nextTick, unref } from "vue";
import { createPluginsMap, Map } from "@/utils/LeafletMap";
import { getMapParamInfo } from "@/api/map";
interface Props {
    mapId: string;
    coordinateType: number;
}
const props = defineProps<Props>();
const propsData = ref(props);
const mapParamData = ref();
let map = ref<Map>();
const layers = ref({
    fenceLayer: L.featureGroup(),
});
const layersData = ref({
    editFenceData: {},
});

const getMapDataInfo = async () => {
    let data = (await getMapParamInfo(propsData.value.mapId)).Data as any;
    mapParamData.value = data;
};
/**初始化地图 */
const initMap = async () => {
    await getMapDataInfo();
    map.value = createPluginsMap(
        "Map",
        {
            center: mapParamData.value.mapCenter
                .split(",")
                .map((v: string) => Number(v)),
            minZoom: Number(mapParamData.value.minZoom),
            maxZoom: Number(mapParamData.value.maxZoom),
            zoom: Number(),
            attributionControl: false,
        },
        {
            天地图: ["TianDiTu.Normal.Map", "TianDiTu.Normal.Annotion"],
            天地图影像: [
                "TianDiTu.Satellite.Map",
                "TianDiTu.Satellite.Annotion",
            ],
            高德地图: ["GaoDe.Normal.Map"],
            高德影像: ["GaoDe.Satellite.Map", "GaoDe.Satellite.Annotion"],
            Geoq: ["Geoq.Normal.Map"],
            OSM: ["OSM.Normal.Map"],
        }
    );
};

/**生成电子围栏 */
const initFence = (data: MapFenceRecord.MapFenceTree[]) => {
    return data.map((fence) => {
        let latLng = fence.mapPointList.map((point) => L.latLng(point.lat, point.lng));
        // let latLngList = fence.mapPointList.map((point) =>
        //     L.latLng(point.lat, point.lng)
        // );
        // let geoJsonData: GeoJSON.Feature = {
        //     type: "Feature",
        //     geometry: {
        //         type: "Polygon",
        //         coordinates: latLng,
        //     },
        //     properties: {},
        // };
        // layersData.value[fence.id] = L.geoJSON(geoJsonData, {
        //     style: () => {
        //         return {
        //             color: fence.color,
        //             weight:
        //                 fence.lineWidth && fence.lineWidth == 0
        //                     ? 1.5
        //                     : fence.lineWidth,
        //             fill: fence.isFill,
        //         };
        //     },
        // })
        // .bindPopup(`${fence.codeName}-${fence.name}`)
        // layersData.value[fence.id] = L.polygon(latLngList, {
        //     color: fence.color,
        //     weight:
        //         fence.lineWidth && fence.lineWidth == 0 ? 1.5 : fence.lineWidth,
        //     fill: fence.isFill,
        // }).addTo(map.value as unknown as L.LayerGroup);
        if(map.value && !map.value.hasLayer(layers.value.fenceLayer as L.FeatureGroup)) {
            map.value.addLayer(layers.value.fenceLayer as L.FeatureGroup);
        }
    });
};
onMounted(() => {
    // console.log(layers.value.fenceLayer);
});
defineExpose({ initMap, initFence });
</script>
<style lang="scss" scoped>
.Map {
    height: inherit;
    :deep(.leaflet-pane) {
        z-index: 0;
    }
    :deep(.leaflet-control-container) {
        .leaflet-top,
        .leaflet-bottom {
            z-index: 0;
        }
    }
}
</style>
