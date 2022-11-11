<template>
  <TableListTemplate>
      <!-- <template #operate>
          <n-button text @click="onAddEditModal()">
              <n-icon :size="22">
                  <AppstoreAddOutlined />
              </n-icon>
              新增
          </n-button>
      </template> -->
      <template #search>
          <tableSearch
              :columns="searchColumns"
              @get-table-data="getTableData"
          />
      </template>
      <template #table>
          <BasicTable
              :columns="tableColumn"
              :dataSource="tableData"
              :pagination="false"
              :pageOption="pageOption"
              :actionColumn="actionColumn"
              :scroll-x="1400"
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
// import { AppstoreAddOutlined } from "@vicons/antd";
import { searchColumns, tableColumn, addEditForm } from "./columns";
// getAppCarOrderList
import { 
  getAppCarOrderList, 
  carOrderList, 
  getAppCarOrderInfo, 
  appCarOrderRefund, 
} from "@/api/appManage";

const searchData = ref<carOrderList>();
const tableData = ref<appManage.appCarOrderList[]>();
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
  width: 100,
  fixed: "right",
  align: "center",
  render: (row) => {
      return h(TableAction as any, {
          style: "text",
          actions: [
              {
                label: row.eStatusName == "已支付" ? "退款" : "",
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
const getTableData = async (jsonData?: carOrderList) => {
  if (jsonData) {
      jsonData = Object.assign(jsonData, pageOption.value);
      searchData.value = jsonData;
  }
  const Data = (
      await getAppCarOrderList(jsonData ? jsonData : { ...pageOption.value })
  ).Data;
  // 列表插入序列(序号)
  let sequence = {
    title: '序号',
    key: 'key',
    width: 70,
    render: (_: any, index: number) => {
      return `${ index + 1 + ((pageOption.value.currentPage - 1) * pageOption.value.pageSize)}`
    }
  };
  tableColumn[0] = sequence

  let pageData: PaginationType = {
      currentPage: Data.currentPage,
      pageSize: Data.pageSize,
      totalCount: Data.totalCount,
      totalPage: Data.totalPage,
  };
  pageOption.value = pageData;
  tableData.value = Data.data;
};
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
  if (id) {
      let infoData = (await getAppCarOrderInfo(id)).Data;
      addEditTitle.value = "退款";
      setFieldsValue(infoData);
  } else {
      addEditTitle.value = "新增";
  }
};
// ERROR: Inner error ??
// 设备商品退款
const onAddEditSubmit = (data: appManage.appCarOrderInfo) => {
  if (data.id) {
    appCarOrderRefund(data).then(res => {
    // if(res.State == 1) {
    //     window.$message?.success('编辑成功');
      onSearch();
      onAddEditClose();
    // }
    });
  }
};
const onAddEditClose = () => {
  showAddEdit.value = false;
};
</script>
<style lang="scss"></style>
