import './App.css';
import React, {useEffect, useState} from 'react'
import 'web3'
import Web3 from "web3";

let ADRESSES = [];
let BALANCES = [];
let SUM = 0;

function getNumInToken(token, sum) {
  if (token === "USDT") {
    return sum / 0.000284;
  }
  if (token === "BNB") {
    return sum / 0.164628;
  }
  if (token === "stETH") {
    return sum / 0.996273;
  }
  if (token === "USDC") {
    return sum / 0.000283;
  }
  if (token === "TonCoin") {
    return sum / 0.001470;
  }
  if (token === "SHIBA INU") {
    return sum / 0.0000000084;
  }
  if (token === "LINK") {
    return sum / 0.005233;
  }
  if (token === "Wrapped BTC") {
    return sum / 19.783952;
  }
  if (token === "TRON") {
    return sum / 0.000035;
  }
}

async function getTokensHolders(tokenAdress, page) {
  let promises = [];
  promises.push(fetch(`https://api.chainbase.online/v1/token/holders?chain_id=1&contract_address=${tokenAdress}&page=${page}&limit=100`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.REACT_APP_CHAINBASE_API,
      'accept': 'application/json'
    }
  }).then(response => response.json())
    .then(data => ADRESSES = [].concat(ADRESSES, data.data))
    .catch(error => console.error(error)));
  await Promise.all(promises)
}

async function getBalanceEth(address) {
  if(address.length > 0) {
    let promises = [];
    const web3 = new Web3(process.env.REACT_APP_INFURA_URL_API);
    promises.push(web3.eth.getBalance(address
    ).then(data => {
      BALANCES.push(Number(data) / Math.pow(10, 18));
      SUM += Number(data) / Math.pow(10, 18);
    }
    ).catch(err => {}));
    await Promise.all(promises)
  }
}

function App() {
  const [ready, setReady] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [readyNext, setReadyNext] = useState(false);
  const [token, setToken] = useState('');

  const usdtToken = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  const stETHToken = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
  const bnbToken = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52';
  const USDCToken = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const TONCOINToken = '0x582d872A1B094FC48F5DE31D3B73F2D9bE47def1';
  const SHIBToken = '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE';
  const LINKToken = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
  const WBTCToken = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
  const TRONToken = '0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5';
  const UNIToken = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';

  async function getAll() {
    for(let i = 1; i <= 2; i++) {
      await getTokensHolders(token, i);
    }
  }

  async function getAllBalances() {
    for(let i = 1; i < ADRESSES.length; i++) {
      await getBalanceEth(ADRESSES[i]);
    };
  }

  useEffect(() => {
    setReady(false);
    ADRESSES = []
    if(token) {
      getAll().then(()=>setReady(true)).catch(err=>{});
    }
  }, [token]);

  useEffect(() => {
    setReadyNext(false);
    if (ready) {
      getAllBalances().then(() => setReadyNext(true)).catch(err => {});
    }
  }, [ready]);

  console.log(BALANCES);

  return (
    <div>
      <p className="heading"> Please, choose the token from top10:</p>
      <div className="container">
        <button onClick={
          () => {
            setToken(usdtToken);
            setTokenName("USDT");
          }
        }>USDT</button>
        <button onClick={
          () => {
            setToken(stETHToken);
            setTokenName("stETH");
          }}>stETH</button>
        <button onClick={
          () => {
            setToken(bnbToken);
            setTokenName("BNB");
          }}>BNB</button>
        <button onClick={
          () => {
            setToken(USDCToken);
            setTokenName("USDC");
          }}>USDC</button>
        <button onClick={
          () => {
            setToken(TONCOINToken);
            setTokenName("TonCoin");
          }}>TonCoin</button>
        <button onClick={
          () => {
            setToken(SHIBToken);
            setTokenName("SHIBA INU");
          }}>SHIBA INU</button>
        <button onClick={
          () => {
            setToken(LINKToken);
            setTokenName("LINK");
          }}>LINK</button>
        <button onClick={
          () => {
            setToken(WBTCToken);
            setTokenName("Wrapped BTC");
          }}>Wrapped BTC</button>
        <button onClick={
          () => {
            setToken(TRONToken);
            setTokenName("TRON");
          }}>TRON</button>
        <button onClick={
          () => {
            setToken(UNIToken);
            setTokenName("Uniswap");
          }}>Uniswap</button>
      </div>
      <p className="subHeading">Choosen Token address: <span className="bold">{tokenName}</span></p>
      {token && !ready && <p className="subHeading">LOADING ADDRESSES....</p>
      }
      {token && ready && !readyNext && <p className="subHeading">LOADING BALANCES....</p>
      }
      {token && ready && readyNext &&
        <div>
          <p className="subHeading">
            Total Holding Value in ETH= {SUM}
          </p>
          <p className="subHeading">
            Total Holding Value in {tokenName} = {getNumInToken(tokenName, SUM)}
          </p>
          <p className="subHeading">
            Average balance in ETH = {SUM / ADRESSES.length}
          </p>
          <p className="subHeading">
            Average balance in {tokenName} = {getNumInToken(tokenName, SUM / ADRESSES.length)}
          </p>
        </div>
      }
    </div>
  );
}

export default App;
