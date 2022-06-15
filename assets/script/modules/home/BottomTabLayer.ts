/*
 * @Descripttion: 主界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { Label, Node, _decorator } from 'cc';
import { UIMenu } from '../../framework/ui/UIMenu';
import List from '../../framework/uiComp/list/List';
import ListItem from '../../framework/uiComp/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('BottomTabLayer')
export class BottomTabLayer extends UIMenu {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/BottomTabLayer';
    @property(List)
    private list_tab: List = null;

    private _layerInfos: any[];
    private onEnter() {
        let self = this;
        self._layerInfos = [
            { layer: 'EquipLayer' },
            { layer: 'ShopLayer' },
            { layer: 'HomeLayer' },
            { layer: 'SkillLayer' },
            { layer: 'SettingLayer' },
        ];
      
    }

    private onFirstEnter() {
        let self = this;
        this.list_tab.numItems = self._layerInfos.length;
        this.list_tab.selectedId = 2;
    }

    //水平列表渲染器
    onListHRender(item: Node, idx: number) {
        console.log(item.name + ': ' + idx);
    }

    //当列表项被选择...
    onListSelected(item: Node, selectedIdx: number, lastSelectedIdx: number, val: number) {
        let self = this;
        let layerInfo = self._layerInfos[selectedIdx];
        let layerName = layerInfo.layer;
        self.emit('jumpToLayer', { layerName: layerName });
    }
}

