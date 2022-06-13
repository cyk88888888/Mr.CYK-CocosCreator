/*
 * @Descripttion: 主界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Component, Node, ProgressBar } from 'cc';
import { UILayer } from '../../framework/ui/UILayer';
const { ccclass, property } = _decorator;

@ccclass('HomeLayer')
export class HomeLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'home/HomeLayer';
    private onEnter() {

    }

    update(deltaTime: number) {
    }
}

