import { useState, useEffect } from 'react';
import { NFTCard } from '../components/nftCard';

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [response, setResponce] = useState({});
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [pages, updatePages] = useState([0]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(
    () => {
      fetchForCollection ? fetchNFTsForCollection() : fetchNFTs();
    },
    [currentPage],
  );

  const fetchNFTs = async () => {
    let nfts;
    var requestOptions = {
      method: 'GET'
    };
    const api_key = "iE8Uo7aVv8BDUvhTI5fNIWueJxBvZGMk"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${pages[currentPage]}&pageSize=99`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}&pageKey=${pages[currentPage]}&pageSize=99`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log("Response:", nfts)
      setResponce(nfts);
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = "iE8Uo7aVv8BDUvhTI5fNIWueJxBvZGMk"
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${pages[currentPage]}&limit=99`;

      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());

      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setResponce(nfts);
        setNFTs(nfts.nfts);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">

        <input
          className='w-2/5 bg-slate-200 p-2 rounded-lg text-gray-800 text-center focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-300'
          onChange={(e) => { setWalletAddress(e.target.value) }}
          value={wallet}
          type={"text"}
          disabled={fetchForCollection}
          placeholder="Add your wallet address" />

        <input
          className='w-2/5 bg-slate-200 p-2 rounded-lg text-gray-800 text-center focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50'
          onChange={(e) => { setCollectionAddress(e.target.value) }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address" />

        <label className="text-gray-600 ">
          <input type={"checkbox"}
            className="mr-2"
            onChange={(e) => { setFetchForCollection(e.target.checked) }}
          />
          Fetch whole collection
        </label>
        <button
          className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}
          onClick={() => {
            updatePages([0]);
            setCurrentPage(0); // hack activate fetching effect
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
            <div className='flex flex-wrap gap-y-12 mt-10 w-5/6 gap-x-2 justify-center'>
              <button
                className={"m-auto disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 rounded-sm w-1/5"}
                disabled={currentPage === 0}
                onClick={() => {
                  if (currentPage !== 0)
                    setCurrentPage(currentPage - 1);
                }}>
                &lt;&lt; Previous page
              </button>

              <span className='text-center'>
                {`[${1 + 99 * currentPage} - 
                ${response.totalCount - 99 * currentPage < 99 ?
                    response.totalCount :
                    99 * (currentPage + 1)
                  }]`}<br />
                {`Of ${response.totalCount} NFTs`}
              </span>

              <button
                className={"m-auto disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 rounded-sm w-1/5"}
                disabled={response.totalCount - 99 * currentPage < 99}
                onClick={() => {
                  if (pages.length === currentPage + 1) {
                    if (fetchForCollection)
                      updatePages(pages => [...pages, response.nextToken]);
                    else
                      updatePages(pages => [...pages, response.pageKey]);
                  }

                  setCurrentPage(currentPage + 1);
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