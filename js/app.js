const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTGYH1VtzaKrnyltAklSj0CK0kpchnfXCRYtEV1FXdtv-1t27tpu3F4_nU3mYMvKz6h7rqSgeUduGT7/pub?gid=2033889217&single=true&output=csv";

let masterData = [];
let filteredData = [];

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,

    complete: function(results){

        masterData = results.data;
        filteredData = [...masterData];

        document.getElementById("status").innerHTML =
            `CSV Loaded Successfully<br>Total Rows : ${masterData.length}`;

        populateFilters();

        calculateKPIs(filteredData);

        buildBrandTable(filteredData);

    },

    error:function(error){

        console.error(error);

        document.getElementById("status").innerHTML =
            "CSV Loading Error";

    }

});

function populateFilters(){

    fillFilter("brandFilter","brand");
    fillFilter("categoryFilter","category");
    fillFilter("statusFilter","status");
    fillFilter("yearFilter","year");
    fillFilter("monthFilter","month");

    document
    .querySelectorAll(".filter-section select")
    .forEach(select=>{

        select.addEventListener(
            "change",
            applyFilters
        );

    });

}

function fillFilter(id,field){

    const select =
    document.getElementById(id);

    const values =
    [...new Set(
        masterData.map(x=>x[field])
    )]
    .filter(Boolean)
    .sort();

    values.forEach(value=>{

        const option =
        document.createElement("option");

        option.value=value;
        option.textContent=value;

        select.appendChild(option);

    });

}

function applyFilters(){

    const brand =
    document.getElementById("brandFilter").value;

    const category =
    document.getElementById("categoryFilter").value;

    const status =
    document.getElementById("statusFilter").value;

    const year =
    document.getElementById("yearFilter").value;

    const month =
    document.getElementById("monthFilter").value;

    filteredData =
    masterData.filter(row=>{

        return (
            (brand==="All" || row.brand===brand) &&
            (category==="All" || row.category===category) &&
            (status==="All" || row.status===status) &&
            (year==="All" || String(row.year)===String(year)) &&
            (month==="All" || row.month===month)
        );

    });

    calculateKPIs(filteredData);

    buildBrandTable(filteredData);

}

function calculateKPIs(data){

    let totalGMV = 0;
    let totalUnits = 0;
    let totalPayout = 0;

    const asinSet = new Set();

    data.forEach(row=>{

        totalGMV += parseFloat(row.gmv) || 0;
        totalUnits += parseFloat(row.unit) || 0;
        totalPayout += parseFloat(row.payout) || 0;

        if(row.asin){
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

function buildBrandTable(data){

    const brandMap = {};

    data.forEach(row=>{

        const brand =
        String(row.brand || "").trim();

        if(!brand) return;

        if(!brandMap[brand]){

            brandMap[brand] = {
                gmv:0,
                unit:0,
                payout:0,
                aov:0,
                rows:0
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
    .sort((a,b)=>b[1].gmv-a[1].gmv)
    .forEach(([brand,data])=>{

        const asp =
        data.unit > 0
        ? data.gmv/data.unit
        : 0;

        const avgAOV =
        data.rows > 0
        ? data.aov/data.rows
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

    document.querySelector(
        "#brandTable tbody"
    ).innerHTML = html;

}