pragma solidity ^0.7.0;

import "./../../../../../../../../console.sol";

contract C {

  function test(bool b) public {
    console.log("string1");
    assert(b);
  }

}
