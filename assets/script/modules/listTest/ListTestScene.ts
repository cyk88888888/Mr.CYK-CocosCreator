import { instantiate, _decorator } from "cc";
import { UIScene } from "../../framework/lib/UIScene";
import { ResMgr } from "../../framework/mgr/ResMgr";
import { SceneMgr } from "../../framework/mgr/SceneMgr";
const { ccclass, property } = _decorator;
@ccclass('ListTestScene')
export class ListTestScene extends UIScene {
    
    async onLoad() {
        let prefab = await ResMgr.inst.loadPrefab('listTest/ListTestLayer');
        const newNode = instantiate(prefab);
        let script = newNode.addComponent('ListTestLayer');
        // script['newNode'] = newNode;
        newNode.setParent(SceneMgr.inst.layer.node);
        
    }

    
}