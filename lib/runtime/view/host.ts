import { assert } from '../../debug/debug';
import { View } from './view';
import { ElementRef } from './element';
import { Injector } from '../di/di';

export class HostElement {

    private _componentView: View = null;
    private _nestedViews: View[] = []; // TODO: Implement embedded views
    private _nativeElement: Element;
    private _component: any;
    private _injector: Injector;
    private _parent: HostElement = null;

    get component(): any { return this._component; }    
    get elementRef(): ElementRef { return new ElementRef(this._nativeElement); }
    get injector(): Injector { return this._injector; };
    get parent(): HostElement { return this._parent; }

    constructor(nativeElement: Element, parent?: HostElement) {
        this._nativeElement = nativeElement;
        this._parent = parent || null;
    }

    initComponent(component: any, injector: Injector) {
        this._component = component;
        this._injector = injector;
        
        let componentView = new View(this._nativeElement, this);
        this._componentView = componentView;
    }

    // TODO    
    attachView(view: View, viewIndex: number) { }

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

}