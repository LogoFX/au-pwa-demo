import { MDCRadio } from '@material/radio';
import { MDCSwitch } from '@material/switch';
import { MDCFloatingLabel } from '@material/floating-label';
import { MDCLineRipple } from '@material/line-ripple';
import { MDCList } from '@material/list';
import { MDCMenu } from '@material/menu';
import { MDCNotchedOutline } from '@material/notched-outline';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { MDCSelect, MDCSelectHelperText } from '@material/select';
import { MDCFormField } from '@material/form-field';
import { MDCCheckbox } from '@material/checkbox';
import { MDCTextFieldHelperText } from '@material/textfield/helper-text';
import { MDCSlider } from '@material/slider';
import { MDCLinearProgress } from '@material/linear-progress';
import { MDCSelectIcon } from '@material/select/icon';
import { viewEngineHooks, View, ViewEngineHooks, ViewResources, ViewCompileInstruction, ViewFactory, ViewCreateInstruction, Controller } from 'aurelia-templating';
import { isNullOrUndefined } from 'util';
import { MDCMenuSurface } from '@material/menu-surface/component';
import { Container } from 'aurelia-framework';
import { MDCDialog } from '@material/dialog';
import { MDCDataTable } from '@material/data-table';
import { MDCChipSet, MDCChip } from '@material/chips';

/**
 * Used to initialize MDC components
 * @export
 */
// tslint:disable-next-line: completed-docs
export class MDCHook implements ViewEngineHooks {
         private static counter: number = 1;

         /**
          * Invoked before the view is unbind. The bindingContext and overrideContext are still available on the view.
          * @param view The view that was created by the factory.
          */
         public beforeUnbind?: (view: View) => void;

         private selector: string =
           ".mdc-button, .mdc-icon-button, .mdc-fab, .mdc-card__primary-action .mdc-chip";

         constructor() {
           console.log(`MDCHook ctor called ${MDCHook.counter++} times.`);
         }

         /**
          * Invoked before a template is compiled.
          * @param content The DocumentFragment to compile.
          * @param resources The resources to compile the view against.
          * @param instruction The compilation instruction associated with the compilation process.
          */
         public beforeCompile(
           content: DocumentFragment,
           resources: ViewResources,
           instruction: ViewCompileInstruction
         ): void {
           console.log("Hook beforeCompile");
         }

         /**
          * Invoked after a template is compiled.
          * @param viewFactory The view factory that was produced from the compilation process.
          */
         public afterCompile(viewFactory: ViewFactory): void {
           console.log("Hook afterCompile");
         }

         /**
          * Invoked before a view is created.
          * @param viewFactory The view factory that will be used to create the view.
          * @param container The DI container used during view creation.
          * @param content The cloned document fragment representing the view.
          * @param instruction The view creation instruction associated with this creation process.
          */
         public beforeCreate(
           viewFactory: ViewFactory,
           container: Container,
           content: DocumentFragment,
           instruction: ViewCreateInstruction
         ): void {
           console.log("Hook beforeCreate");
         }

         /**
          * Invoked after a view is created.
          * @param view The view that was created by the factory.
          */
         public afterCreate(view: View): void {
           console.log("Hook afterCreate");
         }
         /**
          * Invoked after the bindingContext and overrideContext are configured on the view but before the view is bound.
          * @param view The view that was created by the factory.
          */
         public beforeBind(view: View): void {

           // fragment.querySelectorAll('.mdc-form-field').forEach(t => {
           //   const inner: HTMLElement = t.querySelector('input');
           //   const formField = new MDCFormField(t);

           //   if (!isNullOrUndefined(inner)) {
           //     const typeAttribute = inner.getAttribute('type');
           //     if (!isNullOrUndefined(typeAttribute)) {
           //       switch (typeAttribute) {
           //         case 'checkbox':
           //           const cb = fragment.querySelector('.mdc-checkbox');
           //           console.log(cb);
           //           formField.input = new MDCCheckbox(cb);
           //           break;

           //       }
           //     }
           //   }

           // });

           document
             .querySelectorAll(".mdc-floating-label")
             .forEach(t => new MDCFloatingLabel(t));
           document
             .querySelectorAll(".mdc-checkbox")
             .forEach(t => new MDCCheckbox(t));
           document
             .querySelectorAll(".mdc-switch")
             .forEach(t => new MDCSwitch(t));
           document
             .querySelectorAll(".mdc-menu-surface")
             .forEach(t => new MDCMenuSurface(t));
           document
             .querySelectorAll(".mdc-menu")
             .forEach(t => new MDCMenu(t));
           document
             .querySelectorAll(".mdc-line-ripple")
             .forEach(t => new MDCLineRipple(t));
           document
             .querySelectorAll(".mdc-notched-outline")
             .forEach(t => new MDCNotchedOutline(t));
           document.querySelectorAll(".mdc-list").forEach(t => {
             const list = new MDCList(t);
             list.listElements.map(
               listItemEl => new MDCRipple(listItemEl)
             );
           });
           document.querySelectorAll(".mdc-slider").forEach(t => {
             const slider = new MDCSlider(t);
           });
           document
             .querySelectorAll(".mdc-text-field")
             .forEach(t => new MDCTextField(t));
           //fragment.querySelectorAll('.mdc-select').forEach(t => new MDCSelect(t));
           document
             .querySelectorAll(".mdc-select")
             .forEach(t => new MDCSelect(t));
           document
             .querySelectorAll(".mdc-select-helper-text")
             .forEach(t => new MDCSelectHelperText(t));
           document
             .querySelectorAll(".mdc-text-field-helper-text")
             .forEach(t => new MDCTextFieldHelperText(t));
           document
             .querySelectorAll(".mdc-radio")
             .forEach(t => new MDCRadio(t));
           document
             .querySelectorAll(".mdc-linear")
             .forEach(t => new MDCLinearProgress(t));
           document
             .querySelectorAll(".mdc-select__icon")
             .forEach(t => new MDCSelectIcon(t));
           document
             .querySelectorAll(".mdc-dialog")
             .forEach(t => new MDCDialog(t));
           document
             .querySelectorAll(".mdc-chip-set")
             .forEach(t => new MDCChipSet(t));
           document
             .querySelectorAll(".mdc-chip")
             .forEach(t => new MDCChip(t));
           document
             .querySelectorAll(this.selector)
             .forEach(t => new MDCRipple(t));

           //document.querySelectorAll('.mdc-data-table').forEach(t => new MDCDataTable(t));
         }
       }
