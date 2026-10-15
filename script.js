/**
 * 퇴근길 프레시 페스타 (Fresh Meal Festa) - Interactive JavaScript
 * POS 실증 데이터 & 카드뉴스 기반 프로모션 인터랙션 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initCardNewsFilterAndLightbox();
  initCalculatorAndCart();
  initDataTabs();
  initFaqAccordion();
  initCouponModal();
  initMobileMenu();
});

/* ==========================================================================
   1. Real-time Timesale Countdown Timer
   (월·화 18:00 ~ 20:00 퇴근길 프레시 타임세일)
   ========================================================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById('time-days');
  const hoursEl = document.getElementById('time-hours');
  const minsEl = document.getElementById('time-minutes');
  const secsEl = document.getElementById('time-seconds');
  const statusTitleEl = document.getElementById('countdown-status-title');
  const miniCountdownEl = document.getElementById('mini-countdown');
  const liveBannerTextEl = document.getElementById('live-banner-text');

  function updateTimer() {
    const now = new Date();
    const currentDay = now.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    // Check if right now is during the active sale window (Monday or Tuesday, 18:00 - 20:00)
    const isMondayOrTuesday = (currentDay === 1 || currentDay === 2);
    const isSaleActive = isMondayOrTuesday && (currentHour >= 18 && currentHour < 20);

    let targetDate = new Date(now);

    if (isSaleActive) {
      // Target is today 20:00 (Sale Ending)
      targetDate.setHours(20, 0, 0, 0);
      statusTitleEl.innerHTML = '<span style="color:#34D399;">🔥 지금은 타임세일 진행 중!</span> 종료까지';
      if (liveBannerTextEl) {
        liveBannerTextEl.innerHTML = '<strong class="highlight">🔥 [LIVE 진행 중]</strong> 리버점 퇴근길 타임세일 5~10% 즉시 할인 중!';
      }
    } else {
      // Find the next Monday or Tuesday at 18:00
      let daysUntilNext = 0;
      if (currentDay === 1 && currentHour < 18) {
        daysUntilNext = 0; // Today Monday 18:00
      } else if (currentDay === 1 && currentHour >= 20) {
        daysUntilNext = 1; // Tomorrow Tuesday 18:00
      } else if (currentDay === 2 && currentHour < 18) {
        daysUntilNext = 0; // Today Tuesday 18:00
      } else {
        // Next Monday
        daysUntilNext = (1 + 7 - currentDay) % 7;
        if (daysUntilNext === 0) daysUntilNext = 7;
      }

      targetDate.setDate(now.getDate() + daysUntilNext);
      targetDate.setHours(18, 0, 0, 0);
      statusTitleEl.textContent = '리버점 퇴근길 타임세일 시작까지';
    }

    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      // Small re-trigger
      setTimeout(updateTimer, 1000);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(mins);
    if (secsEl) secsEl.textContent = pad(secs);

    if (miniCountdownEl) {
      if (isSaleActive) {
        miniCountdownEl.textContent = `타임세일 진행 중 (종료까지 ${pad(hours)}:${pad(mins)}:${pad(secs)})`;
      } else {
        miniCountdownEl.textContent = `다음 세일까지 D-${days} ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
      }
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   2. Card News Filter & Lightbox Viewer
   ========================================================================== */
function initCardNewsFilterAndLightbox() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.cardnews-card');

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const backdrop = document.getElementById('lightbox-backdrop');
  const zoomableImages = document.querySelectorAll('.zoomable-image');
  const heroZoomBtn = document.getElementById('hero-zoom-btn');

  function openLightbox(src, caption) {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  zoomableImages.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = img.getAttribute('data-lightbox') || img.src;
      const caption = img.getAttribute('data-caption') || img.alt;
      openLightbox(src, caption);
    });
  });

  if (heroZoomBtn) {
    heroZoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const heroPoster = document.getElementById('hero-poster-image');
      if (heroPoster) {
        openLightbox(heroPoster.getAttribute('data-lightbox'), heroPoster.getAttribute('data-caption'));
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   3. Interactive Cart & Discount Calculator
   ========================================================================== */
function initCalculatorAndCart() {
  const storePills = document.querySelectorAll('.radio-pill');
  const beverageCheckbox = document.getElementById('add-beverage-checkbox');
  const cartContainer = document.getElementById('cart-items-container');
  const summaryOriginalPrice = document.getElementById('summary-original-price');
  const summaryDiscountLabel = document.getElementById('summary-discount-label');
  const summaryDiscountAmount = document.getElementById('summary-discount-amount');
  const summaryBeverageRow = document.getElementById('summary-beverage-row');
  const summaryFinalPrice = document.getElementById('summary-final-price');
  const summarySavedAmount = document.getElementById('summary-saved-amount');
  const receiptStoreDisplay = document.getElementById('receipt-store-display');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const quickButtons = document.querySelectorAll('.quick-btn');
  const menuAddButtons = document.querySelectorAll('.add-to-cart-btn');
  const receiptCouponTriggerBtn = document.getElementById('receipt-coupon-trigger-btn');

  // Cart State: Array of { code, name, price, salePrice, qty }
  let cart = [
    { code: 'RM-105', name: '새우 로제파스타', price: 7200, salePrice: 6480, qty: 1 },
    { code: 'RM-106', name: '닭가슴살 곤약비빔밥', price: 5200, salePrice: 4680, qty: 1 }
  ];

  let selectedStore = 'river'; // 'river' or 'central'

  // Store pill listeners
  storePills.forEach(pill => {
    pill.addEventListener('click', () => {
      storePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const radio = pill.querySelector('input[type="radio"]');
      radio.checked = true;
      selectedStore = radio.value;
      renderReceipt();
    });
  });

  // Beverage Checkbox
  if (beverageCheckbox) {
    beverageCheckbox.addEventListener('change', () => {
      renderReceipt();
    });
  }

  // Quick Add Buttons
  quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10);
      const sale = parseInt(btn.getAttribute('data-sale'), 10);
      addToCart(code, name, price, sale);
    });
  });

  // Menu Section Add Buttons
  menuAddButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10);
      const sale = parseInt(btn.getAttribute('data-sale'), 10);
      addToCart(code, name, price, sale);

      // Smooth scroll to calculator
      const calcSection = document.getElementById('calculator');
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Visual feedback
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> 담기 완료!';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 1200);
    });
  });

  function addToCart(code, name, price, salePrice) {
    const existing = cart.find(item => item.code === code);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ code, name, price, salePrice, qty: 1 });
    }
    renderReceipt();
  }

  function removeFromCart(code) {
    const idx = cart.findIndex(item => item.code === code);
    if (idx !== -1) {
      if (cart[idx].qty > 1) {
        cart[idx].qty -= 1;
      } else {
        cart.splice(idx, 1);
      }
    }
    renderReceipt();
  }

  function addQty(code) {
    const item = cart.find(i => i.code === code);
    if (item) {
      item.qty += 1;
      renderReceipt();
    }
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      cart = [];
      renderReceipt();
    });
  }

  // Render receipt items and calculate totals
  function renderReceipt() {
    if (!cartContainer) return;

    if (cart.length === 0) {
      cartContainer.innerHTML = '<div class="receipt-empty-msg">담긴 상품이 없습니다.<br>원하시는 메뉴를 담아보세요!</div>';
      summaryOriginalPrice.textContent = '0원';
      summaryDiscountAmount.textContent = '-0원';
      summaryFinalPrice.textContent = '0원';
      summarySavedAmount.textContent = '0원';
      if (summaryBeverageRow) summaryBeverageRow.style.display = 'none';
      return;
    }

    cartContainer.innerHTML = '';
    let totalOriginal = 0;
    let totalCount = 0;

    cart.forEach(item => {
      totalOriginal += item.price * item.qty;
      totalCount += item.qty;

      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item-row';
      itemRow.innerHTML = `
        <span class="cart-item-name">${item.name}</span>
        <div class="cart-item-controls">
          <button class="btn-qty btn-minus" data-code="${item.code}">-</button>
          <span>${item.qty}</span>
          <button class="btn-qty btn-plus" data-code="${item.code}">+</button>
          <span class="cart-item-price">${(item.price * item.qty).toLocaleString()}원</span>
        </div>
      `;
      cartContainer.appendChild(itemRow);
    });

    // Event listeners for plus/minus
    cartContainer.querySelectorAll('.btn-minus').forEach(b => {
      b.addEventListener('click', () => removeFromCart(b.getAttribute('data-code')));
    });
    cartContainer.querySelectorAll('.btn-plus').forEach(b => {
      b.addEventListener('click', () => addQty(b.getAttribute('data-code')));
    });

    // Discount Calculation Logic based on Store
    let discount = 0;
    let beverageCost = 0;
    const hasBeverage = beverageCheckbox && beverageCheckbox.checked;

    if (hasBeverage) {
      beverageCost = 1000; // 50% discount flat combo price
      if (summaryBeverageRow) summaryBeverageRow.style.display = 'flex';
    } else {
      if (summaryBeverageRow) summaryBeverageRow.style.display = 'none';
    }

    if (selectedStore === 'river') {
      // River store: 10% instant discount on each item
      receiptStoreDisplay.textContent = '이마트 리버점 (단품 즉시할인 10% + 18~20시 세일)';
      summaryDiscountLabel.textContent = '단품 10% 즉시 할인';
      discount = Math.round(totalOriginal * 0.10);
    } else {
      // Central / Park store: 3 or more items bundle 15% discount
      receiptStoreDisplay.textContent = '이마트 센트럴·파크점 (3개 골라 담기 15% 할인)';
      if (totalCount >= 3) {
        summaryDiscountLabel.textContent = `3개 이상 묶음 할인 (15% 적용, ${totalCount}개)`;
        discount = Math.round(totalOriginal * 0.15);
      } else {
        summaryDiscountLabel.textContent = `묶음 할인 미충족 (${totalCount}/3개 담김, 3개 채우면 15% OFF)`;
        discount = 0;
      }
    }

    const beverageSaving = hasBeverage ? 1000 : 0; // beverage original price 2,000 -> 1,000 saves 1,000
    const totalSaving = discount + beverageSaving;
    const finalPrice = totalOriginal - discount + beverageCost;

    summaryOriginalPrice.textContent = totalOriginal.toLocaleString() + '원';
    summaryDiscountAmount.textContent = '-' + discount.toLocaleString() + '원';
    summaryFinalPrice.textContent = finalPrice.toLocaleString() + '원';
    summarySavedAmount.textContent = totalSaving.toLocaleString() + '원';
  }

  renderReceipt();

  // Trigger Coupon Modal from Receipt
  if (receiptCouponTriggerBtn) {
    receiptCouponTriggerBtn.addEventListener('click', () => {
      const couponModal = document.getElementById('coupon-modal');
      const storeSelect = document.getElementById('user-store-select');
      if (storeSelect) {
        storeSelect.value = selectedStore === 'river' ? 'river' : 'central';
      }
      if (couponModal) couponModal.classList.add('open');
    });
  }
}

/* ==========================================================================
   4. Master Plan In-depth Data Tabs
   ========================================================================== */
function initDataTabs() {
  const tabBtns = document.querySelectorAll('.data-tab-btn');
  const tabPanels = document.querySelectorAll('.data-tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. FAQ Accordion Interaction
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   6. Mobile Coupon Modal & Simulated Barcode Generation
   ========================================================================== */
function initCouponModal() {
  const couponModal = document.getElementById('coupon-modal');
  const openBtns = [
    document.getElementById('open-coupon-modal-btn'),
    document.getElementById('hero-cta-coupon-btn')
  ];
  const closeBtn = document.getElementById('coupon-close-btn');
  const backdrop = document.getElementById('coupon-backdrop');
  const couponForm = document.getElementById('coupon-claim-form');
  const couponResult = document.getElementById('coupon-result-container');
  const ticketTitleText = document.getElementById('ticket-title-text');
  const barcodeNum = document.getElementById('ticket-barcode-number');
  const saveImgBtn = document.getElementById('save-coupon-image-btn');

  function openModal() {
    if (!couponModal) return;
    couponModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!couponModal) return;
    couponModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (couponForm) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = document.getElementById('user-phone').value;
      const storeSelect = document.getElementById('user-store-select').value;

      // Update Ticket Content
      if (storeSelect === 'river') {
        ticketTitleText.textContent = '[리버점 한정] 퇴근길 간편식 10% 즉시할인 + 타임특가';
      } else {
        ticketTitleText.textContent = '[센트럴·파크점] 간편식 3개 골라 담기 15% 할인권';
      }

      // Generate random valid barcode
      const randomBarcode = '880' + Math.floor(1000000000 + Math.random() * 9000000000);
      if (barcodeNum) barcodeNum.textContent = randomBarcode;

      // Show Result Card
      couponForm.style.display = 'none';
      if (couponResult) {
        couponResult.style.display = 'block';
        couponResult.style.animation = 'fadeIn 0.5s ease';
      }
    });
  }

  if (saveImgBtn) {
    saveImgBtn.addEventListener('click', () => {
      alert('쿠폰 이미지가 갤러리에 저장되었습니다! (모의 발급)\n매장 계산대에서 바코드를 제시해주세요.');
    });
  }
}

/* ==========================================================================
   7. Mobile Navigation Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-navigation');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (mainNav.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}
