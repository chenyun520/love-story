
class BookViewer {
    constructor(data, containerId) {
        this.data = data;
        this.container = document.getElementById(containerId);
        this.currentPage = 0; // 0 = Cover/First Spread
        this.totalPages = this.data.length;

        // Ensure even pages for spread (add blank if needed)
        if (this.totalPages % 2 !== 0) {
            // this.data.push({ empty: true });
            // Actually, a book has Cover (Page 1) -> Spread (2-3) -> Spread (4-5)
            // Let's treat index 0 as Page 1 (Right side).
        }

        this.isMobile = window.innerWidth < 1100;
        this.init();

        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth < 1100;
            if (wasMobile !== this.isMobile) {
                this.render(); // Re-render on mode switch
            }
        });
    }

    init() {
        this.container.innerHTML = `
            <div class="book-stage">
                <div class="book-nav-btn nav-prev" id="prevBtn">←</div>
                <div class="book-wrapper" id="bookWrapper">
                    <!-- Pages injected here -->
                </div>
                <div class="book-nav-btn nav-next" id="nextBtn">→</div>
            </div>
        `;
        this.wrapper = document.getElementById('bookWrapper');

        // Bind Controls
        document.getElementById('prevBtn').addEventListener('click', () => this.prev());
        document.getElementById('nextBtn').addEventListener('click', () => this.next());

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.next();
            if (e.key === 'ArrowLeft') this.prev();
        });

        this.render();
    }

    render() {
        this.wrapper.innerHTML = '';

        // Create Pages
        // In Desktop: Page 0 is Right. Page 1 is Left (back of 0), Page 2 is Right.
        // Wait, standard model:
        // Sheet 1: Front (Pg1), Back (Pg2)
        // Sheet 2: Front (Pg3), Back (Pg4)
        // When Sheet 1 flips left, we see Pg2 (Left) and Pg3 (Right).

        // Let's simplify:
        // We render visual "Sheets".
        // Each Sheet has a Front and a Back.
        // Index i in data = Page i+1.

        // We need (Total / 2) Sheets.
        const numSheets = Math.ceil(this.data.length / 2);

        for (let i = 0; i < numSheets; i++) {
            const sheetIndex = i;
            const dataLeft = null; // Back of previous? No.
            // Data indices:
            // Sheet 0: Front = Data[0], Back = Data[1]
            // Sheet 1: Front = Data[2], Back = Data[3]

            const frontData = this.data[i * 2];
            const backData = this.data[i * 2 + 1];

            const sheet = document.createElement('div');
            sheet.className = 'book-sheet';
            sheet.style.zIndex = numSheets - i; // Stack order: 0 on top

            // Generate Content
            const frontHtml = this.generatePageHtml(frontData, (i * 2) + 1);
            const backHtml = this.generatePageHtml(backData, (i * 2) + 2);

            sheet.innerHTML = `
                <div class="sheet-side sheet-front">${frontHtml}</div>
                <div class="sheet-side sheet-back">${backHtml}</div>
            `;

            this.wrapper.appendChild(sheet);

            // Store reference
            sheet.dataset.idx = i;
        }

        this.updateFlipState();
    }

    generatePageHtml(item, pageNum) {
        if (!item) return '<div class="page-content empty-page"></div>';

        let html = `
            <div class="page-content">
                <div class="comic-header">
                    <span class="comic-date">${item.date || ''}</span>
                    <span class="comic-title-sm">${item.title || ''}</span>
                </div>
                <div class="comic-body">
        `;

        if (item.content) {
            item.content.forEach(c => {
                if (c.type === 'image') {
                    html += `
                        <div class="comic-panel-img">
                            <img src="${c.src}" loading="lazy" class="img-sketch" onerror="this.src='image/gallery_02.jpg'">
                        </div>
                    `;
                } else {
                    const isShepherd = c.type === 'shepherd';
                    html += `
                        <div class="chat-row ${isShepherd ? 'row-right' : 'row-left'}">
                            <div class="chat-avatar ${isShepherd ? 'avi-shepherd' : 'avi-sheep'}">${isShepherd ? '☁️' : '🐑'}</div>
                            <div class="chat-bubble ${isShepherd ? 'bubble-shepherd' : 'bubble-sheep'}">
                                ${c.text}
                            </div>
                        </div>
                    `;
                }
            });
        }

        html += `
                </div>
                <div class="page-footer">${pageNum}</div>
            </div>
        `;
        return html;
    }

    updateFlipState() {
        const sheets = document.querySelectorAll('.book-sheet');
        sheets.forEach((sheet, i) => {
            // If current page index (in terms of sheets) > i, it means this sheet is flipped
            // currentSheet is the index of the sheet that is currently "Open" on the right?
            // Let's say currentSheet = 0. Sheet 0 is on Right (Front visible).
            // Next -> Flip Sheet 0. currentSheet becomes 1. Sheet 0 is on Left (Back visible), Sheet 1 is on Right.

            if (i < this.currentSheet) {
                sheet.classList.add('flipped');
                sheet.style.zIndex = i; // Reorder z-index for left stack
            } else {
                sheet.classList.remove('flipped');
                sheet.style.zIndex = (sheets.length - i);
            }
        });
    }

    get currentSheet() {
        return Math.floor(this.currentPage / 2);
    }

    next() {
        if (this.currentPage < this.data.length) {
            this.currentPage += 2;
            this.updateFlipState();
        }
    }

    prev() {
        if (this.currentPage > 0) {
            this.currentPage -= 2;
            this.updateFlipState();
        }
    }
}
