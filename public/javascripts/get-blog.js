const domain = "https://blog.softwright.in/";

/**
 * Run on page load
 */
(function () {
    // get url params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params["id"]) {
        console.log(params["id"]);
        const id = params["id"];
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
                // get the container to show blogs list
                const displayBlogContainer = document.getElementById('blog-display');
                const displayBlogTitle = document.getElementById("blog-title");
                const displayBlogDate = document.getElementById("blog-date");
                displayBlogContainer.innerHTML = data.text; // use in prod
                displayBlogTitle.innerText = data.title;
                let date = new Date(data.date);
                displayBlogDate.innerText = date.toLocaleDateString('en-US');
                // const displayBlogCommentsContainer = document.getElementById('blog-comments-display');
            });
    } else {
        // navigate to home
        window.location.replace(domain + `index.html`)
    }

})();

/**
 * - Portal
 *  - passcode access
 *  - get all blogs
 *  - edit blog
 *  - new blog
 *  - delete blog
 *
 * - Blog
 *  - get blog from db
 *  - display blog markdown
 *  - add comment
 */