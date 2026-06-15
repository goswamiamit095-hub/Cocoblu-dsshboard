function exportToExcel(){

    const wb =
    XLSX.utils.book_new();

    const ws =
    XLSX.utils.json_to_sheet(
        filteredData
    );

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "SalesData"
    );

    XLSX.writeFile(
        wb,
        "SalesDashboard.xlsx"
    );

}

function exportToCSV(){

    const ws =
    XLSX.utils.json_to_sheet(
        filteredData
    );

    const csv =
    XLSX.utils.sheet_to_csv(
        ws
    );

    const blob =
    new Blob(
        [csv],
        {
            type:"text/csv"
        }
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    "SalesDashboard.csv";

    a.click();

    URL.revokeObjectURL(url);

}

document
.getElementById(
    "exportExcelBtn"
)
.addEventListener(
    "click",
    exportToExcel
);

document
.getElementById(
    "exportCsvBtn"
)
.addEventListener(
    "click",
    exportToCSV
);
