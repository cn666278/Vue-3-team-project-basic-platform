<template>
    <div class="form">
        <div class="form_search">
            <n-form inline size="medium" label-placement="left">
                <n-form-item label="菜单名称">
                    <n-input v-model:value="searchMenuName" />
                </n-form-item>
                <n-form-item>
                    <n-button type="primary" @click="getTableData"
                        >查询</n-button
                    >
                </n-form-item>
            </n-form>
        </div>
        <div class="form_operate">
            <div class="form_operate_btn">
                <n-space>
                    <n-button type="primary">新增</n-button>
                    <n-button type="info">编辑</n-button>
                </n-space>
            </div>
            <div class="from_operate_static_btn"></div>
        </div>
        <div class="form_table">
            <n-data-table
                remote
                striped
                :data="menuDataList"
                :row-key="rowKey"
                :columns="columns"
                :pagination="page"
                :expanded-row-keys="expendKeys"
                @update-expanded-row-keys="expendKeysHandle"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { getMenusList } from "@/api/setting";
import { transformTozTreeFormat } from "@/utils/common";
import {
    NTag,
    DataTableColumn,
    DataTableRowKey,
    PaginationProps,
} from "naive-ui";
import { h, Ref, ref } from "vue";
let searchMenuName: Ref<string> = ref("");
let tableCurrentPage: Ref<number> = ref(1);
let tablePageSize: Ref<number> = ref(100);
const test: any | never[] = [];
const Data = (
    await getMenusList({
        title: searchMenuName.value,
        currentPage: tableCurrentPage.value,
        pageSize: tablePageSize.value,
    })
).Data;
const loading: Ref<boolean> = ref(false);
const menuData: Ref<defaultType.responseList<admin.menuList[]> | undefined> =
    ref(Data);
const menuDataList: Ref<any> = ref(transformTozTreeFormat(Data.data));

/**获取列表数据 */
const getTableData = async () => {
    loading.value = true;
    getMenusList({
        title: searchMenuName.value,
        currentPage: tableCurrentPage.value,
        pageSize: tablePageSize.value,
    })
        .then((res) => {
            menuData.value = res.Data;
            menuDataList.value = transformTozTreeFormat(res.Data.data);
        })
        .finally(() => {
            loading.value = false;
        });
};

/**列表格式 */
const columns: DataTableColumn[] = [
    {
        title: "菜单名称",
        key: "title",
    },
    {
        title: "Url地址",
        key: "url",
    },
    {
        title: "序号",
        key: "sort",
        width: 75,
        align: "center",
    },
    {
        title: "是否启用",
        key: "isEnable",
        align: "center",
        render(row) {
            if (row.isEnable) {
                return h(
                    NTag,
                    {
                        style: {
                            marginRight: "5px",
                        },
                        type: "success",
                    },
                    {
                        default: () => "已启用",
                    }
                );
            } else {
                return h(
                    NTag,
                    {
                        style: {
                            marginRight: "5px",
                        },
                        type: "error",
                    },
                    {
                        default: () => "未启用",
                    }
                );
            }
        },
    },
    {
        title: "需要授权",
        key: "needAuth",
        align: "center",
        render(row) {
            if (row.needAuth) {
                return h(
                    NTag,
                    {
                        style: {
                            marginRight: "5px",
                        },
                        type: "success",
                    },
                    {
                        default: () => "是",
                    }
                );
            } else {
                return h(
                    NTag,
                    {
                        style: {
                            marginRight: "5px",
                        },
                        type: "error",
                    },
                    {
                        default: () => "否",
                    }
                );
            }
        },
    },
];
/**分页数据 */
const page: PaginationProps = {
    itemCount: menuData.value?.totalCount,
    pageCount: menuData.value?.totalPage,
    pageSize: menuData.value?.pageSize,
    pageSizes: [10, 20, 50, 100],
    pageSlot: 5,
    showSizePicker: true,
};
/**行Key设置 */
const rowKey = (row: admin.menuList) => row.id;
const expendKeys: Ref<DataTableRowKey[]> = ref([]);
const expendKeysHandle = (keys: DataTableRowKey[]) => {
    expendKeys.value = keys;
};
</script>
<style lang="scss" scoped>
.form {
    .form_operate {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
    }
    .form_table {
        height: 100%;
    }
}
</style>
