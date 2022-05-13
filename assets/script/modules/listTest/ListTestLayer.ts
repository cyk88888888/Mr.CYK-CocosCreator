import { _decorator } from 'cc';
import { UILayer } from '../../framework/lib/UILayer';
import List from '../../framework/uiComp/list/List';
const { ccclass, property } = _decorator;

@ccclass('ListTestLayer')
export class ListTestLayer extends UILayer {
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

