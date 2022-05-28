const ethers = require('ethers')
require('dotenv').config();
const contractAddress = '0xd9140951d8aE6E5F625a02F5908535e16e3af964'
const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const provider = ethers.getDefaultProvider('http://localhost:8545')
const account = new ethers.Wallet(process.env.PRIVATEKEY, provider);


module.exports = async function(done){
    //Récupération du code ABI du DAI et de singleSwap
    const abiSingleSwap = [{"inputs":[{"internalType":"contract ISwapRouter","name":"_swapRouter","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"DAI","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"USDC","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolFee","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"swapExactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"name":"swapExactOutputSingle","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapRouter","outputs":[{"internalType":"contract ISwapRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
    const abiDai = [{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}, {"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
    const abiWETH = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]

    const singleSwapContract = new ethers.Contract(contractAddress, abiSingleSwap, account ); //récupération du contrat singleSwap déployé 
    const daiContract = new ethers.Contract(daiAddress, abiDai, account);//récupération du contrat Dai sur le mainnet 
    const wethContract = new ethers.Contract(wethAddress, abiWETH, account)
    const montant = ethers.BigNumber.from('123400000000000000000'); //1000 DAI envoyé

    //account.address approuve (ou authorise) le contrat singleSwap à dépenser un montant défini de DAI
    await daiContract.approve(contractAddress,montant, {from : account.address}); 

    await singleSwapContract.swapExactInputSingle(montant, { gasPrice: 20e10, gasLimit: 250000 });
    const balance = await wethContract.balanceOf(account.address)
    console.log("Balance WETH swappé = "+balance)
    done();
}
