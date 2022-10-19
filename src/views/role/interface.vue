<template>
  <n-space>
    <slot name="submit" :formData="getInterfaceData"></slot>
  </n-space>
  <div v-for="(item, index) in competenceControllerData" :key="index">
    <n-divider title-placement="left">
      <n-checkbox :checked-value="item" :unchecked-value="index" @update:checked="handleUpdateChecked"> {{ item }} </n-checkbox>
    </n-divider>
    <n-checkbox-group v-model:value="getInterfaceData" @update:value="handleUpdateValue">
      <n-space item-style="display: flex;">
        <n-checkbox v-for="(el, index) in interfaceData[item]" :value="el.id">
          <div>{{ el.actionName }}</div>
          <div>{{ el.name }}</div>
        </n-checkbox>
      </n-space>
    </n-checkbox-group>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref, Ref } from "vue";
// 获取控制器接口
import { getCompetenceControllerList } from "@/api/interfaceLog";
// 获取接口列表
import { getCompetenceList } from "@/api/setting";

// 获取控制器数据
const competenceControllerData = (await getCompetenceControllerList()).Data;
// 接口显示数据
let competenceData = ref<object[]>([]);
// 对应控制器的显示数据
let interfaceData = ref<object>({});
// 选中对应控制器的显示数据
let isInterfaceData = ref<object>({});
// 对应控制器的显示数据
let getInterfaceData = ref<string[]>([]);

let interfaceType = ref<string>("");

// 获取接口数据
const competenceList = () => {
  competenceControllerData.forEach(async (el: any) => {
    competenceData.value = (await getCompetenceList({ name: "", controllerName: el, actionName: "", isCheck: true, currentPage: 1, pageSize: 9999 })).Data.data;
    interfaceData.value[el] = competenceData.value;
  });
};

// 控制器全选
const handleUpdateChecked = (value: string) => {
  competenceControllerData.forEach((el: any, index: number) => {
    if (value == el) {
      interfaceType.value = value;
      isInterfaceData.value[value] = interfaceData.value[value].map((item: any) => item.id);
    } else {
      if (value == (index as unknown as string)) {
        isInterfaceData.value[competenceControllerData[index]] = [];
      }
    }
  });
  get();
};

// 接口单选数据
const handleUpdateValue = (value: (string | number)[]) => {
  getInterfaceData.value = value as string[];
};

// 处理勾选数据
const get = () => {
  let data: string[] = [];
  competenceControllerData.forEach((item: any) => {
    if (isInterfaceData.value[item]) {
      isInterfaceData.value[item].forEach((el: any) => {
        data.push(el);
      });
    }
  });
  getInterfaceData.value = data
};

onMounted(() => {
  competenceList();
});
</script>
<style lang="scss"></style>
