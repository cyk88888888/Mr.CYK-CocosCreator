/*
 * @Descripttion: 主界面场景
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator } from 'cc';
import { UIScene } from '../../framework/ui/UIScene';
import { HomeLayer } from './HomeLayer';
import { registerModule } from '../../framework/mgr/ModuleMgr';
import { TopUsrInfoLayer } from './TopUsrInfoLayer';
import { UILayer } from '../../framework/ui/UILayer';
import { UIMenu } from '../../framework/ui/UIMenu';
import { BottomTabLayer } from './BottomTabLayer';
const { ccclass, property } = _decorator;

@ccclass('HomeScene')
export class HomeScene extends UIScene {
    private _topUsrInfo: any;
    private _bottomTab: any;
    private ctor() {
        let self = this;
        self.mainClassLayer = HomeLayer;
        let subLayerMgr = self.subLayerMgr;
        let classList = [];
        for (let i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
        }
    }

    private async onEnter() {
        let self = this;
        if(!self._topUsrInfo) self._topUsrInfo = TopUsrInfoLayer.show();
        if(!self._bottomTab) self._bottomTab = BottomTabLayer.show();
    }
}
registerModule(HomeScene, []);
