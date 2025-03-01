// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BookMark{
   struct BookMarkItem{
      address poolAddress;
      uint256 timestamp;
   }
   //mapping from user address to an array of BookMark
   mapping(address => bookMarked[]) public bookMarkData;

   event BookMarkAdded(address indexed user, address indexed poolAddress, uint256 timestamp);
   event BookMarkRemoved(address indexed user, address indexed poolAddress, uint256 timestamp);

   function addBookMark(address poolAddress) external {
      require(poolAddress != address(0), "Invalid pool address");
      bookMarkData[msg.sender].push(BookMarkItem(poolAddress, block.timestamp));
      emit BookMarkAdded(msg.sender, poolAddress, block.timestamp);
   }
   function removeBookMark(uint256 index) external {
      require(index < bookMarkData[msg.sender].length, "Invalid index");
      BookMarkItem memory bookMark = bookMarkData[msg.sender][index];

      //move the last element into the removed spot
      bookMarkData[msg.sender][index] = bookMarkData[msg.sender][bookMarkData[msg.sender].length - 1];
      bookMarkData[msg.sender].pop();

      emit BookMarkRemoved(msg.sender, bookMark.poolAddress, bookMark.timestamp);
   }

   function getBookMark() external view returns(bookMark[] memory) {
      return bookMarkData[msg.sender][poolAddress];   } 
}