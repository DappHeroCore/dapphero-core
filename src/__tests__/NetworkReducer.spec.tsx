import React from 'react'
import { shallow } from 'enzyme'
import { renderHook, act } from '@testing-library/react-hooks'
import { render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import * as hooks from 'hooks'
import { useWeb3Test } from '../__mocks__/useWeb3Test'
import { EthNetworkInfo } from '../protocol/ethereum/network/EthNetworkInfo'
import { Reducer } from '../protocol/ethereum/network/Reducer'

// jest.mock(hooks.useDappHeroWeb3, true)

describe('get network data', () => {
  it('renders the network id', () => {
    document.body.innerHTML = '<div id="dh-network-id" >No network provided</div>'
    const element = document.getElementById('dh-network-id')

    jest.spyOn(React, 'useEffect').mockImplementation(useWeb3Test)
    const component = shallow(<Reducer element={element} configuration={{}} />)

    // mocked(useWeb3Test).mockReturnValue({ networkId: 'dappherotest', networkName: 'dappherotest' })
    // mocked(useWeb3Test).mockReturnValue({ networkId: 'dappherotest', networkName: 'dh' })
    // const { result } = renderHook(() => useWeb3Test())
    // act(() => {
    //   result.current.networkId = 123
    //   result.current.networkName = { network: 'dappherotest'}
    // })
    // const { container } = render(<Reducer element={element} configuration={{}} />)
    console.log('component', component)
  })

})

