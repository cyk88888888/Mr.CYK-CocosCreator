/*
 * @Descripttion: 文件IO测试界面
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { Button, Node, Sprite, _decorator } from 'cc';
import { UILayer } from '../../../../extensions/cocos-framework/src/ui/UILayer';
import { ButtonPlus } from '../../../../extensions/cocos-framework/src/uiComp/ButtonPlus';
import { SceneMgr } from '../../../../extensions/cocos-framework/src/mgr/SceneMgr';
import { FileIOHandler } from '../../../../extensions/cocos-framework/src/mgr/FileIOHandler';
import WebFileHandler from '../../../../extensions/cocos-framework/src/mgr/WebFileHandler';
const { ccclass, property } = _decorator;

@ccclass('FileTestLayer')
export class FileTestLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/fileTest/FileTestLayer';
    @property({ type: Button })
    private btn_back: Button;
    @property({ type: ButtonPlus })
    private btn_fileSelect: ButtonPlus;
    @property({ type: ButtonPlus })
    private btn_fileSelectImg: ButtonPlus;
    @property({ type: ButtonPlus })
    private btn_fileSelectText: ButtonPlus;
    @property({ type: ButtonPlus })
    private btn_fileSave: ButtonPlus;
    @property({ type: Sprite })
    private img_local: Sprite;
    //数据数组（所有List共用）
    data: number[] = [];
    protected onEnter() {
        this.data = [];
    }

    private _tap_btn_back() {
        SceneMgr.inst.pop();
    }

    /** 打开文件选择器+读取数据 */
    private async _tap_btn_fileSelect() {
        let root = await FileIOHandler.inst.getDirTreeMap();
        console.log(root);
    }

    private _tap_btn_fileSelectImg() {
        let self = this;
        WebFileHandler.inst.openImageWin((e, i) => {
            console.log(e, i);
            self.img_local.spriteFrame = e;
        })
    }

    private _tap_btn_fileSelectText() {
        WebFileHandler.inst.openTextWin(function (e, i) {
            console.log(e, i);
        })
    }

    /** 保存数据到文件 */
    private _tap_btn_fileSave() {
        let list = [{ type: 1, aa: 5 }, { type: 3, bb: 66 }, { desc: "我终于搞定web文件存储到本地了!!!" }];
        FileIOHandler.inst.saveTextToLocal(JSON.stringify(list));
    }
}

