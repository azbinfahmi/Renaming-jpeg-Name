function getDistant(img_details,HH_details){
    let filename = [], newfilename = []
    console.log('img_details: ',img_details)
    console.log('HH_details: ',HH_details)
    // Function to generate GeoJSON LineString
    function createLineString(coordinates,name,distKM, distanceInMeter, OriginalFileName) {
        return {
            type: "Feature",
            properties: {
                Name: name,
                DistanceInKM: distKM,
                DistanceInMeter: distanceInMeter,
                X: coordinates[0][1],
                Y: coordinates[0][0],
                OriginalFileName: OriginalFileName
            },
            geometry: {
                type: "LineString",
                coordinates: coordinates
            }
        };
    }
    function calculateEuclideanDistance(point1, point2) {
        const [lat1, lon1] = point1;
        const [lat2, lon2] = point2;
    
        // Calculate the difference in latitudes and longitudes
        const deltaLat = lat2 - lat1;
        const deltaLon = lon2 - lon1;
    
        // Calculate the squared differences
        const squaredDeltaLat = deltaLat ** 2;
        const squaredDeltaLon = deltaLon ** 2;
    
        // Calculate the sum of squared differences
        const sumOfSquaredDeltas = squaredDeltaLat + squaredDeltaLon;
    
        // Calculate the square root of the sum of squared differences
        const distance = Math.sqrt(sumOfSquaredDeltas);
    
        return distance;
    }
    
    function findNearestPoints(img_details, HH_details) {
        const nearestPoints = [];
        const nearestLines = [];
        let minDist =  prompt('Maximum radius from HH to image location in Meter:', 100);
        img_details.forEach(img_point => {
            let minDistance = Infinity;
            let nearestLabel = null;
            let nearestLine = null
            let coordHHPoint = null, dist = null
            HH_details.forEach(hh_point => {
                const distance = calculateEuclideanDistance(img_point, hh_point);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestLabel = hh_point[2];
                    coordHHPoint = [hh_point[0],hh_point[1]]
                    dist = minDistance
                }
            });
            
            minDist = minDistance* 111000 //convert to meters
            if(minDist > 0 && minDist <= 100 ){
                nearestPoints.push([img_point[2], nearestLabel, minDistance]);
                filename.push(`${img_point[2]}.jpeg`)
                // Get the label of the nearest point
                let nearestLabel_new = `${nearestLabel} (1)`
                if(newfilename.includes(nearestLabel_new)){
                    let pass = false
                    let index = 2
                    while (pass == false){
                        nearestLabel_new = `${nearestLabel} (${index})`
                        index += 1
                        if(!newfilename.includes(nearestLabel_new)){
                            nearestLabel = nearestLabel_new
                            pass = true
                        }
                    }
                }
                nearestLabel_new = `${nearestLabel_new}__${img_point[2]}`
                let distanceInKm = dist * 111
                let distanceInMeter =dist * 111000
                nearestLine = createLineString([[img_point[0],img_point[1]], coordHHPoint], nearestLabel_new, distanceInKm,distanceInMeter, img_point[2]);
                nearestLines.push(nearestLine)
                newfilename.push(nearestLabel_new)
            }
            
        });
    
        return [nearestPoints,nearestLines];
    }

    function downloadGeoJSON(data, filename) {
        const json = JSON.stringify({
            type: "FeatureCollection",
            name: "line",
            features: data
        });
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function getHHNames(){
        let uniqueHH = []
        for(let i=0; i < HH_details.length; i++ ){
            if(!HH_details.includes(HH_details[i][2])){
                uniqueHH.push(HH_details[i][2])
            }
        }
        return uniqueHH
    }

    const result = findNearestPoints(img_details, HH_details);
    const folderNames = getHHNames()
    const nearestPoints = result[0]
    const nearestLines= result[1]
    console.log('nearestPoints: ',nearestPoints);

    console.log('filename: ',filename);
    console.log('newfilename: ',newfilename);
    // Download GeoJSON file
    downloadGeoJSON(nearestLines, 'HHtoIMG.geojson');

    return [filename,newfilename, folderNames]
}