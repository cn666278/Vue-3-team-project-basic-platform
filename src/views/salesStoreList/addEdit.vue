<template>
    <n-form 
        ref="formRef" 
        :label-width="100" 
        label-placement="left" 
        require-mark-placement="left"
    >
        <n-form-item label="备注">
            <n-input v-model:value="formData.memo" type="textarea" />
        </n-form-item>
        <n-form-item label="上传附件">
            <n-upload @change="onSubmit">
                <n-button>设备下发</n-button>
            </n-upload>
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <n-space justify="end">
                <slot name="submit" 
                    :formData="formData" 
                    :validate="formRef?.validate" 
                    :fileList="fileList">
                </slot>
                </n-space>
            </n-col>
        </n-row>
    </n-form>
</template>
<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import type { FormInst, UploadFileInfo } from "naive-ui";
interface Props {
    fileTypeList?: login.enumType[];
}
const props = defineProps<Props>();
const propsData = ref<Props>({});
const emits = defineEmits(["onSubmit"]); // 用于子组件addEdit.vue 给父组件 index.vue传参

let formRef: Ref<FormInst | null> = ref(null);
let formData: Ref<updateFile.uploadFilesRequest> = ref({});
let fileList = ref<UploadFileInfo[]>([]);
// 文件提交事件 from: https://www.naiveui.com/zh-CN/light/components/upload#Upload-Props
let onSubmit = (options: { file: UploadFileInfo, fileList: Array<UploadFileInfo>, event?: Event }) => {
    console.log(options);
    emits("onSubmit", options);
};
watch(
    () => props,
    (nowProps) => {
        propsData.value = nowProps;
    },
    { deep: true }
);
</script>
<style lang="scss" scoped>

</style>
