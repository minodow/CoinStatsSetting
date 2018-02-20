function getJson(url) {
  var response = UrlFetchApp.fetch(url);
  
  Logger.log('URLアクセス "%s"', url);
  
  var contentText = response.getContentText();
  
  var json = JSON.parse(contentText);
  
  return json;
}


function doGet(e){
  try{
    var code = e.parameters.code;
    
    Logger.log('通貨名称 "%s"', code);
    
    var poolUrl = "https://cryptohub.online/api/pools_info/";
    
    var poolJson = getJson(poolUrl);
    
    var matchData = poolJson.pools.filter(function(item, index){
      if (item.code == code) return true;
    });
    
    var blockReward = matchData[0].block_reward;
    
    Logger.log('ブロック報酬 "%s"', blockReward);
    
    // 採掘難易度を取得します。
    var diff = matchData[0].difficulty;
    
    Logger.log('難易度 "%s"', diff);
    
    // ブロック数を取得します。
    var blockCount = matchData[0].block_height;
    
    Logger.log('ブロック数 "%s"', blockCount);
    
    // ネットハッシュの取得
    var netHash = matchData[0].net_hashrate;
    var poolHash = matchData[0].pool_hashrate;
    
    Logger.log('ハッシュレート プール "%s" ネット "%s"', poolHash, netHash);
    
    // コインの正式名称の取得
    var coinName = matchData[0].name;
    
    // コインのアルゴリズムの取得(先頭大文字)
    var algo = matchData[0].algo.charAt(0).toUpperCase() + matchData[0].algo.slice(1);
    
    if(algo == "Blake2s"){
      algo = "Blake 2s";
    }
    
    // 価格を取得します。
    var price = 0;
    if(matchData[0].market){
      price = getCryptohubMarketInfo("BTC", code, "last");
    }
    
    Logger.log('価格 "%s"', price);
    
    // 24時間平均のデータを取得します。
    var result = getCoinDetail(code);
    
    // 24時間平均のdiffを取得します。
    var diff24 = getCoinDiff24(result, diff);
    var price24 = getCoinPrice24(result, price);
    
    Logger.log('難易度24時間 "%s" 価格24時間 "%s"', diff24, price24);
    
    // whattomine形式のjson作成
    var NanuJson = '{\"id\":997,\"name\":\"' + coinName + '\",\"tag\":\"' + code + '\",\"algorithm\":\"' + algo + '\",\"block_time\":\"60.0\",\"block_reward\":' + blockReward + ',\"block_reward24\":' + blockReward + ',\"block_reward3\":' + blockReward + ',\"block_reward7\":' + blockReward + ',\"last_block\":' + blockCount + ',\"difficulty\":' + diff + ',\"difficulty24\":' + diff24 + ',\"difficulty3\":' + diff + ',\"difficulty7\":' + diff + ',\"nethash\":' + netHash + ',\"exchange_rate\":' + price + ',\"exchange_rate24\":' + price24 + ',\"exchange_rate3\":' + price + ',\"exchange_rate7\":' + price + ',\"exchange_rate_vol\":0,\"exchange_rate_curr\":\"BTC\",\"market_cap\":\"$0\",\"pool_fee\":\"0.000000\",\"estimated_rewards\":\"13.734687\",\"btc_revenue\":\"0.00000000\",\"revenue\":\"$0.00\",\"cost\":\"$0.36\",\"profit\":\"-$0.36\",\"status\":\"Active\",\"lagging\":false,\"timestamp\":1516433084}';
    
    // 設定したjsonを出力します
    return ContentService.createTextOutput(NanuJson).setMimeType(ContentService.MimeType.JSON);
    
  }
  catch(e){
    Logger.log(e);
  }
}


function getCryptohubMarketInfo(coin1, coin2, contents){
  try{
    var url = "https://cryptohub.online/api/market/ticker/";
    
    var json = getJson(url);
    
    return Number(json[coin1 + "_" + coin2][contents]);
  }
  catch(e){
    Logger.log(e);
    return 0;
  }
}










// CryptoHubに定期的にアクセスし、diffと価格の履歴を取得します。
function getCoinHistory(){
  // コイン名称配列を取得
  var coins = getCoinNames();
  
  var poolUrl = "https://cryptohub.online/api/pools_info/";
  
  var poolJson = getJson(poolUrl);
  
  var nowStr = Utilities.formatDate( new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss')
  
  Logger.log('現在日付 "%s"', nowStr);
  
  for(var index = 0; index < coins.length; index++){
    var matchData = poolJson.pools.filter(function(item, index2){
      if (item.code == coins[index]) return true;
    });
  
    // diffを取得します。  
    var diff = matchData[0].difficulty;
    
    // 価格を取得します。
    var price = 0;
    if(matchData[0].market){
      price = getCryptohubMarketInfo("BTC", coins[index], "last");
    }
    
    Logger.log('コイン "%s" diff "%s" 価格 "%s"', coins[index], diff, price.toFixed(8));
    
    // diffと価格をDBにINSERTします
    var tableId = getCoinDetailTableId();
    var sql = 'INSERT INTO ' + tableId + '(Date, CoinID, Diff, Price) VALUES (\'' + nowStr + '\' , \'' + coins[index] +'\',' + diff + ', ' + price.toFixed(8) + ')';
    var res = FusionTables.Query.sql(sql);
  }
}


function getCoinNames(){
  // Coins Table
  var coinTableId = getCoinTableId();
  
  var sql = "SELECT * FROM " + coinTableId;
  var result = FusionTables.Query.sqlGet(sql);
  var coins = [];
  
  for(var index = 0; index < result.rows.length; index++){
    coins.push(result.rows[index][0]);
  }
  
  return coins; 
}

// 指定したコインの詳細データを取得します。
function getCoinDetail(coinID){
  var tableId = getCoinDetailTableId();
  
  var date = new Date();
  var nowStr = Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  
  date.setDate(date.getDate() - 1);
  var oldStr = Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  
  var sql = "SELECT * FROM " + tableId + " WHERE CoinID = \'" + coinID + "\'"
   + " AND Date < \'" + nowStr + "\' ";
   + " AND Date > \'" + oldStr + "\' ";
  
  var result = FusionTables.Query.sqlGet(sql);
  return result;
}

function getCoinDiff24(result, diff){
  if(!result.rows){
    return diff;
  }
  
  var sum = 0;
  for (var i=0; i < result.rows.length; i++) {
    sum += result.rows[i][2];
  };
  
  return sum / result.rows.length;
}

function getCoinPrice24(result, price){
  if(!result.rows){
    return price;
  }
  
  var sum = 0;
  for (var i = 0; i < result.rows.length; i++) {
    sum += result.rows[i][3];
  };
  
  return sum / result.rows.length;
}


function deleteOldHistory(){
  try{
    // Coins Detail Table
    var tableId = getCoinDetailTableId();
    
    // 2日前の日付を取得します。
    var oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 2);
    var oldDateStr = Utilities.formatDate( oldDate, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
    
    Logger.log('削除基準日付 "%s"', oldDateStr);
    
    // 古い日付のデータを検索します。
    var getSql = "SELECT ROWID, Date FROM " + tableId + " WHERE Date < \'" + oldDateStr + "\' ";
    var result = FusionTables.Query.sqlGet(getSql);
    
    Logger.log('実行SQL "%s"', getSql);
    
    // 古いデータが存在しない場合は終了します
    if(!result.rows){
      Logger.log('データが存在しません。');
      return;
    }
    
    Logger.log('削除対象行数 "%s"', result.rows.length);
    
    // ROWIDの配列を作成します。
    var rowIds = [];
    
    for(var index = 0; index < result.rows.length; index++){
      Logger.log('削除対象日付 "%s"',result.rows[index][1]);
      rowIds.push(result.rows[index][0]);
    }
    
    // 降順にソートします。
    rowIds.sort(function(a,b){
        if( a > b ) return -1;
        if( a < b ) return 1;
        return 0;
    });
    
    var rows;
    if(rowIds.length > 30){
      rows = 30;
    }
    else{
      rows = rowIds.length;
    }
    
    // 1行ずつ削除します。
    for(var index = 0; index < rows; index++){
      Logger.log('削除対象ROWID "%s"', rowIds[index]);
      var deleteSql = "DELETE FROM " + tableId + " WHERE ROWID = \'" + rowIds[index] + "\'";
      FusionTables.Query.sql(deleteSql);
      
      Logger.log('削除SQL "%s"', deleteSql);
    }
    Logger.log('正常終了');
  }
  catch(e){
    Logger.log(e);
    return 0;
  }
}


function getCoinTableId(){
  return "1deeUzaZ4I7NqV8RS1fF6xuYrHpaH71nA6hOO25O9";
}

function getCoinDetailTableId(){
  return '1OKjP-_3m-TPmQmKEAKjCdcwaO8JrMFLTSSAyuuW-';
}