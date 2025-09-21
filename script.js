// script.js - client-side form handling and Gmail compose opener

(function () {
  const form = document.getElementById('regForm');
  const status = document.getElementById('status');
  const copyBtn = document.getElementById('copyBtn');

  const EMAIL_TO = 'cyberxdevsofficial@gmail.com';
  const SUBJECT = 'KINGDOM OF HACKERS TM APPLICATION';

  function sanitizeLine(s){
    return String(s || '').trim();
  }

  function buildBody(data){
    // Pretty printable body
    return [
      'KINGDOM OF HACKERS TM REGISTRATION APPLICATION',
      '---------------------------------------------',
      `Name: ${sanitizeLine(data.name)}`,
      `Country: ${sanitizeLine(data.country)}`,
      `Age: ${sanitizeLine(data.age)}`,
      `Qualifications: ${sanitizeLine(data.qualification)}`,
      `WhatsApp number: ${sanitizeLine(data.whatsapp)}`,
      `Phone number: ${sanitizeLine(data.phone)}`,
      `Email: ${sanitizeLine(data.email)}`,
      `Home address: ${sanitizeLine(data.address)}`,
      '',
      '--- End of application ---'
    ].join('\n');
  }

  function openGmailCompose(to, subject, body) {
    // Gmail web compose: opens Gmail compose with fields filled (user must be signed in)
    const baseG = 'https://mail.google.com/mail/?view=cm&fs=1';
    const params = new URLSearchParams({
      to: to || '',
      su: subject || '',
      body: body || ''
    });
    const gmailUrl = `${baseG}&${params.toString()}`;

    // Attempt to open Gmail URL (preferred). If popup blocked, we'll attempt mailto fallback.
    const w = window.open(gmailUrl, '_blank');
    if (w) {
      // opened a new tab — focus it
      try { w.focus(); } catch(e){}
      return true;
    }
    return false;
  }

  function openMailtoFallback(to, subject, body){
    // mailto fallback (will open default mail client)
    const params = new URLSearchParams({
      subject: subject || '',
      body: body || ''
    });
    const mailto = `mailto:${encodeURIComponent(to || '')}?${params.toString()}`;
    window.location.href = mailto;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    status.textContent = '';

    // simple validation
    const fd = {
      name: document.getElementById('name').value,
      country: document.getElementById('country').value,
      age: document.getElementById('age').value,
      qualification: document.getElementById('qual').value,
      whatsapp: document.getElementById('whatsapp').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value
    };

    // required checks
    const requiredFields = ['name','country','age','qualification','whatsapp','phone','email','address'];
    for (const key of requiredFields) {
      if (!sanitizeLine(fd[key])) {
        status.textContent = 'Please fill all required fields.';
        return;
      }
    }

    const body = buildBody(fd);

    // Try Gmail
    const ok = openGmailCompose(EMAIL_TO, SUBJECT, body);

    if (ok) {
      status.textContent = 'Gmail compose opened in a new tab. Review and send the email.';
    } else {
      // attempt fallback
      openMailtoFallback(EMAIL_TO, SUBJECT, body);
      // If even mailto didn't navigate (rare), provide copy fallback (user can paste)
      status.textContent = 'Could not open Gmail in a new tab (popup blocked). A mail client was opened as fallback. If nothing opened, use "Copy Application Text" and paste into your email.';
    }
  });

  copyBtn.addEventListener('click', function(){
    // gather current field values
    const fd = {
      name: document.getElementById('name').value,
      country: document.getElementById('country').value,
      age: document.getElementById('age').value,
      qualification: document.getElementById('qual').value,
      whatsapp: document.getElementById('whatsapp').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value
    };
    const body = buildBody(fd);
    navigator.clipboard?.writeText(body).then(() => {
      status.textContent = 'Application text copied to clipboard. Paste into your email client and send to ' + EMAIL_TO;
    }).catch(() => {
      // fallback: select text
      const ta = document.createElement('textarea');
      ta.value = body;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); status.textContent = 'Copied to clipboard (fallback).'; }
      catch (ex) { status.textContent = 'Unable to copy automatically. Please copy manually below.'; }
      document.body.removeChild(ta);
    });
  });

})();
