import { _decorator } from 'cc';
import { Layer } from '../../framework/lib/Layer';
import List from '../../framework/uiComp/list/List';
const { ccclass, property } = _decorator;

@ccclass('ListTest')
export class ListTest extends Layer {
    //垂直列表
    @property(List)
    listV: List = null;
    //数据数组（所有List共用）
    data: number[] = [];
    private onEnter() {
        this.data = [];
        for (let n: number = 0; n < 999; n++) {
            this.data.push(n);
        }
        this.listV.numItems = this.data.length;
    }

    update(deltaTime: number) {

    }
}

