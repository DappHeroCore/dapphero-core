import { logger } from 'logger/logger'

export const getReturnValueWithCopyPath = (retVal: any, copyPath: string) => {
  if (!retVal || !copyPath) return retVal

  const path = copyPath.split('.') // ['owner', 'address']
  let pathIndex = 0
  let finalReturnValue = retVal

  while (pathIndex < path.length) {
    finalReturnValue = finalReturnValue[path[pathIndex]]
    if (finalReturnValue == null) {
      console.log(`warning no return value, return object is malformed. Key doesnot exist or contains null. Original
      values: retVal: ${retVal} copyPath: ${copyPath}`)
      console.log('Return value from retval: ')
      console.dir(retVal)
      break
    }
    pathIndex++
  }

  if (finalReturnValue == null) finalReturnValue = 'request not found...(error)'

  return finalReturnValue
}
