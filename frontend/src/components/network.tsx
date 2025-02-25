import networks from "./networkData";
function DisplayNetworks(){
    console.log(networks);
    const handleSelect = (networkId: any) => {
        localStorage.setItem('networkId', networkId);
    }
    console.log(handleSelect(networks.id));
    
    return(
        <>
            <div>
                <h1>Select a Network</h1>
                <div>
                    {networks.map((network: any) => (
                        <div key={network.id}
                        onClick={() => handleSelect(networks.id)}
                        >
                            {network.name}
                            <img src={network.imag} alt={network.name} />
                            <p>{network.name}</p>
                        </div>

                    ) )
                    }
                </div>
            </div>

        </>
    )
}
export default DisplayNetworks;