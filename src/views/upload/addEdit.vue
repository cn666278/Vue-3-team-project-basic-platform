<template>
    <n-form
        ref="formRef"
        :label-width="100"
        label-placement="left"
        require-mark-placement="left"
    >
        <n-form-item label="文件类型">
            <n-select
                v-model:value="formData.eFileType"
                :options="propsData.fileTypeList"
                value-field="id"
                label-field="text"
            />
        </n-form-item>
        <n-form-item label="备注">
            <n-input v-model:value="formData.memo" type="textarea" />
        </n-form-item>
        <n-form-item label="上传附件">
            <n-upload v-model:file-list="fileList" multiple>
                <n-button>选取文件</n-button>
            </n-upload>
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <n-space justify="end">
                    <slot
                        name="submit"
                        :formData="formData"
                        :validate="formRef?.validate"
                        :fileList="fileList"
                    ></slot>
                </n-space>
            </n-col>
        </n-row>
    </n-form>
</template>
<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import type { FormRules, FormInst, UploadFileInfo } from "naive-ui";
interface Props {
    fileTypeList?: login.enumType[];
}
const props = defineProps<Props>();
const propsData = ref<Props>({});
let formRef: Ref<FormInst | null> = ref(null);
let formData: Ref<updateFile.uploadFilesRequest> = ref({});
let fileList = ref<UploadFileInfo[]>([]);
// const handleFileChange = (data: {fileList: UploadFileInfo[]}) => {
//     let files:File[] = data.fileList.map(itemFile => itemFile.file as File);
//     formData.value.files = files;
// }
watch(
    () => props,
    (nowProps) => {
        propsData.value = nowProps;
    },
    { deep: true }
);
</script>
<style lang="scss" scoped></style>
