// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

export function qsAll(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
    qs(selector).addEventListener("touchend", (event) => {
        event.preventDefault();
        callback();
    });
    qs(selector).addEventListener("click", callback);
}

export function getParams(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

export function renderListWithTemplate(
    templateFn,
    parentElement,
    list,
    position = "afterbegin",
    clear = false,
) {
    if (clear) {
        parentElement.innerHTML = "";
    }
    const templateList = list.map(templateFn);
    parentElement.insertAdjacentHTML(position, templateList.join(""));
}

export function renderWithTemplate(template, parent, data, callback) {
    parent.insertAdjacentHTML("afterbegin", template);

    if (callback) callback(data);
}

export function checkVoidArr(arr) {
    return arr.length === 0;
}

export function convertToJson(res) {
    if (res.ok) {
        return res.json();
    } else {
        throw new Error("Bad Response");
    }
}

export function convertToText(res) {
    if (res.ok) {
        return res.text();
    } else {
        throw new Error("Bad Response");
    }
}

export function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => reject(false);
        img.src = url;
    });
}

export function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.replace(word[0], word[0].toUpperCase()))
        .join(" ");
}


export async function loadTemplate(path) {
    const template = await fetch(path).then(convertToText);
    return template;
}

export async function loadHeaderFooter(headerCallback) {
    const headerTemplate = await loadTemplate("../partials/header.html");
    const headerElement = qs("#main-header");
    const footerTemplate = await loadTemplate("../partials/footer.html");
    const footerElement = qs("#main-footer");

    renderWithTemplate(headerTemplate, headerElement, "", headerCallback);
    renderWithTemplate(footerTemplate, footerElement);
}
