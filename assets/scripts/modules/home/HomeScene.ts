/*
 * @Descripttion: 主界面场景
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator } from 'cc';
import { HomeLayer } from './HomeLayer';
import { TopUsrInfoLayer } from './TopUsrInfoLayer';
import { BottomTabLayer } from './BottomTabLayer';
import { EntranceLayer } from './entrance/EntranceLayer';
import { SweetLayer } from './sweet/SweetLayer';
import { VideoLayer } from './video/VideoLayer';
import { SpLayer } from './sp/SpLayer';
import { UIScene } from '../../../../extensions/cocos-framework/src/ui/UIScene';
import { SoundMgr } from '../../../../extensions/cocos-framework/src/mgr/SoundMgr';
import { registerModule } from '../../../../extensions/cocos-framework/src/mgr/ModuleMgr';
const { ccclass, property } = _decorator;

@ccclass('HomeScene')
export class HomeScene extends UIScene {
    private _topUsrInfo: any;
    private _bottomTab: any;
    protected ctor() {
        let self = this;
        self.mainClassLayer = HomeLayer;
        let subLayerMgr = self.subLayerMgr;
        let classList = [SpLayer, EntranceLayer, SweetLayer, VideoLayer];
        for (let i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
        }
    }

    protected async onEnter() {
        let self = this;
        SoundMgr.inst.bgVolume = 0.2;
        SoundMgr.inst.playMainBg();
        self.onEmitter('jumpToLayer', self.jumpToLayer);
        if (!self._topUsrInfo) self._topUsrInfo = await TopUsrInfoLayer.show();
        if (!self._bottomTab) self._bottomTab = await BottomTabLayer.show();
    }

    private jumpToLayer(data: any) {
        let self = this;
        if (!data) {
            console.error('跳转数据为null');
            return;
        }
        self.run(data.layerName);
    }

    protected onExit() {
        
    }
}
registerModule(HomeScene, ['ui/home']);
