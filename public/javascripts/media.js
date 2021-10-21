const domain = "https://kush-blogs.opensourced.in/";
var token;

(function () {

    token = localStorage.getItem('token');

    if (!token) {
        localStorage.clear();
        window.location.replace(domain + 'index.html');
    }

    const displayFilesList = async (files) => {
        const filesListEl = document.getElementById("files-list");
        while (filesListEl.firstChild) {
            filesListEl.removeChild(filesListEl.lastChild);
        }
        var links = [];
        var deleteBtns = [];
        files.forEach(file => {
            var link = domain + "media" + file.path.split("media")[1];
            var fileWrapperEl = document.createElement("div");
            fileWrapperEl.style.height = "240px";
            fileWrapperEl.style.width = "240px";
            fileWrapperEl.classList.add("card");
            var linkEl = document.createElement("input");
            linkEl.value = link;
            linkEl.id = 'input-' + file.id;
            linkEl.hidden = true;
            var linkCopyBtn = document.createElement("button");
            linkCopyBtn.id = file.id;
            linkCopyBtn.innerText = "Copy Link";
            var deleteFileLink = document.createElement("button");
            deleteFileLink.id = `delete-${file.id}`;
            deleteFileLink.setAttribute("data-filename", file.name);
            deleteFileLink.innerText = "Delete File";
            if (file.type.includes("image")) {
                var img = document.createElement("img");
                img.src = link;
                img.width = 200;
                img.height = 200;
                fileWrapperEl.appendChild(img);
            } else if (file.type.includes("video")) {
                var video = document.createElement("video");
                video.src = link;
                video.width = 240;
                video.height = 200;
                video.controls = true;
                fileWrapperEl.appendChild(video);
            } else if (file.type.includes("audio")) {
                var audio = document.createElement("audio");
                audio.src = link;
                audio.width = 200;
                audio.height = 200;
                audio.controls = true;
                fileWrapperEl.appendChild(audio);
            } else {
                var div = document.createElement("div");
                div.style.width = 200;
                div.style.height = 200;
                div.innerText = file.name;
                fileWrapperEl.appendChild(div);
            }
            fileWrapperEl.appendChild(linkEl);
            fileWrapperEl.appendChild(linkCopyBtn);
            links.push(linkCopyBtn);
            fileWrapperEl.appendChild(deleteFileLink);
            deleteBtns.push(deleteFileLink);
            filesListEl.appendChild(fileWrapperEl);
        });
        links.forEach(btn => {
            btn.addEventListener("click", (e) => {
                var copyText = document.getElementById(`input-${btn.id}`);
                navigator.clipboard.writeText(copyText.value)
            });
        });
        deleteBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                // call api
                fetch(domain + `media/${btn.id.split("-")[1]}/${btn.getAttribute("data-filename")}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                    .catch(err => {
                        alert(err);
                    })
                    .finally(() => {
                        getAllFiles();
                    });
            });
        });
    }

    const getAllFiles = async () => {
        fetch(domain + 'files', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                displayFilesList(data);
            })
            .catch(err => console.log(err));
    }

    getAllFiles();

    const optionsEl = document.getElementById("options");
    const fileInput = document.getElementById("upload-input");
    const uploadButton = document.getElementById("upload-btn");

    uploadButton.addEventListener('click', function (e) {
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
            .then(data => alert(data))
            .catch(err => console.log(err))
            .finally(() => {
                // reset controls
                fileInput.value = null;
                // refresh list
                getAllFiles();
            });
    });
})();