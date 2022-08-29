export interface PaginationType {
    /**总条数 */
    totalCount?: number;
    /**总页数 */
    totalPage?: number;
    /**当前页数 */
    currentPage: number;
    /**每页页数 */
    pageSize: number;
}