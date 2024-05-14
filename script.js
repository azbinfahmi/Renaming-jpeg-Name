let img_details = []
let HH_details = []

document.getElementById('processBtn').addEventListener('click', function() {
    alert('Click OK to continue')
    img_details = [], HH_details = []
    const fileInput1 = document.getElementById('csv1');
    const fileInput2 = document.getElementById('csv2');

    const file1 = fileInput1.files[0];
    const file2 = fileInput2.files[0];

    if (!file1 || !file2) {
        alert("Please insert both CSV files.");
        return;
    }

    const fileReader1 = new FileReader();
    const fileReader2 = new FileReader();

    fileReader1.onload = function(event) {
        const csvData1 = event.target.result;
        const rows = csvData1.split('\n'); // Skip header row

        const headerRow = rows[0].split(',');
        const xIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'x');
        const yIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'y');
        const filenameIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'filename');

        if (xIndex === -1 || yIndex === -1 || filenameIndex === -1) {
            alert("X, Y, or filename column not found in CSV IMG file.");
            return;
        }

        rows.slice(1).forEach(function(row) {
            const columns = row.split(',');
            const x = columns[xIndex];
            const y = columns[yIndex];
            const filename = columns[filenameIndex]; // Assuming filename is the fourth column

            if(filename != undefined && x != undefined && y!= undefined){
                img_details.push([Number(x), Number(y), filename]) 
            }
        });
    };

    fileReader2.onload = function(event) {
        const selectedField = document.getElementById('fieldDropdown').value;
        const Path = document.getElementById("Path").value;
        const csvData2 = event.target.result;
        const rows = csvData2.split('\n'); // Skip header row

        const headerRow = rows[0].split(',');
        const xIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'x');
        const yIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'y');
        const HHNameIndex = headerRow.findIndex(header => header.trim().toLowerCase() === selectedField.toLowerCase());
        if (xIndex === -1 || yIndex === -1) {
            alert("X or Y column not found in CSV Handhole file.");
            return;
        }

        rows.slice(1).forEach(function(row) {
            const columns = row.split(',');
            const x = columns[xIndex];
            const y = columns[yIndex];
            const HHName = columns[HHNameIndex]

            if(HHName!= undefined ){
                HH_details.push([Number(x), Number(y), HHName]) 
            }
        });

        if (img_details.length > 0 && HH_details.length > 0) {
            let file = getDistant(img_details, HH_details); //from calculation.js
            let filename = file[0]
            let newfilename = file[1]
            let folderNames = file[2]
            console.log('Path" ',Path)
            convertToPY(filename, newfilename, Path, folderNames)
            alert('Done')
        }
    };

    fileReader1.readAsText(file1);
    fileReader2.readAsText(file2);
});
