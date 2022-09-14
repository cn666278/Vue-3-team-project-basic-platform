<template>
    <div class="leaflet_map">
        <div class="device_slide">
            <n-tree
                :data="deviceTree"
                key-field="id"
                label-field="name"
                children-field="deviceList"
            />
        </div>
        <leaflet-map
            ref="leafletMapRef"
            :map-id="mapOptions.id"
            :style="`height: ${mapOptions.height}px`"
        ></leaflet-map>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { computeMapHeight } from "@/utils/LeafletMap";
import { getMapDataList } from "@/api/map";
import { getDeviceMapIndex } from "@/api/device";
import { TreeOption } from "naive-ui";
import LeafletMap from "./LeafletMap.vue";
interface mapOptions {
    id: string;
    height: number;
}
const mapOptions = ref<mapOptions>({
    id: "",
    height: 700,
});
const deviceTree = ref<TreeOption[]>();
const leafletMapRef = ref<any>();
const getDeviceList = async () => {
    let data = (await getDeviceMapIndex()).Data;
    console.log(data);
    deviceTree.value = data.groupList;
};
const getMapInfo = async (id: string) => {
    mapOptions.value.id = id;
    nextTick(() => {
        leafletMapRef.value.initMap();
    });
};
const getMapList = async () => {
    let data = (await getMapDataList()).Data;
    data.map((item) => {
        if (item.isDefault) {
            getMapInfo(item.id);
        }
    });
};
getMapList();
getDeviceList();
onMounted(() => {
    mapOptions.value.height = computeMapHeight(leafletMapRef);
    window.addEventListener("resize", () => {
        mapOptions.value.height = computeMapHeight(leafletMapRef);
    });
});
</script>
<style lang="scss" scoped>
.leaflet_map {
    display: flex;
    .device_slide {
        flex-basis: 260px;
    }
    .Map {
        flex: 1;
    }
}
</style>
