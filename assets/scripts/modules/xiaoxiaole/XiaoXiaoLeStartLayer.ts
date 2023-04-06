
import { Asset, Button, ProgressBar, _decorator, resources } from 'cc';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
import { SoundMgr } from '../../framework/mgr/SoundMgr';
import { UILayer } from '../../framework/ui/UILayer';
import { XiaoXiaoLeLayer } from './XiaoXiaoLeLayer';
import { ResMgr } from '../../framework/mgr/ResMgr';
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
    @property({ type: ProgressBar })
    private loadingBar: ProgressBar;
    protected onEnter() {
        SoundMgr.inst.playBg('dy/sound/xiaoxiaole/worldscenebgm');
        this.loadingBar.node.active = false;
        this.btn_start.node.active = true;
    }

    private _tap_btn_start() {
        let self = this;
        self.loadingBar.node.active = true;
        self.btn_start.node.active = false;
        self.loadingBar.progress = 0;
        self.loadingBar.barSprite.fillRange = 0;
        ResMgr.inst.loadWithProgress(XiaoXiaoLeLayer.prefabUrl, (finished: number, total: number, item: any)=>{
            let progress = finished / total;
            if (progress > self.loadingBar.barSprite.fillRange) {
                self.loadingBar.barSprite.fillRange = progress;
            }
        },(err: Error | null, asset: Asset) => {
            if (!err) {
                SceneMgr.inst.curScene.push('XiaoXiaoLeLayer');
            } else {
                console.error(err);
            }
        },self,false);
    }

    private _tap_btn_back() {
        SceneMgr.inst.pop();
    }

}

