declare namespace role {
    // 搜索的数据
    interface roleData {
        name?: string;
        currentPage?: number;
        pageSize?: number;
    }
    // 得到的数据
    interface roleList {
        id: string;
        name: string;
        roleCode: string;
        isEnable: boolean;
        createDate: string;
    }

    // 分配菜单的数据
    interface roleMenuData {
        roleId: string;
        menuIdList: Array;
    }
    // 分配接口的数据
    interface competenceIdList {
        roleId: string;
        competenceIdList: Array;
    }

}