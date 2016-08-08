import { assert } from '../../../debug/debug';
import { stringify } from '../../../utils/string/stringify';
import { Injectable, Inject, forwardRef } from '../../../core/di/di';
import { ContextTree } from '../context';
import { ParserElementHook, ParserAttributeHook } from './hooks';
import { doesSelectorMatchElement } from '../../../utils/dom/dom';
import { DirectiveRegistry } from '../../../core/directive/registry';
import { ComponentResolver } from '../../../core/component/resolver';
import { View } from '../../../core/view/view';
import { HostElement } from '../../../core/view/host';

export class ComponentParserHook extends ParserElementHook {

    private selectors = DirectiveRegistry.selectors;
    private lastFoundSelectorIndex = -1;

    constructor(private resolver: ComponentResolver) {
        super();
    }

    predicate(element: Element): boolean {
        for (let i = 0, max = this.selectors.length; i < max; i++) {
            if (doesSelectorMatchElement(this.selectors[i], element)) {
                this.lastFoundSelectorIndex = i;
                return true;
            }
        }
        this.lastFoundSelectorIndex = -1;
        return false;
    }

    onBeforeParse(element: Element, context: ContextTree): Object | Function {
        let componentType = DirectiveRegistry.directiveTypes[this.lastFoundSelectorIndex];
        let factory = this.resolver.resolveComponent(componentType);
        let view: View = context.getNearestContextOfType(View);
        assert(view instanceof View, `The found view on the element ${element} has to be of the type View!`);
        assert(view.hostElement instanceof HostElement, `The found component "${stringify(componentType)}" on the element ${element} has no parent host element.\nAre you using the bootstrap function for setting up your project?`);
        let componentRef = factory.create(view.hostElement.injector, element);
        this.lastFoundSelectorIndex = -1;
        return componentRef.hostElement.getView(-1);
    }
}