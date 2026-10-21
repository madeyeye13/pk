/* =========================================================
   PK EVENTS — shared site script
   Every feature checks that its section exists first, so the
   same file is safe on every page.
   ========================================================= */

// Preloader
$("#preloader").fadeOut(700);
$(".preloader-bg").delay(700).fadeOut(700);


/////////// NAV BAR
$(document).ready(function () {
    const wind = $(window);

    // Navbar dropdown toggle for mobile
    $('.menu-icon').on('click', function () {
        $('.nav-menu').toggleClass('open');
    });

    // Navbar scrolling background
    wind.on("scroll", function () {
        if (wind.scrollTop() > 100) {
            $(".navbar").css("background", "black");
        } else {
            $(".navbar").css("background", "transparent");
        }
    });

    // Highlight the current page (works with clean URLs like /about and with /about.html)
    function pageKey(href) {
        let p = (href || '').split('#')[0].split('?')[0].split('/').pop();
        p = p.replace(/\.html$/, '');
        return (p === '' || p === 'index') ? 'home' : p;
    }
    // (pages not in the menu, like the wedding galleries, keep the highlight set in their HTML)
    const current = pageKey(window.location.pathname);
    const $links = $('.nav-link').filter(function () {
        const href = $(this).attr('href') || '';
        return !href.includes('#') && pageKey(href) === current;
    });
    if ($links.length) {
        $('.nav-link').removeClass('active');
        $links.addClass('active');
    }
});


/////////////// HERO SLIDER (home page)
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    if (slides.length < 2) return;
    let currentSlide = 0;

    function animateContent(slide) {
        const content = slide.querySelector('.content');
        if (!content) return;
        content.style.opacity = '1';
        const heading = content.querySelector('.hero-heading');
        const p = content.querySelector('.hero-paragraph');
        const button = content.querySelector('.cta-button');
        [heading, p, button].forEach(el => el && el.classList.remove('fade-up', 'fade-in', 'zoom-in'));
        if (heading) heading.classList.add('fade-up');
        if (p) setTimeout(() => p.classList.add('fade-in'), 200);
        if (button) setTimeout(() => button.classList.add('zoom-in'), 400);
    }

    function showSlide(index) {
        const previousSlide = slides[currentSlide];
        const nextSlide = slides[index];

        nextSlide.style.opacity = '';
        nextSlide.classList.add('active', 'sliding-down');
        previousSlide.classList.add('previous');

        setTimeout(() => {
            nextSlide.style.opacity = '1';
            previousSlide.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            previousSlide.classList.remove('active', 'previous');
            nextSlide.classList.remove('sliding-down');
            animateContent(nextSlide);
        }, 750);

        currentSlide = index;
    }

    setInterval(() => showSlide((currentSlide + 1) % slides.length), 7000);
});


/////////////// NUMBER COUNTERS (home page)
document.addEventListener('DOMContentLoaded', function () {
    const section = document.getElementById('satis');
    const clientCount = document.getElementById('client-count');
    const satisfactionCount = document.getElementById('satisfaction-count');
    const satisfy = document.getElementById('satisfaction-coun');
    if (!section || !clientCount || !satisfactionCount || !satisfy) return;

    let hasAnimated = false;

    function animateCount(element, target, suffix) {
        let count = 0;
        const increment = target / (2000 / 60);
        function updateCount() {
            count = Math.min(count + increment, target);
            element.textContent = Math.floor(count) + suffix;
            if (count < target) requestAnimationFrame(updateCount);
        }
        requestAnimationFrame(updateCount);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCount(clientCount, 9, '+');
                animateCount(satisfactionCount, 100, '+');
                animateCount(satisfy, 100, '%');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(section);
});


//////////////// PHOTO GALLERY ARROWS (home page)
(function () {
    const photoContainer = document.querySelector('.photo2');
    const rightArrow = document.getElementById('right-arrow');
    const leftArrow = document.getElementById('left-arrow');
    if (!photoContainer || !rightArrow || !leftArrow) return;

    function step() {
        const img = photoContainer.querySelector('img');
        return (img ? img.clientWidth : 300) + 10;
    }
    rightArrow.addEventListener('click', () => photoContainer.scrollBy({ left: step(), behavior: 'smooth' }));
    leftArrow.addEventListener('click', () => photoContainer.scrollBy({ left: -step(), behavior: 'smooth' }));
})();


///////////////// SERVICES CAROUSEL (home page)
$(document).ready(function () {
    const $carousel = $(".owl-carousel");
    if (!$carousel.length || !$.fn.owlCarousel) return;

    const owl = $carousel.owlCarousel({
        items: 1,
        loop: true,
        dots: false,
        nav: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        margin: 10,
        responsive: {
            728: { items: 2, margin: 18 },
            1024: { items: 3, margin: 10 }
        }
    });

    $('.custom-dot').click(function () {
        owl.trigger('to.owl.carousel', [$(this).data('index'), 300]);
    });

    owl.on('changed.owl.carousel', function (event) {
        let currentIndex = event.item.index - event.relatedTarget._clones.length / 2;
        currentIndex = ((currentIndex % event.item.count) + event.item.count) % event.item.count;
        $('.custom-dot').removeClass('active').eq(currentIndex).addClass('active');
    });
});


/////////////////// TESTIMONIALS (home page)
(function () {
    const section = document.querySelector('.testimonial-section');
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    if (!section || !testimonials.length) return;

    let currentTestimonial = 0;
    let startX = 0;
    let isSwiping = false;
    let autoSlideInterval;

    function showTestimonial(index) {
        testimonials.forEach((testimonial) => {
            testimonial.style.transform = `translateX(-${index * 100}%)`;
        });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 7000);
    }
    function stopAutoSlide() { clearInterval(autoSlideInterval); }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentTestimonial = i;
            showTestimonial(currentTestimonial);
        });
    });

    section.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    }, { passive: true });

    section.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const diff = startX - e.touches[0].clientX;
        if (Math.abs(diff) > 50) {
            currentTestimonial = diff > 0
                ? (currentTestimonial + 1) % testimonials.length
                : (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonial);
            isSwiping = false;
        }
    }, { passive: true });

    section.addEventListener('touchend', () => { isSwiping = false; });
    section.addEventListener('mouseenter', stopAutoSlide);
    section.addEventListener('mouseleave', startAutoSlide);

    showTestimonial(currentTestimonial);
    startAutoSlide();
})();


///////////////////// FOOTER SUBSCRIBE (every page)
(function () {
    const form = document.getElementById('subscribeForm');
    if (!form) return;
    const emailInput = document.getElementById('subscribeEmail');
    const message = document.getElementById('subscribeSuccess');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('email', emailInput.value);

        fetch('https://formspree.io/f/mgvevvkz', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (!response.ok) throw new Error('Subscribe failed');
                message.textContent = 'Thanks For Subscribing!';
                message.style.display = 'block';
                setTimeout(() => { message.style.display = 'none'; }, 5000);
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                message.textContent = 'Something went wrong. Please try again.';
                message.style.display = 'block';
            });
    });
})();
