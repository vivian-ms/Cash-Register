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

var cid = [];  // cid = [ [Name of currency, # of currency, total monetary value of currency] ]

$(function() {
  // Only allow number input and backspace
  $('input').on('keypress', function(evt) {
    if ( !(evt.key === 'Enter' || evt.key === '.' || (evt.key >= 0 && evt.key <= 9)) ) {
      evt.preventDefault();
    }
  });

  $('output').val('$0');

  // Calculate and display total cash in drawer
  cashInDrawer(cid);

  // Update and display total monetary value of currency on input
  $('fieldset input').on('input', function(evt) {
    cid = getCID();
  });

  $('#clear_currency').on('click', function(evt) {
    $('input').val('');
    $('output').val('$0');
    cid = getCID();
  });

  $('#default_currency').on('click', function(evt) {
    // Default number of each currency
    $('#penny').val(101);
    $('#nickel').val(41);
    $('#dime').val(31);
    $('#quarter').val(17);
    $('#one').val(90);
    $('#five').val(11);
    $('#ten').val(2);
    $('#twenty').val(3);
    $('#hundred').val(1);

    // Calculate and display monetary value of each currency and total cash in drawer
    cid = getCID();
  });

  $('form').on('submit', function(evt) {
    evt.preventDefault();

    checkCashRegister(
      Number( $('#price').val() ),
      Number( $('#cash').val() ),
      getCID()
    );
  });

  $('#clear').on('click', function(evt) {
    $('#change_list').empty();
  });
});  // End ready()



function getCID() {
  let array = [];  // array = [ [Name of currency, # of currency, total monetary value of currency] ]

  // 1) Calculate the total monetary value of each currency
  for (let i = 0; i < $('fieldset input').length; i++) {
    let currency = $('fieldset input')[i];
    let currency_name = $(currency).attr('id');

    if ($(currency).val()) {
      let currency_amount = Number ( ($(currency).val() * currency_value[currency_name]).toFixed(2) );

      array.push([
        currency_name,
        Number( $(currency).val() ),
        currency_amount
      ]);

      // Display total monetary value of currency
      $(currency).next().val( `$${currency_amount}` );
    } else {
      array.push( [$(currency).attr('id'), 0, 0] );

      // Display monetary value of currency
      $(currency).next().val('$0');
    }
  }  // End for loop

  // 2) Calculate and display the total cash in drawer
  cashInDrawer(array);

  return array;
}  // End getCID()


function cashInDrawer(array) {
  // 1) Calculate total cash in drawer
  let total = Number( array.reduce((total, currency) => total + currency[2], 0).toFixed(2) );

  // 2) Display total cash in drawer
  $('#total_cash').text( `$${total}` );

  return total;
}  // End cashInDrawer()



function getChangeList(change) {
  let list = '';

  for (let i = 0; i < change.length; i++) {
    if (i === 0) {
      list += `${(change[i][0]).charAt(0).toUpperCase() + (change[i][0]).slice(1)}: ${change[i][1]}`;
    } else {
      list += `, ${(change[i][0]).charAt(0).toUpperCase() + (change[i][0]).slice(1)}: ${change[i][1]}`;
    }
  }

  return list;
}  // End getChangeList()



function checkCashRegister(price, cash, cid) {
  let change = Number( (cash - price).toFixed(2) );

  // Get total cash in drawer
  let drawer = cashInDrawer(cid);

  // If cash in drawer < change
  if (drawer < change) {
    $('#change_list').append('<li>Not enough funds to return change</li>');

    // Else if cash in drawer = change
  } else if (drawer === change) {
    // Filter through cid to only display non-zero currencies
    let change_amount = cid.filter((arr) => arr[2] !== 0);

    $('#change_list').append(`<li>Total Amount Due: $${price} <br /> Amount Paid: $${cash} <br /> Change: $${change} (${getChangeList(change_amount)})</li>`);

    // Else cash in drawer > change
  } else {
    let change_amount = [];

    for (let i = cid.length - 1; i >= 0; i--) {
      // Skip zero currencies
      if (cid[i][2] === 0) {
        continue;
      } else {
        // If change >= currency value and will use all of the currency
        if (change >= currency_value[cid[i][0]] && change >= cid[i][2]) {
          change_amount.push(cid[i]);
          change = Number( (change - cid[i][2]).toFixed(2) );

          // Else if change >= currency value but won't use all of the current currency
        } else if (change >= currency_value[cid[i][0]] && change < cid[i][2]) {
          let currency_amount = 0;

          while (change >= currency_value[cid[i][0]]) {
            change = Number( (change - currency_value[cid[i][0]]).toFixed(2) );

            currency_amount = Number( (currency_amount + currency_value[cid[i][0]]).toFixed(2) );
          }

          change_amount.push([
            cid[i][0],
            Number( (currency_amount / currency_value[cid[i][0]]).toFixed(2) ),
            currency_amount
          ]);
        }  // End else if change >= currency value but won't use all of the current currency
      }  // End else if non-zero currencies
    }  // End for loop

    // Enough cash in drawer to return entire change amount
    if (change === 0) {
      $('#change_list').append(`<li>Total Amount Due: $${price} <br /> Amount Paid: $${cash} <br /> Change: $${cash - price} (${getChangeList(change_amount)})</li>`);

      // Else not enough cash in drawer to return entire change amount
    } else {
      $('#change_list').append(`<li>Total Amount Due: ${price} <br /> Amount Paid: ${cash} <br /> Not enough funds to return change</li>`);
    }
  }  // End else cash in drawer > change

  $('#price, #cash').val('');
}  // End checkCashRegister()
