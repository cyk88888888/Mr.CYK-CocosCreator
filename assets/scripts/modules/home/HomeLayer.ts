import { _decorator, Animation, Button, instantiate, Node, Prefab, Tween, Vec3 } from 'cc';
import { UILayer } from '../../framework/ui/UILayer';
import { ResMgr } from '../../framework/mgr/ResMgr';
const { ccclass, property } = _decorator;
/*
 * @Descripttion: 主界面
 * @Author: CYK
 * @Date: 2022-05-16 09:18:45
 */
@ccclass('HomeLayer')
export class HomeLayer extends UILayer {
    /** 预制体路径 */
    public static prefabUrl: string = 'prefab/home/HomeLayer';
    @property({ type: Prefab })
    crushEffect: Prefab;
    protected onEnter() {
        let self = this;
        let actionArray: Tween<Node>[] = [];
        let call = self.getTween(self.node).delay(2).call(() => {
            console.warn('缓动结束！！！');
        });
        let call2 = self.getTween(self.node).call(() => {
            console.warn('缓动结束222！！！');
        });

        // let rotate = self.getTween(self.node).to(0.06, { eulerAngles: new Vec3(0, 0, 30) }).to(0.12, { eulerAngles: new Vec3(0, 0, -60) }).to(0.12, { eulerAngles: new Vec3(0, 0, 0) }).union().repeat(2);
        // actionArray.push(rotate);
        actionArray.push(call);
        actionArray.push(call2);
        if (actionArray.length == 1) {
            actionArray[0].start();
        } else {
            self.getTween(this.node).sequence(...actionArray).start();
        }

        let instantEffect = instantiate(self.crushEffect);
        instantEffect.setParent(self.node);
        let animation = instantEffect.getComponent(Animation);
        animation.play("effect");
    }

}

