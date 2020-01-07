pragma solidity 0.5.0;

contract DappHeroTest {
    uint important = 20;
    bytes32 hello = "hello";
    
    function viewNoArgsMultipleReturn() public view returns(uint _important, bytes32 _hello){
        return (
            important,
            hello
        );
    }
    
    function viewMultipleArgsSingleReturn(address from, uint multiplier) public view returns(uint _balanceMultiplied){
        return address(from).balance * multiplier;
    }
    
    function viewMultipleArgsMultipleReturn(address from, uint multiplier) public view returns(uint _balanceMultiplied, bytes32 _hello){
        return (
            address(from).balance * multiplier,
            hello
        );
    }

    event EventTrigger(address indexed sender, uint value);

    function triggerEvent(uint value) public {
        emit EventTrigger (msg.sender, value);
    }
}