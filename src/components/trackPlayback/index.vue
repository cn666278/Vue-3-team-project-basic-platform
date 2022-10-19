<template>
    <div class="track_play_back_container">
        <n-layout has-sider>
            <n-layout-sider
                collapse-mode="transform"
                :collapsed-width="0"
                width="320"
                show-trigger="arrow-circle"
                content-style="padding-right: 5px"
            >
                <div class="form_slider">
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
                                {{ calculateDirection(infoData?.direction) }}
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
                                {{ infoData?.mileage }}
                            </n-form-item-gi>
                            <n-form-item-gi>
                                <template #label>
                                    <div class="form_label">信号强度:</div>
                                </template>
                                {{ infoData?.wiFiSignalStrength }}
                            </n-form-item-gi>
                            <n-form-item-gi>
                                <template #label>
                                    <div class="form_label">卫星数:</div>
                                </template>
                                {{ infoData?.gnssCount }}
                            </n-form-item-gi>
                            <n-form-item-gi :span="2">
                                <template #label>
                                    <div class="form_label">设备时间:</div>
                                </template>
                                {{ dateFormat(infoData?.deviceDate || infoData?.locationDate) }}
                            </n-form-item-gi>
                            <n-form-item-gi :span="2">
                                <template #label>
                                    <div class="form_label">服务器时间:</div>
                                </template>
                                {{ dateFormat(infoData?.serverDate) }}
                            </n-form-item-gi>
                            <n-form-item-gi :span="2">
                                <template #label>
                                    <div class="form_label">播放速度:</div>
                                </template>
                                <n-slider :default-value="2" :min="0" :max="4" :step="1" :marks="playSpeedMarks" :tooltip="false" @update-value="onPlaySpeed" />
                            </n-form-item-gi>
                        </n-grid>
                    </n-form>
                    <n-data-table ref="locusPointTableRef" :columns="locusColumn" :data="locusData" size="small" flex-height style="height: 100%;" />
                </div>
            </n-layout-sider>
            <n-layout>
                <n-layout-header>
                    <n-space align="center">
                        <n-radio-group
                            v-model:value="searchTimeType"
                            @update-value="onSelectSearchTime"
                        >
                            <n-space>
                                <n-radio :value="1">昨天</n-radio>
                                <n-radio :value="2">今天</n-radio>
                                <n-radio :value="3">自定</n-radio>
                            </n-space>
                        </n-radio-group>
                        <n-date-picker
                            v-model:formatted-value="trackFormData.beginTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :disabled="searchTimeType != 3"
                            clearable
                        ></n-date-picker>
                        -
                        <n-date-picker
                            v-model:formatted-value="trackFormData.endTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :disabled="searchTimeType != 3"
                            clearable
                        ></n-date-picker>
                        <n-button type="primary" @click="getDeviceTrack"
                            >查询</n-button
                        >
                        <n-button v-if="locusData.length > 0" @click="playStop('播放')">重播</n-button>
                        <n-button v-if="playStopType && locusData.length > 0" @click="playStop('继续')">继续</n-button>
                        <n-button v-if="playStopType == false" @click="playStop('暂停')">暂停</n-button>
                    </n-space>
                    <n-slider v-model:value="trackIndex" :min="0" :max="locusData.length" :step="1" :tooltip="false" v-show="locusData.length > 0" />
                </n-layout-header>
                <n-layout-content>
                    <div
                        id="trackPlayBackMap"
                        class="track_play_back_map"
                    ></div>
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>
<script setup lang="ts">
import L from "leaflet";
import "leaflet-rotatedmarker";
import "leaflet.marker.slideto";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { DataTableColumn, DataTableInst } from 'naive-ui';
import { createPluginsMap, layerBounds, Map } from "@/utils/LeafletMap";
import { getMapParamInfo, getDeviceTrail } from "@/api/map";
import { formatDateTime } from '@/utils/common';
import {
    getAssetsFile,
    getBeginTime,
    getEndTime,
    someDaysAgoZero,
    someDaysAgoEnd,
    calculateDirection,
} from "@/utils/common";
interface Props {
    mapId: string;
    coordinateType: number;
}
const props = defineProps<Props>();
const propsData = ref(props);
const mapParamData = ref();
let map = ref<Map>();
interface deviceInfo extends map.deviceTrail {
    terminalNo?: string;
    carNumber?: string;
    locationDate?: string;
};
const infoData = ref<deviceInfo>();
const layers = ref({
    locusLineLayer: L.featureGroup(),
    carEditLayer: L.featureGroup(),
});
const editCarData = ref();
const trackFormData = ref<map.deviceTrailRequest>({
    coordinateType: props.coordinateType,
    beginTime: getBeginTime(),
    endTime: getEndTime(),
});
const searchTimeType = ref<1 | 2 | 3>(2);
const locusColumn: DataTableColumn[] = [
    {title: '序号', key: 'index', render: (_, index) => index+1, width: 75 },
    {title: '设备时间', key: 'deviceDate', render: (row, index) => dateFormat(row.deviceDate as string) },
];
const locusData = ref<map.deviceTrail[]>([]);
const trackIndex = ref(0);
const trackInterval = ref<NodeJS.Timer>();
const playStopType = ref(true);
const playSpeedMarks = {
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
}
const playSpeed = ref(2000);
const locusPointTableRef = ref<DataTableInst | null>();
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
const getDeviceInfo = (data: deviceInfo) => {
    infoData.value = data;
    trackFormData.value.terminalNo = data.terminalNo;
    // getDeviceTrack();
};
/**获取车辆轨迹数据 */
const getDeviceTrack = () => {
    getDeviceTrail(trackFormData.value).then((res) => {
        createDeviceTrack(res.Data);
    });
};
/**创建车辆轨迹数据 */
const createDeviceTrack = (deviceTrackData: map.deviceTrail[]) => {
    /**清除图层 */
    if(deviceTrackData == undefined) return
    layers.value.locusLineLayer.clearLayers();
    layers.value.carEditLayer.clearLayers();
    /**轨迹生成 */
    let latLng = deviceTrackData.map((item) => [
        Number(item.lng),
        Number(item.lat),
    ]);
    locusData.value = deviceTrackData;
    let geoJsonData: GeoJSON.Feature = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: latLng,
        },
        properties: {},
    };
    layers.value.locusLineLayer = L.geoJSON(geoJsonData, {
        style: () => {
            return {
                color: "#3388ff",
                weight: 7,
            };
        },
    });
    map.value?.addLayer(layers.value.locusLineLayer as L.GeoJSON);
    layerBounds(map.value as Map, layers.value.locusLineLayer as L.GeoJSON);
    createDeviceMarker(deviceTrackData[0]);
    playStop('播放');
};
/**车辆图标生成 */
const createDeviceMarker = (data: map.deviceTrail) => {
    let icon = L.icon({
        iconUrl: getAssetsFile('map', 'icon-car.png'),
        iconSize: [50, 89],
        iconAnchor: [26, 30],
    });
    editCarData.value = L.marker([Number(data.lat), Number(data.lng)], {
        icon,
    }).addTo(layers.value.carEditLayer as L.FeatureGroup);
    editCarData.value.setRotationAngle(data.direction);
    map.value?.addLayer(layers.value.carEditLayer as L.FeatureGroup);
};
/**轨迹回放 */
const playBack = () => {
    if(trackIndex.value < locusData.value.length) {
        trackInterval.value = setInterval(() => {
            trackIndex.value = trackIndex.value+1;
            if(locusData.value[trackIndex.value]) {
                infoData.value = {
                    ...infoData.value,
                    ...locusData.value[trackIndex.value]
                };
                carMove(locusData.value[trackIndex.value]);
            } else {
                clearInterval(trackInterval.value);
            }
        }, playSpeed.value)
    }
};
/**车辆移动 */
const carMove = (data: map.deviceTrail) => {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                editCarData.value.setRotationAngle(data.direction).slideTo([Number(data.lat), Number(data.lng)], {
                    duration: playSpeed.value,
                });
                resolve(true);
            }, 0);
        } catch (error) {
            reject(error);
        }
    })
};
/**轨迹回放操作 */
const playStop = (type: '播放'|'继续'|'暂停') => {
    switch (type) {
        case '播放':
            trackIndex.value = 0;
            playStopType.value = false;
            playBack();
            break;
        case '继续':
            playStopType.value = false;
            playBack();
            break;
        case '暂停':
            playStopType.value = true;
            clearInterval(trackInterval.value);
            break;
    }
};
/**轨迹播放速度 */
const onPlaySpeed = (value: number) => {
    playStop('暂停');
    let speedList = [5000, 3000, 2000, 1000, 500, 100];
    playSpeed.value = speedList[value];
    playStop('继续');
};
/**选择查询,昨天|今天|自定 */
const onSelectSearchTime = (value: number) => {
    if (value == 1) {
        trackFormData.value.beginTime = someDaysAgoZero(1);
        trackFormData.value.endTime = someDaysAgoEnd(1);
        getDeviceTrack();
    } else if (value == 2) {
        trackFormData.value.beginTime = getBeginTime();
        trackFormData.value.endTime = getEndTime();
        getDeviceTrack();
    }
};
/**时间格式化 */
const dateFormat = (time: string | undefined) => {
    if(time) {
        let date = formatDateTime(time);
        if(date != '1970-01-01 08:00:00') return date
    }
}
onMounted(() => {
    initMap();
});
onUnmounted(() => {
    playStop('暂停');
});
defineExpose({ getDeviceInfo });
</script>
<style lang="scss" scoped>
.track_play_back_container {
    width: 100%;
    height: 75vh;
    .form_label {
        font-weight: 600;
    }
    .form_slider {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    :deep(.n-layout) {
        height: inherit;
        .n-layout-scroll-container {
            display: flex;
            flex-direction: column;
            .n-layout-header {
                flex-basis: 40px;
            }
            .n-layout-content {
                flex: 2;
            }
        }
        .track_play_back_map {
            height: inherit;
            .leaflet-top,
            .leaflet-bottom,
            .leaflet-pane {
                z-index: 0;
            }
        }
    }
}
</style>
