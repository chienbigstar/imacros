  $pages = {}; $this={};
  $this['get'] = function(url, func) {
    var request = new XMLHttpRequest();
    async = false;
    request.open('GET', url, async);
    request.send();
    return request.response;
  };
  $this['post'] = function(url, params, func) {
    var request = new XMLHttpRequest();
    async = false;
    request.open('POST', url, async);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send($.param(params));
    return request.response;
  };
  $pages['p1_makeScreen'] =  function() {
    thead = '<tr> <th>Graph</th> <th>Bet</th> <th>Profit</th> <th></th> </tr>';
    tbody = '<tr brokerID="1" symbolId="1"> <td>EURUSD</td> <td id="bet_1_1"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="2"> <td>AUDUSD</td> <td id="bet_1_2"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="3"> <td>GBPUSD</td> <td id="bet_1_3"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="4"> <td>USDJPY</td> <td id="bet_1_4"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="5"> <td>EURGBP</td> <td id="bet_1_5"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="6"> <td>EURJPY</td> <td id="bet_1_6"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="7"> <td>USDCAD</td> <td id="bet_1_7"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="8"> <td>USDCHF</td> <td id="bet_1_8"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="9"> <td>DIAMOND</td> <td id="bet_1_9"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="2" symbolId="1"> <td>Bitcoin</td> <td id="bet_2_1"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="2" symbolId="2"> <td>Ethereum</td> <td id="bet_2_2"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="2" symbolId="3"> <td>Bitcoin Cash</td> <td id="bet_2_3"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="2" symbolId="4"> <td>Ripple</td> <td id="bet_2_4"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="2" symbolId="5"> <td>Litecoin</td> <td id="bet_2_5"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="2" symbolId="6"> <td>IOTA</td> <td id="bet_2_6"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="2" symbolId="7"> <td>NEM</td> <td id="bet_2_7"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    tbody += '<tr brokerID="2" symbolId="8"> <td>Dash</td> <td id="bet_2_8"></td> <td></td> <td><input hidden class="action" type="checkbox"/></td> </tr>';
    html = '<div>Balance: <span id="balance"></span>$ Clock: <span id="clock"></span> Profit: <span id="profit">0</span>$ Win: <span id="win"></span></div><button id="time">Start</button><br>';
    html += '<style>table {color:black; font-family: arial, sans-serif; border-collapse: collapse; width: 100%; } td, th { border: 1px solid #dddddd; text-align: left; padding: 8px; }</style>';
    html += '<table>' + thead + tbody + '</table>';
    $('html').attr('style', 'background-image:none;color:black');
    $('html').html(html);
    actions = $('.action');
    $(actions).each(function() {
      $(this).click(
        async function() {
            parent = $(this).parent().parent();
            brokerID = $(parent).attr('brokerID');
            symbolId = $(parent).attr('symbolId');
            await $pages['p1_doPP'](brokerID, symbolId);
      });
    });
    $('#check_all').click(function() {
      $('.action').each(function() {
        $(this).click();
      });
    });
    $('#time').click(async function() {
       $(this).attr("disabled", true);
      $balance = $pages['p1_getBalance']();
      $('#balance').html($balance);
      $startMoney = $balance;
      $pages['p1_updateClock']();
      await $pages['p1_waitOverNode_2']();
      while(true) {
        $pages['p1_updateBalance']();
        $pages['p1_updateClock']();
        $('.action').each(function() {
          $(this).click();
        });
        await $pages['p1_waitOverNode_2']();
      }
    });
  }

  $this['wait'] = async function(t) {
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    await wait(t * 1000);
  }

  $pages['p1_doPP'] = async function(brokerID, symbolId) {
    if (status != 'order') {
      await $pages['p1_waitOverNode']();
      return 1;
    }
    if (second < 1) {
      await $pages['p1_waitOverNode']();
      return 1;
    }

    if ($grups[brokerID + '_' + symbolId]['inChuoi']) {
      if ($win) {
        $grups[brokerID + '_' + symbolId]['index'] = 0;
        $grups[brokerID + '_' + symbolId]['inChuoi'] = false;
        $grups[brokerID + '_' + symbolId]['color'] = null;
        bet = $('#bet_'+brokerID+'_'+symbolId);
        $(bet).html('');
        await $pages['p1_waitOverNode']();
        return 1;
      }
      tableColor = $pages['p1_getTableColor'](brokerID, symbolId);
      num_side = tableColor.length % 6;
      tl = tableColor.reverse();

      if (tl[0] == 'v') {
        $grups[brokerID + '_' + symbolId]['index'] = 0;
        $grups[brokerID + '_' + symbolId]['inChuoi'] = false;
        $grups[brokerID + '_' + symbolId]['color'] = null;
        bet = $('#bet_'+brokerID+'_'+symbolId);
        $(bet).html('');
        await $pages['p1_waitOverNode']();
        return 1;
      }
      else if ($grups[brokerID + '_' + symbolId]['color'] != tl[0]) {
        $grups[brokerID + '_' + symbolId]['index'] = $grups[brokerID + '_' + symbolId]['index'] + 1;
        if ($grups[brokerID + '_' + symbolId]['index'] == 4) {
          $grups[brokerID + '_' + symbolId]['index'] = 0;
          $grups[brokerID + '_' + symbolId]['inChuoi'] = false;
          $grups[brokerID + '_' + symbolId]['color'] = null;
          bet = $('#bet_'+brokerID+'_'+symbolId);
          $(bet).html('');
          await $pages['p1_waitOverNode']();
          return 1;
        }
      } else {
        $grups[brokerID + '_' + symbolId]['index'] = 0;
        $grups[brokerID + '_' + symbolId]['inChuoi'] = false;
        $grups[brokerID + '_' + symbolId]['color'] = null;
        bet = $('#bet_'+brokerID+'_'+symbolId);
        $(bet).html('');
        await $pages['p1_waitOverNode']();
        return 1;
      }

      lastColumn = [tl[0], tl[1], tl[2]];
      lastColumn = lastColumn.reverse();
      lastColumn = lastColumn.join('');
      chooseColor = $chooseColor[lastColumn];
      if (!chooseColor) {
        lastColumn = [tl[0], tl[1]];
        lastColumn = lastColumn.reverse();
        lastColumn = lastColumn.join('');
        chooseColor = $chooseColor[lastColumn];
      }
      $grups[brokerID + '_' + symbolId]['color'] = chooseColor;
    } else {
      tableColor = $pages['p1_getTableColor'](brokerID, symbolId);
      num_side = tableColor.length % 6;
      if (num_side != 2) {
        await $pages['p1_waitOverNode']();
        return 1;
      }
      tl = tableColor.reverse();
      lastColumn = [tl[0], tl[1]];
      lastColumn = lastColumn.reverse();
      lastColumn = lastColumn.join('');
      $grups[brokerID + '_' + symbolId]['color'] = $chooseColor[lastColumn];
    }
  
    $pages['p1_beat'](brokerID, symbolId);
    $grups[brokerID + '_' + symbolId]['inChuoi'] = true;
 
    return 1;
  }
  $pages['p1_beat'] = function(brokerID, symbolId) {
    color = $grups[brokerID + '_' + symbolId]['color'];
    choice = color == 'x' ? 1 : 2;
    amount = listMoney[$grups[brokerID + '_' + symbolId]['index']];

    params = {brokerId:brokerID,symbolId:symbolId,BetChoice:choice,BetFrom:'w',Stake:amount}

    $.ajax({
      url: 'https://order.aibroker.co/PlaceBet/Bet',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      data: params,
      success: function(data){
      }
    });
        bet = $('#bet_'+brokerID+'_'+symbolId);
        temp = $(bet).text();
        color = color == 'x' ? 'Xanh_' : 'Do_';
        $(bet).html(temp + '->' + color + amount);
  }
  $pages['p1_stopPP'] = function(brokerID, symbolId) {

  }
  $pages['p1_getLastListColor'] = function(list) {
    list = list.reverse();
    color = null;
    ll = 0;
    for (i=0; i<list.length; i++) {
      if (color == null) {
        color = list[i];
        ll = 1;
      } else if (color == list[i]) {
        ll++;
      } else {
        break;
      }
    }
    return {color:color, length:ll}
  }
  $pages['p1_getTableColor'] = function(brokerID, symbolId) {
    data = $this.get('https://order.aibroker.co/PriceHistory/Get?brokerId='+brokerID+'&symbolId='+symbolId);
    data = JSON.parse(data);
    data2 = [];
    $(data).each(function() {
      if (this['Result'] == 0) data2.push('v');
      else if (this['Result'] == 1) data2.push('x');
      else if (this['Result'] == 2) data2.push('d'); 
    });
    return data2;
  }
  $pages['p1_getVerticalTableColor'] = function(table) {
    r1 = [];
    for(i=0; i<=59; i = i+6) {
      if (table[i]) r1.push(table[i]);
    }
    r2 = [];
    for(i=1; i<=59; i = i+6) {
      if (table[i]) r2.push(table[i]);
    }
    r3 = [];
    for(i=2; i<=59; i = i+6) {
      if (table[i]) r3.push(table[i]);
    }
    r4 = [];
    for(i=3; i<=59; i = i+6) {
      if (table[i]) r4.push(table[i]);
    }
    r5 = [];
    for(i=4; i<=59; i = i+6) {
      if (table[i]) r5.push(table[i]);
    }
    r6 = [];
    for(i=5; i<=59; i = i+6) {
      if (table[i]) r6.push(table[i]);
    }
    return [r1,r2,r3,r4,r5,r6];
  }
  $pages['p1_updateClock'] =  function() {
    var n = (new Date).getTime();
    data = $this.get('https://order.aibroker.co/Home/GetServerTime');
    data = JSON.parse(data);
    var i = (new Date).getTime() - n;
    ServerTime = new Date(data.Data);
    ServerTime = new Date(ServerTime.getTime() + i);
    CurrentSecond = ServerTime.getUTCSeconds();
    if (CurrentSecond >= 0 && CurrentSecond < 30) {
      second = 29 - CurrentSecond;
      status = 'order';
    } else {
      second = 60 - CurrentSecond;
      status = 'waitting';
    }
    clock = $('#clock');
    $(clock).html(status + '_' + second);
  }
  $pages['p1_getTime'] =  function() {
    var n = (new Date).getTime();
  }
  $pages['p1_waitOverNode'] = async function() {
    if (status != 'order') {
      await $this.wait(5 + second);
      return 1;
    } else {
      await $this.wait(35 + second);
      return 1;
    }
  }

  $pages['p1_waitOverNode_2'] = async function() {
    if (status != 'order') {
      await $this.wait(2 + second);
      return 1;
    } else {
      await $this.wait(32 + second);
      return 1;
    }
  }
  $pages['p1_updateBalance'] = function() {
    newBalance= $pages['p1_getBalance']();
      if ($win) {
        $win = false;
        $('#win').html('');
      } else {
        if (newBalance > $balance) {
          $win = true;
          $('#win').html('true');
        } else {
          $win = false;
          $('#win').html('false');
        }
      }


    $balance = newBalance;
    $('#balance').html($balance);
    $profit = $balance - $startMoney;
    $('#profit').html($profit);
  }
  $pages['p1_getBalance'] = function() {
    data = $this.post('https://order.aibroker.co/Home/GetSettledInfo', {});
    data = JSON.parse(data);
    return data['Data']['NewBalance'];
  }
  /////////////////////////////////////////////
  listMoney = [1,2,1,1];
  listColor = ['x', 'd', 'd', 'd', 'x', 'x'];
  cus_length = null;
  allow = false;
  second = null;
  status = null;
  $index = 0;
  $startMoney = 0;
  $balance = 0;
  $profit = 0;
  $grups = {
    '1_1': {index: 0, inChuoi: false, color: null},
    '1_2': {index: 0, inChuoi: false, color: null},
    '1_3': {index: 0, inChuoi: false, color: null},
    '1_4': {index: 0, inChuoi: false, color: null},
    '1_5': {index: 0, inChuoi: false, color: null},
    '1_6': {index: 0, inChuoi: false, color: null},
    '1_7': {index: 0, inChuoi: false, color: null},
    '1_8': {index: 0, inChuoi: false, color: null},
    '1_9': {index: 0, inChuoi: false, color: null},
    '2_1': {index: 0, inChuoi: false, color: null},
    '2_2': {index: 0, inChuoi: false, color: null},
    '2_3': {index: 0, inChuoi: false, color: null},
    '2_4': {index: 0, inChuoi: false, color: null},
    '2_5': {index: 0, inChuoi: false, color: null},
    '2_6': {index: 0, inChuoi: false, color: null},
    '2_7': {index: 0, inChuoi: false, color: null},
    '2_8': {index: 0, inChuoi: false, color: null}
  };
  $chooseColor = {
    'dd': 'd',
    'xx': 'x',
    'dx': 'd',
    'xd': 'x',
    'dxx': 'd',
    'xdd': 'x'
  }
  $num = 1;
  firstMoney = 0;
  lastMoney = 0;
  $win = false;
  $updateReady = false;
  //////////////////////////////////////////// 
  $pages['p1_makeScreen']();
  $balance =  0;
  window.clearInterval(window['timerInterval']);
  window.clearInterval(window['clockInterval']);
  //////////////////

