
import { AudioSource, Button, _decorator } from 'cc';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
import { SoundMgr } from '../../framework/mgr/SoundMgr';
import { UILayer } from '../../framework/ui/UILayer';
const { ccclass, property } = _decorator;

/*
 * @Descripttion: 开心消消乐界面
 * @Author: CYK
 * @Date: 2023-04-3 23:45:45
 */
@ccclass('XiaoXiaoLeLayer')
export class XiaoXiaoLeLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/xiaoxiaole/XiaoXiaoLeLayer';
    @property({ type: Button })
    private btn_back: Button;
    @property({ type: Button })
    private btn_music: Button;
    protected onEnter() {
        SoundMgr.inst.playBg('dy/sound/xiaoxiaole/gamescenebgm');
    }

    protected onFirstEnter() {
        let self = this;
     
    }

    private _tap_btn_music() {
        SoundMgr.inst.bgAudioSource.state == AudioSource.AudioState.PLAYING ? SoundMgr.inst.pauseBg() : SoundMgr.inst.recoverBg();
    }

    private _tap_btn_back() {
        SceneMgr.inst.curScene.pop();
    }

}

