/*
 * @Descripttion: 主界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { Label, Node, _decorator } from 'cc';
import { UIMenu } from '../../framework/ui/UIMenu';
const { ccclass, property } = _decorator;

@ccclass('BottomTabLayer')
export class BottomTabLayer extends UIMenu {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/BottomTabLayer';
    @property({type: Node, tooltip:'哈哈哈'})
    private grp_head: Node;
    @property({ type: Label })
    private lbl_name: Label;
    private onEnter() {

    }

    update(deltaTime: number) {
    }
}

