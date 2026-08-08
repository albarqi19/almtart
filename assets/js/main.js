/* ==========================================================================
   موقع المحامي عبدالله بن سعد بن سراج آل مُطارد — السلوك
   لا اعتماد على أي مكتبةٍ خارجية، ولا أيّ نداءٍ لشبكةٍ خارجية.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     إعداداتُ بوابة العملاء
     PORTAL_MODE = "link"  ⇒ الزرّ يفتح بوابة الرائد في تبويبٍ جديد.
     PORTAL_MODE = "off"   ⇒ يُخفى الزرّ كلياً حتى يُربط المكتب بالنظام.

     ⚠️ عند الربط: PORTAL_URL يجب أن يكون **نطاق المكتب الخاصّ**
     (مثل https://app.almutared.sa) لا نطاق المنصّة — الدخول من جذر
     alraedlaw.com لا يمرّ إلا لمُلّاك الشركات ومدير المنصّة.
     ------------------------------------------------------------------------ */
  /* 🚨 مؤقّت: النطاقُ أدناه هو **جذر المنصّة**، والدخولُ منه لا يمرّ إلا
     لمُلّاك الشركات ومدير المنصّة — فلا يستطيع عملاءُ المكتب ولا موظّفوه
     الدخولَ منه. فورَ تسجيل المكتب في النظام، بدّله بنطاق المكتب نفسه
     (فرعيّاً مثل https://almutared.alraedlaw.com أو خاصّاً مثل
     https://app.almutared.sa) — عندها وحدها يعمل الزرّ لمن وُجد لأجلهم.
     ولإخفاء الزرّ ريثما يُربط: اجعل PORTAL_MODE = "off". */
  var PORTAL_MODE = "link";
  var PORTAL_URL = "https://alraedlaw.com";

  /* -------------------------------------------------- بوابة العملاء */
  function initPortal() {
    var links = document.querySelectorAll("[data-portal]");
    Array.prototype.forEach.call(links, function (el) {
      if (PORTAL_MODE === "link" && PORTAL_URL) {
        el.setAttribute("href", PORTAL_URL);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      } else {
        el.setAttribute("hidden", "");
      }
    });
  }

  /* -------------------------------------------------- قائمة الجوال */
  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var list = document.getElementById("nav-list");
    if (!toggle || !list) return;

    function setOpen(open) {
      list.setAttribute("data-open", String(open));
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(list.getAttribute("data-open") !== "true");
    });

    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && list.getAttribute("data-open") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // إغلاقُ القائمة إن عاد العرضُ إلى المكتبيّ وهي مفتوحة
    var mq = window.matchMedia("(min-width: 901px)");
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(
      function () { if (mq.matches) setOpen(false); }
    );
  }

  /* -------------------------------------------------- ظلُّ الترويسة عند التمرير */
  function initHeader() {
    var header = document.querySelector(".header");
    if (!header) return;
    var ticking = false;
    function update() {
      header.setAttribute("data-scrolled", String(window.scrollY > 12));
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* -------------------------------------------------- إبرازُ القسم الحاليّ في القائمة */
  function initScrollSpy() {
    var links = document.querySelectorAll(".nav__link[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    Array.prototype.forEach.call(links, function (a) {
      var id = a.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = a;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Array.prototype.forEach.call(links, function (a) { a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "page");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    Object.keys(map).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }

  /* -------------------------------------------------- الظهورُ التدريجيّ */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Array.prototype.forEach.call(items, function (el) {
        el.setAttribute("data-visible", "true");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = parseInt(entry.target.getAttribute("data-reveal-delay") || "0", 10);
        window.setTimeout(function () {
          entry.target.setAttribute("data-visible", "true");
        }, delay);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------- نوافذ الفريق */
  function initMemberDialogs() {
    var openers = document.querySelectorAll("[data-dialog]");
    if (!openers.length) return;

    Array.prototype.forEach.call(openers, function (btn) {
      btn.addEventListener("click", function () {
        var dlg = document.getElementById(btn.getAttribute("data-dialog"));
        if (!dlg) return;
        if (typeof dlg.showModal === "function") {
          dlg.showModal();
        } else {
          dlg.setAttribute("open", "");   // متصفّحاتٌ قديمةٌ بلا <dialog>
        }
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("dialog.modal"), function (dlg) {
      var closer = dlg.querySelector("[data-close]");
      if (closer) {
        closer.addEventListener("click", function () {
          if (typeof dlg.close === "function") dlg.close();
          else dlg.removeAttribute("open");
        });
      }
      // النقرُ على الخلفية خارج المحتوى يُغلق
      dlg.addEventListener("click", function (e) {
        if (e.target !== dlg) return;
        var r = dlg.getBoundingClientRect();
        var outside = e.clientX < r.left || e.clientX > r.right ||
                      e.clientY < r.top  || e.clientY > r.bottom;
        if (outside) dlg.close();
      });
    });
  }

  /* -------------------------------------------------- سنةُ الحقوق */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function boot() {
    initPortal();
    initNav();
    initHeader();
    initScrollSpy();
    initReveal();
    initMemberDialogs();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
