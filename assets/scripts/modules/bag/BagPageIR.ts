import { _decorator, Component, instantiate, Label, Layout, Node, Prefab, RichText, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { UIComp } from '../../framework/ui/UIComp';
import { ListItem } from '../../framework/uiComp/ListItem';
import { ImgLoader } from '../../framework/uiComp/ImgLoader';
const { ccclass, property } = _decorator;

@ccclass('BagPageIR')
export class BagPageIR extends ListItem {
    @property(Prefab)
    private bagItem: Prefab;

    protected dchg(): void {
        let self = this; 
        let data = self. data;
        console.log(data);
        if (self.node.children.length) {
            for (let n = 0; n < data.length; n++) {
                let bi: any = self.node.children[n];
                let itemData = data[n];
                bi.getChildByName('icon').getComponent(ImgLoader).url = itemData.icon;
            }
        } else {
            for (let n = 0; n < data.length; n++) {
                let itemData = data[n];
                let bi = instantiate(this.bagItem);
                bi.setParent(self.node);
                bi.getChildByName('icon').getComponent(ImgLoader).url = itemData.icon;
            }
        }

    }
}

