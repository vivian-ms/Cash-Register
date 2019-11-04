var currency_value = {
  'PENNY': 0.01,
  'NICKEL': 0.05,
  'DIME': 0.1,
  'QUARTER': 0.25,
  'ONE': 1,
  'FIVE': 5,
  'TEN': 10,
  'TWENTY': 20,
  'ONE HUNDRED': 100
};


function checkCashRegister(price, cash, cid) {
  let change = Number( (cash - price).toFixed(2) );

  // Get total cash in drawer
  let drawer = Number( cid.reduce((total, currency) => total + currency[1], 0).toFixed(2) );

  // If cash in drawer < change
  if (drawer < change) {
    return {
      status: 'INSUFFICIENT_FUNDS',
      change: []
    };

    // Else if cash in drawer = change
  } else if (drawer === change) {
    return {
      status: 'CLOSED',
      change: cid
    };

    // Else cash in drawer > change
  } else {
    let output = {
      status: '',
      change: []
    };

    for (let i = cid.length - 1; i >= 0; i--) {
      // If change >= currency value and will use all of the currency
      if (change >= currency_value[cid[i][0]] && change >= cid[i][1]) {
        output.change.push(cid[i]);
        change = Number( (change - cid[i][1]).toFixed(2) );

        // Else if change >= currency value but won't use all of the current currency
      } else if (change >= currency_value[cid[i][0]] && change < cid[i][1]) {
        let currency_amount = 0;

        while (change >= currency_value[cid[i][0]]) {
          change = Number( (change - currency_value[cid[i][0]]).toFixed(2) );

          currency_amount = Number( (currency_amount + currency_value[cid[i][0]]).toFixed(2) );
        }

        output.change.push( [cid[i][0], currency_amount] );
      }  // End else if
    }  // End for loop

    // Enough cash in drawer to return entire change amount
    if (change === 0) {
      output.status = 'OPEN';
      return output;

      // Else not enough cash in drawer to return entire change amount
    } else {
      output.status = 'INSUFFICIENT_FUNDS';
      output.change = [];
      return output;
    }
  }  // End else cash in drawer > change
}
