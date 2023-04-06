/*
 * @Descripttion: 主界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Button } from 'cc';
import { UILayer } from '../../framework/ui/UILayer';
const { ccclass, property } = _decorator;

@ccclass('HomeLayer')
export class HomeLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/HomeLayer';
    protected onEnter() {
        let task3 = new Promise(function (resolve, reject) {
            console.warn(3);
            resolve('3')

        });

        let task1 = new Promise(function (resolve, reject) {
            self.setTimeout(() => {
                console.warn(1);
                resolve('1')
            }, 3000);
        });
        let task2 = new Promise(function (resolve, reject) {
            self.setTimeout(() => {
                console.warn(2);
                resolve('2')
            }, 2000);
        });

        Promise.all([task1, task2, task3]).then(function (value) {
            // console.warn(value);
        });
    }

}

