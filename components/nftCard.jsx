import icon from '../public/copy.png';

export const NFTCard = ({ nft }) => {
    const minContractAddress = nft.contract.address.slice(0, 4) +
        "..." +
        nft.contract.address.slice(nft.contract.address.length - 5, nft.contract.address.length - 1);

    const copyOnClickboard = (contract) => {
        navigator.clipboard.writeText(contract);
    }

    return (
        <div className="w-1/4 flex flex-col shadow-xl rounded-md">
            <div className="rounded-md">
                <a target={"_blank"} href={`https://etherscan.io/token/${nft.contract.address}`} title={"View on etherscan"}>
                    <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
                </a>
            </div>
            <div className="flex flex-col y-gap-2 px-2 py-3 bg-gray-200 rounded-b-md h-110 ">
                <div className="">
                    <h2 className={`text-xl text-gray-800 ${nft.title ? "" : "hidden"}`}>
                        {nft.title}
                    </h2>
                    <p className="text-gray-500 italic">Id: {Number(nft.id.tokenId)}</p>
                    <p className="text-gray-500 italic" >Contract: {minContractAddress} &nbsp;
                        <img
                            className="relative bottom-1 inline-block cursor-pointer"
                            width="20"
                            src={icon.src}
                            title={"Copy contract address"}
                            onClick={() => copyOnClickboard(nft.contract.address)} />
                    </p>
                </div>
                <div className="flex-grow mt-2">
                    <p className="text-gray-800">{nft.description}</p>
                </div>
            </div>

        </div >
    )
}