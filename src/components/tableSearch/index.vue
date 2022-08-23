<template>
    <n-form size="medium" label-placement="left">
        <n-grid :cols="propsData.length + 1" :collapsed-rows="2" :collapsed="isShowCollapsedRows" :x-gap="10">
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
            <n-form-item-gi>
                <n-button type="primary">查询</n-button>
                <n-switch v-model:value="isShowCollapsedRows"></n-switch>
            </n-form-item-gi>
        </n-grid>
    </n-form>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import type { SearchColumns } from "./index";
const props = defineProps({
    columns: {
        type: Array as () => SearchColumns[],
        required: true,
        default: () => [],
    }
});
const propsData = ref<SearchColumns[]>(props.columns);
let isShowCollapsedRows = ref<boolean>(false);
watch(
    props,
    (nowProps) => {
        if(nowProps.columns) propsData.value = nowProps.columns;
    },
    { deep: true }
);
</script>
<style lang="scss"></style>
