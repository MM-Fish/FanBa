// スプシID
var sheet_id = '1tMBnQq3G0rEqng0IU-TMKeuMAOOGruRo6PIUSZiDGrE';

// ページ遷移
// WebアプリindexページのURL取得
function getRootUrl(){
  var root_url = ScriptApp.getService().getUrl();
  console.log(root_url);
  return root_url;
}

// get通信
function doGet(e) {
    var page = e.parameter["p"];
    if(page == "index" || page==null){
      var app = HtmlService.createTemplateFromFile("index").evaluate();
    app
      .setTitle('New Farm')
      .setFaviconUrl('https://drive.google.com/uc?id=1GiyWmUxRWeaOhSsE5JFkp7e7P53gLumH&.png');
      return app;
      
    }
    else if(page =="composition"){
      var app = HtmlService.createTemplateFromFile("composition").evaluate();
      app
      .setTitle('Composition')
      .setFaviconUrl('https://drive.google.com/uc?id=1GiyWmUxRWeaOhSsE5JFkp7e7P53gLumH&.png');
      return app;
    }
    else if(page =="database"){
      var app = HtmlService.createTemplateFromFile("database").evaluate();
      app
      .setTitle('Data registration')
      .setFaviconUrl('https://drive.google.com/uc?id=1GiyWmUxRWeaOhSsE5JFkp7e7P53gLumH&.png');
      return app;
    }
}

// post通信で受け取ったデータをスプシに反映させる
function doPost(e){
  var ss=SpreadsheetApp.openById(sheet_id);
  var page = e.parameter["p"];
  if(page == "index" || page==null){
    var colNames = ["farmcode", "farmname", "year", "month", "totalland", "pasture", "corn", "grazing", "combined", 
    "totalcow", "milkingcow", "heifer", "farmingtype", "region"];
    var sheet = ss.getSheetByName('Farm info');
    addDataToSheet(e, colNames, sheet);
  }
  else if(page =="composition"){
    var colNames = ["category2", "name", "amount", "CP", "N", "memo", "farm"];
    var sheet = ss.getSheetByName('Composition');
    addDataToSheet(e, colNames, sheet);
  }
  else if(page =="database"){
    // 列名変更必要
    var colNames1 = ["farmcode", "year", "month"]
    var colNames2 = ["inout", "category1", "category2", "category3", "amount", 
    "kgperbag", "total", "CP", "N", "kgN", "memo"];
    var sheet = ss.getSheetByName('Data');
    console.log(e.parameter)
    addDataToSheetDatabase(e, colNames1, colNames2, sheet);
  }
  var resultpage=HtmlService.createTemplateFromFile('result').evaluate(); 
  resultpage
  .setTitle('Composition')
  .setFaviconUrl('https://drive.google.com/uc?id=1GiyWmUxRWeaOhSsE5JFkp7e7P53gLumH&.png');
  return resultpage;
}

// スプシにデータを追加する関数
function addDataToSheetDatabase(e, colNames1, colNames2, sheet){
  var number = (Object.keys(e.parameter).length - 4) / 9;
  for(var i=1; i<=number; i++){
    var colNames2_1 = colNames2.map( (v) => v + '_' + i );
    var colNames = colNames1.concat(colNames2_1);
    addDataToSheet(e, colNames, sheet, i);
  }
}


// スプシにデータを追加する関数
function addDataToSheet(e, colNames, sheet, index){
  // post通信で受け取ったデータを配列に格納
  var params = e.parameter;
  var data = [];
  colNames.forEach(function(col){
    if (~col.indexOf("total")){
      var total_kg = params[`amount_${index}`] * params[`kgperbag_${index}`];
      var value = total_kg;
    }else if (~col.indexOf("kgN")){
      var total_kg = params[`amount_${index}`] * params[`kgperbag_${index}`];
      var value = calcKgN(params, total_kg, index);
    }else{
      var value = params[col].toString();
    }

    if (value=="選択して下さい"){
      value = ""
    }

    // 「牧場コード:牧場名」から牧場コードのみ取得する
    if (col=="farmcode"){
      value = value.split(":")[0]
    }
    data.push(value);
  })

  // データ入力
  // sheet.appendRow(data);
  var numCols = data.length;
  sheet.insertRows(2,1);
  console.log(numCols);
  sheet.getRange(2, 1, 1, numCols).setValues([data]);
  console.log(data);
}

function calcKgN(params, total_kg, index){
  if (params[`category1_${index}`]=="牛乳"){
    var value = total_kg * params[`CP_${index}`] / ( 100 * 6.38 );
  }else{
    var value = total_kg * params[`CP_${index}`] / ( 100 * 6.25 );
  }
  return value.toString()
}