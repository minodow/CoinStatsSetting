# CoinStatsSetting
WhattomineのSolarisのjsonデータを取得し、CoinExchangeから取得した価格情報を追加して出力するスクリプトです。

Awesome MinerではWhattomineから取得した情報を元に収益予想ができますが、SolarisはCoinExchangeでしか扱っていないためwhattomineでは価格情報が取得できません。
このスクリプトではCoinExchangeから価格を取得し、元のjsonに追加して出力します。

これを使うためにはGoogle Apps ScriptでStandalone Scriptを作成し、このスクリプトを貼り付け、Webアプリとして公開してください。WebアプリのURLをAwesome MinerのOptionのStatisticsのAdditional Json URLに追加します。

ただGoogle Apps ScriptにはURLの呼び出し制限があるので不特定多数に公開すると使えなくなる可能性があるので注意してください。
