<template>
    <div class="form">
        <div class="form_operate">
            <!-- <n-space justify="end">
                <slot name="operate">
                    <n-button text>
                        <n-icon :size="22">
                            <AppstoreAddOutlined />
                        </n-icon>
                        新增菜单
                    </n-button>
                    <n-button text>
                        <n-icon :size="22">
                            <ReloadOutlined />
                        </n-icon>
                        刷新
                    </n-button>
                </slot>
            </n-space> -->
        </div>
        <n-divider style="margin: 10px 0" />
        <div class="form_search">
            
            <!-- <n-form size="medium" label-placement="left">
                <n-grid :cols="search.length + 1" :collapsed-rows="2" :x-gap="10">
                    <n-form-item-gi
                        v-for="(searchItem, index) in search"
                        :label="searchItem.label"
                        :key="index"
                    >
                        <n-input
                            v-model:value="searchItem.value"
                            v-if="searchItem.type == 'input'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi>
                        <n-button type="primary" @click="getTableData">查询</n-button>
                    </n-form-item-gi>
                </n-grid>
            </n-form> -->
        </div>
        <div class="form_table">
            <!-- <n-data-table
                :loading="loading"
                :data="tableData"
                :columns="tableColumnsFormat(columns)"
            /> -->
        </div>
        <div class="form_page" v-if="propsData.pageOption">
            <page
                :current-page="propsData.pageOption.currentPage"
                :page-size="propsData.pageOption.pageSize"
                :total-page="propsData.pageOption.totalPage"
                :total-count="propsData.pageOption.totalCount" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, h, watch, onMounted } from "vue";
import type { PaginationType } from '@/components/pagination/index';
import type { SearchColumns } from '@/components/tableSearch/index';
import page from '@/components/pagination/index.vue';
import tableSearch from '@/components/tableSearch/index.vue';

interface Props {
    searchOption?: SearchColumns[],
    pageOption?: PaginationType;
}
const props = defineProps<Props>()
const propsData = ref<Props>(props);

// import { ref, h, watch, onMounted } from "vue";
// import { NTag, NButton, DataTableColumn, PaginationProps } from "naive-ui";
// import { AppstoreAddOutlined, ReloadOutlined } from "@vicons/antd";
// import type { formSearch, formTableColumns } from "./index";
// // import type { PaginationType } from '@/components/pagination/index';
// import page from '@/components/pagination/index.vue';
// /**默认props */
// interface Props {
//     formSearch?: formSearch[];
//     formTableColumns?: formTableColumns[],
//     getTableData?: Function,
// }
// const props = defineProps<Props>();
// // const emit = defineEmits(['getTableData']);
// /**搜索字段 */
// let search = ref<formSearch[]>([]);
// /**表格数据 */
// let tableData = ref([]);
// /**表格显示格式 */
// let columns = ref<formTableColumns[]>([]);
// let loading = ref<boolean>(false);
// let page = ref<PaginationProps>({
//     pageCount: 60,
// });
// const tableColumnsFormat = (columns: formTableColumns[]) => {
//     return columns.map((item: formTableColumns) => {
//         return {
//             title: item.title,
//             key: item.key,
//             render: item.type ? (row: any) => {
//                 switch (item.type) {
//                     case "tag":
//                         return h(
//                             NTag,
//                             {
//                                 style: {
//                                     marginRight: "5px",
//                                 },
//                                 type: row[item.key] ? "success" : "error",
//                             },
//                             {
//                                 default: () =>
//                                     row[item.key]
//                                         ? item.tagSuccessValue
//                                         : item.tagErrorValue,
//                             }
//                         );
//                     case "button":
//                         return h(NButton, {
//                             type: 'info',
//                             dashed: true,
//                             size: "small",
//                             onClick: () => item.onClick ? item.onClick(row) : undefined,
//                         },{default: () => item.value});
//                     default:
//                         return h('span', {}, {default: () => item.value})
//                 }
//             } : undefined,
//         };
//     }) as unknown as DataTableColumn[];
// };
// if (props.formSearch) {
//     search.value = props.formSearch;
// }
// if(props.formTableColumns) {
//     columns.value = props.formTableColumns;
// }
// /**获取表格数据 */
// const getTableData = async () => {
//     if(props.getTableData) {
//         loading.value = true;
//         let jsonData:{
//             [key: string] : any
//         } = {};
//         search.value.map(searchItem => {
//             jsonData[searchItem.key] = searchItem.value;
//         });
//         jsonData['currentPage'] = 1;
//         jsonData['pageSize'] = 20;
//         const Data = await props.getTableData(jsonData);
//         tableData.value = Data.data;
//         page.value = {
//             // itemCount: Data.totalCount,
//             pageCount: 60,
//         }
//         loading.value = false;
//     }
// }
// getTableData();
// watch(
//     () => props,
//     (nowProps) => {
//         console.log(nowProps);
//     },
//     {deep: true},
// )
// onMounted(() => {
//     emit('getTableData',)
// });
</script>
<style lang="scss" scoped>
.form {
    .form_operate {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 5px 0;
    }
    .form_table {
        height: 100%;
    }
    .form_page {
        display: flex;

    }
}
</style>
