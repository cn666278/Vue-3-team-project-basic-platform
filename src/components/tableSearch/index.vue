<template>
    <n-form size="medium" label-placement="left">
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
                    v-if="searchItem.type == 'input'"
                />
            </n-form-item-gi>
            <n-gi suffix #="{overflow}">
                <n-space
                    align="center"
                    justify="end"
                    :style="{
                        'margin-left': `80px`,
                    }"
                >
                    <n-button type="primary" @click="onSearchHandle">查询</n-button>
                    <n-button>重置</n-button>
                    <n-switch v-model:value="isShowCollapsedRows" v-if="overflow">
                        <template #checked>收缩</template>
                        <template #unchecked>展开</template>
                    </n-switch>
                </n-space>
            </n-gi>
        </n-grid>
    </n-form>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import type { SearchColumns } from "./index";
interface SearchOption {
    columns: SearchColumns[];
}
const props = defineProps<SearchOption>();
const emit = defineEmits(['getTableData']);
const propsData = ref<SearchColumns[]>(props.columns);
let isShowCollapsedRows = ref<boolean>(true);
const onSearchHandle = () => {
    console.log(propsData.value);
    let data = {};
    propsData.value.forEach(search => {
        data[search.key] = search.value;
    })
    emit('getTableData', {...data});
}
watch(
    props,
    (nowProps) => {
        if (nowProps.columns) propsData.value = nowProps.columns;
    },
    { deep: true }
);
</script>
<style lang="scss"></style>
