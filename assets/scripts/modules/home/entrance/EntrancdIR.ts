import { Label, _decorator } from 'cc';
import { ListItem } from '../../../../../extensions/cocos-framework/src/uiComp/ListItem';
const { ccclass, property } = _decorator;

@ccclass('EntrancdIR')
export class EntrancdIR extends ListItem {
    @property({ type: Label })
    public lbl_name: Label;
    protected dchg() {
        let self = this; 
        let data = self. data;
        self.lbl_name.string = data.name;
    }
}

