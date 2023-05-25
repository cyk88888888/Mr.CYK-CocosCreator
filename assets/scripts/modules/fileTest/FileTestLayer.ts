/*
 * @Descripttion: 列表测试界面
 * @Author: CYK
 * @Date: 2022-05-12 09:23:41
 */
import { Button, Node, Sprite, _decorator } from 'cc';
import { SceneMgr } from '../../framework/mgr/SceneMgr';
import { UILayer } from '../../framework/ui/UILayer';
import { ButtonPlus } from '../../framework/uiComp/ButtonPlus';
import WebFileHandler from '../../framework/mgr/WebFileHandler';
import { MessageTip } from '../common/message/MessageTip';
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
    private _tap_btn_fileSelect() {
        // WebFileHandler.inst.openDirectoryWin(function(e, i) {
        //     console.log(e, i);
        // })
        async function getDir() {
            const directoryHandle: FileSystemDirectoryHandle = await window["showDirectoryPicker"]();
            FileSystemDirectoryHandle;
            FileSystemFileHandle;
            // 操作 dirHandle 的后续代码
            async function* getFilesRecursively(entry) {
                if (entry.kind === "file") {
                    const file: File = await entry.getFile();
                    if (file !== null) {
                        let url = directoryHandle.resolve(entry);
                        // file.relativePath = getRelativePath(entry);
                        yield file;
                    }
                } else if (entry.kind === "directory") {
                    for await (const handle of entry.values()) {
                        yield* getFilesRecursively(handle);
                    }
                }
            }
            for await (const fileHandle of getFilesRecursively(directoryHandle)) {
                console.log(fileHandle);
            }

        }
        getDir();

        // let fileHandle;
        // async function getFile() {
        //     // open file picker
        //     [fileHandle] = await window["showOpenFilePicker"]();

        //     if (fileHandle.kind === "file") {
        //         // run file code
        //     } else if (fileHandle.kind === "directory") {
        //         // run directory code
        //     }
        // }
        // getFile();
    }

    private _tap_btn_fileSelectImg() {
        let self = this;
        WebFileHandler.inst.openImageWin((e, i) => {
            console.log(e, i);
            self.img_local.spriteFrame = e;
            // t.bgTex = e;
            // var o = i.name.lastIndexOf(".");
            // t.bgName = i.name.slice(0, o),
            // t.bgPathTxt.string = i.name,
            // t.mapWidthTxt.string = "" + e.width,
            // t.mapHeightTxt.string = "" + e.height
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
        // WebFileHandler.inst.saveForBrowser(JSON.stringify(list), `json/${1}.json`);
        async function getNewFileHandle() {
            const opts = {
                types: [
                    {
                        suggestedName: "mapData.json",
                        description: "保存的文件名称",
                        accept: { "text/plain": [".json"] },
                    },
                ],
            };
            //FileSystemFileHandle
            let newHandle = await window["showSaveFilePicker"](opts);
            // create a FileSystemWritableFileStream to write to
            const writableStream = await newHandle.createWritable();

            // write our file
            await writableStream.write(JSON.stringify(list));

            MessageTip.show({ msg: '保存成功' });
            // close the file and write the contents to disk.
            await writableStream.close();
        }
        getNewFileHandle();

    }
}

