<template>
    <n-data-table
        v-bind="attrs"
        :columns="propsData.columns"
        :data="propsData.data"
    />
</template>
<script setup lang="ts">
import { ref, useAttrs } from "vue";
import { NButton, NTag, DataTableColumn } from "naive-ui";
const attrs = useAttrs();
interface formTableProps {
    columns: DataTableColumn[];
    data: any[];
}
const props = defineProps<formTableProps>();
const propsData = ref<formTableProps>(props);
</script>
<style lang="scss"></style>
