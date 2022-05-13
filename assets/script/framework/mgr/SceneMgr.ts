import { Component, director, Layers, Node, Scene, UIOpacity, UITransform, view } from "cc";

export class SceneMgr {
    private static _inst: SceneMgr;
    public layer: Component;
    public dlg: Component;
    public msg: Component;
    public curScene: Component;
    private _canvas: Scene;
    private _popArr: string[];
    public static get inst() {
        if (!this._inst) {
            this._inst = new SceneMgr();
        }
        return this._inst;
    }

    /**
     * 获取当前场景的canvas
     * @returns 
     */
    public getCanvas(): Scene {
        if (!this._canvas) {
            this._canvas = director.getScene().getChildByName('Canvas');
        }
        return this._canvas;
    }

    public pushScene(sceneName: string, data?: any) {
        if (!this._popArr) {
            this._popArr = [];
        }
        if (this.curScene) {//销毁上个场景
            this.curScene.node.destroyAllChildren();
            this.curScene.node.destroy();
        }
        this.curScene = this.addCom2GRoot(sceneName, true);
        this.initLayer();
        let newScene = this.curScene.node.addComponent(sceneName);
        newScene['data'] = data;
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


