<template>
    <div class="tag_tab" ref="tagNavWrap">
        <div class="tag_nav_wrap" :class="{'tag_nav_wrap_btn': state.scrollable}">
            <span class="tag_nav_prev" :class="{ 'tag_nav_prev_hide': !state.scrollable }" @click="scrollPrev()">
                <n-icon size="16">
                    <left-outlined />
                </n-icon>
            </span>
            <span class="tag_nav_next" :class="{ 'tag_nav_next_hide': !state.scrollable }" @click="scrollNext()">
                <n-icon size="16">
                    <right-outlined />
                </n-icon>
            </span>
            <div class="tag_nav_scroll" ref="tagNavScroll">
                <div
                    class="tag"
                    v-for="(item, index) in app.getTagTabList"
                    :key="index"
                >
                    <n-tag
                        :type="route.name === item.name ? 'primary' : 'default'"
                        @click="onTagTab(item)"
                        @close="tagTabCloseHandle(item.name as string, $event)"
                        @contextmenu="onContextMenu(item, $event)"
                        :closable="app.getTagTabList.length > 1"
                        >{{ item.meta.title }}</n-tag
                    >
                </div>
            </div>
        </div>
        <n-dropdown
            :show="showDropdownRef"
            placement="bottom-start"
            trigger="manual"
            :x="xRef"
            :y="yRef"
            :options="contextMenuOption"
            @clickoutside="onClickOutSide"
            @select="onContextMenuSelect"
        />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from "vue";
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from "vue-router";
import { useAppStore } from "@/store";
import elementResizeDetectorMaker from "element-resize-detector";
import { LeftOutlined, RightOutlined } from '@vicons/antd';
const route = useRoute();
const router = useRouter();
const app = useAppStore();
const showDropdownRef = ref(false);
const xRef = ref(0);
const yRef = ref(0);
const tagNavWrap = ref<any>();
const tagNavScroll = ref<any>();
const contextMenuData = ref<RouteLocationNormalizedLoaded>();
const contextMenuOption = [
    {
        label: "关闭当前",
        key: "closeCurrent",
    },
    {
        label: "关闭其他",
        key: "closeOther",
    },
    // {
    //     label: "关闭全部",
    //     key: "closeAll",
    // },
];
const state = reactive({
    scrollable: false,
});

/**监听路由状态进行增加 */
watch(route, (nowRoute) => {
    if (nowRoute.name != "NotFound404") {
        app.mergeTabRouteList(
            Object.assign({}, JSON.parse(JSON.stringify(nowRoute)))
        );
        updateNavScroll();
    }
});

/**点击tag后路由跳转 */
const onTagTab = (route: RouteLocationNormalizedLoaded) => {
    router.push({ path: route.path });
};

/**右键tag后显示下拉菜单 */
const onContextMenu = (
    route: RouteLocationNormalizedLoaded,
    event: MouseEvent
) => {
    event.preventDefault();
    event.stopPropagation();
    contextMenuData.value = route;
    showDropdownRef.value = false;
    nextTick().then(() => {
        showDropdownRef.value = true;
        xRef.value = event.clientX;
        yRef.value = event.clientY;
    });
};

/**右键tag后选择下拉 */
const onContextMenuSelect = (key: string | number) => {
    if (key === "closeCurrent" && contextMenuData.value) {
        tagTabCloseHandle(contextMenuData.value.name as string);
    } else if (key === "closeOther" && contextMenuData.value) {
        let currentRoute = app.tabRouteList.filter((item) => {
            return contextMenuData.value?.name === item.name;
        });
        app.setTabRouteList(currentRoute);
        router.push({ path: contextMenuData.value.path });
    }
    showDropdownRef.value = false;
    updateNavScroll();
};

/**右键tag后点击其他地方 */
const onClickOutSide = () => {
    showDropdownRef.value = false;
    contextMenuData.value = undefined;
};

/**tag关闭事件 */
const tagTabCloseHandle = (key: string, event?: MouseEvent) => {
    event?.stopPropagation();
    if (app.tabRouteList.length > 1) {
        let currentKey = app.tabRouteList.findIndex((item) => {
            return route.path === item.path;
        });
        app.removeTabRouteList(key);
        let lastRoute = app.tabRouteList[app.tabRouteList.length - 1];
        if (
            currentKey == app.tabRouteList.length ||
            currentKey == app.tabRouteList.length - 1
        ) {
            router.push({ path: lastRoute.path });
        }
    }
    updateNavScroll();
};

/**更新多签页是否处于溢出状态 */
const updateNavScroll = async (autoScroll?: boolean) => {
    await nextTick();
    const containerWidth = tagNavScroll.value.offsetWidth;
    const navWidth = tagNavScroll.value.scrollWidth;
    if (containerWidth < navWidth) {
        state.scrollable = true;
        if (autoScroll) {
        }
    } else {
        state.scrollable = false;
    }
};

/**向左横向滚动 */
const scrollPrev = () => {
    const containerWidth = tagNavScroll.value.offsetWidth;
    const currentScroll = tagNavScroll.value.scrollLeft;

    if(!currentScroll) return;
    const scrollLeft = currentScroll > containerWidth ? currentScroll - containerWidth : 0;
    scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
};

/**向右横向滚动 */
const scrollNext = () => {
    const containerWidth = tagNavScroll.value.offsetWidth;
    const navWidth = tagNavScroll.value.scrollWidth;
    const currentScroll = tagNavScroll.value.scrollLeft;

    if (navWidth - currentScroll <= containerWidth) return;
    const scrollLeft =
        navWidth - currentScroll > containerWidth * 2
            ? currentScroll + containerWidth
            : navWidth - containerWidth;
    scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20);
};

/**横向滚动 */
const scrollTo = (value: number, amplitude: number): any => {
    const currentScroll = tagNavScroll.value.scrollLeft;
    const scrollWidth =
        (amplitude > 0 && currentScroll + amplitude >= value) ||
        (amplitude < 0 && currentScroll + amplitude <= value)
            ? value
            : currentScroll + amplitude;
    tagNavScroll.value && tagNavScroll.value.scrollTo(scrollWidth, 0);
    if(scrollWidth === value) return;
    return window.requestAnimationFrame(() => scrollTo(value, amplitude));
};

/**监听多签页是否溢出 */
const onElementResize = () => {
    let observer = elementResizeDetectorMaker();
    observer.listenTo(tagNavWrap.value, () => updateNavScroll(true));
};

onMounted(() => {
    app.mergeTabRouteList(Object.assign({}, JSON.parse(JSON.stringify(route))));
    onElementResize();
});
</script>
<style lang="scss" scoped>
.tag_tab {
    width: 100%;
    display: flex;
    .tag_nav_wrap {
        min-width: 100%;
        max-width: 100%;
        display: flex;
        box-sizing: border-box;
        position: relative;
        .tag_nav_scroll {
            white-space: nowrap;
            overflow: hidden;
            display: flex;
            .tag {
                padding: 5px;
                &:first-child {
                    padding-left: 0px;
                }
                &:last-child {
                    padding-right: 0px;
                }
                :deep(.n-tag) {
                    cursor: pointer;
                }
            }
        }
        .tag_nav_prev,
        .tag_nav_next {
            width: 32px;
            height: 100%;
            position: absolute;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tag_nav_prev {
            left: 0;
        }
        .tag_nav_next {
            right: 0;
        }
        .tag_nav_prev_hide,
        .tag_nav_next_hide {
            display: none;
        }
    }
    .tag_nav_wrap_btn {
        padding: 0 32px;
        overflow: hidden;
    }
}
</style>
