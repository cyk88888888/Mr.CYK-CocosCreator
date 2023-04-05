import { _decorator, Animation, Component, Node, Sprite, SpriteFrame, UI, Vec3 } from 'cc';
import { UIComp } from '../../../framework/ui/UIComp';
import { CONST } from '../../base/CONST';
const { ccclass, property } = _decorator;

@ccclass('CellView')
export class CellView extends UIComp {
    @property({type: SpriteFrame})
    defaultFrame: SpriteFrame;

    private isSelect: boolean
    private model: any;
    protected onEnter() {
        let self = this;
        self.isSelect = false;
    }

    public initWithModel(model){
        this.model = model;
        var x = model.startX;
        var y = model.startY;
        this.node.setPosition(new Vec3(CONST.Cell.CELL_WIDTH * (x - 0.5), CONST.Cell.CELL_HEIGHT * (y - 0.5) ))
        var animation  = this.node.getComponent(Animation);
        if (model.status == CONST.CELL_STATUS.COMMON){
            animation.stop();
        } 
        else{
            animation.play(model.status);
        }
    }

     // 执行移动动作
    public updateView(){
        // var cmd = this.model.cmd;
        // if(cmd.length <= 0){
        //     return ;
        // }
        // var actionArray = [];
        // var curTime = 0;
        // for(var i in cmd){
        //     if( cmd[i].playTime > curTime){
        //         var delay = delayTime(cmd[i].playTime - curTime);
        //         actionArray.push(delay);
        //     }
        //     if(cmd[i].action == "moveTo"){
        //         var x = (cmd[i].pos.x - 0.5) * CONST.Cell.CELL_WIDTH;
        //         var y = (cmd[i].pos.y - 0.5) * CONST.Cell.CELL_HEIGHT;
        //         var move = cc.moveTo(ANITIME.TOUCH_MOVE, cc.v2(x,y));
        //         actionArray.push(move);
        //     }
        //     else if(cmd[i].action == "toDie"){
        //         if(this.status == CONST.CELL_STATUS.BIRD){
        //             let animation = this.node.getComponent(Animation);
        //             animation.play("effect");
        //             actionArray.push(cc.delayTime(ANITIME.BOMB_BIRD_DELAY));
        //         }
        //         var callFunc = cc.callFunc(function(){
        //             this.node.destroy();
        //         },this);
        //         actionArray.push(callFunc);
        //     }
        //     else if(cmd[i].action == "setVisible"){
        //         let isVisible = cmd[i].isVisible;
        //         actionArray.push(cc.callFunc(function(){
        //             if(isVisible){
        //                 this.node.opacity = 255;
        //             }
        //             else{
        //                 this.node.opacity = 0;
        //             }
        //         },this));
        //     }
        //     else if(cmd[i].action == "toShake"){
        //         let rotateRight = cc.rotateBy(0.06,30);
        //         let rotateLeft = cc.rotateBy(0.12, -60);
        //         actionArray.push(cc.repeat(cc.sequence(rotateRight, rotateLeft, rotateRight), 2));
        //     }
        //     curTime = cmd[i].playTime + cmd[i].keepTime;
        // }
        // /**
        //  * 智障的引擎设计，一群SB
        //  */
        // if(actionArray.length == 1){
        //     this.node.runAction(actionArray[0]);
        // }
        // else{
        //     this.node.runAction(cc.sequence(...actionArray));
        // }

    }
    public setSelect(flag:boolean){
        var animation = this.node.getComponent(Animation);
        var bg = this.node.getChildByName("select");
        if(flag == false && this.isSelect && this.model.status == CONST.CELL_STATUS.COMMON){
            animation.stop();
            this.node.getComponent(Sprite).spriteFrame = this.defaultFrame;
        }
        else if(flag && this.model.status == CONST.CELL_STATUS.COMMON){
            animation.play(CONST.CELL_STATUS.CLICK);
        }
        else if(flag && this.model.status == CONST.CELL_STATUS.BIRD){
            animation.play(CONST.CELL_STATUS.CLICK);
        }
        bg.active = flag; 
        this.isSelect = flag;
    }
}

