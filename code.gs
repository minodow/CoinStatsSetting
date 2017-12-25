function getJson(url) {
  var response = UrlFetchApp.fetch(url);
  
  var contentText = response.getContentText();
  
  var json = JSON.parse(contentText);
  
  return json;
}


function doGet(){
  // whattomineのSolarisのjson取得URL
  var url = "https://whattomine.com/coins/179.json";
  
  // whattomineのjsonを取得
  var coinJson = getJson(url);
  
  // Solarisの価格を取得
  var price = getCoeMarketInfo("XLR","BTC", "BidPrice");
  
  // 価格情報を設定します
  coinJson["exchange_rate"] = price;
  coinJson["exchange_rate24"] = price;
  
  // 設定したjsonを出力します
  return ContentService.createTextOutput(JSON.stringify(coinJson)).setMimeType(ContentService.MimeType.JSON);
}



function getCoeMarketInfo(coin1, coin2, contents){
  var marketsUrl = "https://www.coinexchange.io/api/v1/getmarkets";
  var summaryUrl = "https://www.coinexchange.io/api/v1/getmarketsummary?market_id=";
  
  var marketsJson = getJson(marketsUrl);
  
  var matchData = marketsJson.result.filter(function(item, index){
    if (item.MarketAssetCode == coin1 && item.BaseCurrencyCode == coin2) return true;
  });
  
  var json2 = getJson(summaryUrl + matchData[0].MarketID);
  return  Number(json2.result[contents]);
}
