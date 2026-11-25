/**
 * عدسة - عالم التصوير الفوتوغرافي
 * Route Academy Photography Blog
 * Senior Front-End Implementation
 */

// Global State
const state = {
  posts: [],
  categories: [
    { name: "إضاءة", count: 4, color: "emerald", icon: "fa-solid fa-sun", bg: "from-orange-500 to-yellow-500" },
    { name: "بورتريه", count: 6, color: "purple", icon: "fa-solid fa-user", bg: "from-orange-600 to-orange-400" },
    { name: "مناظر طبيعية", count: 4, color: "blue", icon: "fa-solid fa-mountain-sun", bg: "from-orange-500 to-yellow-500" },
    { name: "تقنيات", count: 9, color: "orange", icon: "fa-solid fa-sliders", bg: "from-orange-500 to-yellow-500" },
    { name: "معدات", count: 5, color: "emerald", icon: "fa-solid fa-camera", bg: "from-orange-500 to-yellow-500" }
  ],
  siteInfo: {
    name: "عدسة",
    subtitle: "عالم التصوير الفوتوغرافي",
    description: "مدونة متخصصة في فن التصوير الفوتوغرافي، نشارك معكم أسرار المحترفين ونصائح عملية لتطوير مهاراتكم.",
    email: "hello@adasah.com",
    social: {
      twitter: "https://twitter.com/adasah",
      github: "https://github.com/adasah",
      linkedin: "https://linkedin.com/company/adasah",
      youtube: "https://youtube.com/@adasah"
    }
  },
  blog: {
    searchQuery: '',
    selectedCategory: 'all',
    viewMode: localStorage.getItem('adasa_view_mode') || 'grid',
    currentPage: 1,
    postsPerPage: 6
  },
  currentRoute: '/'
};

// ==========================================
// Toast Notification Utility
// ==========================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  const icon = type === 'success' 
    ? '<i class="fa-solid fa-circle-check text-orange-500"></i>' 
    : '<i class="fa-solid fa-circle-info text-orange-500"></i>';
  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================
// Data Service (posts.json with fallback)
// ==========================================
async function initData() {
  try {
    const res = await fetch('posts.json');
    if (res.ok) {
      const data = await res.json();
      state.posts = data.posts || [];
    } else {
      throw new Error('fetch status ' + res.status);
    }
  } catch (err) {
    console.warn('Fallback to local posts data:', err);
    if (window.__POSTS_DATA__ && window.__POSTS_DATA__.posts) {
      state.posts = window.__POSTS_DATA__.posts;
    }
  }

  // Update dynamic category counts from posts
  const counts = {};
  state.posts.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  state.categories.forEach(c => {
    if (counts[c.name] !== undefined) {
      c.count = counts[c.name];
    }
  });
}

// Date Formatter helper (Arabic locale)
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

// Arabic pluralization helper
function formatArticleCount(count) {
  if (count === 0) return '0 مقال';
  if (count === 1) return '1 مقالة';
  if (count === 2) return 'مقالتين';
  if (count >= 3 && count <= 10) return `${count} مقالات`;
  return `${count} مقالاً`;
}

// ==========================================
// Navigation & Footer Renderers
// ==========================================
function renderNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  const current = state.currentRoute;
  const isHome = current === '/' || current === '';
  const isBlog = current.startsWith('/blog');
  const isAbout = current === '/about';

  container.innerHTML = `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#262626]" id="main-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          
          <!-- Logo -->
          <a href="#/" class="flex items-center gap-3 group">
            <div class="relative w-12 h-12 rounded-xl overflow-hidden group-hover:scale-105 transition-all duration-300">
              <img src="logo.png" alt="Photography Logo" class="w-full h-full object-cover">
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                ${state.siteInfo.name}
              </span>
              <span class="text-xs text-orange-400/80 hidden sm:block tracking-wide">
                ${state.siteInfo.subtitle}
              </span>
            </div>
          </a>

          <!-- Desktop Center Pill Navigation -->
          <div class="hidden md:flex items-center">
            <div class="flex items-center bg-[#161616] rounded-full p-1.5 border border-[#262626]">
              <a href="#/" class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isHome ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20' : 'text-neutral-400 hover:text-white'}">
                الرئيسية
              </a>
              <a href="#/blog" class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isBlog ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20' : 'text-neutral-400 hover:text-white'}">
                المدونة
              </a>
              <a href="#/about" class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isAbout ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20' : 'text-neutral-400 hover:text-white'}">
                من نحن
              </a>
            </div>
          </div>

          <!-- Desktop Right Actions -->
          <div class="hidden md:flex items-center gap-3">
            <a href="#/blog" class="p-3 text-neutral-400 hover:text-orange-500 hover:bg-[#161616] rounded-xl transition-all duration-300 border border-transparent hover:border-[#262626]" title="بحث">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </a>
            <a href="#/blog" class="btn-primary btn-pill text-sm py-2.5 px-6">
              ابدأ القراءة
            </a>
          </div>

          <!-- Mobile Hamburger Button -->
          <button id="mobile-menu-btn" class="md:hidden p-3 text-neutral-400 hover:text-white hover:bg-[#161616] rounded-xl transition-all duration-300 border border-transparent hover:border-[#262626]" aria-label="القائمة">
            <svg id="hamburger-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg id="close-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Drawer Navigation -->
        <div id="mobile-drawer" class="md:hidden overflow-hidden transition-all duration-300 max-h-0">
          <div class="bg-[#161616] backdrop-blur-xl rounded-2xl p-4 border border-[#262626] mb-4">
            <div class="flex flex-col space-y-1">
              <a href="#/" class="mobile-nav-link px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isHome ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}">
                الرئيسية
              </a>
              <a href="#/blog" class="mobile-nav-link px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isBlog ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}">
                المدونة
              </a>
              <a href="#/about" class="mobile-nav-link px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isAbout ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}">
                من نحن
              </a>
              <div class="pt-3 border-t border-[#262626] mt-2">
                <a href="#/blog" class="btn-primary w-full text-center text-sm">
                  ابدأ القراءة
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  `;

  // Mobile menu interaction
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const hamIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (menuBtn && drawer) {
    menuBtn.onclick = () => {
      const isOpen = drawer.classList.contains('max-h-80');
      if (isOpen) {
        drawer.classList.remove('max-h-80');
        drawer.classList.add('max-h-0');
        hamIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      } else {
        drawer.classList.remove('max-h-0');
        drawer.classList.add('max-h-80');
        hamIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      }
    };

    // Close drawer when clicking any link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('max-h-80');
        drawer.classList.add('max-h-0');
        hamIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      });
    });
  }
}

function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  container.innerHTML = `
    <footer class="relative bg-[#0a0a0a] text-neutral-300 overflow-hidden border-t border-[#262626]">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="max-w-7xl relative mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <!-- Brand Info -->
          <div class="lg:col-span-1">
            <a href="#/" class="flex items-center gap-3 mb-6 group">
              <div class="w-11 h-11 rounded-xl overflow-hidden group-hover:scale-105 transition-all duration-300">
                <img src="logo.png" alt="Photography Logo" class="w-full h-full object-cover">
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                ${state.siteInfo.name}
              </span>
            </a>
            <p class="text-neutral-400 text-sm leading-relaxed mb-6">
              ${state.siteInfo.description}
            </p>
            <div class="flex items-center gap-3">
              <a href="${state.siteInfo.social.twitter}" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-center text-neutral-400 hover:text-orange-500 hover:border-orange-500/30 transition-all duration-300" title="تويتر">
                <i class="fa-brands fa-x-twitter"></i>
              </a>
              <a href="${state.siteInfo.social.github}" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-center text-neutral-400 hover:text-orange-500 hover:border-orange-500/30 transition-all duration-300" title="جيت هب">
                <i class="fa-brands fa-github"></i>
              </a>
              <a href="${state.siteInfo.social.linkedin}" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-center text-neutral-400 hover:text-orange-500 hover:border-orange-500/30 transition-all duration-300" title="لينكد إن">
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="${state.siteInfo.social.youtube}" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-center text-neutral-400 hover:text-orange-500 hover:border-orange-500/30 transition-all duration-300" title="يوتيوب">
                <i class="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          <!-- Explore Links -->
          <div>
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span class="footer-heading-bar"></span>
              استكشف
            </h3>
            <ul class="space-y-3 text-sm">
              <li><a href="#/" class="text-neutral-400 hover:text-orange-500 transition-colors">الرئيسية</a></li>
              <li><a href="#/blog" class="text-neutral-400 hover:text-orange-500 transition-colors">المدونة</a></li>
              <li><a href="#/about" class="text-neutral-400 hover:text-orange-500 transition-colors">من نحن</a></li>
            </ul>
          </div>

          <!-- Category Links -->
          <div>
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span class="footer-heading-bar"></span>
              التصنيفات
            </h3>
            <ul class="space-y-3 text-sm">
              ${state.categories.slice(0, 4).map(c => `
                <li>
                  <a href="#/blog?category=${encodeURIComponent(c.name)}" class="text-neutral-400 hover:text-orange-500 transition-colors">
                    ${c.name}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Newsletter Form -->
          <div>
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span class="footer-heading-bar"></span>
              ابقى على اطلاع
            </h3>
            <p class="text-neutral-400 text-sm mb-4 leading-relaxed">
              اشترك للحصول على أحدث المقالات والتحديثات.
            </p>
            <form id="footer-newsletter" class="space-y-3" onsubmit="event.preventDefault(); showToast('شكراً لاشتراكك في نشرتنا البريدية!', 'success'); this.reset();">
              <div class="relative">
                <input type="email" required placeholder="أدخل بريدك الإلكتروني" class="w-full px-4 py-3 bg-[#161616] border border-[#262626] rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300 placeholder-neutral-500">
              </div>
              <button type="submit" class="w-full btn-primary btn-pill text-sm py-3">
                اشترك
              </button>
            </form>
          </div>

        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-[#262626] py-6 bg-[#0a0a0a]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
          <p>© 2026 ${state.siteInfo.name}. صنع بكل <i class="fa-solid fa-heart text-orange-500" style="margin-inline:4px"></i> جميع الحقوق محفوظة.</p>
          <div class="flex items-center gap-6">
            <a href="#/privacy" class="hover:text-orange-500 transition-colors">سياسة الخصوصية</a>
            <a href="#/terms" class="hover:text-orange-500 transition-colors">شروط الخدمة</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// ==========================================
// Card Renderers (Grid & List View)
// ==========================================
function renderPostCard(post, { featured = false, viewMode = 'grid', index = 0 } = {}) {
  const formattedDate = formatDate(post.date);

  // Home Page Featured Card (Large layout)
  if (featured) {
    return `
      <article class="group relative bg-[#161616] rounded-3xl overflow-hidden border border-[#262626] hover:border-orange-500/30 transition-all duration-500">
        <a href="#/blog/${post.slug}" class="block">
          <div class="grid md:grid-cols-2 gap-0">
            <div class="relative h-72 md:h-[420px] overflow-hidden">
              <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute top-4 right-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg">
                  <i class="fa-solid fa-star text-[10px]"></i>
                  مميز
                </span>
              </div>
            </div>
            <div class="p-8 md:p-10 flex flex-col justify-center bg-[#161616]">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-semibold rounded-full border border-orange-500/20">
                  ${post.category}
                </span>
                <span class="flex items-center gap-1.5 text-sm text-neutral-400">
                  <i class="fa-regular fa-clock text-xs"></i>
                  ${post.readTime}
                </span>
              </div>
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-orange-500 transition-colors duration-300 leading-snug">
                ${post.title}
              </h2>
              <p class="text-neutral-400 mb-6 line-clamp-3 leading-relaxed text-base">
                ${post.excerpt}
              </p>
              <div class="flex items-center justify-between mt-auto pt-6 border-t border-[#262626]">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="w-11 h-11 rounded-full object-cover ring-2 ring-[#262626]">
                    <div class="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-[#161616]"></div>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">${post.author.name}</p>
                    <p class="text-xs text-neutral-500">${post.author.role}</p>
                  </div>
                </div>
                <div class="text-left">
                  <span class="text-xs text-neutral-500 block">${formattedDate}</span>
                  <span class="text-xs text-orange-500 font-medium inline-flex items-center gap-1 mt-1 group-hover:translate-x-[-4px] transition-transform">
                    اقرأ المقال <i class="fa-solid fa-arrow-left text-[10px]"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  // Blog Page: List View (Horizontal Banner Card)
  if (viewMode === 'list') {
    return `
      <article class="group bg-[#161616] rounded-2xl border border-[#262626] hover:border-orange-500/30 transition-all duration-400 overflow-hidden">
        <a href="#/blog/${post.slug}" class="block">
          <div class="flex flex-col md:flex-row">
            <div class="relative md:w-80 h-56 md:h-auto overflow-hidden shrink-0">
              <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 bg-black/60 backdrop-blur-md text-orange-400 text-xs font-semibold rounded-full border border-white/10">
                  ${post.category}
                </span>
              </div>
            </div>
            <div class="p-6 md:p-8 flex flex-col justify-between flex-grow">
              <div>
                <div class="flex items-center gap-3 mb-3 text-xs text-neutral-400">
                  <span class="flex items-center justify-center gap-1.5"><i class="fa-regular fa-calendar"></i> ${formattedDate}</span>
                  <span>•</span>
                  <span class="flex items-center gap-1.5"><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
                </div>
                <h3 class="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors leading-snug">
                  ${post.title}
                </h3>
                <p class="text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  ${post.excerpt}
                </p>
              </div>
              <div class="flex items-center justify-between pt-4 border-t border-[#262626]">
                <div class="flex items-center gap-3">
                  <img src="${post.author.avatar}" alt="${post.author.name}" class="w-9 h-9 rounded-full object-cover ring-2 ring-[#262626]">
                  <div>
                    <p class="text-xs font-semibold text-white">${post.author.name}</p>
                    <p class="text-[11px] text-neutral-500">${post.author.role}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1.5 text-xs text-orange-500 font-semibold group-hover:translate-x-[-4px] transition-transform">
                  اقرأ المقال <i class="fa-solid fa-arrow-left text-[10px]"></i>
                </span>
              </div>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  // Default: Grid View (Vertical Card)
  return `
    <article class="group relative bg-[#161616] rounded-2xl overflow-hidden border border-[#262626] hover:border-orange-500/30 transition-all duration-300 flex flex-col">
      <a href="#/blog/${post.slug}" class="blog-card-media">
        <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div class="absolute top-4 right-4">
          <span class="blog-card-badge">
            ${post.category}
          </span>
        </div>
      </a>
      <div class="p-6 flex flex-col flex-grow">
        <div class="flex items-center gap-3 text-xs text-neutral-500 mb-3">
          <span class="flex items-center gap-1.5"><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
          <span>•</span>
          <span>${formattedDate}</span>
        </div>
        <a href="#/blog/${post.slug}" class="block mb-3">
          <h3 class="text-xl font-bold text-white group-hover:text-orange-500 transition-colors leading-snug line-clamp-2">
            ${post.title}
          </h3>
        </a>
        <p class="text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-2">
          ${post.excerpt}
        </p>
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-[#262626]">
          <div class="flex items-center gap-3">
            <img src="${post.author.avatar}" alt="${post.author.name}" class="w-9 h-9 rounded-full object-cover ring-2 ring-[#262626]">
            <div>
              <p class="text-sm font-semibold text-white">${post.author.name}</p>
              <p class="text-xs text-neutral-500">${post.author.role}</p>
            </div>
          </div>
          <a href="#/blog/${post.slug}" aria-label="اقرأ المقال: ${post.title}" class="card-arrow-btn">
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </a>
        </div>
      </div>
    </article>
  `;
}

// ==========================================
// Page 1: Home Page
// ==========================================
function renderHome() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const featuredPosts = state.posts.filter(p => p.featured);
  const mainFeatured = featuredPosts[0] || state.posts[0];
  const sideFeatured = featuredPosts.slice(1, 3);
  const latestPosts = state.posts.filter(p => p.id !== (mainFeatured && mainFeatured.id)).slice(0, 3);

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0a0a]">
      <!-- Background Technical Grid Pattern & Glows -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.5)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      <div class="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl blob"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl blob" style="animation-delay: -2s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div class="text-center max-w-4xl mx-auto">
          
          <!-- Badge -->
          <div class="section-label inline-flex items-center gap-2 mb-8">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span class="text-sm font-medium text-neutral-300">مرحباً بك في ${state.siteInfo.name}</span>
          </div>

          <!-- Headline -->
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            اكتشف <span class="gradient-text">فن</span><br/>التصوير الفوتوغرافي
          </h1>

          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            انغمس في أسرار المحترفين ونصائح عملية لتطوير مهاراتك في التصوير.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <a href="#/blog" class="btn-primary inline-flex items-center justify-center gap-2 group text-base py-3.5 px-8">
              <span>استكشف المقالات</span>
              <i class="fa-solid fa-arrow-left group-hover:translate-x-[-4px] transition-transform"></i>
            </a>
            <a href="#/about" class="btn-secondary inline-flex items-center justify-center gap-2 text-base py-3.5 px-8">
              <i class="fa-solid fa-circle-info"></i>
              <span>اعرف المزيد</span>
            </a>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div class="p-6 rounded-2xl bg-[#161616]/80 backdrop-blur-xl border border-[#262626] hover:border-orange-500/30 transition-all duration-300">
              <div class="text-3xl font-bold text-white mb-1">+50</div>
              <div class="text-sm text-neutral-400 flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-newspaper text-orange-500 text-xs"></i>
                مقالة
              </div>
            </div>
            <div class="p-6 rounded-2xl bg-[#161616]/80 backdrop-blur-xl border border-[#262626] hover:border-orange-500/30 transition-all duration-300">
              <div class="text-3xl font-bold text-white mb-1">+10ألف</div>
              <div class="text-sm text-neutral-400 flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-users text-orange-500 text-xs"></i>
                قارئ
              </div>
            </div>
            <div class="p-6 rounded-2xl bg-[#161616]/80 backdrop-blur-xl border border-[#262626] hover:border-orange-500/30 transition-all duration-300">
              <div class="text-3xl font-bold text-white mb-1">${state.categories.length}</div>
              <div class="text-sm text-neutral-400 flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-folder text-orange-500 text-xs"></i>
                تصنيفات
              </div>
            </div>
            <div class="p-6 rounded-2xl bg-[#161616]/80 backdrop-blur-xl border border-[#262626] hover:border-orange-500/30 transition-all duration-300">
              <div class="text-3xl font-bold text-white mb-1">6</div>
              <div class="text-sm text-neutral-400 flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-pen-nib text-orange-500 text-xs"></i>
                كاتب
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Featured Posts Section -->
    <section class="py-24 bg-[#0a0a0a] relative border-t border-[#262626]/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span class="section-label mb-4">
              <i class="fa-solid fa-camera text-xs"></i>
              مقالات مختارة
            </span>
            <h2 class="section-title">محتوى منتقى بعناية</h2>
            <p class="section-subtitle max-w-lg">محتوى منتقى يساعدك على تطوير مهاراتك خطوة بخطوة</p>
          </div>
          <a href="#/blog" class="group inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-400 transition-colors">
            <span>عرض كل المقالات</span>
            <i class="fa-solid fa-arrow-left group-hover:translate-x-[-4px] transition-transform"></i>
          </a>
        </div>

        <!-- Featured Card Hero -->
        ${mainFeatured ? renderPostCard(mainFeatured, { featured: true }) : ''}

        <!-- Additional Featured Grid -->
        ${sideFeatured.length > 0 ? `
          <div class="grid md:grid-cols-2 gap-8 mt-8">
            ${sideFeatured.map(post => renderPostCard(post, { viewMode: 'grid' })).join('')}
          </div>
        ` : ''}

      </div>
    </section>

    <!-- Categories Section (استكشف حسب الموضوع) -->
    <section class="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-[#262626]/50">
      <div class="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:32px_32px] opacity-25"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="section-label mb-4">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            التصنيفات
          </span>
          <h2 class="section-title">استكشف حسب الموضوع</h2>
          <p class="section-subtitle">اعثر على محتوى مصمم خصيصاً حسب اهتماماتك وشغفك</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          ${state.categories.map(c => `
            <a href="#/blog?category=${encodeURIComponent(c.name)}" class="group relative block p-6 rounded-2xl bg-[#161616] border border-[#262626] overflow-hidden hover:border-orange-500/40 transition-all duration-400 hover:-translate-y-1 shadow-md">
              <div class="absolute inset-0 bg-gradient-to-br ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
              <div class="relative z-10 flex flex-col items-center text-center">
                <div class="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors duration-300 border border-orange-500/20 group-hover:border-transparent">
                  <i class="${c.icon} text-2xl text-orange-500 group-hover:text-white transition-colors duration-300"></i>
                </div>
                <h3 class="font-bold text-lg text-white mb-1">${c.name}</h3>
                <p class="text-xs text-neutral-400 group-hover:text-white/80 transition-colors duration-300">
                  ${c.count} مقالات
                </p>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Latest Posts Section (أحدث المقالات) -->
    <section class="py-24 bg-[#0a0a0a] relative border-t border-[#262626]/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span class="section-label mb-4">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              الأحدث
            </span>
            <h2 class="section-title">أحدث المقالات</h2>
            <p class="section-subtitle">محتوى جديد طازج مباشرة من عدسة مصورينا</p>
          </div>
          <a href="#/blog" class="group inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-400 transition-colors">
            <span>عرض جميع المقالات</span>
            <i class="fa-solid fa-arrow-left group-hover:translate-x-[-4px] transition-transform"></i>
          </a>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${latestPosts.map((post, idx) => renderPostCard(post, { viewMode: 'grid', index: idx })).join('')}
        </div>

      </div>
    </section>

    <!-- Newsletter CTA Section -->
    <section class="py-24 relative overflow-hidden bg-[#0a0a0a] border-t border-[#262626]/50">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-[#161616] rounded-3xl border border-[#262626] p-8 md:p-14 text-center shadow-2xl relative overflow-hidden">
          <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
            <i class="fa-regular fa-envelope text-2xl text-white"></i>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            اشترك في <span class="gradient-text">نشرتنا الإخبارية</span>
          </h2>
          <p class="text-neutral-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            احصل على نصائح التصوير الحصرية ودروس جديدة مباشرة في بريدك الإلكتروني أسبوعياً.
          </p>
          <form class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6" onsubmit="event.preventDefault(); showToast('تم الاشتراك بنجاح! تفقد بريدك قريباً.', 'success'); this.reset();">
            <input type="email" required placeholder="أدخل بريدك الإلكتروني" class="flex-1 px-5 py-4 rounded-xl bg-[#0a0a0a] border border-[#262626] focus:outline-none focus:border-orange-500 text-white placeholder-neutral-500 transition-colors">
            <button type="submit" class="btn-primary text-base py-4 px-8 whitespace-nowrap">
              اشترك الآن
            </button>
          </form>
          <div class="flex items-center justify-center gap-3 text-sm text-neutral-400">
            <div class="flex -space-x-2 space-x-reverse">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" class="w-7 h-7 rounded-full border-2 border-[#161616]" alt="subscriber">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face" class="w-7 h-7 rounded-full border-2 border-[#161616]" alt="subscriber">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" class="w-7 h-7 rounded-full border-2 border-[#161616]" alt="subscriber">
            </div>
            <span>انضم لأكثر من <strong class="text-white font-semibold">+1,000 مصور</strong> حول العالم</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ==========================================
// Page 2: Blog Page (Search, Filter, View Toggle, Pagination)
// ==========================================
function renderBlog(queryCategory) {
  const container = document.getElementById('main-content');
  if (!container) return;

  if (queryCategory !== undefined) {
    state.blog.selectedCategory = queryCategory || 'all';
    state.blog.currentPage = 1;
  }

  container.innerHTML = `
    <div class="min-h-screen bg-[#0a0a0a] pb-20" id="blog-main-container" style="direction:rtl">
      <!-- Blog heading matching the reference layout -->
      <section class="blog-hero relative overflow-hidden py-14 md:py-16 text-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-6">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <i class="fa-regular fa-newspaper"></i>
            <span>مدونتنا</span>
          </span>
          <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">استكشف <span class="gradient-text">مقالاتنا</span></h1>
          <p class="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">اكتشف الدروس والرؤى وأفضل الممارسات للتصوير الحديث</p>
        </div>
      </section>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="blog-content-wrap">
        <!-- Search on the right; category chips on the left -->
        <div class="blog-toolbar">
          <div class="blog-search-wrap">
            <input type="text" id="blog-search-input" value="${state.blog.searchQuery}"
              placeholder="ابحث في المقالات..."
              class="blog-search-input">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none"></i>
            ${state.blog.searchQuery ? `<button id="clear-search-btn" class="absolute left-10 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1" title="مسح"><i class="fa-solid fa-xmark"></i></button>` : ''}
          </div>
          <div class="blog-category-strip" id="category-pills">
            ${[
              {name:'all', label:'جميع المقالات'},
              ...state.categories.map(c => ({name:c.name, label:c.name}))
            ].map(c => `<button type="button" data-cat="${c.name}" class="category-filter-btn ${state.blog.selectedCategory === c.name ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-500' : 'bg-[#161616] text-neutral-400 hover:text-white border border-[#262626]'}">${c.label}</button>`).join('')}
          </div>
        </div>

        <!-- Article count on the right and grouped view toggle on the left -->
        <div class="flex items-center justify-between gap-4 py-6">
          <div class="text-sm text-neutral-400" id="results-count-container"></div>
          <div class="flex items-center gap-1 bg-[#161616] border border-[#262626] rounded-xl p-1">
            <button id="view-grid-btn" class="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all ${state.blog.viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-neutral-400 hover:text-white'}" title="عرض شبكي" aria-label="عرض شبكي">
              <i class="fa-solid fa-grip"></i>
            </button>
            <button id="view-list-btn" class="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all ${state.blog.viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-neutral-400 hover:text-white'}" title="عرض قائمة" aria-label="عرض قائمة">
              <i class="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>

        <div id="posts-display-container"></div>
        <div id="pagination-container" class="mt-12"></div>
      </div>
    </div>
  `;

  setupBlogListeners();
  updateBlogResults();
}

function setupBlogListeners() {
  // Search input live filtering
  const searchInput = document.getElementById('blog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.blog.searchQuery = e.target.value.trim();
      state.blog.currentPage = 1;
      updateBlogResults();
      // Render/remove clear button dynamically
      const clearBtn = document.getElementById('clear-search-btn');
      if (state.blog.searchQuery && !clearBtn) {
        const btn = document.createElement('button');
        btn.id = 'clear-search-btn';
        btn.className = 'absolute left-10 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1';
        btn.title = 'مسح';
        btn.innerHTML = '<i class="fa-solid fa-xmark text-sm"></i>';
        btn.onclick = () => {
          state.blog.searchQuery = '';
          searchInput.value = '';
          btn.remove();
          state.blog.currentPage = 1;
          updateBlogResults();
        };
        searchInput.parentNode.appendChild(btn);
      } else if (!state.blog.searchQuery && clearBtn) {
        clearBtn.remove();
      }
    });
  }

  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      state.blog.searchQuery = '';
      if (searchInput) searchInput.value = '';
      clearBtn.remove();
      state.blog.currentPage = 1;
      updateBlogResults();
    };
  }

  // Category Filter Buttons
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      state.blog.selectedCategory = cat;
      state.blog.currentPage = 1;
      
      // Update UI active styles
      document.querySelectorAll('.category-filter-btn').forEach(b => {
        const isSelected = b.getAttribute('data-cat') === cat;
        b.className = `category-filter-btn ${isSelected ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-500' : 'bg-[#161616] text-neutral-400 hover:text-white border border-[#262626]'}`;
      });

      updateBlogResults();
    });
  });

  // View Mode Buttons (Grid vs List)
  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');

  if (gridBtn && listBtn) {
    gridBtn.onclick = () => {
      if (state.blog.viewMode === 'grid') return;
      state.blog.viewMode = 'grid';
      localStorage.setItem('adasa_view_mode', 'grid');
      gridBtn.className = 'w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all bg-orange-500 text-white';
      listBtn.className = 'w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all text-neutral-400 hover:text-white';
      updateBlogResults();
    };

    listBtn.onclick = () => {
      if (state.blog.viewMode === 'list') return;
      state.blog.viewMode = 'list';
      localStorage.setItem('adasa_view_mode', 'list');
      listBtn.className = 'w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all bg-orange-500 text-white';
      gridBtn.className = 'w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all text-neutral-400 hover:text-white';
      updateBlogResults();
    };
  }
}

function updateBlogResults() {
  const displayContainer = document.getElementById('posts-display-container');
  const paginationContainer = document.getElementById('pagination-container');
  const countContainer = document.getElementById('results-count-container');
  if (!displayContainer) return;

  const q = state.blog.searchQuery.toLowerCase();
  const selectedCat = state.blog.selectedCategory;

  // Filter posts
  const filtered = state.posts.filter(p => {
    const matchCat = (selectedCat === 'all' || p.category.toLowerCase() === selectedCat.toLowerCase());
    const matchSearch = !q || (
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      p.author.name.toLowerCase().includes(q)
    );
    return matchCat && matchSearch;
  });

  // Update count indicator
  if (countContainer) {
    const catLabel = selectedCat !== 'all' ? ` في قسم <strong class="text-white">${selectedCat}</strong>` : '';
    const searchLabel = q ? ` للبحث "<strong class="text-white">${q}</strong>"` : '';
    countContainer.innerHTML = `عرض <strong class="text-white font-bold">${filtered.length}</strong> ${formatArticleCount(filtered.length)}${catLabel}${searchLabel}`;
  }

  // Handle 0 results empty state
  if (filtered.length === 0) {
    displayContainer.innerHTML = `
      <div class="py-20 text-center bg-[#161616] rounded-3xl border border-[#262626] p-8 max-w-lg mx-auto">
        <div class="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
          <i class="fa-solid fa-camera-rotate text-3xl text-orange-500"></i>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">لا توجد مقالات مطابقة</h3>
        <p class="text-neutral-400 text-sm mb-6 leading-relaxed">
          لم نتمكن من العثور على أي مقالات تطابق بحثك. جرّب كلمات مختلفة أو قم بإعادة تعيين الفلاتر.
        </p>
        <button id="reset-filters-btn" class="btn-primary text-sm py-2.5 px-6">
          إعادة تعيين الفلاتر
        </button>
      </div>
    `;
    if (paginationContainer) paginationContainer.innerHTML = '';

    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        state.blog.searchQuery = '';
        state.blog.selectedCategory = 'all';
        state.blog.currentPage = 1;
        renderBlog('all');
      };
    }
    return;
  }

  // Pagination calculation: 6 posts per page
  const perPage = state.blog.postsPerPage; // 6
  const totalPages = Math.ceil(filtered.length / perPage);
  if (state.blog.currentPage > totalPages) {
    state.blog.currentPage = totalPages;
  }
  const startIndex = (state.blog.currentPage - 1) * perPage;
  const currentPosts = filtered.slice(startIndex, startIndex + perPage);

  // Render cards based on viewMode
  if (state.blog.viewMode === 'list') {
    displayContainer.innerHTML = `
      <div class="flex flex-col space-y-6">
        ${currentPosts.map((post, idx) => renderPostCard(post, { viewMode: 'list', index: idx })).join('')}
      </div>
    `;
  } else {
    displayContainer.innerHTML = `
      <div class="blog-posts-grid">
        ${currentPosts.map((post, idx) => renderPostCard(post, { viewMode: 'grid', index: idx })).join('')}
      </div>
    `;
  }

  // Render Pagination Controls
  renderPagination(paginationContainer, totalPages);
}

function renderPagination(container, totalPages) {
  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  const cur = state.blog.currentPage;
  let pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (cur <= 4) {
    pages = [1, 2, 3, 4, 5, '...', totalPages];
  } else if (cur >= totalPages - 3) {
    pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [1, '...', cur - 1, cur, cur + 1, '...', totalPages];
  }

  container.innerHTML = `
    <nav class="flex flex-col items-center justify-center gap-3 py-4" aria-label="التنقل بين صفحات المقالات">
      <div class="flex items-center justify-center gap-2" style="direction:rtl">
        <button id="pag-prev" aria-label="الصفحة السابقة" class="w-10 h-10 rounded-xl text-sm flex items-center justify-center border border-[#262626] transition-all ${cur === 1 ? 'opacity-40 cursor-not-allowed text-neutral-500 bg-[#111111]' : 'text-neutral-300 bg-[#161616] hover:border-orange-500/50'}" ${cur === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>
        ${pages.map(p => p === '...'
          ? `<span class="w-6 text-center text-sm text-neutral-500">…</span>`
          : `<button data-page="${p}" class="pag-num-btn w-10 h-10 rounded-xl text-sm font-medium flex items-center justify-center transition-all ${p === cur ? 'bg-orange-500 text-white' : 'bg-[#161616] text-neutral-400 border border-[#262626] hover:text-white hover:border-orange-500/50'}">${p}</button>`).join('')}
        <button id="pag-next" aria-label="الصفحة التالية" class="w-10 h-10 rounded-xl text-sm flex items-center justify-center border border-[#262626] transition-all ${cur === totalPages ? 'opacity-40 cursor-not-allowed text-neutral-500 bg-[#111111]' : 'text-neutral-300 bg-[#161616] hover:border-orange-500/50'}" ${cur === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>
      </div>
      <span class="text-xs text-neutral-500">صفحة ${cur} من ${totalPages}</span>
    </nav>
  `;

  const scrollToBlog = () => {
    const el = document.getElementById('blog-main-container');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const prevBtn = document.getElementById('pag-prev');
  if (prevBtn && cur > 1) prevBtn.onclick = () => { state.blog.currentPage--; updateBlogResults(); scrollToBlog(); };
  const nextBtn = document.getElementById('pag-next');
  if (nextBtn && cur < totalPages) nextBtn.onclick = () => { state.blog.currentPage++; updateBlogResults(); scrollToBlog(); };
  document.querySelectorAll('.pag-num-btn').forEach(btn => {
    btn.onclick = () => {
      const targetPage = parseInt(btn.getAttribute('data-page'), 10);
      if (targetPage && targetPage !== cur) { state.blog.currentPage = targetPage; updateBlogResults(); scrollToBlog(); }
    };
  });
}

// ==========================================
// Page 3: Blog Details Page
// ==========================================
function renderBlogDetails(slug) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const post = state.posts.find(p => p.slug === slug);
  if (!post) {
    renderNotFound();
    return;
  }

  const formattedDate = formatDate(post.date);

  // Parse markdown headings (## Heading) for Table of Contents
  const lines = post.content.split('\n\n');
  const tocSections = [];
  lines.forEach((line, idx) => {
    if (line.startsWith('## ')) {
      tocSections.push({
        id: `section-${tocSections.length}`,
        title: line.replace('## ', '').trim()
      });
    }
  });

  // Related posts (3 in same category, excluding current post)
  let related = state.posts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);
  if (related.length < 3) {
    const others = state.posts.filter(p => p.id !== post.id && !related.find(r => r.id === p.id)).slice(0, 3 - related.length);
    related.push(...others);
  }

  container.innerHTML = `
    <article class="bg-[#0a0a0a] min-h-screen">
      
      <!-- Cinematic Post Hero -->
      <div class="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img src="${post.image}" alt="${post.title}" class="absolute inset-0 w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent"></div>

        <!-- Breadcrumbs Navigation -->
        <div class="absolute top-8 right-8 left-8">
          <nav class="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-sm border border-white/10 text-white/80">
            <a href="#/" class="text-white/70 hover:text-white transition-colors" title="الرئيسية">
              <i class="fa-solid fa-house"></i>
            </a>
            <i class="fa-solid fa-chevron-left text-white/30 text-xs"></i>
            <a href="#/blog" class="text-white/70 hover:text-white transition-colors">المدونة</a>
            <i class="fa-solid fa-chevron-left text-white/30 text-xs"></i>
            <a href="#/blog?category=${encodeURIComponent(post.category)}" class="text-orange-400 font-medium">
              ${post.category}
            </a>
          </nav>
        </div>

        <!-- Hero Metadata & Title -->
        <div class="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div class="max-w-5xl mx-auto">
            <div class="flex flex-wrap items-center gap-3 mb-6">
              <a href="#/blog?category=${encodeURIComponent(post.category)}" class="px-4 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg">
                ${post.category}
              </a>
              <div class="flex items-center gap-4 text-white/80 text-sm">
                <span class="flex items-center gap-1.5"><i class="fa-regular fa-calendar"></i> ${formattedDate}</span>
                <span>•</span>
                <span class="flex items-center gap-1.5"><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
              </div>
            </div>

            <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
              ${post.title}
            </h1>

            <div class="flex items-center gap-4 p-3 px-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-fit">
              <img src="${post.author.avatar}" alt="${post.author.name}" class="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500/50">
              <div>
                <p class="font-bold text-white text-sm">${post.author.name}</p>
                <p class="text-xs text-white/60">${post.author.role}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Main Article Content & Sidebar -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid lg:grid-cols-[1fr_320px] gap-12">
          
          <!-- Article Body -->
          <div class="order-2 lg:order-1">
            
            <!-- Excerpt Highlight Quote -->
            <div class="p-6 md:p-8 bg-gradient-to-r from-orange-500/10 to-yellow-500/5 rounded-2xl border border-orange-500/20 mb-10">
              <p class="text-lg md:text-xl text-neutral-200 leading-relaxed italic">
                "${post.excerpt}"
              </p>
            </div>

            <!-- Formatted Content -->
            <div class="prose-custom">
              ${(() => {
                let currentSecIdx = 0;
                return lines.map(line => {
                  if (line.startsWith('## ')) {
                    const secTitle = line.replace('## ', '').trim();
                    const secId = `section-${currentSecIdx++}`;
                    return `
                      <h2 id="${secId}" class="scroll-mt-28">
                        <span class="flex items-center justify-center w-10 h-10 bg-orange-500/10 rounded-xl border border-orange-500/30 text-orange-500 shrink-0">
                          <i class="fa-solid fa-camera"></i>
                        </span>
                        <span>${secTitle}</span>
                      </h2>
                    `;
                  } else {
                    return `<p>${line.replace(/\n/g, '<br/>')}</p>`;
                  }
                }).join('');
              })()}
            </div>

            <!-- Tags Section -->
            ${post.tags && post.tags.length > 0 ? `
              <div class="mt-14 p-6 bg-[#161616] rounded-2xl border border-[#262626]">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/30 text-orange-500">
                    <i class="fa-solid fa-tags"></i>
                  </div>
                  <h3 class="font-bold text-white text-lg">الوسوم</h3>
                </div>
                <div class="flex flex-wrap gap-2">
                  ${post.tags.map(t => `
                    <a href="#/blog?category=all" class="px-4 py-2 bg-[#1a1a1a] text-neutral-300 text-sm rounded-full border border-[#262626] hover:border-orange-500/50 hover:text-orange-500 transition-colors">
                      # ${t}
                    </a>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Social Share Bar -->
            <div class="mt-6 p-6 bg-[#161616] rounded-2xl border border-[#262626] flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/30 text-orange-500">
                  <i class="fa-solid fa-share-nodes"></i>
                </div>
                <h3 class="font-bold text-white text-lg">شارك المقال</h3>
              </div>
              <div class="flex items-center gap-2">
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener" class="w-11 h-11 bg-[#1a1a1a] border border-[#262626] rounded-xl flex items-center justify-center text-neutral-400 hover:bg-[#1da1f2] hover:text-white transition-all duration-300" title="مشاركة على X">
                  <i class="fa-brands fa-x-twitter"></i>
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener" class="w-11 h-11 bg-[#1a1a1a] border border-[#262626] rounded-xl flex items-center justify-center text-neutral-400 hover:bg-[#0077b5] hover:text-white transition-all duration-300" title="مشاركة على LinkedIn">
                  <i class="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}" target="_blank" rel="noopener" class="w-11 h-11 bg-[#1a1a1a] border border-[#262626] rounded-xl flex items-center justify-center text-neutral-400 hover:bg-[#25d366] hover:text-white transition-all duration-300" title="مشاركة على WhatsApp">
                  <i class="fa-brands fa-whatsapp"></i>
                </a>
                <button id="copy-link-btn" class="w-11 h-11 bg-[#1a1a1a] border border-[#262626] rounded-xl flex items-center justify-center text-neutral-400 hover:bg-orange-500 hover:text-white transition-all duration-300" title="نسخ الرابط">
                  <i class="fa-solid fa-link"></i>
                </button>
              </div>
            </div>

            <!-- Author Bio Card -->
            <div class="mt-6 p-8 bg-gradient-to-br from-[#161616] to-[#111111] rounded-2xl border border-[#262626]">
              <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img src="${post.author.avatar}" alt="${post.author.name}" class="w-20 h-20 rounded-2xl object-cover ring-4 ring-orange-500/20 shrink-0">
                <div class="text-center sm:text-right flex-1">
                  <span class="text-xs text-orange-500 font-semibold uppercase tracking-wider">كاتب المقال</span>
                  <h3 class="text-xl font-bold text-white mt-1 mb-1">${post.author.name}</h3>
                  <p class="text-neutral-400 text-sm mb-3">${post.author.role}</p>
                  <p class="text-neutral-400 text-sm leading-relaxed">
                    مصور محترف شغوف بمشاركة المعرفة والخبرات والتقنيات العملية في عالم التصوير الفوتوغرافي لتمكين الجيل القادم من المبدعين.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <!-- Sticky Sidebar -->
          <aside class="order-1 lg:order-2">
            <div class="lg:sticky lg:top-24 space-y-6">
              
              <!-- Table of Contents -->
              ${tocSections.length > 0 ? `
                <div class="p-6 bg-[#161616] rounded-2xl border border-[#262626]">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/30 text-orange-500">
                      <i class="fa-solid fa-list-ul"></i>
                    </div>
                    <h3 class="font-bold text-white text-base">محتويات المقال</h3>
                  </div>
                  <nav class="space-y-2">
                    ${tocSections.map((sec, i) => `
                      <a href="#${sec.id}" class="toc-link flex items-center gap-3 p-2.5 rounded-xl text-neutral-400 hover:text-orange-500 hover:bg-orange-500/10 text-sm transition-all duration-300">
                        <span class="w-6 h-6 rounded-lg bg-[#222] text-xs font-semibold flex items-center justify-center text-neutral-400 shrink-0">
                          ${i + 1}
                        </span>
                        <span class="truncate">${sec.title}</span>
                      </a>
                    `).join('')}
                  </nav>
                </div>
              ` : ''}

              <!-- Article Stats Card -->
              <div class="p-6 bg-[#161616] rounded-2xl border border-[#262626]">
                <h4 class="font-bold text-white text-sm mb-4">معلومات المقال</h4>
                <div class="space-y-3 text-sm">
                  <div class="flex items-center justify-between text-neutral-400 py-1.5 border-b border-[#262626]/50">
                    <span>التصنيف</span>
                    <span class="text-white font-medium">${post.category}</span>
                  </div>
                  <div class="flex items-center justify-between text-neutral-400 py-1.5 border-b border-[#262626]/50">
                    <span>وقت القراءة</span>
                    <span class="text-white font-medium">${post.readTime}</span>
                  </div>
                  <div class="flex items-center justify-between text-neutral-400 py-1.5">
                    <span>تاريخ النشر</span>
                    <span class="text-white font-medium">${formattedDate}</span>
                  </div>
                </div>
              </div>

              <!-- Back to Blog CTA -->
              <div class="p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/5 rounded-2xl border border-orange-500/20 text-center">
                <i class="fa-solid fa-book-open text-2xl text-orange-500 mb-3 block"></i>
                <h4 class="font-bold text-white text-base mb-1">المزيد من المقالات</h4>
                <p class="text-xs text-neutral-400 mb-4">اكتشف دروساً وتقنيات أخرى لتطوير مهاراتك</p>
                <a href="#/blog" class="btn-primary w-full text-xs py-2.5">
                  تصفح المدونة
                </a>
              </div>

            </div>
          </aside>

        </div>

        <!-- Related Posts Section -->
        ${related.length > 0 ? `
          <div class="mt-20 pt-16 border-t border-[#262626]">
            <div class="flex items-center justify-between mb-8">
              <div>
                <span class="section-label mb-2">مقترحات</span>
                <h3 class="text-2xl md:text-3xl font-bold text-white">مقالات ذات صلة</h3>
              </div>
              <a href="#/blog" class="text-sm text-orange-500 hover:text-orange-400 font-semibold inline-flex items-center gap-1">
                عرض الكل <i class="fa-solid fa-arrow-left text-xs"></i>
              </a>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${related.map(p => renderPostCard(p, { viewMode: 'grid' })).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    </article>
  `;

  // Copy link interaction
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('تم نسخ رابط المقال إلى الحافظة بنجاح!', 'success');
      }).catch(() => {
        showToast('تم نسخ الرابط!', 'success');
      });
    };
  }

  // Smooth scroll for TOC links
  document.querySelectorAll('.toc-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==========================================
// Page 4: 404 Page (Not Found)
// ==========================================
function renderNotFound() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div class="min-h-[85vh] flex items-center justify-center bg-[#0a0a0a] px-4 py-20 relative overflow-hidden text-center">
      <!-- Background Grid & Glowing Aura -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.5)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative max-w-xl mx-auto z-10">
        
        <!-- Big Animated 404 Badge -->
        <div class="relative inline-block mb-8">
          <div class="text-8xl md:text-9xl font-black gradient-text tracking-tighter select-none">
            404
          </div>
          <div class="absolute -top-2 -right-3 w-5 h-5 bg-orange-500 rounded-full animate-bounce"></div>
          <div class="absolute -bottom-1 -left-3 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
        </div>

        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
          عفواً! الصفحة غير موجودة
        </h2>

        <p class="text-neutral-400 mb-8 text-base md:text-lg leading-relaxed max-w-md mx-auto">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نعيدك إلى المسار الصحيح.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <a href="#/" class="btn-primary inline-flex items-center justify-center gap-2 text-base py-3.5 px-8">
            <i class="fa-solid fa-house"></i>
            <span>الذهاب للرئيسية</span>
          </a>
          <a href="#/blog" class="btn-secondary inline-flex items-center justify-center gap-2 text-base py-3.5 px-8">
            <i class="fa-solid fa-book-open"></i>
            <span>تصفح المقالات</span>
          </a>
        </div>

        <!-- Helpful Links -->
        <div class="pt-8 border-t border-[#262626]">
          <p class="text-sm text-neutral-500 mb-4">قد تجد هذه الروابط مفيدة:</p>
          <div class="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <a href="#/blog" class="text-orange-500 hover:text-orange-400 hover:underline">المدونة</a>
            <span class="text-neutral-600">•</span>
            <a href="#/about" class="text-orange-500 hover:text-orange-400 hover:underline">من نحن</a>
            <span class="text-neutral-600">•</span>
            <a href="#/privacy" class="text-orange-500 hover:text-orange-400 hover:underline">الخصوصية</a>
          </div>
        </div>

      </div>
    </div>
  `;
}

// ==========================================
// Page 5: About Page
// ==========================================
function renderAbout() {
  const container = document.getElementById('main-content');
  if (!container) return;

  // The writers shown here are taken from the authors already used by the articles.
  const writers = [...new Map(state.posts.map(post => [post.author.name, post.author])).values()];
  const stats = [
    { value: '+2مليون', label: 'قارئ شهرياً', icon: 'fa-solid fa-users' },
    { value: '+500', label: 'مقالة منشورة', icon: 'fa-solid fa-newspaper' },
    { value: '+50', label: 'كاتب خبير', icon: 'fa-solid fa-pen-nib' },
    { value: '+15', label: 'تصنيف', icon: 'fa-solid fa-book-open' }
  ];
  const values = [
    { icon: 'fa-solid fa-bullseye', title: 'الجودة أولاً', description: 'محتوى مدروس ومكتوب بخبرة', color: 'from-orange-500 to-yellow-500' },
    { icon: 'fa-solid fa-bolt', title: 'تركيز عملي', description: 'أمثلة واقعية يمكنك تطبيقها اليوم', color: 'from-orange-600 to-orange-400' },
    { icon: 'fa-solid fa-handshake', title: 'المجتمع', description: 'تعلم مع آلاف المصورين', color: 'from-orange-500 to-yellow-500' },
    { icon: 'fa-solid fa-arrows-rotate', title: 'دائماً محدث', description: 'أحدث الاتجاهات وأفضل الممارسات', color: 'from-orange-600 to-orange-400' }
  ];

  container.innerHTML = `
    <div class="bg-[#0a0a0a]">
      <section class="relative py-24 overflow-hidden border-b border-[#262626]">
        <div class="absolute inset-0 bg-[#0a0a0a]"></div>
        <div class="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.5)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div class="absolute inset-0 opacity-30 pointer-events-none">
          <div class="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px]"></div>
          <div class="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]"></div>
        </div>
        <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span class="section-label inline-flex items-center gap-2 mb-6"><span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>من نحن</span>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">مهمتنا هي <span class="gradient-text">الإعلام والإلهام</span></h1>
          <p class="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-12">${state.siteInfo.description} نحن شغوفون بمشاركة المعرفة ومساعدة المصورين على تنمية مهاراتهم من خلال محتوى عالي الجودة.</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            ${stats.map(item => `<div class="glass-card p-6"><i class="${item.icon} text-2xl text-orange-500 mb-2 block"></i><div class="text-3xl font-bold gradient-text mb-1">${item.value}</div><div class="text-sm text-neutral-500">${item.label}</div></div>`).join('')}
          </div>
        </div>
      </section>

      <section class="py-20 bg-[#111111] border-y border-[#262626]">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3"><span class="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full"></span>قيمنا<span class="w-1.5 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></span></h2>
            <p class="text-lg text-neutral-400 max-w-2xl mx-auto">المبادئ التي توجه كل ما نقوم بإنشائه</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${values.map(item => `<div class="group p-6 bg-[#161616] rounded-2xl border border-[#262626] hover:border-orange-500/30 transition-all duration-300 text-center relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div><div class="relative"><i class="${item.icon} text-4xl text-orange-500 mb-4 block"></i><h3 class="text-lg font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">${item.title}</h3><p class="text-neutral-400 text-sm">${item.description}</p></div></div>`).join('')}
          </div>
        </div>
      </section>

      <section class="py-20 bg-[#0a0a0a]">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="section-label mb-4">فريقنا</span>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">تعرف على كتابنا</h2>
            <p class="text-lg text-neutral-400 max-w-2xl mx-auto">فريقنا من المصورين والكتاب ذوي الخبرة شغوفون بمشاركة معرفتهم مع المجتمع.</p>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            ${writers.map(person => `<div class="group bg-[#161616] rounded-2xl p-6 text-center border border-[#262626] hover:border-orange-500/30 transition-all duration-300"><div class="relative inline-block mb-4"><img src="${person.avatar}" alt="${person.name}" class="w-24 h-24 rounded-full object-cover ring-4 ring-[#262626] group-hover:ring-orange-500/30 transition-all"><div class="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-[#161616] flex items-center justify-center"><i class="fa-solid fa-check text-white text-xs"></i></div></div><h3 class="font-bold text-white text-lg">${person.name}</h3><p class="text-orange-500 text-sm font-medium mb-4">${person.role}</p><div class="flex justify-center gap-3"><a href="#" aria-label="X" class="w-9 h-9 bg-[#262626] rounded-lg flex items-center justify-center text-neutral-500 hover:bg-orange-500 hover:text-white transition-colors"><i class="fa-brands fa-x-twitter"></i></a><a href="#" aria-label="GitHub" class="w-9 h-9 bg-[#262626] rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-700 hover:text-white transition-colors"><i class="fa-brands fa-github"></i></a><a href="#" aria-label="LinkedIn" class="w-9 h-9 bg-[#262626] rounded-lg flex items-center justify-center text-neutral-500 hover:bg-blue-600 hover:text-white transition-colors"><i class="fa-brands fa-linkedin-in"></i></a></div></div>`).join('')}
          </div>
        </div>
      </section>

      <section class="py-20 bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 relative overflow-hidden">
        <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">لديك أسئلة؟ دعنا نتحدث!</h2>
          <p class="text-lg text-white/80 mb-8 max-w-2xl mx-auto">نحب أن نسمع منك. سواء كان لديك سؤال حول محتوانا، أو تريد المساهمة، أو تريد فقط إلقاء التحية، لا تتردد في التواصل.</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4"><a href="mailto:${state.siteInfo.email}" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0a0a0a] text-white font-semibold rounded-xl hover:bg-neutral-900 transition-all duration-300">تواصل معنا</a><a href="#/blog" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition-all duration-300">تصفح المقالات</a></div>
        </div>
      </section>
    </div>
  `;
}

// ==========================================
// Pages: Privacy & Terms
// ==========================================
function renderPrivacy() {
  const container = document.getElementById('main-content');
  if (!container) return;
  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-16">
      <h1 class="text-3xl font-bold text-white mb-6">سياسة الخصوصية</h1>
      <div class="p-8 bg-[#161616] rounded-2xl border border-[#262626] space-y-4 text-neutral-300 leading-relaxed text-sm">
        <p>نحن في عدسة نلتزم بحماية خصوصيتك وبياناتك الشخصية. يتم استخدام أي بريد إلكتروني تقدمه للاشتراك في نشرتنا البريدية فقط لإرسال التحديثات والمقالات المفيدة.</p>
        <p>لا نقوم بمشاركة أو بيع بياناتك لأي أطراف ثالثة. يمكنك إلغاء اشتراكك في أي وقت بنقرة واحدة.</p>
      </div>
    </div>
  `;
}

function renderTerms() {
  const container = document.getElementById('main-content');
  if (!container) return;
  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-16">
      <h1 class="text-3xl font-bold text-white mb-6">شروط الخدمة</h1>
      <div class="p-8 bg-[#161616] rounded-2xl border border-[#262626] space-y-4 text-neutral-300 leading-relaxed text-sm">
        <p>جميع المقالات والصور والنصوص المعروضة على مدونة عدسة محمية بموجب حقوق النشر. يمكنك مشاركة الروابط مع ذكر المصدر الأصلي.</p>
        <p>الاستخدام غير المصرح به للمحتوى دون إذن خطي مسبق يعد انتهاكاً لحقوق الملكية الفكرية.</p>
      </div>
    </div>
  `;
}

// ==========================================
// SPA Router
// ==========================================
const Router = {
  navigate(route) {
    if (window.location.hash !== '#' + route) {
      window.location.hash = '#' + route;
    } else {
      Router.handleRoute();
    }
  },

  handleRoute() {
    let hash = window.location.hash || '#/';
    if (!hash.startsWith('#/')) {
      hash = '#/';
    }

    // Strip hash prefix
    const pathWithQuery = hash.slice(1); // e.g. "/blog?category=إضاءة" or "/blog/mastering-golden-hour"
    const [path, queryString] = pathWithQuery.split('?');
    const queryParams = new URLSearchParams(queryString || '');

    state.currentRoute = path;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update Navbar and Footer active states
    renderNavbar();
    renderFooter();

    // Route matching
    if (path === '/' || path === '') {
      renderHome();
    } else if (path === '/blog') {
      const cat = queryParams.get('category');
      renderBlog(cat || undefined);
    } else if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '').trim();
      if (slug) {
        renderBlogDetails(slug);
      } else {
        renderBlog();
      }
    } else if (path === '/about') {
      renderAbout();
    } else if (path === '/privacy') {
      renderPrivacy();
    } else if (path === '/terms') {
      renderTerms();
    } else if (path === '/404') {
      renderNotFound();
    } else {
      // Invalid route -> 404
      renderNotFound();
    }
  }
};

window.AdasaLegacy = { state, initData, renderNavbar, renderFooter, renderHome, renderBlog, renderBlogDetails, renderNotFound, renderAbout, renderPrivacy, renderTerms };