function buildStatusTable(data){

    const statusMap = {};

    data.forEach(row=>{

        const status =
        String(
            row.status || ""
        ).trim();

        if(!status) return;

        if(!statusMap[status]){

            statusMap[status] = {

                gmv:0,
                unit:0,
                payout:0,
                asin:new Set()

            };

        }

        statusMap[status].gmv +=
        Number(row.gmv) || 0;

        statusMap[status].unit +=
        Number(row.unit) || 0;

        statusMap[status].payout +=
        Number(row.payout) || 0;

        if(row.asin){

            statusMap[status]
            .asin
            .add(row.asin);

        }

    });

    let html = "";

    Object.entries(statusMap)

    .sort(
        (a,b)=>
        b[1].gmv -
        a[1].gmv
    )

    .forEach(([status,item])=>{

        const asp =

        item.unit > 0

        ?

        item.gmv / item.unit

        :

        0;

        html += `
        <tr>
            <td>${status}</td>
            <td>${Math.round(item.gmv).toLocaleString("en-IN")}</td>
            <td>${Math.round(item.unit).toLocaleString("en-IN")}</td>
            <td>${asp.toFixed(2)}</td>
            <td>${Math.round(item.payout).toLocaleString("en-IN")}</td>
            <td>${item.asin.size}</td>
        </tr>
        `;

    });

    document.querySelector(
        "#statusTable tbody"
    ).innerHTML = html;

}
