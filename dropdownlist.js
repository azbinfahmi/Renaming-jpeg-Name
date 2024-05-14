document.getElementById('csv2').addEventListener('change', function() {
    const fileInput2 = document.getElementById('csv2');
    const file2 = fileInput2.files[0];
    
    if (!file2) {
        alert("Please select CSV file 2.");
        return;
    }

    const fileReader2 = new FileReader();

    fileReader2.onload = function(event) {
        const csvData2 = event.target.result;
        // Process CSV file 2 here
        showFieldDropdown(csvData2);
    };

    fileReader2.readAsText(file2);
});

function showFieldDropdown(csvData) {
    const rows = csvData.split('\n');
    const headerRow = rows[0].split(',');

    let dropdownHTML = '<label for="fieldDropdown">Select Handholes names layer:</label>';
    dropdownHTML += '<select id="fieldDropdown">';

    headerRow.forEach(field => {
        dropdownHTML += `<option value="${field}">${field}</option>`;
    });

    dropdownHTML += '</select>';

    document.getElementById('csv2Dropdown').innerHTML = dropdownHTML;
}