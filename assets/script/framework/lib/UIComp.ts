import { _decorator, Component, Node } from 'cc';
import { emmiter } from './Emmiter';
const { ccclass, property } = _decorator;

@ccclass('UIComp')
export class UIComp extends Component {
    private _emmitMap: { [event: string]: Function };//已注册的监听事件列表
    private _objTapMap: { [objName: string]: Function };//已添加的显示对象点击事件的记录
    constructor() {
        super();
        let self = this;
        self.ctor_b();
        if (self["ctor"]) self["ctor"]();
        self.ctor_a();
    }

    onLoad() {
        let self = this;
        console.log('进入---' + self.__className + '---页面');
        self.addToLayer();
        self.addBtnCLickListener();
        self.onEnter_b();
        if (self["onEnter"]) self["onEnter"]();
        self.onEnter_a();
    }

    protected ctor_b() { }

    protected ctor_a() { }

    protected onEnter_b() { }

    protected onEnter_a() { }

    protected onExit_b() { }

    protected onExit_a() { }

    protected addToLayer() { }

    protected onEmitter(event: string, listener: any) {
        let self = this;
        emmiter.on(event, listener, self);
        if (!self._emmitMap) self._emmitMap = {};
        self._emmitMap[event] = listener;
    }

    protected unEmitter(event: string, listener: any) {
        let self = this;
        emmiter.off(event, listener, self);
    }

    protected emit(event: string, data?: any) {
        emmiter.emit(event, data)
    }

    public get __className(): string {
        let self = this;
        return self.node.name;
    }

    /**添加按钮点击事件监听**/
    private addBtnCLickListener() {
        let self = this;
        self._objTapMap = {};
        self.node.children;
        for (let objName in self) {
            let obj = self[objName];
            if (obj instanceof Node) {
                if (self["_tap_" + objName]) {
                    let tapFunc = self["_tap_" + objName];
                    self._objTapMap[objName] = tapFunc;
                    self.node.on(Node.EventType.TOUCH_END, tapFunc, self);
                }
            }
        }
    }

    /**
     * 销毁节点
     */
    public close() {
        this.node.destroy();
    }

    private dispose() {
        let self = this;
        if (self._emmitMap) {
            for (let event in self._emmitMap) {
                self.unEmitter(event, self._emmitMap[event]);
            }
            self._emmitMap = null;
        }

        if (self._objTapMap) {
            for (let objName in self._objTapMap) {
                let obj = self[objName];
                if (obj instanceof Node) obj.off(Node.EventType.TOUCH_END, self._objTapMap[objName], self);
            }
            self._objTapMap = null;
        }
    }

    onDestroy() {
        let self = this;
        this.dispose();
        this.onExit_b();
        if (self["onExit"]) self["onExit"]();
        this.onExit_a();
    }
}

