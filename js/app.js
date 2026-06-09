
const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTGYH1VtzaKrnyltAklSj0CK0kpchnfXCRYtEV1FXdtv-1t27tpu3F4_nU3mYMvKz6h7rqSgeUduGT7/pub?gid=2033889217&single=true&output=csv";

Papa.parse(CSV_URL,{

    download:true,

    header:true,

    complete:function(results){

        console.log(results.data);

        document.getElementById("status")
        .innerHTML =
        "CSV Loaded Successfully<br>Total Rows : "
        + results.data.length;

    },

    error:function(err){

        document.getElementById("status")
        .innerHTML =
        "Error Loading CSV";

        console.log(err);

    }

});
