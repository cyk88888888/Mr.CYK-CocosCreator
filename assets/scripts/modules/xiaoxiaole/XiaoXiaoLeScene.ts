/*
 * @Descripttion: 消消乐场景
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator } from "cc";
import { UIScene } from "../../framework/ui/UIScene";
import { registerModule } from "../../framework/mgr/ModuleMgr";
import { XiaoXiaoLeStartLayer } from "./XiaoXiaoLeStartLayer";
import { SoundMgr } from "../../framework/mgr/SoundMgr";
const { ccclass, property } = _decorator;
@ccclass('XiaoXiaoLeScene')
export class XiaoXiaoLeScene extends UIScene {
    protected ctor() {
        let self = this;
        self.mainClassLayer = XiaoXiaoLeStartLayer;
        let subLayerMgr = self.subLayerMgr;
        let classList = [];
        for (let i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
        }
    }

    protected onEnter(): void {
        SoundMgr.inst.bgVolume = 1;
    }
}
registerModule(XiaoXiaoLeScene, [
    XiaoXiaoLeStartLayer.prefabUrl,
]);