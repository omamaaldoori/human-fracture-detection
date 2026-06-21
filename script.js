/* ARKA PLAN ANIMASYONU */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 10 + Math.random() * 20,
    speedX: (Math.random() - 0.5) * 2,
    speedY: (Math.random() - 0.5) * 2,
    color: `hsl(200, 70%, ${50 + Math.random() * 20}%)`
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = particle.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* YÜKLENEN RESMİ FLASK BACKEND'E GÖNDERME */
async function previewImage(event) {
  const file = event.target.files[0];
  if (!file) {
    alert(currentLanguage === 'tr' ? 'Lütfen bir röntgen görseli seçin!' : 'يرجى اختيار صورة الأشعة السينية!');
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (e) {
    const preview = document.getElementById('preview');
    preview.src = e.target.result;

    const analysisStatus = document.getElementById('analysisStatus');
    analysisStatus.innerText = currentLanguage === 'tr' ? 'Yapay zeka analizi yapılıyor...' : 'جاري تحليل الذكاء الاصطناعي...';

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP hatası! Durum: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      const resultImage = document.getElementById('resultImage');
      resultImage.src = imageUrl;
      resultImage.style.display = 'block';
      
      analysisStatus.innerText = currentLanguage === 'tr' ? 'Analiz Tamamlandı!' : 'تم اكتمال التحليل!';
    } catch (error) {
      analysisStatus.innerText = currentLanguage === 'tr' ? 'Hata Oluştu' : 'حدث خطأ';
      alert(currentLanguage === 'tr' ? 'Backend ile iletişim hatası: ' + error.message : 'خطأ في الاتصال بالخادم: ' + error.message);
      console.error('Error:', error);
    }
  };

  reader.readAsDataURL(file);
}

/* GERİ BİLDİRİM GÖNDERME */
async function submitFeedback() {
  const feedbackText = document.querySelector('.feedback-textarea').value;
  if (!feedbackText.trim()) {
    alert(currentLanguage === 'tr' ? 'Lütfen bir görüş yazın!' : 'يرجى كتابة تعليق!');
    return;
  }
  alert(currentLanguage === 'tr' ? 'Geri bildiriminiz için teşekkürler!' : 'شكرا لتعليقاتكم!');
  document.querySelector('.feedback-textarea').value = '';
}

/* TIBBİ DİL ÇEVİRİ SÖZLÜĞÜ */
const translations = {
  tr: {
    welcome: " Kırık Tespit Sistemine",
    hello: "Hoş Geldiniz!",
    tryNow: "Analize Başla",
    systemTitle: "Kırık Tespit Sistemi",
    chooseLanguage: "Dil Seçiniz",
    home: "Ana Sayfa",
    about: "Hakkımızda",
    services: "Hizmetlerimiz",
    contact: "İletişim",
    description: "YOLOv8 Destekli Karar Destek Sistemi",
    paragraph: "Bu sistem, radyologlar ve ortopedi uzmanları için bir klinik karar destek mekanizması olarak geliştirilmiştir. YOLOv8 mimarisi kullanılarak eğitilen modelimiz, el/bilek bölgesi X-Ray görüntülerindeki kırık hatlarını yüksek doğrulukla konumlandırır. Eğitim sürecinde medikal standartlara uygun etiketlenmiş veri setleri kullanılmış, böylece gözden kaçabilecek mikro kırıkların dahi tespit edilmesi heдевlenmiştir.",
    servicesDesc: "Sistemimiz, yüklediğiniz el/bilek röntgeni üzerinde yapay zeka analizi gerçekleştirerek kırık şüphesi taşıyan bölgeleri işaretler.",
    instruction: "Lütfen analizi başlatmak için aşağıdaki talimatları uygulayın.",
    uploadPhoto: "Röntgen Fotoğrafı Yükle:",
    result: "Analiz Sonucu:",
    uploadedImage: "Yüklenmemiş Görsel",
    chooseFile: "Dosya Seçin",
    feedbackTitle: "Sistemi nasıl buldunuz?",
    feedbackPlaceholder: "Görüşlerinizi buraya yazabilirsiniz...",
    feedbackButton: "Gönder",
    themeDark: "🌙 Tema: Karanlık",
    themeLight: "☀️ Tema: Aydınlık",
    placeholderText: "Lütfen röntgen yükleyin"
  },
  ar: {
    welcome: "إلى نظام الكشف عن الكسور ",
    hello: "أهلاً وسهلاً بكم!",
    tryNow: "ابدأ التحليل",
    systemTitle: "نظام الكشف عن الكسور",
    chooseLanguage: "اختر اللغة",
    home: "الصفحة الرئيسية",
    about: "حول النظام",
    services: "خدماتنا",
    contact: "اتصال",
    description: "نظام دعم القرار الطبي بدعم من YOLOv8",
    paragraph: "تم تطوير هذا النظام كآلية لدعم القرار السريري لأطباء الأشعة وأخصائيي العظام. يقوم نموذجنا المدرب باستخدام بنية YOLOv8 بتحديد خطوط الكسور في صور الأشعة السينية لمنطقة الركبة بدقة عالية.",
    servicesDesc: "يقوم نظامنا بإجراء تحليل بالذكاء الاصطناعي على الأشعة السينية للركبة وتحديد المناطق التي يُشتبه في وجود كسور بها.",
    instruction: "يرجى اتباع التعليمات أدناه لبدء التحليل.",
    uploadPhoto: "تحميل صورة الأشعة السينية:",
    result: "نتيجة التحليل:",
    uploadedImage: "الصورة غير محملة",
    chooseFile: "اختر الملف",
    feedbackTitle: "ما رأيك في النظام؟",
    feedbackPlaceholder: "يمكنك كتابة رأيك هنا...",
    feedbackButton: "إرسال",
    themeDark: "🌙 الوضع: مظلم",
    themeLight: "☀️ الوضع: مضيء",
    placeholderText: "يرجى تحميل الأشعة السينية"
  }
};

let currentLanguage = 'tr';

function changeLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang;
  const elements = document.querySelectorAll('[data-key]');
  elements.forEach(el => {
    const key = el.getAttribute('data-key');
    if (translations[lang] && translations[lang][key]) {
      if (key === 'feedbackPlaceholder') {
        el.setAttribute('placeholder', translations[lang][key]);
      } else if (key === 'uploadedImage') {
        el.setAttribute('alt', translations[lang][key]);
      } else {
        el.innerText = translations[lang][key];
      }
    }
  });
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? translations[lang].themeDark : translations[lang].themeLight;
  
  const analysisStatus = document.getElementById('analysisStatus');
  if (analysisStatus.innerText === translations['tr'].placeholderText || analysisStatus.innerText === translations['ar'].placeholderText) {
    analysisStatus.innerText = translations[lang].placeholderText;
  }
}

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? translations[currentLanguage].themeDark : translations[currentLanguage].themeLight;
});

document.querySelector('.button[style*="margin-top"]').addEventListener('click', submitFeedback);

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav__menu');
navToggle.addEventListener('change', () => {
  navMenu.style.display = navToggle.checked ? 'block' : 'none';
});

window.onload = () => {
  changeLanguage('tr');
  document.getElementById('resultImage').style.display = 'none';
};