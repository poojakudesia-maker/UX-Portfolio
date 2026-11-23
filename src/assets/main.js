// Progressive enhancement only: every page works without this file.
(() => {
  // Copy-to-clipboard buttons: <button data-copy="text" data-status="#id">
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const status = document.querySelector(btn.dataset.status);
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        if (status) status.textContent = 'Copied to clipboard.';
      } catch {
        if (status) status.textContent = 'Copy failed. Select the address above instead.';
      }
      if (status) setTimeout(() => { status.textContent = ''; }, 4000);
    });
  });

  // NDA access dialog
  const dialog = document.getElementById('nda-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    let opener = null;
    document.querySelectorAll('[data-open-nda]').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        opener = b;
        const sel = dialog.querySelector('#nda-case');
        if (sel && b.dataset.case) sel.value = b.dataset.case;
        dialog.showModal();
      });
    });
    dialog.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => opener && opener.focus());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

    // Builds a pre-filled email instead of posting to a server (static site).
    const form = dialog.querySelector('form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const to = form.dataset.to;
      const subject = `NDA access request: ${d.get('case')}`;
      const body = `Name: ${d.get('name')}\nCompany: ${d.get('company')}\nRole: ${d.get('role')}\n\n${d.get('note') || ''}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      dialog.close();
    });
  }

  // Case-study table of contents: mark the section in view.
  const toc = document.querySelector('.toc');
  if (toc && 'IntersectionObserver' in window) {
    const links = new Map([...toc.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        const a = links.get(en.target.id);
        if (a) {
          a.setAttribute('aria-current', 'true');
          if (window.matchMedia('(max-width: 999px)').matches) a.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    links.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
