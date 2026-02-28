// Register service worker (PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

// --- Calendar ICS download ---
const tapDate = document.getElementById("tapDate");
if (tapDate) {
  tapDate.addEventListener("click", (e) => {
    e.preventDefault();

    // Camp dates: July 2–4, 2026
    // NOTE: ICS "DTEND" is typically exclusive; set to July 5 to cover through July 4 inclusive.
    const ics = buildICS({
      title: "BUC Camp 26 – Pentecost",
      location: "His Thousand Hills, 458 Phippen Rd, Wellsboro, PA 16901",
      description: "BUC Camp 26 (Pentecost) – Scripture Setting: Acts 2",
      startDate: "20260702", // YYYYMMDD
      endDate: "20260705"    // YYYYMMDD (exclusive end)
    });

    downloadFile("BUC-Camp-26.ics", ics, "text/calendar");
  });
}

function buildICS({ title, location, description, startDate, endDate }) {
  // All-day event
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BUC Camp 26//PWA//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${cryptoRandom()}@buc-camp-26`,
    `DTSTAMP:${utcTimestamp()}`,
    `SUMMARY:${escapeICS(title)}`,
    `LOCATION:${escapeICS(location)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function utcTimestamp() {
  // YYYYMMDDTHHMMSSZ
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function cryptoRandom() {
  // Small UID helper
  const arr = new Uint8Array(16);
  (crypto?.getRandomValues ? crypto.getRandomValues(arr) : arr.fill(7));
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function escapeICS(s) {
  // Escape commas, semicolons, and newlines per ICS rules
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

(function(){
  const overlay = document.getElementById("introOverlay");
  const video = document.getElementById("introVideo");
  const skip = document.getElementById("skipIntro");

  if(!overlay || !video) return;

  function closeIntro(){
    overlay.style.display = "none";
    try { video.pause(); } catch(e) {}
  }

  // When video finishes, hide it
  video.addEventListener("ended", closeIntro);

  // Skip button
  if(skip) skip.addEventListener("click", closeIntro);

  // Safety: if autoplay fails, show a tap-to-play
  video.play().catch(() => {
    // If autoplay blocked, let user tap anywhere to start
    overlay.addEventListener("click", () => {
      video.play().catch(()=>{});
    }, { once: true });
  });

  // Optional: auto-close after 6 seconds even if it doesn't end
  setTimeout(() => {
    // Only close if still visible
    if(overlay.style.display !== "none") closeIntro();
  }, 8000);
})();