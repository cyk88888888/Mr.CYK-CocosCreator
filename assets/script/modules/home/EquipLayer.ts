/*
 * @Descripttion: 装备界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Component, Node, ProgressBar, Button, Label } from 'cc';
import { UILayer } from '../../framework/ui/UILayer';
const { ccclass, property } = _decorator;

@ccclass('EquipLayer')
export class EquipLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/EquipLayer';
    private onEnter() {

    }

    update(deltaTime: number) {
    }

}

