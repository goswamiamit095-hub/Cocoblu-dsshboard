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

Papa.parse(CSV_URL,{
    download:true,
    header:true,
    skipEmptyLines:true,
    dynamicTyping:true,

    complete:function(results){

        masterData =
        results.data.filter(
            row => row.brand
        );

        populateFilters();

        const latestRecord =
        masterData.reduce(
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
        `Rows : ${masterData.length}<br>
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
document
.getElementById("metricSelector")
.addEventListener(
    "change",
    ()=>{

        buildMetricTable(
            filteredData
        );

    }
);
