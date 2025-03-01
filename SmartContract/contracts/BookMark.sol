// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BookMark {
    struct BookMarkItem {
        address poolAddress;
        uint256 timestamp;
    }
    
    // Mapping from user address to an array of BookMarkItem
    mapping(address => BookMarkItem[]) public bookMarkData;
    
    event BookMarkAdded(address indexed user, address indexed poolAddress, uint256 timestamp);
    event BookMarkRemoved(address indexed user, address indexed poolAddress, uint256 timestamp);
    
    function addBookMark(address poolAddress) external {
        require(poolAddress != address(0), "Invalid pool address");
        bookMarkData[msg.sender].push(BookMarkItem(poolAddress, block.timestamp));
        emit BookMarkAdded(msg.sender, poolAddress, block.timestamp);
    }
    
    function removeBookMark(uint256 index) external {
        require(index < bookMarkData[msg.sender].length, "Invalid index");
        BookMarkItem memory bookmark = bookMarkData[msg.sender][index];
        
        // Move the last element into the removed spot
        bookMarkData[msg.sender][index] = bookMarkData[msg.sender][bookMarkData[msg.sender].length - 1];
        bookMarkData[msg.sender].pop();
        
        emit BookMarkRemoved(msg.sender, bookmark.poolAddress, bookmark.timestamp);
    }
    
    function getBookMarks() external view returns(BookMarkItem[] memory) {
        return bookMarkData[msg.sender];
    }
    
    // check if the user has bookmarked the pool
    function isBookMarked(address poolAddress) external view returns(bool) {
        BookMarkItem[] memory userBookmarks = bookMarkData[msg.sender];
        for (uint i = 0; i < userBookmarks.length; i++) {
            if (userBookmarks[i].poolAddress == poolAddress) {
                return true;
            }
        }
        return false;
    }
}