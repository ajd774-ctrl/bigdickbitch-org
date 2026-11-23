"use strict";

const domain = window.location.hostname || "your domain";

document.title = `${domain} | Coming soon`;
document.getElementById("domain").textContent = domain;
document.getElementById("footer-domain").textContent = domain;
document.getElementById("year").textContent = new Date().getFullYear();
