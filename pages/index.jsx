import { useState, useEffect } from 'react';
import { NFTCard } from '../components/nftCard';

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [page, setPagination] = useState(0);
  const [nextToken, setNextToken] = useState();
  const [previousToken, setPreviousToken] = useState();

  useEffect(
    () => {
      fetchForCollection ? fetchNFTsForCollection() : fetchNFTs();
    },
    [page],
  );

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const api_key = "iE8Uo7aVv8BDUvhTI5fNIWueJxBvZGMk"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: 'GET'
    };

    if (!collection.length) {

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}&pageKey=${page}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  //todo pagination for collections ${nextToken ? "&startToken=" + nextToken : ""}

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = "iE8Uo7aVv8BDUvhTI5fNIWueJxBvZGMk"
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          onChange={(e) => { setWalletAddress(e.target.value) }}
          value={wallet}
          type={"text"}
          disabled={fetchForCollection}
          placeholder="Add your wallet address" />
        <input
          onChange={(e) => { setCollectionAddress(e.target.value) }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address" />
        <label className="text-gray-600 ">
          <input type={"checkbox"}
            className="mr-2"
            onChange={(e) => { setFetchForCollection(e.target.checked) }}
          />
          Fetch for collection
        </label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}
          onClick={() => {
            fetchForCollection ? fetchNFTsForCollection() : fetchNFTs();
          }}>
          Let's go!
        </button>
        {NFTs.length ?
          <>
            <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
              {
                NFTs.map(nft => {
                  return (
                    <NFTCard nft={nft}></NFTCard>
                  )
                })
              }
            </div>
            <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
              <button className={"m-auto disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}
                onClick={() => {
                  setPagination(page - 1);
                  setNextToken(previousToken);
                  setPreviousToken(previousToken); // todo find a way or rollback
                }}>
                &lt;&lt; Previous page
              </button>
              <button className={"m-auto disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}
                onClick={() => {
                  setPagination(page + 1);
                  setPreviousToken(nextToken);
                  setNextToken(nfts.nextToken);
                }}>
                Next page &gt;&gt;
              </button>
            </div>
          </>
          :
          <></>
        }
      </div>
    </div>
  )
}

export default Home