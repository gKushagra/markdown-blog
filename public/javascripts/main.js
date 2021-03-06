const domain = "http://localhost:14878/";

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
 * <a href="#" class="list-group-item list-group-item-action active">
 *   <div class="d-flex w-100 justify-content-between">
 *     <h5 class="mb-1">List group item heading</h5>
 *     <small>3 days ago</small>
 *   </div>
 *   <p class="mb-1">Some placeholder content in a paragraph.</p>
 * </a>
 *   
 * */

/**
 * 
 * @param {*} title of the blog
 * @param {*} date posted
 * @param {*} text content of blog
 * @returns list item with title, date and sliced(100 chars) text
 */
function getListItemEl(id, title, date, text) {
    let listItemWrapperEl = document.createElement('a');
    let listItemTitleEl = document.createElement("h5");
    let listItemDateEl = document.createElement("small");
    // let listItemTextEl = document.createElement("p");
    let listItemHeaderEl = document.createElement("div");

    // listItemTextEl.classList.add("mb-1");
    listItemTitleEl.classList.add("mb-1");
    listItemHeaderEl.classList.add("d-flex");
    listItemHeaderEl.classList.add("w-100");
    listItemHeaderEl.classList.add("justify-content-between");
    listItemWrapperEl.classList.add("list-group-item");
    listItemWrapperEl.classList.add("list-group-item-action");

    // listItemTextEl.innerHTML = text;
    let formattedDate = new Date(date);
    listItemDateEl.innerText = formattedDate.toLocaleDateString("en-US");
    listItemTitleEl.innerText = title;
    listItemWrapperEl.href = domain + `blog.html?id=${id}`;
    listItemWrapperEl.target = "_blank";

    listItemHeaderEl.appendChild(listItemTitleEl);
    listItemHeaderEl.appendChild(listItemDateEl);
    listItemWrapperEl.appendChild(listItemHeaderEl);
    // listItemWrapperEl.appendChild(listItemTextEl);

    return listItemWrapperEl;
}

/**
 * Run on page load
 */
(function () {

    // Object defs
    // Blog { id, title, date, text }
    // Comment { id, blogId, name, date, text }

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
                    blogs[i].date,
                    blogs[i].text.slice(0, 250)
                );
                listGroupContainer.appendChild(listItemEl);
            }

            // append the list items group to blogs-list div
            blogsList.appendChild(listGroupContainer);
        })
})();

