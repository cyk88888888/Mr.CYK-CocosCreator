import { _decorator, Component, Node, instantiate } from 'cc';
import { LayerMgr } from './framework/mgr/LayerMgr';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    onLoad() {
        LayerMgr.inst.init();
        // instantiate()
    }

    update(deltaTime: number) {

    }
}

