(function () {
  'use strict';

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  function showMessage(text, actionLabel, action) {
    let notice = document.getElementById('dmPwaNotice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'dmPwaNotice';
      notice.setAttribute('role', 'status');
      notice.style.cssText = [
        'position:fixed',
        'left:16px',
        'bottom:16px',
        'z-index:2147482500',
        'max-width:min(420px,calc(100vw - 32px))',
        'display:flex',
        'align-items:center',
        'gap:10px',
        'padding:11px 13px',
        'border:1px solid rgba(255,255,255,.22)',
        'border-radius:14px',
        'background:#0b1533',
        'color:#fff',
        'box-shadow:0 14px 38px rgba(15,23,42,.28)',
        'font:600 13px/1.35 Inter,Segoe UI,Arial,sans-serif'
      ].join(';');
      document.body.appendChild(notice);
    }
    notice.replaceChildren();
    const label = document.createElement('span');
    label.textContent = text;
    notice.appendChild(label);
    if (actionLabel && action) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = actionLabel;
      button.style.cssText = 'border:0;border-radius:9px;padding:8px 10px;background:#fff;color:#0b1533;font-weight:800;cursor:pointer;white-space:nowrap';
      button.addEventListener('click', action);
      notice.appendChild(button);
    }
    return notice;
  }

  function createInstallButton() {
    let button = document.getElementById('dmPwaInstall');
    if (button) return button;
    button = document.createElement('button');
    button.id = 'dmPwaInstall';
    button.type = 'button';
    button.textContent = 'Instalar Portal DM';
    button.setAttribute('aria-label', 'Instalar Portal DM neste dispositivo');
    button.style.cssText = [
      'position:fixed',
      'left:16px',
      'bottom:16px',
      'z-index:2147482400',
      'display:none',
      'border:0',
      'border-radius:13px',
      'padding:11px 14px',
      'background:#0657ff',
      'color:#fff',
      'box-shadow:0 12px 30px rgba(6,87,255,.3)',
      'font:800 13px Inter,Segoe UI,Arial,sans-serif',
      'cursor:pointer'
    ].join(';');
    document.body.appendChild(button);
    return button;
  }

  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker || !navigator.serviceWorker.controller) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            showMessage('Existe uma nova versão do Portal DM.', 'Atualizar', () => location.reload());
          }
        });
      });
    } catch (error) {
      console.warn('Não foi possível ativar o modo app.', error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const installButton = createInstallButton();
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      deferredPrompt = event;
      if (!isStandalone()) installButton.style.display = 'block';
    });

    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        installButton.style.display = 'none';
        return;
      }
      const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isiOS) {
        alert('No Safari, toque em Partilhar e depois em “Adicionar ao ecrã principal”.');
      }
    });

    const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isiOS && !isStandalone()) installButton.style.display = 'block';
    window.addEventListener('appinstalled', () => {
      installButton.style.display = 'none';
      showMessage('Portal DM instalado com sucesso.');
      setTimeout(() => document.getElementById('dmPwaNotice')?.remove(), 3500);
    });

    registerServiceWorker();
  }, { once: true });
})();
