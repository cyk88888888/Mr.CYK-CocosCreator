/*
 * @Descripttion: 说明
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { Button, Node, _decorator } from 'cc';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
import { UILayer } from '../../framework/ui/UILayer';
import List from '../../framework/uiComp/list/List';
const { ccclass, property } = _decorator;

@ccclass('ListTestLayer')
export class ListTestLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/listTest/ListTestLayer';
    @property({type: List})
    private listV: List;
    @property({type: Button})
    private btn_back: Button;
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

    private _tap_btn_back(){
        SceneMgr.inst.pop();
    }
}

