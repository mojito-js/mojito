import { assert } from '../../debug/debug';
import { View } from './view';
import { ElementRef } from './element';
import { Injector } from '../di/di';
import { ChangeDetector, ChangeDetectorStatus } from '../change_detection/change_detection';

export class HostElement implements ChangeDetector {

    private _componentView: View = null;
    private _nestedViews: View[] = []; // TODO: Implement embedded views
    private _nativeElement: Element;
    private _component: any;
    private _injector: Injector;
    private _parent: HostElement = null;
    private _children: HostElement[] = [];
    private _cdStatus: ChangeDetectorStatus = ChangeDetectorStatus.CheckAlways;
    private _cdDefaultStatus: ChangeDetectorStatus = ChangeDetectorStatus.CheckAlways;

    get component(): any { return this._component; }  
    get componentView(): View { return this.getView(-1); }
    get elementRef(): ElementRef { return new ElementRef(this._nativeElement); }
    get injector(): Injector { return this._injector; };
    get parent(): HostElement { return this._parent; }
    get cdStatus(): ChangeDetectorStatus { return this._cdStatus; }


    constructor(nativeElement: Element, parent?: HostElement, cdStatus?: ChangeDetectorStatus) {
        this._nativeElement = nativeElement;
        this._parent = parent || null;
        if(typeof cdStatus === 'number') {
            this._cdStatus = cdStatus;
            this._cdDefaultStatus = cdStatus;
        }
    }

    initComponent(component: any, injector: Injector) {
        this._component = component;
        this._injector = injector;
        
        let componentView = new View(this._nativeElement, this);
        this._componentView = componentView;
    }

    // TODO    
    attachView(view: View, viewIndex: number) { }

    registerChild(childHost: HostElement) {
        this._children.push(childHost);
    }

    parseView(viewIndex = -1) {
        let view = this.getView(viewIndex);
        assert(view instanceof View, `No view with index "${viewIndex}"" found!`)
        view.parse();
    }

    parse() {
        this.parseView(-1);
    }

    getView(viewIndex: number = -1) {
        return viewIndex === -1 ? this._componentView : this._nestedViews[viewIndex];
    }

    markForCheck() {

    }
    
    detach() { }
    
    detectChanges() {
        if (this._cdStatus === ChangeDetectorStatus.Checked || this._cdStatus === ChangeDetectorStatus.Errored) {
            return;
        }
        if (this._cdStatus === ChangeDetectorStatus.Destroyed) {
            return;
        }
        this.detectChildChanges();
        if (this._cdStatus === ChangeDetectorStatus.CheckOnce) this._cdStatus = ChangeDetectorStatus.Checked;
    }

    detectChildChanges() {
        for (let i = 0, max = this._children.length; i < max; i++) {
            let childHost = this._children[i];
            if (childHost.cdStatus === ChangeDetectorStatus.Detached) {
                continue;
            }
            childHost.detectChanges();
        }
    }
    
    checkNoChanges() { }
    
    reattach() {

    }

}