function getJson(url) {
  var response = UrlFetchApp.fetch(url);
  
  var contentText = response.getContentText();
  
  var json = JSON.parse(contentText);
  
  return json;
}


function doGet(){
  // whattomineのjsonを取得
  var coinJson = getJson(url);
  
  // 採掘難易度を取得します。
  var diff = getYtnDiff();
  
  // kakakuを取得します。
  var price = getSEMarketInfo("YTN", "BTC", "buy");
  
  // whattomine形式のjson作成
  var ytnJson = '{"id":999,"name":"Yenten","tag":"YTN","algorithm":"YescryptR16","block_time":"120.0","block_reward":50,"block_reward24":50"block_reward3":50,"block_reward7":50,"last_block":141606,"difficulty":' + diff + ',"difficulty24":' + diff + ',"difficulty3":' + diff + ',"difficulty7":' + diff + ',"nethash":17285206474,"exchange_rate":' + price + ',"exchange_rate24":' + price + ',"exchange_rate3":' + price + ',"exchange_rate7":' + price + ',"exchange_rate_vol":0,"exchange_rate_curr":"BTC","market_cap":"$0","pool_fee":"0.000000","estimated_rewards":"13.734687","btc_revenue":"0.00000000","revenue":"$0.00","cost":"$0.36","profit":"-$0.36","status":"Active","lagging":false,"timestamp":1516433084}';
  
  // 設定したjsonを出力します
  return ContentService.createTextOutput(JSON.stringify(ytnJson)).setMimeType(ContentService.MimeType.JSON);
}






//1.    buy (highest buy)
//2.    sell (lowest sell)
//3.    market name
//4.    updated time
//5.    server time
function getSEMarketInfo(coin1, coin2, contents){
    try{
    var url = "https://stocks.exchange/api2/prices";
    
    var json = getJson(url);
      
    var matchData = json.filter(function(item, index){
      if (item.market_name == coin1 + "_" + coin2) return true;
    });
    
    return Number(matchData[0][contents]);
  }
  catch(e){
    return 0;
  }
}

// YTNのDIFFを取得します。
function getYtnDiff(){
    try{
    var url = "http://yenten-blockexplorer.chocottokozukai.click/api/getdifficulty";
    
    var json = getJson(url);
    
    return Number(json);
  }
  catch(e){
    return 0;
  }
}

