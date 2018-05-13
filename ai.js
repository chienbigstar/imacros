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
    thead = '<tr> <th>Graph</th> <th>Bet</th> </tr>';
    tbody = '<tr brokerID="1" symbolId="1"> <td>EURUSD</td> <td id="bet_1_1"></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="2"> <td>AUDUSD</td> <td id="bet_1_2"></td>   </tr>';
    tbody += '<tr brokerID="1" symbolId="3"> <td>GBPUSD</td> <td id="bet_1_3"></td>   </tr>';
    tbody += '<tr brokerID="1" symbolId="4"> <td>USDJPY</td> <td id="bet_1_4"></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="5"> <td>EURGBP</td> <td id="bet_1_5"></td>  </tr>';
    tbody += '<tr brokerID="1" symbolId="6"> <td>EURJPY</td> <td id="bet_1_6"></td>  </tr>';
    tbody += '<tr brokerID="1" symbolId="7"> <td>USDCAD</td> <td id="bet_1_7"></td> </tr>';
    tbody += '<tr brokerID="1" symbolId="8"> <td>USDCHF</td> <td id="bet_1_8"></td>  </tr>';
    tbody += '<tr brokerID="1" symbolId="9"> <td>DIAMOND</td> <td id="bet_1_9"></td>   </tr>';

    html = '<button id="start">Start</button>  ListMoney: <input size="50" style="border:1px red solid" id="l_money" /> Chot Loi: <input style="border:1px red solid" id="c_loi" type="number"/>';
    html += '<div>Start Balance: <span id="balance"></span>$ Clock: <span id="clock"></span> Current Balance: <span id="profit">0</span>$ </div><br>';
    html += '<style>table {color:black; font-family: arial, sans-serif; border-collapse: collapse; width: 100%; } td, th { border: 1px solid #dddddd; text-align: left; padding: 8px; }</style>';
    html += '<table>' + thead + tbody + '</table>';
    $('html').attr('style', 'background:white;color:black');
    $('body').html(html);
    $('body').attr('style', 'background:white;color:black;margin-bottom:100px');
    window.onbeforeunload = function(){
      return "Refresh trang mà dang vào chu?i là sai sai dó.";
    }
    $('#start').click(async function() {
        $(event.target).attr("disabled", true);
        lMoney = $('#l_money').val();
        $('#l_money').attr("disabled", true);
        $listMoney = lMoney.split(',');
        $cLoi = parseFloat($('#c_loi').val());
        $('#c_loi').attr("disabled", true);
        while(true) {
          graph = $graphs[$indexGraph];
          brokerID = graph['brokerID'];
          symbolId = graph['symbolId'];
          await $pages['p1_doPP'](brokerID, symbolId);
        }
    });
    // actions = $('.action');
    // $(actions).each(function() {
    //   $(this).change(
    
    // });
  }

  $this['wait'] = async function(t) {
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    await wait(t * 1000);
  }

  $pages['p1_doPP'] = async function(brokerID, symbolId) {
    $pages['p1_updateClock']();
    if (status != 'order') {
      await $pages['p1_waitOverNode']();
      return 1;
    }
    if (second < 3) {
      await $pages['p1_waitOverNode']();
      return 1;
    }
    color = $listColor[$indexColor];
    $pages['p1_beat'](color, brokerID, symbolId);
    await $pages['p1_waitOverNode']();
    tableColor = $pages['p1_getTableColor'](brokerID, symbolId);
    tableColor = tableColor.reverse();
    if (tableColor[0] == 'v') {

    }
    else if (tableColor[0] != color) {
      $indexColor++;
      if ($indexColor > ($listMoney.length-1)) {
        window.close();
      }
    } else {
      bet = $('#bet_'+brokerID+'_'+symbolId);
      $(bet).html('');
      $indexColor = 0;
      $indexGraph = $indexGraph + 1;
      if ($indexGraph > 8) $indexGraph = 0;
    }
    $pages['p1_updateBalance']();
    loi = $balance - $startMoney;
    if (loi >= $cLoi) {
    	window.close();
    }
    return 1;
  }
  $pages['p1_beat'] = function(color, brokerID, symbolId) {
    choice = color == 'x' ? 1 : 2;
    amount = $listMoney[$indexColor];
    params = {brokerId:brokerID,symbolId:symbolId,BetChoice:choice,BetFrom:'w',Stake:amount}

    $this.post('https://order.aibroker.co/PlaceBet/Bet', params);
    bet = $('#bet_'+brokerID+'_'+symbolId);
    temp = $(bet).text();
    color = color == 'x' ? 'Xanh_' : 'Ðo_';
    $(bet).html(temp + '->' + color + amount + '$');
    // $.ajax({
    //   url: 'https://order.aibroker.co/PlaceBet/Bet',
    //   headers: {
    //     'Content-type': 'application/x-www-form-urlencoded'
    //   },
    //   method: 'POST',
    //   dataType: 'json',
    //   data: params,
    //   success: function(data){
    //     bet = $('#bet_'+brokerID+'_'+symbolId);
    //     color = color == 'x' ? 'Xanh_' : 'Do_';
    //     $(bet).html(color + amount);
    //   }
    // });
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
  $pages['p1_updateBalance'] = function() {
    $balance = $pages['p1_getBalance']();
    $('#profit').html($balance);
  }
  $pages['p1_getBalance'] = function() {
    data = $this.post('https://order.aibroker.co/Home/GetSettledInfo', {});
    data = JSON.parse(data);
    return data['Data']['NewBalance'];
  }
  /////////////////////////////////////////////
  cus_length = null;
  brokerID = 1;
  symbolId = 1;
  allow = false;
  second = null;
  status = null;
  $index = 0;
  $startMoney = 0;
  $balance = 0;
  $profit = 0;
  $graphs =  [
    {brokerID: 1, symbolId: 1},
    {brokerID: 1, symbolId: 2},
    {brokerID: 1, symbolId: 3},
    {brokerID: 1, symbolId: 4},
    {brokerID: 1, symbolId: 5},
    {brokerID: 1, symbolId: 6},
    {brokerID: 1, symbolId: 7},
    {brokerID: 1, symbolId: 8},
    {brokerID: 1, symbolId: 9},
  ];
  $indexGraph = 0;
  $listMoney = [];
  $indexColor = 0;
  $listColor = ['x', 'd', 'd', 'd', 'x', 'x', 'x', 'd', 'd', 'd', 'x', 'x'];
  $cLoi = 0;
  //////////////////////////////////////////// 
  window.onbeforeunload = function(){
    return "Are you sure you want to close the window?";
  }
  $pages['p1_makeScreen']();
  $startMoney = 0;
  $balance =  0;
  $(balance).html($startMoney);
  window.clearInterval(window['timerInterval']);
  window.clearInterval(window['clockInterval']);
  //////////////////
  $balance = $pages['p1_getBalance']();
  $('#balance').html($balance);
  $('#profit').html($balance);
  $startMoney = $balance;
  $pages['p1_updateClock']();
  if (status == 'order') {
    $this.wait(second + 30);
  } else {
    $this.wait(second);
  }
///////////

