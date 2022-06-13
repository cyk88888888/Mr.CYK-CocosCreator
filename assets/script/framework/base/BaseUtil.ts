/*
 * @Description: 
 * @Author: CYK
 * @Date: 2022-05-19 11:39:05
 */
import { Node, screen, Size, UITransform } from "cc";
import { scaleMode } from "./ScaleMode";
export namespace BaseUT{
    /**
     * 根据屏幕宽高自适应设置comp大小
     * @param comp 
     * @returns 
     */
    export function setFitSize(node: Node): Size{
        let designHeight = screen.windowSize.height < scaleMode.designHeight_max ? screen.windowSize.height : scaleMode.designHeight_max;
        let uiTransform = node.getComponent(UITransform);
        uiTransform.setContentSize(scaleMode.designWidth, designHeight);
        return new Size(scaleMode.designWidth, designHeight);
    }

}