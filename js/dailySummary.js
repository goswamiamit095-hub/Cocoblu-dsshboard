function buildDailySummaryTable(data){

    const dateMap = {};

    data.forEach(row=>{

        const dateKey =
        `${String(row.day).padStart(2,"0")}-${monthNames[row.month]}-${row.year}`;

        if(!dateMap[dateKey]){

            dateMap[dateKey] = {
                gmv:0,
                unit:0,
                payout:0,
                aov:0,
                rows:0
            };
        }

        dateMap[dateKey].gmv += Number(row.gmv) || 0;
        dateMap[dateKey].unit += Number(row.unit) || 0;
        dateMap[dateKey].payout += Number(row.payout) || 0;
        dateMap[dateKey].aov += Number(row.aov) || 0;
        dateMap[dateKey].rows++;

    });

    let html = "";

    let totalGMV = 0;
    let totalUnit = 0;
    let totalPayout = 0;
    let totalAOV = 0;
    let totalRows = 0;

    Object.entries(dateMap)

    .sort((a,b)=>{

        const d1 = new Date(a[0]);
        const d2 = new Date(b[0]);

        return d1-d2;

    })

    .forEach(([date,val])=>{

        const asp =
        val.unit > 0
        ? val.gmv / val.unit
        : 0;

        const avgAOV =
        val.rows > 0
        ? val.aov / val.rows
        : 0;

        totalGMV += val.gmv;
        totalUnit += val.unit;
        totalPayout += val.payout;
        totalAOV += val.aov;
        totalRows += val.rows;

        html += `
        <tr>
            <td>${date}</td>
            <td>${Math.round(val.gmv).toLocaleString("en-IN")}</td>
            <td>${Math.round(val.unit).toLocaleString("en-IN")}</td>
            <td>${asp.toFixed(2)}</td>
            <td>${Math.round(val.payout).toLocaleString("en-IN")}</td>
            <td>${avgAOV.toFixed(2)}</td>
        </tr>
        `;

    });

    const totalASP =
    totalUnit > 0
    ? totalGMV / totalUnit
    : 0;

    const finalAOV =
    totalRows > 0
    ? totalAOV / totalRows
    : 0;

    html += `
    <tr style="font-weight:bold;background:#f2f2f2;">
        <td>TOTAL</td>
        <td>${Math.round(totalGMV).toLocaleString("en-IN")}</td>
        <td>${Math.round(totalUnit).toLocaleString("en-IN")}</td>
        <td>${totalASP.toFixed(2)}</td>
        <td>${Math.round(totalPayout).toLocaleString("en-IN")}</td>
        <td>${finalAOV.toFixed(2)}</td>
    </tr>
    `;

    document.querySelector(
        "#dailySummaryTable tbody"
    ).innerHTML = html;

}
