import { _decorator, Animation, Component, Node, Sprite, SpriteFrame, UI, UIOpacity, Vec3 } from 'cc';
import { UIComp } from '../../../framework/ui/UIComp';
import { CONST } from '../../base/CONST';
const { ccclass, property } = _decorator;

@ccclass('CellView')
export class CellView extends UIComp {
    @property({ type: SpriteFrame })
    defaultFrame: SpriteFrame;

    isSelect: boolean
    model: any;
    status: CONST.CELL_STATUS;
    protected onEnter() {
        let self = this;
        self.isSelect = false;
    }

    public initWithModel(model) {
        this.model = model;
        let x = model.startX;
        let y = model.startY;
        this.node.setPosition(new Vec3(CONST.CELL_WIDTH * (x - 0.5), CONST.CELL_HEIGHT * (y - 0.5)))
        let animation = this.node.getComponent(Animation);
        if (model.status == CONST.CELL_STATUS.COMMON) {
            animation.stop();
        }
        else {
            animation.play(model.status);
        }
    }

    // 执行移动动作
    public async updateView() {
        let self = this;
        let cmd = this.model.cmd;
        if (cmd.length <= 0) {
            return;
        }
        let actionArray = [];
        let curTime = 0;
        for (let i in cmd) {
            if (cmd[i].playTime > curTime) {
                let delay = new Promise((resolve, reject) => {
                    self.setTimeout(function () {
                        resolve('delay complete!');
                    }, (cmd[i].playTime - curTime) * 1000);
                });
                actionArray.push(delay);
            }
            if (cmd[i].action == "moveTo") {
                let x = (cmd[i].pos.x - 0.5) * CONST.CELL_WIDTH;
                let y = (cmd[i].pos.y - 0.5) * CONST.CELL_HEIGHT;
                let move = new Promise((resolve, reject) => {
                    self.getTween(self.node).to(CONST.ANITIME.TOUCH_MOVE, { position: new Vec3(x, y) }).call(() => {
                        resolve("tween complete!");
                    }).start();
                });
                actionArray.push(move);
            }
            else if (cmd[i].action == "toDie") {
                if (self.status == CONST.CELL_STATUS.BIRD) {
                    let animation = self.node.getComponent(Animation);
                    animation.play("effect");
                    let delay = new Promise((resolve, reject) => {
                        self.setTimeout(function () {
                            this.node.destroy();
                            resolve('delay effect complete!');
                        }, CONST.ANITIME.BOMB_BIRD_DELAY * 1000);
                    });
                    actionArray.push(delay);
                }
            }
            else if (cmd[i].action == "setVisible") {
                let isVisible = cmd[i].isVisible;
                let call = new Promise((resolve, reject) => {
                    self.setTimeout(function () {
                        if (isVisible) {
                            self.node.getComponent(UIOpacity).opacity = 255;
                        }
                        else {
                            self.node.getComponent(UIOpacity).opacity = 0;
                        }
                        resolve('call effect complete!');
                    }, CONST.ANITIME.BOMB_BIRD_DELAY * 1000);
                });
                actionArray.push(call);
            }
            else if (cmd[i].action == "toShake") {
                let rotate = new Promise((resolve, reject) => {
                    self.getTween(self.node).to(0.06, { eulerAngles: new Vec3(0, 0, 30) }).to(0.12, { eulerAngles: new Vec3(0, 0, -60) }).union().repeat(2).call(() => {
                        resolve("rotate complete!");
                    })
                });
                actionArray.push(rotate);
            }
            curTime = cmd[i].playTime + cmd[i].keepTime;
        }

        for (let i = 0; i < actionArray.length; i++) {
            await actionArray[i];
        }
    }
    public setSelect(flag: boolean) {
        let animation = this.node.getComponent(Animation);
        let bg = this.node.getChildByName("select");
        if (flag == false && this.isSelect && this.model.status == CONST.CELL_STATUS.COMMON) {
            animation.stop();
            this.node.getComponent(Sprite).spriteFrame = this.defaultFrame;
        }
        else if (flag && this.model.status == CONST.CELL_STATUS.COMMON) {
            animation.play(CONST.CELL_STATUS.CLICK);
        }
        else if (flag && this.model.status == CONST.CELL_STATUS.BIRD) {
            animation.play(CONST.CELL_STATUS.CLICK);
        }
        bg.active = flag;
        this.isSelect = flag;
    }
}

