import { ObserverLocator } from 'aurelia-binding';
import { Container, BindingEngine } from 'aurelia-framework';

export * from './guid';
export * from './collections';

export function getDefaultBindingEngine(): BindingEngine {
    return Container.instance.get<BindingEngine>(BindingEngine);
}

export function getDefaultObserverLocator(): ObserverLocator {
    return Container.instance.get<ObserverLocator>(ObserverLocator);
}

declare global {
  interface StringConstructor {
    empty: string;
    isEmptyOrWhitespace(s: string): boolean;
}}

String.empty = ''.toString();

String.isEmptyOrWhitespace = (s: string): boolean => {
  return (s !== undefined && s !== null) && s.trim().length === 0;
};
