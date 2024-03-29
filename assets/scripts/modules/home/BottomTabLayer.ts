import { Node, _decorator } from 'cc';
import { EntranceLayer } from './entrance/EntranceLayer';
import { HomeLayer } from './HomeLayer';
import { SweetLayer } from './sweet/SweetLayer';
import { VideoLayer } from './video/VideoLayer';
import { SpLayer } from './sp/SpLayer';
import { UIMenu } from '../../../../extensions/cocos-framework/src/ui/UIMenu';
import { List } from '../../../../extensions/cocos-framework/src/uiComp/List';
import { ResMgr } from '../../../../extensions/cocos-framework/src/mgr/ResMgr';
const { ccclass, property } = _decorator;
/** 
 * @Descripttion 主界面底部选中页签
 * @Author CYK
 * @Date 2022-05-16 09:18:45
 */
@ccclass('BottomTabLayer')
export class BottomTabLayer extends UIMenu {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/BottomTabLayer';
    @property({type: List})
    private list_tab: List = null;

    private _layerInfos: any[];
    private _toLayer: string;
    protected onEnter() {
        let self = this;
        self._layerInfos = [
            { layer: SweetLayer.__className, icon: 'dy/xiaoxiaole/sweets/Blue', preRes: [SweetLayer.prefabUrl] },
            { layer: EntranceLayer.__className, icon: 'dy/xiaoxiaole/sweets/Red', preRes: [EntranceLayer.prefabUrl] },
            { layer: HomeLayer.__className, icon: 'dy/xiaoxiaole/sweets/Colors', preRes: [HomeLayer.prefabUrl] },
            { layer: VideoLayer.__className, icon: 'dy/xiaoxiaole/sweets/Green', preRes: [VideoLayer.prefabUrl] },
            { layer: SpLayer.__className, icon: 'dy/xiaoxiaole/sweets/Purple', preRes: [SpLayer.prefabUrl] },
        ];
    }

    protected onFirstEnter() {
        let self = this;
        self.list_tab.selectedId = 2;
    }

    private _data_list_tab(){
        let self = this;
        return self._layerInfos;
    }

    private _select_list_tab(tabData:any, selectedIdx: number,lastSelectedIdx: number){
        let self = this;
        let layerName = tabData.layer;
        self._toLayer = layerName;
        ResMgr.inst.loadWithoutJuHua(tabData.preRes, () => {
            if (self._toLayer != layerName) return;
            self.emit('jumpToLayer', { layerName: layerName });
        });
    }
}

