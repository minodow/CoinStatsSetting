# CoinStatsSetting

## 概要

仮想通貨の情報をWhatToMineのjson形式に加工し、出力するスクリプトです。
AwesomeMinerでこのスクリプトを使用し、収益予測やプール切り替えを行うことができます。

これを使うためにはGoogle Apps ScriptでStandalone Scriptを作成し、このスクリプトを貼り付け、Webアプリとして公開してください。WebアプリのURLをAwesome MinerのOptionのStatisticsのAdditional Json URLに追加します。

ただGoogle Apps ScriptにはURLの呼び出し制限があるので不特定多数に公開すると使えなくなる可能性があるので注意してください。

## ファイル一覧

* YTN.gs  
Yenten(YTN)の情報を取得するスクリプトです。
YTNを使用する場合はAwesome MinerのOptionでYescryptR16というアルゴリズムを追加しておいてください。

* ZNY.gs  
BitZeny(ZNY)の情報を取得するスクリプトです。

* CryptoHubCoins.gs  
CryptoHubに登録されているすべてのコインの情報を取得できるスクリプトです。価格はCryptoHubのマーケットから取得します。URLに "?code=NMD&avg=24" のようにコインの短縮名と平均値を求める際の時間数をパラメーターとして設定してください。平均時間のデフォルトは24です。
このファイルを使用する場合はFutionTablesAPIの設定が必要です。以下のリンクを参考にスクリプト画面とGoogleデベロッパーコンソールでFusionTablesを有効にしてください。

https://qiita.com/U11/items/c4d9632715b016bef8ee#_reference-45765bb2a0c8ce358f5b

## 対応通貨一覧

* YTN
* ZNY
* BZL
* HONEY
* NNC
* MAX
* NMD
* POLY
* ERA
* ELP
* INFO
* XHM
* RVN
* PGN




## 寄付
* Yenten : YfsPeLb75pVoP9qmuCGRaJmzHmAUA7RXp4
* Mona : MGmfU9odzSJ7JE2bjt7gNGTHcXGBcQoatm
* BTC : 121CK9j9QXFznsDGPWjP9hxMhmLvjauiZb
* ETH : 0xC2Ac479b483b45D1302FdB5fed25e7Da4d0c12C2
