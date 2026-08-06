// console.log("style.js loading");

function loadStyle(href) {
    return new Promise((resolve, reject) => {
        // Check if stylesheet is already present
        if (document.querySelector(`link[href="${href}"]`)) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;

        link.onload = () => resolve(link);
        link.onerror = () => reject(new Error(`Failed to load style: ${href}`));

        document.head.appendChild(link);
    });
}

// ["style"].forEach((fname) => {
//     loadStyle("css/" + fname + ".css");
// })

// console.log("style.js loaded");