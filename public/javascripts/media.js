const domain = "http://localhost:14878/";
var token;

(function () {

    token = localStorage.getItem('token');

    if (!token) {
        localStorage.clear();
        window.location.replace(domain + 'index.html');
    }

    const optionsEl = document.getElementById("options");
    const fileInput = document.getElementById("upload-input");
    const uploadButton = document.getElementById("upload-btn");

    uploadButton.addEventListener('click', function (e) {
        console.log(fileInput.files);

        // send file to api
        var requestBody = new FormData();
        requestBody.append('uploadFile', fileInput.files[0]);

        fetch(domain + 'media', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: requestBody
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
            .finally(() => {
                // reset controls
                fileInput.value = null;
                // refresh list
                
            })
    });

})();