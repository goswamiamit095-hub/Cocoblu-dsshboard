function buildMetricTable(data){

const metric =
document.getElementById("metricSelector").value;

const brands =
[...new Set(
    data.map(x => String(x.brand).trim())
)].sort();

const dateMap = {};
const dateTotals = {};

data.forEach(row=>{

    const dateKey =
    `${String(row.day).padStart(2,"0")}-${monthNames[row.month]}-${row.year}`;

    if(!dateTotals[dateKey]){

        dateTotals[dateKey] = {
            gmv:0,
            unit:0,
            payout:0
        };

    }

    dateTotals[dateKey].gmv += Number(row.gmv)||0;
    dateTotals[dateKey].unit += Number(row.unit)||0;
    dateTotals[dateKey].payout += Number(row.payout)||0;

});

data.forEach(row=>{

    const dateKey =
    `${String(row.day).padStart(2,"0")}-${monthNames[row.month]}-${row.year}`;

    if(!dateMap[dateKey]){

        dateMap[dateKey] = {
            total:0
        };

        brands.forEach(brand=>{

            dateMap[dateKey][brand] = 0;
            dateMap[dateKey][brand+"_gmv"] = 0;
            dateMap[dateKey][brand+"_unit"] = 0;

        });

    }

    if(metric==="asp"){

        dateMap[dateKey][row.brand+"_gmv"] += Number(row.gmv)||0;
        dateMap[dateKey][row.brand+"_unit"] += Number(row.unit)||0;

        return;
    }

    let value = 0;

    if(metric==="gmv"){
        value = Number(row.gmv)||0;
    }

    else if(metric==="unit"){
        value = Number(row.unit)||0;
    }

    else if(metric==="payout"){
        value = Number(row.payout)||0;
    }

    else if(metric==="gmvContribution"){

        value =
        dateTotals[dateKey].gmv > 0
        ?
        ((Number(row.gmv)||0) /
        dateTotals[dateKey].gmv) * 100
        :
        0;

    }

    else if(metric==="unitContribution"){

        value =
        dateTotals[dateKey].unit > 0
        ?
        ((Number(row.unit)||0) /
        dateTotals[dateKey].unit) * 100
        :
        0;

    }

    else if(metric==="payoutContribution"){

        value =
        dateTotals[dateKey].payout > 0
        ?
        ((Number(row.payout)||0) /
        dateTotals[dateKey].payout) * 100
        :
        0;

    }

    dateMap[dateKey][row.brand] += value;
    dateMap[dateKey].total += value;

});

let headHTML =
"<tr><th>Date</th>";

brands.forEach(brand=>{
    headHTML += `<th>${brand}</th>`;
});

headHTML += "<th>Total</th></tr>";

document.querySelector(
    "#metricTable thead"
).innerHTML = headHTML;

let bodyHTML = "";

const grandTotal = {};

brands.forEach(brand=>{
    grandTotal[brand] = 0;
});

let overallTotal = 0;

Object.entries(dateMap)

.sort((a,b)=>{

    const p1 = a[0].split("-");
    const p2 = b[0].split("-");

    const d1 =
    new Date(
        p1[2],
        Object.keys(monthNames)
        .find(k=>monthNames[k]===p1[1]) - 1,
        p1[0]
    );

    const d2 =
    new Date(
        p2[2],
        Object.keys(monthNames)
        .find(k=>monthNames[k]===p2[1]) - 1,
        p2[0]
    );

    return d1 - d2;

})

.forEach(([date,row])=>{

    bodyHTML += `<tr><td>${date}</td>`;

    let rowTotal = 0;

    brands.forEach(brand=>{

        let displayValue = 0;

        if(metric==="asp"){

            const gmv =
            row[brand+"_gmv"] || 0;

            const unit =
            row[brand+"_unit"] || 0;

            displayValue =
            unit > 0
            ? gmv / unit
            : 0;

        }

        else{

            displayValue =
            row[brand] || 0;

            grandTotal[brand] += displayValue;

        }

        rowTotal += displayValue;

        bodyHTML +=
        `<td>${
            metric.includes("Contribution")
            ? displayValue.toFixed(2)+"%"
            : metric==="asp"
            ? displayValue.toFixed(2)
            : Math.round(displayValue).toLocaleString("en-IN")
        }</td>`;

    });

    overallTotal += rowTotal;

    if(metric.includes("Contribution")){

        bodyHTML +=
        `<td>100.00%</td></tr>`;

    }
    else if(metric==="asp"){

        bodyHTML +=
        `<td>${rowTotal.toFixed(2)}</td></tr>`;

    }
    else{

        bodyHTML +=
        `<td>${Math.round(rowTotal).toLocaleString("en-IN")}</td></tr>`;

    }

});

bodyHTML +=
`<tr style="font-weight:bold;background:#f2f2f2;"><td>TOTAL</td>`;

brands.forEach(brand=>{

    bodyHTML +=
    `<td>${
        metric.includes("Contribution")
        ? grandTotal[brand].toFixed(2)+"%"
        : Math.round(grandTotal[brand]).toLocaleString("en-IN")
    }</td>`;

});

if(metric.includes("Contribution")){

    bodyHTML +=
    `<td>100.00%</td></tr>`;

}
else{

    bodyHTML +=
    `<td>${Math.round(overallTotal).toLocaleString("en-IN")}</td></tr>`;

}

document.querySelector(
    "#metricTable tbody"
).innerHTML = bodyHTML;

}