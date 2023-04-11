/*
 * @Descripttion: 首页场景
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator } from 'cc';
import { UIScene } from '../../framework/ui/UIScene';
import { registerModule } from '../../framework/mgr/ModuleMgr';
import { IndexLayer } from './IndexLayer';
const { ccclass, property } = _decorator;

@ccclass('IndexScene')
export class IndexScene extends UIScene {
    protected ctor() {
        let self = this;
        self.mainClassLayer = IndexLayer;
        let subLayerMgr = self.subLayerMgr;
        let classList = []; 
        for (let i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
        }
    }

    protected onEnter() {

    }
}
registerModule(IndexScene, ['dy/sp/pet']);
