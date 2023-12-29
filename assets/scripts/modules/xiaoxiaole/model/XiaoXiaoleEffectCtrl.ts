import { _decorator, Animation, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { AudioUtils } from '../util/AudioUtils';
import { CONST } from '../../base/CONST';
import { UIComp } from '../../../../../extensions/cocos-framework/src/ui/UIComp';
const { ccclass, property } = _decorator;
/*
 * @Descripttion: 消消乐特效处理脚本
 * @Author: CYK
 * @Date: 2023-04-1 09:18:45
 */
@ccclass('XiaoXiaoleEffectCtrl')
export class XiaoXiaoleEffectCtrl extends UIComp {
    @property({ type: Prefab })
    bombWhite: Prefab;
    @property({ type: Prefab })
    crushEffect: Prefab;
    @property({ type: AudioUtils })
    audioUtils: AudioUtils;

    public playEffects(effectQueue: any[]) {
        let self = this;
        if (!effectQueue || effectQueue.length <= 0) {
            return;
        }
        let soundMap = {}; //某一时刻，某一种声音是否播放过的标记，防止重复播放
        effectQueue.forEach((cmd) => {
            let delayTime = self.getTween(self.node).delay(cmd.playTime);
            let callFunc = self.getTween(self.node).call(() => {
                let instantEffect: Node = null;
                let animation: Animation = null;
                if (cmd.action == "crush") {
                    instantEffect = instantiate(self.crushEffect);
                    instantEffect.setParent(self.node);//一定要先设置parent，不然节点挂载的组件不会初始化
                    animation = instantEffect.getComponent(Animation);
                    animation.play("effect");
                    !soundMap["crush" + cmd.playTime] && self.audioUtils.playEliminate(cmd.step);
                    soundMap["crush" + cmd.playTime] = true;
                }
                else if (cmd.action == "rowBomb") { 
                    instantEffect = instantiate(self.bombWhite);
                    instantEffect.setParent(self.node);
                    animation = instantEffect.getComponent(Animation);
                    animation.play("effect_line");
                }
                else if (cmd.action == "colBomb") {
                    instantEffect = instantiate(self.bombWhite);
                    instantEffect.setParent(self.node);
                    animation = instantEffect.getComponent(Animation);
                    animation.play("effect_col");
                }
                instantEffect.setPosition(new Vec3(CONST.CELL_WIDTH * (cmd.pos.x - 0.5), CONST.CELL_WIDTH * (cmd.pos.y - 0.5)));
                animation.on(Animation.EventType.FINISHED, function () {
                    instantEffect.destroy();
                }, self);
            });
            self.getTween(self.node).sequence(delayTime, callFunc).start();
        }, self);
    }
}

