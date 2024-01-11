/*
 * @Descripttion: 设置界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Component, Node, ProgressBar, Button, Label } from 'cc';
import { BagDlg } from '../../bag/BagDlg';
import { UILayer } from '../../../../../extensions/cocos-framework/src/ui/UILayer';
const { ccclass, property } = _decorator;

@ccclass('SpLayer')
export class SpLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/SpLayer';

    protected onEnter() {
    }


}

