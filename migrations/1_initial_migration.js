const Migrations = artifacts.require("Migrations");
const SingleSwap = artifacts.require("SwapExamples")
const addressSwapRouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'


module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(SingleSwap, addressSwapRouter);
};
