(function () {

    const mdEditorEl = document.getElementById("simple-md-editor");
    // const mdEditorDisplayEl = document.getElementById("md-editor-display");

    const simpleMdEditor = new SimpleMDE({
        element: mdEditorEl
    });

    // Not Required
    // const showdownConverter = new showdown.Converter();
    // showdownConverter.setFlavor('github');
    // setInterval(() => {
    //     let text = simpleMdEditor.value();
    //     mdEditorDisplayEl.innerHTML = showdownConverter.makeHtml(text);
    // }, 1000);

})();