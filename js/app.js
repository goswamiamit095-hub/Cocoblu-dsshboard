const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTGYH1VtzaKrnyltAklSj0CK0kpchnfXCRYtEV1FXdtv-1t27tpu3F4_nU3mYMvKz6h7rqSgeUduGT7/pub?gid=2033889217&single=true&output=csv";

let masterData = [];

Papa.parse(CSV_URL,{

    download:true,
    header:true,
    skipEmptyLines:true,

    complete:function(results){

        masterData = results.data;

        calculateKPIs();

        document.getElementById("status")
        .innerHTML =
        "CSV Loaded Successfully<br>Total Rows : "
        + masterData.length;

    }

});

function calculateKPIs(){

    let totalGMV = 0;
    let totalUnits = 0;
    let totalPayout = 0;

    const asinSet = new Set();

    masterData.forEach(row=>{

        totalGMV += Number(row.gmv || 0);

        totalUnits += Number(row.unit || 0);

        totalPayout += Number(row.payout || 0);

        asinSet.add(row.asin);

    });

    document.getElementById("totalGMV")
    .innerText =
    totalGMV.toLocaleString("en-IN");

    document.getElementById("totalUnits")
    .innerText =
    totalUnits.toLocaleString("en-IN");

    document.getElementById("totalPayout")
    .innerText =
    totalPayout.toLocaleString("en-IN");

    document.getElementById("totalASIN")
    .innerText =
    asinSet.size.toLocaleString("en-IN");

}