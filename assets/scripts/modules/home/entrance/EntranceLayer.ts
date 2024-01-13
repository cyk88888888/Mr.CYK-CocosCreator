import { _decorator, js, Node } from 'cc';
import { UILayer } from '../../../../../extensions/cocos-framework/src/ui/UILayer';
import { SceneMgr } from '../../../../../extensions/cocos-framework/src/mgr/SceneMgr';
import { SoundMgr } from '../../../../../extensions/cocos-framework/src/mgr/SoundMgr';
import { List } from '../../../../../extensions/cocos-framework/src/uiComp/List';
const { ccclass, property } = _decorator;
/** 
 * @Descripttion 入口集合界面
 * @Author CYK
 * @Date 2022-05-16 09:18:45
 */
@ccclass('EntranceLayer')
export class EntranceLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/EntranceLayer';
    @property({ type: List })
    public list_btns: List;
    @property({ type: Node })
    public btn_bgMusic: Node;
    @property({ type: Node })
    public btn_soundEff: Node;

    protected onEnter() {
    }

    private _data_list_btns() {
        let datas = [
            { name: "UI基础组件", sceneName: "UICompTestScene" },
            { name: "开心消消乐", sceneName: "XiaoXiaoLeScene" },
            { name: "聊天列表", sceneName: "ChatScene" },
            { name: "背包弹窗", dlgName: "BagDlg" },
            { name: "骨骼动画弹窗", dlgName: "DBTestDlg" }
        ];
        return datas;
    }

    private _select_list_btns(tabData: { name: string, sceneName: string, dlgName: string }, selectedIdx: number, lastSelectedIdx: number) {
        if (tabData.sceneName) {
            SceneMgr.inst.push(tabData.sceneName);
        } else if (tabData.dlgName) {
            let dlgClass = js.getClassByName(tabData.dlgName);
            dlgClass["show"]();
        }
    }

    private _tap_btn_bgMusic() {
        SoundMgr.inst.bgMusicEnable = !SoundMgr.inst.bgMusicEnable;
    }

    private _tap_btn_soundEff() {
        SoundMgr.inst.soundEffEnable = !SoundMgr.inst.soundEffEnable;
    }

}

