import { _decorator, Component, Node } from 'cc';
import { UIComp } from '../../framework/ui/UIComp';
import { ListItem } from '../../framework/uiComp/ListItem';
const { ccclass, property } = _decorator;

@ccclass('ChatIR')
export class ChatIR extends ListItem {
    protected dchg(): void {
        let self = this; 
        // let data = self. data;

    }
}

