/*
 * @Descripttion: 消消乐场景
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator } from "cc";
import { UIScene } from "../../framework/ui/UIScene";
import { registerModule } from "../../framework/mgr/ModuleMgr";
import { XiaoXiaoLeLayer } from "./XiaoXiaoLeLayer";
import { SoundMgr } from "../../framework/mgr/SoundMgr";
const { ccclass, property } = _decorator;
@ccclass('XiaoXiaoLeScene')
export class XiaoXiaoLeScene extends UIScene {
    private ctor() {
        let self = this;
        self.mainClassLayer = XiaoXiaoLeLayer;
        let subLayerMgr = self.subLayerMgr;
        let classList = [];
        for (let i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
        }
    }
    private onEnter(): void {
        SoundMgr.inst.playBg('dy/sound/xiaoxiaole/worldscenebgm');
    }
}
registerModule(XiaoXiaoLeScene, [XiaoXiaoLeLayer.prefabUrl]);