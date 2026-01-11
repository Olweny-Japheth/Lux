// Lux Massage — script.js
document.addEventListener('DOMContentLoaded', function(){

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var mainMenu = document.getElementById('mainMenu');
  if(navToggle && mainMenu){
    navToggle.addEventListener('click', function(e){
      e.preventDefault();
      mainMenu.classList.toggle('open');
    });
    // close menu when a link is clicked
    mainMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mainMenu.classList.remove('open');
      });
    });
    // close menu with Escape key
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && mainMenu.classList.contains('open')){
        mainMenu.classList.remove('open');
      }
    });
  }

  // Hero slider
  (function(){
    var slidesWrap = document.querySelector('.slides');
    if(!slidesWrap) return;
    var slides = document.querySelectorAll('.slide');
    var total = slides.length;
    var index = 0;
    var interval = 5000;
    var timer = null;

    function go(n){
      index = (n + total) % total;
      slidesWrap.style.transform = 'translateX(' + (-index * 100) + '%)';
    }
    function next(){go(index+1)}
    function prev(){go(index-1)}

    // buttons
    var btnNext = document.querySelector('.slider-btn.next');
    var btnPrev = document.querySelector('.slider-btn.prev');
    if(btnNext) btnNext.addEventListener('click', function(e){ e.preventDefault(); stop(); next(); start(); });
    if(btnPrev) btnPrev.addEventListener('click', function(e){ e.preventDefault(); stop(); prev(); start(); });

    function start(){ stop(); timer = setInterval(next, interval); }
    function stop(){ if(timer) { clearInterval(timer); timer = null; } }

    // pause on hover
    var hero = document.querySelector('.hero-slider');
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    // init
    go(0); start();
  })();

  // Popup advert: show after delay or on exit intent
  (function(){
    var popup = document.getElementById('popup');
    if(!popup) return;
    var closeBtn = popup.querySelector('.popup-close');
    var shownKey = 'lux_popup_shown_v1';
    function showPopup(){
      if(localStorage.getItem(shownKey)) return;
      popup.classList.add('active');
      popup.setAttribute('aria-hidden','false');
      localStorage.setItem(shownKey,'1');
    }
    function hidePopup(){
      popup.classList.remove('active');
      popup.setAttribute('aria-hidden','true');
    }
    closeBtn.addEventListener('click', hidePopup);

    // show after 7s
    setTimeout(showPopup, 7000);

    // exit-intent (desktop)
    function onMouse(e){
      if(e.clientY < 40){ showPopup(); window.removeEventListener('mousemove', onMouse); }
    }
    window.addEventListener('mousemove', onMouse);
  })();

  // Smart slipping gallery: auto-scroll
  (function(){
    var strip = document.querySelector('.gallery-strip');
    if(!strip) return;
    var speed = 0.6; // px per frame
    var direction = 1;
    var rafId = null;

    function step(){
      strip.scrollLeft += speed * direction;
      // reverse when near edges
      if(strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1) direction = -1;
      if(strip.scrollLeft <= 0) direction = 1;
      rafId = requestAnimationFrame(step);
    }
    // pause on hover
    strip.addEventListener('mouseenter', function(){ if(rafId) cancelAnimationFrame(rafId); rafId = null; });
    strip.addEventListener('mouseleave', function(){ if(!rafId) rafId = requestAnimationFrame(step); });

    rafId = requestAnimationFrame(step);
  })();

  // Minimal accessibility: close popup on ESC
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      var popup = document.getElementById('popup');
      if(popup && popup.classList.contains('active')){
        popup.classList.remove('active');
        popup.setAttribute('aria-hidden','true');
      }
      // close adverts overlay if open
      var adverts = document.getElementById('adverts');
      if(adverts && adverts.classList.contains('active')){
        adverts.classList.remove('active');
        adverts.setAttribute('aria-hidden','true');
      }
    }
  });

  // Rotating adverts (10s interval)
  (function(){
    var adverts = document.getElementById('adverts');
    if(!adverts) return;
    var cards = adverts.querySelectorAll('.advert-card');
    var current = -1;
    var interval = 10000; // 10s

    function showIndex(i){
      // hide all
      cards.forEach(function(c){ c.style.display = 'none'; });
      if(i < 0 || i >= cards.length) return;
      cards[i].style.display = 'flex';
      adverts.classList.add('active');
    }
    function hideAll(){
      cards.forEach(function(c){ c.style.display = 'none'; });
      adverts.classList.remove('active');
    }
    // close buttons
    cards.forEach(function(card){
      var close = card.querySelector('.advert-close');
      if(close) close.addEventListener('click', function(){ hideAll(); });
    });

    function next(){
      current = (current + 1) % cards.length;
      showIndex(current);
    }
    // start rotating
    var rot = setInterval(next, interval);
    // show first after small delay
    setTimeout(next, 1200);
    // pause rotation when user hovers advert
    adverts.addEventListener('mouseenter', function(){ if(rot) clearInterval(rot); rot = null; });
    adverts.addEventListener('mouseleave', function(){ if(!rot) rot = setInterval(next, interval); });
  })();

  // Cookie bar handling
  (function(){
    var cookieBar = document.getElementById('cookieBar');
    if(!cookieBar) return;
    var accepted = localStorage.getItem('cookies_accepted_v1');
    var acceptBtn = document.getElementById('acceptCookies');
    if(accepted){ cookieBar.style.display = 'none'; return; }
    // show cookie bar
    cookieBar.style.display = 'flex';
    // auto-hide after 3 seconds
    var autoHideTimer = setTimeout(function(){
      cookieBar.style.display = 'none';
    }, 3000);
    // accept button
    acceptBtn.addEventListener('click', function(e){ 
      e.preventDefault(); 
      clearTimeout(autoHideTimer);
      localStorage.setItem('cookies_accepted_v1','1'); 
      cookieBar.style.display='none'; 
    });
  })();

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Testimonial Slider
  const slider = document.querySelector('.testimonial-slider');
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  if (slider && testimonials.length > 0) {
    let currentIndex = 0;

    function showTestimonial(index) {
      testimonials.forEach((testimonial, i) => {
        testimonial.style.opacity = i === index ? '1' : '0';
      });
    }

    function nextTestimonial() {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    }

    function prevTestimonial() {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentIndex);
    }

    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);

    showTestimonial(currentIndex);
  }

  // Countdown Timer (Urgency)
  (function(){
    var timerEl = document.getElementById('countdown-timer');
    if(!timerEl) return;

    // Set deadline to midnight tonight
    var deadline = new Date();
    deadline.setHours(24, 0, 0, 0);

    function update(){
      var now = new Date();
      var t = deadline - now;
      if(t < 0) { t = 0; } // Stop at 0
      
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      var minutes = Math.floor((t / 1000 / 60) % 60);
      var seconds = Math.floor((t / 1000) % 60);
      
      timerEl.innerHTML = 
        (hours < 10 ? '0' + hours : hours) + ':' + 
        (minutes < 10 ? '0' + minutes : minutes) + ':' + 
        (seconds < 10 ? '0' + seconds : seconds);
    }
    setInterval(update, 1000);
    update();
  })();

});
