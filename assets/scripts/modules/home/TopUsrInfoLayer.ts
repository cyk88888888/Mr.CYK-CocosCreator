/*
 * @Descripttion: 主界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
import {Label, Node, profiler, _decorator } from 'cc';
import { FileTestScene } from '../fileTest/FileTestScene';
import { UIMenu } from '../../../../extensions/cocos-framework/src/ui/UIMenu';
import { ButtonPlus } from '../../../../extensions/cocos-framework/src/uiComp/ButtonPlus';
import { SceneMgr } from '../../../../extensions/cocos-framework/src/mgr/SceneMgr';
const { ccclass, property } = _decorator;

@ccclass('TopUsrInfoLayer')
export class TopUsrInfoLayer extends UIMenu {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/TopUsrInfoLayer';
    @property({type: Node, tooltip:'哈哈哈'})
    private grp_head: Node;
    @property({ type: Label })
    private lbl_name: Label;
    @property({ type: ButtonPlus })
    private btn_debug: Label;
    protected onEnter() {

    }

    update(deltaTime: number) {}

    private _tap_grp_head() {
        SceneMgr.inst.push(FileTestScene);
    }

    private _tap_btn_debug(){
        profiler.isShowingStats() ?  profiler.hideStats() :  profiler.showStats();
    }
}

