<template>
    <n-form ref="formRef" :model="formData" :rules="rules" :label-width="100" label-placement="left" require-mark-placement="left">
        <n-form-item label="职位名称" path="name">
            <n-input v-model:value="formData.name" />
        </n-form-item>
        <n-form-item label="排序" path="sort">
            <n-input-number v-model:value="formData.sort" />
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <n-space justify="end">
                    <slot name="submit" :formData="formData" :validate="formRef?.validate"></slot>
                </n-space>
            </n-col>
        </n-row>
    </n-form>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue';
import type { FormRules, FormInst, TreeSelectOption } from 'naive-ui';
interface form {
    formInfo?: Ref<industryFormData>;
    memberTreeData: TreeSelectOption[];
}
interface industryFormData {
    id?: string,
    name?: string,
    sort?: number,
}

let formData: Ref<industryFormData> = ref({});
let formRef: Ref<FormInst | null> = ref(null);

const rules: FormRules = {
    name: {
        required: true,
        message: '请输入职位名称',
        trigger: 'blur',
    },
};

let props = defineProps<form>();
if (props.formInfo) {
    formData.value = props.formInfo as industryFormData;
}
watch(
    () => props,
    (nowProps) => {
        formData.value = nowProps.formInfo as industryFormData;
    },
    { deep: true }
);
</script>
<style lang="scss" scoped></style>
