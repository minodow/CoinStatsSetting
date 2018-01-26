function getJson(url) {
  var response = UrlFetchApp.fetch(url);
  
  var contentText = response.getContentText();
  
  var json = JSON.parse(contentText);
  
  return json;
}


function doGet(){
  var blockReward;
  
  // 採掘難易度を取得します。
  var diff = getZenyDiff();
  
  // ブロック数を取得します。
  var blockCount = getZenyBlockCount();
  
  if(blockCount < 500000){
    blockReward = 250;
  }
  else if(blockCount < 1000000){
    blockReward = 125;
  }
  else if(blockCount < 1500000){
    blockReward = 62.5;
  }
  else{
    blockReward = 31.25;
  }
  
  // 価格を取得します。
  var price = getSEMarketInfo("ZNY", "BTC", "buy");
  
  // whattomine形式のjson作成
  var ZenyJson = '{\"id\":999,\"name\":\"BitZeny\",\"tag\":\"ZNY\",\"algorithm\":\"Yescrypt\",\"block_time\":\"90.0\",\"block_reward\":' + blockReward + ',\"block_reward24\":' + blockReward + ',\"block_reward3\":' + blockReward + ',\"block_reward7\":' + blockReward + ',\"last_block\":' + blockCount + ',\"difficulty\":' + diff + ',\"difficulty24\":' + diff + ',\"difficulty3\":' + diff + ',\"difficulty7\":' + diff + ',\"nethash\":17285206474,\"exchange_rate\":' + price + ',\"exchange_rate24\":' + price + ',\"exchange_rate3\":' + price + ',\"exchange_rate7\":' + price + ',\"exchange_rate_vol\":0,\"exchange_rate_curr\":\"BTC\",\"market_cap\":\"$0\",\"pool_fee\":\"0.000000\",\"estimated_rewards\":\"13.734687\",\"btc_revenue\":\"0.00000000\",\"revenue\":\"$0.00\",\"cost\":\"$0.36\",\"profit\":\"-$0.36\",\"status\":\"Active\",\"lagging\":false,\"timestamp\":1516433084}';
  
  // 設定したjsonを出力します
  return ContentService.createTextOutput(ZenyJson).setMimeType(ContentService.MimeType.JSON);
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

// ZenyのDIFFを取得します。
function getZenyDiff(){
  try{
    var url = "http://namuyan.dip.jp/MultiLightBlockExplorer/apis.php?data=zeny/api/status?q=getDifficulty";
    
    var json = getJson(url);
    
    return Number(json.difficulty);
  }
  catch(e){
    return 0;
  }
}


http://namuyan.dip.jp/MultiLightBlockExplorer/apis.php?data=zeny/api/status?q=getBlockCount


// ZenyのBlockCountを取得します。
function getZenyBlockCount(){
  try{
    var url = "http://namuyan.dip.jp/MultiLightBlockExplorer/apis.php?data=zeny/api/status?q=getBlockCount";
    
    var json = getJson(url);
    
    return Number(json.blockcount);
  }
  catch(e){
    return 0;
  }
}
