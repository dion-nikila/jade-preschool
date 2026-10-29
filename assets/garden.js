(() => {
  const gardens = [...document.querySelectorAll(".bloom-garden")];
  if (!gardens.length) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".playful-hero");
  const toggle = document.querySelector(".motion-toggle");
  const active = new Set();
  let userPaused = false;
  let frame = 0;
  let heroVisible = true;

  function render() {
    frame = 0;
    if (userPaused && !reduced.matches) return;
    const height = innerHeight;
    const atPageEnd =
      scrollY + height >= document.documentElement.scrollHeight - 8;
    // Read geometry together, then update only the decorative SVG transforms.
    const values = [...active].map((el) => {
      const top = el.getBoundingClientRect().top;
      return [
        el,
        reduced.matches || atPageEnd
          ? 1
          : Math.max(0, Math.min(1, (height * 0.95 - top) / (height * 0.5))),
      ];
    });
    for (const [el, value] of values)
      el.style.setProperty("--growth", value.toFixed(3));
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  function syncMotion() {
    document.documentElement.classList.toggle(
      "motion-paused",
      userPaused || reduced.matches || document.hidden,
    );
    document.documentElement.classList.toggle("hero-in-view", heroVisible);
    if (toggle) {
      toggle.hidden = reduced.matches;
      toggle.setAttribute("aria-pressed", String(userPaused));
      toggle.querySelector("span").textContent = userPaused
        ? "Play animations"
        : "Pause animations";
      toggle
        .querySelector("path")
        .setAttribute("d", userPaused ? "M7 4l8 6-8 6Z" : "M7 5v10M13 5v10");
    }
    if (reduced.matches)
      gardens.forEach((el) => el.style.setProperty("--growth", "1"));
    schedule();
  }
  toggle?.addEventListener("click", () => {
    userPaused = !userPaused;
    syncMotion();
  });
  reduced.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", syncMotion);

  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("garden-motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.add(entry.target);
          else active.delete(entry.target);
        }
        schedule();
      },
      { rootMargin: "30px 0px", threshold: 0 },
    );
    gardens.forEach((el) => observer.observe(el));
    if (hero)
      new IntersectionObserver(
        ([entry]) => {
          heroVisible = entry.isIntersecting;
          syncMotion();
        },
        { threshold: 0 },
      ).observe(hero);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule, { passive: true });
  }
  syncMotion();
})();
