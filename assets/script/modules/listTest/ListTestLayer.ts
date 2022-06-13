/*
 * @Descripttion: 说明
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { _decorator } from 'cc';
import { UILayer } from '../../framework/ui/UILayer';
import List from '../../framework/uiComp/list/List';
const { ccclass, property } = _decorator;

@ccclass('ListTestLayer')
export class ListTestLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'listTest/ListTestLayer';
    private listV: List;
    //数据数组（所有List共用）
    data: number[] = [];
    private onEnter() {
        this.data = [];
        for (let n: number = 0; n < 999; n++) {
            this.data.push(n);
        }
        this.listV = this.node.getChildByName('ScrollView').getComponent(List);
        this.listV.numItems = this.data.length;
    }

    update(deltaTime: number) {
    }
}

