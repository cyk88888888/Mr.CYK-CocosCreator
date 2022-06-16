/*
 * @Descripttion: 弹窗层级基类
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { _decorator, Component, Node, Color, Graphics, Vec3 } from 'cc';
import { BaseUT } from '../base/BaseUtil';
import { SceneMgr } from '../mgr/SceneMgr';
import { UILayer } from './UILayer';
const { ccclass, property } = _decorator;

@ccclass('UIDlg')
export class UIDlg extends UILayer {
    private _bgMaskNode: Node;
    protected addToLayer() {
        let self = this;
        let bgMaskNode = self._bgMaskNode = BaseUT.newUINode(self.dlgMaskName);
        let bg = bgMaskNode.addComponent(Graphics);
        let stageSize = BaseUT.getStageSize();
        let modalLayerColor: Color = new Color(0x00, 0x00, 0x00, 255 * 0.4);
        bg.fillColor = modalLayerColor;//.fromHEX('#000000');
        bg.rect(-stageSize.width / 2, -stageSize.height / 2, stageSize.width, stageSize.height);
        bg.fill();
        // BaseUT.setAlpha(bgMaskNode, 0.4);
        BaseUT.setSize(bgMaskNode, stageSize.width, stageSize.height);
        bgMaskNode.on(Node.EventType.TOUCH_END, self.close, self);
        bgMaskNode.setParent(SceneMgr.inst.curScene.dlg);

        BaseUT.setPivot(self.node, 0.5, 0.5);
        self.node.setParent(SceneMgr.inst.curScene.dlg);

        self.onOpenAnimation();
    }

    private resetParent() {
        let self = this;
        self._bgMaskNode.removeFromParent();
        self.node.insertChild(self._bgMaskNode, 0);
    }

    protected onOpenAnimation() {
        let self = this;
        self.getTween(this.node)
            .to(0.1, { scale: new Vec3(1.1, 1.1, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) }) // 缩放缓动
            .call(() => {
                self.resetParent();
            })
            .start()
    }

    protected onCloseAnimation(cb: Function) {
        cb.call(this);
    }

}

