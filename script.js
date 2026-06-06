const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const segments = document.querySelectorAll(".segment");
const programCards = document.querySelectorAll(".program-card");
const leadForm = document.querySelector("#lead-form");
const savedCount = document.querySelector("#saved-count");
const formStatus = document.querySelector("#form-status");
const exportButton = document.querySelector("#export-leads");
const glow = document.querySelector(".cursor-glow");
const revealItems = document.querySelectorAll(".reveal");
const countItems = document.querySelectorAll("[data-count]");
const accordionItems = document.querySelectorAll(".accordion-item");
const certCheck = document.querySelector("#cert-check");
const certInput = document.querySelector("#cert-code");
const certResult = document.querySelector("#cert-result");
const magneticItems = document.querySelectorAll(".magnetic");

const storageKey = "qingcheng-leads";

function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function setLeads(leads) {
  localStorage.setItem(storageKey, JSON.stringify(leads));
  if (savedCount) savedCount.textContent = String(leads.length);
}

function animateCount(item) {
  if (item.dataset.done) return;
  const target = Number(item.dataset.count);
  if (!Number.isFinite(target)) return;

  item.dataset.done = "true";
  const duration = 900;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    item.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

setLeads(getLeads());

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

segments.forEach((segment) => {
  segment.addEventListener("click", () => {
    const filter = segment.dataset.filter;

    segments.forEach((item) => item.classList.toggle("is-active", item === segment));
    programCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
  revealObserver.observe(item);
});

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) animateCount(entry.target);
  });
}, { threshold: 0.55 });

countItems.forEach((item) => countObserver.observe(item));

accordionItems.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const wasOpen = button.classList.contains("is-open");

    accordionItems.forEach((item) => {
      item.classList.remove("is-open");
      const next = item.nextElementSibling;
      if (next) next.style.maxHeight = "0px";
    });

    if (!wasOpen && panel) {
      button.classList.add("is-open");
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  });
});

certCheck?.addEventListener("click", () => {
  const code = certInput.value.trim();
  if (!code) {
    certResult.textContent = "请输入证书或作品档案编号。";
    return;
  }

  certResult.textContent = `已收到编号 ${code}。当前为演示结果：正式版可接入学员作品档案、证书状态和营期记录。`;
});

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const lead = {
    name: formData.get("name")?.toString().trim(),
    contact: formData.get("contact")?.toString().trim(),
    size: formData.get("size")?.toString().trim(),
    program: formData.get("program")?.toString(),
    message: formData.get("message")?.toString().trim(),
    createdAt: new Date().toISOString()
  };

  const leads = getLeads();
  leads.unshift(lead);
  setLeads(leads);

  leadForm.reset();
  formStatus.textContent = "已保存到本机浏览器，可点击“导出 JSON”交给团队整理。";
});

exportButton?.addEventListener("click", async () => {
  const leads = getLeads();
  const payload = JSON.stringify(leads, null, 2);

  if (!leads.length) {
    formStatus.textContent = "当前还没有咨询记录。";
    return;
  }

  try {
    await navigator.clipboard.writeText(payload);
    formStatus.textContent = "咨询记录 JSON 已复制到剪贴板。";
  } catch {
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "qingcheng-leads.json";
    anchor.click();
    URL.revokeObjectURL(url);
    formStatus.textContent = "浏览器已下载咨询记录 JSON。";
  }
});

window.addEventListener("pointermove", (event) => {
  if (!glow || window.matchMedia("(max-width: 640px)").matches) return;
  glow.style.opacity = "1";
  glow.style.transform = `translate(${event.clientX - 110}px, ${event.clientY - 110}px)`;
}, { passive: true });

window.addEventListener("pointerleave", () => {
  if (glow) glow.style.opacity = "0";
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});
