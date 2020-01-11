// TODO: Best way to clean input fields?
// TODO: the functionality for clearning input fields should be extracted to external function
// Timeout set because function needs to pull value first

/**
 * This function clears the input HTML fields on a users website after a transaction has been initiated.
 * @param inputFields {array} this is an array of HTML elements which represents input fields.
 */
export const clearInputFields = (inputFields) => {
  setTimeout(() => {
    inputFields.forEach((module) => {
      document.getElementById(module.element.id).value = null
    })
    return null
  }, 10000) // TODO: clean when tx confirms
}
