
import { AudioSource, Button, Node, Vec2, _decorator } from 'cc';
import { GameModel } from './model/GameModel';
import { GridView } from './view/GridView';
import { UILayer } from '../../../../extensions/cocos-framework/src/ui/UILayer';
import { SoundMgr } from '../../../../extensions/cocos-framework/src/mgr/SoundMgr';
import { SceneMgr } from '../../../../extensions/cocos-framework/src/mgr/SceneMgr';
const { ccclass, property } = _decorator;

/** 
 * @Descripttion 开心消消乐界面
 * @Author CYK
 * @Date 2023-04-3 23:45:45
 */
@ccclass('XiaoXiaoLeLayer')
export class XiaoXiaoLeLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/xiaoxiaole/XiaoXiaoLeLayer';
    @property({ type: Button })
    btn_back: Button;
    @property({ type: Button })
    btn_music: Button;
    @property({ type: Node })
    grid: Node;

    private gameModel: GameModel;
    protected onEnter() {
        SoundMgr.inst.playBg('dy/sound/xiaoxiaole/gamescenebgm');
        this.gameModel = new GameModel();
        this.gameModel.init(4);
        var gridScript = this.grid.getComponent(GridView);
        gridScript.setController(this);
        gridScript.initWithCellModels(this.gameModel.getCells());
    }

    public selectCell(pos: Vec2) {
        return this.gameModel.selectCell(pos);
    }

    public cleanCmd() {
        this.gameModel.cleanCmd();
    }

    private _tap_btn_music() {
        SoundMgr.inst.bgAudioSource.state == AudioSource.AudioState.PLAYING ? SoundMgr.inst.pauseBg() : SoundMgr.inst.recoverBg();
    }

    private _tap_btn_back() {
        SceneMgr.inst.curScene.pop();
    }

    protected onExit(): void {
        let self = this;
        self.cleanCmd();
    }

}

