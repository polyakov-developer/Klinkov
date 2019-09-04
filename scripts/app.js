const BURGER = document.getElementById("burger");
const MENU = document.getElementById("mobile-menu");
const TO_TOP = document.getElementById("to-top");
const HEADER = document.getElementById("header");

TO_TOP.addEventListener("click", function () {
  document.body.scrollIntoView({
    behavior: 'smooth'
  });
});

const openModal = function (e) {
  $(e.target.dataset.target).modal();
}

const toggleMenu = function (e) {
  if (BURGER.classList.contains("active")) {
    BURGER.classList.remove("active");
    MENU.classList.remove("active");
    scrollLock.enablePageScroll();
  } else {
    BURGER.classList.add("active");
    MENU.classList.add("active");
    scrollLock.disablePageScroll();
    scrollLock.addScrollableSelector(".mobile-menu-wrapper");
  }
}

const changeTab = function (e) {
  let tabItem = e.target,
    tabContent = document.getElementById(tabItem.dataset.target);

  if (tabItem.classList.contains("active")) {
    return false;
  } else {
    $(".tab-link").removeClass("active");
    $(".tab-pane").removeClass("active");
    tabItem.classList.add("active");
    tabContent.classList.add("active");
  }
}

const setEvents = function () {
  let formFields = document.querySelectorAll("form .field input, form .field textarea"),
    calculator = document.getElementById("calculator"),
    arrCalcFields = null;

  if (calculator !== null) {
    arrCalcFields = calculator.querySelectorAll("input");
  }

  formFields = [].map.call(formFields, function (obj) {
    obj.addEventListener("focus", formFieldFocusIn);
    obj.addEventListener("blur", formFieldFocusOut);
  });

  if (arrCalcFields !== null) {
    arrCalcFields = [].map.call(arrCalcFields, function (obj) {
      obj.addEventListener("change", calculate);
    });
  }
}();

const checkHeader = function () {
  let scrollPosition = Math.round(window.scrollY);

  if (scrollPosition > 600) {
    HEADER.classList.add("sticky");
  } else {
    HEADER.classList.remove("sticky");
  }
}

const smoothScroll = function () {
  const delay = function () {
    if (document.documentElement.classList.contains("mobile")) {
      return 500;
    } else {
      return 1;
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      let anchor = this;

      BURGER.classList.remove("active");
      MENU.classList.remove("active");

      scrollLock.enablePageScroll();

      setTimeout(function () {
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      }, delay());
    });
  });
}();

window.onscroll = function () {
  checkHeader();

  if (this.pageYOffset >= 1000) {
    TO_TOP.style.display = "block";
  } else {
    TO_TOP.style.display = "none";
  }
};

$('.gallery-slider').lightGallery({
  thumbnail: false,
  selector: ".open-photo",
  controls: false,
  counter: false,
  enableDrag: false,
  enableSwipe: false
});

$(document).ready(function () {
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 100,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: true
  });
});

const swiperPortfolio = new Swiper('#portfolio .swiper-container', {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: {
    el: '.swiper-pagination-portfolio',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

const swiperStagesOfWork = new Swiper("#stages-of-work .swiper-container", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: {
    el: '.swiper-pagination-stages-of-work',
    clickable: true,
  },
});

const initializeSwiper = (id) => {
  new Swiper(`#${id} .swiper-container`, {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: `#${id} .swiper-pagination`,
      clickable: true,
    },
    navigation: {
      nextEl: `#${id} .swiper-button-next`,
      prevEl: `#${id} .swiper-button-prev`,
    },
  });
}

let defaultSwipers = Array.from(document.querySelectorAll(".gallery-slider"));

defaultSwipers = defaultSwipers.map((currentValue) => {
  initializeSwiper(currentValue.id);
});