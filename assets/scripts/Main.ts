/*
 * @Descripttion: 主入口
 * @Author: CYK
 * @Date: 2022-05-13 09:40:14
 */
import { _decorator, Component, Prefab, Node, EventTouch, instantiate } from 'cc';
import { IndexScene } from './modules/index/IndexScene';
import { BaseUT } from '../../extensions/cocos-framework/src/base/BaseUtil';
import { SoundMgr } from '../../extensions/cocos-framework/src/mgr/SoundMgr';
import { SceneMgr } from '../../extensions/cocos-framework/src/mgr/SceneMgr';
import { TickMgr } from '../../extensions/cocos-framework/src/mgr/TickMgr';
import { ResMgr } from '../../extensions/cocos-framework/src/mgr/ResMgr';
import { scaleMode } from '../../extensions/cocos-framework/src/base/ScaleMode';
import { Sp } from '../../extensions/cocos-framework/src/uiComp/Sp';
import { BaseEnum } from '../../extensions/cocos-framework/src/base/BaseEnum';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property({ type: Prefab, tooltip: '点击特效' })
    clickEff: Prefab;
    onLoad() {
        //转成全部变量，可在浏览器console直接输出
        globalThis.BaseUT = BaseUT;
        SoundMgr.inst.defaultBgMusic = "dy/sound/lover";//设置默认背景音乐
        SceneMgr.inst.mainScene = 'HomeScene';//设置主场景
        SoundMgr.inst.buttonSound = "dy/sound/click";//设置全局按钮点击音效
        ResMgr.inst.setGlobal(
            'dy/sp/click',  
            'dy/sound/click',
            'ui/common'
        )
        scaleMode.fitMode = BaseEnum.FitMode.FitWidth;
        scaleMode.designWidth = 640;
        scaleMode.designHeight = 1280;
        scaleMode.designHeight_min = 1030;
        scaleMode.designHeight_max = 1280;

        this.initClickEffContainer();
        SceneMgr.inst.run(IndexScene, { name: '红红火火恍恍惚惚' });
    }

    private initClickEffContainer() {
        let self = this;
        let newNode = BaseUT.newUINode('ClickEff');
        newNode.on(Node.EventType.TOUCH_START, self.touchHandler, self);
        newNode.on(Node.EventType.TOUCH_MOVE, self.touchHandler, self);
        newNode.on(Node.EventType.TOUCH_END, self.onStageCLick, self);
        let windowSize = BaseUT.getStageSize();
        BaseUT.setSize(newNode, windowSize.width, windowSize.height);
        SceneMgr.inst.getCanvas().addChild(newNode);
    }

    private touchHandler(e: EventTouch){
        e.preventSwallow = true;
    }

    private onStageCLick(event: EventTouch) {
        event.preventSwallow = true;
        let point = event.getUILocation();
        let eff = instantiate(this.clickEff);
        let sp = eff.getComponent(Sp);
        sp.node.on(BaseEnum.Game.onSpPlayEnd, () => {
            sp.node.destroy();
        }, this);
        sp.url = 'dy/sp/click';
        sp.playCount = 1;
        sp.frameRate = 40;
        let parent = SceneMgr.inst.getCanvas().getChildByName('ClickEff');
        let parnetSize = BaseUT.getSize(parent);
        eff.setPosition(point.x - parnetSize.width / 2, point.y - parnetSize.height / 2);
        parent.addChild(eff);
    }

    update(dt: number) {
        TickMgr.inst.onTick(dt);
    }
}

