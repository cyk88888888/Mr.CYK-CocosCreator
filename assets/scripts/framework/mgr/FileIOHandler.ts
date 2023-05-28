
import { sys } from "cc";
import { BaseEnum } from "../base/BaseEnum";
/*
 * @Descripttion: 文件IO操作管理器
 * @Author: CYK
 * @Date: 2022-06-28 13:56:20
 * 
 */
export class FileIOHandler {
    private static _inst: FileIOHandler;
    public static get inst() {
        if (!this._inst) {
            this._inst = new FileIOHandler();
        }
        return this._inst;
    }

   

}


