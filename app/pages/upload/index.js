import React, {useRef, useState} from "react";
import Papa from "papaparse";
import { useRouter } from "next/dist/client/router";

const Upload = () => {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef();
    const router = useRouter();


    const handleUploadCSV = () => {
        setUploading(true);

        const input = inputRef?.current;
        const reader = new FileReader();
        const [file] = input.files;
        
        reader.readAsText(file);
        reader.onloadend = ({ target }) => { 
            const csv = Papa.parse(target.result, {
                header: true,
                delimiter: ";",
                dynamicTyping: true,
                skipEmptyLines: 'greedy',
                complete: function (results) {
                    console.log("Finished: ", results);
                }
            });

            const fileName = file.name

            fetch("http://localhost:3080/uploads/csv", {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },
                body: JSON.stringify({
                    csv: csv?.data,
                    file: fileName,
                }),
            })
                .then(() => {
                    setUploading(false);
                    console.log("CSV Uploaded!");

                })
                .catch((error) => {
                    setUploading(false);
                    console.warn(error);
                });



            router.push('/upload/list');
        };

    };


    return (
        <div className="d-flex h-100 text-center text-white align-items-center"> 
            <div className="cover-container d-flex w-100 w-100 p-3 mx-auto flex-column align-items-center">
                <header className="mb-auto">Telefone verdadeiro com CSV!</header>
                <main className="px-3">
                    <div className="input-group mt-3">
                        <div className="lead">
                            <input ref={inputRef} disabled={uploading} type="file" className="form-control" />
                        </div>
                        <button className="btn btn-primary" type="button"
                            onClick={handleUploadCSV}
                            aria-disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

Upload.propTypes = {};

export default Upload