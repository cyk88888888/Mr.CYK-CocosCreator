import { _decorator } from 'cc';
import { ListItem } from '../../../../extensions/cocos-framework/src/uiComp/ListItem';
import { ImgLoader } from '../../../../extensions/cocos-framework/src/uiComp/ImgLoader';
const { ccclass } = _decorator;

@ccclass('BottomTabIR')
export class BottomTabIR extends ListItem {

    protected dchg(): void {
        let self = this; 
        let data = self. data;
        self.node.getChildByName('icon').getComponent(ImgLoader).url = data.icon;
    }
}

