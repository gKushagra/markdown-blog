const domain = "https://blog.softwright.in/";

/**
 * 
 * @returns Wrapper div for list items
 */
function getListGroupEl() {
    let listGrpContainer = document.createElement('div');
    listGrpContainer.classList.add("list-group");

    return listGrpContainer;
}

/* 
 * - List Item Element : Bootstrap Components
 *
 * <div class="list-group">
 *  <a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
 *  <a href="#" class="list-group-item list-group-item-action">Morbi leo risus</a>
 * </div>
 *   
 * */

/**
 * 
 * @param {*} title of the blog
 * @param {*} date posted
 * @param {*} text content of blog
 * @returns list item with title, date and sliced(100 chars) text
 */
function getListItemEl(id, title, date) {
    let listItemEl = document.createElement('a');

    listItemEl.classList.add("list-group-item");
    listItemEl.classList.add("list-group-item-action");

    let formattedDate = new Date(date);
    listItemEl.innerText = title + ', ' + formattedDate.toLocaleDateString("en-US");
    listItemEl.href = domain + `edit-blog.html?id=${id}`;
    listItemEl.target = "_blank";

    return listItemEl;
}

function fetchBlogs() {
    // fetch blogs
    const getBlogs = async () => {
        var response = await fetch(domain + 'blog', {
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

    getBlogs()
        .then(data => {
            console.log(data);
            blogs = data;
            comments = [];

            // get the container to show blogs list
            const blogsList = document.getElementById('blogs-list');

            const listGroupContainer = getListGroupEl();

            // iterate over blogs and generate list items
            for (let i = 0; i < blogs.length; i++) {
                let listItemEl = getListItemEl(
                    blogs[i].id,
                    blogs[i].title,
                    blogs[i].date
                );
                listGroupContainer.appendChild(listItemEl);
            }

            // append the list items group to blogs-list div
            blogsList.appendChild(listGroupContainer);
        })
}

function enableBtns() {
    const newBlogBtn = document.getElementById("new-blog");
    const filesBtn = document.getElementById("files");
    const logoutBtn = document.getElementById("logout");

    newBlogBtn.addEventListener('click', (e) => {
        window.location.replace(domain + 'edit-blog.html');
    });

    filesBtn.addEventListener('click', (e) => {
        window.location.replace(domain + 'media.html');
    });

    logoutBtn.addEventListener('click', (e) => {
        localStorage.removeItem('token');
        window.location.replace(domain + 'index.html');
    });
}

(function () {

    if (!localStorage.getItem("token")) {
        let accessCode = prompt("Access Code");

        const attemptLogin = async () => {

            var response = await fetch(domain + `authenticate`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'X-ACCESS-CODE': accessCode
                })
            });

            if (response.status === 404)
                return response.json({ error: "Invalid Access Code" });
            else
                return response.json();
        }

        attemptLogin()
            .then(data => {
                console.log(data);
                if (data.error)
                    alert(data.error);
                else {
                    localStorage.setItem("token", data.token);

                    // get data and display
                    fetchBlogs();
                    enableBtns();
                }
            });
    } else {
        // get data and display
        fetchBlogs();
        enableBtns();
    }
})();