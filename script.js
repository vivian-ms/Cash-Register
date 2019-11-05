var currency_value = {
  penny: 0.01,
  nickel: 0.05,
  dime: 0.1,
  quarter: 0.25,
  one: 1,
  five: 5,
  ten: 10,
  twenty: 20,
  hundred: 100
};

var cid = [];

$(function() {
  $('form').on('submit', function(evt) {
    evt.preventDefault();

    checkCashRegister( Number( $('#price').val() ), Number( $('#cash').val() ), getCID() );
  });

  $('#clear').on('click', function(evt) {
    $('#change_list').empty();
  });
});


function getCID() {
  let array = [];

  for (let i = 0; i < $('fieldset input').length; i++) {
    let currency = $('fieldset input')[i];
    let currency_name = $(currency).attr('id');

    if ($(currency).val()) {
      let currency_amount = Number ( ($(currency).val() * currency_value[currency_name]).toFixed(2) );

      array.push( [currency_name, currency_amount] );
    } else {
      array.push( [$(currency).attr('id'), 0] );
    }
  }

  return array;
}


function getChangeList(change) {
  let change_list = '';

  for (let i = 0; i < change.length; i++) {
    if (i === 0) {
      change_list += `${(change[i][0]).charAt(0).toUpperCase() + (change[i][0]).slice(1)}: ${change[i][1]}`;
    } else {
      change_list += `, ${(change[i][0]).charAt(0).toUpperCase() + (change[i][0]).slice(1)}: ${change[i][1]}`;
    }
  }

  return change_list;
}



function checkCashRegister(price, cash, cid) {
  let change = Number( (cash - price).toFixed(2) );

  // Get total cash in drawer
  let drawer = Number( cid.reduce((total, currency) => total + currency[1], 0).toFixed(2) );

  // If cash in drawer < change
  if (drawer < change) {
    $('#change_list').append('<li>Not enough funds to return change</li>');

    // Else if cash in drawer = change
  } else if (drawer === change) {
    $('#change_list').append(`<li>Change = ${getChangeList(cid)}</li>`);

    // Else cash in drawer > change
  } else {
    let return_change = [];

    for (let i = cid.length - 1; i >= 0; i--) {
      // If change >= currency value and will use all of the currency
      if (change >= currency_value[cid[i][0]] && change >= cid[i][1]) {
        return_change.push(cid[i]);
        change = Number( (change - cid[i][1]).toFixed(2) );

        // Else if change >= currency value but won't use all of the current currency
      } else if (change >= currency_value[cid[i][0]] && change < cid[i][1]) {
        let currency_amount = 0;

        while (change >= currency_value[cid[i][0]]) {
          change = Number( (change - currency_value[cid[i][0]]).toFixed(2) );

          currency_amount = Number( (currency_amount + currency_value[cid[i][0]]).toFixed(2) );
        }

        return_change.push( [cid[i][0], currency_amount] );
      }  // End else if
    }  // End for loop

    // Enough cash in drawer to return entire change amount
    if (change === 0) {
      $('#change_list').append(`<li>Change = ${getChangeList(return_change)}</li>`);

      // Else not enough cash in drawer to return entire change amount
    } else {
      $('#change_list').append('<li>Not enough funds to return change</li>');
    }
  }  // End else cash in drawer > change
}
