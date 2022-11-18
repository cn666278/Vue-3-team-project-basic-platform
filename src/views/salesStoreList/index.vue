<template>
  <div class="form_operate">
    <n-space justify="end">
      <!-- <n-upload :default-upload="false" :show-file-list="false" :on-change="getChange">
        <n-button text>
          <n-icon :size="22">
              <CloudDownloadOutlined />
          </n-icon>
          导入模板
        </n-button>
      </n-upload> -->
      <n-button text @click="onAddEditModal()">
          <n-icon :size="22">
              <AppstoreAddOutlined />
          </n-icon>
          新增
      </n-button>
      <n-button text @click="getTableData()">
          <n-icon :size="22">
              <ReloadOutlined />
          </n-icon>
          刷新
      </n-button>
    </n-space>
    <n-modal
        v-model:show="showFileEdit"
        preset="card"
        :title="fileEditTitle"
        style="width: 600px"
        size="huge"
        bordered
        auto-focus
        @before-leave="fileClose"
    >
    <!-- appEditVue 是子组件的名字，emit事件应该绑定在这 -->
        <addEditVue :file-type-list="eFileTypeOption" @on-submit="uploadFile">
          <template #submit="slotProps">
              <n-button type="primary" @click="fileEditSubmit"
                  >确定</n-button
              >
              <n-button @click="fileClose">取消</n-button>
          </template>
        </addEditVue>
    </n-modal>
  </div>
  <!-- File upload end -->
  <n-upload 
    action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
    :default-file-list="fileListRef"
    show-download-button
    :show-remove-button="false" 
    @download="handleDownload"
  >
  </n-upload>
  <TableListTemplate>
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
import { ref, h, reactive } from "vue";
import {
  TableListTemplate,
  tableSearch,
  PaginationType,
  pagination,
} from "@/components/TableListTemplate";
import { BasicTable, TableAction } from "@/components/BasicTable";
import { BasicForm, useForm } from "@/components/Form";
import { DataTableColumn, UploadFileInfo, useMessage } from "naive-ui";
import { searchColumns, tableColumn, addEditForm } from "./columns";
// getSalesStoreList
import { 
  getSalesStoreList, 
  storeList, 
  getSalesStoreInfo, 
  addSalesStore,
  updateSalesStore,
  importDeviceForExcel, // 设备下发
} from "@/api/appManage";
import { uploadFiles } from "@/api/upload";
import addEditVue from "./addEdit.vue";
import { AppstoreAddOutlined, ReloadOutlined, CloudDownloadOutlined } from '@vicons/antd';

let eFileTypeOption = ref<login.enumType[]>([]);
let showFileEdit = ref(false);
let fileEditTitle = ref('新增附件');
let storeId = ref("00000000");  // 用于存储店铺id
// let rowInfo = reactive<Recordable>({});  // 储存 row 数据(暂时不用)
let fileInfo = reactive<Recordable>({});

const searchData = ref<storeList>();
const tableData = ref<appManage.salesStoreList[]>();
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
          {
              label: "设备下发",
              onClick: () => fileUpload(row),
          },
        ],
    });
  },
};
/**edit 解构赋值 */
const [ addRegister, { setFieldsValue, submit } ] = useForm({
  gridProps: { cols: 3 },
  labelWidth: "auto",
  layout: "horizontal",
  showActionButtonGroup: false,
  schemas: addEditForm,
});
/**获取表格数据 */
const getTableData = async (jsonData?: storeList) => {
  if (jsonData) {
      jsonData = Object.assign(jsonData, pageOption.value);
      searchData.value = jsonData;
  }
  const Data = (
      await getSalesStoreList(jsonData ? jsonData : { ...pageOption.value })
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
// function handleReset(values: Recordable) {
//   Object.keys(searchData).forEach((key) => {
//     if (key !== "currentPage" && key !== "pageSize") {
//       console.log(key);
//       searchData[key] = undefined;
//     }
//   });
//   getTableData();
// }
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
      let infoData = (await getSalesStoreInfo(id)).Data;
      addEditTitle.value = "编辑";
      setFieldsValue(infoData);
  } else {
      addEditTitle.value = "新增";
  }
};
// 门店信息编辑（更新/添加）
const onAddEditSubmit = (data: appManage.salesStoreInfo) => {
  if (data.id) {
    updateSalesStore(data).then(res => {
      onSearch();
      onAddEditClose();
    });
  } else {
    addSalesStore(data).then(res => {
      onSearch();
      onAddEditClose();
    });
  }
};
const onAddEditClose = () => {
  showAddEdit.value = false;
};

// File template download
const message = useMessage()
const fileListRef = ref<UploadFileInfo[]>([
  {
    id: 'b', // show style
    name: '下载模板',
    status: 'finished',
    url: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
  }
])
const handleDownload = (file: UploadFileInfo) => {
    message.success(`下载成功：${file.name}`)
}
const uploadFile = async (data: any) => {
  // 使用fileInfo来储存子组件传的参数options
  fileInfo = data
};
/**新增File弹窗事件 */
const fileUpload = async (row: any) => {
    storeId.value = row.id // 注意是id 不是 salesStoreIds
    showFileEdit.value = true
};
/**新增或编辑事件 */
const fileEditSubmit = async (row: any) => {
    let data: any = {
      eFileType: 2, // 2:设备导入
    };
    let fileUrlList = await uploadFiles(data, [fileInfo.file.file]);
    console.log(fileUrlList)

    if (fileUrlList.State == 1) {
        importDeviceForExcel({
          fileId: fileUrlList.Data.fileList[0].id, // 附件id
          salesStoreId: storeId.value,  // 门店id
        }).then((res: any) => {
          if (res.State == 1) {
            message.success(`设备下发成功, 成功条数 ${res.Data}`);
          }
        });
    }
};
/**关闭File弹窗事件 */
const fileClose = () => {
    showFileEdit.value = false;
};
</script>
<style lang="scss">
.form_operate {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /* 上边 | 右边 | 下边 | 左边 */
    padding: 30px 10px 0px 0px;
}
</style>
