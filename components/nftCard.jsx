import icon from '../public/copy.png';

export const NFTCard = ({ nft }) => {
    const contractAddress = nft.contract.address.slice(0, 6) +
        "..." +
        nft.contract.address.slice(nft.contract.address.length - 5, nft.contract.address.length - 1);

    const copyOnClickboard = (contract) => {
        navigator.clipboard.writeText(contract);
        console.log("Copied to clipboard " + contract);
    }

    return (
        <div className="w-1/4 flex flex-col ">
            <div className="rounded-md">
                <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
            </div>
            <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
                <div className="">
                    <h2 className={`text-xl text-gray-800 ${nft.title ? "" : "hidden"}`}>
                        {nft.title}
                    </h2>
                    <p className="text-gray-600">Id: {Number(nft.id.tokenId)}</p>
                    <p className="text-gray-600" >{contractAddress}</p>
                    <img src={icon} onClick={() => copyOnClickboard(contractAddress)} />
                </div>
                <div className="flex-grow mt-2">
                    <p className="text-gray-600">{nft.description}</p>
                </div>
            </div>

        </div>
    )
}