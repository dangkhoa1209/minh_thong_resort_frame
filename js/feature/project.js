window.__cardsEffectCleanup = window.__cardsEffectCleanup || null;

function initCardsEffect() {
  if (typeof window.__cardsEffectCleanup === "function") {
    window.__cardsEffectCleanup();
  }

  const cardsEffect = window.cardsEffect || {};
  const projectsContainer = document.querySelector(".projects");
  const projects = Array.from(document.querySelectorAll(".project"));

  if (!projectsContainer || projects.length === 0 || !cardsEffect.ScrollObserver) {
    return;
  }

  projectsContainer.style.setProperty("--projects-count", projects.length);
  projectsContainer.style.setProperty("--project-height", `${projects[0].clientHeight}px`);

  projects.forEach((project, index) => {
    const offsetTop = 0;
    project.style.paddingTop = `${offsetTop}px`;

    if (index === projects.length - 1) {
      return;
    }

    const nextproject = projects[index + 1];
    const projectInner = project.querySelector(".project__inner");
    if (!projectInner) return;

    cardsEffect.ScrollObserver.Element(nextproject, {
      offsetTop,
      offsetBottom: window.innerHeight - project.clientHeight,
    }).onScroll(({ percentageY }) => {
      projectInner.style.scale = cardsEffect.valueAtPercentage({
        from: 1,
        to: 0.9,
        percentage: percentageY,
      });

      projectInner.style.filter = `brightness(${cardsEffect.valueAtPercentage({
        from: 1,
        to: 0.6,
        percentage: percentageY,
      })})`;
    });
  });

  const updateScaleOnScroll = () => {
    const windowHeight = window.innerHeight;
    projects.forEach((project) => {
      const rect = project.getBoundingClientRect();
      const projectMid = rect.top + rect.height / 2;
      const screenMid = windowHeight / 2;
      const ratio = Math.min(Math.abs(projectMid - screenMid) / (windowHeight / 2), 1);
      const img = project.querySelector("img");
      if (!img) return;
      img.style.transform = projectMid > screenMid ? `scale(${1 + ratio * 0.2})` : "scale(1)";
    });
  };

  window.addEventListener("scroll", updateScaleOnScroll);
  window.addEventListener("resize", updateScaleOnScroll);
  window.addEventListener("load", updateScaleOnScroll);
  updateScaleOnScroll();

  const introduceSection = document.querySelector("#introduce");
  const clickHandlers = [];

  projects.forEach((item) => {
    const popup = item.querySelector(".project__inner");
    if (!popup) return;

    let pageTo = popup.dataset.pageTo;
    if (!pageTo) return;

    const basePath = getBasePath();
    if (basePath && pageTo.startsWith("/")) {
      pageTo = basePath + pageTo;
    }

    const handler = (event) => {
      event.stopPropagation();

      const currentIndex = parseInt(item.dataset.index, 10);
      let introduceInView = false;
      let introduceTop = 0;
      if (introduceSection) {
        const rectIntro = introduceSection.getBoundingClientRect();
        introduceInView = rectIntro.top < window.innerHeight && rectIntro.bottom > 0;
        introduceTop = rectIntro.top;
      }

      projects.forEach((other) => {
        const otherIndex = parseInt(other.dataset.index, 10);
        if (otherIndex <= currentIndex) return;

        if (introduceInView) {
          const projectRect = other.getBoundingClientRect();
          const moveDistance = introduceTop - 20 - projectRect.bottom;
          other.style.transform = `translateY(${moveDistance}px)`;
        } else {
          other.style.transform = "translateY(150vh)";
        }
        other.style.opacity = "0";
        other.style.transition = "all 0.8s ease-in-out";
        other.style.pointerEvents = "none";
      });

      const rect = item.getBoundingClientRect();
      document.body.style.overflow = "hidden";
      popup.classList.remove("expand-active");
      popup.style.transition = "none";
      popup.style.top = `${rect.top}px`;
      popup.style.left = `${rect.left}px`;
      popup.style.width = `${rect.width}px`;
      popup.style.height = `${rect.height}px`;
      popup.style.transform = "translateX(0)";
      popup.style.zIndex = 9999;

      const img = popup.querySelector("img");
      if (img) {
        img.style.transition = "none";
        img.style.transform = window.getComputedStyle(img).transform;
      }
      void popup.offsetWidth;

      requestAnimationFrame(() => {
        popup.style.transition = "all 0.8s ease-in-out";
        popup.classList.add("expand-active");
        if (img) {
          img.style.transition = "transform 0.5s ease";
          img.style.transform = "scale(1)";
        }
        popup.style.scale = "1";
        popup.style.filter = "brightness(1)";

        const navigateWithBarba = typeof window.barbaGo === "function";
        if (navigateWithBarba) {
          window.barbaGo(pageTo, 900);
          return;
        }

        setTimeout(() => {
          window.location.href = pageTo;
        }, 900);
      });
    };

    item.addEventListener("click", handler);
    clickHandlers.push({ node: item, handler });
  });

  window.__cardsEffectCleanup = () => {
    window.removeEventListener("scroll", updateScaleOnScroll);
    window.removeEventListener("resize", updateScaleOnScroll);
    window.removeEventListener("load", updateScaleOnScroll);
    clickHandlers.forEach(({ node, handler }) => node.removeEventListener("click", handler));
  };
}

window.initCardsEffect = initCardsEffect;
initCardsEffect();
