<template>
    <div id="Map" class="Map">
        <div style="display: none">
            <div ref="popupRef">
                <n-form
                    label-placement="left"
                    :show-feedback="false"
                    size="small"
                >
                    <n-form-item label="设备:">{{
                        infoData?.terminalNo
                    }}</n-form-item>
                    <n-form-item label="方向:">{{
                        calculateDirection(infoData?.direction)
                    }}</n-form-item>
                    <n-form-item label="速度:">{{
                        infoData?.speed
                    }}</n-form-item>
                    <n-form-item label="时间:">{{
                        dateFormat(infoData?.locationDate)
                    }}</n-form-item>
                    <n-form-item label="经度:">{{ infoData?.lng }}</n-form-item>
                    <n-form-item label="纬度:">{{ infoData?.lat }}</n-form-item>
                </n-form>
                <n-space justify="space-around" size="large">
                    <div
                        class="popup_btn"
                        @click="openDialog(infoData?.terminalNo as string)"
                    >
                        <img :src="getAssetsFile('map', 'icon-track.png')" />
                        轨迹
                    </div>
                    <!-- <div class="popup_btn">
                    <img :src="getAssetsFile('map', 'icon-common.png')" />
                    指令
                </div> -->
                </n-space>
            </div>
            <Dialog
                v-model:showModal="showTrackPlayBack"
                width="80vw"
                :option="dialogOption"
                :btn-show="false"
                @close="closeDialog"
            >
                <TrackPlayback
                    ref="trackPlayBackRef"
                    :map-id="props.mapId"
                    :coordinate-type="props.coordinateType"
                ></TrackPlayback>
            </Dialog>
        </div>
    </div>
</template>
<script setup lang="ts">
import L from "leaflet";
import "leaflet-rotatedmarker";
import "leaflet.marker.slideto";
import { onMounted, ref, inject, nextTick, unref } from "vue";
import { createMap, createPluginsMap, Map } from "@/utils/LeafletMap";
import { getMapParamInfo } from "@/api/map";
import {
    getAssetsFile,
    formatDateTime,
    calculateDirection,
} from "@/utils/common";
import { onMessageListKey } from "@/utils/webSocket";
import Dialog from "@/components/dialog/index.vue";
import TrackPlayback from "@/components/trackPlayback/index.vue";
interface Props {
    mapId: string;
    coordinateType: number;
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
const popupRef = ref<any>(null);
const trackPlayBackRef = ref<any>(null);
const showTrackPlayBack = ref(false);
const getMapDataInfo = async () => {
    let data = (await getMapParamInfo(propsData.value.mapId)).Data as any;
    mapParamData.value = data;
};
/**初始化地图 */
const initMap = async () => {
    await getMapDataInfo();
    if(mapParamData.value.MapType == 'leafletMap') {
        map.value = createMap(
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
            mapParamData.value.MapUrl,
            {
                layers: mapParamData.value.mapLayers,
                format: 'image/png',
                version: '1.3.0',
                maxZoom: Number(mapParamData.value.maxZoom),
            }
        )
    } else {
        map.value = createPluginsMap(
            "Map",
            {
                center: mapParamData.value.mapCenter
                    .split(",")
                    .map((v: string) => Number(v)),
                minZoom: Number(mapParamData.value.minZoom),
                maxZoom: Number(mapParamData.value.maxZoom),
                zoom: Number(mapParamData.value.zoom),
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
    }
};
/**初始化设备 */
const initCar = (data: map.mapDeviceListInfo[]) => {
    data.forEach((device) => {
        if (layersData.value.editCarData[device.terminalNo] == undefined) {
            if (device.lat && device.lng) {
                let latLng = L.latLng(Number(device.lat), Number(device.lng));
                let icon = L.icon({
                    iconUrl: getAssetsFile("map", "icon-car.png"),
                    iconSize: [50, 89],
                    iconAnchor: [26, 30],
                });
                layersData.value.editCarData[device.terminalNo] = L.marker(
                    latLng,
                    {
                        icon,
                    }
                )
                    .bindPopup(initPopup(device))
                    .on("click", () =>
                        changeCarPopup([
                            layersData.value.popupData[device.terminalNo],
                        ])
                    )
                    .addTo(layers.value.carLayer as L.FeatureGroup);
            }
        }
    });
    map.value?.addLayer(layers.value.carLayer as L.FeatureGroup);
};
/**初始化生成气泡 */
const initPopup = (data: map.mapDeviceListInfo) => {
    infoData.value = data;
    layersData.value.popupData[data.terminalNo] = data;
    return L.popup({
        autoClose: false,
        autoPan: false,
        closeButton: false,
        className: "leaflet_big_popup",
        minWidth: 250,
        offset: L.point(180, 165),
    }).setContent(popupRef.value);
};
/**改变气泡 */
const changeCarPopup = (data: map.mapDeviceListInfo[]) => {
    // 先全部关闭气泡
    layers.value.carLayer.eachLayer((layer) => {
        layer.closePopup();
    });
    // 符合条件更新气泡并打开
    data.forEach((item) => {
        for (const key in layersData.value.popupData) {
            let element = layersData.value.popupData[key];
            if (element && layersData.value.editCarData[element.terminalNo]) {
                if (element.terminalNo == item.terminalNo) {
                    layersData.value.popupData[item.terminalNo] = item;
                    infoData.value = item;
                    layersData.value.editCarData[item.terminalNo]
                        .setPopupContent(popupRef.value)
                        .openPopup();
                }
            }
        }
    });
};
/**清除车辆 */
const removeCar = (terminalNo: string[]) => {
    terminalNo.forEach((item) => {
        if (layersData.value.editCarData[item]) {
            layers.value.carLayer.removeLayer(
                layersData.value.editCarData[item]
            );
            delete layersData.value.editCarData[item];
        }
    });
};
/**车辆移动 */
const onCarMove = (data: any) => {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                if (layersData.value.editCarData[data.TN]) {
                    layersData.value.editCarData[data.TN]
                        .setRotationAngle(data.D)
                        .slideTo([data.Lat, data.Lng], {
                            duration:
                                Number(mapParamData.value.duration) * 1000,
                        });
                    if (
                        infoData.value &&
                        infoData.value?.terminalNo == data.TN
                    ) {
                        infoData.value.terminalNo = data.TN;
                        infoData.value.direction = data.D;
                        infoData.value.locationDate = data.Dt;
                        infoData.value.lat = data.Lat;
                        infoData.value.lng = data.Lng;
                        infoData.value.speed = data.S;
                    }
                }
                resolve(true);
            }, 0);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
/**定位到车辆当前位置 */
const carPosTo = (terminalNo: string) => {
    if (layersData.value.editCarData[terminalNo]) {
        let latLng = layersData.value.editCarData[terminalNo].getLatLng();
        map.value?.panTo(latLng);
        layersData.value.editCarData[terminalNo].openPopup();
    }
};
/**接收websocket数据进行数据更新 */
const onSocketMessage = (res: string) => {
    let data = JSON.parse(res);
    if (data.c == 1) onCarMove(data.d);
};
/**轨迹回放弹窗配置 */
const dialogOption = ref({
    title: "轨迹回放",
});
/**开启轨迹回放弹窗 */
const openDialog = (deviceId: string) => {
    showTrackPlayBack.value = true;
    let data = JSON.parse(JSON.stringify(infoData.value));
    nextTick(() => {
        trackPlayBackRef.value.getDeviceInfo(data);
    });
};
/**关闭轨迹回放弹窗 */
const closeDialog = () => {
    showTrackPlayBack.value = false;
};
/**时间格式化 */
const dateFormat = (time: string | undefined) => {
    if (time) {
        let date = formatDateTime(time);
        if (date != "1970-01-01 08:00:00") return date;
    }
};
onMounted(() => {
    /**接收注入 */
    const onMessageList = inject(onMessageListKey, []);
    onMessageList.push(onSocketMessage);
});
/**导出方法以供父级ref使用 */
defineExpose({ initMap, initCar, removeCar, carPosTo, changeCarPopup });
</script>
<style lang="scss" scoped>
.Map {
    height: inherit;
    .popup_btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        img {
            width: 20px;
            height: 20px;
        }
    }
    :deep(.leaflet-pane) {
        z-index: 0;
    }
    :deep(.leaflet-control-container) {
        .leaflet-top,
        .leaflet-bottom {
            z-index: 0;
        }
    }
    :deep(.leaflet-popup-tip-container) {
        left: -10px;
        top: 40%;
        transform: rotate(90deg);
    }
}
</style>
