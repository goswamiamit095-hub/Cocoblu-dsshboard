const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTGYH1VtzaKrnyltAklSj0CK0kpchnfXCRYtEV1FXdtv-1t27tpu3F4_nU3mYMvKz6h7rqSgeUduGT7/pub?gid=2033889217&single=true&output=csv";

let masterData = [];
let filteredData = [];

const monthNames = {
1:"Jan",
2:"Feb",
3:"Mar",
4:"Apr",
5:"May",
6:"Jun",
7:"Jul",
8:"Aug",
9:"Sep",
10:"Oct",
11:"Nov",
12:"Dec"
};

Papa.parse(CSV_URL, {
download:true,
header:true,
skipEmptyLines:true,
dynamicTyping:true,
worker:true,

complete:function(results){  

    masterData = results.data.filter(  
        row => row.brand  
    );  

    populateFilters();  

    const latestRecord = masterData.reduce(  
        (latest,current)=>{  

            const latestDate =  
            new Date(  
                Number(latest.year),  
                Number(latest.month)-1,  
                1  
            );  

            const currentDate =  
            new Date(  
                Number(current.year),  
                Number(current.month)-1,  
                1  
            );  

            return currentDate > latestDate  
            ? current  
            : latest;  

        }  
    );  

    document.getElementById(  
        "yearFilter"  
    ).value =  
    String(latestRecord.year);  

    document.getElementById(  
        "monthFilter"  
    ).value =  
    String(latestRecord.month);  

    document.getElementById(  
        "status"  
    ).innerHTML =  
    `Rows : ${masterData.length}  
    <br>  
    Default :  
    ${monthNames[latestRecord.month]}  
    ${latestRecord.year}`;  

    applyFilters();  

},  

error:function(error){  

    console.error(error);  

    document.getElementById(  
        "status"  
    ).innerHTML =  
    "CSV Loading Error";  

}

});

function populateFilters(){

fillFilter(  
    "brandFilter",  
    "brand"  
);  

fillFilter(  
    "categoryFilter",  
    "category"  
);  

fillFilter(  
    "statusFilter",  
    "status"  
);  

fillFilter(  
    "yearFilter",  
    "year"  
);  

fillFilter(  
    "monthFilter",  
    "month"  
);  

document  
.querySelectorAll(  
    ".filter-section select"  
)  
.forEach(select=>{  

    select.addEventListener(  
        "change",  
        applyFilters  
    );  

});  

document  
.getElementById("searchBox")  
.addEventListener(  
    "input",  
    applyFilters  
);  

document  
.getElementById("fromDate")  
.addEventListener(  
    "change",  
    applyFilters  
);  

document  
.getElementById("toDate")  
.addEventListener(  
    "change",  
    applyFilters  
);

document
.getElementById("fromDate")
.addEventListener("change",()=>{

document.getElementById(  
    "monthFilter"  
).value = "All";  

document.getElementById(  
    "yearFilter"  
).value = "All";  

applyFilters();

});

document
.getElementById("toDate")
.addEventListener("change",()=>{

document.getElementById(  
    "monthFilter"  
).value = "All";  

document.getElementById(  
    "yearFilter"  
).value = "All";  

applyFilters();

});

document
.getElementById("monthFilter")
.addEventListener("change",()=>{

document.getElementById(  
    "fromDate"  
).value = "";  

document.getElementById(  
    "toDate"  
).value = "";

});

document
.getElementById("yearFilter")
.addEventListener("change",()=>{

document.getElementById(  
    "fromDate"  
).value = "";  

document.getElementById(  
    "toDate"  
).value = "";

});
}

function fillFilter(id,field){

const select =  
document.getElementById(id);  

let values =  
[...new Set(  
    masterData.map(  
        x => String(  
            x[field]  
        ).trim()  
    )  
)]  
.filter(v => v !== "");  

if(field==="month"){  

    values  
    .sort(  
        (a,b)=>  
        Number(a)-Number(b)  
    )  
    .forEach(value=>{  

        const option =  
        document.createElement(  
            "option"  
        );  

        option.value=value;  

        option.textContent=  
        monthNames[value];  

        select.appendChild(  
            option  
        );  

    });  

    return;  

}  

if(field==="year"){  

    values.sort(  
        (a,b)=>b-a  
    );  

}else{  

    values.sort();  

}  

values.forEach(value=>{  

    const option =  
    document.createElement(  
        "option"  
    );  

    option.value=value;  

    option.textContent=  
    value;  

    select.appendChild(  
        option  
    );  

});

}

function applyFilters(){

    const search =
    document
    .getElementById("searchBox")
    .value
    .toLowerCase()
    .trim();

    const brand =
    document.getElementById(
        "brandFilter"
    ).value;

    const category =
    document.getElementById(
        "categoryFilter"
    ).value;

    const status =
    document.getElementById(
        "statusFilter"
    ).value;

    const year =
    document.getElementById(
        "yearFilter"
    ).value;

    const month =
    document.getElementById(
        "monthFilter"
    ).value;

    const fromDate =
    document.getElementById(
        "fromDate"
    ).value;

    const toDate =
    document.getElementById(
        "toDate"
    ).value;

    const useDateRange =
    fromDate !== "" ||
    toDate !== "";

    let startDate = null;
    let endDate = null;

    if(fromDate){
        startDate = new Date(fromDate);
        startDate.setHours(0,0,0,0);
    }

    if(toDate){
        endDate = new Date(toDate);
        endDate.setHours(23,59,59,999);
    }

    filteredData =
    masterData.filter(row=>{

        const searchMatch =

        !search ||

        String(row.brand || "")
        .toLowerCase()
        .includes(search)

        ||

        String(row.asin || "")
        .toLowerCase()
        .includes(search)

        ||

        String(row.vendor_sku || "")
        .toLowerCase()
        .includes(search)

        ||

        String(row.erp || "")
        .toLowerCase()
        .includes(search);

        let dateMatch = true;

        if(useDateRange){

            const rowDate = new Date(
                Number(row.year),
                Number(row.month) - 1,
                Number(row.day)
            );

            if(startDate){
                dateMatch =
                dateMatch &&
                rowDate >= startDate;
            }

            if(endDate){
                dateMatch =
                dateMatch &&
                rowDate <= endDate;
            }
        }

        return (

            (brand === "All" ||
            String(row.brand)
            .trim() === brand)

            &&

            (category === "All" ||
            String(row.category)
            .trim() === category)

            &&

            (status === "All" ||
            String(row.status)
            .trim() === status)

            &&

            (
                useDateRange

                ? true

                :

                (
                    (year === "All" ||
                    String(row.year)
                    .trim() === year)

                    &&

                    (month === "All" ||
                    String(row.month)
                    .trim() === month)
                )
            )

            &&

            searchMatch

            &&

            dateMatch

        );

    });

    calculateKPIs(filteredData);

buildBrandTable(filteredData);

buildCategoryTable(filteredData);

buildStatusTable(filteredData);

updateCharts(filteredData);

}

function calculateKPIs(data){

let totalGMV = 0;  
let totalUnits = 0;  
let totalPayout = 0;  

const asinSet =  
new Set();  

data.forEach(row=>{  

    totalGMV +=  
    Number(row.gmv) || 0;  

    totalUnits +=  
    Number(row.unit) || 0;  

    totalPayout +=  
    Number(row.payout) || 0;  

    if(row.asin){  

        asinSet.add(  
            row.asin  
        );  

    }  

});  

const totalASP =  

totalUnits > 0  

?  

totalGMV /  
totalUnits  

:  

0;  

document.getElementById(  
    "totalGMV"  
).innerText =  
Math.round(  
    totalGMV  
).toLocaleString("en-IN");  

document.getElementById(  
    "totalUnits"  
).innerText =  
Math.round(  
    totalUnits  
).toLocaleString("en-IN");  

document.getElementById(  
    "totalASP"  
).innerText =  
totalASP.toFixed(2);  

document.getElementById(  
    "totalPayout"  
).innerText =  
Math.round(  
    totalPayout  
).toLocaleString("en-IN");  

document.getElementById(  
    "totalASIN"  
).innerText =  
asinSet.size  
.toLocaleString("en-IN");

}

function buildBrandTable(data){

const brandMap = {};  

data.forEach(row=>{  

    const brand =  
    String(  
        row.brand || ""  
    ).trim();  

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

    brandMap[brand].gmv +=  
    Number(row.gmv) || 0;  

    brandMap[brand].unit +=  
    Number(row.unit) || 0;  

    brandMap[brand].payout +=  
    Number(row.payout) || 0;  

    brandMap[brand].aov +=  
    Number(row.aov) || 0;  

    brandMap[brand].rows++;  

});  

let html = "";  

Object.entries(brandMap)  

.sort(  
    (a,b)=>  
    b[1].gmv -  
    a[1].gmv  
)  

.forEach(([brand,data])=>{  

    const asp =  

    data.unit > 0  

    ?  

    data.gmv /  
    data.unit  

    :  

    0;  

    const avgAOV =  

    data.rows > 0  

    ?  

    data.aov /  
    data.rows  

    :  

    0;  

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
