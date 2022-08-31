<template>
    <n-pagination
        show-size-picker
        :page="pageProps.currentPage"
        :page-count="pageProps.totalPage"
        :page-size="pageProps.pageSize"
        :page-sizes="[1,10,20,50,100]"
        @update-page="pageHandle"
        @update-page-size="pageSizeHandle"
    >
        <template #prefix>
            共{{pageProps.totalCount}}条
        </template>
    </n-pagination>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
interface PaginationType {
    totalCount?: number;
    totalPage?: number;
    currentPage?: number;
    pageSize?: number;
}
const props = defineProps<PaginationType>();
const emits = defineEmits(['pageChange', 'pageSizeChange']);
const pageProps = ref<PaginationType>(props);
const pageHandle = (page: number) => {
    emits('pageChange', page);
}
const pageSizeHandle = (pageSize: number) => {
    pageProps.value.currentPage = 1;
    emits('pageSizeChange', pageSize);
}
watch(
    props,
    (nowProps) => {
        pageProps.value = nowProps;
    },
    { deep: true }
);
</script>
<style lang="scss"></style>
