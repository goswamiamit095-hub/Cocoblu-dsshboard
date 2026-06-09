const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTGYH1VtzaKrnyltAklSj0CK0kpchnfXCRYtEV1FXdtv-1t27tpu3F4_nU3mYMvKz6h7rqSgeUduGT7/pub?gid=2033889217&single=true&output=csv";

let masterData = [];

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {

        masterData = results.data;

        let firstRow = masterData[0] || {};

        let html = `
            <h3>CSV Loaded Successfully</h3>
            <p>Total Rows : ${masterData.length}</p>

            <h3>Detected Columns</h3>
            <pre>${JSON.stringify(Object.keys(firstRow), null, 2)}</pre>

            <h3>First Row</h3>
            <pre>${JSON.stringify(firstRow, null, 2)}</pre>
        `;

        document.getElementById("status").innerHTML = html;

    },

    error: function(err){

        document.getElementById("status").innerHTML =
        "CSV Error : " + err.message;

        console.error(err);
    }
});