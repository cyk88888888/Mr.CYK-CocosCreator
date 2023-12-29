/*
 * @Descripttion: ui组件测试场景
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator } from "cc";
import { UICompTestLayer } from "./UICompTestLayer";
import { UIScene } from "../../../../extensions/cocos-framework/src/ui/UIScene";
import { registerModule } from "../../../../extensions/cocos-framework/src/mgr/ModuleMgr";
const { ccclass } = _decorator;
@ccclass('UICompTestScene')
export class UICompTestScene extends UIScene {
    protected ctor() {
        let self = this;
        self.mainClassLayer = UICompTestLayer;
        let subLayerMgr = self.subLayerMgr;
        let classList = [];
        for (let i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
        }
    }
}
registerModule(UICompTestScene, [UICompTestLayer.prefabUrl]);