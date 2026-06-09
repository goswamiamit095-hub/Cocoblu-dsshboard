const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTGYH1VtzaKrnyltAklSj0CK0kpchnfXCRYtEV1FXdtv-1t27tpu3F4_nU3mYMvKz6h7rqSgeUduGT7/pub?gid=2033889217&single=true&output=csv";

let masterData = [];

Papa.parse(CSV_URL, {

    download: true,
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,

    complete: function(results){

        masterData = results.data;

        document.getElementById("status").innerHTML =
            `CSV Loaded Successfully<br>
             Total Rows : ${masterData.length}`;

        calculateKPIs();

    },

    error:function(error){

        console.error(error);

        document.getElementById("status").innerHTML =
            "CSV Loading Error";

    }

});

function calculateKPIs()
buildBrandTable();
{

    let totalGMV = 0;
    let totalUnits = 0;
    let totalPayout = 0;

    const asinSet = new Set();

    masterData.forEach(row=>{

        totalGMV += Number(row.gmv || 0);

        totalUnits += Number(row.unit || 0);

        totalPayout += Number(row.payout || 0);

        if(row.asin){
            asinSet.add(row.asin);
        }

    });

    document.getElementById("totalGMV").innerText =
        totalGMV.toLocaleString("en-IN");

    document.getElementById("totalUnits").innerText =
        totalUnits.toLocaleString("en-IN");

    document.getElementById("totalPayout").innerText =
        totalPayout.toLocaleString("en-IN");

    document.getElementById("totalASIN").innerText =
        asinSet.size.toLocaleString("en-IN");

}
function buildBrandTable(){

    const brandMap = {};

    masterData.forEach(row=>{

        const brand = row.brand || "Unknown";

        if(!brandMap[brand]){

            brandMap[brand] = {

                gmv:0,
                unit:0,
                payout:0,
                aov:0

            };

        }

        brandMap[brand].gmv += Number(row.gmv || 0);

        brandMap[brand].unit += Number(row.unit || 0);

        brandMap[brand].payout += Number(row.payout || 0);

        brandMap[brand].aov += Number(row.aov || 0);

    });

    let html = "";

    Object.keys(brandMap)

    .sort()

    .forEach(brand=>{

        const data = brandMap[brand];

        const asp =
        data.unit > 0
        ? data.gmv / data.unit
        : 0;

        const aov =
        data.aov;

        html += `

        <tr>

            <td>${brand}</td>

            <td>${data.gmv.toLocaleString("en-IN")}</td>

            <td>${data.unit.toLocaleString("en-IN")}</td>

            <td>${asp.toFixed(2)}</td>

            <td>${data.payout.toLocaleString("en-IN")}</td>

            <td>${aov.toFixed(2)}</td>

        </tr>

        `;

    });

    document.querySelector(
        "#brandTable tbody"
    ).innerHTML = html;

}