import { _decorator, Component, Node, ProgressBar, Button, Label } from 'cc';
import { UILayer } from '../../../../../extensions/cocos-framework/src/ui/UILayer';
const { ccclass, property } = _decorator;
/** 
 * @Descripttion 序列帧动画测试界面
 * @Author CYK
 * @Date 2022-05-16 09:18:45
 */
@ccclass('SpLayer')
export class SpLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/SpLayer';

    protected onEnter() {
    }


}

