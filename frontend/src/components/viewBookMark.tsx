import { useEffect, useState } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { markABI } from "../utils/markABI";
import { markAddress } from "../utils/markAddress";
import "./BookMark.css"; // Import the CSS file

// Define the correct type based on the contract's return structure
interface BookMarkItem {
  poolAddress: string;
  timestamp: bigint;
}

const BookMarkedList = () => {
  const [bookmarks, setBookmarks] = useState<BookMarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookMarks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching bookmarks...");
      const ethereumProvider: any = await detectEthereumProvider();
      
      if (!ethereumProvider) {
        throw new Error("No Ethereum provider found. Please install MetaMask.");
      }
      
      // Check if user is connected
      const accounts = await ethereumProvider.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        await ethereumProvider.request({ method: 'eth_requestAccounts' });
      }
      
      const provider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      
      console.log("Using contract address:", markAddress);
      const contract = new ethers.Contract(markAddress, markABI, signer);

      // Log the current user address to verify we're checking the right account
      const address = await signer.getAddress();
      console.log("Current user address:", address);
      
      // Get bookmarks from contract with explicit debugging
      console.log("Calling getBookMarks()...");
      const rawBookmarks = await contract.getBookMarks();
      console.log("Raw bookmarks data:", rawBookmarks);
      
      // Make sure we're handling the data correctly
      // The contract returns an array of structs which ethers.js converts to an array-like object
      if (Array.isArray(rawBookmarks)) {
        // Process the array
        const processedBookmarks = rawBookmarks.map((item: any) => {
          console.log("Processing bookmark item:", item);
          return {
            poolAddress: item.poolAddress,
            timestamp: item.timestamp
          };
        });
        
        console.log("Processed bookmarks:", processedBookmarks);
        setBookmarks(processedBookmarks);
      } else {
        console.log("Bookmarks data is not an array:", typeof rawBookmarks);
        setBookmarks([]);
        setError("Unexpected data format from contract");
      }
    } catch (err: any) {
      console.error("Error fetching bookmarks:", err);
      setError(err.message || "Failed to fetch bookmarks");
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to remove a bookmark
  const removeBookmark = async (index: number) => {
    try {
      setLoading(true);
      const ethereumProvider: any = await detectEthereumProvider();
      if (!ethereumProvider) throw new Error("No Ethereum provider found.");
      
      const provider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(markAddress, markABI, signer);
      
      console.log("Removing bookmark at index:", index);
      // Call the removeBookMark function
      const tx = await contract.removeBookMark(index);
      console.log("Transaction sent:", tx.hash);
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      // Refresh the list
      await fetchBookMarks();
    } catch (err: any) {
      console.error("Error removing bookmark:", err);
      setError(err.message || "Failed to remove bookmark");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookMarks();
  }, []);

  return (
    <div className="bookmark-container">
      <h1 className="page-title">My Bookmarked Pools</h1>
      
      {loading && <p className="loading-message">Loading bookmarks...</p>}
      {error && <div className="error-container">
        <p><strong>Error:</strong> {error}</p>
      </div>}
      
      <button 
        onClick={fetchBookMarks} 
        className="refresh-button"
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh Bookmarks"}
      </button>
      
      {!loading && bookmarks && bookmarks.length > 0 ? (
        <ul className="bookmark-list">
          {bookmarks.map((bookmark, idx) => (
            <li key={idx} className="bookmark-item">
              <div className="bookmark-content">
                <div className="bookmark-details">
                  <p className="detail-label">Pool Address:</p>
                  <p className="detail-value">{bookmark.poolAddress}</p>
                  <p className="timestamp">
                    Added on: {new Date(Number(bookmark.timestamp) * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="bookmark-actions">
                  <button
                    onClick={() => removeBookmark(idx)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : !loading && (
        <div className="no-bookmarks-message">
          <p>No bookmarks found. Add some pools to your bookmarks first.</p>
        </div>
      )}
      
      {/* Debug information - can be removed in production */}
      <div className="debug-container">
        <h2 className="debug-title">Debug Information</h2>
        <p>Contract Address: {markAddress}</p>
        <p>Bookmarks Count: {bookmarks?.length || 0}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
      </div>
    </div>
  );
};

export default BookMarkedList;