import { _decorator } from "cc";
import { ChatLayer } from "./ChatLayer";
import { UIScene } from "../../../../extensions/cocos-framework/src/ui/UIScene";
import { registerModule } from "../../../../extensions/cocos-framework/src/mgr/ModuleMgr";
const { ccclass, property } = _decorator;
/** 
 * @Descripttion 聊天列表测试场景类
 * @Author CYK
 * @Date 2023-04-12 23:23:20
 */
@ccclass('ChatScene')
export class ChatScene extends UIScene {
    protected ctor() {
        let self = this;
        self.mainClassLayer = ChatLayer;
        let subLayerMgr = self.subLayerMgr;
        let classList = [];
        for (let i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
        }
    }
}
registerModule(ChatScene, ['ui/chat', 'ui/chatEmoji', ChatLayer.prefabUrl]);