import { _decorator, Component, Node } from 'cc';
import { LayerMgr } from '../mgr/LayerMgr';
import { Comp } from './Comp';
const { ccclass, property } = _decorator;

@ccclass('Msg')
export class Msg extends Comp {
    protected addToLayer(){
        this.node.setParent(LayerMgr.inst.msg.node);
    }
}

