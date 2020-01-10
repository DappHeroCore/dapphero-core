# DappHero Documentation

## Getting Started
DappHero is a no-code tool for building apps on Ethereum. The DappHero engine is compatible with a variety of no-code platforms like Webflow and Bubble, as well as static site generators like Gatsby or Next. DappHero works with custom React or HTML apps as well.

## How it Works
By linking up with the `id` tag found on any HTML element, builders can add custom Web3 logic to their app. The DappHero engine interprets your instructions and manages all the Web3 functionality behind the scenes. Users *will* need a MetaMask connection to connect.

## Config
*what is this gonna look like?*

## Adding Tags
Most no-code tools will let the user edit the `id` tag of an element. Find that input field before proceeding. 

For using Ethereum, all tags will begin with `"dh-eth"`. Each item in a tag, separated by a dash, is an argument to be interpreted by the engine. In this case, the first two arguments signal that the user wants to 1) use DappHero and 2) use Ethereum.


## Basic Web3 Features

### User Address
`dh-eth-address`

### User Ether Balance
`dh-eth-getBalance-user`

### Web3 Provider
`dh-eth-getProvider`

### Web3 Network Name
`dh-eth-getNetworkName`

### Web3 Network Id
`dh-eth-getNetworkId`

### Enable Web3 **required*
`dh-eth-enable`

Users will need to enable a Web3 connection for most DappHero features to work. Add this tag to a button feature prominently in your app. 


