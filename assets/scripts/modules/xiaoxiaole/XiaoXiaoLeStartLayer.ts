
import { Button, _decorator } from 'cc';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
import { SoundMgr } from '../../framework/mgr/SoundMgr';
import { UILayer } from '../../framework/ui/UILayer';
const { ccclass, property } = _decorator;

/*
 * @Descripttion: 开心消消乐开始界面
 * @Author: CYK
 * @Date: 2023-04-3 23:45:45
 */
@ccclass('XiaoXiaoLeStartLayer')
export class XiaoXiaoLeStartLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/xiaoxiaole/XiaoXiaoLeStartLayer';
    
    @property({ type: Button })
    private btn_start: Button;
    @property({ type: Button })
    private btn_back: Button;
    protected onEnter() {
        SoundMgr.inst.playBg('dy/sound/xiaoxiaole/worldscenebgm');
    }

    private _tap_btn_start() {
        SceneMgr.inst.curScene.push('XiaoXiaoLeLayer');
    }

    private _tap_btn_back() {
        SceneMgr.inst.pop();
    }

}

