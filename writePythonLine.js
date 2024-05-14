function convertToPY(filename, newfilename, path, folderNames){
    const pythonScript = `
import os

filename = ${JSON.stringify(filename)}
newfilename = ${JSON.stringify(newfilename)}
folder_names = ${JSON.stringify(folderNames)}

def rename_files(directory, filenames, new_filenames):
    if len(filenames) != len(new_filenames):
        print("Error: Number of filenames and new filenames don't match.")
        return

    for filename, new_filename in zip(filenames, new_filenames):
        old_path = os.path.join(directory, filename)
        new_name = str(new_filename) + os.path.splitext(filename)[1]
        new_path = os.path.join(directory, new_name)
        os.rename(old_path, new_path)
        print(f"Renamed {filename} to {new_name}")

def create_folders(directory, folder_names):
    for folder_name in folder_names:
        new_folder_path = os.path.join(directory, folder_name)
        if not os.path.exists(new_folder_path):
            os.makedirs(new_folder_path)
            print(f"Created directory: {new_folder_path}")
        else:
            print(f"Directory already exists: {new_folder_path}")

# Example usage:
directory = ${JSON.stringify(path)}

#create_folders(directory, folder_names)
rename_files(directory, filename, newfilename)
`;

    // Create a Blob containing the Python script
    const blob = new Blob([pythonScript], { type: "text/plain" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element for downloading the Python script
    const link = document.createElement("a");
    link.href = url;
    link.download = "rename_files_Script.py"; // Set the filename for the downloaded file

    // Append the link to the document body and click it to trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup: remove the link and revoke the URL to free up memory
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}