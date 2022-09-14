<template>
    <div id="Map" class="Map"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createPluginsMap, Map } from "@/utils/LeafletMap";
import { getMapParamInfo } from "@/api/map";
interface Props {
    mapId: string;
}
const props = defineProps<Props>();
const propsData = ref(props);
const mapParamData = ref();
let map = ref<Map>();
const getMapDataInfo = async () => {
    let data = (await getMapParamInfo(propsData.value.mapId)).Data as any;
    mapParamData.value = data;
};
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
defineExpose({ initMap });
</script>
<style lang="scss" scoped>
    .Map {
        height: inherit;
    }
</style>
