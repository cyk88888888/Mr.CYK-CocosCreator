import {Component, director, Layers, Node, Scene, UIOpacity, UITransform, view } from "cc";

export class LayerMgr {
    private static _inst: LayerMgr;
    public layer: Component;
    public dlg: Component;
    public msg: Component;
    private _canvas: Scene;
    public static get inst() {
        if (!this._inst) {
            this._inst = new LayerMgr();
        }
        return this._inst;
    }

    public init() {
        let self = this;
        self.layer = self.addCom2GRoot('layer');
        self.dlg = self.addCom2GRoot('dlg');
        self.msg = self.addCom2GRoot('msg');
    }

    /**
    * 添加层级容器到GRoot
    * @param name 名称
    * @returns 
    */
    private addCom2GRoot(name: string): Component {
        let newCom = new Component();
        newCom.node = new Node(name);
        newCom.node.layer = Layers.Enum.UI_2D;
        newCom.node.addComponent(UIOpacity);
        let _uiTrans = newCom.node.addComponent(UITransform);
        let canvas = this.getCanvas();
        let canvasTransform = canvas.getComponent(UITransform);
        _uiTrans.setContentSize(canvasTransform.width, canvasTransform.height);
        canvas.addChild(newCom.node);
        return newCom;
    }

    public getCanvas() {
        if(!this._canvas){
            this._canvas = director.getScene().getChildByName('Canvas');
        }
        return this._canvas;
    }

}


