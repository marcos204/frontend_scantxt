document.addEventListener('DOMContentLoaded', function () {
    const copyButton = document.getElementById('btn-copy');
    const selectButton = document.getElementById('btn-select');
    const textToCopyElement = document.getElementById('text-converted');
    const spinner = document.getElementById('spinner');

    // Função para copiar o texto
    copyButton.addEventListener('click', function () {
        const textToCopy = textToCopyElement.textContent;
        if (textToCopy.trim() === "") {
            alert('Nenhum texto para copiar.');
            return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Texto copiado para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar o texto: ', err);
            alert('Erro ao copiar o texto. Tente novamente.');
        });
    });

    // Função para enviar a imagem ao backend
    selectButton.addEventListener('click', function () {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.onchange = function (event) {
            const file = event.target.files[0];
            if (!file) {
                alert('Nenhum arquivo selecionado.');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            // Mostra o spinner enquanto processa a imagem
            spinner.style.display = 'block';
            textToCopyElement.textContent = 'Processando...';

            fetch('https://scantxt-backend.onrender.com/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao processar a imagem.');
                    }
                    return response.json();
                })
                .then(data => {
                    textToCopyElement.textContent = data.text || 'Nenhum texto encontrado na imagem.';
                })
                .catch(error => {
                    console.error('Erro ao processar a imagem:', error);
                    textToCopyElement.textContent = 'Erro ao processar a imagem. Tente novamente.';
                })
                .finally(() => {
                    spinner.style.display = 'none'; // Esconde o spinner
                });
        };

        fileInput.click();
    });
});