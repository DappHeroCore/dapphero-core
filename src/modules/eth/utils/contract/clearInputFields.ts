// TODO: Best way to clean input fields?
// TODO: the functionality for clearning input fields should be extracted to external function
// Timeout set because function needs to pull value first

export const clearInputFields = (inputFields) => {
  setTimeout(() => {
    inputFields.forEach((module) => {
      document.getElementById(module.element.id).value = null
    })
    return null
  }, 10000) // TODO: clean when tx confirms
}
