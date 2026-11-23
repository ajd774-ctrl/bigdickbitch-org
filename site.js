"use strict";

const domain = "bigdickbitch.org";
const statusMessage = document.getElementById("status");
const domainStatus = document.getElementById("domain-status");
const pageType = document.getElementById("page-type");
const keywords = document.getElementById("keywords");
const domainLink = document.getElementById("domain-link");

document.title = `${domain} | Domain information`;
document.getElementById("domain").textContent = domain;

async function loadDomainInformation() {
  const query = new URLSearchParams({
    trafficTarget: "gd",
    abp: "1",
    gdabp: "true",
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://web-api.aws.parking.godaddy.com/v1/parking/landers/${encodeURIComponent(domain)}?${query}`,
      { credentials: "omit", signal: controller.signal },
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    const config = result.untargeted || result;
    const actualDomain = config.domain || {};
    const lander = config.lander || {};
    const terms = config.keywords?.terms || config.adSense?.keywords || [];
    const bannerUrl = lander.banner?.link;

    document.getElementById("domain").textContent =
      actualDomain.rootDomainDisplayText || actualDomain.rootDomain || domain;
    domainStatus.textContent = actualDomain.status?.internal || "Not provided";
    pageType.textContent = lander.template || "Not provided";
    keywords.textContent = Array.isArray(terms) && terms.length
      ? terms.filter((term) => typeof term === "string").join(", ")
      : "None provided";
    statusMessage.textContent = "This page summarizes the live public parking configuration. It does not display ads or execute content from the API.";

    if (typeof bannerUrl === "string") {
      const url = new URL(bannerUrl);
      if (url.protocol === "https:" &&
          (url.hostname === "godaddy.com" || url.hostname.endsWith(".godaddy.com")) &&
          !url.username && !url.password) {
        domainLink.href = url.href;
        domainLink.hidden = false;
      }
    }
  } catch (error) {
    console.warn("Could not load domain information:", error);
    statusMessage.textContent = error.name === "AbortError"
      ? "The domain information request timed out. Try again later."
      : "Domain information is temporarily unavailable.";
    domainStatus.textContent = "Unavailable";
    pageType.textContent = "Unavailable";
    keywords.textContent = "Unavailable";
  } finally {
    clearTimeout(timeout);
  }
}

loadDomainInformation();
