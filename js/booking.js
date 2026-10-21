/* =========================================================
   PK EVENTS — Booking pages (book-us, book-us-weddings)
   Standalone script: no jQuery needed.
   The form's endpoint is read from <form data-endpoint="...">
   ========================================================= */
(function () {
    'use strict';

    var SUBSCRIBE_ENDPOINT = 'https://formspree.io/f/mgvevvkz'; // footer newsletter
    var WHATSAPP_NUMBER = '2348066500787';                      // +234 806 650 0787

    /* ---------- Preloader ---------- */
    function hidePreloader() {
        var pre = document.getElementById('preloader');
        var bg = document.querySelector('.preloader-bg');
        [pre, bg].forEach(function (el) {
            if (!el) return;
            el.style.transition = 'opacity 0.7s ease';
            el.style.opacity = '0';
            setTimeout(function () { el.style.display = 'none'; }, 700);
        });
    }
    if (document.readyState === 'complete') hidePreloader();
    else window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 4000); // never leave the loader up on slow images

    /* ---------- Navbar ---------- */
    var navbar = document.querySelector('.navbar');
    var menuIcon = document.querySelector('.menu-icon');
    var navMenu = document.querySelector('.nav-menu');
    if (menuIcon && navMenu) {
        menuIcon.addEventListener('click', function () { navMenu.classList.toggle('open'); });
    }
    function onScroll() {
        if (navbar) navbar.style.background = window.scrollY > 100 ? 'black' : 'transparent';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Footer subscribe ---------- */
    var subForm = document.getElementById('subscribeForm');
    if (subForm) {
        subForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var emailInput = subForm.querySelector('input[type="email"]');
            var msg = document.getElementById('subscribeSuccess');
            fetch(SUBSCRIBE_ENDPOINT, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value })
            }).then(function (res) {
                if (!res.ok) throw new Error('Subscribe failed');
                msg.textContent = 'Thanks For Subscribing!';
                msg.style.display = 'block';
                setTimeout(function () { msg.style.display = 'none'; }, 5000);
                subForm.reset();
            }).catch(function () {
                msg.textContent = 'Something went wrong. Please try again.';
                msg.style.display = 'block';
            });
        });
    }

    /* =========================================================
       Custom dropdown
       Markup:
       <div class="bk-select" data-name="Budget" data-required="Budget"
            data-placeholder="Select an option">
           <span data-value="..">Label</span> ...
       </div>
       ========================================================= */
    var openSelect = null;

    function closeSelect(sel) {
        if (!sel) return;
        sel.classList.remove('open');
        sel.querySelector('.bk-select-btn').setAttribute('aria-expanded', 'false');
        if (openSelect === sel) openSelect = null;
    }

    function buildSelect(sel, idx) {
        var name = sel.getAttribute('data-name');
        var placeholder = sel.getAttribute('data-placeholder') || 'Select an option';
        var labelId = sel.getAttribute('aria-labelledby');
        var items = Array.prototype.slice.call(sel.querySelectorAll('[data-value]'));
        var listId = 'bkList' + idx;

        var hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = name;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bk-select-btn';
        btn.setAttribute('aria-haspopup', 'listbox');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', listId);
        if (labelId) btn.setAttribute('aria-labelledby', labelId);
        btn.innerHTML = '<span class="bk-select-text is-placeholder"></span><i class="ti-angle-down"></i>';
        btn.querySelector('.bk-select-text').textContent = placeholder;

        var list = document.createElement('ul');
        list.className = 'bk-select-list';
        list.id = listId;
        list.setAttribute('role', 'listbox');
        list.tabIndex = -1;

        var active = -1;
        items.forEach(function (it, i) {
            var li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', 'false');
            li.id = listId + '-' + i;
            li.setAttribute('data-value', it.getAttribute('data-value'));
            li.textContent = it.textContent;
            li.addEventListener('click', function () { choose(i); closeSelect(sel); btn.focus(); });
            li.addEventListener('mousemove', function () { setActive(i); });
            list.appendChild(li);
        });
        sel.innerHTML = '';
        sel.appendChild(hidden);
        sel.appendChild(btn);
        sel.appendChild(list);
        var options = list.querySelectorAll('li');

        function setActive(i) {
            if (active > -1) options[active].classList.remove('active');
            active = i;
            if (i > -1) {
                options[i].classList.add('active');
                list.setAttribute('aria-activedescendant', options[i].id);
                var o = options[i];
                if (o.offsetTop < list.scrollTop) list.scrollTop = o.offsetTop;
                else if (o.offsetTop + o.offsetHeight > list.scrollTop + list.clientHeight)
                    list.scrollTop = o.offsetTop + o.offsetHeight - list.clientHeight;
            }
        }
        function choose(i) {
            options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
            options[i].setAttribute('aria-selected', 'true');
            hidden.value = options[i].getAttribute('data-value');
            var txt = btn.querySelector('.bk-select-text');
            txt.textContent = options[i].textContent;
            txt.classList.remove('is-placeholder');
            sel.classList.remove('invalid');
            setActive(i);
        }
        function open() {
            if (openSelect && openSelect !== sel) closeSelect(openSelect);
            sel.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            openSelect = sel;
            var cur = Array.prototype.findIndex.call(options, function (o) {
                return o.getAttribute('aria-selected') === 'true';
            });
            setActive(cur > -1 ? cur : 0);
        }

        btn.addEventListener('click', function () {
            if (sel.classList.contains('open')) closeSelect(sel); else open();
        });
        btn.addEventListener('keydown', function (e) {
            var isOpen = sel.classList.contains('open');
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!isOpen) { open(); return; }
                var n = active + (e.key === 'ArrowDown' ? 1 : -1);
                setActive(Math.max(0, Math.min(options.length - 1, n)));
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isOpen && active > -1) { choose(active); closeSelect(sel); } else open();
            } else if (e.key === 'Escape' || e.key === 'Tab') {
                closeSelect(sel);
            }
        });

        sel._reset = function () {
            hidden.value = '';
            options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
            var txt = btn.querySelector('.bk-select-text');
            txt.textContent = placeholder;
            txt.classList.add('is-placeholder');
        };
        sel._focus = function () { btn.focus(); };
    }

    document.querySelectorAll('.bk-select').forEach(buildSelect);
    document.addEventListener('click', function (e) {
        if (openSelect && !openSelect.contains(e.target)) closeSelect(openSelect);
    });

    /* ---------- Booking form ---------- */
    var form = document.getElementById('bkForm');
    if (!form) return;

    var endpoint = form.getAttribute('data-endpoint');
    var errorBox = document.getElementById('bkError');
    var successBox = document.getElementById('bkSuccess');
    var submitBtn = document.getElementById('bkSubmit');

    // Dates can't be in the past
    var todayISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    form.querySelectorAll('input[type="date"]').forEach(function (d) { d.min = todayISO; });

    // "Date not set yet" toggles
    form.querySelectorAll('[data-toggle-date]').forEach(function (cb) {
        var target = document.getElementById(cb.getAttribute('data-toggle-date'));
        cb.addEventListener('change', function () {
            target.disabled = cb.checked;
            target.required = !cb.checked;
            if (cb.checked) target.value = '';
        });
    });

    function showError(text) { errorBox.textContent = text; errorBox.style.display = 'block'; }
    function hideError() { errorBox.style.display = 'none'; }

    function scrollToEl(el) {
        var top = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: top, behavior: 'smooth' });
    }

    function validate() {
        // Walk the form in visual order: native fields, chip groups and custom selects
        var nodes = form.querySelectorAll('input:not([type="hidden"]), textarea, .bk-checks[data-required], .bk-select[data-required]');
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.classList.contains('bk-checks')) {
                if (!n.querySelector('input:checked')) {
                    scrollToEl(n);
                    return 'Please choose an option for "' + n.getAttribute('data-required') + '".';
                }
            } else if (n.classList.contains('bk-select')) {
                if (!n.querySelector('input[type="hidden"]').value) {
                    n.classList.add('invalid');
                    scrollToEl(n);
                    n._focus();
                    return 'Please select an option for "' + n.getAttribute('data-required') + '".';
                }
            } else if (n.closest('.bk-checks')) {
                continue; // chip inputs are validated as a group
            } else if (!n.checkValidity()) {
                n.reportValidity();
                return null; // browser shows its own message
            }
        }
        return '';
    }

    function collect() {
        var data = {};
        var els = form.elements;
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (!el.name || el.disabled) continue;
            if (el.type === 'checkbox' || el.type === 'radio') {
                if (!el.checked) {
                    // single yes/no tick boxes report their "unticked" value too
                    var off = el.getAttribute('data-unchecked');
                    if (off && !(el.name in data)) data[el.name] = off;
                    continue;
                }
                if (el.getAttribute('data-unchecked')) { data[el.name] = el.value; continue; }
                data[el.name] = data[el.name] ? data[el.name] + ', ' + el.value : el.value;
            } else {
                data[el.name] = el.value;
            }
        }
        return data;
    }

    function prettyDate(iso) {
        if (!iso) return '';
        var d = new Date(iso + 'T00:00:00');
        if (isNaN(d)) return iso;
        var M = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'];
        return d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear();
    }

    function whatsappLink(data) {
        var who = [data['First Name'], data['Last Name']].filter(Boolean).join(' ');
        var what = data['Event Type'] || data['Ceremony Type'] || '';
        var when = prettyDate(data['Event Date'] || data['Preferred Wedding Date']);
        var details = [what, when].filter(Boolean).join(', ');
        var msg = 'Hello PK Events, my name is ' + who + '. I just submitted a ' +
            (form.getAttribute('data-kind') || 'booking') + ' enquiry on your website' +
            (details ? ' (' + details + ')' : '') + '. Please help me look into my booking.';
        return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideError();
        var problem = validate();
        if (problem === null) return;
        if (problem) { showError(problem); return; }

        var data = collect();
        var label = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw new Error('Request failed');
            document.getElementById('bkSuccessName').textContent = data['First Name'] || '';
            document.getElementById('bkWhatsApp').href = whatsappLink(data);
            document.body.classList.add('bk-submitted');
            successBox.hidden = false;
            successBox.style.display = 'flex';
            document.getElementById('bkMain').style.display = 'none';
            window.scrollTo({ top: 0 });
            var h = successBox.querySelector('.bk-success-title');
            if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
        }).catch(function () {
            showError('Sorry, we couldn’t send your enquiry. Please try again, or reach us on WhatsApp at +234 806 650 0787.');
            submitBtn.disabled = false;
            submitBtn.textContent = label;
        });
    });
})();
