<template>
    <n-form label-placement="left" v-bind="attrs">
        <n-grid
            cols="1 s:1 m:2 l:3 xl:5 2xl:5"
            :collapsed-rows="1"
            :collapsed="isShowCollapsedRows"
            responsive="screen"
            :x-gap="10"
        >
            <n-form-item-gi
                v-for="(searchItem, index) in propsData"
                :label="searchItem.label"
                :key="index"
            >
                <n-input
                    v-model:value="searchItem.value"
                    v-bind="searchItem.props"
                    v-if="searchItem.type == 'input'"
                />
                <n-select
                    v-model:value="searchItem.value"
                    v-bind="searchItem.props"
                    v-if="searchItem.type == 'select'"
                />
            </n-form-item-gi>
            <n-gi suffix #="{ overflow }">
                <n-space
                    align="center"
                    justify="end"
                    :style="{
                        'margin-left': `80px`,
                    }"
                >
                    <n-button type="primary" @click="onSearchHandle"
                        >查询</n-button
                    >
                    <!-- <n-button>重置</n-button> -->
                    <n-switch
                        v-model:value="isShowCollapsedRows"
                        v-if="overflow"
                    >
                        <template #checked>收缩</template>
                        <template #unchecked>展开</template>
                    </n-switch>
                </n-space>
            </n-gi>
        </n-grid>
    </n-form>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, useAttrs } from "vue";
import type { SearchColumns } from "./index";
interface SearchOption {
    columns: SearchColumns[];
}
const props = defineProps<SearchOption>();
const emit = defineEmits(["getTableData"]);
const propsData = ref<SearchColumns[]>(props.columns);
let isShowCollapsedRows = ref<boolean>(true);
const attrs = useAttrs();
const onSearchHandle = () => {
    let data = {};
    propsData.value.forEach((search) => {
        if(search.type == 'select' && search.value == 'null') {
            data[search.key] = null;
        } else if(search.type == 'select' && search.value == 'true' || search.value == 'false') {
            data[search.key] = search.value == 'true' ? true : false;
        } else {
            data[search.key] = search.value;
        }
    });
    emit("getTableData", { ...data });
};
watch(
    props,
    (nowProps) => {
        if (nowProps.columns) propsData.value = nowProps.columns;
    },
    { deep: true }
);
onMounted(() => {
    onSearchHandle();
});
</script>
<style lang="scss"></style>
