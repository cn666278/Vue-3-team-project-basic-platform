<template>
    <div class="track_play_back_container">
        <n-layout has-sider>
            <n-layout-sider
                collapse-mode="transform"
                :collapsed-width="0"
                width="310"
                show-trigger="arrow-circle"
                bordered
            >
                <n-form label-placement="left" :show-feedback="false">
                    <n-grid x-gap="12" cols="1 s:1 m: 2">
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">设备号:</div>
                            </template>
                            {{ infoData?.terminalNo }}
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">车牌号:</div>
                            </template>
                            {{ infoData?.carNumber }}
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">速度(km/h):</div>
                            </template>
                            {{ infoData?.speed }}
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">方向:</div>
                            </template>
                            {{ infoData?.direction }}
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">高程:</div>
                            </template>
                            {{ infoData?.altitude }}
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">里程:</div>
                            </template>
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">信号强度:</div>
                            </template>
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">卫星数:</div>
                            </template>
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">卫星数:</div>
                            </template>
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">服务器时间:</div>
                            </template>
                        </n-form-item-gi>
                        <n-form-item-gi>
                            <template #label>
                                <div class="form_label">设备时间:</div>
                            </template>
                            {{ infoData?.locationDate }}
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </n-layout-sider>
            <n-layout>
                <n-layout-header></n-layout-header>
                <n-layout-content>
                    <div id="trackPlayBackMap" class="track_play_back_map"></div>
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>
<script setup lang='ts'>
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet.marker.slideto';
import { nextTick, onMounted, ref } from "vue";
import { createPluginsMap, Map } from "@/utils/LeafletMap";
import { getMapParamInfo } from "@/api/map";
import { getAssetsFile } from '@/utils/common';
interface Props {
    mapId: string;
}
const props = defineProps<Props>();
const propsData = ref(props);
const mapParamData = ref();
let map = ref<Map>();
const infoData = ref<map.mapDeviceListInfo>();
const layers = ref({
    carLayer: L.featureGroup(),
});
const layersData = ref({
    editCarData: {},
    popupData: {},
});
/**初始化地图 */
const initMap = async () => {
    await getMapDataInfo();
    map.value = createPluginsMap(
        "trackPlayBackMap",
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
/**获取地图参数详情 */
const getMapDataInfo = async () => {
    let data = (await getMapParamInfo(propsData.value.mapId)).Data as any;
    mapParamData.value = data;
};
/**获取当前设备详情 */
const getDeviceInfo = (data: map.mapDeviceListInfo) => {
    infoData.value = data;
};
onMounted(() => {
    initMap();
});
defineExpose({ getDeviceInfo });
</script>
<style lang='scss' scoped>
    .track_play_back_container {
        width: 100%;
        height: 75vh;
        .form_label {
            font-weight: 600;
        }
        :deep(.n-layout) {
            height:inherit;
            .track_play_back_map {
                height: inherit;
                .leaflet-top,.leaflet-bottom,.leaflet-pane {
                    z-index: 0;
                }
            }
        }
    }
</style>