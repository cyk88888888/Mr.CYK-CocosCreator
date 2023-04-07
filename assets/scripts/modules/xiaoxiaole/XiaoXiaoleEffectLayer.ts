import { _decorator, Animation, Component, instantiate, Node, Prefab } from 'cc';
import { UIComp } from '../../framework/ui/UIComp';
import { AudioUtils } from './util/AudioUtils';
import { CONST } from '../base/CONST';
const { ccclass, property } = _decorator;

@ccclass('XiaoXiaoleEffectLayer')
export class XiaoXiaoleEffectLayer extends UIComp {
    @property({type: Prefab})
    bombWhite: Prefab;
    @property({type: Prefab})
    crushEffect: Prefab;
    @property({type: AudioUtils})
    audioUtils: AudioUtils;

    public playEffects(effectQueue:any[]){
        let self = this;
        if(!effectQueue || effectQueue.length <= 0){
            return ;
        }
        let soundMap = {}; //某一时刻，某一种声音是否播放过的标记，防止重复播放
        effectQueue.forEach((cmd) => {
            let delayTime = self.getTween(self.node).delay(cmd.playTime);
            let callFunc = self.getTween(self.node).call(()=>{
                let instantEffect = null;
                let animation = null;
                if(cmd.action == "crush"){
                    instantEffect = instantiate(self.crushEffect);
                    animation  = instantEffect.getComponent(Animation);
                    animation.play("effect");
                    !soundMap["crush" + cmd.playTime] && self.audioUtils.playEliminate(cmd.step);
                    soundMap["crush" + cmd.playTime] = true;
                }
                else if(cmd.action == "rowBomb"){
                    instantEffect = instantiate(self.bombWhite);
                    animation  = instantEffect.getComponent(Animation);
                    animation.play("effect_line");
                }
                else if(cmd.action == "colBomb"){
                    instantEffect = instantiate(self.bombWhite);
                    animation  = instantEffect.getComponent(Animation);
                    animation.play("effect_col");
                }

                instantEffect.x = CONST.CELL_WIDTH * (cmd.pos.x - 0.5);
                instantEffect.y = CONST.CELL_WIDTH * (cmd.pos.y - 0.5);
                instantEffect.parent = self.node;
                animation.on("finished",function(){
                    instantEffect.destroy();
                },self);
               
            });
            self.getTween(self.node).sequence(delayTime, callFunc).start();
        },self);
    }
}

