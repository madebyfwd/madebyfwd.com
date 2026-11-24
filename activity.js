// Build log: renders the GitHub contribution graph for data-gh-user.
// Data: github-contributions-api.jogruber.de (public, CORS-enabled).
// If the fetch fails, the section keeps its link to the GitHub profile.
(() => {
  const card = document.querySelector("[data-gh-user]");
  if (!card) return;
  const user = card.dataset.ghUser;
  const graph = card.querySelector("[data-gh-graph]");
  const total = card.querySelector("[data-gh-total]");
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(render)
    .catch(() => card.classList.add("gh-failed"));

  function render(data) {
    const days = data.contributions;
    total.textContent = (data.total.lastYear ?? days.reduce((n, d) => n + d.count, 0)).toLocaleString("en-US");

    // Pad so the first column starts on Sunday, like GitHub.
    const pad = new Date(days[0].date + "T00:00:00").getDay();
    const cells = Array(pad).fill(null).concat(days);
    const weeks = Math.ceil(cells.length / 7);
    graph.style.setProperty("--weeks", weeks);

    // Week the "FwdWorks starts here" marker points at (data-gh-start, YYYY-MM-DD).
    const startIdx = card.dataset.ghStart ? days.findIndex((d) => d.date >= card.dataset.ghStart) : -1;
    const startWeek = startIdx < 0 ? -1 : Math.floor((startIdx + pad) / 7);

    const frag = document.createDocumentFragment();

    // Month labels row
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const d = cells[w * 7] || cells[w * 7 + pad];
      const m = d ? new Date(d.date + "T00:00:00").getMonth() : -1;
      const label = document.createElement("span");
      label.className = "gh-month";
      label.style.gridColumn = w + 2;
      if (m !== lastMonth && w < weeks - 1) { label.textContent = MONTHS[m]; lastMonth = m; }
      frag.append(label);
    }

    // Weekday labels
    ["Mon", "Wed", "Fri"].forEach((t, i) => {
      const s = document.createElement("span");
      s.className = "gh-day";
      s.style.gridRow = 3 + i * 2;
      s.textContent = t;
      frag.append(s);
    });

    // Day cells
    cells.forEach((d, i) => {
      const c = document.createElement("i");
      c.style.gridColumn = Math.floor(i / 7) + 2;
      c.style.gridRow = (i % 7) + 2;
      if (d) {
        c.className = "l" + d.level;
        c.title = `${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`;
      } else c.className = "pad";
      frag.append(c);
    });

    // "FwdWorks starts here" marker
    if (startWeek >= 0) {
      const mark = document.createElement("span");
      mark.className = "gh-start hand";
      mark.style.gridColumn = startWeek + 2;
      mark.textContent = "↓ FwdWorks starts here";
      frag.append(mark);
      graph.classList.add("has-start");
    }

    graph.append(frag);
    card.classList.add("gh-ready");
    const scroll = card.querySelector(".gh-scroll");
    scroll.scrollLeft = scroll.scrollWidth;
  }
})();
