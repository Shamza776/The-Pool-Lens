import { useState } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { markABI } from '../utils/markABI';
import { markAddress } from '../utils/markAddress';

type Props = {
  poolAddress: string;
};

const BookMark = ({ poolAddress }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToBookMark = async () => {
    setLoading(true);
    setError(null);
    try {
      const providerInjected = await detectEthereumProvider();
      if (providerInjected) {
        const provider = new ethers.BrowserProvider(providerInjected as any);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(markAddress, markABI, signer);
        const tx = await contract.addBookMark(poolAddress);
        await tx.wait();
      } else {
        setError('Please install MetaMask');
      }
    } catch (error) {
        console.error("Transaction error",error);
      setError('Failed to add to book mark');
    } finally {
      setLoading(false);
    }
  };  return (
    <div>
        <button onClick={addToBookMark} disabled={loading || !!error}>
        {loading ? 'Adding to book mark...' : 'Add to book mark'}
        </button>
        {error && <p> Error: {error}</p>}
    </div>
  );

  }
  export default BookMark;
