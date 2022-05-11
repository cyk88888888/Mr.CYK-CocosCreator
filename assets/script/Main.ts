import { _decorator, Component, Node, instantiate, resources, Prefab } from 'cc';
import { LayerMgr } from './framework/mgr/LayerMgr';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    onLoad() {
        LayerMgr.inst.init();
        resources.load("prefabs/ListTest", Prefab, (err, prefab) => {
            const newNode = instantiate(prefab);
            newNode.setParent(LayerMgr.inst.layer.node)
        });
    }

    update(deltaTime: number) {

    }
}

