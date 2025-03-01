import { expect } from "chai";
import { ethers } from "hardhat";

describe("BookMark", function () {
  let bookMark: any;
  let owner: any;
  let addr1: any;
  const poolAddress = "0x0000000000000000000000000000000000000001"; // Example address

  before(async function () {
    [owner, addr1] = await ethers.getSigners();
    const BookMark = await ethers.getContractFactory("BookMark");
    bookMark = await BookMark.deploy();
    await bookMark.deploymentTransaction()?.wait();
  });

  it("should add a bookmark", async function () {
    await bookMark.connect(owner).addBookMark(poolAddress);
    const bookmarks = await bookMark.connect(owner).getBookMarks();
    expect(bookmarks.length).to.equal(1);
    expect(bookmarks[0].poolAddress).to.equal(poolAddress);
  });

  it("should remove a bookmark", async function () {
    await bookMark.connect(owner).addBookMark(poolAddress);
    await bookMark.connect(owner).removeBookMark(0);
    const bookmarks = await bookMark.connect(owner).getBookMarks();
    expect(bookmarks.length).to.equal(0);
  });

  it("should check if a pool is bookmarked", async function () {
    await bookMark.connect(owner).addBookMark(poolAddress);
    const isBookmarked = await bookMark.connect(owner).isBookMarked(poolAddress);
    expect(isBookmarked).to.be.true;

    const nonBookmarkedPoolAddress = "0x0000000000000000000000000000000000000002";
    const isNotBookmarked = await bookMark.connect(owner).isBookMarked(nonBookmarkedPoolAddress);
    expect(isNotBookmarked).to.be.false;
  });

  it("should revert when adding a bookmark with zero address", async function () {
    await expect(bookMark.connect(owner).addBookMark("0x0000000000000000000000000000000000000000")).to.be.revertedWith("Invalid pool address");
  });

  it("should revert when removing a bookmark with invalid index", async function () {
    await expect(bookMark.connect(owner).removeBookMark(0)).to.be.revertedWith("Invalid index");
  });
});
