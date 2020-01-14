// TODO: is there more precise naming for this?
export const getReturnValue = (retVal: any, copyPath: string) => {
  if (!retVal || !copyPath) return retVal

  const path = copyPath.split('.')
  let pathIndex = 0
  let finalReturnValue = retVal

  while (pathIndex < path.length) {
    finalReturnValue = finalReturnValue[path[pathIndex]]
    pathIndex++
  }

  return finalReturnValue
}
