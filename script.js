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
   実績スライドショー
   ============================================ */
(function () {
  const track = document.getElementById('worksTrack');
  const prevBtn = document.getElementById('worksPrev');
  const nextBtn = document.getElementById('worksNext');
  const currentNumEl = document.getElementById('worksCurrentNum');
  const totalNumEl = document.getElementById('worksTotalNum');
  const dotsWrap = document.getElementById('worksDots');

  if (!track) return;

  const cards = Array.from(track.children);
  const total = cards.length;
  let current = 0;
  let autoTimer;

  // ヒーロー内スライダーは常に1枚表示
  function getVisible() { return 1; }

  // ドットを生成
  function buildDots() {
    dotsWrap.innerHTML = '';
    const steps = total - getVisible() + 1;
    for (let i = 0; i < steps; i++) {
      const dot = document.createElement('button');
      dot.className = 'works-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `${i + 1}番目の実績へ`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function maxIndex() { return Math.max(0, total - getVisible()); }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].offsetWidth + 20; // gap: 20px
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    currentNumEl.textContent = current + 1;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
    dotsWrap.querySelectorAll('.works-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      goTo(current >= maxIndex() ? 0 : current + 1);
    }, 4000);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // タッチスワイプ
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // ホバー中は自動スクロール停止
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', resetAuto);

  // リサイズ時に再計算
  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(current, maxIndex()));
  });

  totalNumEl.textContent = total;
  buildDots();
  goTo(0);
})();

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
   Supabase クライアント初期化
   ============================================ */
const { createClient } = supabase;
const db = createClient(
  'https://qcuhcwhbvvoeyikwijco.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWhjd2hidnZvZXlpa3dpamNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MjI3MDcsImV4cCI6MjA5NDM5ODcwN30.TlVdLVKa2u0VrkTy8gZcEwWl3SAOp0A5SaT6qccEGBA'
);

/* ============================================
   お問い合わせフォーム バリデーション & 送信処理
   ============================================ */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('form-message');

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = type;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const company = form.company.value.trim();
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const service = form.service.value;
  const budget  = form.budget.value;
  const message = form.message.value.trim();

  if (!company) { showMessage('会社名を入力してください。', 'error'); return; }
  if (!name)    { showMessage('担当者名を入力してください。', 'error'); return; }
  if (!email || !validateEmail(email)) { showMessage('正しいメールアドレスを入力してください。', 'error'); return; }
  if (!message) { showMessage('ご相談内容を入力してください。', 'error'); return; }

  submitBtn.disabled = true;
  submitBtn.textContent = '送信中...';
  formMessage.className = '';

  const { error } = await db.from('contacts').insert({
    company, name, email, service, budget, message
  });

  if (error) {
    showMessage('送信に失敗しました。時間をおいて再度お試しください。', 'error');
  } else {
    showMessage('お問い合わせを受け付けました。1営業日以内にご返信いたします。', 'success');
    form.reset();
  }

  submitBtn.disabled = false;
  submitBtn.textContent = '送信する →';
});
