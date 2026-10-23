/* =========================================================
   KISHORI GLOBAL HOSPITAL
   Website Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  // ---------- 1. MOBILE NAVIGATION ----------

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  }

  function toggleMenu() {
    if (!menuToggle || !navMenu) return;

    const isOpen = navMenu.classList.toggle("show");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-xmark", isOpen);
    }
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", toggleMenu);

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navMenu.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) {
        closeMenu();
      }
    });
  }


  // ---------- 2. SCROLL REVEAL ANIMATIONS ----------

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

    // Fallback: prevent sections from remaining hidden.
    window.setTimeout(() => {
      revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();

        if (rect.top < window.innerHeight + 100) {
          element.classList.add("active");
        }
      });
    }, 1500);

  } else {
    // Older browser fallback.
    revealElements.forEach((element) => {
      element.classList.add("active");
    });
  }


  // ---------- 3. ACTIVE NAVIGATION LINKS ----------

  const navLinks = document.querySelectorAll(
    '#navMenu a[href^="#"]'
  );

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;

      link.classList.toggle("active", isActive);
    });
  }

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveLink(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0, 0.15, 0.3, 0.5]
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const sectionId = link.getAttribute("href").slice(1);

      if (sectionId) {
        setActiveLink(sectionId);
      }
    });
  });


  // ---------- 4. AUTOMATIC COPYRIGHT YEAR ----------

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // ---------- 5. APPOINTMENT DATE VALIDATION ----------

  const appointmentDate = document.getElementById("appointmentDate");

  function getLocalDateString() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (appointmentDate) {
    appointmentDate.min = getLocalDateString();
  }


  
  // ---------- 6. APPOINTMENT FORM ----------
  const API_BASE_URL = "http://localhost:5000/api/v1";

  async function submitFormToAPI(url, data, statusElement, button) {
    const originalText = button ? button.textContent : "";

    try {
      if (button) {
        button.disabled = true;
        button.textContent = "Submitting...";
      }

      statusElement.textContent = "Submitting your request...";
      statusElement.style.color = "";

      const response = await fetch(`${API_BASE_URL}/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit your request.");
      }

      statusElement.textContent =
        result.message || "Your request was submitted successfully. Please wait for confirmation.";
      statusElement.style.color = "green";

      return true;
    } catch (error) {
      statusElement.textContent =
        error.message || "Unable to connect to the server. Please try again.";
      statusElement.style.color = "red";
      return false;
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }

  const appointmentForm = document.getElementById("appointmentForm");
  const appointmentMessage = document.getElementById("appointmentMessage");

  if (appointmentForm && appointmentMessage) {
    appointmentForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(appointmentForm);
      const getValue = (key) =>
        (formData.get(key) || "").toString().trim();

      const patientName =
        getValue("patientName") ||
        appointmentForm.querySelector('[name="patientName"]')?.value?.trim() ||
        document.getElementById("patientName")?.value?.trim();

      const patientPhone =
        getValue("patientPhone") ||
        document.getElementById("patientPhone")?.value?.trim();

      const department =
        getValue("department") ||
        document.getElementById("department")?.value?.trim();

      const appointmentDate =
        getValue("appointmentDate") ||
        document.getElementById("appointmentDate")?.value?.trim();

      if (!patientName || !patientPhone || !department || !appointmentDate) {
        appointmentMessage.textContent =
          "Please fill in your name, phone, department, and appointment date.";
        appointmentMessage.style.color = "red";
        return;
      }

      const button = appointmentForm.querySelector('[type="submit"]');

      await submitFormToAPI(
        "appointments",
        { patientName, patientPhone, department, appointmentDate },
        appointmentMessage,
        button
      );

      if (appointmentMessage.style.color === "green") {
        appointmentForm.reset();
      }
    });
  }

  // ---------- 7. CONTACT FORM ----------
  const contactForm = document.getElementById("contactForm");
  const contactMessageStatus = document.getElementById("contactMessageStatus");

  if (contactForm && contactMessageStatus) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const getValue = (key) =>
        (formData.get(key) || "").toString().trim();

      const contactName =
        getValue("contactName") ||
        document.getElementById("contactName")?.value?.trim();

      const contactPhone =
        getValue("contactPhone") ||
        document.getElementById("contactPhone")?.value?.trim();

      const enquiryCategory =
        getValue("enquiryCategory") ||
        document.getElementById("enquiryCategory")?.value?.trim();

      const contactMessage =
        getValue("contactMessage") ||
        document.getElementById("contactMessage")?.value?.trim();

      if (!contactName || !contactPhone || !enquiryCategory || !contactMessage) {
        contactMessageStatus.textContent =
          "Please fill in all required contact fields.";
        contactMessageStatus.style.color = "red";
        return;
      }

      const button = contactForm.querySelector('[type="submit"]');

      const success = await submitFormToAPI(
        "contacts",
        { contactName, contactPhone, enquiryCategory, contactMessage },
        contactMessageStatus,
        button
      );

      if (success) {
        contactForm.reset();
      }
    });
  }


  // ---------- 8. FAQ ACCESSIBILITY ----------

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");

    if (summary) {
      summary.setAttribute("aria-label", summary.textContent.trim());
    }
  });


  // ---------- 9. EXTERNAL LINKS ----------

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

});