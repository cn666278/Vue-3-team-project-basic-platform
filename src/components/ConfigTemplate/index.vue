<template>
    <div>
        <div v-for="item in configType">
            <n-divider>
                <h2>{{ item.title }}</h2>
            </n-divider>
            <n-collapse-transition :show="true">
                <n-form size="medium" :disabled="isEdit">
                    <n-grid :cols="3" :x-gap="20" responsive="self">
                        <n-form-item-gi
                            v-for="paramForm in item.param"
                            :label="paramForm.label"
                            :span="paramForm.span"
                        >
                            <n-input
                                v-model:value="
                                    responseData[paramForm.paramName]
                                "
                                :type="paramForm.rows ? 'textarea' : 'text'"
                                v-if="paramForm.type == 'string'"
                            />
                            <n-input-number
                                v-model:value="
                                    responseData[paramForm.paramName]
                                "
                                v-if="paramForm.type == 'number'"
                                :show-button="false"
                            />
                            <n-switch
                                v-model:value="
                                    responseData[paramForm.paramName]
                                "
                                v-if="paramForm.type == 'boolean'"
                            />
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </n-collapse-transition>
        </div>
        <div class="operate">
            <n-space justify="center" size="small">
                <n-button type="primary" size="large" @click="editHandle">
                    {{ isEdit ? "编辑" : "取消编辑" }}
                </n-button>
                <n-button type="success" size="large" @click="onSubmit"
                    >保存</n-button
                >
            </n-space>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

interface config {
    configType: configType[];
    data: any;
}
interface configType {
    title: string;
    param: configParam[];
}
interface configParam {
    label: string;
    type: "string" | "boolean" | "number";
    paramName: string;
    span: number;
    rows?: number;
}
const props = defineProps<config>();
const emits = defineEmits(["onSubmit"]);
const originData = JSON.parse(JSON.stringify(props.data));
let responseData = ref(Object.assign({}, props.data));
let isEdit = ref(true);
const editHandle = () => {
    console.log(originData);
    responseData.value = originData;
    return (isEdit.value = !isEdit.value);
};
const onSubmit = () => {
    emits("onSubmit", responseData);
    isEdit.value = false;
};
</script>
<style lang="scss"></style>
