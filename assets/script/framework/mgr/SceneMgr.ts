import { Component, director, Layers, Node, Scene, UIOpacity, UITransform, view } from "cc";

export class SceneMgr {
    private static _inst: SceneMgr;
    public layer: Component;
    public dlg: Component;
    public msg: Component;
    public curScene: Component;
    private _canvas: Scene;
    public static get inst() {
        if (!this._inst) {
            this._inst = new SceneMgr();
        }
        return this._inst;
    }

    /**
     * 
     * @returns 获取当前场景的canvas
     */
    public getCanvas() {
        if (!this._canvas) {
            this._canvas = director.getScene().getChildByName('Canvas');
        }
        return this._canvas;
    }

    public pushScene(sceneName: string) {
        this.curScene = this.addCom2GRoot(sceneName, true);
        this.initLayer();
        this.curScene.node.addComponent(sceneName);
    }

    private initLayer() {
        let self = this;
        self.layer = self.addCom2GRoot('UILayer');
        self.dlg = self.addCom2GRoot('UIDlg');
        self.msg = self.addCom2GRoot('UIMsg');
    }

    /**
     * 添加层级容器到GRoot
     * @param name 节点名称
     * @param isScene 是否为场景
     * @returns 
     */
    private addCom2GRoot(name: string, isScene?: boolean): Component {
        let newCom = new Component();
        newCom.node = new Node(name);
        newCom.node.layer = Layers.Enum.UI_2D;
        let _uiTrans = newCom.node.addComponent(UITransform);
        let parent = isScene ? this.getCanvas() : this.curScene.node;
        let parentTransform = parent.getComponent(UITransform);
        newCom.node.addComponent(UIOpacity);
        _uiTrans.setContentSize(parentTransform.width, parentTransform.height);
        parent.addChild(newCom.node);
        return newCom;
    }

}


