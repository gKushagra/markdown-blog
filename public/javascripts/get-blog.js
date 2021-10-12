const homeUrl = "http://localhost:14878/index.html";

/**
 * Run on page load
 */
(function () {
    // get url params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if(params["id"]) {
        console.log(params["id"]);
        // get blog from backend
        // get comments from backend
    } else {
        // navigate to home
        window.location.replace(homeUrl)
    }

    // get the container to show blogs list
    const displayBlogContainer = document.getElementById('blog-display');
    const displayBlogCommentsContainer = document.getElementById('blog-comments-display');

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