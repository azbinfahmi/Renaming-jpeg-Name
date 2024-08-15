let img_details = [];
let HH_details = [];

document.getElementById('csv1').addEventListener('change', handleFileSelect);
document.getElementById('csv2').addEventListener('change', handleFileSelect);
document.getElementById('processBtn').addEventListener('click', runProcessing);

sendWS()

function handleFileSelect(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) {
        alert("Please insert the CSV file.");
        console.error('CSV file is missing');
        return;
    }

    const fileReader = new FileReader();

    fileReader.onload = function(event) {
        const csvData = event.target.result;
        const rows = csvData.split('\n');
        const headerRow = rows[0].split(',');

        if (fileInput.id === 'csv1') {
            const xIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'x');
            const yIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'y');
            const filenameIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'filename');

            if (xIndex === -1 || yIndex === -1 || filenameIndex === -1) {
                alert("X, Y, or filename column not found in CSV IMG file.");
                console.error('X, Y, or filename column not found in CSV IMG file.');
                return;
            }

            img_details = rows.slice(1).map(row => {
                const columns = row.split(',');
                const x = columns[xIndex];
                const y = columns[yIndex];
                const filename = columns[filenameIndex];

                if (filename !== undefined && x !== undefined && y !== undefined) {
                    return [Number(x), Number(y), filename];
                }
                return null;
            }).filter(detail => detail !== null);
            console.log('Image details:', img_details);
            if(img_details.length < 0){
                alert('something wrong with your data. ')
            }
        }

        else if (fileInput.id === 'csv2') {
            const xIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'x');
            const yIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'y');
            const HHNameIndex = headerRow.findIndex(header => header.trim().toLowerCase() === 'uid');

            if (xIndex === -1 || yIndex === -1) {
                alert("X or Y column not found in CSV Handhole file.");
                console.error('X or Y column not found in CSV Handhole file.');
                return;
            }

            HH_details = rows.slice(1).map(row => {
                const columns = row.split(',');
                const x = columns[xIndex];
                const y = columns[yIndex];
                const HHName = columns[HHNameIndex];

                if (HHName !== undefined) {
                    return [Number(x), Number(y), HHName];
                }
                return null;
            }).filter(detail => detail !== null);
            //add different name for duplicate HH name
            const nameMap = new Map();
            HH_details.forEach((item, index) => {
                let name = item[2];
                if (nameMap.has(name)) {
                    // Increment the count for this name
                    const count = nameMap.get(name);
                    nameMap.set(name, count + 1);
            
                    // Append the count to the name, starting from (1)
                    HH_details[index][2] = `${name}(${count})`;
                } else {
                    // Initialize the count for this name, starting from 1
                    nameMap.set(name, 1);
                }
            });

            console.log('Handhole details:', HH_details);
            if(HH_details.length < 0){
                alert('something wrong with your data. ')
            }
        }
    };

    fileReader.readAsText(file);
}

function runProcessing() {
    if (img_details.length === 0 || HH_details.length === 0) {
        alert("Please ensure both CSV files have been processed.");
        console.error('One or both CSV files are not processed');
        return;
    }

    const Path = document.getElementById("Path").value;

    let file = getDistant(img_details, HH_details); // Assuming this function is defined in calculation.js
    let filename = file[0];
    let newfilename = file[1];
    let folderNames = file[2];

    console.log('Path:', Path);
    convertToPY(filename, newfilename, Path, folderNames);
    alert('Done');
}

function sendWS() {
    // Create a new WebSocket connection
    const socket = new WebSocket('ws://192.168.0.9:3000');
  
    // Function to get the current formatted timestamp
    function getFormattedTimestamp() {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const now = new Date();
      const dayName = daysOfWeek[now.getDay()];
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = now.getFullYear();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const period = hours >= 12 ? 'p.m' : 'a.m';
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      return `${dayName}-${day}-${month}-${year} - ${formattedHours}.${minutes}${period}`;
    }
  
    // Function to get or create a unique user ID
    function getUserId() {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = 'user-' + Math.random().toString(36).substr(2, 9); // Generate a unique ID
        localStorage.setItem('userId', userId);
      }
      return userId;
    }
  
    socket.addEventListener('open', function (event) {
        // Prepare message with timestamp and unique user ID
        const timestamp = getFormattedTimestamp();
        const userId = getUserId();
        const message = `UserID: ${userId}, Platform: Renaming JPEG Name, Timestamp: ${timestamp}`;
        socket.send(message);
        socket.close();
    });
  
    socket.addEventListener('message', function (event) {
        // Handle incoming messages
    });
  
    socket.addEventListener('close', function (event) {
        // Handle the connection close event
    });
  
    socket.addEventListener('error', function (event) {
        // Handle WebSocket errors
    });
}
