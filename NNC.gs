function getJson(url) {
  var response = UrlFetchApp.fetch(url);
  
  var contentText = response.getContentText();
  
  var json = JSON.parse(contentText);
  
  return json;
}


function doGet(){
  var blockReward = 5.0;
  
  // 採掘難易度を取得します。
  var diff = getNncDiff();
  
  // ブロック数を取得します。
  var blockCount = getNncBlockCount();
  
  var step;
  
  for (step = 0; step < Math.floor(blockCount / 43200); step++) {
    blockReward -= 0.5;
  }
  
  // マイナーのブロック報酬は全体の6割(4割はMN報酬)
  blockReward *= 0.6;
  
  // 価格を取得します。
  var price = getCryptohubMarketInfo("BTC", "NNC", "last");
  
  // whattomine形式のjson作成
  var NanuJson = '{\"id\":997,\"name\":\"NanuCoin\",\"tag\":\"NNC\",\"algorithm\":\"Xevan\",\"block_time\":\"60.0\",\"block_reward\":' + blockReward + ',\"block_reward24\":' + blockReward + ',\"block_reward3\":' + blockReward + ',\"block_reward7\":' + blockReward + ',\"last_block\":' + blockCount + ',\"difficulty\":' + diff + ',\"difficulty24\":' + diff + ',\"difficulty3\":' + diff + ',\"difficulty7\":' + diff + ',\"nethash\":17285206474,\"exchange_rate\":' + price + ',\"exchange_rate24\":' + price + ',\"exchange_rate3\":' + price + ',\"exchange_rate7\":' + price + ',\"exchange_rate_vol\":0,\"exchange_rate_curr\":\"BTC\",\"market_cap\":\"$0\",\"pool_fee\":\"0.000000\",\"estimated_rewards\":\"13.734687\",\"btc_revenue\":\"0.00000000\",\"revenue\":\"$0.00\",\"cost\":\"$0.36\",\"profit\":\"-$0.36\",\"status\":\"Active\",\"lagging\":false,\"timestamp\":1516433084}';
  
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

// NanuCoinのDIFFを取得します。
function getNncDiff(){
  try{
    var url = "https://explorer.nanucoin.com/api/getdifficulty";
    
    var response = UrlFetchApp.fetch(url);
  
    var contentText = response.getContentText();
    
    return Number(contentText);
  }
  catch(e){
    return 0;
  }
}


// NanuCoinのBlockCountを取得します。
function getNncBlockCount(){
  try{
    var url = "https://explorer.nanucoin.com/api/getblockcount";
    
    var response = UrlFetchApp.fetch(url);
  
    var contentText = response.getContentText();
    
    return Number(contentText);
  }
  catch(e){
    return 0;
  }
}
