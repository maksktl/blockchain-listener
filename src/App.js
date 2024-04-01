import './App.css';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const TOKENS = {
  usdc: {
    tokenName: 'USDC',
    conversionRate: 0.000283
  },
  usdt: {
    tokenName: 'USDT',
    conversionRate: 0.000284
  },
  ether: {
    tokenName: 'Ether',
    conversionRate: 1
  }
};

function getNumInToken(token, sum) {
  return sum / TOKENS[token].conversionRate;
}

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTotalBalance = (token) => {
    return data.reduce((total, row) => total + row[token], 0);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: handleParseComplete
    });
  };

  const handleParseComplete = (result) => {
    setData(result.data);
    setLoading(false);
  };

  return (
      <div>
        <p className="heading">Please, upload the CSV file:</p>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        {loading && <p className="subHeading">LOADING DATA...</p>}
        {!loading && data.length > 0 &&
            <>
              <p className="subHeading">Data Loaded Successfully!</p>
              <div>
                {Object.keys(TOKENS).map((token) => (
                    <p key={token} className="subHeading">
                      Total Holding Value in {TOKENS[token].tokenName}: {getTotalBalance(token)}
                    </p>
                ))}
                <div>
                  {Object.keys(TOKENS).map((token) => (
                      <p key={token} className="subHeading">
                        Average balance in {TOKENS[token].tokenName}: {getNumInToken(token, getTotalBalance(token) / data.length)}
                      </p>
                  ))}
                </div>
              </div>
            </>
        }
      </div>
  );
}

export default App;
