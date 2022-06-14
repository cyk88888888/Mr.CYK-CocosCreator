import { _decorator, Component, Node, js, Tween } from 'cc';
import { emmiter } from '../base/Emmiter';
const { ccclass, property } = _decorator;

@ccclass('UIComp')
export class UIComp extends Component {
    private _oldParent: Node;
    private _emmitMap: { [event: string]: Function };//已注册的监听事件列表
    private _objTapMap: { [objName: string]: any };//已添加的显示对象点击事件的记录
    private _tweenTargetList: any[];//已添加缓动的对象列表
    private chilidCompClassMap: { [className: string]: UIComp };//子组件的控制脚本类
    public data: any;
    private isFirstEnter: boolean = true;
    /** 预制体路径 */
    public static prefabUrl: string = '';
    /**打开弹窗时是否需要动画 */
    protected needAnimation: boolean = true;
    protected dlgMaskName = '__mask: GGraph';//弹窗底部灰色rect名称
    public hasDestory: boolean;//是否已被销毁
    private _allList: Node[];
    protected needRefreshListOnEnter: boolean = true;

    __preload() {
        let self = this;
        self._oldParent = self.node.parent;
        self.initView();
    }

    protected onEnter_b() { }

    protected onEnter_a() { }

    protected onExit_b() { }

    protected onExit_a() { }

    protected addToLayer() { }

    /**打开页面时的动画 */
    protected onOpenAnimation() { }
    /**关闭页面时的动画 */
    protected onCloseAnimation(callback?: Function) {
        if (callback) callback.call(this);
    }

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

    public static get __className(): string {
        return this.name;
    }

    public get className(): string {
        let self = this;
        let str = self.name;
        str = str.match(/<(\S*)>/)[1];
        return str;
    }

    public setData(data: any) {
        this.data = data;
        if (data && this['dchg']) this['dchg']();
    }

    public enterOnPop() {
        let self = this;
        self.initView();
    }

    public exitOnPush() {
        let self = this;
        self._dispose();
    }

    /**
     * 初始化view
     */
    private initView() {
        let self = this;
        if (self.hasDestory) return;
        this.initViewProperty();
        self.addListener();
        console.log('进入' + self.className);
        self.onEnter_b();
        if (self['onEnter']) self['onEnter']();
        if (self.isFirstEnter) {
            self.isFirstEnter = false;
            if (self["onFirstEnter"]) self["onFirstEnter"]();
        }
        self.onEnter_a();
        self.refreshAllList();
    }

    /** 初始化属性 */
    private initViewProperty() {
        let self = this;
        let children = self.node.children;
        if (!self.chilidCompClassMap) self.chilidCompClassMap = {};
        if (!self._allList) self._allList = [];
        for (let key in children) {
            let childNode = children[key];
            let childName = childNode.name;
            self[childName] = childNode;
            let scriptClass = js.getClassByName(childName);//是否有对应脚本类
            if (scriptClass) {
                let oldScript = self.getComponent(childName) as UIComp;
                let script = oldScript ? oldScript : self.node.addComponent(childName) as UIComp;
                if (!oldScript) self.chilidCompClassMap[childName] = script;
                script.initView();
            }
        }
    }

    /**添加事件监听**/
    private addListener() {
        let self = this;
        self._objTapMap = {};
        let children = self.node.children;
        for (let key in children) {
            let childNode = children[key];
            let objName = childNode.name;
            let eventFuncName = "_tap_" + objName;
            if (self[eventFuncName]) {
                let eventName = Node.EventType.TOUCH_END;
                childNode.on(eventName, self[eventFuncName], self);
                self._objTapMap[eventFuncName + '&' + eventName] = childNode;
            }
        }
    }

    /**刷新所有列表 */
    private refreshAllList() {
        let self = this;
        if (!self.needRefreshListOnEnter) return;
        //todo...
    }

    /**获取指定对象的缓动Tweener */
    protected getTween(target: Node) {
        if (!this._tweenTargetList) {
            this._tweenTargetList = [];
        }
        if (this._tweenTargetList.indexOf(target) == -1) this._tweenTargetList.push(target);

    }

    /**清除指定对象的缓动Tweener */
    protected rmTween(target: any, complete?: boolean, propType?: any) {

    }

    /**清除所有对象的缓动 */
    private rmAllTweens() {
        if (this._tweenTargetList) {
            for (let i = 0; i < this._tweenTargetList.length; i++) {
                this.rmTween(this._tweenTargetList[i]);
            }
        }
        this._tweenTargetList = null;
    }

    private timeoutIdArr: number[];
    protected setTimeout(cb: () => void, timeout: number) {
        if (!this.timeoutIdArr) this.timeoutIdArr = [];
        let timeoutId = setTimeout(() => {
            cb.call(this);
        }, timeout);
        this.timeoutIdArr.push(timeoutId);
        return timeoutId;
    }

    private intervalIdArr: number[];
    protected setInterval(cb: () => void, timeout: number) {
        if (!this.intervalIdArr) this.intervalIdArr = [];
        let intervalId = setInterval(() => {
            cb.call(this);
        }, timeout);
        this.intervalIdArr.push(intervalId);
        return intervalId;
    }

    /**
     * 清除所有的setTimeout和setInterval定时器
     */
    protected clearAllTimeoutOrInterval() {
        let self = this;
        if (self.timeoutIdArr) {
            for (let i = 0; i < self.timeoutIdArr.length; i++) {
                clearTimeout(self.timeoutIdArr[i]);
            }
            self.timeoutIdArr = null;
            console.log('清除timeoutIdArr: ' + self.node.name);
        }

        if (self.intervalIdArr) {
            for (let i = 0; i < self.intervalIdArr.length; i++) {
                clearInterval(self.intervalIdArr[i]);
            }
            self.intervalIdArr = null;
            console.log('清除intervalIdArr: ' + self.node.name);
        }
    }

    public close() {
        let self = this;
        self.onCloseAnimation(() => {
            self.destory();
        });
    }

    public addSelf() {
        this.initView();
        this.node.setParent(this._oldParent);
    }

    public removeSelf() {
        let self = this;
        self._dispose();
        self.node.removeFromParent();
    }

    public destory() {
        let self = this;
        if (self.hasDestory) return;
        self._dispose();
        self.chilidCompClassMap = null;
        self._allList = null;
        this.node.destroy();
        self.hasDestory = true;
    }

    private _dispose() {
        let self = this;
        if (self._emmitMap) {
            for (let event in self._emmitMap) {
                self.unEmitter(event, self._emmitMap[event]);
            }
            self._emmitMap = null;
        }

        if (self._objTapMap) {
            for (let key in self._objTapMap) {
                let splitKey = key.split('&');
                let eventFuncName = splitKey[0];
                let eventName = splitKey[1];
                let obj = self._objTapMap[key];
                if (obj.node.isValid) {
                    obj.off(eventName, self[eventFuncName], self);
                }
            }
            self._objTapMap = null;
        }

        let bgMask = this.node.getChildByName(self.dlgMaskName);
        if (bgMask) bgMask.off(Node.EventType.TOUCH_END, self.close, self);

        self.clearAllTimeoutOrInterval();
        self.rmAllTweens();

        //子组件退出
        for (let key in self.chilidCompClassMap) {
            let script = self.chilidCompClassMap[key];
            script._dispose();
        }

        console.log('退出' + this.className);
        this.onExit_b();
        if (self["onExit"]) self["onExit"]();
        this.onExit_a();
    }
}

