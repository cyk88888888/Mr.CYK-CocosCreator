import { ImageAsset, SpriteFrame, Texture2D, assetManager } from "cc";

export default class WebFileHandler {
    private _fileInput: HTMLInputElement;
    private loadComplete: Function;
    private fileType: number;//文件类型，0图片，1文本, 2文件夹
    private file: File;
    constructor() {
        this.loadComplete = null;
        this.file = null;
        this.fileType = 0;
        this.init();
    }

    private init() {
        let self = this;
        self._fileInput = document.createElement("input");
        self._fileInput.id = "finput";
        self._fileInput.accept = ".*";
        self._fileInput.style.height = "0px";
        self._fileInput.style.display = "block";
        self._fileInput.style.overflow = "hidden";
        document.body.insertBefore(self._fileInput, document.body.firstChild);
        self._fileInput.onchange = (e: Event) => {
            self.onSelectFile(e);
        }
        self._fileInput.oncancel = (e: Event) => {
            console.log(e);
        }
    }

    //选中图片文件
    public openImageWin(cb: Function) {
        let self = this;
        self.fileType = 0;
        self._fileInput.type = "file";
        self._fileInput.accept = "image/png,image/jpeg";//"image/*"
        self.loadComplete = cb;
        self._fileInput.click();
    }

    //选中文本文件
    public openTextWin(cb: Function) {
        let self = this;
        self.fileType = 1;
        self._fileInput.type = "file";
        self._fileInput.accept = "application/json";
        self.loadComplete = cb;
        self._fileInput.click();
    }

    //选中目录文件夹
    public openDirectoryWin(cb: Function) {
        let self = this;
        self.fileType = 3;
        self._fileInput.type = "files";
        self._fileInput.accept = ".*";
        self.loadComplete = cb;
        self._fileInput.click();
    }

    private onSelectFile(t: any) {
        let self = this;
        self.file = t.target.files[0];
        if (self.fileType == 0) {//图片
            let url = self.createObjectURL(self.file);
            if (url) self.loadLocalImg(url);
        } else if (self.fileType == 1) {//文本
            self.loadLocalText(self.file);
        } else {//文件夹目录
            //todo...
        }
    }

    private loadLocalImg(url: string) {
        let self = this;
        assetManager.loadRemote<ImageAsset>(url, {ext: '.png'}, function (err, imageAsset) {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrame.texture = texture;
            self.loadComplete && self.loadComplete(spriteFrame, self.file);
        });
    }

    private loadLocalText(file: File) {
        let self = this;
        if (!file) return;
        let reader = new FileReader();
        reader.readAsText(file, "utf-8");
        reader.onprogress = (e: ProgressEvent) => {
            console.log("pg =", e.loaded);
        }
        reader.onload = function () {
            self.loadComplete && self.loadComplete(reader.result, self.file);
        }
    }

    private createObjectURL(file: File) {
        if (!file) return null;
        return null != window.URL ? window.URL.createObjectURL(file) : window.webkitURL.createObjectURL(file);
    }
}