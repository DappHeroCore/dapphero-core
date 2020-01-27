import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useWeb3Test } from '../__mocks__/useWeb3Test'
import { EthNetworkInfo } from '../protocol/ethereum/network/EthNetworkInfo'
import { Reducer } from '../protocol/ethereum/network/Reducer'

jest.mock('../__mocks__/useWeb3Test')

describe('get network data', () => {
  it('renders the network id', () => {
    document.body.innerHTML = '<div id="dh-network-id" >No network provided</div>'
    const element = document.getElementById('dh-network-id')
    // mocked(useWeb3Test).mockReturnValue({ networkId: 'dappherotest' })
    // mocked(useWeb3Test).mockReturnValue({ networkId: 'dappherotest', networkName: 'dh' })
    const { result } = renderHook(() => useWeb3Test())
    act(() => {
      result.current.networkId = 'dappherotest'
    })
    const { container } = render(<Reducer element={element} configuration={{}} />)
    console.log('container', container)
  })

})

