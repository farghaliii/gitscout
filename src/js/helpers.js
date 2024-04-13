import "core-js/stable";
import "regenerator-runtime/runtime.js";

import { TIMEOUT_SEC } from "./config";

const timeout = function (duration) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Requet took too long! Timeout after ${duration} second`)
      );
    }, duration * 1000);
  });
};

export const sanitizeData = function (data) {
  // Escape HTML entities (<>&"') using a single regular expression
  return data.replace(/[<>&"']/g, function (match) {
    switch (match) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return match;
    }
  });
};

export const getJSON = async function (url) {
  try {
    const ACCESS_TOKEN = await getAccessToken();

    const res = await Promise.race([
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `token ${ACCESS_TOKEN}`,
          Accept: "application/vnd.github+json,application/vnd.github.diff",
        },
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${res.status} - ${data.message}`);
    return data;
  } catch (error) {
    throw error;
  }
};

const getAccessToken = async function () {
  const response = await fetch("/.netlify/functions/getGithubAccessToken");
  const data = await response.json();
  return data.accessToken;
};
