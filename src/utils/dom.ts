// Attributes
export const createMethodAttribute = (id): string => `[data-dh-property-method-id="${id}"]`
export const createOutputAttribute = (): string => `[data-dh-property-outputs]`
export const createOutputNameAttribute = (name = ''): string => `[data-dh-property-output-name="${name}"]`
export const createInputAttribute = (name = ''): string => `[data-dh-property-input-name="${name}"]`

// Selectors
export const createParentSelector = (id: string): string => `div${createMethodAttribute(id)}`
export const createSubmitButtonSelector = (id: string): string => `button${createMethodAttribute(id)}`
export const createInputSelector = (id: string, inputName: string): string => `input${createMethodAttribute(id)}${createInputAttribute(inputName)}`
export const createOutputDivSelector = (id: string): string => `div${createMethodAttribute(id)}${createOutputAttribute()}`
export const createOutputNameDivSelector = (id: string, outputName?: string): string => `div${createMethodAttribute(id)}${createOutputNameAttribute(outputName)}`
