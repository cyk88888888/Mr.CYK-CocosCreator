import { _decorator } from "cc";
import { XiaoXiaoLeStartLayer } from "./XiaoXiaoLeStartLayer";
import { UIScene } from "../../../../extensions/cocos-framework/src/ui/UIScene";
import { SoundMgr } from "../../../../extensions/cocos-framework/src/mgr/SoundMgr";
import { registerModule } from "../../../../extensions/cocos-framework/src/mgr/ModuleMgr";
const { ccclass, property } = _decorator;
/** 
 * @Descripttion 消消乐场景
 * @Author CYK
 * @Date 2022-05-16 09:18:45
 */
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