const domain = "https://blog.softwright.in/";
var token;

(function () {
    token = localStorage.getItem('token');

    const mdEditorEl = document.getElementById("simple-md-editor");
    const showdownConverter = new showdown.Converter();
    // const mdEditorDisplayEl = document.getElementById("md-editor-display");

    const simpleMdEditor = new SimpleMDE({
        element: mdEditorEl
    });

    const saveBtn = document.getElementById('save-blog');
    const cancelBtn = document.getElementById("cancel");
    const titleInput = document.getElementById("title");


    // get url params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params["id"]) {
        const id = params["id"];

        // get data from backend
        // get blog from backend
        const getBlog = async () => {
            var response = await fetch(domain + `blog/${id}`, {
                method: "GET",
                mode: "no-cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: "no-referrer",
            });

            return response.json();
        }

        getBlog()
            .then(data => {
                console.log(data);
                var turndownService = new TurndownService();
                var markdown = turndownService.turndown(data.text);
                console.log(markdown);
                simpleMdEditor.value(markdown);
                titleInput.value = data.title;
            });

        saveBtn.addEventListener('click', (e) => {

            if (!titleInput.value || titleInput.value == "")
                alert("Title cannot be empty!");

            const updateBlog = async () => {
                var response = await fetch(domain + `blog/${id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "$set": {
                            title: titleInput.value,
                            date: new Date(),
                            text: showdownConverter.makeHtml(simpleMdEditor.value())
                        }
                    })
                });

                return response.json();
            }

            updateBlog()
                .then(data => {
                    console.log(data);
                    window.location.replace(domain + 'portal.html');
                });
        });

        const deleteBtn = document.getElementById('delete-blog');
        deleteBtn.hidden = false;
        deleteBtn.addEventListener('click', (e) => {
            const deleteBlog = async () => {
                var response = await fetch(domain + `blog/${id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                return response.json();
            }

            deleteBlog()
                .then(data => {
                    console.log(data);
                    window.location.replace(domain + 'portal.html');
                });
        });

    } else {

        saveBtn.addEventListener('click', (e) => {
            const addBlog = async () => {
                var response = await fetch(domain + `blog`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: null,
                        title: titleInput.value,
                        date: new Date(),
                        text: showdownConverter.makeHtml(simpleMdEditor.value())
                    })
                });

                return response.json();
            }

            addBlog()
                .then(data => {
                    console.log(data);
                    window.location.replace(domain + 'portal.html');
                });
        });
    }

    cancelBtn.addEventListener('click', (e) => {
        window.location.replace(domain + 'portal.html');
    });

    // Not Required
    // const showdownConverter = new showdown.Converter();
    // showdownConverter.setFlavor('github');
    // setInterval(() => {
    //     let text = simpleMdEditor.value();
    //     mdEditorDisplayEl.innerHTML = showdownConverter.makeHtml(text);
    // }, 1000);

})();