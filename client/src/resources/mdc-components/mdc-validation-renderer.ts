import {
  ValidationRenderer,
  RenderInstruction,
  ValidateResult
} from 'aurelia-validation';

/**
 * MdcValidationRenderer
 */
export class MdcValidationRenderer implements ValidationRenderer {
  public render(instruction: RenderInstruction): void {
    for (const { result, elements } of instruction.unrender) {
      for (const element of elements) {
        this.remove(element, result);
      }
    }

    for (const { result, elements } of instruction.render) {
      for (const element of elements) {
        this.add(element, result);
      }
    }
  }

  public add(element: Element, result: ValidateResult): void {
    if (result.valid) {
      return;
    }

    const textFieldElement = element.closest('.mdc-text-field');

    if (textFieldElement) {
      textFieldElement.classList.add('mdc-text-field--invalid');
      return;
    }

    const selectElement = element.closest('.mdc-select');

    if (selectElement) {
      selectElement.classList.add('mdc-select--invalid');
      return;
    }

  }

  public remove(element: Element, result: ValidateResult): void {
    if (result.valid) {
      return;
    }
  }
}
