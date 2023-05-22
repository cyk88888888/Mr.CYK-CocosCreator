import { Texture2D } from "cc";

export default class WebFileHandler{
    private _fileInput: HTMLInputElement;
    private loadComplete: Function;
    private fileType: number;//文件类型，0图片，1文本
    private file: File;
    private _img: any;
    constructor(){
        this.loadComplete = null,
        this.file = null,
        this.fileType = 0,
        this.init()
    }

    private init() {
        var t = this;
        this._fileInput = document.createElement("input"),
        this._fileInput.id = "finput",
        this._fileInput.type = "file",
        this._fileInput.accept = "image/*",
        this._fileInput.style.height = "0px",
        this._fileInput.style.display = "block",
        this._fileInput.style.overflow = "hidden",
        document.body.insertBefore(this._fileInput, document.body.firstChild),
        this._fileInput.addEventListener("change", function(e) {
            t.onSelectFile(e)
        }, !1)
    }
    
    public openImageWin(t) {
        var e = this;
        this.fileType = 0,
        this._fileInput.accept = "image/png,image/jpeg",
        this.loadComplete = t,
        setTimeout(function() {
            e._fileInput.click()
        }, 100)
    }
    
    public openTextWin(t) {
        var e = this;
        this.fileType = 1,
        this._fileInput.accept = "application/json",
        this.loadComplete = t,
        setTimeout(function() {
            e._fileInput.click()
        }, 100)
    }
    
    private onSelectFile(t:any) {
        this.file = t.target.files[0]
        if (0 == this.fileType) {
            var e = this.createObjectURL(this.file);
            this.loadLocalImg(e)
        } else
            1 == this.fileType && this.loadLocalText(this.file)
    }
    
    private loadLocalImg(t) {
        var e = this;
        this._img || (this._img = document.getElementById("f_img"),
        this._img || (this._img = document.createElement("img"),
        this._img.id = "f_img"),
        this._img.onload = function() {
            var t = new Texture2D;
            // t.initWithElement(e._img),
            // t.handleLoadedTexture(),
            e.loadComplete && e.loadComplete(t, e.file)
        }
        ),
        this._img.src = t
    }
    
    private loadLocalText(t) {
        var e = this
          , i = new FileReader;
        i.readAsText(t, "utf-8"),
        i.onprogress = function(t) {
            console.log("pg =", t.loaded);
        }
        ,
        i.onload = function() {
            e.loadComplete && e.loadComplete(i.result, e.file)
        }
    }
    
    private createObjectURL(t) {
        return null != window.URL ? window.URL.createObjectURL(t) : window.webkitURL.createObjectURL(t)
    }
}