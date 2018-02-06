function getJson(url) {
  var response = UrlFetchApp.fetch(url);
  
  var contentText = response.getContentText();
  
  var json = JSON.parse(contentText);
  
  return json;
}


function doGet(){
  var blockReward;
  
  var poolUrl = "https://cryptohub.online/api/pools_info/";
  
  var poolJson = getJson(poolUrl);
  
  var matchData = poolJson.pools.filter(function(item, index){
    if (item.code == "NNC") return true;
  });
  
  blockReward = matchData[0].block_reward;
  
  // 採掘難易度を取得します。
  var diff = matchData[0].difficulty;
  
  // ブロック数を取得します。
  var blockCount = matchData[0].block_height;
  
  var netHash = matchData[0].net_hashrate;
  var poolHash = matchData[0].pool_hashrate;

  // 価格を取得します。
  var price = getCryptohubMarketInfo("BTC", "NNC", "last");
  
  // whattomine形式のjson作成
  var NanuJson = '{\"id\":997,\"name\":\"NanuCoin\",\"tag\":\"NNC\",\"algorithm\":\"Xevan\",\"block_time\":\"60.0\",\"block_reward\":' + blockReward + ',\"block_reward24\":' + blockReward + ',\"block_reward3\":' + blockReward + ',\"block_reward7\":' + blockReward + ',\"last_block\":' + blockCount + ',\"difficulty\":' + diff + ',\"difficulty24\":' + diff + ',\"difficulty3\":' + diff + ',\"difficulty7\":' + diff + ',\"nethash\":' + netHash + ',\"exchange_rate\":' + price + ',\"exchange_rate24\":' + price + ',\"exchange_rate3\":' + price + ',\"exchange_rate7\":' + price + ',\"exchange_rate_vol\":0,\"exchange_rate_curr\":\"BTC\",\"market_cap\":\"$0\",\"pool_fee\":\"0.000000\",\"estimated_rewards\":\"13.734687\",\"btc_revenue\":\"0.00000000\",\"revenue\":\"$0.00\",\"cost\":\"$0.36\",\"profit\":\"-$0.36\",\"status\":\"Active\",\"lagging\":false,\"timestamp\":1516433084}';
  
  // 設定したjsonを出力します
  return ContentService.createTextOutput(NanuJson).setMimeType(ContentService.MimeType.JSON);
}


function getCryptohubMarketInfo(coin1, coin2, contents){
  try{
    var url = "https://cryptohub.online/api/market/ticker/";
    
    var json = getJson(url);
    
    return Number(json[coin1 + "_" + coin2][contents]);
  }
  catch(e){
    return 0;
  }
}

