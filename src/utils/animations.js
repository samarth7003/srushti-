export const animateFlyToCart = (clickEvent, imageSrc) => {
  if (!clickEvent || !imageSrc) return;

  // 1. Get starting coordinates from the click clickEvent
  const startX = clickEvent.clientX;
  const startY = clickEvent.clientY;

  // 2. Get active target elements (desktop or mobile bottom bar cart)
  let target = document.getElementById("desktop-cart-icon");
  // If desktop link is hidden, fall back to mobile bottom bar cart item
  if (!target || target.getBoundingClientRect().width === 0) {
    target = document.getElementById("mobile-cart-icon");
  }

  if (!target) return;

  const targetRect = target.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  // 3. Create a flying thumbnail clone
  const flyer = document.createElement("div");
  flyer.style.position = "fixed";
  flyer.style.left = `${startX - 20}px`;
  flyer.style.top = `${startY - 20}px`;
  flyer.style.width = "40px";
  flyer.style.height = "40px";
  flyer.style.borderRadius = "50%";
  flyer.style.backgroundImage = `url(${imageSrc})`;
  flyer.style.backgroundSize = "cover";
  flyer.style.backgroundPosition = "center";
  flyer.style.border = "1.5px solid #b08d45"; // brand gold outline
  flyer.style.boxShadow = "0 8px 24px rgba(176, 141, 69, 0.35)";
  flyer.style.zIndex = "99999";
  flyer.style.pointerEvents = "none";
  flyer.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
  
  document.body.appendChild(flyer);

  // 4. Fly and shrink in next frame
  requestAnimationFrame(() => {
    flyer.style.left = `${targetX - 8}px`;
    flyer.style.top = `${targetY - 8}px`;
    flyer.style.width = "10px";
    flyer.style.height = "10px";
    flyer.style.opacity = "0.15";
    flyer.style.transform = "scale(0.2)";
  });

  // 5. Cleanup flyer and trigger impact animation on cart badge
  setTimeout(() => {
    flyer.remove();
    const badge = target.querySelector("span");
    if (badge) {
      badge.classList.remove("animate-heart-pop");
      void badge.offsetWidth; // force element reflow
      badge.classList.add("animate-heart-pop");
    }
  }, 800);
};
