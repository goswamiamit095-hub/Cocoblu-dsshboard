const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTGYH1VtzaKrnyltAklSj0CK0kpchnfXCRYtEV1FXdtv-1t27tpu3F4_nU3mYMvKz6h7rqSgeUduGT7/pub?gid=2033889217&single=true&output=csv";

let masterData = [];

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,

    complete: function(results) {

        masterData = results.data;

        document.getElementById("status").innerHTML =
            `CSV Loaded Successfully<br>Total Rows : ${masterData.length}`;

        calculateKPIs();

        buildBrandTable();
    },

    error: function(error) {

        console.error(error);

        document.getElementById("status").innerHTML =
            "CSV Loading Error";
    }
});

function calculateKPIs() {

    let totalGMV = 0;
    let totalUnits = 0;
    let totalPayout = 0;

    const asinSet = new Set();

    masterData.forEach(row => {

        totalGMV += parseFloat(row.gmv) || 0;
        totalUnits += parseFloat(row.unit) || 0;
        totalPayout += parseFloat(row.payout) || 0;

        if (row.asin) {
            asinSet.add(row.asin);
        }

    });

    document.getElementById("totalGMV").innerText =
        Math.round(totalGMV).toLocaleString("en-IN");

    document.getElementById("totalUnits").innerText =
        Math.round(totalUnits).toLocaleString("en-IN");

    document.getElementById("totalPayout").innerText =
        Math.round(totalPayout).toLocaleString("en-IN");

    document.getElementById("totalASIN").innerText =
        asinSet.size.toLocaleString("en-IN");
}

function buildBrandTable() {

    const brandMap = {};

    masterData.forEach(row => {

        const brand = String(row.brand || "").trim();

        if (!brand) return;

        if (!brandMap[brand]) {

            brandMap[brand] = {
                gmv: 0,
                unit: 0,
                payout: 0,
                aov: 0,
                rows: 0
            };

        }

        brandMap[brand].gmv += parseFloat(row.gmv) || 0;
        brandMap[brand].unit += parseFloat(row.unit) || 0;
        brandMap[brand].payout += parseFloat(row.payout) || 0;
        brandMap[brand].aov += parseFloat(row.aov) || 0;

        brandMap[brand].rows++;

    });

    let html = "";

    Object.entries(brandMap)
        .sort((a, b) => b[1].gmv - a[1].gmv)
        .forEach(([brand, data]) => {

            const asp =
                data.unit > 0
                    ? data.gmv / data.unit
                    : 0;

            const avgAOV =
                data.rows > 0
                    ? data.aov / data.rows
                    : 0;

            html += `
            <tr>
                <td>${brand}</td>
                <td>${Math.round(data.gmv).toLocaleString("en-IN")}</td>
                <td>${Math.round(data.unit).toLocaleString("en-IN")}</td>
                <td>${asp.toFixed(2)}</td>
                <td>${Math.round(data.payout).toLocaleString("en-IN")}</td>
                <td>${avgAOV.toFixed(2)}</td>
            </tr>
            `;
        });

    const tbody = document.querySelector("#brandTable tbody");

    if (tbody) {
        tbody.innerHTML = html;
    }
}