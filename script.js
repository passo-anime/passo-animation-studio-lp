/* ============================================
   ナビゲーション — スクロール時の影 & ハンバーガー
   ============================================ */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 16);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// リンクをタップしたらメニューを閉じる
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================
   スクロールアニメーション（Intersection Observer）
   ============================================ */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // 同一バッチ内で少しずつ遅延を付ける
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ============================================
   料金タブ切り替え
   ============================================ */
document.querySelectorAll('.pricing-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // タブのアクティブ状態を切り替え
    document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // プランの表示を切り替え
    document.querySelectorAll('.pricing-plans').forEach(p => p.classList.remove('active'));
    document.getElementById(tab.dataset.target).classList.add('active');

    // 新しく表示されたカードにフェードインを適用
    document.querySelectorAll(`#${tab.dataset.target} .fade-in`).forEach(el => {
      el.classList.add('visible');
    });
  });
});

/* ============================================
   お問い合わせフォーム バリデーション & 送信処理
   ============================================ */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('form-message');

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = type; // 'success' or 'error'
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // --- バリデーション ---
  const company = form.company.value.trim();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!company) { showMessage('会社名を入力してください。', 'error'); return; }
  if (!name)    { showMessage('担当者名を入力してください。', 'error'); return; }
  if (!email || !validateEmail(email)) { showMessage('正しいメールアドレスを入力してください。', 'error'); return; }
  if (!message) { showMessage('ご相談内容を入力してください。', 'error'); return; }

  // --- 送信中状態 ---
  submitBtn.disabled = true;
  submitBtn.textContent = '送信中...';
  formMessage.className = '';

  /*
   * ここに実際の送信処理を実装してください。
   * 例: fetch('/api/contact', { method: 'POST', body: new FormData(form) })
   *
   * 以下はデモ用の疑似処理です（1秒後に成功）。
   */
  await new Promise(resolve => setTimeout(resolve, 1000));

  showMessage('お問い合わせを受け付けました。1営業日以内にご返信いたします。', 'success');
  form.reset();

  submitBtn.disabled = false;
  submitBtn.textContent = '送信する →';
});
