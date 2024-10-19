// Preloader
$("#preloader").fadeOut(700);
$(".preloader-bg").delay(700).fadeOut(700);
var wind = $(window);


///////////NAV BAR

$(document).ready(function () {
    const wind = $(window);
  
    // Navbar dropdown toggle for mobile
    $('.menu-icon').on('click', function () {
        $('.nav-menu').toggleClass('open');
    });
  
    // Navbar scrolling background
    wind.on("scroll", function () {
        var bodyScroll = wind.scrollTop();
  
        if (bodyScroll > 100) {
            $(".navbar").css("background", "black");
        } else {
            $(".navbar").css("background", "transparent");
        }
    });
  
    // Highlight the current active page
    const path = window.location.pathname;
    const page = path.split("/").pop();
  
    $('.nav-link').each(function () {
        const href = $(this).attr('href');
  
        if (href === page || (page === '' && href === 'index.html')) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
  });
  


///////////////HERO SECTION


document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
  
    function showSlide(index) {
        const previousSlide = slides[currentSlide];
        const nextSlide = slides[index];
  
        // Prepare the next slide
        nextSlide.style.opacity = '';
        nextSlide.classList.add('active', 'sliding-down');
        previousSlide.classList.add('previous');
  
        // Start the transition
        setTimeout(() => {
            nextSlide.style.opacity = '1';
            previousSlide.style.opacity = '0';
        }, 50);
  
        // Clean up after transition
        setTimeout(() => {
            previousSlide.classList.remove('active', 'previous');
            nextSlide.classList.remove('sliding-down');
  
            // Trigger content animations after slide transition
            const content = nextSlide.querySelector('.content');
            content.style.opacity = '1'; // Ensure content opacity is set to 1
            
            // Resetting the content visibility for animations
            const h1 = content.querySelector('h1');
            const p = content.querySelector('p');
            const button = content.querySelector('.cta-button');
  
            // Reset classes to allow for re-animation
            h1.classList.remove('fade-up');
            p.classList.remove('fade-in');
            button.classList.remove('zoom-in');
  
            // Trigger fade-in effect
            h1.classList.add('fade-up');
            setTimeout(() => p.classList.add('fade-in'), 200);
            setTimeout(() => button.classList.add('zoom-in'), 400);
        }, 750);
  
        currentSlide = index;
    }
  
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
  
    setInterval(nextSlide, 7000); // Change slide every 7 seconds
  
    // Reset animations when slide changes
    slides.forEach(slide => {
        slide.addEventListener('transitionend', function(e) {
            if (e.propertyName === 'opacity' && !this.classList.contains('active')) {
                const content = this.querySelector('.content');
                const h1 = content.querySelector('h1');
                const p = content.querySelector('p');
                const button = content.querySelector('.cta-button');
  
                // Reset classes to allow for re-animation
                h1.classList.remove('fade-up');
                p.classList.remove('fade-in');
                button.classList.remove('zoom-in');
            }
        });
    });
  });



  // JAVASCRIPT FOR NUMBER INCREASE


document.addEventListener('DOMContentLoaded', function() {
    const clientCount = document.getElementById('client-count');
    const satisfactionCount = document.getElementById('satisfaction-count');
    const satisfy = document.getElementById('satisfaction-coun');
    const clientTarget = 2;
    const satisfactionTarget = 20;
    const satisfyTarget = 100;
    let hasAnimated = false;

    function animateCount(element, target, suffix = '') {
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 60);

        function updateCount() {
            count += increment;
            if (count > target) count = target;
            element.textContent = Math.floor(count) + suffix;
            if (count < target) {
                requestAnimationFrame(updateCount);
            }
        }

        requestAnimationFrame(updateCount);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCount(clientCount, clientTarget, '+');
                animateCount(satisfactionCount, satisfactionTarget, '+');
                animateCount(satisfy, satisfyTarget, '%');
            }
        });
    }, {
        threshold: 0.1 // Trigger when at least 10% of the section is in view
    });

    observer.observe(document.getElementById('satis'));
});



///=====================TESTIMONIAL

let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
let startX = 0;
let isSwiping = false;
let autoSlideInterval;

// Function to show the current testimonial
function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.transform = `translateX(-${index * 100}%)`;
        dots[i].classList.toggle('active', i === index);
    });
}

// Function to start the auto-slide interval
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 7000);
}

// Function to stop the auto-slide interval
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Dots navigation
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        currentTestimonial = i;
        showTestimonial(currentTestimonial);
    });
});

// Swipe detection
document.querySelector('.testimonial-section').addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
});

document.querySelector('.testimonial-section').addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    const moveX = e.touches[0].clientX;
    const diff = startX - moveX;

    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            // Swipe left
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        } else {
            // Swipe right
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        }
        showTestimonial(currentTestimonial);
        isSwiping = false; 
    }
});

document.querySelector('.testimonial-section').addEventListener('touchend', () => {
    isSwiping = false;
});

// Pause auto-slide on hover
const testimonialSection = document.querySelector('.testimonial-section');
testimonialSection.addEventListener('mouseenter', stopAutoSlide);
testimonialSection.addEventListener('mouseleave', startAutoSlide);

// Initial display
showTestimonial(currentTestimonial);
startAutoSlide();



///FORM SUBMISSION FOR FOOTER


document.getElementById('subscribeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const email = document.getElementById('email').value;
    const formData = new FormData();
    formData.append('email', email);

    // Send form data to Formspree using fetch
    fetch('https://formspree.io/f/mdkonokq', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show success message after 7 seconds
            setTimeout(() => {
                const successMessage = document.getElementById('successMessage');
                successMessage.style.display = 'block';

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }, 7000);

            // Reset the form
            document.getElementById('subscribeForm').reset();
        } else {
            alert('Oops! There was a problem submitting your form.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting the form.');
    });
});


  
