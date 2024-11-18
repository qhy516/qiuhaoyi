document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelector('.slides');
    const slideItems = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentSlide = 0;
    const totalSlides = slideItems.length;

    // 自动轮播定时器
    let slideInterval = setInterval(nextSlide, 5000);

    // 下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlidePosition();
    }

    // 上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlidePosition();
    }

    // 更新幻灯片位置
    function updateSlidePosition() {
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // 添加按钮点击事件
    prevBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

    nextBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

    // 鼠标悬停时暂停自动轮播
    slides.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slides.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));

    // 获取弹窗元素
    const modal = document.getElementById('workModal');
    const closeBtn = document.querySelector('.close-btn');
    
    // 为每个作品项添加点击事件
    document.querySelectorAll('.work-item').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const img = this.querySelector('img').src;
            const description = this.dataset.description;
            const techStack = this.dataset.tech.split(',');
            const features = this.dataset.features.split(',');
            
            // 填充弹窗内容
            modal.querySelector('.modal-title').textContent = title;
            modal.querySelector('.modal-img').src = img;
            modal.querySelector('.project-description').textContent = description;
            
            // 填充技术栈
            const techList = modal.querySelector('.tech-stack');
            techList.innerHTML = techStack.map(tech => `<li>${tech.trim()}</li>`).join('');
            
            // 填充功能列表
            const featureList = modal.querySelector('.features');
            featureList.innerHTML = features.map(feature => `<li>${feature.trim()}</li>`).join('');
            
            // 显示弹窗
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    });
    
    // 关闭弹窗
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // 点击弹窗外部关闭
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 在现有代码后添加返回顶部按钮功能
    const backToTopButton = document.getElementById('backToTop');

    // 显示/隐藏返回顶部按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // 点击返回顶部
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 分页和搜索功能
    const worksPerPage = 8;
    const allWorkItems = document.querySelectorAll('.work-item');
    const totalWorks = allWorkItems.length;
    const totalPages = Math.ceil(totalWorks / worksPerPage);
    const paginationContainer = document.querySelector('.pagination');
    const searchInput = document.getElementById('searchWorks');
    const searchBtn = document.getElementById('searchBtn');
    
    // 执行搜索的函数
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const worksGrid = document.querySelector('.works-grid');
        
        if (searchTerm === '') {
            // 如果搜索框为空，恢复分页显示并返回第一页
            paginationContainer.style.display = 'flex';
            
            // 移除可能存在的无结果提示
            const noResult = document.querySelector('.no-result');
            if (noResult) {
                noResult.remove();
            }
            
            // 重置所有作品的样式
            allWorkItems.forEach(item => {
                item.removeAttribute('style');
            });
            
            showPage(1);
            
            // 重置分页按钮状态
            document.querySelectorAll('.page-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.page === '1') {
                    btn.classList.add('active');
                }
            });

            // 重置网格布局
            worksGrid.style.display = 'grid';
            worksGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
            worksGrid.style.gap = '1.2rem';
            worksGrid.style.alignItems = 'start';

            // 滚动到作品区域
            document.getElementById('works').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // 有搜索内容时，隐藏分页
            paginationContainer.style.display = 'none';
            
            // 显示所有匹配的作品
            let hasResults = false;
            allWorkItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    hasResults = true;
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });

            // 处理无搜索结果的情况
            const existingNoResult = document.querySelector('.no-result');
            if (!hasResults) {
                if (!existingNoResult) {
                    const noResultDiv = document.createElement('div');
                    noResultDiv.className = 'no-result';
                    noResultDiv.innerHTML = `
                        <div class="no-result-content">
                            <i class="no-result-icon">🔍</i>
                            <p>未找到与"${searchTerm}"相关的作品</p>
                            <button onclick="clearSearch()" class="clear-search-btn">清除搜索</button>
                        </div>
                    `;
                    worksGrid.after(noResultDiv);
                }
            } else if (existingNoResult) {
                existingNoResult.remove();
            }

            // 重置网格布局
            worksGrid.style.display = 'grid';
            worksGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
            worksGrid.style.gap = '1.2rem';
            worksGrid.style.alignItems = 'start';
        }
    }

    // 将 clearSearch 函数设置为全局函数
    window.clearSearch = function() {
        const searchInput = document.getElementById('searchWorks');
        searchInput.value = '';
        performSearch();
    }

    // 点击搜索按钮时执行搜索
    searchBtn.addEventListener('click', performSearch);

    // 按回车键时执行搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function showPage(pageNum) {
        const start = (pageNum - 1) * worksPerPage;
        const end = start + worksPerPage;
        
        // 先隐藏所有作品
        allWorkItems.forEach(item => {
            item.style.display = 'none';
        });

        // 显示当前页的作品
        for (let i = start; i < end && i < totalWorks; i++) {
            allWorkItems[i].style.display = 'block';
            allWorkItems[i].style.width = '100%';
            allWorkItems[i].style.height = 'auto';
        }

        // 重置网格布局
        const worksGrid = document.querySelector('.works-grid');
        worksGrid.style.display = 'grid';
        worksGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
        worksGrid.style.gap = '1.2rem';
        worksGrid.style.alignItems = 'start';
    }

    // 初始化显示第一页
    showPage(1);

    // 初始化分页按钮
    initPagination();

    function initPagination() {
        paginationContainer.innerHTML = '';

        // 添加页码按钮
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.className = 'page-btn' + (i === 1 ? ' active' : '');
            button.dataset.page = i;
            button.textContent = i;
            paginationContainer.appendChild(button);
        }

        // 只有当页数大于1时才显示下一页按钮
        if (totalPages > 1) {
            const nextButton = document.createElement('button');
            nextButton.className = 'page-btn next-btn';
            nextButton.textContent = '下一页 →';
            paginationContainer.appendChild(nextButton);
        }
    }

    // 分页按钮点击事件
    paginationContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('page-btn')) {
            const pageNum = parseInt(e.target.dataset.page);
            if (!isNaN(pageNum)) {
                showPage(pageNum);
                document.querySelectorAll('.page-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                document.getElementById('works').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        
        if (e.target.classList.contains('next-btn')) {
            const currentPage = parseInt(document.querySelector('.page-btn.active').dataset.page);
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
                document.querySelectorAll('.page-btn').forEach(btn => {
                    if (parseInt(btn.dataset.page) === currentPage + 1) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                document.getElementById('works').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    // 处理所有带有 scroll-top 类的链接
    document.querySelectorAll('.scroll-top').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}); 