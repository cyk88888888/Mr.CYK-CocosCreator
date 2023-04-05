
/*
 * @Descripttion: 枚举类
 * @Author: CYK
 * @Date: 2023-03-24 23:26:33
 */
export namespace CONST{
    // 甜品的种类
    export enum SweetType {
        EMPTY,
        NORMAL,
        BARRIER,
        ROW_CLEAR,
        COLUM_CLEAR,
        RAINBOWCANDY,
        COUNT
    }

    export enum Cell{
        CELL_WIDTH = 70,
        CELL_HEIGHT = 70,
    }

    export enum CELL_STATUS{
        COMMON = 0,
        CLICK = "click",
        LINE = "line",
        COLUMN = "column",
        WRAP = "wrap",
        BIRD = "bird"
    }
}
