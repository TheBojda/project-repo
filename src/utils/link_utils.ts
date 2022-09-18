export function getIcon(url) {
    if (url.startsWith("https://github")) return "fab fa-square-github";
    if (url.startsWith("https://youtube.com")) return "fab fa-square-youtube";
    if (url.startsWith("https://www.youtube.com")) return "fab fa-square-youtube";
    if (url.startsWith("https://facebook.com")) return "fab fa-square-facebook";
    if (url.startsWith("https://www.facebook.com")) return "fab fa-square-facebook";
    if (url.startsWith("https://twitter.com")) return "fab fa-square-twitter";
    if (url.startsWith("https://www.twitter.com")) return "fab fa-square-twitter";
    return "fa fa-external-link-square";
}