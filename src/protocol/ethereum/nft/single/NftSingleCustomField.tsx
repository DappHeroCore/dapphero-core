import React from 'react'

export const NftSingleCustomField = ({ element, fieldData }) => {
  if (element.tagName === 'IMG') {
    element.src = fieldData
  } else {
    element.innerText = fieldData
  }
  return null
}

// TODO: Do we need to sanitzie the input?
// TODO: Do we need to consider if people have IPFS src data?

// TODO: Do we need to consider letting other element tags (like class) be set?

// TODO: How do we get the background color?
