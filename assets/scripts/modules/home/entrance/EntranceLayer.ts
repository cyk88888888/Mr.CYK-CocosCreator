/*
 * @Descripttion: 入口集合界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Node} from 'cc';
import { SceneMgr } from '../../../framework/mgr/SceneMgr';
import { SoundMgr } from '../../../framework/mgr/SoundMgr';
import { UILayer } from '../../../framework/ui/UILayer';
import { UICompTestScene } from '../../uiCompTest/UICompTestScene';
import { XiaoXiaoLeScene } from '../../xiaoxiaole/XiaoXiaoLeScene';
const { ccclass, property } = _decorator;

@ccclass('EntranceLayer')
export class EntranceLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/EntranceLayer';
    @property({type: Node})
    public btn_xiaoxiaole:Node;
    @property({type: Node})
    public btn_uiComp:Node;
    protected onEnter() {
        SoundMgr.inst.playBg('dy/sound/bg03');
    }

    
    private _tap_btn_xiaoxiaole(){
        SceneMgr.inst.push(XiaoXiaoLeScene);
    }

    private _tap_btn_uiComp(){
        SceneMgr.inst.push(UICompTestScene);
    }

}

