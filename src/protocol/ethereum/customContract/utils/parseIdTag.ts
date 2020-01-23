export const parseIdTag = (idTag: string) => {
  const contractName = idTag.match(/-name:([a-zA-Z]+)/)?.[1] ?? null
  const methodName = idTag.match(/-methodName:(.+?)(-|$)/)?.[1] ?? null
  const returnValueName = idTag.match(/-returnValue:(.+?)(-|$)/)?.[1] ?? null
  const argMatches = idTag.match(/arg:(.+?)(-|$)/g) ?? null
  const args = argMatches ? argMatches.map((match) => match.replace(/^arg:/, '').replace(/-$/, '')) : null
  const decimals = idTag.match(/-decimals:([0-9]+)/)?.[1] ?? null
  const display = idTag.match(/-display:([a-z]+)/)?.[1] ?? null

  return {
    contractName,
    methodName,
    returnValueName,
    argMatches,
    args,
    decimals,
    display,
  }
}
