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

var cid = [];  // cid = [ [Name of currency, # of currency, monetary amount of currency] ]
var cash_array = [];  // cid = [ [Name of currency, # of currency, monetary amount of currency] ]


$(function() {
  // Disable 'Clear History' button on load
  $('#clear_list').prop('disabled', true);

  // Only allow number input and backspace
  $('fieldset input').on('keypress', function(evt) {
    if ( !(evt.key === 'Enter' || (evt.key >= 0 && evt.key <= 9)) ) {
      evt.preventDefault();
    }
  });

  // Only allow number input, backspace, and dot (.)
  $('#price').on('keypress', function(evt) {
    if ( !(evt.key === 'Enter' || evt.key === '.'|| (evt.key >= 0 && evt.key <= 9)) ) {
      evt.preventDefault();
    }
  });

  $('output').val('$0');

  // Calculate and display total cash in drawer and display status of register
  cashInDrawer(cid);

  // Update and display monetary amount of currency on input
  $('#cid_fieldset input').on('input', function(evt) {
    cid = getCID();
  });

  // Update and display monetary amount of currency received on input
  $('#paid_fieldset input').on('input', function(evt) {
    cash_array = getCashPaid();
  });

  $('#clear_currency').on('click', function(evt) {
    $('input').val('');
    $('output').val('$0');
    cid = getCID();
  });

  $('#default_currency').on('click', function(evt) {
    // Default # of each currency
    $('#penny').val(101);
    $('#nickel').val(41);
    $('#dime').val(31);
    $('#quarter').val(17);
    $('#one').val(90);
    $('#five').val(11);
    $('#ten').val(2);
    $('#twenty').val(3);
    $('#hundred').val(1);

    // Calculate and display monetary amount of each currency and total cash in drawer and display status of register
    cid = getCID();
  });

  $('form').on('submit', function(evt) {
    evt.preventDefault();

    cash_array = getCashPaid();

    checkCashRegister(
      Number( $('#price').val() ),
      totalCashPaid(cash_array),
      getCID()
    );

    $('#clear_list').prop('disabled', false);
  });

  $('#clear_list').on('click', function(evt) {
    $('#change_list').empty();
    $('#clear_list').prop('disabled', true);
  });
});  // End ready()



function updateRegisterStatus(cash) {
  // Register is open
  if (cash > 0) {
    $('#register_status').text('Cash register is open')
      .removeClass('closed')
      .addClass('open');

    // Allow use of inputs for amount due and amount paid and button to calculate change
    $('#price, #paid_fieldset input, #calculate').prop('disabled', false);
    // Register is closed
  } else {
    $('#register_status').text('Cash register is closed. No money in drawer')
      .removeClass('open')
      .addClass('closed');

    // Disable inputs for amount due and amount paid and button to calculate change
    $('#price, #paid_fieldset input, #calculate').prop('disabled', true);
  }
}  // End updateRegisterStatus()



function getCID() {
  let array = [];  // array = [ [Name of currency, # of currency, monetary amount of currency] ]

  // 1) Calculate the monetary amount of each currency
  for (let i = 0; i < $('#cid_fieldset input').length; i++) {
    let currency = $('#cid_fieldset input')[i];
    let currency_name = $(currency).attr('id');

    if ($(currency).val()) {
      let currency_amount = Number ( ($(currency).val() * currency_value[currency_name]).toFixed(2) );

      array.push([
        currency_name,
        Number( $(currency).val() ),
        currency_amount
      ]);

      // Display monetary amount of currency
      $(currency).next().val( `$${currency_amount}` );

      // Else if input field is empty, amount defaults to 0
    } else {
      array.push( [currency_name, 0, 0] );
      $(currency).next().val('$0');
    }
  }  // End for loop

  // 2) Calculate and display the total cash in drawer and display status of register
  cashInDrawer(array);

  return array;
}  // End getCID()



function getCashPaid() {
  // 1) Calculate the monetary amount of each currency received
  let array = [];

  for (let i = 0; i < $('#paid_fieldset input').length; i++) {
    let currency = $('#paid_fieldset input')[i];
    let currency_name = ( $(currency).attr('id') ).substring(0, ( $(currency).attr('id') ).length - 5);

    if ($(currency).val()) {
      let currency_amount = Number ( ($(currency).val() * currency_value[currency_name]).toFixed(2) );

      array.push([
        currency_name,
        Number( $(currency).val() ),
        currency_amount
      ]);

      // Else if input field is empty, amount defaults to 0
    } else {
      array.push( [currency_name, 0, 0] );
    }
  }  // End for loop

  // 2) Calculate and display the total cash received
  totalCashPaid(array);

  return array;
}  // End getCashPaid()



function cashInDrawer(array) {
  // 1) Calculate total cash in drawer
  let total = Number( array.reduce((total, currency) => total + currency[2], 0).toFixed(2) );

  // 2) Display status of register
  updateRegisterStatus(total);

  // 3) Display total cash in drawer
  $('#total_cash').text( `$${total}` );

  return total;
}  // End cashInDrawer()



function totalCashPaid(array) {
  // 1) Calculate total cash received
  let total = Number( array.reduce((total, currency) => total + currency[2], 0).toFixed(2) );

  // 2) Display total cash in drawer
  $('#cash_paid').text( `$${total}` );

  return total;
}


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



function updateCurrency(cid, cash_array, change_array) {
  // 1) Update amount of each currency after receiving cash and returning change
  for (let i = 0, j = 0; i < cid.length; i++, j++) {
    cid[i][1] = Number( (cid[i][1] + cash_array[j][1]).toFixed(2) );
    cid[i][2] = Number( (cid[i][2] + cash_array[j][2]).toFixed(2) );

    for (let k = 0; k < change_array.length; k++) {
      if (cid[i][0] === change_array[k][0]) {
        cid[i][1] = Number( (cid[i][1] - change_array[k][1]).toFixed(2) );
        cid[i][2] = Number( (cid[i][2] - change_array[k][2]).toFixed(2) );
      }
    }  // End k for loop
  } // End i, j for loop


  cid.forEach((currency) => {
    // 2) Update the # of each currency displayed
    $( `#${currency[0]}` ).val( currency[1] );

    // 3) Update the monetary amount of each currency displayed
    $( `#${currency[0]}` ).next().val( `$${currency[2]}` );
  });

  // 3) Update and display the total cash in drawer and display the status of the register
  cashInDrawer(cid);

  return cid;
}  // End updateCurrency()



function checkCashRegister(price, cash, cid) {
  let change = Number( (cash - price).toFixed(2) );

  // Get total cash in drawer
  let drawer = cashInDrawer(cid);

  // Amount paid < amount due
  if (change < 0) {
    $('#change_list').append(
      `<li>
        Total Amount Due: $${price} <br />
        Amount Paid: $${cash} <br />
        Customer didn't pay enough, he/she still owes $${-change}
      </li>`
    );

    // Amount paid = amount due
  } else if (change === 0) {
    $('#change_list').append(
      `<li>
        Total Amount Due: $${price} <br />
        Amount Paid: $${cash} <br />
        The exact amount was paid, no change is due
      </li>`
    );

    // Amount paid > amount due
  } else {
    // If cash in drawer < change
    if (drawer < change) {
      $('#change_list').append(
        `<li>
          Total Amount Due: $${price} <br />
          Amount Paid: $${cash} <br />
          Change: $${change} <br />
          Cash in register not enough to return change
        </li>`
      );

      // Else if cash in drawer = change
    } else if (drawer === change) {
      // Filter through cid for non-zero currencies
      let change_amount = cid.filter((arr) => arr[2] !== 0);

      $('#change_list').append(
        `<li>
          Total Amount Due: $${price} <br />
          Amount Paid: $${cash} <br />
          Change: $${change} (${getChangeList(change_amount)})
          </li>`
        );

      // Update the amount of each currency and status of register after returning change
      cid = updateCurrency(cid, cash_array, change_amount);

      // Else cash in drawer > change
    } else {
      let change_amount = [];

      for (let i = cid.length - 1; i >= 0; i--) {
        if (cid[i][2] === 0) {
          continue;  // Skip zero currencies
        } else {
          // If change >= currency value and will use all of the currency
          if (change >= currency_value[cid[i][0]] && change >= cid[i][2]) {
            change_amount.push(cid[i]);
            change = Number( (change - cid[i][2]).toFixed(2) );

            // Else if change >= currency value but won't use all of the current currency
          } else if (change >= currency_value[cid[i][0]] && change < cid[i][2]) {
            let currency_amount = 0;  // Monetary amount of currency used

            while (change >= currency_value[cid[i][0]]) {
              change = Number( (change - currency_value[cid[i][0]]).toFixed(2) );

              currency_amount = Number( (currency_amount + currency_value[cid[i][0]]).toFixed(2) );
            }

            change_amount.push([
              cid[i][0],
              Number( (currency_amount / currency_value[cid[i][0]]).toFixed(2) ),
              currency_amount
            ]);
          }  // End else if change >= currency value but won't use all of current currency
        }  // End else if non-zero currency
      }  // End for loop

      // Enough cash in drawer to return entire change amount
      if (change === 0) {
        $('#change_list').append(
          `<li>
            Total Amount Due: $${price} <br />
            Amount Paid: $${cash} <br />
            Change: $${(cash - price).toFixed(2)} (${getChangeList(change_amount)})
          </li>`
        );

        // Update amount of each currency and status of register after returning change
        cid = updateCurrency(cid, cash_array, change_amount);

        // Else not enough cash in drawer to return entire change amount
      } else {
        $('#change_list').append(
          `<li>
            Total Amount Due: ${price} <br />
            Amount Paid: ${cash} <br />
            Change: $${(cash - price).toFixed(2)} <br />
            Cash in register not enough to return change
          </li>`
        );
      }
    }  // End else cash in drawer > change
  }  // End amount paid > amount due

  $('#price, #paid_fieldset input').val('');
  cash_array = getCashPaid();
}  // End checkCashRegister()
