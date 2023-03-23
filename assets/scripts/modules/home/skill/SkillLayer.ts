/*
 * @Descripttion: 技能界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import { _decorator, Component, Node, ProgressBar, Button, Label, VideoPlayer, Vec3, ImageAsset, SpriteAtlas, resources } from 'cc';
import { BaseUT } from '../../../framework/base/BaseUtil';
import { ResMgr } from '../../../framework/mgr/ResMgr';
import { SoundMgr } from '../../../framework/mgr/SoundMgr';
import { UILayer } from '../../../framework/ui/UILayer';
const { ccclass, property } = _decorator;

@ccclass('SkillLayer')
export class SkillLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/SkillLayer';
    @property({ type: VideoPlayer })
    public videoPlayer: VideoPlayer;
    @property({type: Button})
    public btn_play: Button;
    @property({type: Button})
    public btn_stop: Button;
    @property({type: Button})
    public btn_replay: Button;
    protected onEnter() {
        SoundMgr.inst.stopBg();
        let scale = BaseUT.getFitY(0.5, 0.7);
        this.videoPlayer.node.setScale(new Vec3(scale, scale, 1));
    }

    update(deltaTime: number) {}

    private _tap_btn_play(){
        let self = this;
        self.videoPlayer.resume();
    }

    private _tap_btn_stop(){
        let self = this;
        this.videoPlayer.pause();
    }

    private _tap_btn_replay(){
        let self = this;
        self.videoPlayer.stop();
        self.videoPlayer.play();
    }

    protected onExit() {
        SoundMgr.inst.recoverBg();
        this.videoPlayer.pause();
    }

}

