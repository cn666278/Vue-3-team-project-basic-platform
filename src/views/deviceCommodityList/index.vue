<template>
  <TableListTemplate>
      <template #operate>
          <n-button text @click="onAddEditModal()">
              <n-icon :size="22">
                  <AppstoreAddOutlined />
              </n-icon>
              新增
          </n-button>
      </template>
      <template #search>
          <tableSearch
              :columns="searchColumns"
              @get-table-data="getTableData"
          />
          <!-- <BasicForm @reset="handleReset">
        </BasicForm> -->
      </template>
      <template #table>
          <BasicTable
              :columns="tableColumn"
              :dataSource="tableData"
              :pagination="false"
              :pageOption="pageOption"
              :actionColumn="actionColumn"
              :scroll-x="1200"
          ></BasicTable>
      </template>
      <template #page>
          <pagination
              :current-page="pageOption?.currentPage"
              :page-size="pageOption?.pageSize"
              :total-count="pageOption?.totalCount"
              :total-page="pageOption?.totalPage"
              @page-change="pageHandle"
              @page-size-change="pageSizeHandle"
          />
      </template>
      <!-- 新增表单 -->
      <template #modal>
          <Dialog
              v-model:showModal="showAddEdit"
              :option="dialogOption"
              width="650px"
              @close="onAddEditClose"
              @confirm="submit()"
          >
              <BasicForm
                  @register="addRegister"
                  @submit="onAddEditSubmit"
              ></BasicForm>
          </Dialog>
      </template>
  </TableListTemplate>
</template>
<script setup lang="ts">
import { ref, h } from "vue";
import {
  TableListTemplate,
  tableSearch,
  PaginationType,
  pagination,
} from "@/components/TableListTemplate";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, useForm } from "@/components/Form";
import { DataTableColumn } from "naive-ui";
import { AppstoreAddOutlined } from "@vicons/antd";
import { searchColumns, tableColumn, addEditForm } from "./columns";
// getDeviceCommodityList
import { 
  getDeviceCommodityList, 
  commodityList, 
  getDeviceCommodityInfo, 
  addDeviceCommodity,
  updateDeviceCommodity 
} from "@/api/appManage";

const searchData = ref<commodityList>();
const tableData = ref<appManage.deviceCommodityList[]>();
const addEditTitle = ref("新增");
const showAddEdit = ref(false);
const dialogOption = ref({
  ConfirmBtnText: "提交",
  title: addEditTitle,
});
const pageOption = ref<PaginationType>({
  currentPage: 1,
  pageSize: 20,
});

/** 操作组件 */ 
const actionColumn: DataTableColumn = {
  title: "操作",
  key: "action",
  width: 150,
  fixed: "right",
  align: "center",
  render: (row) => {
    return h(TableAction as any, {
        style: "text",
        actions: [
            {
              label: "编辑",
              onClick: () => onAddEditModal(row.id as string),
            },
        ],
    });
  },
};
const [addRegister, { setFieldsValue, submit }] = useForm({
  gridProps: { cols: 3 },
  labelWidth: "auto",
  layout: "horizontal",
  showActionButtonGroup: false,
  schemas: addEditForm,
});
/**获取表格数据 */
const getTableData = async (jsonData?: commodityList) => {
  if (jsonData) {
      jsonData = Object.assign(jsonData, pageOption.value);
      searchData.value = jsonData;
  }
  const Data = (
      await getDeviceCommodityList(jsonData ? jsonData : { ...pageOption.value })
  ).Data;
  let pageData: PaginationType = {
      currentPage: Data.currentPage,
      pageSize: Data.pageSize,
      totalCount: Data.totalCount,
      totalPage: Data.totalPage,
  };
  pageOption.value = pageData;
  tableData.value = Data.data;
};
/**搜索重置 */
function handleReset(values: Recordable) {
  Object.keys(searchData).forEach((key) => {
    // 把除了 currentPage 和 pageSize 之外的其他参数设为 undefined
    if (key !== "currentPage" && key !== "pageSize") {
      console.log(key);
      searchData[key] = undefined;
    }
  });
  getTableData();
}
/**搜索列表数据并返回到第一页 */
const onSearch = () => {
  pageOption.value.currentPage = 1;
  getTableData();
};
/**分页页数监听 */
const pageHandle = (page: number) => {
  pageOption.value.currentPage = page;
  getTableData();
};
/**每页页数监听 */
const pageSizeHandle = (pageSize: number) => {
  pageOption.value.pageSize = pageSize;
  onSearch();
};
const onAddEditModal = async (id?: string) => {
  showAddEdit.value = true;
  // 此处逻辑：是否改变名称(id),是则说明是新增了新的商品信息，否则只是编辑当前商品
  if (id) {
      let infoData = (await getDeviceCommodityInfo(id)).Data;
      addEditTitle.value = "编辑";
      setFieldsValue(infoData);
  } else {
      addEditTitle.value = "新增";
  }
};
/**设备商品更新/添加 */ 
const onAddEditSubmit = (data: appManage.deviceCommodityInfo) => {
  // 逻辑同上
  if (data.id) {
    updateDeviceCommodity(data).then(res => {
    // if(res.State == 1) {
    //     window.$message?.success('编辑成功');
      onSearch();
      onAddEditClose();
    // }
    });
  } else {
    addDeviceCommodity(data).then(res => {
      onSearch();
      onAddEditClose();
    });
  }
};
const onAddEditClose = () => {
  showAddEdit.value = false;
};
</script>
<style lang="scss"></style>
