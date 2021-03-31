// 親カテゴリのプルダウンリスト作成
// 分類１
function getCategory1(){
  var list = getParentCategory("Factors", "B2:B")
  return list
}
// 牧場コード
function getFarmcodeWithName(){
  var list = getParentCategory("Farm info", "A2:B", true, true)
  return list
}

// 子カテゴリのプルダウンリスト作成
// 分類1（親カテゴリ：in/out）
function getCategory1Childver(category1Value){
  var list = getChildCategory(category1Value, "Factors", "A2:B")
  return list
}
// 分類２（親カテゴリ：分類１）
function getCategory2(category1Value){
  var list = getChildCategory(category1Value, "Factors", "C2:D")
  return list
}
// 分類３（親カテゴリ：分類２）
function getCategory3(category2Value){
  var list = getChildCategory(category2Value, "Composition", "A2:B")
  return list
}

// NとCP取得
function getCpAndN(category3Value){
  var list = getCpAndNFromSps(category3Value, "Composition", "B2:E")
  return list
}

// 親カテゴリ取得
function getParentCategory(sheetName, sheetRange, farminfo=false, duplicate=false){
  //シートからデータを取得
  var result = getValuesFromSheet(sheetName, sheetRange);
  if (farminfo==true){
    //空白削除&farmcodeとfarmnameの結合
    var list = result.reduce((ar, e) => {
      if (e[0]) ar.push(`${e[0]}:${e[1]}`);
        return ar;
      },
    []);
  }else{
    //空白削除
    var list = result.reduce((ar, e) => {
      if (e[0]) ar.push(e[0]);
        return ar;
      },
    []);
  };
  
  //重複削除
  if (duplicate==true){
    var list2 = list.filter((x, i, self) => {
      return self.indexOf(x) === i;
    });
  }else{
    var list2 = list
  }

  //取得データを返す
  console.log(list2)
  return JSON.stringify(list2);
};

//子カテゴリ取得
function getChildCategory(parentCategoryValue, sheetName, sheetRange){
  //シートからデータを取得
  var result = getValuesFromSheet(sheetName, sheetRange);
 
  //親カテゴリの値に基づき，子カテゴリのプルダウン用の配列を作成
  var list = [];  
  for(var i = 0;i<result.length;i++){
    //分類に合致したらpush
    if(result[i][0] == parentCategoryValue){
      list.push(result[i][1]);
    };
  };

  //取得データを返す
  console.log(list);
  return JSON.stringify(list);
}

// cpとｎ取得
function getCpAndNFromSps(category3Value, sheetName, sheetRange){
  //シートからデータを取得
  var result = getValuesFromSheet(sheetName, sheetRange);
 
  //親カテゴリの値に基づき，子カテゴリのプルダウン用の配列を作成
  var cp = "";
  var n = "";
  for(var i = 0;i<result.length;i++){
    if(result[i][0] == category3Value){
      var cp = Math.round(result[i][2]*100)/100;
      var n =Math.round(result[i][3]*100)/100;
    };
  };

  //取得データを返す
  console.log([cp, n])
  return JSON.stringify([cp, n]);
}

// データを取得
function getValuesFromSheet(sheetName, sheetRange){
  //シートを取得
  var ss = SpreadsheetApp.openById(sheet_id);
  var result = ss.getSheetByName(sheetName).getRange(sheetRange).getValues();
  return result;
}