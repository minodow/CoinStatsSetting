# CoinStatsSetting

## 概要

仮想通貨の情報をWhatToMineのjson形式に加工し、出力するスクリプトです。
AwesomeMinerでこのスクリプトを使用し、収益予測やプール切り替えを行うことができます。

これを使うためにはGoogle Apps ScriptでStandalone Scriptを作成し、このスクリプトを貼り付け、Webアプリとして公開してください。WebアプリのURLをAwesome MinerのOptionのStatisticsのAdditional Json URLに追加します。

ただGoogle Apps ScriptにはURLの呼び出し制限があるので不特定多数に公開すると使えなくなる可能性があるので注意してください。

## ファイル一覧

* XLR.gs  
Solaris(XLR)の情報を取得するスクリプトです。

* YTN.gs  
Yenten(YTN)の情報を取得するスクリプトです。
YTNを使用する場合はAwesome MinerのOptionでYescryptR16というアルゴリズムを追加しておいてください。

* ZNY.gs  
BitZeny(ZNY)の情報を取得するスクリプトです。

* CryptoHubCoins.gs  
CryptoHubに登録されているすべてのコインの情報を取得できるスクリプトです。価格はCryptoHubのマーケットから取得します。URLに "?code=NMD" のようにコインの短縮名をパラメーターとして設定してください。

