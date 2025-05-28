const url = 'https://www.unifucamp.edu.br/wp-content/uploads/2020/09/Livros-gra%CC%81tis.pdf'; // Substitua pelo caminho do seu PDF

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,  // Ajuste a escala conforme necessário
    canvas = document.querySelector('#pdf-canvas'),
    ctx = canvas.getContext('2d');

// Renderiza a página
const renderPage = num => {
    pageIsRendering = true;

    // Obtém a página
    pdfDoc.getPage(num).then(page => {
        // Define o viewport
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        // Renderiza a página no canvas
        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        // Atualiza o número da página
        document.querySelector('#page-num').textContent = `Página: ${num}`;
    });
};

// Verifica se há páginas sendo renderizadas
const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
};

// Mostra a página anterior
const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
};

// Mostra a próxima página
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
};

// Obtém os elementos do DOM
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);

// Carrega o documento
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    renderPage(pageNum);
});