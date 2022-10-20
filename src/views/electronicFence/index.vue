<template>
    <div class="electronicFence">
        <n-layout has-sider>
            <n-layout-sider
                :width="300"
                :collapsed-width="0"
                collapse-mode="transform"
                show-trigger="arrow-circle"
            ></n-layout-sider>
            <n-layout has-sider sider-placement="right">
                <n-layout-content>
                    <leaflet-map ref="leafletMapRef" :map-id="mapOptions.id" :coordinate-type="mapOptions.coordinateType" />
                </n-layout-content>
                <n-layout-sider
                    :width="300"
                    :collapsed-width="0"
                    collapse-mode="transform"
                    show-trigger="arrow-circle"
                ></n-layout-sider>
            </n-layout>
        </n-layout>
    </div>
</template>
<script setup lang='ts'>
import { ref, onMounted, nextTick } from "vue";
import { getMapDataList } from "@/api/map";
import LeafletMap from "./leafletMap.vue";
interface mapOptions {
    id: string;
    height: number;
    coordinateType: number;
}
const mapOptions = ref<mapOptions>({
    id: "",
    height: 700,
    coordinateType: 0,
});
const leafletMapRef = ref<any>();
/**生成地图 */
const getMapInfo = async (data: map.mapDataList) => {
    mapOptions.value.id = data.id;
    mapOptions.value.coordinateType = data.eCoordinateType;
    nextTick(() => {
        leafletMapRef.value.initMap();
    });
};

/**获取地图列表 */
const getMapList = async () => {
    let data = (await getMapDataList()).Data;
    data.map((item) => {
        if (item.isDefault) {
            getMapInfo(item);
        }
    });
};
getMapList();
</script>
<style lang='scss' scoped>
.electronicFence {
    height: 100%;
    :deep(.n-layout) {
        height: inherit;
    }
}
</style>