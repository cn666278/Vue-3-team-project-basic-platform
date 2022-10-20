<template>
    <div>
        <div v-for="item in configType">
            <n-divider class="config_title" @click="onTitleHandle(item)">
                <h2>{{ item.title }}</h2>
            </n-divider>
            <n-collapse-transition :show="item.title == activeConfig">
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
                                style="width: 100%;"
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
const propsData = Object.assign({}, props.data);
const emits = defineEmits(["onSubmit"]);
let responseData = ref(JSON.parse(JSON.stringify(propsData)));
let isEdit = ref(true);
let activeConfig = ref(props.configType[0].title);
/**点击configTitle事件 */
const onTitleHandle = (item: configType) => {
    if(activeConfig.value == item.title) {
        activeConfig.value = '';
    } else if(activeConfig.value == '') {
        activeConfig.value = item.title;
    } else {
        activeConfig.value = item.title;
    }
};
/**编辑事件 */
const editHandle = () => {
    responseData.value = JSON.parse(JSON.stringify(propsData));
    return (isEdit.value = !isEdit.value);
};
/**保存事件 */
const onSubmit = () => {
    emits("onSubmit", responseData.value);
    editHandle();
};
</script>
<style lang="scss" scoped>
.config_title {
    cursor: pointer;
}
</style>
