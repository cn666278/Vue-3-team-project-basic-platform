<template>
    <n-pagination
        show-size-picker
        :page="pageProps.currentPage"
        :page-count="pageProps.simple ? undefined : pageProps.totalPage"
        :page-size="pageProps.pageSize"
        :page-sizes="[1,10,20,50,100]"
        :item-count="pageProps.simple ? pageProps.totalCount : undefined"
        :simple="pageProps.simple"
        v-bind="attrs"
        @update-page="pageHandle"
        @update-page-size="pageSizeHandle"
    >
        <template #prefix>
            共{{pageProps.totalCount}}条
        </template>
    </n-pagination>
</template>
<script setup lang="ts">
import { ref, useAttrs, watch } from "vue";
interface PaginationType {
    totalCount?: number;
    totalPage?: number;
    currentPage?: number;
    pageSize?: number;
    simple?: boolean;
}
const props = defineProps<PaginationType>();
const emits = defineEmits(['pageChange', 'pageSizeChange']);
const pageProps = ref<PaginationType>(props);
const attrs = useAttrs();
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
