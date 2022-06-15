
import { _decorator, Component, Node, Label, Tween, Vec3 } from 'cc';
import { UIMsg } from '../../../framework/ui/UIMsg';
const { ccclass, property } = _decorator;


@ccclass('MessageTip')
export class MessageTip extends UIMsg {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/common/MessageTip';
    @property({ type: Label })
    public lbl_msg: Label;
    private dchg() {
        let self = this;
        let data = self.data;
        self.lbl_msg.string = data.msg;
        new Tween(this.node)
            .to(0.5, { position: new Vec3(0, 60, 0) }, { easing: 'elasticOut' })
            .delay(0.8)
            .removeSelf()
            .start();
    }

}

