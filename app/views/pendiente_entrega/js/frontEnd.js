let currentTicketIdForConfirmTaller = null;
let currentNroTicketForConfirmTaller = null; // <--- NUEVA VARIABLE PARA EL NÚMERO DE TICKET
let confirmInTallerModalInstance = null;
let currentSerialPosForConfirmTaller = null; // <--- NUEVA VARIABLE PARA EL SERIAL POS
let currentTicketNroForImage = null; 
let bsPresupuestoPDFModal = null; // Instancia global del modal de presupuesto PDF
let bsPresupuestoModal = null; // Instancia global del modal de presupuesto
let bsViewModal = null; // Instancia global del modal de visualización 

const urlParamsPendienteEntrega = new URLSearchParams(window.location.search);
const targetTicketIdPendienteEntrega = urlParamsPendienteEntrega.get('id_ticket');
const targetNroTicketPendienteEntrega = urlParamsPendienteEntrega.get('nro_ticket');

document.addEventListener("DOMContentLoaded", function () {
    // --- Referencias a elementos estáticos del DOM (que siempre están presentes al cargar la página) ---
    // Modal para Subir Documento
    const modalElementUpload = document.getElementById("uploadDocumentModal");
    const cerrarBotonUpload = document.getElementById("CerrarBoton"); // Botón 'Cerrar' del modal de subida
    const iconoCerrarUpload = document.getElementById("icon-close"); // Icono 'x' del modal de subida
    const inputFile = document.getElementById("documentFile");
    const modalTicketIdSpanUpload = modalElementUpload ? modalElementUpload.querySelector("#modalTicketId") : null; // Encuentra el span dentro de su modal
    const confirmInTallerModalElement = document.getElementById("confirmInRosalModal");
    const CerramodalBtn = document.getElementById("CerrarButtonTallerRecib");


    // Modal para Visualizar Documento
    const modalElementView = document.getElementById("viewDocumentModal");
    const cerrarBotonView = document.getElementById("modalCerrarshow"); // Botón 'Cerrar' del modal de visualización
    const iconoCerrarView = document.getElementById("btn-close"); // Icono 'x' del modal de visualización
    const modalTicketIdSpanView = modalElementView ? modalElementView.querySelector("#viewModalTicketId") : null; // Encuentra el span dentro de su modal

    // Modal para Previsualizar Presupuesto PDF
    const modalElementPresupuestoPDF = document.getElementById("presupuestoPDFModal");
    const cerrarBotonPresupuestoPDF = document.getElementById("closePresupuestoPDFBtn2"); // Botón 'Cerrar' del modal de presupuesto PDF
    const iconoCerrarPresupuestoPDF = document.getElementById("closePresupuestoPDFBtn"); // Icono 'x' del modal de presupuesto PDF

    // Modal para Generar Presupuesto
    const modalElementPresupuesto = document.getElementById("presupuestoModal");
    const cerrarBotonPresupuesto = document.getElementById("closePresupuestoModalBtn"); // Botón 'Cerrar' del modal de presupuesto
    const iconoCerrarPresupuesto = modalElementPresupuesto ? modalElementPresupuesto.querySelector('.btn-close') : null; // Icono 'x' del modal de presupuesto

    // Modal para Cargar PDF del Presupuesto
    const modalElementUploadPresupuestoPDF = document.getElementById("uploadPresupuestoPDFModal");
    const cerrarBotonUploadPresupuestoPDF = document.getElementById("cerrarUploadPresupuestoPDFBtn");
    const iconoCerrarUploadPresupuestoPDF = document.getElementById("closeUploadPresupuestoPDFBtn");
    const inputPresupuestoPDFFile = document.getElementById("presupuestoPDFFile");
    const uploadPresupuestoPDFBtn = document.getElementById("uploadPresupuestoPDFBtn");
    const modalPresupuestoTicketIdSpan = modalElementUploadPresupuestoPDF ? modalElementUploadPresupuestoPDF.querySelector("#modalPresupuestoTicketId") : null;
    let bsUploadPresupuestoPDFModal = null;

    // Instancias de Modales de Bootstrap (si usas Bootstrap JS para controlarlos)
    let bsUploadModal = null;

    if (modalElementUpload) {
        bsUploadModal = new bootstrap.Modal(modalElementUpload, { keyboard: false }); // Habilita cierre con ESC
    }
    if (modalElementView) {
        bsViewModal = new bootstrap.Modal(modalElementView, { keyboard: false }); // Habilita cierre con ESC
    }
    if (modalElementUploadPresupuestoPDF) {
        bsUploadPresupuestoPDFModal = new bootstrap.Modal(modalElementUploadPresupuestoPDF, { keyboard: false });
    }
    if (modalElementPresupuestoPDF) {
        bsPresupuestoPDFModal = new bootstrap.Modal(modalElementPresupuestoPDF, { keyboard: false }); // Habilita cierre con ESC
    }
    if (modalElementPresupuesto) {
        bsPresupuestoModal = new bootstrap.Modal(modalElementPresupuesto, { keyboard: false }); // Habilita cierre con ESC
    }

    // 2. Instanciar el modal de Bootstrap una sola vez
    if (confirmInTallerModalElement) {
      confirmInTallerModalInstance = new bootstrap.Modal(
        confirmInTallerModalElement,
        {
          backdrop: "static", // Para que no se cierre al hacer clic fuera
        }
      );
    }

    if (CerramodalBtn && confirmInTallerModalInstance) {
      CerramodalBtn.addEventListener("click", function () {
        if (confirmInTallerModalInstance) {
          confirmInTallerModalInstance.hide();
        }
      });
    }

    // Variable para almacenar el ID del ticket
    let currentTicketId = null;

    // Función para mostrar el modal de subida
function showUploadModal(ticketId, nroTicket) {
        currentTicketId = nroTicket; // Guarda el ID del ticket

        if (modalTicketIdSpanUpload) {
            modalTicketIdSpanUpload.textContent = currentTicketId;
        }

        // Aquí puedes cargar la imagen previa, etc.
        if (inputFile) {
            inputFile.value = ""; // Limpiar el input de archivo al abrir
            const imagePreview = document.getElementById("imagePreview");
            if (imagePreview) {
                imagePreview.src = "#";
                imagePreview.style.display = "none";
            }
        }

        if (bsUploadModal) {
            bsUploadModal.show(); // Usa el método de Bootstrap para mostrar el modal
        } else {
            console.error("Error: Instancia de Bootstrap Modal para 'uploadDocumentModal' no creada.");
            // Si no usas Bootstrap JS, aquí iría tu lógica manual de mostrarModal
            modalElementUpload.style.display = "block";
            setTimeout(() => {
                modalElementUpload.classList.add("show");
            }, 10);
            let backdrop = document.querySelector(".manual-modal-backdrop");
            if (!backdrop) {
                backdrop = document.createElement("div");
                backdrop.classList.add("manual-modal-backdrop", "fade");
                document.body.appendChild(backdrop);
            }
            setTimeout(() => {
                backdrop.classList.add("show");
            }, 10);
            document.body.classList.add("modal-open");
            modalElementUpload.setAttribute("aria-hidden", "false");
        }
}

// Función para abrir el modal de carga de PDF del presupuesto
function openUploadPresupuestoPDFModal(nroTicket, serialPos) {
    const modalPresupuestoTicketIdSpanLocal = document.getElementById("modalPresupuestoTicketId");
    if (modalPresupuestoTicketIdSpanLocal) {
        modalPresupuestoTicketIdSpanLocal.textContent = nroTicket;
    }
    
    // Establecer valores en los campos ocultos
    const uploadPresupuestoNroTicket = document.getElementById("uploadPresupuestoNroTicket");
    const uploadPresupuestoNroTicketHidden = document.getElementById("uploadPresupuestoNroTicketHidden");
    const uploadPresupuestoSerialPosHidden = document.getElementById("uploadPresupuestoSerialPosHidden");
    
    if (uploadPresupuestoNroTicket) {
        uploadPresupuestoNroTicket.textContent = nroTicket;
    }
    if (uploadPresupuestoNroTicketHidden) {
        uploadPresupuestoNroTicketHidden.value = nroTicket;
    }
    if (uploadPresupuestoSerialPosHidden) {
        uploadPresupuestoSerialPosHidden.value = serialPos || '';
    }
    
    // Limpiar el input de archivo y clases de validación
    const inputPresupuestoPDFFileLocal = document.getElementById("presupuestoPDFFile");
    if (inputPresupuestoPDFFileLocal) {
        inputPresupuestoPDFFileLocal.value = "";
        inputPresupuestoPDFFileLocal.classList.remove('is-invalid', 'is-valid');
    }
    
    // Ocultar mensajes de validación y mostrar el texto informativo
    setTimeout(function() {
        const formatInfo = document.getElementById('presupuestoPDFFileFormatInfo');
        const input = document.getElementById("presupuestoPDFFile");
        
        // Ocultar mensajes de feedback
        const validFeedback = input && input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
        const invalidFeedback = input && input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
        
        if (validFeedback) {
            validFeedback.style.setProperty("display", "none", "important");
            validFeedback.style.setProperty("visibility", "hidden", "important");
            validFeedback.style.setProperty("opacity", "0", "important");
            validFeedback.style.setProperty("height", "0", "important");
            validFeedback.style.setProperty("margin", "0", "important");
            validFeedback.style.setProperty("padding", "0", "important");
        }
        if (invalidFeedback) {
            invalidFeedback.style.setProperty("display", "none", "important");
            invalidFeedback.style.setProperty("visibility", "hidden", "important");
            invalidFeedback.style.setProperty("opacity", "0", "important");
            invalidFeedback.style.setProperty("height", "0", "important");
            invalidFeedback.style.setProperty("margin", "0", "important");
            invalidFeedback.style.setProperty("padding", "0", "important");
        }
        
        // MOSTRAR el mensaje informativo "Formato permitido: PDF" cuando no hay validación
        if (formatInfo) {
            formatInfo.style.removeProperty("display");
            formatInfo.style.removeProperty("visibility");
            formatInfo.style.removeProperty("opacity");
            formatInfo.style.removeProperty("height");
            formatInfo.style.removeProperty("margin");
            formatInfo.style.removeProperty("padding");
        }
        if (typeof $ !== 'undefined') {
            if (validFeedback) $(validFeedback).hide();
            if (invalidFeedback) $(invalidFeedback).hide();
            $('#presupuestoPDFFileFormatInfo').show();
        }
    }, 100);
    
    // Deshabilitar el botón de subir
    const uploadPresupuestoPDFBtnLocal = document.getElementById("uploadPresupuestoPDFBtn");
    if (uploadPresupuestoPDFBtnLocal) {
        uploadPresupuestoPDFBtnLocal.disabled = true;
    }
    
    // Mostrar el modal
    if (bsUploadPresupuestoPDFModal) {
        bsUploadPresupuestoPDFModal.show();
    } else {
        console.error("Error: Instancia de Bootstrap Modal para 'uploadPresupuestoPDFModal' no creada.");
        }
}

// Función para mostrar el modal de visualización
window.showViewModal = function showViewModal(ticketId, nroTicket, imageUrl, pdfUrl, documentName, hasPresupuesto, presupuestoPath) {
    const modalElementView = document.getElementById("viewDocumentModal");
    
    // Inicializar bsViewModal si no está inicializado
    if (!bsViewModal && modalElementView) {
        bsViewModal = new bootstrap.Modal(modalElementView, { keyboard: false });
    }
    
    if (!modalElementView) {
        console.error("Error: Modal 'viewDocumentModal' no encontrado.");
        return;
    }
    
    const modalTicketIdSpanView = modalElementView.querySelector("#viewModalTicketId");
    const documentSelectionContainer = document.getElementById("documentSelectionContainer");
    const documentViewArea = document.getElementById("documentViewArea");
    const radioEnvioDestino = document.getElementById("radioEnvioDestino");
    const radioPresupuesto = document.getElementById("radioPresupuesto");
    const labelEnvioDestino = radioEnvioDestino ? radioEnvioDestino.nextElementSibling : null;
    const labelPresupuesto = radioPresupuesto ? radioPresupuesto.nextElementSibling : null;
    const btnVisualizarDocumento = document.getElementById("btnVisualizarDocumento");
    const btnVolverSeleccion = document.getElementById("btnVolverSeleccion");
    const imageViewPreview = document.getElementById("imageViewPreview");
    const pdfViewViewer = document.getElementById("pdfViewViewer");
    const messageContainer = document.getElementById("viewDocumentMessage");
    const nombreDocumento = document.getElementById("NombreDocumento");
    const BotonCerrarModal = document.getElementById("modalCerrarshow");

    // Verificar si ya hay un modal abierto y cerrarlo primero
    if (bsViewModal && bsViewModal._isShown) {
        bsViewModal.hide();
        // Esperar a que se cierre completamente antes de continuar
        setTimeout(() => {
            openViewModal();
        }, 300);
        return;
    }

        // Función para limpiar la ruta del archivo
        function cleanFilePath(filePath) {
            if (!filePath) return null;

            // Reemplazar barras invertidas con barras normales
            let cleanPath = filePath.replace(/\\/g, '/');

        // Extraer la parte después de 'Documentos_SoportePost/' o 'uploads/'
            const pathSegments = cleanPath.split('Documentos_SoportePost/');
            if (pathSegments.length > 1) {
                cleanPath = pathSegments[1];
        } else {
            // Si no tiene Documentos_SoportePost/, intentar con uploads/
            const uploadsSegments = cleanPath.split('uploads/');
            if (uploadsSegments.length > 1) {
                cleanPath = 'uploads/' + uploadsSegments[1];
            }
            }

          // Construir la URL completa
          return `http://${HOST}/Documentos/${cleanPath}`;
        }

    // Función para mostrar un documento
    function displayDocument(filePath, fileName, isImage) {
        // Ocultar selección y mostrar área de visualización
        documentSelectionContainer.style.display = "none";
        documentViewArea.style.display = "block";
        // Ocultar botón de visualizar cuando se muestra el documento
        if (btnVisualizarDocumento) btnVisualizarDocumento.style.display = "none";

        // Limpiar vistas anteriores
        imageViewPreview.style.display = "none";
        pdfViewViewer.style.display = "none";
        messageContainer.textContent = "";
        messageContainer.classList.add("hidden");

        if (!filePath) {
            messageContainer.textContent = "No hay documento disponible.";
            messageContainer.classList.remove("hidden");
            nombreDocumento.textContent = "";
            return;
        }

        const fullUrl = cleanFilePath(filePath);
        nombreDocumento.textContent = fileName || "Documento";

        if (isImage) {
            imageViewPreview.src = fullUrl;
            imageViewPreview.style.display = "block";
        } else {
            pdfViewViewer.innerHTML = `<iframe src="${fullUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
            pdfViewViewer.style.display = "block";
        }
    }

    function openViewModal() {
        currentTicketId = ticketId;
        currentNroTicket = nroTicket;
        modalTicketIdSpanView.textContent = currentNroTicket;

        // Determinar qué documentos están disponibles
        const hasEnvio = (imageUrl || pdfUrl);
        const hasPresupuestoDoc = hasPresupuesto && presupuestoPath;

        // Guardar las rutas y nombres de los documentos para uso posterior
        window.currentEnvioImageUrl = imageUrl;
        window.currentEnvioPdfUrl = pdfUrl;
        window.currentEnvioDocumentName = documentName;
        window.currentPresupuestoPath = presupuestoPath;
        window.currentHasEnvio = hasEnvio;
        window.currentHasPresupuesto = hasPresupuestoDoc;

        // Mostrar/ocultar radio buttons según los documentos disponibles
        if (hasEnvio && labelEnvioDestino && radioEnvioDestino) {
            radioEnvioDestino.parentElement.style.display = "block";
        } else if (radioEnvioDestino) {
            radioEnvioDestino.parentElement.style.display = "none";
        }

        if (hasPresupuestoDoc && labelPresupuesto && radioPresupuesto) {
            radioPresupuesto.parentElement.style.display = "block";
        } else if (radioPresupuesto) {
            radioPresupuesto.parentElement.style.display = "none";
        }

        // Siempre mostrar la selección primero si hay al menos un documento
        if (hasEnvio || hasPresupuestoDoc) {
            // Hay al menos un documento, mostrar selección
            documentSelectionContainer.style.display = "block";
            documentViewArea.style.display = "none";
            // Mostrar botón de visualizar en el footer
            if (btnVisualizarDocumento) {
                btnVisualizarDocumento.style.display = "block";
            }
            // Desmarcar todos los radios
            if (radioEnvioDestino) radioEnvioDestino.checked = false;
            if (radioPresupuesto) radioPresupuesto.checked = false;
            
            // Si solo hay un documento, marcarlo automáticamente
            if (hasEnvio && !hasPresupuestoDoc && radioEnvioDestino) {
                radioEnvioDestino.checked = true;
            } else if (!hasEnvio && hasPresupuestoDoc && radioPresupuesto) {
                radioPresupuesto.checked = true;
            }
        } else {
            // No hay documentos
            documentSelectionContainer.style.display = "none";
            documentViewArea.style.display = "block";
            // Ocultar botón de visualizar
            if (btnVisualizarDocumento) btnVisualizarDocumento.style.display = "none";
            messageContainer.textContent = "No hay documentos disponibles para este ticket.";
            messageContainer.classList.remove("hidden");
            nombreDocumento.textContent = "";
        }

        // Event listener para el botón "Visualizar Documento"
        if (btnVisualizarDocumento) {
            btnVisualizarDocumento.onclick = function() {
                const selectedRadio = document.querySelector('input[name="documentTypeView"]:checked');
                if (!selectedRadio) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Selección requerida',
                        text: 'Por favor seleccione un tipo de documento para visualizar.',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#003594',
                        color: 'black',
                    });
                    return;
                }

                const documentType = selectedRadio.value;
                if (documentType === 'Envio_Destino' && window.currentHasEnvio) {
                    const isImage = !!window.currentEnvioImageUrl;
                    displayDocument(
                        window.currentEnvioImageUrl || window.currentEnvioPdfUrl,
                        window.currentEnvioDocumentName || "Documento de Envío",
                        isImage
                    );
                } else if (documentType === 'Presupuesto' && window.currentHasPresupuesto) {
                    displayDocument(window.currentPresupuestoPath, "Presupuesto.pdf", false);
                }
            };
        }

        // Event listener para el botón "Volver a Selección"
        if (btnVolverSeleccion) {
            btnVolverSeleccion.onclick = function() {
                documentSelectionContainer.style.display = "block";
                documentViewArea.style.display = "none";
                // Mostrar botón de visualizar cuando se vuelve a la selección
                if (btnVisualizarDocumento) {
                    btnVisualizarDocumento.style.display = "block";
                }
            };
        }

        // Event listener para el botón de cerrar - Limpiar listeners anteriores
        if (BotonCerrarModal) {
            // Remover listeners anteriores para evitar duplicados
            BotonCerrarModal.removeEventListener('click', closeViewModalHandler);
            // Agregar el nuevo listener
            BotonCerrarModal.addEventListener('click', function() {
                const documentSelectionContainer = document.getElementById("documentSelectionContainer");
                const documentViewArea = document.getElementById("documentViewArea");
                
                // Si estamos viendo un documento, ocultar el modal y mostrar la selección
                if (documentViewArea && documentViewArea.style.display !== "none" && 
                    documentSelectionContainer && documentSelectionContainer.style.display === "none") {
                    // Ocultar el modal de visualización
                    if (bsViewModal) {
                        bsViewModal.hide();
                    }
                    
                    // Limpiar el contenido del documento
                    const imageViewPreview = document.getElementById("imageViewPreview");
                    const pdfViewViewer = document.getElementById("pdfViewViewer");
                    const messageContainer = document.getElementById("viewDocumentMessage");
                    
                    if (imageViewPreview) {
                        imageViewPreview.src = "#";
                        imageViewPreview.style.display = "none";
                    }
                    if (pdfViewViewer) {
                        pdfViewViewer.innerHTML = "";
                        pdfViewViewer.style.display = "none";
                    }
                    if (messageContainer) {
                        messageContainer.classList.add("hidden");
                        messageContainer.textContent = "";
                    }
                    
                    // Mostrar nuevamente el modal de selección
                    setTimeout(() => {
                        if (bsViewModal) {
                            bsViewModal.show();
                        }
                        // Asegurar que la selección esté visible
                        if (documentSelectionContainer) {
                            documentSelectionContainer.style.display = "block";
                        }
                        if (documentViewArea) {
                            documentViewArea.style.display = "none";
                        }
                        // Mostrar botón de visualizar
                        if (btnVisualizarDocumento) {
                            btnVisualizarDocumento.style.display = "block";
                        }
                    }, 300);
                } else {
                    // Si estamos en la selección, cerrar el modal completamente
                    closeViewModalAndClean();
                }
            });
        }

        // Mostrar el modal
        bsViewModal.show();
    }

    // Si no hay modal abierto, abrir directamente
    if (!bsViewModal || !bsViewModal._isShown) {
        openViewModal();
    }
}

// Función para cerrar el modal de subida
function closeUploadModalAndClean() {
        if (bsUploadModal) {
            bsUploadModal.hide(); // Usa el método de Bootstrap para ocultar el modal
        } else {
            // Lógica manual si no usas Bootstrap JS
            if (!modalElementUpload) return;
            modalElementUpload.classList.remove("show");
            setTimeout(() => {
                modalElementUpload.style.display = "none";
                modalElementUpload.setAttribute("aria-hidden", "true");
                document.body.classList.remove("modal-open");
                const backdrop = document.querySelector(".manual-modal-backdrop");
                if (backdrop) {
                    backdrop.classList.remove("show");
                    setTimeout(() => {
                        backdrop.remove();
                    }, 150);
                }
            }, 150);
        }
        if (inputFile) {
            inputFile.value = "";
            const imagePreview = document.getElementById("imagePreview");
            if (imagePreview) {
                imagePreview.src = "#";
                imagePreview.style.display = "none";
            }
        }
        currentTicketId = null; // Restablecer el ID del ticket
}

    // Función para cerrar el modal de visualización
    function closeViewModalAndClean() {
        if (bsViewModal) {
            bsViewModal.hide(); // Usa el método de Bootstrap para ocultar el modal
        }
        
        // Limpiar contenido después de un pequeño delay para evitar parpadeos
        setTimeout(() => {
            const imageViewPreview = document.getElementById("imageViewPreview");
            const pdfViewViewer = document.getElementById("pdfViewViewer");
            const messageContainer = document.getElementById("viewDocumentMessage");
            
            if (imageViewPreview) {
                imageViewPreview.src = "#";
                imageViewPreview.style.display = "none";
            }
            if (pdfViewViewer) {
                pdfViewViewer.innerHTML = "";
                pdfViewViewer.style.display = "none";
            }
            if (messageContainer) {
                messageContainer.classList.add("hidden");
            }
            
            // Restablecer variables globales
            currentTicketId = null;
            currentNroTicket = null;
        }, 500);
    }

    // Función handler para el botón de cerrar
    function closeViewModalHandler() {
        closeViewModalAndClean();
    }

    // Función para cerrar el modal de presupuesto PDF
    function closePresupuestoPDFModalAndClean() {
        if (bsPresupuestoPDFModal) {
            bsPresupuestoPDFModal.hide(); // Usa el método de Bootstrap para ocultar el modal
        }
    }

    // Función para cerrar el modal de presupuesto
    function closePresupuestoModalAndClean() {
        if (bsPresupuestoModal) {
            bsPresupuestoModal.hide(); // Usa el método de Bootstrap para ocultar el modal
        }
        
        // Limpiar colores de las columnas de diferencia
        const diferenciaUSD = document.getElementById('presupuestoDiferenciaUSD');
        const diferenciaBS = document.getElementById('presupuestoDiferenciaBS');
        
        if (diferenciaUSD) {
            diferenciaUSD.classList.remove('bg-danger', 'bg-success', 'text-white');
        }
        if (diferenciaBS) {
            diferenciaBS.classList.remove('bg-danger', 'bg-success', 'text-white');
        }
    }

    // --- Event Listeners para elementos estáticos del DOM (cierres de modales, etc.) ---
    if (cerrarBotonUpload) {
        cerrarBotonUpload.addEventListener("click", closeUploadModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'CerrarBoton' no encontrado para el modal de subida.");
    }

    if (iconoCerrarUpload) {
        iconoCerrarUpload.addEventListener("click", closeUploadModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'icon-close' no encontrado para el modal de subida.");
    }

    if (cerrarBotonView) {
        cerrarBotonView.addEventListener("click", closeViewModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'modalCerrarshow' no encontrado para el modal de visualización.");
    }

    if (iconoCerrarView) {
        iconoCerrarView.addEventListener("click", closeViewModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'btn-close' no encontrado para el modal de visualización.");
    }

    if (cerrarBotonPresupuestoPDF) {
        cerrarBotonPresupuestoPDF.addEventListener("click", closePresupuestoPDFModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'closePresupuestoPDFBtn2' no encontrado para el modal de presupuesto PDF.");
    }

    if (iconoCerrarPresupuestoPDF) {
        iconoCerrarPresupuestoPDF.addEventListener("click", closePresupuestoPDFModalAndClean);
    } else {
        console.warn("Advertencia: Elemento con ID 'closePresupuestoPDFBtn' no encontrado para el modal de presupuesto PDF.");
    }

    if (cerrarBotonPresupuesto) {
        cerrarBotonPresupuesto.addEventListener("click", closePresupuestoModalAndClean);
    } else {
        console.warn("Advertencia: Botón de cerrar no encontrado para el modal de presupuesto.");
    }

    if (iconoCerrarPresupuesto) {
        iconoCerrarPresupuesto.addEventListener("click", closePresupuestoModalAndClean);
    } else {
        console.warn("Advertencia: Icono de cerrar no encontrado para el modal de presupuesto.");
    }

    // Event listener para limpiar colores cuando el modal se cierre completamente
    if (modalElementPresupuesto) {
        modalElementPresupuesto.addEventListener('hidden.bs.modal', function() {
            // Limpiar colores de las columnas de diferencia
            const diferenciaUSD = document.getElementById('presupuestoDiferenciaUSD');
            const diferenciaBS = document.getElementById('presupuestoDiferenciaBS');
            
            if (diferenciaUSD) {
                diferenciaUSD.classList.remove('bg-danger', 'bg-success', 'text-white');
            }
            if (diferenciaBS) {
                diferenciaBS.classList.remove('bg-danger', 'bg-success', 'text-white');
            }
        });
    }

    // --- Delegación de eventos para botones generados dinámicamente ---
    // Este listener escuchará clics en todo el documento
    document.addEventListener("click", function (event) {
        // Delegación para el botón "Subir Documento" (openModalButton)
        const openUploadBtn = event.target.closest("#openModalButton");
        if (openUploadBtn) {
            event.preventDefault(); // Previene el comportamiento por defecto del botón
            const idTicket = openUploadBtn.dataset.idTicket;
            const nroTicket = openUploadBtn.dataset.nroTicket; // Asegúrate de que este atributo exista en tu botón dinámico
            showUploadModal(idTicket, nroTicket); // Llama a la función para mostrar el modal de subida
            return; // Detiene la ejecución para no procesar otros botones
        }

        // Delegación para el botón "Cargar PDF Presupuesto"
        const uploadPresupuestoPDFBtn = event.target.closest(".upload-presupuesto-pdf-btn");
        if (uploadPresupuestoPDFBtn) {
            event.preventDefault();
            const nroTicket = uploadPresupuestoPDFBtn.dataset.nroTicket;
            const serialPos = uploadPresupuestoPDFBtn.dataset.serialPos;
            
            // Abrir el modal directamente con el nro_ticket y serial_pos (no necesitamos id_budget)
            openUploadPresupuestoPDFModal(nroTicket, serialPos);
            return;
        }


        // Delegación para el botón "Ver Imagen" (o similar, con ID 'viewimage')
        // Asume que el botón de ver imagen tiene un ID 'viewimage' y un data-url-document
        const openViewBtn = event.target.closest("#viewimage"); // O la clase CSS que uses
        if (openViewBtn) {
            event.preventDefault();
            const idTicket = openViewBtn.dataset.idTicket;
            const nroTicket = openViewBtn.dataset.nroTicket; // Asegúrate de que este atributo exista en tu botón dinámico
            const documentUrl = openViewBtn.dataset.urlDocument; // Asegúrate de que este atributo exista en tu botón dinámico
            const documentType = openViewBtn.dataset.documentType; // 'image' o 'pdf'
            const fileName = openViewBtn.dataset.filename; // AGREGAR ESTA LÍNEA

            if (documentType === 'image') {
                if (typeof window.showViewModal === 'function') {
                    window.showViewModal(idTicket, nroTicket, documentUrl, null, fileName, false, ''); // PASAR fileName AQUÍ
                } else {
                    console.error('showViewModal no está definida');
                }
            } else if (documentType === 'pdf') {
                if (typeof window.showViewModal === 'function') {
                    window.showViewModal(idTicket, nroTicket, null, documentUrl, fileName, false, ''); // PASAR fileName AQUÍ
                } else {
                    console.error('showViewModal no está definida');
                }
            } else {
                console.warn("Tipo de documento no especificado para la visualización.");
                if (typeof window.showViewModal === 'function') {
                    window.showViewModal(idTicket, nroTicket, null, null, fileName, false, ''); // Abre el modal sin contenido
                } else {
                    console.error('showViewModal no está definida');
                }
            }
            return;
        }

        // Delegación para el botón "Generar Presupuesto"
        const generatePresupuestoBtn = event.target.closest(".generate-presupuesto-btn");
        if (generatePresupuestoBtn) {
            event.preventDefault();
            const nroTicket = generatePresupuestoBtn.dataset.nroTicket;
            const serialPos = generatePresupuestoBtn.dataset.serialPos || '';
            const idFailure = generatePresupuestoBtn.dataset.idFailure ? parseInt(generatePresupuestoBtn.dataset.idFailure) : null;
            if (nroTicket) {
                // Guardar el serial en una variable global para usarlo después
                window.currentSerialPosForAnticipo = serialPos;
                // Abrir el modal de presupuesto
                openPresupuestoModal(nroTicket, idFailure);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener el número de ticket.'
                });
            }
            return;
        }

        // Cierre del modal al hacer clic fuera de él (en el backdrop)
        // Solo si estás usando tu lógica manual de backdrop. Bootstrap maneja esto automáticamente.
        // Si usas Bootstrap, puedes eliminar esta sección.
        const backdrop = document.querySelector(".manual-modal-backdrop");
        if (backdrop && event.target === backdrop) {
            if (modalElementUpload && modalElementUpload.classList.contains("show")) {
                closeUploadModalAndClean();
            }
            if (modalElementView && modalElementView.classList.contains("show")) {
                closeViewModalAndClean();
            }
        }
    });

    // --- Manejo del input de archivo para previsualización ---
    // Event listener para el input de archivo del presupuesto PDF
    if (inputPresupuestoPDFFile) {
        inputPresupuestoPDFFile.addEventListener('change', function() {
            const file = this.files[0];
            const uploadBtn = document.getElementById('uploadPresupuestoPDFBtn');
            
            if (file) {
                // Validar que sea PDF
                if (file.type !== 'application/pdf') {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                    if (uploadBtn) uploadBtn.disabled = true;
                    return;
                }
                
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
                if (uploadBtn) uploadBtn.disabled = false;
            } else {
                this.classList.remove('is-valid', 'is-invalid');
                if (uploadBtn) uploadBtn.disabled = true;
            }
        });
    }
    
    // Event listeners para cerrar el modal de carga de PDF del presupuesto
    if (cerrarBotonUploadPresupuestoPDF) {
        cerrarBotonUploadPresupuestoPDF.addEventListener('click', function() {
            if (bsUploadPresupuestoPDFModal) {
                bsUploadPresupuestoPDFModal.hide();
            }
        });
    }
    
    if (iconoCerrarUploadPresupuestoPDF) {
        iconoCerrarUploadPresupuestoPDF.addEventListener('click', function() {
            if (bsUploadPresupuestoPDFModal) {
                bsUploadPresupuestoPDFModal.hide();
            }
        });
    }

    if (inputFile) {
        inputFile.addEventListener('change', function() {
            const imagePreview = document.getElementById("imagePreview");
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = "#";
                imagePreview.style.display = "none";
            }
        });
    }
});

// Función para verificar si un ticket tiene componentes asociados usando XMLHttpRequest
function checkTicketComponents(ticketId, serialPos, regionName) {
    const xhr = new XMLHttpRequest();
    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/HasComponents`;
    
    xhr.open("POST", apiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const validationResponse = JSON.parse(xhr.responseText);
                if (validationResponse.success && validationResponse.hasComponents) {
                    // Si el ticket ya tiene componentes, muestra el modal de selección
                    showSelectComponentsModal(ticketId, regionName, serialPos);
                } else {
                    // Si NO tiene componentes, muestra la advertencia
                    const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-exclamation-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>`;
                    Swal.fire({
                        html: `<div class="custom-modal-body-content">
                                    <div class="mb-4">
                                        ${customWarningSvg}
                                    </div>
                                    <p class="h4 mb-3" style="color: black;">El POS con serial: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> no tiene componentes cargados.</p>
                                    <p class="h5" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; font-size: 80%; color: #007bff;">¿Desea enviar a la región sin componentes?</p>
                                </div>`,
                        showCancelButton: true,
                        confirmButtonText: "Enviar",
                        cancelButtonText: "Cancelar",
                        confirmButtonColor: "#003594",
                        focusConfirm: false,
                        allowOutsideClick: false,
                    }).then((warningResult) => {
                        if (warningResult.isConfirmed) {
                            sendToRegionWithoutComponent(ticketId, serialPos);
                          } else if (warningResult.dismiss === Swal.DismissReason.cancel) {
                            // Si presiona "Seleccionar Componentes", abre el modal de componentes
                            showSelectComponentsModal(ticketId, regionName, serialPos);
                        }
                    });
                }
            } catch (e) {
                console.error('Error al parsear la respuesta JSON del servidor:', e);
                Swal.fire('Error de Validación', 'Respuesta del servidor inválida. Intente de nuevo.', 'error');
            }
        } else {
            console.error('Error en la solicitud AJAX:', xhr.status, xhr.statusText);
            Swal.fire('Error de Validación', 'No se pudo verificar si el ticket tiene componentes. Intente de nuevo.', 'error');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red al intentar verificar los componentes.');
        Swal.fire('Error de red', 'No se pudo conectar con el servidor para la validación.', 'error');
    };

    // Corregimos el nombre del parámetro de 'id_ticket' a 'ticketId' para que coincida con el backend
    const dataToSend = `action=HasComponents&ticketId=${ticketId}`;
    xhr.send(dataToSend);
}

function getTicketDataFinaljs() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${ENDPOINT_BASE}${APP_PATH}api/reportes/GetTicketDataFinal`);
  const detailsPanel = document.getElementById("ticket-details-panel");

  const tableElement = document.getElementById("tabla-ticket");
  const theadElement = tableElement ? tableElement.getElementsByTagName("thead")[0] : null;
  const tbodyElement = tableElement ? tableElement.getElementsByTagName("tbody")[0] : null;
  const tableContainer = document.querySelector(".table-responsive");

  // Define column titles strictly based on your SQL function's output
  const columnTitles = {
    //id_ticket: "ID Ticket",
    nro_ticket: "Nro Ticket",
    full_name_tecnico1: "Técnico Gestión", // CORREGIDO
   // create_ticket: "Fecha Creación",
    serial_pos: "Serial POS",
    rif: "Rif",
    name_failure: "Falla",
    // id_level_failure: "Nivel Falla", // ELIMINADO
    full_name_coord: "Coordinador", // CORREGIDO
    fecha_envio_coordinador: "Fecha Envío Coordinador", // ELIMINADO
    fecha_envio_a_taller: "Fecha Envío a Taller",
    name_status_ticket: "Estatus Ticket",
    //name_process_ticket: "Proceso Ticket",
    name_status_payment: "Estatus Pago",
    name_status_lab: "Estatus Taller", // CORREGIDO
    name_accion_ticket: "Acción Ticket",
    full_name_tecnico2: "Técnico 2", // CORREGIDO
    fecha_assignado_al_tecnico2: "Fecha Asignado al Técnico 2", // ELIMINADO
    envio_a_taller: "Fecha Envío a Taller", // ELIMINADO
    status_taller: "Estatus Taller", // ELIMINADO
    name_status_domiciliacion: "Estatus Domiciliación", // CORREGIDO
    date_send_torosal_fromlab: "Fecha Envío Torosal Lab", // CORREGIDO
    fecha_llaves_enviada: "Fecha de Llaves Enviadas", // CORREGIDO
    fecha_carga_llaves: "Fecha Carga Llaves", // CORREGIDO
    date_receivefrom_desti: "Fecha Envío a Destino", // CORREGIDO
    confirmreceive: "Confirmar Recibido", // AÑADIDO
    //fecha_instalacion: "Fecha Instalación", // Añadido
    //estatus_inteliservices: "Estatus Inteliservices", // Añadido
  };

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          const TicketData = response.ticket;
          currentTicketNroForImage = TicketData[0].nro_ticket;

            // MOSTRAR EL ESTADO DEL PRIMER TICKET (o el más reciente)
            if (TicketData && TicketData.length > 0) {
              const firstTicket = TicketData[0];
              showTicketStatusIndicator(firstTicket.name_status_ticket, firstTicket.name_accion_ticket);
            } else {
              hideTicketStatusIndicator();
            }

          if (TicketData && TicketData.length > 0) {
            // Destroy DataTables if it's already initialized on this table
            if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
              $("#tabla-ticket").DataTable().destroy();
              if (theadElement) theadElement.innerHTML = ""; // Clear old headers
              if (tbodyElement) tbodyElement.innerHTML = ""; // Clear old body
            }

            const allDataKeys = Object.keys(TicketData[0] || {});
            const columnsConfig = [];

            columnsConfig.push({
                            title: "N°",
                            orderable: false,
                            searchable: false,
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            },
                        });

            for (const key in columnTitles) {
              if (allDataKeys.includes(key)) {
                const isVisible = TicketData.some((item) => {
                  const value = item[key];
                  return (
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
                  );
                });

                const columnDef = {
                  data: key,
                  title: columnTitles[key],
                  defaultContent: "",
                  visible: isVisible,
                };

                const displayLengthForTruncate = 25; // Define la longitud a la que truncar el texto

                // ************* APLICAR LÓGICA DE TRUNCADO A FALLA *************
                if (key === "name_failure") {
                  columnDef.render = function (data, type, row) {
                    if (type === "display" || type === "filter") {
                      const fullText = String(data || "").trim();
                      if (fullText.length > displayLengthForTruncate) {
                        return `<span class="truncated-cell" data-full-text="${fullText}">${fullText.substring(
                         0,
                         displayLengthForTruncate
                        )
                      }...</span>`;
                     }
                     return fullText;
                    }
                    return data;
                  };
                }                   
                // ************* FIN: APLICAR LÓGICA DE TRUNCADO A FALLA *************

                // ************* APLICAR LÓGICA DE TRUNCADO A STATUS_PAYMENTS *************
                if (key === "name_status_payment") {
                  const displayLength = 25;
                  columnDef.render = function (data, type, row) {
                    const fullText = String(data || "").trim();
                    if (fullText.length > displayLength) {
                      return `<span class="truncated-cell" data-full-text="${fullText}">${fullText.substring(0, displayLength)}...</span>`;
                    } else {
                      return `<span class="full-text-cell" data-full-text="${fullText}">${fullText}</span>`;
                    }
                  };
                }
                // ************* FIN: APLICAR LÓGICA DE TRUNCADO A STATUS_PAYMENTS *************
                columnsConfig.push(columnDef);
              }
            }

          columnsConfig.push({
                  data: null,
                  title: "Acción",
                  orderable: false,
                  searchable: false,
                  className: "dt-body-center",
                  render: function (data, type, row) {
                      const idTicket = row.id_ticket;
                      const serialPos = row.serial_pos;
                      const nroTicket = row.nro_ticket;
                      const currentStatusLab = (row.status_taller || "").trim();
                      const name_accion_ticket = (row.name_accion_ticket || "").trim();
                      const name_status_domiciliacion = (row.name_status_domiciliacion || "").trim();
                      const nombre_estado_cliente = (row.nombre_estado_cliente || "").trim();
                      
                      const hasEnvioDestinoDocument = row.document_types_available && row.document_types_available.includes('Envio_Destino');
                      const isDocumentMissing = !hasEnvioDestinoDocument || hasEnvioDestinoDocument === null || hasEnvioDestinoDocument === '';

                      // Información de budgets y status del ticket para validar el botón de presupuesto
                      const hasBudget = row.has_budget === true || row.has_budget === 't' || row.has_budget === 1 || 
                                       (row.id_budget && row.id_budget !== null && row.id_budget !== '') ||
                                       (row.pdf_path_presupuesto && row.pdf_path_presupuesto.trim() !== '');
                      const idStatusTicket = row.id_status_ticket ? parseInt(row.id_status_ticket) : null;
                      const isEnProceso = idStatusTicket === 2;

                      let actionButton = '';

                      // Prioridad 1: Validar si el ticket está en espera de ser recibido en el Rosal
                      if (name_accion_ticket === "En espera de confirmar recibido en el Rosal") {
                          actionButton = `<button type="button" class="btn btn-warning btn-sm received-ticket-btn" title = "Marcar Como Recibido En el rosal"
                                              data-id-ticket="${idTicket}"
                                              data-serial-pos="${serialPos}"
                                              data-nro-ticket="${nroTicket}" id = "marcarrecibido">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>
                                          </button>`;
                      }
                      // Prioridad 2: Validar si el ticket es de Caracas o Miranda y está Reparado
                      else if ((currentStatusLab === "Reparado") && (nombre_estado_cliente === "Caracas" || nombre_estado_cliente === "Miranda" || nombre_estado_cliente === "Distrito Capital" || nombre_estado_cliente === "Vargas")) {
                          actionButton = `<button type="button" class="btn btn-primary btn-sm deliver-ticket-btn" title = "Entregar al Cliente"
                                              data-id-ticket="${idTicket}"
                                              data-serial-pos="${serialPos}"
                                              data-nro-ticket="${nroTicket}">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
                                                <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
                                              </svg>
                                          </button>`;
                      }else if((currentStatusLab === "Reparado" || currentStatusLab === "") && (nombre_estado_cliente === "Caracas" || nombre_estado_cliente === "Miranda" || nombre_estado_cliente === "Distrito Capital" || nombre_estado_cliente === "Vargas") && (name_accion_ticket == "En espera de Confirmar Devolución")){
                         actionButton = `<button type="button" class="btn btn-primary btn-sm deliver-ticket-bt" title = "Entregar al Cliente"
                                              data-id-ticket="${idTicket}"
                                              data-serial-pos="${serialPos}"
                                              data-nro-ticket="${nroTicket}">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
                                                <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
                                              </svg>
                                            </button>`;

                      }
                      else {
                          const commonConditions = ((currentStatusLab === "Reparado" || currentStatusLab === "" || currentStatusLab === "Gestión Comercial (Irreparable)") && !(nombre_estado_cliente === "Caracas" || nombre_estado_cliente === "Miranda" ||  nombre_estado_cliente === "Distrito Capital" || nombre_estado_cliente === "Vargas"));
                          
                          if (commonConditions && isDocumentMissing) {
                              actionButton = `<button type="button" id="openModalButton" class="btn btn-primary btn-sm upload-document-btn" title = "Subir Documento"
                                                  data-id-ticket="${idTicket}"
                                                  data-nro-ticket="${nroTicket}"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#uploadDocumentModal">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-arrow-up-fill" viewBox="0 0 16 16">
                                                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M7.5 6.707 6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0z"/>
                                                  </svg>
                                              </button>`;
                          }
                          // Si cumple las condiciones base y YA se subió el documento
                          else if (commonConditions && hasEnvioDestinoDocument) {
                              // Obtener el PDF del presupuesto para agregarlo como atributo data
                              const pdfPathPresupuesto = row.pdf_path_presupuesto || row.pdf_path || row.presupuesto_pdf_path || '';
                              const pdfPathEscaped = pdfPathPresupuesto ? pdfPathPresupuesto.replace(/"/g, '&quot;') : '';
                              
                              // Obtener id_failure para validar si es "Actualización de Software" (id_failure = 9) o "Sin Llaves/Dukpt Vacío" (id_failure = 12)
                              const idFailure = row.id_failure ? parseInt(row.id_failure) : null;
                              const isActualizacionSoftware = idFailure === 9;
                              const isSinLlavesDukpt = idFailure === 12;
                              const isFallaSinPago = isActualizacionSoftware || isSinLlavesDukpt;
                              
                              actionButton = `<button type="button" class="btn btn-success btn-sm send-to-region-btn" title = "Enviar a Región: ${nombre_estado_cliente}"
                                                  data-id-ticket="${idTicket}"
                                                  data-region-name="${nombre_estado_cliente || 'No tiene Asignado'}"  
                                                  data-serial-pos="${serialPos}"
                                                  data-nro-ticket="${nroTicket}"
                                                  data-pdf-presupuesto="${pdfPathEscaped}"
                                                  data-id-failure="${idFailure || ''}"
                                                  data-status-lab="${currentStatusLab || ''}"
                                                  data-is-actualizacion-software="${isFallaSinPago ? 'true' : 'false'}">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck-front-fill" viewBox="0 0 16 16">
                                                    <path d="M3.5 0A2.5 2.5 0 0 0 1 2.5v9c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2v-9A2.5 2.5 0 0 0 12.5 0zM3 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.9c0 .625-.562 1.092-1.17.994C10.925 7.747 9.208 7.5 8 7.5s-2.925.247-3.83.394A1.008 1.008 0 0 1 3 6.9zm1 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2m8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2m-5-2h2a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2"/>
                                                  </svg>
                                              </button>`;
                          }
                      }
                      
                      // Validar si debe mostrarse el botón de presupuesto
                      // El botón se muestra si:
                      // 1. NO hay datos en budgets para este nro_ticket
                      // 2. O si HAY datos en budgets Y el id_status_ticket NO es 2 ("En proceso")
                      // NO mostrar botón si: hay presupuesto Y está en proceso
                      // NO mostrar botón si: id_failure = 9 ("Actualización de Software") o id_failure = 12 ("Sin Llaves/Dukpt Vacío")
                      const idFailure = row.id_failure ? parseInt(row.id_failure) : null;
                      const isActualizacionSoftware = idFailure === 9;
                      const isSinLlavesDukpt = idFailure === 12;
                      const isFallaSinPago = isActualizacionSoftware || isSinLlavesDukpt;
                      const shouldShowPresupuestoButton = !(hasBudget && isEnProceso) && !isFallaSinPago;
                      
                      // Agregar botón de presupuesto solo si cumple las condiciones
                      let presupuestoButton = '';
                      // VERIFICACIÓN ADICIONAL: No mostrar si el estatus es "Gestión Comercial (Irreparable)"
                      const isIrreparable = (row.name_status_lab === "Gestión Comercial (Irreparable)" || row.status_taller === "Gestión Comercial (Irreparable)");

                      if (shouldShowPresupuestoButton && !isIrreparable) {

                          presupuestoButton = `<button type="button" class="btn generate-presupuesto-btn" 
                              data-id-ticket="${idTicket}"
                              data-serial-pos="${serialPos}"
                              data-nro-ticket="${nroTicket}"
                              data-id-failure="${idFailure || ''}"
                              title="Presupuesto"
                              style="background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); border: none; border-radius: 25px; padding: 8px 16px; box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3); transition: all 0.3s ease; position: relative; overflow: hidden;">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-file-earmark-text" viewBox="0 0 16 16" style="display: inline-block;">
                                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5"/>
                              </svg>
                              <span class="presupuesto-text" style="display: none; margin-left: 8px; color: white; font-weight: 600; white-space: nowrap;">Presupuesto</span>
                          </button>`;
                      }
                      
                      // Verificar si existe un PDF del presupuesto cargado
                      // Puede venir como pdf_path_presupuesto, pdf_path, o presupuesto_pdf_path
                      const pdfPath = row.pdf_path_presupuesto || row.pdf_path || row.presupuesto_pdf_path || '';
                      const hasPresupuestoPDF = pdfPath && pdfPath.trim() !== '';
                      
                      // Agregar botón para cargar PDF del presupuesto (solo si no existe)
                      // NO mostrar si es "Actualización de Software" (id_failure = 9) o "Sin Llaves/Dukpt Vacío" (id_failure = 12)
                      // TAMPOCO mostrar si es "Gestión Comercial (Irreparable)"
                      let uploadPresupuestoPDFButton = '';
                      if (!hasPresupuestoPDF && !isFallaSinPago && !isIrreparable) {
                          // Botón para cargar PDF
                          uploadPresupuestoPDFButton = `<button type="button" class="btn btn-info btn-sm upload-presupuesto-pdf-btn" title="Cargar PDF Presupuesto"
                              data-id-ticket="${idTicket}"
                              data-serial-pos="${serialPos}"
                              data-nro-ticket="${nroTicket}">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-arrow-down-fill" viewBox="0 0 16 16">
                                <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5"/>
                             </svg>
                          </button>`;
                      }
                      
                      // Combinar todos los botones en una fila horizontal
                      const allButtons = `${actionButton || ''}${presupuestoButton}${uploadPresupuestoPDFButton}`;
                      return `<div style="display: flex; align-items: center; gap: 5px; flex-direction: row; flex-wrap: nowrap;">${allButtons}</div>`;
                  },
          });

          columnsConfig.push({
                  data: null,
                  title: "Taller",
                  orderable: false,
                  searchable: false,
                  className: "dt-body-center",
                  render: function (data, type, row) {
                      const idTicket = row.id_ticket;
                      const serialPos = row.serial_pos;
                      const nroTicket = row.nro_ticket;
                      const name_accion_ticket = (row.name_accion_ticket || "").trim();
                      const reentry_lab = row.reentry_lab;
                  
                      let actionButton = '';

                      // Prioridad 1: Validar si el ticket está en espera de ser recibido en el Rosal
                      if (name_accion_ticket === "En espera de confirmar recibido en el Rosal") {
                        actionButton = `<button type="button" class="btn btn-warning btn-sm received-ticket-btn" title = "Recibido"
                          data-id-ticket="${idTicket}"
                          data-serial-pos="${serialPos}"
                          data-nro-ticket="${nroTicket}">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>
                        </button>`;
                      }else if(reentry_lab === null || reentry_lab ===  'f' || reentry_lab === ""){
                        actionButton = `<button type="button" title = "Devolver a Taller"
                          class="btn btn-warning btn-sm send-back-to-lab-btn"
                          data-id-ticket="${idTicket}"
                          data-serial-pos="${serialPos}"
                          data-nro-ticket="${nroTicket}">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16">
                            <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
                          </svg>
                        </button>`;
                      }else{
                       actionButton =  `<button type="button"
                          class="btn btn-warning btn-sm send-back-to-lab-btn"
                          data-id-ticket="${idTicket}"
                          data-serial-pos="${serialPos}"
                          data-nro-ticket="${nroTicket}" disabled>
                          Ya has devuelto este ticket 1 vez
                        </button>`;
                      }
                     return actionButton;
                  },
          });

            // Añadir la columna "Llaves"
          columnsConfig.push({
                data: null,
                title: "Llaves",
                orderable: false,
                searchable: false,
                className: "dt-body-center",
                render: function (data, type, row) {
                    const idTicket = row.id_ticket;
                    const verificacionDeLlaves = row.id_status_key; // CORREGIDO: Usar confirmreceive
                    const accionllaves = row.name_accion_ticket;
                    const fechaLlavesEnviada = row.date_sendkey; // CORREGIDO: Usar date_sendkey
                    const fechaCargaLlaves = row.date_receivekey; // CORREGIDO: Usar date_receivekey
                    const recibidoRosal = row.confirmrosal;

                    // Lógica para el checkbox "Cargar Llave"
                    // shouldShowLoadKeyCheckbox ahora se basa en 'confirmreceive'
                    const shouldShowLoadKeyCheckbox = !(verificacionDeLlaves === false || verificacionDeLlaves === 'f'); // Si NO están confirmadas
                        if (shouldShowLoadKeyCheckbox && accionllaves == "Llaves Cargadas" && fechaLlavesEnviada != "NULL" && fechaCargaLlaves != "NULL") {
                            return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}"
                                    data-serial-pos="${row.serial_pos}" 
                                    title="Llaves Cargadas"
                                    checked disabled>`;
                                    
                        }else if (verificacionDeLlaves === false || verificacionDeLlaves === 'f' && accionllaves === "Llaves Cargadas" && fechaLlavesEnviada == null) {
                            return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}" 
                                    title="Llaves Cargadas En el Rosal" checked disabled>`; // Sin marcar y habilitado

                        } else if (accionllaves === "En espera de Confirmar Devolución") {

                           return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}"
                                     data-serial-pos="${row.serial_pos} 
                                    title="Es devolucion" checked disabled>`;
                        } else if(recibidoRosal === 'f' || recibidoRosal === false || recibidoRosal === '' || recibidoRosal === null){
                           return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}"
                                     data-serial-pos="${row.serial_pos} 
                                    title="Confirmar recibido" disabled>`;
                        }else{
                          return `<input type="checkbox" class="receive-key-checkbox" 
                                    data-id-ticket="${idTicket}" 
                                    data-nro-ticket="${row.nro_ticket}"
                                     data-serial-pos="${row.serial_pos} 
                                    title="Confirmar Carga De llaves">`;
                        }
                },
          });

            // Añadir la columna "Imagen"
          columnsConfig.push({
              data: null,
              title: "Vizualizar Documentos",
              orderable: false,
              searchable: false,
              width: "8%",
              render: function (data, type, row) {
                const idTicket = row.id_ticket;
                const nroTicket = row.nro_ticket;
                const hasEnvioDestinoDocument = row.document_types_available && row.document_types_available.includes('Envio_Destino');
                const url_documento = row.document_url;
                const documentType = row.document_type;
                const filename = row.original_filename;

                // Verificar si existe PDF del presupuesto
                const pdfPathPresupuesto = row.pdf_path_presupuesto || row.pdf_path || row.presupuesto_pdf_path || '';
                const hasPresupuestoPDF = pdfPathPresupuesto && pdfPathPresupuesto.trim() !== '';
                
                // Si hay al menos un documento (Envio_Destino o Presupuesto), mostrar botón
                if ((hasEnvioDestinoDocument && url_documento) || hasPresupuestoPDF) {
                  const fileExtension = url_documento ? url_documento.split('.').pop().toLowerCase() : '';
                    const isPdf = fileExtension === 'pdf';
                        
                    return `<button type="button" class="btn btn-info btn-sm view-document-btn" 
                      data-id-ticket="${idTicket}"
                      data-nro-ticket="${nroTicket}"
                      data-url-document="${url_documento || ''}"
                      data-document-type="${isPdf ? 'pdf' : 'image'}"
                      data-filename="${filename || 'Documento'}"
                      data-has-envio="${hasEnvioDestinoDocument && url_documento ? 'true' : 'false'}"
                      data-has-presupuesto="${hasPresupuestoPDF ? 'true' : 'false'}"
                      data-presupuesto-path="${pdfPathPresupuesto || ''}">
                      Ver Documento${hasEnvioDestinoDocument && hasPresupuestoPDF ? 's' : ''}
                    </button>`;
                } else {
                    return `<button type="button" class="btn btn-secondary btn-sm" title="No hay documento disponible" disabled>No hay documento disponible</button>`;
                }
             },
          });

            // Initialize DataTables
            const dataTableInstance = $(tableElement).DataTable({
              responsive: false,
              scrollX: "200px", // Considera usar true o un valor más dinámico como '100%'
              data: TicketData,
              columns: columnsConfig,
              pagingType: "simple_numbers",
              lengthMenu: [5, 10, 25, 50, 100],
              autoWidth: false,
              buttons: [
                {
                  extend: "colvis", // Column visibility button
                  text: "Mostrar/Ocultar Columnas",
                  className: "btn btn-secondary",
                },
              ],
              language: {
                lengthMenu: "Mostrar _MENU_",
                emptyTable: "No hay datos disponibles en la tabla",
                zeroRecords: "No se encontraron resultados para la búsqueda",
                info: "_TOTAL_ Registros",
                infoEmpty: "No hay datos disponibles",
                infoFiltered: " de _MAX_ Disponibles",
                search: "Buscar:",
                loadingRecords: "Cargando...",
                processing: "Procesando...",
                paginate: {
                  first: "Primero",
                  last: "Último",
                  next: "Siguiente",
                  previous: "Anterior",
                },
                buttons: {
                  colvis: "Visibilidad de Columna",
                },
              },

                  dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
                          initComplete: function (settings, json) {
                              const dataTableInstance = this.api(); // Obtén la instancia de la API de DataTables
                              const buttonsHtml = `
                                  <button id="btn-por-asignar" class="btn btn-secondary me-2" title="Pendiente por Confirmar Recibido en el Rosal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                                      <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                    </svg>
                                  </button>

                                  <button id="btn-asignados" class="btn btn-secondary me-2" title="Tickets en el Rosal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
                                      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
                                    </svg>
                                  </button>

                                  <button id="btn-recibidos" class="btn btn-secondary me-2" title="Tickets Por confirmar carga de llaves">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                                      <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                                    </svg>
                                  </button>

                                  <button id="btn-llaves-cargadas" class="btn btn-secondary me-2" title="Tickets con Llaves Cargadas">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                      </svg>
                                  </button>`;
                              $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

                              const filterConfigs = [
                                  {
                                      button: "btn-por-asignar",
                                      term: "^En espera de confirmar recibido en el Rosal$|^En espera de Confirmar Devolución$",
                                      status: "En proceso",
                                      action: ["En espera de confirmar recibido en el Rosal", "En espera de Confirmar Devolución"],
                                      adjustColumns: () => {
                                          dataTableInstance.column(17).visible(false);
                                          dataTableInstance.column(18).visible(true);
                                          dataTableInstance.column(19).visible(false);
                                          dataTableInstance.column(20).visible(true);
                                      }
                                  },
                                  {
                                      button: "btn-asignados",
                                      term: "^En el Rosal$",
                                      status: "En proceso",
                                      action: "En el Rosal",
                                      adjustColumns: () => {
                                          dataTableInstance.column(17).visible(true);
                                          dataTableInstance.column(18).visible(true);
                                          dataTableInstance.column(19).visible(true);
                                          dataTableInstance.column(20).visible(true);
                                      }
                                  },
                                  {
                                      button: "btn-recibidos",
                                      term: "En espera confirmación carga de llaves",
                                      status: "En proceso",
                                      action: "En espera confirmación carga de llaves",
                                      adjustColumns: () => {
                                          dataTableInstance.column(17).visible(false);
                                          dataTableInstance.column(18).visible(false);
                                          dataTableInstance.column(19).visible(false);
                                          dataTableInstance.column(20).visible(false);
                                      }
                                  },
                                  {
                                      button: "btn-llaves-cargadas",
                                      term: "Llaves Cargadas",
                                      status: "En proceso",
                                      action: "Llaves Cargadas",
                                      adjustColumns: () => {
                                          dataTableInstance.column(17).visible(true);
                                          dataTableInstance.column(18).visible(true);
                                          dataTableInstance.column(19).visible(true);
                                          dataTableInstance.column(20).visible(true);
                                      }
                                  }
                              ];

                              // Tu función setActiveButton es correcta.
                              function setActiveButton(activeButtonId) {
                                  $("#btn-asignados, #btn-por-asignar, #btn-recibidos, #btn-llaves-cargadas")
                                      .removeClass("btn-primary").addClass("btn-secondary");
                                  $(`#${activeButtonId}`).removeClass("btn-secondary").addClass("btn-primary");
                              }

                              // Función para verificar si hay datos en una búsqueda específica
                              function checkDataExists(searchTerm) {
                                  dataTableInstance.columns().search('').draw(false);
                                  dataTableInstance.column(10).search(searchTerm, true, false).draw();
                                  const rowCount = dataTableInstance.rows({ filter: 'applied' }).count();
                                  return rowCount > 0;
                              }

                              function applyFilterConfig(config) {
                                  if (!config) return;
                                  dataTableInstance.columns().search('').draw(false);
                                  dataTableInstance.column(10).search(config.term, true, false).draw();
                                  config.adjustColumns();
                                  setActiveButton(config.button);
                                  showTicketStatusIndicator(config.status, config.action);
                              }

                              function applyNroTicketSearch(options = {}) {
                                  const { showWarning = true, warningText } = options || {};
                                  if (!targetNroTicketPendienteEntrega) {
                                      return false;
                                  }

                                  dataTableInstance.search(targetNroTicketPendienteEntrega).draw(false);
                                  let found = false;
                                  dataTableInstance.rows({ filter: 'applied' }).every(function () {
                                      const rowData = this.data();
                                      const ticketNumber = rowData?.nro_ticket ?? (Array.isArray(rowData) ? rowData[1] : null);

                                      if (ticketNumber === targetNroTicketPendienteEntrega) {
                                          $(this.node()).addClass('table-active').css('background-color', '#e0f2f7');
                                          this.node().scrollIntoView({ behavior: 'smooth', block: 'center' });
                                          found = true;
                                      } else {
                                          $(this.node()).removeClass('table-active').css('background-color', '');
                                      }
                                  });

                                  if (!found) {
                                      if (showWarning) {
                                          Swal.fire({
                                              icon: 'warning',
                                              title: 'Ticket no encontrado',
                                              text: warningText || `El ticket ${targetNroTicketPendienteEntrega} no se encuentra en este filtro.`,
                                              confirmButtonText: 'Ok',
                                              color: 'black',
                                              confirmButtonColor: '#003594'
                                          });
                                      }
                                      dataTableInstance.search('').draw(false);
                                      $('.dataTables_filter input').val('');
                                      return false;
                                  }

                                  $('.dataTables_filter input').val(targetNroTicketPendienteEntrega);
                                  return true;
                              }

                              // Función para buscar automáticamente el primer botón con datos
                              function findFirstButtonWithData() {
                                  let fallbackConfig = null;
                                  let ticketFoundConfig = null;
                                  let ticketFound = false;

                                  for (const config of filterConfigs) {
                                      const hasData = checkDataExists(config.term);
                                      if (!hasData) {
                                          continue;
                                      }

                                      if (!fallbackConfig) {
                                          fallbackConfig = config;
                                      }

                                      if (targetNroTicketPendienteEntrega) {
                                          const filteredRows = dataTableInstance.rows({ filter: 'applied' }).data().toArray();
                                          const hasTicket = filteredRows.some(row => {
                                              const ticketNumber = row?.nro_ticket ?? (Array.isArray(row) ? row[1] : null);
                                              return ticketNumber === targetNroTicketPendienteEntrega;
                                          });

                                          if (hasTicket) {
                                              ticketFoundConfig = config;
                                              ticketFound = true;
                                              break;
                                          }
                                      } else {
                                          ticketFoundConfig = config;
                                          break;
                                      }
                                  }

                                  if (!ticketFoundConfig && fallbackConfig) {
                                      ticketFoundConfig = fallbackConfig;
                                  }

                                  if (ticketFoundConfig) {
                                      applyFilterConfig(ticketFoundConfig);
                                      if (targetNroTicketPendienteEntrega) {
                                          applyNroTicketSearch({
                                              showWarning: !ticketFound,
                                              warningText: `El ticket ${targetNroTicketPendienteEntrega} no se encuentra en los datos disponibles.`
                                          });
                                      }
                                      return true;
                                  }

                                  dataTableInstance.columns().search('').draw(false);
                                  dataTableInstance.column(17).visible(false);
                                  dataTableInstance.column(18).visible(false);
                                  dataTableInstance.column(19).visible(false);
                                  dataTableInstance.column(20).visible(true);
                                  dataTableInstance.column(10).search("NO_DATA_FOUND").draw();
                                  setActiveButton("btn-por-asignar");
                                  showTicketStatusIndicator('Cerrado', 'Sin datos');

                                  const tbody = document.querySelector("#tabla-ticket tbody");
                                  if (tbody) {
                                      tbody.innerHTML = '<tr><td colspan="21" class="text-center text-muted">No hay tickets disponibles en ningún estado</td></tr>';
                                  }

                                  if (targetNroTicketPendienteEntrega) {
                                      Swal.fire({
                                          icon: 'warning',
                                          title: 'Ticket no encontrado',
                                          text: `El ticket ${targetNroTicketPendienteEntrega} no se encuentra en los datos disponibles.`,
                                          confirmButtonText: 'Ok',
                                          color: 'black',
                                          confirmButtonColor: '#003594'
                                      });
                                  }

                                  return false;
                              }

                              // Ejecutar la búsqueda automática al inicializar
                              findFirstButtonWithData();

                              const configMap = filterConfigs.reduce((acc, cfg) => {
                                  acc[cfg.button] = cfg;
                                  return acc;
                              }, {});

                              // Event listeners para los botones (mantener la funcionalidad manual)
                              $("#btn-por-asignar").on("click", function () {
                                  const config = configMap["btn-por-asignar"];
                                  if (config && checkDataExists(config.term)) {
                                      applyFilterConfig(config);
                                      applyNroTicketSearch();
                                  } else {
                                      findFirstButtonWithData();
                                  }
                              });

                              $("#btn-asignados").on("click", function () {
                                  const config = configMap["btn-asignados"];
                                  if (config && checkDataExists(config.term)) {
                                      applyFilterConfig(config);
                                      applyNroTicketSearch();
                                  } else {
                                      findFirstButtonWithData();
                                  }
                              });

                              $("#btn-recibidos").on("click", function () {
                                  const config = configMap["btn-recibidos"];
                                  if (config && checkDataExists(config.term)) {
                                      applyFilterConfig(config);
                                      applyNroTicketSearch();
                                  } else {
                                      findFirstButtonWithData();
                                  }
                              });

                              $("#btn-llaves-cargadas").on("click", function () {
                                  const config = configMap["btn-llaves-cargadas"];
                                  if (config && checkDataExists(config.term)) {
                                      applyFilterConfig(config);
                                      applyNroTicketSearch();
                                  } else {
                                      findFirstButtonWithData();
                                  }
                              });
                          },
                      });

                 $(document).on("click", ".deliver-ticket-bt", function () {
                      const idTicket = $(this).data("id-ticket");
                      const nroTicket = $(this).data("nro-ticket"); 
                      const serialPos = $(this).data("serial-pos"); 
                      const customDeliverSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                      const id_user = document.getElementById('userId').value;

                      Swal.fire({
                          title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                              <div class="custom-modal-header-content">Confirmación de Entrega al Cliente</div>
                          </div>`,
                          html: `<div class="custom-modal-body-content">
                              <div class="mb-4">
                                  ${customDeliverSvg}
                              </div> 
                              <p class="h4 mb-3" style="color: black;">¿Desea marcar el dispositivo con serial <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> del Ticket Nro: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> como "Entregado al Cliente"?</p> 
                              <p class="h5" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">Esta acción registrará la fecha de entrega al cliente.</p>
                          </div>`,
                          confirmButtonText: "Confirmar Entrega",
                          color: "black",
                          confirmButtonColor: "#003594",
                          cancelButtonText: "Cancelar",
                          focusConfirm: false,
                          allowOutsideClick: false,
                          showCancelButton: true,
                          allowEscapeKey: false,
                          keydownListenerCapture: true,
                          screenX: false,
                          screenY: false,
                      }).then((result) => {
                          if (result.isConfirmed) {
                              // ENVIAR DIRECTAMENTE SIN MODAL DE COMENTARIO
                              const comentario = "Ticket entregado al cliente"; // Comentario por defecto
                              const dataToSendString = `action=entregar_ticketDev&id_ticket=${encodeURIComponent(idTicket)}&comentario=${encodeURIComponent(comentario)}&id_user=${encodeURIComponent(id_user)}`;

                              const xhr = new XMLHttpRequest();
                              const url = `${ENDPOINT_BASE}${APP_PATH}api/consulta/entregar_ticketDev`;

                              xhr.open('POST', url, true);
                              xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                              xhr.onload = function() {
                                  if (xhr.status >= 200 && xhr.status < 300) {
                                      try {
                                          const response = JSON.parse(xhr.responseText);

                                          if (response.success) {
                                              // Mostrar el primer modal (Entrega exitosa)
                                              Swal.fire({
                                                  icon: "success",
                                                  title: "Entrega Exitosa",
                                                  text: response.message,
                                                  color: "black",
                                                  timer: 2500,
                                                  timerProgressBar: true,
                                                  didOpen: () => {
                                                      Swal.showLoading();
                                                  },
                                                  willClose: () => {
                                                      // Cuando el primer modal se cierra, mostramos el segundo modal con detalles
                                                      const ticketData = response.ticket_data;

                                                      if (ticketData) {
                                                        const comentarioEntrega = ticketData.customer_delivery_comment && ticketData.customer_delivery_comment.trim() !== "" ? ticketData.customer_delivery_comment : `<strong>Comentario Devolución:</strong> ${ticketData.comment_devolution || "N/A"}`;

                                                          const beautifulHtmlContent = `
                                                              <div style="text-align: left; padding: 15px;">
                                                                  <h3 style="color: #28a745; margin-bottom: 15px; text-align: center;">↩️ ¡POS Devueto! ↩️</h3>
                                                                  <p style="font-size: 1.1em; margin-bottom: 10px;">
                                                                      <strong>🎫 Nro. de Ticket:</strong> <span style="font-weight: bold; color: #d9534f;">${ticketData.nro_ticket}</span>
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>🏢 RIF:</strong> ${ticketData.rif_cliente || "N/A"}
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>🏢Razon Social:</strong> ${ticketData.razonsocial_cliente || "N/A"}
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>⚙️ Serial del Equipo:</strong> <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticketData.serial_pos}</span>
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                    📝${comentarioEntrega} 
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>👤 Usuario que Realizó la Entrega:</strong> ${ticketData.user_gestion || "N/A"}
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>🧑‍💻 Coordinador Asignado:</strong> ${ticketData.user_coordinator|| "N/A"}
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>📅 Fecha de Entrega:</strong> ${ticketData.date_create_ticket || "N/A"}
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>📅 Fecha de Cierre:</strong> ${ticketData.date_end_ticket ||  "N/A"}
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>🔄 Estado del Ticket:</strong> <span style="color: #28a745; font-weight: bold;">${ticketData.name_status_ticket}</span>
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>📋 Acción del Ticket:</strong> <span style="color: #007bff; font-weight: bold;">${ticketData.name_accion_ticket}</span>
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>📊Estado de Domiciliación:</strong> <span style="color: #6f42c1; font-weight: bold;">${ticketData.name_status_domiciliacion || "N/A"}</span>
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>💰 Estado de Pago:</strong> <span style="color: #fd7e14; font-weight: bold;">${ticketData.name_status_payment || "N/A"}</span>
                                                                  </p>
                                                                  <p style="margin-bottom: 8px;">
                                                                      <strong>🔬 Estado del Taller:</strong> <span style="color: #20c997; font-weight: bold;">${ticketData.name_status_lab || "N/A"}</span>
                                                                  </p>
                                                                  <strong>
                                                                      <p style="font-size: 0.9em; color: green; margin-top: 20px; text-align: center;">
                                                                          El ticket ha sido marcado como entregado y cerrado exitosamente.<br>
                                                                          <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Se ha registrado en el historial del sistema.</span>
                                                                      </p>
                                                                  </strong>
                                                              </div>`;

                                                          Swal.fire({
                                                              icon: "success",
                                                              title: "Detalles de la Entrega",
                                                              html: beautifulHtmlContent,
                                                              color: "black",
                                                              confirmButtonText: "Cerrar",
                                                              confirmButtonColor: "#003594",
                                                              showConfirmButton: true,
                                                              showClass: {
                                                                  popup: "animate__animated animate__fadeInDown",
                                                              },
                                                              hideClass: {
                                                                  popup: "animate__animated animate__fadeOutUp",
                                                              },
                                                              allowOutsideClick: false,
                                                              allowEscapeKey: false,
                                                              width: '700px'
                                                          }).then((result) => {
                                                              if (result.isConfirmed) {
                                                                  // ENVIAR CORREO DESPUÉS DE CERRAR EL MODAL
                                                                  enviarCorreoTicketDevuelto(ticketData);
                                                                  
                                                                  // NO recargar la página aquí - la cola de correos manejará la recarga
                                                                  // después de mostrar el toast
                                                              }
                                                          });
                                                      } else {
                                                          // Si no hay datos del ticket, mostrar solo mensaje de éxito
                                                          Swal.fire({
                                                              icon: "success",
                                                              title: "Entrega Exitosa",
                                                              text: "El ticket ha sido entregado exitosamente.",
                                                              confirmButtonText: "Cerrar",
                                                              confirmButtonColor: "#003594"
                                                          }).then(() => {
                                                              window.location.reload();
                                                          });
                                                      }
                                                  },
                                              });
                                          } else {
                                              Swal.fire('Error', response.message || 'Error al procesar la entrega', 'error');
                                          }
                                      } catch (error) {
                                          console.error('Error al parsear la respuesta:', error);
                                          Swal.fire('Error', 'Error al procesar la respuesta del servidor', 'error');
                                      }
                                  } else {
                                      Swal.fire('Error', 'Hubo un problema al conectar con el servidor. Código de estado: ' + xhr.status, 'error');
                                  }
                              };

                              xhr.onerror = function() {
                                  Swal.fire('Error de red', 'Hubo un problema con la conexión.', 'error');
                              };

                              xhr.send(dataToSendString);
                          }
                      });
                  });

                  $(document).on("click", ".deliver-ticket-btn", function () {
                  const idTicket = $(this).data("id-ticket");
                  const nroTicket = $(this).data("nro-ticket"); 
                  const serialPos = $(this).data("serial-pos"); 
                  const customDeliverSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                  const id_user = document.getElementById('userId').value;

                  Swal.fire({
                      title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                          <div class="custom-modal-header-content">Confirmación de Entrega al Cliente</div>
                      </div>`,
                      html: `<div class="custom-modal-body-content">
                          <div class="mb-4">
                              ${customDeliverSvg}
                          </div> 
                          <p class="h4 mb-3" style="color: black;">¿Desea marcar el dispositivo con serial <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> del Ticket Nro: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> como "Entregado al Cliente"?</p> 
                          <p class="h5" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">Esta acción registrará la fecha de entrega al cliente.</p>
                      </div>`,
                      confirmButtonText: "Confirmar Entrega",
                      color: "black",
                      confirmButtonColor: "#003594",
                      cancelButtonText: "Cancelar",
                      focusConfirm: false,
                      allowOutsideClick: false,
                      showCancelButton: true,
                      allowEscapeKey: false,
                      keydownListenerCapture: true,
                      screenX: false,
                      screenY: false,
                  }).then((result) => {
                      if (result.isConfirmed) {
                          Swal.fire({
                              title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                                  <div class="custom-modal-header-content">Detalles de la Entrega</div>
                              </div>`,
                              html: `<div class="custom-modal-body-content">
                                  <p class="h4 mb-1" style="color: black;">Por favor, ingrese un comentario o un texto adicional sobre el Dispositivo a entregar con el Serial: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">${serialPos}</span> asociado al Nro de ticket: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff; font-size: 75%;">${nroTicket}</span>.</p>
                                  <div class="form-group mb-3"><br>
                                      <textarea id="comentarioEntrega" class="form-control" rows="3" placeholder="Escriba aquí cualquier detalle relevante sobre la entrega... O reparación del Equipo"></textarea>
                                  </div>
                              </div>`,
                              showCancelButton: true,
                              confirmButtonText: 'Guardar y Completar',
                              cancelButtonText: 'Cancelar',
                              confirmButtonColor: '#003594',
                              color: "black",
                              focusConfirm: false,
                              allowOutsideClick: false,
                              allowEscapeKey: false,
                              keydownListenerCapture: true,
                              screenX: false,
                              screenY: false,
                              width: '600px',
                              customClass: {
                                  popup: 'no-scroll'
                              },
                              preConfirm: () => {
                                  const comentario = Swal.getPopup().querySelector('#comentarioEntrega').value.trim();
                                  if (!comentario) {
                                      Swal.showValidationMessage('El campo de texto no puede estar vacío.');
                                      return false;
                                  }
                                  return { comentario: comentario };
                              }
                          }).then((resultFinal) => {
                              if (resultFinal.isConfirmed) {
                                  const comentario = resultFinal.value.comentario;
                                  const dataToSendString = `action=entregar_ticket&id_ticket=${encodeURIComponent(idTicket)}&comentario=${encodeURIComponent(comentario)}&id_user=${encodeURIComponent(id_user)}`;

                                  const xhr = new XMLHttpRequest();
                                  const url = `${ENDPOINT_BASE}${APP_PATH}api/consulta/entregar_ticket`;

                                  xhr.open('POST', url, true);
                                  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                                   xhr.onload = function() {
                        if (xhr.status >= 200 && xhr.status < 300) {
                          try {
                            const response = JSON.parse(xhr.responseText);

                            if (response.success) {
                              // Mostrar el primer modal (Entrega exitosa)
                              Swal.fire({
                                icon: "success",
                                title: "Entrega Exitosa",
                                text: response.message,
                                color: "black",
                                timer: 2500,
                                timerProgressBar: true,
                                didOpen: () => {
                                  Swal.showLoading();
                                },
                                willClose: () => {
                                  // Cuando el primer modal se cierra, mostramos el segundo modal con detalles
                                  const ticketData = response.ticket_data;

                                  if (ticketData) {
                                    const beautifulHtmlContent = `
                                      <div style="text-align: left; padding: 15px;">
                                          <h3 style="color: #28a745; margin-bottom: 15px; text-align: center;">✅ ¡POS Entregado! ✅</h3>
                                          <p style="font-size: 1.1em; margin-bottom: 10px;">
                                              <strong>🎫 Nro. de Ticket:</strong> <span style="font-weight: bold; color: #d9534f;">${ticketData.nro_ticket}</span>
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                            <strong>🏢 RIF:</strong> ${ticketData.rif_cliente || "N/A"}
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                            <strong>🏢Razon Social:</strong> ${ticketData.razonsocial_cliente || "N/A"}
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>⚙️ Serial del Equipo:</strong> <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticketData.serial_pos}</span>
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>📝 Comentario de Entrega:</strong> ${ticketData.customer_delivery_comment || "Sin comentarios"}
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>👤 Usuario que Realizó la Entrega:</strong> ${ticketData.user_gestion || "N/A"}
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>🧑‍💻 Coordinador Asignado:</strong> ${ticketData.user_coordinator|| "N/A"}
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>📅 Fecha de Entrega:</strong> ${ticketData.date_create_ticket || "N/A"}
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>📅 Fecha de Cierre:</strong> ${ticketData.date_end_ticket ||  "N/A"}
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>🔄 Estado del Ticket:</strong> <span style="color: #28a745; font-weight: bold;">${ticketData.name_status_ticket}</span>
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>📋 Acción del Ticket:</strong> <span style="color: #007bff; font-weight: bold;">${ticketData.name_accion_ticket}</span>
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong> Estado de Domiciliación:</strong> <span style="color: #6f42c1; font-weight: bold;">${ticketData.name_status_domiciliacion || "N/A"}</span>
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>💰 Estado de Pago:</strong> <span style="color: #fd7e14; font-weight: bold;">${ticketData.name_status_payment || "N/A"}</span>
                                          </p>
                                          <p style="margin-bottom: 8px;">
                                              <strong>🔬 Estado del Taller:</strong> <span style="color: #20c997; font-weight: bold;">${ticketData.name_status_lab || "N/A"}</span>
                                          </p>
                                          <strong>
                                              <p style="font-size: 0.9em; color: green; margin-top: 20px; text-align: center;">
                                                  El ticket ha sido marcado como entregado y cerrado exitosamente.<br>
                                                  <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Se ha registrado en el historial del sistema además Se le ha enviado una notificación al correo </span>
                                              </p>
                                          </strong>
                                      </div>`;

                                    Swal.fire({
                                      icon: "success",
                                      title: "Detalles de la Entrega",
                                      html: beautifulHtmlContent,
                                      color: "black",
                                      confirmButtonText: "Cerrar",
                                      confirmButtonColor: "#003594",
                                      showConfirmButton: true,
                                      showClass: {
                                        popup: "animate__animated animate__fadeInDown",
                                      },
                                      hideClass: {
                                        popup: "animate__animated animate__fadeOutUp",
                                      },
                                      allowOutsideClick: false,
                                      allowEscapeKey: false,
                                      width: '700px'
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        enviarCorreoTicketCerrado(ticketData);
                                      }
                                    });
                                  } else {
                                    // Si no hay datos del ticket, mostrar solo mensaje de éxito
                                    Swal.fire({
                                      icon: "success",
                                      title: "Entrega Exitosa",
                                      text: "El ticket ha sido entregado exitosamente.",
                                      confirmButtonText: "Cerrar",
                                      confirmButtonColor: "#003594"
                                    }).then(() => {
                                    });
                                  }
                                },
                              });
                            } else {
                              Swal.fire('Error', response.message || 'Error al procesar la entrega', 'error');
                            }
                          } catch (error) {
                            console.error('Error al parsear la respuesta:', error);
                            Swal.fire('Error', 'Error al procesar la respuesta del servidor', 'error');
                          }
                        } else {
                          Swal.fire('Error', 'Hubo un problema al conectar con el servidor. Código de estado: ' + xhr.status, 'error');
                        }
                      };

                      xhr.onerror = function() {
                        Swal.fire('Error de red', 'Hubo un problema con la conexión.', 'error');
                      };

                      xhr.send(dataToSendString);
                    }
                  });
                }
                });
              });


          // ************* INICIO: LÓGICA PARA EL CHECKBOX "CARGAR LLAVE" *************
            $("#tabla-ticket tbody")
              .off("change", ".receive-key-checkbox") // <--- Usamos 'change' para checkboxes
              .on("change", ".receive-key-checkbox", function (e) {
                      e.stopPropagation(); // Evita propagación del evento

                      const ticketId = $(this).data("id-ticket");
                      const nroTicket = $(this).data("nro-ticket");
                      const serialPos = $(this).data("serial-pos") || ""; // Asegúrate de que serial_pos esté definido
                      const isChecked = $(this).is(":checked"); // Verifica si el checkbox está marcado
                      const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;

                      if (isChecked) {
                          Swal.fire({
                                title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                                          <div class="custom-modal-header-content">Confirmación de Carga de Llaves</div>
                                        </div>`,
                            html: `<div class="custom-modal-body-content">
                                    <div class="mb-4">
                                        ${customWarningSvg}
                                    </div> 
                                    <p class="h4 mb-3" style = "color: black;">¿Desea marcar el Ticket Nro: ${nroTicket} como "Llaves Cargadas".?</p> 
                                    <p class="h5" style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">Esta acción registrará la fecha de la carga de llaves</p>`,
                                confirmButtonText: "Confirmar",
                              color: "black",
                              confirmButtonColor: "#003594",
                              cancelButtonText: "Cancelar",
                              focusConfirm: false,
                              allowOutsideClick: false,
                              showCancelButton: true,
                              allowEscapeKey: false,
                              keydownListenerCapture: true,
                          }).then((result) => {
                              if (result.isConfirmed) {
                                  MarkDateKey(ticketId, nroTicket, serialPos); // `false` indica que se cargaron las llaves
                                  $(this).prop('checked', true);
                              } else {
                                  $(this).prop('checked', false);
                              }
                          });
                      } else {
                          // Si el checkbox se desmarca, puedes añadir lógica aquí si es necesario
                          // Por ahora, no hace nada si se desmarca.
                      }
            });
          // ************* FIN: LÓGICA PARA EL CHECKBOX "CARGAR LLAVE" *************


          $("#tabla-ticket tbody")
            .off("click", ".send-to-region-btn")
            .on("click", ".send-to-region-btn", function (e) {
                    e.stopPropagation();

                    const ticketId = $(this).data("id-ticket");
                    const serialPos = $(this).data("serial-pos") || "";
                    const nroTicket = $(this).data("nro-ticket");
                    const regionName = $(this).data("region-name");
                    
                    // Obtener id_failure para validar si es "Actualización de Software" (id_failure = 9) o "Sin Llaves/Dukpt Vacío" (id_failure = 12)
                    const idFailure = $(this).data("id-failure") ? parseInt($(this).data("id-failure")) : null;
                    const isActualizacionSoftware = idFailure === 9;
                    const isSinLlavesDukpt = idFailure === 12;
                    const isFallaSinPago = isActualizacionSoftware || isSinLlavesDukpt;
                    
                    // Obtener el PDF del presupuesto directamente del atributo data del botón
                    const pdfPathPresupuesto = $(this).data("pdf-presupuesto") || '';
                    const hasPresupuestoPDF = pdfPathPresupuesto && pdfPathPresupuesto.trim() !== '';
                    
                    // Validación: Si no hay PDF del presupuesto Y NO es "Actualización de Software" ni "Sin Llaves/Dukpt Vacío", mostrar alerta y detener
                    // Para "Actualización de Software" (id_failure = 9) o "Sin Llaves/Dukpt Vacío" (id_failure = 12), no se requiere presupuesto
                    // TAMPOCO se requiere si el estatus es "Gestión Comercial (Irreparable)"
                    const statusLab = $(this).data("status-lab");
                    const isIrreparable = (statusLab === "Gestión Comercial (Irreparable)");

                    if (!hasPresupuestoPDF && !isFallaSinPago && !isIrreparable) {
                        Swal.fire({
                            title: 'Documento de Presupuesto Requerido',
                            html: `
                                <div style="text-align: center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#ffc107" class="bi bi-exclamation-triangle-fill mb-3" viewBox="0 0 16 16">
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                    </svg>
                                    <p class="h5 mb-3" style="color: black;">
                                        No se puede enviar el ticket a la región sin el documento de presupuesto.
                                    </p>
                                    <p class="mb-3" style="color: #6c757d;">
                                        Por favor, cargue el documento de presupuesto antes de enviar el ticket a la región.
                                    </p>
                                    <p class="text-muted" style="font-size: 0.9rem;">
                                        Ticket: <strong>${nroTicket}</strong>
                                    </p>
                                </div>
                            `,
                            confirmButtonText: 'Entendido',
                            confirmButtonColor: '#003594',
                            color: 'black',
                            allowOutsideClick: false,
                            allowEscapeKey: true
                        });
                        return; // Detener la ejecución
                    }

                    const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                    
                    Swal.fire({
                        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                                    <div class="custom-modal-header-content">Confirmación de Envío al Estado</div>
                                </div>`,
                        html: `<div class="custom-modal-body-content">
                                    <div class="mb-4">
                                        ${customWarningSvg}
                                    </div> 
                                    <p class="h4 mb-3" style="color: black;">¿Seguro que desea enviar el Ticket Nro: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> al Estado: ${regionName}?</p> 
                                    <p class="h5" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; font-size: 70%; color: #007bff;">Esta acción cambiará el estado del ticket a "Enviado a Región"</p>
                                </div>`,
                        confirmButtonText: "Continuar",
                        color: "black",
                        confirmButtonColor: "#003594",
                        cancelButtonText: "Cancelar",
                        focusConfirm: false,
                        allowOutsideClick: false,
                        showCancelButton: true,
                        allowEscapeKey: false,
                        keydownListenerCapture: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Llama a la función que usa XMLHttpRequest para la validación
                            checkTicketComponents(ticketId, serialPos, regionName);
                        }
                    });
          });

          $("#tabla-ticket tbody")
            .off("click", ".received-ticket-btn")
            .on("click", ".received-ticket-btn", function (e) {
                                e.stopPropagation();
                                const ticketId = $(this).data("id-ticket");
                                const nroTicket = $(this).data("nro-ticket");
                                const serialPos = $(this).data("serial-pos") || ""; // Asegúrate de que serial_pos esté definido

                                currentTicketIdForConfirmTaller = ticketId;
                                currentNroTicketForConfirmTaller = nroTicket;
                                currentSerialPosForConfirmTaller = serialPos; // Asegúrate de que serial_pos esté definido

                                $("#modalTicketIdConfirmTaller").val(ticketId);
                                $("#modalHiddenNroTicketConfirmTaller").val(nroTicket);
                                $("#serialPost").text(serialPos);

                                $("#modalTicketIdConfirmTaller").text(nroTicket);

                                if (confirmInTallerModalInstance) {
                                    confirmInTallerModalInstance.show();
                                } else {
                                    console.error(
                                        "La instancia del modal 'confirmInTallerModal' no está disponible."
                                    );
                                }
          });

          $("#tabla-ticket tbody")
            .off("click", ".send-back-to-lab-btn")
            .on("click", ".send-back-to-lab-btn", function (e){
              e.stopPropagation();

              const ticketId = $(this).data("id-ticket");
              const nroTicket = $(this).data("nro-ticket");
              const serialPos = $(this).data("serial-pos") || "";

            const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;

    Swal.fire({
        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
            <div class="custom-modal-header-content">Confirmar devolución a Taller</div>
        </div>`,
        html: `
            <div class="custom-modal-body-content">
                <div class="mb-4">
                    ${customWarningSvg}
                </div>
                <p class="h4 mb-3">¿Deseas enviar el Pos con el serial <span style="display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> asociado al ticket Nro:<span style="display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> de vuelto al Taller?</p>
                <p class="h5 text-muted">Esta acción asume que en el trayecto el POS se averió.</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Enviar Pos",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#003594",
        showLoaderOnConfirm: true,
        showCloseButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        focusConfirm: false,
        customClass: {
            confirmButton: 'custom-confirm-button',
            cancelButton: 'custom-cancel-button',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.showLoading();

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetSimpleFailure`);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    Swal.hideLoading();
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            const falla = response.failure[0] || {};
                            const fallaTexto = falla.name_failure || 'No se encontró una falla asociada.';

                            // --- Modal de Falla con estilo mejorado ---
                            Swal.fire({
                                title: '',
                                html: `
                                    <div style="margin:-6px -6px 14px -6px; width: 100%;">
                                        <div style="background:linear-gradient(90deg,#000,#0056d6);border-radius:10px;padding:12px 16px;color:#fff;display:flex;align-items:center;gap:10px;box-shadow:0 2px 6px rgba(0,0,0,.1)">
                                            <span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.15);font-size:18px;">🛠️</span>
                                            <div style="font-size:18px;font-weight:700;letter-spacing:.2px;">Detalles de la Falla</div>
                                        </div>
                                    </div>
                                    <div style="text-align:left">
                                        <div style="background:#fff3cd;border:1px solid #ffeeba;color:#856404;border-radius:8px;padding:10px 12px;margin-bottom:12px;display:flex;gap:8px;align-items:flex-start;">
                                            <span style="font-size:20px;line-height:1">⚠️</span>
                                            <div>
                                                <div style="font-weight:600;margin-bottom:2px;">Reingreso con misma falla</div>
                                                <div style="font-size:13px;color:#5c5c5c;">Si es un reingreso, el POS debe tener la misma falla del ticket. De lo contrario, cierre el ticket, y proceda a crear uno nuevo.</div>
                                            </div>
                                        </div>

                                        <div class="mb-2" style="display:flex;flex-direction:column;gap:6px;">
                                            <label class="form-label" style="margin:0;font-weight:600;color:#333; width: 40%;">Falla del POS</label>
                                            <div class="input-group" style="display:flex;align-items:center;gap:8px;">
                                                <span style="background:#e9ecef;border:1px solid #ced4da;border-radius:6px;padding:6px 10px;color:#495057; margin-top: -2%;">🔧</span>
                                                <input type="text" class="form-control" style="border-radius:30px;" value="${fallaTexto}" disabled>
                                            </div>
                                            <small class="text-muted" style="color:#6c757d;">Información obtenida del último diagnóstico del ticket.</small>
                                        </div>
                                    </div>
                                `,
                                icon: undefined,
                                showCancelButton: true,
                                confirmButtonText: 'Aceptar',
                                cancelButtonText: 'Cerrar Ticket',
                                confirmButtonColor: '#003594',
                                cancelButtonColor: '#dc3545',
                                color: 'black',
                                width: 560
                            }).then((resultFalla) => {
                                if (resultFalla.isConfirmed) {
                                  SendBacktoTaller(ticketId, nroTicket);
                                } else if (resultFalla.dismiss === Swal.DismissReason.cancel) {
                                  CloseTicket(ticketId, nroTicket);
                                }
                            });
                            // --- Fin del Nuevo Modal ---
                            
                        } catch (e) {
                            Swal.fire('Error', 'No se pudo procesar la respuesta del servidor.', 'error');
                            console.error('Error parsing JSON:', e);
                        }
                    } else {
                        Swal.fire('Error de Conexión', 'Hubo un problema al intentar obtener la información de la falla.', 'error');
                    }
                }
            };

            const params = `action=GetSimpleFailure&ticketId=${encodeURIComponent(ticketId)}`;
            xhr.send(params);
        }
    });
});

            $("#tabla-ticket tbody").on("click", ".truncated-cell", function (e) {
              // Detiene la propagación del evento para que no se active el clic en la fila
              e.stopPropagation();

              const cell = $(this);
              const fullText = cell.data("full-text");
              const displayLength = 25; // Reutiliza la misma constante de longitud
              const currentText = cell.text();

              // Alterna entre el texto completo y el texto truncado
              if (currentText.endsWith("...")) {
                  cell.text(fullText);
              } else {
                  cell.text(fullText.substring(0, displayLength) + "...");
              }
          });

            // === ADD THE CLICK EVENT LISTENER FOR TABLE ROWS HERE ===
            $("#tabla-ticket tbody")
                .off("click", "tr") // .off() to prevent multiple bindings if called multiple times
                .on("click", "tr", function (e) {
                    // Asegúrate de que el clic no proviene de una celda truncable/expandible o de un botón.
                    if ($(e.target).hasClass('truncated-cell') || $(e.target).hasClass('full-text-cell') || $(e.target).is('button') || $(e.target).is('input[type="checkbox"]')) {
                        return; // Si el clic fue en la celda del checkbox o el botón, no activar el evento de la fila.
                    }

                    // Solo ocultar overlay si el clic fue directamente en la fila
                // 1. Matamos cualquier otro handler (por si acaso)
                e.stopPropagation();
                
                // 2. FORZAMOS que el overlay esté oculto, aunque otro script lo muestre
                $('#loadingOverlay').removeClass('show').hide();
                
                // 3. Si el script usa opacity o visibility, también lo matamos
                $('#loadingOverlay').css({
                    'display': 'none',
                    'opacity': '0',
                    'visibility': 'hidden'
                });
                
                // Pequeño timeout por si el otro script lo muestra después (raro, pero pasa)
                setTimeout(() => {
                    $('#loadingOverlay').hide();
                }, 50);

                    const tr = $(this);
                    const rowData = dataTableInstance.row(tr).data();

                    if (!rowData) {
                        return;
                    }

                    $("#tabla-ticket tbody tr").removeClass("table-active");
                    tr.addClass("table-active");

                    const ticketId = rowData.id_ticket;

                    const selectedTicketDetails = TicketData.find(
                        (t) => t.id_ticket == ticketId
                    );

                    if (selectedTicketDetails) {
                    detailsPanel.innerHTML = formatTicketDetailsPanel(selectedTicketDetails);
                    loadTicketHistory(ticketId, selectedTicketDetails.nro_ticket, selectedTicketDetails.serial_pos || '');
                        if (selectedTicketDetails.serial_pos) {
                            downloadImageModal(selectedTicketDetails.serial_pos);
                        } else {
                            const imgElement = document.getElementById(
                                "device-ticket-image"
                            );
                            if (imgElement) {
                                // Asegúrate de que esta ruta sea correcta en el contexto de tu JS
                                imgElement.src = '/public/img/consulta_rif/POS/mantainment.png';
                                imgElement.alt = "Serial no disponible";
                            }
                        }
                    } else {
                        detailsPanel.innerHTML =
                            "<p>No se encontraron detalles para este ticket.</p>";
                    }
                });
            if (tableContainer) {
              tableContainer.style.display = ""; // Show the table container
            }
          } else {
            if (tableContainer) {
              tableContainer.innerHTML = "<p>No hay datos disponibles.</p>";
              tableContainer.style.display = "";
            }
          }
        } else {
          if (tableContainer) {
            tableContainer.innerHTML =
              "<p>Error al cargar los datos: " +
              (response.message || "Mensaje desconocido") +
              "</p>";
            tableContainer.style.display = "";
          }
          console.error("Error from API:", response.message);
        }
      } catch (error) {
        if (tableContainer) {
          tableContainer.innerHTML = "<p>Error al procesar la respuesta.</p>";
          tableContainer.style.display = "";
        }
        console.error("Error parsing JSON:", error);
      }
    } else if (xhr.status === 404) {
      if (tableContainer) {
        tableContainer.innerHTML =  `<tr>
          <td colspan="14" class="text-center text-muted py-5">
            <div class="d-flex flex-column align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
              <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
              <p class="text-muted mb-0">No hay tickets en el Rosal para mostrar en este momento.</p>
            </div>
          </td>
       </tr>`;
        tableContainer.style.display = "";
      }
    } else {
      if (tableContainer) {
        tableContainer.innerHTML = `<p>Error de conexión: ${xhr.status} ${xhr.statusText}</p>`;
        tableContainer.style.display = "";
      }
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };
  xhr.onerror = function () {
    if (tableContainer) {
      tableContainer.innerHTML = "<p>Error de red.</p>";
      tableContainer.style.display = "";
    }
    console.error("Error de red");
  };
  const datos = `action=GetTicketDataFinal`;
  xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getTicketDataFinaljs);

// ✅ SISTEMA DE COLA DE CORREOS PARA PENDIENTE_ENTREGA
let emailQueuePendiente = [];
let isProcessingPendiente = false;

function processEmailQueuePendiente() {
    if (isProcessingPendiente || emailQueuePendiente.length === 0) {
        return;
    }

    isProcessingPendiente = true;
    const emailData = emailQueuePendiente.shift();


    const xhrEmail = new XMLHttpRequest();
    xhrEmail.open("POST", emailData.endpoint);
    xhrEmail.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhrEmail.timeout = 10000; // Timeout de 10 segundos

    xhrEmail.onload = function() {
        if (xhrEmail.status === 200) {
            try {
                const responseEmail = JSON.parse(xhrEmail.responseText);
                
                if (responseEmail.success) {
                    // ✅ NOTIFICACIÓN TOAST DE ÉXITO - INMEDIATA
                        Swal.fire({
                            icon: "success",
                            title: "Correo Enviado",
                        text: `Correo de notificación (${emailData.type}) enviado exitosamente para el ticket #${emailData.ticketNumber} - Cliente: ${emailData.ticketData?.razonsocial_cliente || emailData.ticketData?.razon_social || 'N/A'} (${emailData.ticketData?.rif_cliente || emailData.ticketData?.rif || 'N/A'})`,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end',
                            color: 'black',
                        timer: 2500,
                            timerProgressBar: true
                        });
                    
                    // Recargar la página después del timer
                    setTimeout(() => {
                        window.location.reload();
                    }, 2500); // 2.5 segundos para dar tiempo al toast
                } else {
                    console.error(`❌ Error al enviar correo (${emailData.type}):`, responseEmail.message);
                    // Recargar la página incluso si hay error
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } catch (error) {
                console.error(`❌ Error al parsear respuesta del correo (${emailData.type}):`, error);
                // Recargar la página incluso si hay error
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } else {
            console.error(`❌ Error al solicitar el envío de correo (${emailData.type}):`, xhrEmail.status);
            // Recargar la página incluso si hay error
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

        // Procesar siguiente correo en la cola
        isProcessingPendiente = false;
        if (emailQueuePendiente.length > 0) {
            setTimeout(() => {
                processEmailQueuePendiente();
            }, 100); // Pausa mínima de 100ms entre correos
        }
    };

    xhrEmail.onerror = function() {
        console.error(`❌ Error de red al enviar correo (${emailData.type})`);
        isProcessingPendiente = false;
        if (emailQueuePendiente.length > 0) {
            setTimeout(() => {
                processEmailQueuePendiente();
            }, 200); // Pausa mínima en caso de error
        }
    };

    xhrEmail.ontimeout = function() {
        console.error(`⏰ Timeout al enviar correo (${emailData.type})`);
        isProcessingPendiente = false;
        if (emailQueuePendiente.length > 0) {
            setTimeout(() => {
                processEmailQueuePendiente();
            }, 200); // Pausa mínima en caso de timeout
        }
    };

    xhrEmail.send(emailData.params);
}

// ✅ FUNCIÓN PARA TICKET CERRADO (con cola de correos)
function processEmailQueue() {
    if (emailQueue.length === 0) {
        isProcessing = false;
        return;
    }

    isProcessing = true;
    const emailData = emailQueue[0]; // Tomar el primer correo de la cola

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/send_ticket2`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.timeout = 10000; // Timeout de 10 segundos

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    
                    // Mostrar notificación de éxito
                    if (typeof Swal !== "undefined") {
                        Swal.fire({
                            icon: "success",
                            title: "Correo Enviado",
                            text: `Correo de notificación enviado exitosamente para el ticket #${emailData.ticketData.Nr_ticket} - Cliente: ${emailData.ticketData?.razonsocial_cliente || emailData.ticketData?.razon_social || 'N/A'} (${emailData.ticketData?.rif_cliente || emailData.ticketData?.rif || 'N/A'})`,
                            timer: 3000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end',
                            color: 'black'
                        });
                    }
                } else {
                    console.error(`❌ Error al enviar correo para ticket ${emailData.ticketData.Nr_ticket}:`, response.message);
                }
            } catch (error) {
                console.error(`❌ Error al parsear respuesta de correo para ticket ${emailData.ticketData.Nr_ticket}:`, error);
            }
        } else {
            console.error(`❌ Error HTTP en envío de correo para ticket ${emailData.ticketData.Nr_ticket}:`, xhr.status);
        }

        // Remover el correo procesado de la cola
        emailQueue.shift();
        
        // Procesar la siguiente solicitud en la cola
        if (emailQueue.length > 0) {
            // Pequeña pausa antes del siguiente correo (1 segundo)
            setTimeout(() => {
                processEmailQueue();
            }, 1000);
        } else {
            isProcessing = false;
        }
    };

    xhr.onerror = function() {
        console.error(`❌ Error de red al enviar correo para ticket ${emailData.ticketData.Nr_ticket}`);
        
        if (typeof Swal !== "undefined") {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: `No se pudo conectar con el servidor para enviar el correo del ticket #${emailData.ticketData.Nr_ticket}.`,
                color: 'black',
                timer: 5000,
                timerProgressBar: true
            });
        }
        
        // Remover el correo fallido de la cola
        emailQueue.shift();
        
        // Procesar la siguiente solicitud en la cola
        if (emailQueue.length > 0) {
            setTimeout(() => {
                processEmailQueue();
            }, 200); // Pausa mínima en caso de error
        } else {
            isProcessing = false;
        }
    };

    xhr.ontimeout = function() {
        console.error(`⏰ Timeout al enviar correo para ticket ${emailData.ticketData.Nr_ticket}`);
        
        if (typeof Swal !== "undefined") {
            Swal.fire({
                icon: 'error',
                title: 'Tiempo de espera agotado',
                text: `La solicitud de envío de correo para el ticket #${emailData.ticketData.Nr_ticket} tomó demasiado tiempo.`,
                color: 'black',
                timer: 5000,
                timerProgressBar: true
            });
        }
        
        // Remover el correo fallido de la cola
        emailQueue.shift();
        
        // Procesar la siguiente solicitud en la cola
        if (emailQueue.length > 0) {
            setTimeout(() => {
                processEmailQueue();
            }, 200); // Pausa mínima en caso de timeout
        } else {
            isProcessing = false;
        }
    };
    
    const params = `id_user=${encodeURIComponent(emailData.id_user)}`;
    xhr.send(params);
}

function enviarCorreoTicketCerrado(ticketData) {
    // Obtener datos necesarios
    const coordinador = ticketData.user_coordinator_id || ticketData.id_coordinator || '';
    const id_user = ticketData.user_id || ticketData.id_user_gestion || '';
    const ticketNumber = ticketData.nro_ticket || ticketData.Nr_ticket || 'N/A';
    
    
    // Agregar a la cola de correos
    emailQueuePendiente.push({
        endpoint: `${ENDPOINT_BASE}${APP_PATH}api/email/send_end_ticket`,
        params: `id_user=${encodeURIComponent(id_user)}`,
        type: 'Ticket Cerrado',
        ticketNumber: ticketNumber,
        ticketData: ticketData
    });

    // Procesar la cola
    processEmailQueuePendiente();
}

// ✅ FUNCIÓN PARA TICKET DEVUELTO (con cola de correos)
function enviarCorreoTicketDevuelto(ticketData) {
    // Obtener datos necesarios
    const coordinador = ticketData.user_coordinator_id || ticketData.id_coordinator || '';
    const id_user = ticketData.user_id || ticketData.id_user_gestion || '';
    const ticketNumber = ticketData.nro_ticket || ticketData.Nr_ticket || 'N/A';
    
    
    // Agregar a la cola de correos
    emailQueuePendiente.push({
        endpoint: `${ENDPOINT_BASE}${APP_PATH}api/email/send_devolution_ticket`,
        params: `id_coordinador=${encodeURIComponent(coordinador)}&id_user=${encodeURIComponent(id_user)}`,
        type: 'Ticket Devuelto',
        ticketNumber: ticketNumber,
        ticketData: ticketData
    });

    // Procesar la cola
    processEmailQueuePendiente();
}

// ✅ FUNCIÓN PARA MOSTRAR ESTADO DE COLA DE PENDIENTE_ENTREGA (opcional, para debugging)
function mostrarEstadoColaPendiente() {
    if (emailQueuePendiente.length > 0) {
    }
    
    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: 'info',
            title: 'Estado de Cola de Correos (Pendiente Entrega)',
            html: `
                <div style="text-align: left;">
                    <p><strong>Correos en cola:</strong> ${emailQueuePendiente.length}</p>
                    <p><strong>Procesando:</strong> ${isProcessingPendiente ? 'Sí' : 'No'}</p>
                    ${emailQueuePendiente.length > 0 ? `<p><strong>Próximo correo:</strong> ${emailQueuePendiente[0].type} - Ticket #${emailQueuePendiente[0].ticketNumber}</p>` : ''}
                </div>
            `,
            color: 'black',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#003594'
        });
    }
}

// Exponer función globalmente para debugging (opcional)

/**
 * Muestra un modal de SweetAlert para seleccionar componentes antes de enviar el ticket.
 * La función primero obtiene los componentes de la base de datos y luego muestra el modal.
 * @param {string} ticketId El ID del ticket que se está procesando.
 * @param {string} regionName El nombre de la región a la que se enviará el ticket.
 * 
 */

function showSelectComponentsModal(ticketId, regionName, serialPos) {
    const serial_Pos = serialPos;

    // La API URL debe ser la que devuelve la lista de componentes asociados.
    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetComponents`;

    const xhr = new XMLHttpRequest();
    // Cambiamos el método a POST para enviar el ticketId
    xhr.open("POST", apiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                const components = response.components;

                let componentsHtml = '';
                // Verifica que `components` sea un array antes de iterar
                if (Array.isArray(components) && components.length > 0) {
                    components.forEach(comp => {
                        // Lógica para pre-seleccionar y deshabilitar el checkbox
                        const isSelected = comp.is_selected === 't';
                        const isChecked = isSelected ? 'checked' : '';
                        const isDisabled = isSelected ? 'disabled' : '';
                        componentsHtml += `
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="${comp.id_component}" id="component-${comp.id_component}" style="accent-color: #007bff;" ${isChecked} ${isDisabled}>
                                <label class="form-check-label" style="width: 80%;" for="component-${comp.id_component}">
                                    ${comp.name_component}
                                </label>
                            </div>
                        `;
                    });
                } else {
                    componentsHtml = '<p class="text-danger">No se encontraron componentes asociados.</p>';
                }

                const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;
                Swal.fire({
                    title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                                <div class="custom-modal-header-content">Enviar a la Región ${regionName}</div>
                            </div>`,
                    html: `
                        <div class="custom-modal-body-content">
                            <div class="mb-4">
                                ${customWarningSvg}
                            </div> 
                            <p class="h5 mb-3" style="color: black;">Seleccione los componentes que serán enviados junto al POS:<span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; font-size: 70%; color: #007bff;">${serial_Pos}</span></p>
                            <div id="components-list" style="margin-left: 28%;" class="text-left mt-3">
                                ${componentsHtml}
                            </div>
                        </div>`,
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar Envío',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: "#003594",
                    preConfirm: () => {
                        const selectedComponents = [];
                        // Lógica corregida: Selecciona los checkboxes marcados que NO están deshabilitados.
                        const checkboxes = Swal.getPopup().querySelectorAll('input[type="checkbox"]:checked:not([disabled])');
                        checkboxes.forEach(checkbox => {
                            selectedComponents.push(checkbox.value);
                        });
                        return selectedComponents;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        sendToRegion(ticketId, result.value, serial_Pos);
                    }
                });
            } catch (e) {
                // Captura el error de parseo y muestra un mensaje más claro
                console.error("Error al parsear la respuesta JSON del servidor:", e);
                Swal.fire('Error', 'No se pudieron cargar los componentes. Intente de nuevo más tarde.', 'error');
            }
        } else {
            Swal.fire('Error', 'No se pudo obtener la lista de componentes.', 'error');
        }
    };
    xhr.onerror = function() {
        Swal.fire('Error de red', 'No se pudo conectar con el servidor para obtener los componentes.', 'error');
    };
    const dataToSendString = `ticketId=${ticketId}`; // Adaptado para enviar ticketId en el body.
    xhr.send(dataToSendString);
}

$("#confirmTallerBtn").on("click", function () {
  const ticketIdToConfirm = currentTicketIdForConfirmTaller;
  const nroTicketToConfirm = currentNroTicketForConfirmTaller; // Si necesitas el nro_ticket aquí
  const serialPosToConfirm = currentSerialPosForConfirmTaller; // Si necesitas el serial_pos aquí

  if (ticketIdToConfirm) {
    updateTicketStatusInRosal(ticketIdToConfirm, nroTicketToConfirm, serialPosToConfirm);
    if (confirmInTallerModalInstance) {
      confirmInTallerModalInstance.hide();
    }
  } else {
    console.error("ID de ticket no encontrado para confirmar en taller.");
  }
});

function updateTicketStatusInRosal(ticketId, nroTicketToConfirm, serialPosToConfirm) {
  const id_user = document.getElementById("userId").value;
  const nro_ticket = nroTicketToConfirm;
  const serial_pos = serialPosToConfirm;

  const dataToSendString = `action=UpdateStatusToReceiveInRosal&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(ticketId)}`;

  const xhr = new XMLHttpRequest();

  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/UpdateStatusToReceiveInRosal`
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);

        if (response.success === true) {
          Swal.fire({
            title: "¡Éxito!",
            html:  `El Pos con el serial <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serial_pos}</span> asociado al Nro de ticket: <span style=" padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> ha sido marcado como recibido en Gestión Rosal correctamente.`,
            icon: "success",
            confirmButtonText: "Ok", // SweetAlert2 uses confirmButtonText
            confirmButtonColor: "#003594", // SweetAlert2 uses confirmButtonColor
            customClass: {
              confirmButton: "BtnConfirmacion", // For custom button styling
            },
            color: "black",
          }).then((result) => {
            // SweetAlert2 uses 'result' object
            if (result.isConfirmed) {
              // Check if the confirm button was clicked
              location.reload();
            }
          });
        } else {
          console.warn(
            "La API retornó éxito: falso o un valor inesperado:",
            response
          );
          Swal.fire(
            "Error",
            response.message ||
              "No se pudo actualizar el ticket. (Mensaje inesperado)",
            "error"
          );
        }
      } catch (error) {
        console.error(
          "Error al analizar la respuesta JSON para la actualización de estado:",
          error
        );
        // The original error "Class constructor SweetAlert cannot be invoked without 'new'"
        // might be thrown here if SweetAlert2 is loaded but you try to use swal() within the catch block as well.
        Swal.fire(
          "Error de Procesamiento",
          "Hubo un problema al procesar la respuesta del servidor.",
          "error"
        );
      }
    } else {
      console.error(
        "Error al actualizar el estado (HTTP):",
        xhr.status,
        xhr.statusText,
        xhr.responseText
      );
      Swal.fire(
        "Error del Servidor",
        `No se pudo comunicar con el servidor. Código: ${xhr.status}`,
        "error"
      );
    }
  };

  xhr.onerror = function () {
    console.error("Error de red al intentar actualizar el ticket.");
    Swal.fire(
      "Error de Conexión",
      "Hubo un problema de red. Por favor, inténtalo de nuevo.",
      "error"
    );
  };
  xhr.send(dataToSendString);
}

function MarkDateKey(ticketId, nroTicket, serialPos) {
  const id_user = document.getElementById("userId").value;
  const nro_ticket = nroTicket;
    if (!ticketId) {
        console.error("El ID del ticket no puede ser nulo o indefinido.");
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo marcar la fecha de la llave. ID de ticket no proporcionado.",
        });
        return; // Detener la ejecución si no hay ID de ticket
    }
    const dataToSendString = `action=MarkKeyAsReceived&id_ticket=${encodeURIComponent(ticketId)}&id_user=${encodeURIComponent(id_user)}`;

    const xhr = new XMLHttpRequest();
    // Ajusta esta URL a la ruta de tu endpoint de API en el backend
    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/MarkKeyAsReceived`; // O el nombre de tu endpoint

    xhr.open("POST", apiUrl, true); // true para asíncrono
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success === true) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Éxito!",
                        html: `La fecha de la carga de llaves al POS: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serialPos}</span> asociado al Nro de ticket: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> fue registrada correctamente.`,
                        confirmButtonText: "Aceptar", // <-- OPCIONAL: Puedes personalizar el texto del botón
                        allowOutsideClick: false, // <-- ELIMINAR O COMENTAR esta línea
                        color: "black", // <-- ELIMINAR O COMENTAR esta línea
                       confirmButtonColor: "#003594", // <-- ELIMINAR O COMENTAR esta línea
                    }).then((result) => {
                        // Verifica si el botón de confirmación fue presionado
                        if (result.isConfirmed) {
                            location.reload(); // Recarga la página después de que el usuario haga clic en Aceptar
                        }
                    });
                  } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response.message || "No se pudo marcar la fecha de la llave.",
                    });
                }
            } catch (error) {
                console.error("Error al parsear la respuesta JSON:",error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al procesar la respuesta del servidor.",
                });
            }
        } else {
            console.error("Error en la solicitud:", xhr.status, xhr.statusText);
            Swal.fire({
                icon: "error",
                title: "Error de Servidor",
                text: `El servidor respondió con el estado: ${xhr.status} ${xhr.statusText}`,
            });
        }
    };

    xhr.onerror = function () {
        console.error("Error de red al intentar marcar la fecha de la llave.");
        Swal.fire({
            icon: "error",
            title: "Error de Red",
            text: "No se pudo conectar con el servidor. Verifica tu conexión.",
        });
    };

    // Envía el id_ticket como JSON en el cuerpo de la solicitud
    xhr.send(dataToSendString);
}

$(document).ready(function () {
  // 1. Declaración de referencias a elementos del DOM usando jQuery
  // Deben estar declaradas al inicio de $(document).ready para que sean accesibles en todo el bloque.
  const $uploadDocumentModalElement = $("#uploadDocumentModal"); // <-- Este es el modal DIV
  const $modalTicketIdSpan = $("#id_ticket");
  const $documentFileInput = $("#documentFile");
  const $imagePreview = $("#imagePreview");
  const $uploadFileBtn = $("#uploadFileBtn"); // <-- Este es el botón "Subir" dentro del modal
  const $uploadMessage = $("#uploadMessage");

  
  // Asegúrate de que ENDPOINT_BASE y APP_PATH estén definidos globalmente en el HTML
  // Si no, podrías definirlas aquí directamente si conoces las rutas estáticas:
  // const ENDPOINT_BASE = '/';
  // const APP_PATH = 'app/';

  // Función para mostrar mensajes
  function showMessage(message, type) {
    // Asegúrate de que el elemento existe antes de manipularlo
    if ($uploadMessage.length) {
      $uploadMessage.text(message);
      $uploadMessage
        .removeClass()
        .addClass(
          `message-box mt-2 p-2 rounded text-sm ${
            type === "success"
              ? "bg-green-100 text-green-700"
              : type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`
        );
      $uploadMessage.show(); // Asegúrate de que el mensaje sea visible
    }
  }

  // 2. Comprobar si el elemento del modal existe antes de crear la instancia
  // Esta instancia del modal debe crearse UNA VEZ, fuera del listener de clic,
  // pero dentro del $(document).ready
  let uploadDocumentModalInstance; // Declara la variable para la instancia del modal

  if ($uploadDocumentModalElement.length) {
    uploadDocumentModalInstance = new bootstrap.Modal(
      $uploadDocumentModalElement[0]
    ); // Crea la instancia de Bootstrap Modal
  }

  // 3. Listener para el clic en los botones "Ver Documento" en la tabla
  $(document).on("click", ".view-document-btn", function () {
    const urlDocument = $(this).data("url-document");
    const documentType = $(this).data("document-type");
    const filename = $(this).data("filename");
    const idTicket = $(this).data("id-ticket");
    const nroTicket = $(this).data("nro-ticket");
    const hasEnvio = $(this).data("has-envio") === true || $(this).data("has-envio") === 'true';
    const hasPresupuesto = $(this).data("has-presupuesto") === true || $(this).data("has-presupuesto") === 'true';
    const presupuestoPath = $(this).data("presupuesto-path") || '';
    
    // Llamar a la función showViewModal con los parámetros correctos
    if (typeof window.showViewModal === 'function') {
    if (documentType === 'pdf') {
        window.showViewModal(idTicket, nroTicket, null, urlDocument, filename, hasPresupuesto, presupuestoPath);
    } else {
        window.showViewModal(idTicket, nroTicket, urlDocument, null, filename, hasPresupuesto, presupuestoPath);
      }
    } else {
      console.error('showViewModal no está definida');
    }
  });

  // 4. Listener para el clic en los botones "Subir Documento" en la tabla
  // Usamos delegación de eventos con $(document).on('click', ...)
  // para los botones generados dinámicamente por DataTables.
   $(document).on("click", ".upload-document-btn", function () {
    // Verifica si la instancia del modal se creó correctamente
    if (uploadDocumentModalInstance) {
      const idTicket = $(this).data("id-ticket"); // Obtiene data-id-ticket del botón clicado
      const nroTicket = $(this).data('nro-ticket');

      $('#uploadDocumentModal').attr('data-id-ticket', idTicket);
      $("#htmlTemplateTicketId").val(idTicket);

      // Obtener referencias a los elementos
      const documentFileInput = document.getElementById('documentFile');
      const uploadFormElement = document.getElementById('uploadForm');
      const imagePreview = document.getElementById('imagePreview');
      const uploadMessage = document.getElementById('uploadMessage');
      const uploadFileBtn = document.getElementById('uploadFileBtn');
      const fileFormatInfo = document.getElementById('fileFormatInfo');

      // Limpiar el formulario y mensajes previos
      if (documentFileInput) {
        documentFileInput.value = ""; // Limpiar el input file
        documentFileInput.classList.remove('is-valid', 'is-invalid'); // Limpiar clases de validación
        // Limpiar estilos inline que puedan interferir
        documentFileInput.style.removeProperty("background-image");
        documentFileInput.style.removeProperty("background-position");
        documentFileInput.style.removeProperty("background-repeat");
        documentFileInput.style.removeProperty("background-size");
        documentFileInput.style.removeProperty("padding-right");
        documentFileInput.style.removeProperty("border-color");
        documentFileInput.style.removeProperty("box-shadow");
      }
      if (uploadFormElement) {
        uploadFormElement.classList.remove('was-validated'); // Limpiar clase de validación del formulario
      }

      // Restaurar visibilidad de los mensajes de feedback de Bootstrap
      const validFeedback = documentFileInput && documentFileInput.parentElement ? documentFileInput.parentElement.querySelector('.valid-feedback') : null;
      const invalidFeedback = documentFileInput && documentFileInput.parentElement ? documentFileInput.parentElement.querySelector('.invalid-feedback') : null;
      if (validFeedback) {
        validFeedback.style.display = '';
        validFeedback.style.visibility = '';
        validFeedback.style.opacity = '';
        validFeedback.style.removeProperty("height");
        validFeedback.style.removeProperty("margin");
        validFeedback.style.removeProperty("padding");
      }
      if (invalidFeedback) {
        invalidFeedback.style.display = '';
        invalidFeedback.style.visibility = '';
        invalidFeedback.style.opacity = '';
        invalidFeedback.style.removeProperty("height");
        invalidFeedback.style.removeProperty("margin");
        invalidFeedback.style.removeProperty("padding");
      }

      // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
      if (imagePreview) {
        imagePreview.style.display = "none"; // Ocultar previsualización
        imagePreview.src = "#"; // Restablecer la fuente de la imagen
      }
      const imagePreviewContainer = document.getElementById("imagePreviewContainer");
      if (imagePreviewContainer) {
        imagePreviewContainer.style.display = "none";
      }

      // Verificar que uploadMessage existe antes de usarlo
      if (uploadMessage) {
        uploadMessage.classList.add("hidden"); // Ocultar mensaje
        uploadMessage.textContent = ""; // Limpiar texto del mensaje
      }

      // Mostrar el mensaje informativo
      if (fileFormatInfo) {
        fileFormatInfo.style.display = "block";
        fileFormatInfo.style.visibility = "visible";
        fileFormatInfo.style.opacity = "1";
        fileFormatInfo.style.removeProperty("height");
        fileFormatInfo.style.removeProperty("margin");
        fileFormatInfo.style.removeProperty("padding");
      }

      // Deshabilitar el botón de subir al abrir el modal
      if (uploadFileBtn) {
        uploadFileBtn.disabled = true;
      }

      // Rellena el modal con los datos del ticket
      if ($modalTicketIdSpan.length) {
        $modalTicketIdSpan.text(nroTicket);
      }

      // Eliminar listeners previos para evitar duplicados
      if (documentFileInput) {
        documentFileInput.removeEventListener('change', handleFileSelectForUpload);
      }

      // Añadir el listener para validar el archivo seleccionado
      if (documentFileInput) {
        documentFileInput.addEventListener('change', handleFileSelectForUpload);
      }

      // Mostrar el modal
      uploadDocumentModalInstance.show();
    } else {
      console.error(
        "Error: Instancia de modal 'uploadDocumentModal' no encontrada. Asegúrate de que el elemento HTML del modal existe y Bootstrap JS está cargado."
      );
    }
  });


  
  function handleFileSelectForUpload(event) {
  const input = event.target;
  const file = input.files[0];
  const imagePreview = document.getElementById("imagePreview");
  const uploadMessage = document.getElementById("uploadMessage");
  const uploadFileBtn = document.getElementById("uploadFileBtn");
  const fileFormatInfo = document.getElementById("fileFormatInfo");
  const uploadForm = document.getElementById("uploadForm");

  // Limpiar estados previos
  input.classList.remove("is-valid", "is-invalid");
  if (uploadForm) {
    uploadForm.classList.remove("was-validated");
  }
  
  // Restaurar visibilidad de los mensajes de feedback de Bootstrap
  const validFeedback = input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
  const invalidFeedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
  if (validFeedback) {
    validFeedback.style.display = '';
  }
  if (invalidFeedback) {
    invalidFeedback.style.display = '';
  }
  
  // Mostrar el mensaje informativo cuando no hay validación (se ocultará después si hay archivo)
  if (fileFormatInfo) {
    fileFormatInfo.style.display = "block";
    fileFormatInfo.style.visibility = "visible";
  }
  
  // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
  if (imagePreview) {
  imagePreview.style.display = "none";
    imagePreview.src = "#";
  }
  // Verificar que uploadMessage existe antes de usarlo
  if (uploadMessage) {
  uploadMessage.classList.add("hidden");
  uploadMessage.textContent = "";
  }

  if (!file) {
    // Si no hay archivo, deshabilitar el botón
    if (uploadFileBtn) {
      uploadFileBtn.disabled = true;
    }
    return;
  }

  // Validar tipo de archivo - verificar la extensión (más confiable que MIME type)
  const validExtensions = [".jpg", ".png", ".gif", ".pdf"];
  const validMimeTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
  
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf("."));
  
  // Validar por extensión (más confiable) - DEBE estar en la lista
  const isValidExtension = validExtensions.includes(fileExtension);
  
  // Si hay MIME type, también debe ser válido
  const hasMimeType = file.type && file.type.trim() !== "";
  const isValidMimeType = hasMimeType ? validMimeTypes.includes(file.type) : true;
  
  // El archivo es válido SOLO si la extensión es válida
  // Si no hay extensión válida, el archivo es inválido independientemente del MIME type
  const isValid = isValidExtension && (isValidMimeType || !hasMimeType);

  // Agregar clase was-validated al formulario para que Bootstrap muestre los mensajes
  // Esto es necesario para que Bootstrap muestre los estilos de validación (borde rojo/verde e íconos)
  if (uploadForm) {
    uploadForm.classList.add("was-validated");
  }

  if (isValid) {
    // ARCHIVO VÁLIDO
    // Primero remover is-invalid para asegurar que no haya conflicto
    input.classList.remove("is-invalid");
    
    // Remover el background-image rojo (ícono de X) que Bootstrap aplica con is-invalid
    input.style.removeProperty("background-image");
    input.style.removeProperty("background-position");
    input.style.removeProperty("background-repeat");
    input.style.removeProperty("background-size");
    input.style.removeProperty("padding-right");
    
    // Limpiar estilos inline que puedan interferir
    input.style.removeProperty("border-color");
    input.style.removeProperty("box-shadow");
    
    // Luego agregar is-valid - Bootstrap aplicará automáticamente el ícono verde (checkmark)
    input.classList.add("is-valid");
    
    // OCULTAR COMPLETAMENTE el mensaje inválido y su ícono rojo
    const invalidFeedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
    if (invalidFeedback) {
      invalidFeedback.style.setProperty("display", "none", "important");
      invalidFeedback.style.setProperty("visibility", "hidden", "important");
      invalidFeedback.style.setProperty("opacity", "0", "important");
      invalidFeedback.style.setProperty("height", "0", "important");
      invalidFeedback.style.setProperty("margin", "0", "important");
      invalidFeedback.style.setProperty("padding", "0", "important");
    }
    // También usar jQuery para forzar la ocultación
    if (typeof $ !== 'undefined') {
      $('.invalid-feedback').hide();
    }
    
    // MOSTRAR el mensaje válido y su ícono verde
    const validFeedback = input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
    if (validFeedback) {
      validFeedback.style.setProperty("display", "block", "important");
      validFeedback.style.setProperty("visibility", "visible", "important");
      validFeedback.style.setProperty("opacity", "1", "important");
      validFeedback.style.removeProperty("height");
      validFeedback.style.removeProperty("margin");
      validFeedback.style.removeProperty("padding");
    }
    // También usar jQuery para forzar la visualización
    if (typeof $ !== 'undefined') {
      $('.valid-feedback').show();
    }
    
    // OCULTAR el mensaje informativo cuando hay validación activa (archivo válido)
    if (fileFormatInfo) {
      fileFormatInfo.style.setProperty("display", "none", "important");
      fileFormatInfo.style.setProperty("visibility", "hidden", "important");
      fileFormatInfo.style.setProperty("opacity", "0", "important");
      fileFormatInfo.style.setProperty("height", "0", "important");
      fileFormatInfo.style.setProperty("margin", "0", "important");
      fileFormatInfo.style.setProperty("padding", "0", "important");
    }
    // También usar jQuery para asegurar que se oculte
    if (typeof $ !== 'undefined') {
      $('#fileFormatInfo').hide();
    }
    
    // Habilitar el botón de subir
    if (uploadFileBtn) {
      uploadFileBtn.disabled = false;
    }
    
    // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
    if (imagePreview) {
        imagePreview.style.display = "none";
      imagePreview.src = "#";
      }
    } else {
    // ARCHIVO INVÁLIDO
    // PRIMERO: Asegurarse de que NO tenga is-valid (esto es crítico para ocultar el ícono verde)
    input.classList.remove("is-valid");
    
    // Remover el background-image verde (ícono de checkmark) que Bootstrap aplica con is-valid
    input.style.removeProperty("background-image");
    input.style.removeProperty("background-position");
    input.style.removeProperty("background-repeat");
    input.style.removeProperty("background-size");
    input.style.removeProperty("padding-right");
    
    // Remover cualquier estilo inline que pueda interferir
    input.style.removeProperty("border-color");
    input.style.removeProperty("box-shadow");
    input.style.removeProperty("border");
    
    // SEGUNDO: Agregar is-invalid - Bootstrap aplicará automáticamente el borde rojo y el ícono rojo (X)
    input.classList.add("is-invalid");
    
    // Asegurar que el formulario tenga was-validated (ya se agregó arriba, pero lo verificamos)
    if (uploadForm && !uploadForm.classList.contains("was-validated")) {
      uploadForm.classList.add("was-validated");
    }
    
    // Forzar el ícono rojo (X) y el borde rojo de Bootstrap
    // Bootstrap usa background-image con un SVG para el ícono de error
    // SVG del ícono de error de Bootstrap (X roja)
    const invalidIconSvg = "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\")";
    
    // Aplicar estilos para el ícono rojo inmediatamente
    input.style.setProperty("background-image", invalidIconSvg, "important");
    input.style.setProperty("background-repeat", "no-repeat", "important");
    input.style.setProperty("background-position", "right calc(0.375em + 0.1875rem) center", "important");
    input.style.setProperty("background-size", "calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)", "important");
    input.style.setProperty("padding-right", "calc(1.5em + 0.75rem)", "important");
    
    // Forzar el borde rojo de Bootstrap usando CSS inline como respaldo
    // Bootstrap usa border-color: #dc3545 para is-invalid
    // También usar setTimeout para asegurar que se ejecute después del reflow del DOM
    setTimeout(() => {
      // Verificar y forzar que NO tenga is-valid (muy importante)
      if (input.classList.contains("is-valid")) {
        input.classList.remove("is-valid");
      }
      // Verificar y forzar la clase is-invalid si no está presente
      if (!input.classList.contains("is-invalid")) {
        input.classList.add("is-invalid");
      }
      
      // Forzar nuevamente el ícono rojo
      input.style.setProperty("background-image", invalidIconSvg, "important");
      input.style.setProperty("background-repeat", "no-repeat", "important");
      input.style.setProperty("background-position", "right calc(0.375em + 0.1875rem) center", "important");
      input.style.setProperty("background-size", "calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)", "important");
      input.style.setProperty("padding-right", "calc(1.5em + 0.75rem)", "important");
      
      // Aplicar borde rojo directamente si Bootstrap no lo hace
      const computedStyle = window.getComputedStyle(input);
      if (computedStyle.borderColor !== 'rgb(220, 53, 69)' && computedStyle.borderColor !== '#dc3545') {
        input.style.setProperty("border-color", "#dc3545", "important");
        input.style.setProperty("box-shadow", "0 0 0 0.2rem rgba(220, 53, 69, 0.25)", "important");
      }
    }, 50);
    
    // También ejecutar después de un pequeño delay adicional para asegurar
    setTimeout(() => {
      // Forzar nuevamente que NO tenga is-valid
      input.classList.remove("is-valid");
      // Forzar que SÍ tenga is-invalid
      if (!input.classList.contains("is-invalid")) {
        input.classList.add("is-invalid");
      }
      // Forzar nuevamente el ícono rojo
      input.style.setProperty("background-image", invalidIconSvg, "important");
      input.style.setProperty("background-repeat", "no-repeat", "important");
      input.style.setProperty("background-position", "right calc(0.375em + 0.1875rem) center", "important");
      input.style.setProperty("background-size", "calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)", "important");
      input.style.setProperty("padding-right", "calc(1.5em + 0.75rem)", "important");
    }, 100);
    
    // OCULTAR COMPLETAMENTE el mensaje válido y su ícono verde
    const validFeedback = input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
    if (validFeedback) {
      validFeedback.style.setProperty("display", "none", "important");
      validFeedback.style.setProperty("visibility", "hidden", "important");
      validFeedback.style.setProperty("opacity", "0", "important");
      validFeedback.style.setProperty("height", "0", "important");
      validFeedback.style.setProperty("margin", "0", "important");
      validFeedback.style.setProperty("padding", "0", "important");
    }
    // También usar jQuery para forzar la ocultación
    if (typeof $ !== 'undefined') {
      $('.valid-feedback').hide();
    }
    
    // MOSTRAR el mensaje inválido y su ícono rojo
    const invalidFeedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
    if (invalidFeedback) {
      invalidFeedback.style.setProperty("display", "block", "important");
      invalidFeedback.style.setProperty("visibility", "visible", "important");
      invalidFeedback.style.setProperty("opacity", "1", "important");
      invalidFeedback.style.removeProperty("height");
      invalidFeedback.style.removeProperty("margin");
      invalidFeedback.style.removeProperty("padding");
    }
    // También usar jQuery para forzar la visualización
    if (typeof $ !== 'undefined') {
      $('.invalid-feedback').show();
    }
    
    // OCULTAR el mensaje informativo cuando hay validación activa (archivo inválido)
    if (fileFormatInfo) {
      fileFormatInfo.style.setProperty("display", "none", "important");
      fileFormatInfo.style.setProperty("visibility", "hidden", "important");
      fileFormatInfo.style.setProperty("opacity", "0", "important");
      fileFormatInfo.style.setProperty("height", "0", "important");
      fileFormatInfo.style.setProperty("margin", "0", "important");
      fileFormatInfo.style.setProperty("padding", "0", "important");
    }
    // También usar jQuery para asegurar que se oculte
    if (typeof $ !== 'undefined') {
      $('#fileFormatInfo').hide();
    }
    
    // Deshabilitar el botón de subir
    if (uploadFileBtn) {
      uploadFileBtn.disabled = true;
    }
    
    // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
    if (imagePreview) {
      imagePreview.style.display = "none";
      imagePreview.src = "#";
    }
    
    // Limpiar el input después de 6 segundos (aumentado de 3 a 6 segundos)
    setTimeout(() => {
      input.value = "";
      input.classList.remove("is-invalid");
      input.style.borderColor = "";
      input.style.boxShadow = "";
      if (uploadForm) {
        uploadForm.classList.remove("was-validated");
      }
      // Mostrar nuevamente el mensaje informativo
      if (fileFormatInfo) {
        fileFormatInfo.style.removeProperty("display");
        fileFormatInfo.style.removeProperty("visibility");
        fileFormatInfo.style.removeProperty("opacity");
        fileFormatInfo.style.removeProperty("height");
        fileFormatInfo.style.removeProperty("margin");
        fileFormatInfo.style.removeProperty("padding");
      }
      // También usar jQuery para asegurar que se muestre
      if (typeof $ !== 'undefined') {
        $('#fileFormatInfo').show();
      }
      // Restaurar visibilidad de los mensajes de feedback
      const validFeedback = input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
      const invalidFeedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
      if (validFeedback) {
        validFeedback.style.display = '';
        validFeedback.style.visibility = '';
      }
      if (invalidFeedback) {
        invalidFeedback.style.display = '';
        invalidFeedback.style.visibility = '';
      }
    }, 6000); // Aumentado de 3000ms a 6000ms (6 segundos)
  }
  }

  async function handleUploadButtonClick(ticketId, documentType, uploadModalBootstrap, ticketNumber) {
      const id_user = document.getElementById("userId");
      if (!id_user) {
          console.error("Elemento userId no encontrado");
          return;
      }
      
      const documentFileInput = document.getElementById("documentFile");
      if (!documentFileInput) {
          console.error("Elemento documentFile no encontrado");
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo encontrar el campo de archivo.',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#003594',
          });
          return;
      }
      
      const uploadMessage = document.getElementById("uploadMessage");
      // El elemento uploadMessage puede no existir, así que verificamos antes de usarlo
      if (uploadMessage) {
      uploadMessage.classList.add("hidden");
      uploadMessage.textContent = "";
      }
      
      const file = documentFileInput.files[0];

      if (!file) {
          Swal.fire({
              icon: 'warning',
              title: '¡Advertencia!',
              text: 'Por favor, selecciona un archivo antes de continuar.',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#003594',
              color: 'black',
          });
          return;
      }

      // 1. Create a FormData object to handle the file upload.
      const formData = new FormData();
      formData.append("action", "uploadDocument");
      formData.append("ticket_id", ticketId);
      formData.append("nro_ticket", ticketNumber); // Añadir el número de ticket
      formData.append("document_type", documentType);
      
      // 2. Append the file object directly. Do NOT use encodeURIComponent().
      formData.append("document_file", file); 
      formData.append("id_user", id_user.value);

      const xhr = new XMLHttpRequest();
      const url = `${ENDPOINT_BASE}${APP_PATH}api/reportes/uploadDocumentTec`;

      xhr.open("POST", url);

      // 3. Remove the Content-Type header. The browser will set the correct one (multipart/form-data) automatically.
      //\\ xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // <-- REMOVE THIS LINE

      xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              let result;
              try {
                  result = JSON.parse(xhr.responseText);
              } catch (e) {
                  result = { success: false, message: 'Error de respuesta del servidor.' };
              }

              if (xhr.status === 200 && result.success) {
                Swal.fire({
                  icon: 'success',
                  title: '¡Éxito!',
                  text: result.message,
                  confirmButtonColor: '#003594',
                  confirmButtonText: 'Ok',
                  color: 'black',
                }).then((result) => {
                  window.location.reload();
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: result.message || 'Error al subir el documento.',
                  confirmButtonColor: '#003594',
                });
              }
          }
      };
      
      xhr.onerror = function() {
          Swal.fire({
              icon: 'error',
              title: 'Error de red',
              text: 'Error de red o del servidor al subir el documento.',
              confirmButtonColor: '#003594',
          });
      }
      // 4. Send the FormData object.
      xhr.send(formData);
  }

  // 5. Evento para el botón de subir archivo (dentro del modal)
  if ($uploadFileBtn.length) {
    $uploadFileBtn.on("click", async function () {
      const file = $documentFileInput[0].files[0];
      const nro_ticket = $modalTicketIdSpan.text();
      const id_ticket = $('#uploadDocumentModal').data('id-ticket'); // OBTENER EL ID_TICKET

      const id_user = document.getElementById("userId").value; // Aquí se debe obtener el id_user del usuario logueado
      if (!file) {
        showMessage("Por favor, seleccione un archivo para subir.", "error");
        return;
      }

      //showMessage("Subiendo documento...", "info");

      const formData = new FormData();
      formData.append("nro_ticket", nro_ticket);
      formData.append("document_file", file);
      // *** AÑADIR EL MIME TYPE DEL ARCHIVO AL formData ***
      formData.append("mime_type", file.type);
      formData.append("action", "uploadDocument"); // Ya estaba aquí, pero se mantiene para la claridad
      formData.append("id_user", id_user); // Aquí se debe obtener el id_user del usuario logueado
      formData.append("document_type", "Envio_Destino");
      formData.append("ticket_id", id_ticket); // AÑADIR EL ID_TICKET AL formData


      try {
        const uploadUrl = `${ENDPOINT_BASE}${APP_PATH}api/reportes/uploadDocument`;

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok && result.success) {
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: `El Documento ha sido guardado exitosamente.`,
            confirmButtonText: "Aceptar", // <-- OPCIONAL: Puedes personalizar el texto del botón
            allowOutsideClick: false, // <-- ELIMINAR O COMENTAR esta línea
            color: "black", // <-- ELIMINAR O COMENTAR esta línea
            confirmButtonColor: "#003594", // <-- ELIMINAR O COMENTAR esta línea
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload(); // Recarga la página después de que el usuario haga clic en Aceptar
            }
          });
           if (uploadDocumentModalInstance) {  
            uploadDocumentModalInstance.hide();
          }
          // Opcional: $('#tuTablaID').DataTable().ajax.reload();
        } else {
          showMessage(
            `Error al subir documento: ${
              result.message || "Error desconocido."
            }`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error en la subida:", error);
        showMessage("Error de conexión al subir el documento.", "error");
      }
    });
  }

  // 6. Evento que se dispara cuando el modal se ha ocultado completamente
  if ($uploadDocumentModalElement.length) {
    $uploadDocumentModalElement.on("hidden.bs.modal", function () {
      // Limpiar todo después de que el modal se oculta
      if ($modalTicketIdSpan.length) $modalTicketIdSpan.text("");
      if ($documentFileInput.length) $documentFileInput.val("");
      if ($imagePreview.length) {
        $imagePreview.hide();
        $imagePreview.attr("src", "#");
      }
      if ($uploadMessage.length) {
        $uploadMessage.text("");
        $uploadMessage.hide();
      }
    });
  }
}); // Cierre correcto de $(document).ready

document.addEventListener("DOMContentLoaded", function () {
    // --- Referencias a elementos del MODAL DE VISUALIZACIÓN ---
    const viewDocumentModalElement = document.getElementById("viewDocumentModal");
    const viewDocumentBootstrapModal = new bootstrap.Modal(viewDocumentModalElement);

    const viewModalTicketIdSpan = document.getElementById("viewModalTicketId");
    const imageViewPreview = document.getElementById("imageViewPreview");
    const pdfViewViewer = document.getElementById("pdfViewViewer");
    const viewDocumentMessage = document.getElementById("viewDocumentMessage");
    const nameDocumento = document.getElementById("NombreImage");
    // Función auxiliar para mostrar el documento en el MODAL
    function displayDocumentInViewModal(filePath, mimeType, originalName) {
      imageViewPreview.style.display = "none";
      pdfViewViewer.style.display = "none";
      viewDocumentMessage.classList.add("hidden");
      viewDocumentMessage.textContent = "";
      nameDocumento.textContent = originalName;
        
      // La ruta que recibes del backend ya debería ser 'uploads_tickets/...'
      const documentPathFromBackend = filePath; 
      // AQUI ESTA LA CORRECCIÓN: Concatena la ruta de tu servidor con la ruta del backend
      const fullUrl = `http://localhost/SoportePost/${documentPathFromBackend}`;

      if (mimeType.startsWith("image/")) {
        imageViewPreview.src = fullUrl; // Usa la URL completa aquí
        imageViewPreview.style.display = "block";
      } else if (mimeType === "application/pdf") {
        // Para PDF, también debes usar la URL completa
        pdfViewViewer.innerHTML = `<embed src="${fullUrl}" type="application/pdf" width="100%" height="100%">`;
        pdfViewViewer.style.display = "block";
      }
    }

    // --- Listener para el evento 'click' en el botón 'Ver Imagen' ---
    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("See_imagen")) {
            const button = event.target;
            const idTicket = button.getAttribute("data-id-ticket");
            const nro_ticket = button.getAttribute("data-nro-ticket");
            const documentType = button.getAttribute("data-document-type");

            viewDocumentBootstrapModal.show();

            // Limpiar y preparar el modal
            viewModalTicketIdSpan.textContent = nro_ticket;
            imageViewPreview.src = "#";
            imageViewPreview.style.display = "none";
            pdfViewViewer.innerHTML = "";
            pdfViewViewer.style.display = "none";
            viewDocumentMessage.classList.add("hidden");

            // Mostrar mensaje de carga
            viewDocumentMessage.classList.remove("hidden");
            viewDocumentMessage.textContent = "Cargando documento...";
            viewDocumentMessage.classList.add("info");

            // Preparar los datos a enviar
            const dataToSendString = `action=getDocument&ticket_id=${encodeURIComponent(idTicket)}&document_type=${encodeURIComponent(documentType)}`;

            // Realizar la petición con XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/getDocument`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);

                        // **CORREGIDO:** Acceder al primer elemento del array 'document'
                        if (data.success && data.document && data.document.length > 0) { 
                            const documentData = data.document[0];
                            const documentPath = documentData.file_path;
                            const mimeType = documentData.mime_type;
                            const nameoriginal = documentData.original_filename

                            
                            // Llama a la función que mostrará el documento
                            displayDocumentInViewModal(documentPath, mimeType, nameoriginal);
                            viewDocumentMessage.style.display = "none";
                        } else {
                            viewDocumentMessage.classList.remove("hidden");
                            viewDocumentMessage.classList.add("error");
                            viewDocumentMessage.textContent = data.message || "Documento no encontrado.";
                        }
                    } catch (e) {
                        console.error("Error al parsear la respuesta JSON:", e);
                        viewDocumentMessage.classList.remove("hidden");
                        viewDocumentMessage.classList.add("error");
                        viewDocumentMessage.textContent = "Error al procesar la respuesta del servidor.";
                    }
                } else {
                    console.error("Error en la petición XMLHttpRequest:", xhr.status, xhr.statusText);
                    viewDocumentMessage.classList.remove("hidden");
                    viewDocumentMessage.classList.add("error");
                    viewDocumentMessage.textContent = `Error del servidor: ${xhr.status} - ${xhr.statusText}`;
                }
            };

            xhr.onerror = function () {
                console.error("Error de red en la petición XMLHttpRequest.");
                viewDocumentMessage.classList.remove("hidden");
                viewDocumentMessage.classList.add("error");
                viewDocumentMessage.textContent = "Error de red.";
            };

            xhr.send(dataToSendString);
        }
    });
});

/**
 * Envía los datos del ticket y los componentes seleccionados a la API regional.
 * Muestra un modal de SweetAlert2 con el resultado de la operación.
 * @param {string} ticketId El ID del ticket a enviar.
 * @param {Array<string>} selectedComponents Un array con los IDs de los componentes seleccionados.
 * @param {string} serial_Pos El número de serie del POS.
 */
function sendToRegion(ticketId, selectedComponents, serial_Pos) { 
    const id_ticket = ticketId;
    const id_user = document.getElementById("userId").value; // Obtiene el ID del usuario desde el formulario
    const component = selectedComponents;
    const pos_serial = serial_Pos;
    const modulo = "Gestión Rosal";

    const regionalApiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToRegion`; // Reemplaza con la URL real de tu API
    const dataToSendString = `action=SendToRegion&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(id_ticket)}&components=${encodeURIComponent(component)}&pos_serial=${encodeURIComponent(pos_serial)}&modulo=${encodeURIComponent(modulo)}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", regionalApiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        Swal.close(); // Cierra el modal de carga

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                  Swal.fire({
                    title: "¡Éxito!",
                    html: `El Pos: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serial_Pos}</span> Fue enviado a la región con el componente seleccionado.`,
                    icon: "success",
                    confirmButtonText: "Ok",
                    color: "black",
                    confirmButtonColor: "#003594",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.reload();
                    }
                  });
                } else {
                    Swal.fire('Error', response.message || 'Hubo un problema al enviar el ticket.', 'error');
                }
            } catch (e) {
                Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
            }
        } else {
            Swal.fire('Error', `Error en la solicitud: ${xhr.status} ${xhr.statusText}`, 'error');
        }
    };

    xhr.onerror = function() {
        Swal.close(); // Cierra el modal de carga en caso de error de red
        Swal.fire('Error de red', 'No se pudo conectar con el servidor. Intente de nuevo más tarde.', 'error');
    };

    xhr.send(dataToSendString);
}

function sendToRegionWithoutComponent(ticketId, serial_Pos) {
    const id_ticket = ticketId;
    const id_user = document.getElementById("userId").value; // Obtiene el ID del usuario desde el formulario

    const regionalApiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/sendToRegionWithoutComponent`; // Reemplaza con la URL real de tu API
    const dataToSendString = `action=sendToRegionWithoutComponent&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(id_ticket)}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", regionalApiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        Swal.close(); // Cierra el modal de carga
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                  Swal.fire({
                    title: "¡Éxito!",
                    html: `El Pos: <span style = "padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serial_Pos}</span> Fue enviado a la región sin componentes.`,
                    icon: "success",
                    confirmButtonText: "Ok",
                    color: "black",
                    confirmButtonColor: "#003594",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.reload();
                    }
                  });
                } else {
                    Swal.fire('Error', response.message || 'Hubo un problema al enviar el ticket.', 'error');
                }
            } catch (e) {
                Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
            }
        } else {
          Swal.fire('Error', `Error en la solicitud: ${xhr.status} ${xhr.statusText}`, 'error');
        }
    }; 
    xhr.onerror = function() {
        Swal.close(); // Cierra el modal de carga en caso de error de red
        Swal.fire('Error de red', 'No se pudo conectar con el servidor. Intente de nuevo más tarde.', 'error');
    };
    xhr.send(dataToSendString);      
}

// Función para obtener el nombre de la región (ajusta según tu estructura)
function obtenerRegionName() {
  const regionSelect = document.getElementById('AsiganrCoordinador');
  if (regionSelect && regionSelect.selectedOptions.length > 0) {
    return regionSelect.selectedOptions[0].text;
  }
  return 'Sin región asignada';
}

function SendBacktoTaller(ticketId, nroTicket){
  const id_user = document.getElementById("userId").value;
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendBackToTaller`
  ); // Necesitas una nueva ruta de API para esto
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          Swal.fire({
                title: "¡Enviado Al Taller!",
                html: `El Pos asociado al ticket Nro: <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nroTicket}</span> ha sido enviado de vuelto al taller.`, // <-- CAMBIO AQUÍ
                icon: "success",
                color: "black",
                confirmButtonColor: "#003594",
                focusConfirm: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                keydownListenerCapture: true,
            }).then(() => {
               window.location.reload(); // Volver a cargar la tabla para reflejar los cambios
            });
        } else {
          Swal.fire(
            "Error",
            response.message ||
              "Hubo un error al marcar el ticket como recibido.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Error al procesar la respuesta del servidor.",
          "error"
        );
        console.error("Error parsing JSON for markTicketAsReceived:", error);
      }
    } else {
      Swal.fire(
        "Error",
        `Error al conectar con el servidor: ${xhr.status} ${xhr.statusText}`,
        "error"
      );
      console.error(
        "Error en markTicketAsReceived:",
        xhr.status,
        xhr.statusText
      );
    }
  };
  xhr.onerror = function () {
    Swal.fire(
      "Error",
      "Error de red al intentar marcar el ticket como recibido.",
      "error"
    );
    console.error("Network error for markTicketAsReceived");
  };

  const data = `action=SendBackToTaller&id_ticket=${ticketId}&id_user=${encodeURIComponent(
    id_user
  )}`;
  xhr.send(data);
}

function CloseTicket(ticketId) {
    const id_user = document.getElementById("userId").value;
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `${ENDPOINT_BASE}${APP_PATH}api/consulta/CloseTicket`
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Primer modal: Notificación de falla en el camino
                    Swal.fire({
                        icon: "warning",
                        title: "¡Ticket Cerrado por Falla en el Camino! ⚠️",
                        text: "El POS ha presentado una falla durante el traslado. El ticket se cerrará y se deberá abrir uno nuevo para el reingreso a taller.",
                        color: "black",
                        showConfirmButton: false,
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#003594 ", // Color rojo para advertencia
                        timer: 2200,
                        timerProgressBar: true,
                        didOpen: () => {
                          Swal.showLoading();
                        },
                        willClose: () => {
                            // Cuando el primer modal se cierra, mostramos el segundo modal con los detalles
                            const ticketData = response.ticket_data[0];
                            if (ticketData) {
                                const beautifulHtmlContent = `
                                    <div style="text-align: left; padding: 15px;">
                                        <h3 style="color: #dc3545; margin-bottom: 15px; text-align: center;">❌ ¡Ticket Cerrado! ❌</h3>
                                        <p style="font-size: 1.1em; margin-bottom: 10px;">
                                            <strong>🎫 Nro. de Ticket:</strong> <span style="font-weight: bold; color: #d9534f;">${ticketData.nro_ticket}</span>
                                        </p>
                                        <p style="margin-bottom: 8px;">
                                          <strong style="color: black;">📅 Fecha de Creación:</strong> <span>${ticketData.create_ticket}</span>
                                        </p>
                                        <p style="margin-bottom: 8px;">
                                            <strong>⚙️ Serial del Equipo:</strong> <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${ticketData.serial_pos}</span>
                                        </p>
                                        <p style="margin-bottom: 8px;">
                                            <strong>🚨 Falla:</strong> <span style="color: #dc3545; font-weight: bold;">${ticketData.name_failure || "Sin comentarios"}</span>
                                        </p>
                                        <p style="margin-bottom: 8px;">
                                            <strong>📋 Acción Original:</strong> <span style="color: #007bff; font-weight: bold;">${ticketData.name_accion_ticket}</span>
                                        </p>
                                        <p style="margin-bottom: 8px;">
                                            <strong>🔬 Estado del Taller:</strong> <span style="color: #20c997; font-weight: bold;">${ticketData.name_status_lab || "N/A"}</span>
                                        </p>
                                        <p style="margin-bottom: 8px;">
                                          <strong>📝 Estado del Ticket:</strong> <span style="color: #4d20c9ff; font-weight: bold;">${ticketData.name_status_ticket || "N/A"}</span>
                                        </p>
                                        <p style="font-size: 0.9em; color: green; margin-top: 20px; text-align: center;">
                                            El ticket ha sido cerrado. Debe generar un nuevo ticket para reingresar al Taller con la falla correspondiente.
                                        </p>
                                    </div>`;

                                Swal.fire({
                                    icon: "error",
                                    title: "Detalles del Reingreso a Lab",
                                    html: beautifulHtmlContent,
                                    color: "black",
                                    confirmButtonText: "Cerrar",
                                    confirmButtonColor: "#003594",
                                    showConfirmButton: true,
                                    showClass: {
                                        popup: "animate__animated animate__fadeInDown",
                                    },
                                    hideClass: {
                                        popup: "animate__animated animate__fadeOutUp",
                                    },
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    width: '700px'
                                }).then(() => {
                                    window.location.reload();
                                });
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error al Obtener Datos",
                                    text: "El ticket ha sido cerrado, pero no se pudieron obtener los datos de reingreso.",
                                    confirmButtonText: "Cerrar",
                                    confirmButtonColor: "#003594"
                                }).then(() => {
                                    window.location.reload();
                                });
                            }
                        },
                    });
                } else {
                    Swal.fire(
                        "Error",
                        response.message || "Hubo un error al marcar el ticket como recibido.",
                        "error"
                    );
                }
            } catch (error) {
                Swal.fire(
                    "Error",
                    "Error al procesar la respuesta del servidor.",
                    "error"
                );
                console.error("Error parsing JSON for markTicketAsReceived:", error);
            }
        } else {
            Swal.fire(
                "Error",
                `Error al conectar con el servidor: ${xhr.status} ${xhr.statusText}`,
                "error"
            );
            console.error(
                "Error en markTicketAsReceived:",
                xhr.status,
                xhr.statusText
            );
        }
    };
    xhr.onerror = function () {
        Swal.fire(
            "Error",
            "Error de red al intentar marcar el ticket como recibido.",
            "error"
        );
        console.error("Network error for markTicketAsReceived");
    };

    const data = `action=CloseTicket&id_ticket=${ticketId}&id_user=${encodeURIComponent(
        id_user
    )}`;
    xhr.send(data);
}

$(document).on('click', '#generateNotaEntregaBtn', function () {
    const ticketId = document.getElementById('htmlTemplateTicketId').value;
    if (!ticketId) {
        Swal.fire({ icon: 'warning', title: 'Ticket no disponible' });
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/documents/GetDeliveryNoteData`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const res = JSON.parse(xhr.responseText);
                if (!res || !res.success || !res.rows) {
                    Swal.fire({ icon: 'warning', title: 'No se encontraron datos' });
                    return;
                }

                const d = res.rows[0];
                window.currentDeliveryData = d;
                const serialPos = d.serialpos || d.serial_pos || '';
                const lastFourSerialDigits = serialPos.slice(-4);
                const notaNumero = `NE-${ticketId}-${lastFourSerialDigits}`;
                const regDes = 'Caracas';

                $('#htmlTemplateTicketId').val(ticketId);
                $('#ne_fecha').val(d.fecha_actual || new Date().toLocaleDateString());
                $('#ne_numero').val(notaNumero);
                $('#ne_rif').val(d.coddocumento || '');
                $('#ne_razon').val(d.razonsocial || '');
                $('#ne_responsable').val(d.rlegal || '');
                $('#ne_contacto').val(d.telf1 || 'Sin número de Contacto');
                $('#ne_tipo_equipo').val(d.tipo_equipo || d.tipo_pos || 'POS');
                $('#ne_modelo').val(d.modelo || d.desc_modelo || '');
                $('#ne_serial').val(d.serialpos || d.serial_pos || '');
                $('#ne_region_origen').val(regDes);
                $('#ne_region_destino').val(d.estado_final || d.estado || '');
                $('#ne_observaciones').val('');
                $('#ne_componentes').val(d.componentes || 'Sin componentes');
                
                // ✅ AGREGAR ESTOS CAMPOS
                $('#ne_banco').val(d.ibp || 'Sin banco');
                $('#ne_proveedor').val(d.proveedor || 'Sin proveedor');

                // 1. Obtiene la instancia del modal o la crea si no existe
                const htmlModal = new bootstrap.Modal(document.getElementById('htmlTemplateModal'));
                htmlModal.show();
                
                // 2. Adjunta el evento de clic al botón de cerrar
                $('#closeHtmlTemplateBtn').on('click', function () {
                     htmlModal.hide();
                });

            } catch (e) {
                Swal.fire({ icon: 'error', title: 'Respuesta inválida del servidor' });
            }
        } else {
            Swal.fire({ icon: 'error', title: 'Error de red/servidor' });
        }
    };

    const params = `action=GetDeliveryNoteData&id_ticket=${encodeURIComponent(ticketId)}`;
    xhr.send(params);
});

// ✅ FUNCIÓN ACTUALIZADA
$(document).on('click', '#previewHtmlTemplateBtn', function () {
  const data = {
    fecha: $('#ne_fecha').val(),
    numero: $('#ne_numero').val(),
    rif: $('#ne_rif').val(),
    razon: $('#ne_razon').val(),
    responsable: $('#ne_responsable').val(),
    tipo_equipo: $('#ne_tipo_equipo').val(),
    modelo: $('#ne_modelo').val(),
    serial: $('#ne_serial').val(),
    region_origen: $('#ne_region_origen').val(),
    region_destino: $('#ne_region_destino').val(),
    observaciones: $('#ne_observaciones').val(),
    componentes: $('#ne_componentes').val(),
    banco: $('#ne_banco').val(), // ✅ AGREGAR
    proveedor: $('#ne_proveedor').val(), // ✅ AGREGAR
    tecnico_responsable: window.currentDeliveryData?.full_name_tecnico_responsable || 'Sin técnico asignado'
  };

  const html = buildDeliveryNoteHtml(data);

  const iframe = document.getElementById('htmlTemplatePreview');
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
});

function buildDeliveryNoteHtml(d) {
  const safe = (s) => (s || '').toString();
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nota de Entrega y Envío de Equipo</title>
      <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 11px;
        line-height: 1.2;
        color: #333;
        background: #fff;
        padding: 10px;
        max-width: 100%;
        margin: 0 auto;
        overflow-x: hidden;
      }
      
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        min-height: calc(100vh - 40px);
        display: flex;
        flex-direction: column;
      }
      
      .header {
        text-align: center;
        margin-bottom: 12px;
        padding: 8px 0;
        border-bottom: 2px solid #2c5aa0;
        position: relative;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #2c5aa0 0%, #4a90e2 50%, #2c5aa0 100%);
      }
      
      .company-logo-img {
        max-width: 120px;
        max-height: 60px;
        margin-bottom: 8px;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      
      .company-address {
        font-size: 10px;
        color: #555;
        margin-bottom: 8px;
        line-height: 1.3;
        text-align: center;
        font-weight: 500;
      }
      
      .document-title {
        font-size: 16px;
        font-weight: bold;
        color: #2c5aa0;
        margin: 4px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .document-subtitle {
        font-size: 11px;
        color: #666;
        font-weight: 500;
      }
      
      .document-info {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        padding: 8px;
        background: #f8f9fa;
        border-radius: 5px;
        border-left: 3px solid #2c5aa0;
      }
      
      .info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
      }
      
      .info-label {
        font-size: 9px;
        color: #666;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 3px;
      }
      
      .info-value {
        font-size: 12px;
        font-weight: bold;
        color: #2c5aa0;
      }
      
      .content-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .section {
        margin: 6px 0;
        background: #fff;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        border: 1px solid #e9ecef;
      }
      
      .section-header {
        background: linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%);
        color: white;
        padding: 6px 10px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      
      .section-content {
        padding: 8px 10px;
      }
      
      .two-columns {
        display: flex;
        gap: 15px;
      }
      
      .column {
        flex: 1;
      }
      
      .column-title {
        font-size: 11px;
        font-weight: bold;
        color: #2c5aa0;
        margin-bottom: 8px;
        text-align: center;
        padding: 4px;
        background: #f0f4f8;
        border-radius: 3px;
        border-left: 3px solid #2c5aa0;
      }
      
      .field-row {
        display: flex;
        margin-bottom: 4px;
        align-items: flex-start;
      }
      
      .field-row:last-child {
        margin-bottom: 0;
      }
      
      .field-label {
        font-weight: 600;
        color: #555;
        min-width: 110px;
        margin-right: 8px;
        font-size: 10px;
        padding-top: 2px;
      }
      
      .field-value {
        flex: 1;
        color: #333;
        font-weight: 500;
        padding: 3px 8px;
        background: #f8f9fa;
        border-radius: 3px;
        border-left: 2px solid #2c5aa0;
        font-size: 10px;
        min-height: 20px;
        display: flex;
        align-items: center;
      }
      
      .field-value.observations {
        background: #fff;
        border: 1px solid #ddd;
        min-height: 25px;
        font-style: italic;
        align-items: flex-start;
        padding-top: 5px;
      }
      
      .constancy {
        background: #e8f4fd;
        border: 1px solid #b3d9ff;
        border-radius: 5px;
        padding: 8px;
        margin: 8px 0;
        text-align: center;
        font-size: 10px;
        line-height: 1.4;
        color: #2c5aa0;
        font-weight: 500;
      }
      
      .signature-section {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 20px;
      }
      
      .signature-box {
        flex: 1;
        max-width: 280px;
        text-align: center;
        padding: 12px;
        border: 1px dashed #ccc;
        border-radius: 5px;
        background: #fafafa;
        min-height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
      
      .signature-line {
        border-top: 2px solid #333;
        margin: 15px auto 8px auto;
        width: 180px;
        display: block;
      }
      
      .signature-space {
        height: 40px;
        margin: 10px 0;
      }
      
      .signature-label {
        font-weight: bold;
        color: #2c5aa0;
        margin-bottom: 3px;
        font-size: 10px;
      }
      
      .signature-field {
        color: #666;
        font-size: 9px;
        margin-bottom: 2px;
      }
      
      /* ✅ ESTILOS DEL FOOTER ACTUALIZADOS */
      .footer {
        margin-top: 8px;
        padding-top: 6px;
        border-top: 1px solid #ddd;
        color: #666;
        font-size: 8px;
        line-height: 1.2;
      }
      
      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      
      .footer-left {
        flex: 1;
        text-align: left;
      }
      
      .footer-right {
        flex: 1;
        text-align: right;
      }
      
      .footer-logo {
        max-height: 25px;
        max-width: 100px;
      }
      
      .footer-rif {
        font-size: 10px;
        font-weight: bold;
        color: #2c5aa0;
      }
      
      .footer-text {
        text-align: center;
        margin-top: 6px;
      }
      
      /* Optimizaciones críticas para impresión */
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Mostrar header y footer personalizados solo en impresión */
        .print-header,
        .print-footer {
          display: block !important;
        }
        
        /* Ajustar el contenido para dar espacio al header/footer fijos */
        body {
          margin-top: 50px !important;
          margin-bottom: 40px !important;
        }
        
        html, body {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
        }
        
        body {
          font-size: 10px !important;
          padding: 8px !important;
        }
        
        .container {
          max-width: 100% !important;
          width: 100% !important;
          min-height: auto !important;
          height: auto !important;
          page-break-inside: avoid;
        }
        
        .section {
          box-shadow: none !important;
          border: 1px solid #ddd !important;
          margin: 4px 0 !important;
          page-break-inside: avoid;
        }
        
        .header {
          margin-bottom: 6px !important;
          padding: 6px 0 !important;
          page-break-after: avoid;
        }
        
        .company-logo-img {
          max-width: 100px !important;
          max-height: 50px !important;
          margin-bottom: 6px !important;
        }
        
        .company-address {
          font-size: 9px !important;
          margin-bottom: 6px !important;
        }
        
        .document-title {
          font-size: 14px !important;
        }
        
        .section-content {
          padding: 6px 8px !important;
        }
        
        .two-columns {
          gap: 10px !important;
        }
        
        .column-title {
          font-size: 10px !important;
          margin-bottom: 6px !important;
        }
        
        .constancy {
          padding: 6px !important;
          margin: 6px 0 !important;
          page-break-inside: avoid;
        }
        
        .signature-section {
          margin-top: 12px !important;
          page-break-inside: avoid;
          gap: 15px !important;
        }
        
        .signature-box {
          min-height: 70px !important;
          padding: 10px !important;
        }
        
        .signature-line {
          width: 150px !important;
          margin: 12px auto 6px auto !important;
          display: block !important;
        }
        
        .signature-space {
          height: 30px !important;
          margin: 8px 0 !important;
        }
        
        /* ✅ ESTILOS DE IMPRESIÓN PARA FOOTER */
        .footer {
          margin-top: 6px !important;
          padding-top: 4px !important;
          page-break-before: avoid;
        }
        
        .footer-content {
          margin-bottom: 6px !important;
          padding: 6px 0 !important;
        }
        
        .footer-logo {
          max-height: 20px !important;
          max-width: 80px !important;
        }
        
        .footer-rif {
          font-size: 9px !important;
        }
        
        .footer-text {
          margin-top: 4px !important;
        }
        
        .field-row {
          margin-bottom: 3px !important;
          page-break-inside: avoid;
        }
        
        .document-info {
          margin: 6px 0 !important;
          padding: 6px !important;
          page-break-after: avoid;
        }
        
        .section-header {
          padding: 4px 8px !important;
          font-size: 10px !important;
        }
      }
      
      /* Configuración de página para impresión */
      @page {
        size: letter;
        margin: 0.2in 0.5in;
        padding: 0;
        /* Ocultar header y footer del navegador */
        @top-left { content: ""; }
        @top-center { content: ""; }
        @top-right { content: ""; }
        @bottom-left { content: ""; }
        @bottom-center { content: ""; }
        @bottom-right { content: ""; }
      }
      
      /* Header personalizado para impresión */
      .print-header {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        background: white;
        border-bottom: 1px solid #ddd;
        z-index: 1000;
        padding: 8px 20px;
        box-sizing: border-box;
      }
      
      .print-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
      }
      
      .print-header-logo {
        max-height: 30px;
        max-width: 80px;
      }
      
      .print-header-rif {
        font-size: 12px;
        font-weight: bold;
        color: #2c5aa0;
      }
      
      /* Footer personalizado para impresión */
      .print-footer {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
        background: white;
        border-top: 1px solid #ddd;
        z-index: 1000;
        padding: 5px 20px;
        box-sizing: border-box;
      }
      
      .print-footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        font-size: 10px;
        color: #666;
      }
      
      /* Evitar cortes de página en elementos críticos */
      .header,
      .document-info,
      .section,
      .constancy,
      .signature-section,
      .footer {
        page-break-inside: avoid;
      }
    </style>
  </head>
  <body>
    <!-- Header personalizado para impresión -->
    <div class="print-header">
      <div class="print-header-content">
        <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="print-header-logo" onerror="this.style.display='none'">
        <div class="print-header-rif">RIF: J-002916150</div>
      </div>
    </div>
    
    <!-- Footer personalizado para impresión -->
    <div class="print-footer">
      <div class="print-footer-content">
        <div></div>
        <div></div>
      </div>
    </div>
    
    <div class="container">
      <div class="header">
        <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="company-logo-img" onerror="this.style.display='none'">
        <div class="company-address">
          Urbanización El Rosal. Av. Francisco de Miranda<br>
          Edif. Centro Sudamérica PH-A Caracas. Edo. Miranda
        </div>
        <div class="document-title">Nota de Entrega</div>
        <div class="document-subtitle"></div>
      </div>
      
      <div class="document-info">
        <div class="info-item">
          <div class="info-label">Fecha</div>
          <div class="info-value">${safe(d.fecha)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">N° de Nota</div>
          <div class="info-value">${safe(d.numero)}</div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="section">
          <div class="section-header">Datos del Cliente</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">R.I.F. / Identificación:</div>
              <div class="field-value">${safe(d.rif)}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Razón Social:</div>
              <div class="field-value">${safe(d.razon)}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Representante Legal:</div>
              <div class="field-value">${safe(d.responsable)}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">Detalles del Equipo</div>
          <div class="section-content">
            <div class="two-columns">
              <div class="column">
                <div class="column-title">Información del Equipo</div>
                <div class="field-row">
                  <div class="field-label">Proveedor:</div>
                  <div class="field-value">${safe(d.proveedor)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">Modelo:</div>
                  <div class="field-value">${safe(d.modelo)}</div>
                </div>
                <div class="field-row">
                  <div class="field-label">Número de Serie:</div>
                  <div class="field-value">${safe(d.serial)}</div>
                </div>
                 <div class="field-row">
                  <div class="field-label">Banco:</div>
                  <div class="field-value">${safe(d.banco)}</div>
                </div>
              </div>
              
              <div class="column">
                <div class="column-title">Accesorios</div>
                <div class="field-row">
                  <div class="field-label">Componentes:</div>
                  <div class="field-value">${safe(d.componentes || 'Sin accesorios adicionales')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">Información del Envío</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">Estado de Origen:</div>
              <div class="field-value">${safe(d.region_origen)}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Estado de Destino:</div>
              <div class="field-value">${safe(d.region_destino)}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Observaciones:</div>
              <div class="field-value observations">${safe(d.observaciones) || ''}</div>
            </div>
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-label">Recibe</div>
            <div class="signature-space"></div>
            <div class="signature-line"></div>
            <div class="signature-field">Nombre: _____________________</div>
            <div class="signature-field">C.I.: _____________________</div>
          </div>
          
          <div class="signature-box">
            <div class="signature-label">Firma de Conformidad</div>
            <div class="signature-space"></div>
            <div class="signature-line"></div>
            <div class="signature-field">Nombre: ${safe(d.tecnico_responsable)}</div>
            <div class="signature-field">C.I.: _____________________</div>
          </div>
        </div>

        <!-- ✅ FOOTER ACTUALIZADO CON LOGO Y RIF -->
        <div class="footer">
          <div class="footer-content">
            <div class="footer-left">
              <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="footer-logo" onerror="this.style.display='none'">
            </div>
            <div class="footer-right">
              <div class="footer-rif">RIF: J-002916150</div>
            </div>
          </div>
          <div class="footer-text">
            <p>Documento válido como constancia oficial de entrega del equipo especificado.</p>
            <p>Generado: ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>`;
}

$(document).on('click', '#printHtmlTemplateBtn', function () {
    try {
        const iframe = document.getElementById('htmlTemplatePreview');
        if (!iframe || !iframe.contentWindow) return;
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc) return;

        const originalIframeTitle = doc.title || '';
        const originalWindowTitle = window.document.title || ''; // Guardar el título de la ventana principal

        const ticketId = (document.getElementById('htmlTemplateTicketId') || {}).value || 'Ticket';
        const neNumero = (document.getElementById('ne_numero') || {}).value || '';
        const fecha = new Date();
        const y = fecha.getFullYear();
        const m = String(fecha.getMonth() + 1).padStart(2, '0');
        const d = String(fecha.getDate()).padStart(2, '0');
        const fechaStr = `${y}${m}${d}`;
        const sanitizedNumero = String(neNumero).replace(/[^A-Za-z0-9_-]+/g, '');
        
        // Crear el nombre del archivo
        const filename = `NotaEntrega_${ticketId}${sanitizedNumero ? '_' + sanitizedNumero : ''}_${fechaStr}`;
        
        // --- PREPARACIÓN DEL MODAL DE SUBIDA (Lógica movida para configurar antes) ---
        const ticketIdValue = (document.getElementById('htmlTemplateTicketId') || {}).value || '';
        const idTicketInput = document.getElementById('id_ticket');
        const typeDocInput = document.getElementById('type_document');
        const modalTicketIdSpan = document.getElementById('modalTicketId');
        
        if (idTicketInput) idTicketInput.value = ticketIdValue;
        if (typeDocInput) typeDocInput.value = 'Envio';
        if (modalTicketIdSpan) modalTicketIdSpan.textContent = ticketIdValue;
        
        // 1. Mostrar el modal de éxito del "Guardado" (o Registro de NE) y preguntar qué hacer
        Swal.fire({
            icon: 'success',
            title: 'Nota de Entrega',
            text: 'El archivo se generó correctamente. Puedes guardarlo como PDF.',
            showCancelButton: true,
            confirmButtonText: 'Imprimir', // Opción que dispara window.print()
            cancelButtonText: 'Cerrar', // Opción que cierra la vista previa
            confirmButtonColor: '#003594',
            cancelButtonColor: '#808080', // Color para el botón "Cerrar Ventana"
            color: 'black'
        }).then((result) => {
            // Si el usuario presiona "Imprimir / Guardar PDF"
            if (result.isConfirmed) {
                
                // Asignar el nombre del archivo al título de la ventana principal
                window.document.title = filename;

                // Llamar a la función de impresión
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // Usa setTimeout para restaurar el título después de que el diálogo de impresión se lance
                // Se usa un tiempo corto, ya no necesitamos esperar que el usuario interactúe
                setTimeout(() => {
                    doc.title = originalIframeTitle; // Restaurar el título del iframe
                    window.document.title = originalWindowTitle; // Restaurar el título de la ventana principal
                    
                    // Aquí puedes mostrar el modal de "Subir Documento" si lo deseas
                     const uploadDocumentModal = new bootstrap.Modal(document.getElementById('uploadDocumentModal'));
                     uploadDocumentModal.show();
                    
                    // O simplemente recargar la página principal
                    window.location.reload(); 
                    
                }, 500); // 100ms es suficiente para que el título se aplique a la ventana de impresión

            } else {
                // Si el usuario presiona "Cerrar Ventana"
                // 2. Cerrar el modal actual (si es que estás usando uno para la vista previa)
                const htmlModal = new bootstrap.Modal(document.getElementById('htmlTemplateModal'));
                htmlModal.hide();
                
                // O recargar la página, dependiendo de la necesidad de tu flujo
                // window.location.reload();
            }
        });
        
    } catch (e) {
        console.error('Error:', e);
        // Si hay un error, aún intenta imprimir sin cambiar el nombre (Opción de fallback)
        const iframe = document.getElementById('htmlTemplatePreview');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        }
    }
});

// ========================================
// FUNCIONES PARA PENDIENTE_ENTREGA
// ========================================

// Función para abrir el modal de presupuesto
function openPresupuestoModal(nroTicket, idFailure = null) {
    const nroTicketSpan = document.getElementById('presupuestoNroTicket');
    
    if (nroTicketSpan) {
        nroTicketSpan.textContent = nroTicket;
    }
    
    // Verificar si es "Actualización de Software" (id_failure = 9) o "Sin Llaves/Dukpt Vacío" (id_failure = 12)
    const isActualizacionSoftware = idFailure === 9;
    const isSinLlavesDukpt = idFailure === 12;
    const isFallaSinPago = isActualizacionSoftware || isSinLlavesDukpt;
    
    // Ocultar la sección "Datos del Anticipo" si es Actualización de Software o Sin Llaves/Dukpt Vacío
    const datosAnticipoCard = document.querySelector('.presupuesto-card-pago');
    const datosAnticipoContainers = [
        'presupuestoMonedaContainer',
        'presupuestoMontoUSDContainer',
        'presupuestoMontoBSContainer',
        'presupuestoMetodoPagoContainer'
    ];
    
    if (isFallaSinPago) {
        // Ocultar card y campos de "Datos del Anticipo"
        if (datosAnticipoCard) {
            datosAnticipoCard.style.display = 'none';
        }
        datosAnticipoContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.style.display = 'none';
            }
        });
    } else {
        // Mostrar card y campos de "Datos del Anticipo"
        if (datosAnticipoCard) {
            datosAnticipoCard.style.display = '';
        }
        datosAnticipoContainers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.style.display = '';
            }
        });
    }
    
    // Limpiar campos y ocultar contenedores
    document.getElementById('presupuestoMontoUSD').value = '';
    document.getElementById('presupuestoMoneda').value = '';
    document.getElementById('presupuestoMetodoPago').value = '';
    document.getElementById('presupuestoMontoBS').value = '';
    document.getElementById('presupuestoBancoOrigen').value = '';
    document.getElementById('presupuestoBancoDestino').value = '';
    document.getElementById('presupuestoReferencia').value = '';
    document.getElementById('presupuestoDepositante').value = '';
    document.getElementById('presupuestoFechaPago').value = '';
    document.getElementById('presupuestoMontoTaller').value = '';
    document.getElementById('presupuestoMontoPagadoUSD').value = '';
    document.getElementById('presupuestoDiferenciaUSD').value = '';
    document.getElementById('presupuestoDiferenciaBS').value = '';
    
    // Ocultar todos los contenedores condicionales
    const containersToHide = [
        'presupuestoBancoOrigenContainer',
        'presupuestoBancoDestinoContainer',
        'presupuestoReferenciaContainer',
        'presupuestoDepositanteContainer',
        'presupuestoFechaPagoContainer',
        'presupuestoPagoMovilContainer',
        'presupuestoDestinoRifContainer',
        'presupuestoDestinoTelefonoContainer',
        'presupuestoDestinoBancoContainer',
        'presupuestoOrigenRifContainer',
        'presupuestoOrigenTelefonoContainer',
        'presupuestoOrigenBancoContainer'
    ];
    
    containersToHide.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.display = 'none';
        }
    });
    
    // Si es "Actualización de Software" o "Sin Llaves/Dukpt Vacío", no cargar datos de pago
    if (isFallaSinPago) {
        // Establecer fecha de hoy (no editable)
        const today = new Date();
        const fechaFormateada = today.toISOString().split('T')[0];
        document.getElementById('presupuestoFecha').value = fechaFormateada;
        
        // Limpiar descripción
        document.getElementById('presupuestoDescripcion').value = '';
        
        // Cargar datos del cliente
        loadClienteDataForPresupuesto(nroTicket);
        
        // Abrir el modal
        if (bsPresupuestoModal) {
            bsPresupuestoModal.show();
        }
        return; // Salir de la función sin cargar datos de pago
    }
    
    // Obtener datos de payment_records (solo si NO es Actualización de Software)
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPaymentData`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success && response.data) {
                    const paymentData = response.data;
                    
                    // Función helper para verificar si un valor está vacío o es null
                    const isEmpty = (value) => {
                        return value === null || value === undefined || value === '' || value === 'null' || String(value).trim() === '';
                    };
                    
                    // Función helper para mostrar/ocultar campos
                    const toggleField = (containerId, inputId, value) => {
                        const container = document.getElementById(containerId);
                        const input = document.getElementById(inputId);
                        if (container && input) {
                            if (!isEmpty(value)) {
                                input.value = value;
                                container.style.display = '';
                            } else {
                                container.style.display = 'none';
                            }
                        }
                    };
                    
                    // Llenar campos del modal
                    const montoUSD = paymentData.reference_amount ? parseFloat(paymentData.reference_amount) : 0;
                    const montoBS = paymentData.amount_bs ? parseFloat(paymentData.amount_bs) : 0;
                    
                    document.getElementById('presupuestoMontoUSD').value = montoUSD.toFixed(2);
                    document.getElementById('presupuestoMoneda').value = paymentData.currency === 'bs' ? 'Bolívares (Bs)' : (paymentData.currency === 'usd' ? 'Dólares (USD)' : paymentData.currency || 'N/A');
                    document.getElementById('presupuestoMetodoPago').value = paymentData.payment_method || 'N/A';
                    document.getElementById('presupuestoMontoBS').value = montoBS.toFixed(2);
                    
                    // Campos condicionales - Transferencia (Bancos)
                    toggleField('presupuestoBancoOrigenContainer', 'presupuestoBancoOrigen', paymentData.origen_bank);
                    toggleField('presupuestoBancoDestinoContainer', 'presupuestoBancoDestino', paymentData.destination_bank);
                    
                    // Campos condicionales - Referencia, Depositante, Fecha
                    toggleField('presupuestoReferenciaContainer', 'presupuestoReferencia', paymentData.payment_reference);
                    toggleField('presupuestoDepositanteContainer', 'presupuestoDepositante', paymentData.depositor);
                    
                    if (paymentData.payment_date) {
                        const fecha = new Date(paymentData.payment_date);
                        const fechaFormateada = fecha.toLocaleDateString('es-VE') + ' ' + fecha.toLocaleTimeString('es-VE');
                        toggleField('presupuestoFechaPagoContainer', 'presupuestoFechaPago', fechaFormateada);
                    } else {
                        toggleField('presupuestoFechaPagoContainer', 'presupuestoFechaPago', null);
                    }
                    
                    // Campos condicionales - Pago Móvil
                    const pagoMovilContainer = document.getElementById('presupuestoPagoMovilContainer');
                    const hasPagoMovilData = paymentData.destino_rif_tipo || paymentData.destino_rif_numero || 
                                            paymentData.destino_telefono || paymentData.destino_banco ||
                                            paymentData.origen_rif_tipo || paymentData.origen_rif_numero || 
                                            paymentData.origen_telefono || paymentData.origen_banco;
                    
                    if (pagoMovilContainer) {
                        if (hasPagoMovilData) {
                            pagoMovilContainer.style.display = '';
                            
                            // Destino - RIF
                            const destinoRifContainer = document.getElementById('presupuestoDestinoRifContainer');
                            const destinoRifTipo = document.getElementById('presupuestoDestinoRifTipo');
                            const destinoRifNumero = document.getElementById('presupuestoDestinoRifNumero');
                            if (destinoRifContainer && destinoRifTipo && destinoRifNumero) {
                                if (paymentData.destino_rif_tipo && paymentData.destino_rif_numero) {
                                    destinoRifTipo.value = paymentData.destino_rif_tipo;
                                    destinoRifNumero.value = paymentData.destino_rif_numero;
                                    destinoRifContainer.style.display = '';
                                } else {
                                    destinoRifContainer.style.display = 'none';
                                }
                            }
                            
                            // Destino - Teléfono
                            const destinoTelefonoContainer = document.getElementById('presupuestoDestinoTelefonoContainer');
                            const destinoTelefono = document.getElementById('presupuestoDestinoTelefono');
                            if (destinoTelefonoContainer && destinoTelefono) {
                                if (paymentData.destino_telefono) {
                                    destinoTelefono.value = paymentData.destino_telefono;
                                    destinoTelefonoContainer.style.display = '';
                                } else {
                                    destinoTelefonoContainer.style.display = 'none';
                                }
                            }
                            
                            // Destino - Banco
                            const destinoBancoContainer = document.getElementById('presupuestoDestinoBancoContainer');
                            const destinoBanco = document.getElementById('presupuestoDestinoBanco');
                            if (destinoBancoContainer && destinoBanco) {
                                if (paymentData.destino_banco) {
                                    destinoBanco.value = paymentData.destino_banco;
                                    destinoBancoContainer.style.display = '';
                                } else {
                                    destinoBancoContainer.style.display = 'none';
                                }
                            }
                            
                            // Origen - RIF
                            const origenRifContainer = document.getElementById('presupuestoOrigenRifContainer');
                            const origenRifTipo = document.getElementById('presupuestoOrigenRifTipo');
                            const origenRifNumero = document.getElementById('presupuestoOrigenRifNumero');
                            if (origenRifContainer && origenRifTipo && origenRifNumero) {
                                if (paymentData.origen_rif_tipo && paymentData.origen_rif_numero) {
                                    origenRifTipo.value = paymentData.origen_rif_tipo;
                                    origenRifNumero.value = paymentData.origen_rif_numero;
                                    origenRifContainer.style.display = '';
                                } else {
                                    origenRifContainer.style.display = 'none';
                                }
                            }
                            
                            // Origen - Teléfono
                            const origenTelefonoContainer = document.getElementById('presupuestoOrigenTelefonoContainer');
                            const origenTelefono = document.getElementById('presupuestoOrigenTelefono');
                            if (origenTelefonoContainer && origenTelefono) {
                                if (paymentData.origen_telefono) {
                                    origenTelefono.value = paymentData.origen_telefono;
                                    origenTelefonoContainer.style.display = '';
                                } else {
                                    origenTelefonoContainer.style.display = 'none';
                                }
                            }
                            
                            // Origen - Banco
                            const origenBancoContainer = document.getElementById('presupuestoOrigenBancoContainer');
                            const origenBanco = document.getElementById('presupuestoOrigenBanco');
                            if (origenBancoContainer && origenBanco) {
                                if (paymentData.origen_banco) {
                                    origenBanco.value = paymentData.origen_banco;
                                    origenBancoContainer.style.display = '';
                                } else {
                                    origenBancoContainer.style.display = 'none';
                                }
                            }
                        } else {
                            pagoMovilContainer.style.display = 'none';
                        }
                    }
                    
                    // Guardar datos para cálculos
                    document.getElementById('presupuestoMontoPagadoUSD').value = montoUSD.toFixed(2);
                    window.presupuestoMontoPagadoUSD = montoUSD;
                    window.presupuestoTasaCambio = montoUSD > 0 ? (montoBS / montoUSD) : 0;
                    
                    // Establecer fecha de hoy (no editable)
                    const today = new Date();
                    const fechaFormateada = today.toISOString().split('T')[0];
                    document.getElementById('presupuestoFecha').value = fechaFormateada;
                    
                    // Limpiar descripción
                    document.getElementById('presupuestoDescripcion').value = '';
                    
                    // Cargar datos del cliente
                    loadClienteDataForPresupuesto(nroTicket);
                    
                    // Agregar event listener para calcular diferencia (remover primero para evitar duplicados)
                    const montoTallerInput = document.getElementById('presupuestoMontoTaller');
                    if (montoTallerInput) {
                        // ✅ Función para limpiar el input preservando la posición del cursor
                        function cleanTallerInput(event) {
                            const input = event.target;
                            const originalValue = input.value;
                            // ✅ Guardar la posición del cursor antes de modificar el valor
                            const cursorPosition = input.selectionStart || 0;
                            
                            // Verificar si el valor solo contiene caracteres válidos (números y máximo un punto)
                            const isValidFormat = /^[0-9]*\.?[0-9]*$/.test(originalValue);
                            const pointCount = (originalValue.match(/\./g) || []).length;
                            
                            // Si el formato es válido y tiene máximo un punto, no hacer nada (evitar interferir con escritura normal)
                            if (isValidFormat && pointCount <= 1) {
                                calcularDiferenciaPresupuesto();
                                return;
                            }
                            
                            // Eliminar todo lo que no sea número o punto
                            let cleaned = originalValue.replace(/[^0-9.]/g, '');
                            // Asegurar solo un punto decimal
                            const parts = cleaned.split('.');
                            if (parts.length > 2) {
                                cleaned = parts[0] + '.' + parts.slice(1).join('');
                            }
                            
                            if (originalValue !== cleaned) {
                                // ✅ Calcular la nueva posición del cursor
                                // Contar caracteres válidos antes de la posición del cursor en el valor original
                                let validCharsBeforeCursor = 0;
                                let hasPointBeforeCursor = false;
                                
                                for (let i = 0; i < cursorPosition && i < originalValue.length; i++) {
                                    const char = originalValue[i];
                                    if (/[0-9]/.test(char)) {
                                        validCharsBeforeCursor++;
                                    } else if (char === '.' && !hasPointBeforeCursor) {
                                        validCharsBeforeCursor++;
                                        hasPointBeforeCursor = true;
                                    }
                                }
                                
                                // La nueva posición del cursor será igual a los caracteres válidos contados
                                let newCursorPosition = validCharsBeforeCursor;
                                
                                // Asegurar que la posición esté dentro de los límites del valor limpiado
                                newCursorPosition = Math.min(newCursorPosition, cleaned.length);
                                
                                input.value = cleaned;
                                
                                // ✅ Restaurar la posición del cursor después de actualizar el valor
                                requestAnimationFrame(function() {
                                    input.setSelectionRange(newCursorPosition, newCursorPosition);
                                });
                            }
                            
                            calcularDiferenciaPresupuesto();
                        }
                        
                        // ✅ Función para formatear a 2 decimales cuando pierde el foco
                        function formatTallerDecimal() {
                            const input = document.getElementById('presupuestoMontoTaller');
                            if (!input || input.disabled) {
                                return;
                            }
                            
                            const value = input.value;
                            if (value && value.trim() !== "") {
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue)) {
                                    input.value = numValue.toFixed(2);
                            calcularDiferenciaPresupuesto();
                                }
                            }
                        }
                        
                        // Validar que solo se ingresen números y un punto decimal (preservando cursor)
                        montoTallerInput.addEventListener('input', cleanTallerInput);
                        
                        // ✅ Formatear a 2 decimales cuando pierde el foco
                        montoTallerInput.addEventListener('blur', formatTallerDecimal);
                        
                        // Prevenir pegar texto no numérico
                        montoTallerInput.addEventListener('paste', function(e) {
                            e.preventDefault();
                            const paste = (e.clipboardData || window.clipboardData).getData('text');
                            const numericValue = paste.replace(/[^0-9.]/g, '');
                            const parts = numericValue.split('.');
                            const cleanValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
                            if (cleanValue) {
                                this.value = cleanValue;
                                calcularDiferenciaPresupuesto();
                            }
                        });
                        
                        // Crear una nueva función wrapper para evitar problemas con removeEventListener
                        const newHandler = function() {
                            calcularDiferenciaPresupuesto();
                        };
                        montoTallerInput.removeEventListener('input', window.presupuestoCalculoHandler);
                        window.presupuestoCalculoHandler = newHandler;
                    }
                    
                    // Limpiar al cerrar el modal
                    const presupuestoModalElement = document.getElementById('presupuestoModal');
                    if (presupuestoModalElement) {
                        presupuestoModalElement.addEventListener('hidden.bs.modal', function() {
                            // Limpiar valores
                            const montoTaller = document.getElementById('presupuestoMontoTaller');
                            const diferenciaUSD = document.getElementById('presupuestoDiferenciaUSD');
                            const diferenciaBS = document.getElementById('presupuestoDiferenciaBS');
                            if (montoTaller) montoTaller.value = '';
                            if (diferenciaUSD) {
                                diferenciaUSD.value = '';
                                diferenciaUSD.classList.remove('bg-danger', 'bg-success', 'text-white');
                            }
                            if (diferenciaBS) {
                                diferenciaBS.value = '';
                                diferenciaBS.classList.remove('bg-danger', 'bg-success', 'text-white');
                            }
                        }, { once: true });
                    }
                    
                    // Aplicar scroll automático a inputs con texto largo
                    setTimeout(() => {
                        setupAutoScrollInputs();
                    }, 300);
                    
                    // Mostrar modal
                    if (bsPresupuestoModal) {
                        bsPresupuestoModal.show();
                    }
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sin datos de pago',
                        text: response.message || 'No se encontró información de pago para este ticket.',
                        confirmButtonText: 'Ok',
                        color: 'black',
                        confirmButtonColor: '#dc3545'
                    });
                }
            } catch (error) {
                console.error('Error al parsear la respuesta JSON:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Respuesta',
                    text: 'Error al procesar la respuesta del servidor',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#dc3545'
                });
            }
        } else if (xhr.status === 404) {
            // Cuando no hay datos de anticipo, mostrar un modal bonito con botón para agregar anticipo
            Swal.fire({
                icon: false,
                title: 'Sin Datos de Anticipo',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <div id="anticipo-icon-animated" style="width: 100px; height: 100px; margin: 0 auto 28px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2); position: relative; cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#1976d2" viewBox="0 0 16 16" style="display: block; transition: transform 0.3s ease;">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                                <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                            </svg>
                        </div>
                        <div id="anticipo-message-box" style="background: #f8f9fa; border-left: 4px solid #0d6efd; padding: 16px; border-radius: 4px; margin-bottom: 24px; text-align: left; transition: all 0.3s ease; cursor: pointer; overflow: hidden;">
                            <p style="font-size: 0.9375rem; color: #495057; margin: 0; line-height: 1.6; overflow: hidden; text-overflow: ellipsis;">
                                <strong style="color: #212529;">No se encontraron datos de anticipo</strong> para este ticket.
                            </p>
                        </div>
                        <p style="font-size: 0.9375rem; color: #6c757d; margin-bottom: 0; line-height: 1.6;">
                            ¿Desea agregar los datos de anticipo ahora?
                        </p>
                    </div>
                    <style>
                        @keyframes iconPulse {
                            0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2); }
                            50% { transform: scale(1.05); box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4); }
                        }
                        @keyframes iconFloat {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-8px); }
                        }
                        #anticipo-icon-animated {
                            animation: iconPulse 2s ease-in-out infinite;
                        }
                        #anticipo-icon-animated svg {
                            animation: iconFloat 3s ease-in-out infinite;
                        }
                        #anticipo-icon-animated:hover {
                            animation: none;
                            transform: scale(1.1);
                            box-shadow: 0 8px 24px rgba(33, 150, 243, 0.5);
                        }
                        #anticipo-icon-animated:hover svg {
                            animation: none;
                            transform: rotate(5deg) scale(1.1);
                        }
                        #anticipo-message-box:hover {
                            background: #e9ecef !important;
                            border-left-color: #0a58ca !important;
                            transform: translateX(5px);
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        #anticipo-message-box, #anticipo-message-box * {
                            overflow: hidden !important;
                        }
                    </style>
                `,
                showCancelButton: true,
                confirmButtonText: 'Agregar Anticipo',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#6c757d',
                reverseButtons: true,
                customClass: {
                    popup: 'swal2-popup-custom-anticipo',
                    confirmButton: 'swal2-confirm-custom-anticipo',
                    cancelButton: 'swal2-cancel-custom-anticipo',
                    title: 'swal2-title-custom-anticipo',
                    htmlContainer: 'swal2-html-container-custom-anticipo',
                    actions: 'swal2-actions-custom-anticipo'
                },
                width: '460px',
                padding: '2.5rem 2rem 2rem',
                backdrop: true,
                allowOutsideClick: true,
                allowEscapeKey: true
            }).then((result) => {
                // Función para cerrar el SweetAlert de forma robusta
                const closeSweetAlert = () => {
                    if (typeof Swal !== 'undefined') {
                        Swal.close();
                        
                        setTimeout(() => {
                            const swalContainer = document.querySelector('.swal2-container');
                            const swalBackdrop = document.querySelector('.swal2-backdrop-show');
                            
                            if (swalContainer) {
                                swalContainer.style.display = 'none';
                                swalContainer.classList.remove('swal2-backdrop-show');
                            }
                            
                            if (swalBackdrop) {
                                swalBackdrop.remove();
                            }
                            
                            document.body.classList.remove('swal2-height-auto', 'swal2-shown');
                            document.body.style.overflow = '';
                            document.body.style.paddingRight = '';
                        }, 100);
                    }
                };
                
                if (result.isConfirmed) {
                    // Cerrar el SweetAlert primero
                    closeSweetAlert();
                    
                    // Abrir el modal de agregar datos de pago después de cerrar
                    setTimeout(() => {
                        const serialPos = window.currentSerialPosForAnticipo || '';
                        openAgregarAnticipoModal(nroTicket, serialPos);
                    }, 200);
                } else if (result.isDismissed) {
                    // Si se cancela, solo cerrar el modal
                    closeSweetAlert();
                }
            });
        } else {
            console.error(`Error HTTP ${xhr.status}: ${xhr.statusText}`);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: `Error HTTP ${xhr.status}: ${xhr.statusText}`,
                confirmButtonText: 'Ok',
                color: 'black',
                confirmButtonColor: '#dc3545'
            });
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al intentar obtener los datos de pago');
        Swal.fire({
            icon: 'error',
            title: 'Error de Red',
            text: 'Error de conexión con el servidor',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#dc3545'
        });
    };
    
    // Enviar los datos
    const data = `action=GetPaymentData&nro_ticket=${encodeURIComponent(nroTicket)}`;
    xhr.send(data);
}

// Función para calcular la diferencia del presupuesto
function calcularDiferenciaPresupuesto() {
    const montoTaller = parseFloat(document.getElementById('presupuestoMontoTaller').value) || 0;
    const montoPagadoUSD = window.presupuestoMontoPagadoUSD || 0;
    const tasaCambio = window.presupuestoTasaCambio || 0;
    
    const diferenciaUSD = montoTaller - montoPagadoUSD;
    const diferenciaBS = diferenciaUSD * tasaCambio;
    
    document.getElementById('presupuestoDiferenciaUSD').value = diferenciaUSD.toFixed(2);
    document.getElementById('presupuestoDiferenciaBS').value = diferenciaBS.toFixed(2);
    
    // Cambiar color según si es positivo o negativo
    const diferenciaUSDInput = document.getElementById('presupuestoDiferenciaUSD');
    const diferenciaBSInput = document.getElementById('presupuestoDiferenciaBS');
    
    if (diferenciaUSDInput && diferenciaBSInput) {
        // Limpiar clases anteriores
        diferenciaUSDInput.classList.remove('bg-danger', 'bg-success', 'text-white');
        diferenciaBSInput.classList.remove('bg-danger', 'bg-success', 'text-white');
        
        if (diferenciaUSD >= 0) {
            diferenciaUSDInput.classList.add('bg-success', 'text-white');
            diferenciaBSInput.classList.add('bg-success', 'text-white');
        } else {
            diferenciaUSDInput.classList.add('bg-danger', 'text-white');
            diferenciaBSInput.classList.add('bg-danger', 'text-white');
        }
    }
}

// Evento para previsualizar y generar el PDF del presupuesto
document.addEventListener('click', function(event) {
    if (event.target.closest('#previewPresupuestoPDFBtn')) {
        event.preventDefault();
        previewPresupuestoPDF();
    }
    
    if (event.target.closest('#imprimirPresupuestoPDFBtn')) {
        event.preventDefault();
        
        // Obtener los datos del presupuesto para guardarlos
        const presupuestoData = getPresupuestoData();
        const nroTicket = presupuestoData.nroTicket;
        
        // Mostrar modal de carga
        Swal.fire({
            title: 'Guardando datos...',
            html: 'Por favor, espere mientras se guarda el presupuesto.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Obtener datos del cliente y guardar
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPresupuestoData`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    
                    if (response.success && response.data) {
                        const clienteData = response.data;
                        
                        // Preparar datos completos del presupuesto
                        const presupuestoDataComplete = {
                            nroTicket: nroTicket,
                            fechaPresupuesto: presupuestoData.fechaPresupuesto,
                            validez: '5 días hábiles',
                            descripcion: presupuestoData.descripcion,
                            montoTaller: presupuestoData.montoTaller,
                            montoPagadoUSD: window.presupuestoMontoPagadoUSD || 0,
                            diferenciaUSD: parseFloat(document.getElementById('presupuestoDiferenciaUSD').value) || 0,
                            diferenciaBS: parseFloat(document.getElementById('presupuestoDiferenciaBS').value) || 0,
                            montoTotalUSD: parseFloat(document.getElementById('presupuestoMontoUSD').value) || 0,
                            montoTotalBS: parseFloat(document.getElementById('presupuestoMontoBS').value) || 0,
                            cliente: clienteData
                        };
                        
                        // Cerrar modal de carga
                        Swal.close();
                        
                        // Generar un número temporal para el preview (sin guardar en BD aún)
                        const tempPresupuestoNumero = generatePresupuestoNumero(nroTicket || '0000000000');
                        presupuestoDataComplete.presupuestoNumero = tempPresupuestoNumero;
                        
                        // Generar HTML del presupuesto con número temporal
                        const html = buildPresupuestoHTML(presupuestoDataComplete);
                        
                        // Mostrar en el iframe del modal de PDF
                        const previewIframe = document.getElementById('presupuestoPDFPreview');
                        const previewDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
                        const baseHref = `${window.location.origin}/SoportePost/`;
                        let htmlWithBase = html.replace('<head>', `<head><base href="${baseHref}">`);
                        
                        previewDoc.open();
                        previewDoc.write(htmlWithBase);
                        previewDoc.close();
                        
                        // Cerrar modal de presupuesto y abrir modal de PDF
                        if (bsPresupuestoModal) {
                            bsPresupuestoModal.hide();
                        }
                        
                        setTimeout(() => {
                            if (bsPresupuestoPDFModal) {
                                bsPresupuestoPDFModal.show();
                            }
                            
                            // Esperar a que el iframe cargue completamente
                            setTimeout(() => {
                                // PRIMERO: Mostrar alerta para verificar información antes de guardar
                                Swal.fire({
                                    icon: 'info',
                                    title: 'Verificar Información',
                                    text: 'Por favor, verifique la información antes de guardar el documento.',
                                    showCancelButton: true,
                                    confirmButtonText: 'Continuar',
                                    cancelButtonText: 'Cancelar',
                                    confirmButtonColor: '#003594',
                                    cancelButtonColor: '#808080',
                                    color: 'black'
                                }).then((verifyResult) => {
                                    // Si el usuario confirma la verificación, mostrar el modal de guardado
                                    if (verifyResult.isConfirmed) {
                                        // Mostrar SweetAlert con opciones (SIN guardar aún en BD)
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Presupuesto',
                                            text: 'El archivo se generó correctamente. ¿Deseas guardarlo como PDF?',
                                            showCancelButton: false,
                                            confirmButtonText: 'Guardar',
                                            confirmButtonColor: '#003594',
                                            color: 'black'
                                        }).then((result) => {
                                            // Si el usuario presiona "Guardar", ENTONCES guardar en BD
                                            if (result.isConfirmed) {
                                                // Mostrar modal de carga mientras se guarda
                                                Swal.fire({
                                                    title: 'Guardando presupuesto...',
                                                    html: 'Por favor, espere mientras se guarda el presupuesto.',
                                                    allowOutsideClick: false,
                                                    allowEscapeKey: false,
                                                    showConfirmButton: false,
                                                    didOpen: () => {
                                                        Swal.showLoading();
                                                    }
                                                });
                                                
                                                // AHORA SÍ guardar presupuesto en la base de datos
                                                saveBudgetToDatabaseWithCallback(presupuestoDataComplete, function(success, message, idBudget, presupuestoNumero) {
                                            Swal.close();
                                            
                                            if (success && presupuestoNumero) {
                                                // Guardar el id_budget para usarlo en el modal de carga de PDF
                                                window.lastSavedBudgetId = idBudget;
                                                window.lastSavedBudgetNroTicket = nroTicket;
                                                
                                                // Actualizar el HTML con el número real de presupuesto
                                                presupuestoDataComplete.presupuestoNumero = presupuestoNumero;
                                                const htmlReal = buildPresupuestoHTML(presupuestoDataComplete);
                                                let htmlWithBaseReal = htmlReal.replace('<head>', `<head><base href="${baseHref}">`);
                                                
                                                // Actualizar el iframe con el número real
                                                previewDoc.open();
                                                previewDoc.write(htmlWithBaseReal);
                                                previewDoc.close();
                                                
                                                // Enviar correo con datos de anticipo y presupuesto
                                                sendAnticipoPresupuestoEmail(nroTicket);
                                                
                                                // Esperar un momento para que se actualice el iframe
                                                setTimeout(() => {
                                                    // Generar nombre del archivo usando el número de registro real
                                                    const fileName = `${presupuestoNumero}.pdf`;
                                                    
                                                    // Guardar títulos originales
                                                    const originalIframeTitle = previewDoc.title || '';
                                                    const originalWindowTitle = window.document.title || '';
                                                    
                                                    // Asignar el nombre del archivo al título
                                                    previewDoc.title = fileName;
                                                    window.document.title = fileName;
                                                    
                                                    // Llamar a la función de impresión del navegador
                                                    previewIframe.contentWindow.focus();
                                                    previewIframe.contentWindow.print();
                                            
                                                    // Restaurar títulos después de un momento
                                                    setTimeout(() => {
                                                        previewDoc.title = originalIframeTitle;
                                                        window.document.title = originalWindowTitle;
                                                        
                                                        // Recargar la página solo después de guardar
                                                        window.location.reload();
                                                    }, 500);
                                                }, 300);
                                            } else {
                                                // Error al guardar - mostrar modal de error
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Error al guardar',
                                                    text: message || 'Hubo un error al guardar el presupuesto. Por favor, intente nuevamente.',
                                                    confirmButtonText: 'Aceptar',
                                                    confirmButtonColor: '#dc3545',
                                                    color: 'black'
                                                });
                                            }
                                                });
                                            } else {
                                                // Si el usuario presiona "Cerrar", NO guardar en BD y NO recargar
                                                // El modal permanece abierto para que pueda intentar guardar de nuevo
                                                console.log('Usuario canceló el guardado. El presupuesto NO se guardó en la base de datos.');
                                            }
                                        });
                                    } else {
                                        // Si el usuario cancela la verificación, no hacer nada
                                        console.log('Usuario canceló la verificación.');
                                    }
                                });
                            }, 500);
                        }, 300);
                    } else {
                        // Error al obtener datos del cliente
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudieron obtener los datos del cliente para guardar el presupuesto.',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#dc3545',
                            color: 'black'
                        });
                    }
                } catch (error) {
                    console.error('Error al parsear respuesta:', error);
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al procesar la respuesta del servidor.',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#dc3545',
                        color: 'black'
                    });
                }
            } else {
                console.error(`Error HTTP ${xhr.status}: ${xhr.statusText}`);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: `Error HTTP ${xhr.status}: ${xhr.statusText}`,
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545',
                    color: 'black'
                });
            }
        };
        
        xhr.onerror = function() {
            console.error('Error de red al obtener datos del cliente');
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error de red',
                text: 'Error de conexión con el servidor.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545',
                color: 'black'
            });
        };
        
        // Enviar petición
        const params = `action=GetPresupuestoData&nro_ticket=${encodeURIComponent(nroTicket)}`;
        xhr.send(params);
    }
});

// Función para cargar datos del cliente en el modal de presupuesto
function loadClienteDataForPresupuesto(nroTicket) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPresupuestoData`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success && response.data) {
                    const clienteData = response.data;
                    
                    // Llenar campos del cliente
                    document.getElementById('presupuestoClienteRazon').value = clienteData.razonsocial || 'N/A';
                    document.getElementById('presupuestoClienteDireccion').value = clienteData.direccion || 'N/A';
                    document.getElementById('presupuestoClienteTelefono').value = clienteData.telf1 || 'N/A';
                    document.getElementById('presupuestoClienteEmail').value = clienteData.email || 'N/A';
                    document.getElementById('presupuestoClienteRif').value = clienteData.coddocumento || clienteData.rif || 'N/A';
                } else {
                    // Si no hay datos, dejar campos vacíos o con valores por defecto
                    document.getElementById('presupuestoClienteRazon').value = 'N/A';
                    document.getElementById('presupuestoClienteDireccion').value = 'N/A';
                    document.getElementById('presupuestoClienteTelefono').value = 'N/A';
                    document.getElementById('presupuestoClienteEmail').value = 'N/A';
                    document.getElementById('presupuestoClienteRif').value = 'N/A';
                }
            } catch (error) {
                console.error('Error al parsear la respuesta JSON:', error);
                // En caso de error, dejar valores por defecto
                document.getElementById('presupuestoClienteRazon').value = 'N/A';
                document.getElementById('presupuestoClienteDireccion').value = 'N/A';
                document.getElementById('presupuestoClienteTelefono').value = 'N/A';
                document.getElementById('presupuestoClienteEmail').value = 'N/A';
                document.getElementById('presupuestoClienteRif').value = 'N/A';
            }
        } else {
            console.error(`Error HTTP ${xhr.status}: ${xhr.statusText}`);
            // En caso de error, dejar valores por defecto
            document.getElementById('presupuestoClienteRazon').value = 'N/A';
            document.getElementById('presupuestoClienteDireccion').value = 'N/A';
            document.getElementById('presupuestoClienteTelefono').value = 'N/A';
            document.getElementById('presupuestoClienteEmail').value = 'N/A';
            document.getElementById('presupuestoClienteRif').value = 'N/A';
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al intentar obtener los datos del cliente');
        // En caso de error, dejar valores por defecto
        document.getElementById('presupuestoClienteRazon').value = 'N/A';
        document.getElementById('presupuestoClienteDireccion').value = 'N/A';
        document.getElementById('presupuestoClienteTelefono').value = 'N/A';
        document.getElementById('presupuestoClienteEmail').value = 'N/A';
        document.getElementById('presupuestoClienteRif').value = 'N/A';
    };
    
    // Enviar los datos
    const params = `action=GetPresupuestoData&nro_ticket=${encodeURIComponent(nroTicket)}`;
    xhr.send(params);
}

// Función para obtener los datos del presupuesto (reutilizable)
function getPresupuestoData() {
    const nroTicket = document.getElementById('presupuestoNroTicket').textContent;
    const montoTaller = parseFloat(document.getElementById('presupuestoMontoTaller').value) || 0;
    const descripcion = document.getElementById('presupuestoDescripcion').value.trim();
    const fechaPresupuesto = document.getElementById('presupuestoFecha').value;
    
    return {
        nroTicket: nroTicket,
        montoTaller: montoTaller,
        descripcion: descripcion,
        fechaPresupuesto: fechaPresupuesto
    };
}

// Función para validar los campos del presupuesto
function validatePresupuestoFields() {
    const data = getPresupuestoData();
    
    if (!data.montoTaller || data.montoTaller <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Requerido',
            text: 'Por favor ingrese el Monto Total de Taller (USD)',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#dc3545'
        });
        return false;
    }
    
    if (!data.descripcion) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Requerido',
            text: 'Por favor ingrese la descripción de la reparación',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#dc3545'
        });
        return false;
    }
    
    if (!data.fechaPresupuesto) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Requerido',
            text: 'La fecha del presupuesto es requerida',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#dc3545'
        });
        return false;
    }
    
    return true;
}

// Función para previsualizar el PDF del presupuesto
function previewPresupuestoPDF() {
    // Validar campos
    if (!validatePresupuestoFields()) {
        return;
    }
    
    const data = getPresupuestoData();
    const nroTicket = data.nroTicket;
    
    // Obtener datos del cliente
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPresupuestoData`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success && response.data) {
                    const clienteData = response.data;
                    
                    // Obtener datos del modal
                    const presupuestoData = {
                        nroTicket: nroTicket,
                        fechaPresupuesto: data.fechaPresupuesto,
                        validez: '5 días hábiles',
                        descripcion: data.descripcion,
                        montoTaller: data.montoTaller,
                        montoPagadoUSD: window.presupuestoMontoPagadoUSD || 0,
                        diferenciaUSD: parseFloat(document.getElementById('presupuestoDiferenciaUSD').value) || 0,
                        diferenciaBS: parseFloat(document.getElementById('presupuestoDiferenciaBS').value) || 0,
                        montoTotalUSD: parseFloat(document.getElementById('presupuestoMontoUSD').value) || 0,
                        montoTotalBS: parseFloat(document.getElementById('presupuestoMontoBS').value) || 0,
                        cliente: clienteData
                    };
                    
                    // Generar HTML del presupuesto
                    const html = buildPresupuestoHTML(presupuestoData);
                    
                    // Mostrar en el iframe del modal de PDF
                    const iframe = document.getElementById('presupuestoPDFPreview');
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const baseHref = `${window.location.origin}/SoportePost/`;
                    let htmlWithBase = html.replace('<head>', `<head><base href="${baseHref}">`);
                    
                    doc.open();
                    doc.write(htmlWithBase);
                    doc.close();
                    
                    // NO guardar aquí - solo previsualización
                    // El guardado se hará solo cuando se imprima
                    
                    // Abrir modal de previsualización
                    if (bsPresupuestoPDFModal) {
                        bsPresupuestoPDFModal.show();
                    }
                    
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'No se pudieron obtener los datos del cliente',
                        confirmButtonText: 'Ok',
                        color: 'black',
                        confirmButtonColor: '#dc3545'
                    });
                }
            } catch (error) {
                console.error('Error al parsear la respuesta JSON:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Respuesta',
                    text: 'Error al procesar la respuesta del servidor',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#dc3545'
                });
            }
        } else {
            console.error(`Error HTTP ${xhr.status}: ${xhr.statusText}`);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: `Error HTTP ${xhr.status}: ${xhr.statusText}`,
                confirmButtonText: 'Ok',
                color: 'black',
                confirmButtonColor: '#dc3545'
            });
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al intentar obtener los datos del cliente');
        Swal.fire({
            icon: 'error',
            title: 'Error de Red',
            text: 'Error de conexión con el servidor',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#dc3545'
        });
    };
    
    // Enviar los datos
    const params = `action=GetPresupuestoData&nro_ticket=${encodeURIComponent(nroTicket)}`;
    xhr.send(params);
}

// Función para generar el PDF del presupuesto (con SweetAlert)
function generarPresupuestoPDF() {
    // Validar campos
    if (!validatePresupuestoFields()) {
        return;
    }
    
    const data = getPresupuestoData();
    const nroTicket = data.nroTicket;
    
    // Obtener datos del cliente
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPresupuestoData`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success && response.data) {
                    const clienteData = response.data;
                    
                    // Obtener datos del modal
                    const presupuestoData = {
                        nroTicket: nroTicket,
                        fechaPresupuesto: data.fechaPresupuesto,
                        validez: '5 días hábiles',
                        descripcion: data.descripcion,
                        montoTaller: data.montoTaller,
                        montoPagadoUSD: window.presupuestoMontoPagadoUSD || 0,
                        diferenciaUSD: parseFloat(document.getElementById('presupuestoDiferenciaUSD').value) || 0,
                        diferenciaBS: parseFloat(document.getElementById('presupuestoDiferenciaBS').value) || 0,
                        montoTotalUSD: parseFloat(document.getElementById('presupuestoMontoUSD').value) || 0,
                        montoTotalBS: parseFloat(document.getElementById('presupuestoMontoBS').value) || 0,
                        cliente: clienteData
                    };
                    
                    // Guardar presupuesto primero para obtener el número de registro
                    saveBudgetToDatabaseWithCallback(presupuestoData, function(success, message, idBudget, presupuestoNumero) {
                        if (success && presupuestoNumero) {
                            // Guardar el número de registro en el objeto presupuestoData
                            presupuestoData.presupuestoNumero = presupuestoNumero;
                            
                            // Generar HTML del presupuesto CON el número de registro real
                            const html = buildPresupuestoHTML(presupuestoData);
                            
                            // Crear iframe temporal para renderizar el HTML con estilos
                            const iframe = document.createElement('iframe');
                            iframe.id = 'presupuestoPDFPreviewTemp';
                            iframe.style.position = 'fixed';
                            iframe.style.top = '0';
                            iframe.style.left = '0';
                            iframe.style.width = '800px';
                            iframe.style.height = '1200px';
                            iframe.style.border = 'none';
                            iframe.style.zIndex = '999999';
                            iframe.style.opacity = '0';
                            iframe.style.pointerEvents = 'none';
                            iframe.style.transform = 'translateX(-10000px)';
                            document.body.appendChild(iframe);

                            const doc = iframe.contentDocument || iframe.contentWindow.document;
                            const baseHref = `${window.location.origin}/SoportePost/`;
                            
                            // Inyectar base href para resolver rutas relativas
                            let htmlWithBase = html.replace('<head>', `<head><base href="${baseHref}">`);
                            
                            // Escribir el HTML completo con estilos
                            doc.open();
                            doc.write(htmlWithBase);
                            doc.close();

                            // Esperar a que el contenido se cargue completamente
                            const waitForLoad = () => {
                                return new Promise((resolve) => {
                                    const checkLoad = () => {
                                        if (doc.readyState === 'complete' && doc.body && doc.body.children.length > 0) {
                                            // Esperar un poco más para que los estilos se apliquen
                                            setTimeout(() => {
                                                resolve();
                                            }, 500);
                                        } else {
                                            setTimeout(checkLoad, 100);
                                        }
                                    };
                                    
                                    if (doc.readyState === 'complete') {
                                        checkLoad();
                                    } else {
                                        const onReady = () => {
                                            doc.removeEventListener('DOMContentLoaded', onReady);
                                            checkLoad();
                                        };
                                        doc.addEventListener('DOMContentLoaded', onReady);
                                        setTimeout(() => {
                                            doc.removeEventListener('DOMContentLoaded', onReady);
                                            checkLoad();
                                        }, 3000);
                                    }
                                });
                            };

                            waitForLoad().then(() => {
                                // Mostrar en el iframe del modal
                                const previewIframe = document.getElementById('presupuestoPDFPreview');
                                const previewDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
                                previewDoc.open();
                                previewDoc.write(htmlWithBase);
                                previewDoc.close();
                                
                                // Cerrar modal de presupuesto y abrir modal de PDF
                                if (bsPresupuestoModal) {
                                    bsPresupuestoModal.hide();
                                }
                                
                                setTimeout(() => {
                                    if (bsPresupuestoPDFModal) {
                                        bsPresupuestoPDFModal.show();
                                    }
                                    
                                    // Esperar a que el iframe del modal cargue completamente
                                    setTimeout(() => {
                                        // Mostrar SweetAlert con opciones
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Presupuesto',
                                            text: 'El archivo se generó correctamente. Puedes guardarlo como PDF.',
                                            showCancelButton: false,
                                            confirmButtonText: 'Guardar PDF',
                                            confirmButtonColor: '#003594',
                                            color: 'black'
                                        }).then((result) => {
                                            // Si el usuario presiona "Guardar PDF"
                                            if (result.isConfirmed) {
                                                // Generar nombre del archivo usando el número de registro
                                                const fileName = `${presupuestoNumero}.pdf`;
                                                
                                                // Obtener el iframe del modal que tiene el documento
                                                const previewIframe = document.getElementById('presupuestoPDFPreview');
                                                
                                                if (previewIframe && previewIframe.contentWindow) {
                                                    // Guardar títulos originales
                                                    const originalIframeTitle = previewIframe.contentDocument.title || '';
                                                    const originalWindowTitle = window.document.title || '';
                                                    
                                                    // Asignar el nombre del archivo al título del iframe y ventana
                                                    previewIframe.contentDocument.title = fileName;
                                                    window.document.title = fileName;
                                                    
                                                    // Llamar a la función de impresión del navegador
                                                    previewIframe.contentWindow.focus();
                                                    previewIframe.contentWindow.print();
                                                    
                                                    // Restaurar títulos después de un momento
                                                    setTimeout(() => {
                                                        previewIframe.contentDocument.title = originalIframeTitle;
                                                        window.document.title = originalWindowTitle;
                                                        
                                                        // Limpiar iframe temporal
                                                        if (iframe && iframe.parentNode) {
                                                            document.body.removeChild(iframe);
                                                        }
                                                        
                                                        // Recargar la página solo después de guardar
                                                        window.location.reload();
                                                    }, 500);
                                                }
                                            }
                                        });
                                    }, 800); // Esperar 800ms para que el iframe del modal cargue
                                }, 300);
                            });
                        } else {
                                // Si hubo error al guardar, mostrar error
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: message || 'No se pudo guardar el presupuesto en la base de datos.',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#dc3545',
                                    color: 'black'
                                });
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message || 'No se pudieron obtener los datos del cliente',
                            confirmButtonText: 'Ok',
                            color: 'black',
                            confirmButtonColor: '#dc3545'
                        });
                    }
            } catch (error) {
                console.error('Error al parsear la respuesta JSON:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Respuesta',
                    text: 'Error al procesar la respuesta del servidor',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#dc3545'
                });
            }
        } else {
            console.error(`Error HTTP ${xhr.status}: ${xhr.statusText}`);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: `Error HTTP ${xhr.status}: ${xhr.statusText}`,
                confirmButtonText: 'Ok',
                color: 'black',
                confirmButtonColor: '#dc3545'
            });
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al intentar obtener los datos del cliente');
        Swal.fire({
            icon: 'error',
            title: 'Error de Red',
            text: 'Error de conexión con el servidor',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#dc3545'
        });
    };
    
    // Enviar los datos
    const params = `action=GetPresupuestoData&nro_ticket=${encodeURIComponent(nroTicket)}`;
    xhr.send(params);
}

// Función para hacer scroll automático en inputs con texto largo
function setupAutoScrollInputs() {
    const inputs = document.querySelectorAll('#presupuestoModal .form-control[readonly]');
    
    inputs.forEach(input => {
        let scrollAnimationId = null;
        let isPaused = false;
        
        const startAutoScroll = () => {
            // Limpiar animación anterior si existe
            if (scrollAnimationId) {
                cancelAnimationFrame(scrollAnimationId);
            }
            
            // Verificar si el texto es más largo que el ancho visible
            if (input.scrollWidth <= input.clientWidth || !input.value.trim()) {
                input.scrollLeft = 0;
                return;
            }
            
            let scrollPosition = 0;
            let scrollDirection = 1; // 1 = derecha, -1 = izquierda
            const scrollSpeed = 0.5; // píxeles por frame (más lento)
            const pauseTime = 2000; // pausa de 2 segundos al inicio y final
            let pauseStart = Date.now();
            let isInitialPause = true;
            
            const scroll = () => {
                // Pausa inicial
                if (isInitialPause) {
                    if (Date.now() - pauseStart >= pauseTime) {
                        isInitialPause = false;
                    } else {
                        scrollAnimationId = requestAnimationFrame(scroll);
                        return;
                    }
                }
                
                // Si está pausado por hover, no hacer nada
                if (isPaused) {
                    scrollAnimationId = requestAnimationFrame(scroll);
                    return;
                }
                
                // Calcular nueva posición
                scrollPosition += scrollSpeed * scrollDirection;
                
                // Cambiar dirección si llega al final
                const maxScroll = input.scrollWidth - input.clientWidth;
                if (scrollPosition >= maxScroll) {
                    scrollDirection = -1;
                    pauseStart = Date.now();
                    isInitialPause = true;
                } else if (scrollPosition <= 0) {
                    scrollDirection = 1;
                    pauseStart = Date.now();
                    isInitialPause = true;
                }
                
                input.scrollLeft = scrollPosition;
                scrollAnimationId = requestAnimationFrame(scroll);
            };
            
            // Iniciar scroll
            scrollAnimationId = requestAnimationFrame(scroll);
        };
        
        // Pausar scroll al hacer hover
        input.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        input.addEventListener('mouseleave', () => {
            isPaused = false;
        });
        
        // Verificar cuando se carga el valor
        setTimeout(() => {
            startAutoScroll();
        }, 500);
        
        // Verificar cuando cambia el valor
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                startAutoScroll();
            }, 100);
        });
        
        observer.observe(input, {
            attributes: true,
            attributeFilter: ['value']
        });
        
        // También verificar al cambiar el tamaño de la ventana
        const resizeHandler = () => {
            setTimeout(() => {
                startAutoScroll();
            }, 100);
        };
        
        window.addEventListener('resize', resizeHandler);
        
        // Limpiar al cerrar el modal
        const modal = document.getElementById('presupuestoModal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', () => {
                if (scrollAnimationId) {
                    cancelAnimationFrame(scrollAnimationId);
                }
                window.removeEventListener('resize', resizeHandler);
                observer.disconnect();
            }, { once: true });
        }
    });
}

// Función para generar número de presupuesto en formato PRES-TICKET-SEQ
function generatePresupuestoNumero(nroTicket) {
    const storageKey = `presupuesto_count_${nroTicket}`;
    let sequence = 1;
    
    // Intentar obtener el contador desde localStorage
    const storedCount = localStorage.getItem(storageKey);
    if (storedCount) {
        sequence = parseInt(storedCount, 10) + 1;
    }
    
    // Guardar el nuevo contador
    localStorage.setItem(storageKey, sequence.toString());
    
    // Formato: PRES-TICKET-SEQ (ejemplo: PRES-1812250001-001)
    const seqFormatted = String(sequence).padStart(3, '0');
    return `PRES-${nroTicket}-${seqFormatted}`;
}

// Función para guardar el presupuesto en la base de datos
function saveBudgetToDatabase(presupuestoData) {
    // Obtener el número de presupuesto generado
    const presupuestoNumero = generatePresupuestoNumero(presupuestoData.nroTicket);
    
    // Preparar datos para enviar
    const data = new URLSearchParams();
    data.append('action', 'SaveBudget');
    data.append('nro_ticket', presupuestoData.nroTicket);
    data.append('monto_taller', presupuestoData.montoTaller || 0);
    data.append('diferencia_usd', presupuestoData.diferenciaUSD || 0);
    data.append('diferencia_bs', presupuestoData.diferenciaBS || 0);
    data.append('descripcion_reparacion', presupuestoData.descripcion || '');
    data.append('fecha_presupuesto', presupuestoData.fechaPresupuesto || new Date().toISOString().split('T')[0]);
    data.append('presupuesto_numero', presupuestoNumero);
    
    // Enviar petición AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/SaveBudget`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    console.log('Presupuesto guardado correctamente:', response);
                    // Opcional: mostrar notificación de éxito
                    // Swal.fire({
                    //     icon: 'success',
                    //     title: 'Presupuesto guardado',
                    //     text: 'El presupuesto se ha guardado correctamente en la base de datos.',
                    //     timer: 2000,
                    //     showConfirmButton: false
                    // });
                } else {
                    console.error('Error al guardar presupuesto:', response.message);
                }
            } catch (error) {
                console.error('Error al parsear respuesta:', error);
            }
        } else {
            console.error(`Error HTTP ${xhr.status}: ${xhr.statusText}`);
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al guardar el presupuesto');
    };
    
    xhr.send(data.toString());
}

// Función para guardar el presupuesto en la base de datos (versión con callback)
function saveBudgetToDatabaseWithCallback(presupuestoData, callback) {
    // Obtener el número de presupuesto generado
    const presupuestoNumero = generatePresupuestoNumero(presupuestoData.nroTicket);
    
    // Preparar datos para enviar
    const data = new URLSearchParams();
    data.append('action', 'SaveBudget');
    data.append('nro_ticket', presupuestoData.nroTicket);
    data.append('monto_taller', presupuestoData.montoTaller || 0);
    data.append('diferencia_usd', presupuestoData.diferenciaUSD || 0);
    data.append('diferencia_bs', presupuestoData.diferenciaBS || 0);
    data.append('descripcion_reparacion', presupuestoData.descripcion || '');
    data.append('fecha_presupuesto', presupuestoData.fechaPresupuesto || new Date().toISOString().split('T')[0]);
    data.append('presupuesto_numero', presupuestoNumero);
    
    // Enviar petición AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/SaveBudget`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    console.log('Presupuesto guardado correctamente:', response);
                    if (callback) {
                        callback(true, 'Presupuesto guardado correctamente.', response.id_budget, response.presupuesto_numero);
                    }
                } else {
                    console.error('Error al guardar presupuesto:', response.message);
                    if (callback) {
                        callback(false, response.message || 'Error al guardar el presupuesto.');
                    }
                }
            } catch (error) {
                console.error('Error al parsear respuesta:', error);
                if (callback) {
                    callback(false, 'Error al procesar la respuesta del servidor.');
                }
            }
        } else {
            console.error(`Error HTTP ${xhr.status}: ${xhr.statusText}`);
            if (callback) {
                callback(false, `Error HTTP ${xhr.status}: ${xhr.statusText}`);
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al guardar el presupuesto');
        if (callback) {
            callback(false, 'Error de conexión con el servidor.');
        }
    };
    
    xhr.send(data.toString());
}

// Función para construir el HTML del presupuesto (basada en buildDeliveryNoteHtml)
function buildPresupuestoHTML(d) {
  const safe = (s) => (s || '').toString();
  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('es-ES');
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleDateString('es-ES');
      }
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return new Date().toLocaleDateString('es-ES');
    }
  };
  
  // Usar el número de presupuesto del servidor si está disponible, sino generar uno local
  const presupuestoNumero = d.presupuestoNumero || generatePresupuestoNumero(d.nroTicket || '0000000000');
  
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presupuesto</title>
        <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11px;
            line-height: 1.2;
            color: #333;
            background: #fff;
            padding: 20px 10px 10px 10px;
            max-width: 100%;
            margin: 0 auto;
            overflow-x: hidden;
        }
        
        .top-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding: 5px 0;
        }
        
        .top-header-left {
            flex: 1;
        }
        
        .top-header-right {
            flex: 1;
            text-align: right;
        }
        
        .top-logo {
            max-width: 80px;
            max-height: 40px;
        }
        
        .top-rif {
            font-size: 11px;
            font-weight: bold;
            color: #2c5aa0;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            min-height: calc(100vh - 40px);
            display: flex;
            flex-direction: column;
        }
        
        .header {
            text-align: center;
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 2px solid #2c5aa0;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: #2c5aa0 !important;
        }
        
        .company-logo-img {
            max-width: 120px;
            max-height: 60px;
            margin-bottom: 8px;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        
        .company-address {
            font-size: 10px;
            color: #555;
            margin-bottom: 8px;
            line-height: 1.3;
            text-align: center;
            font-weight: 500;
        }
        
        .document-title {
            font-size: 16px;
            font-weight: bold;
            color: #2c5aa0;
            margin: 4px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .document-subtitle {
            font-size: 11px;
            color: #666;
            font-weight: 500;
        }
        
        .document-info {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 3px solid #2c5aa0;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
        }
        
        .info-label {
            font-size: 9px;
            color: #666;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        
        .info-value {
            font-size: 12px;
            font-weight: bold;
            color: #2c5aa0;
        }
        
        .content-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .section {
            margin: 6px 0;
            background: #fff;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            border: 1px solid #e9ecef;
        }
        
        .section-header {
            background: #2c5aa0 !important;
            color: white !important;
            padding: 6px 10px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        .section-content {
            padding: 8px 10px;
        }
        
        .field-row {
            display: flex;
            margin-bottom: 4px;
            align-items: flex-start;
        }
        
        .field-row:last-child {
            margin-bottom: 0;
        }
        
        .field-label {
            font-weight: 600;
            color: #555;
            min-width: 110px;
            margin-right: 8px;
            font-size: 10px;
            padding-top: 2px;
        }
        
        .field-value {
            flex: 1;
            color: #333;
            font-weight: 500;
            padding: 3px 8px;
            background: #f8f9fa;
            border-radius: 3px;
            border-left: 2px solid #2c5aa0;
            font-size: 10px;
            min-height: 20px;
            display: flex;
            align-items: center;
        }
        
        .field-value.large {
            min-height: 40px;
            align-items: flex-start;
            padding-top: 4px;
        }
        
        .two-columns {
            display: flex;
            gap: 10px;
        }
        
        .column {
            flex: 1;
        }
        
        .column-title {
            font-size: 10px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 4px;
            text-align: center;
            padding: 3px;
            background: #f0f4f8;
            border-radius: 3px;
            border-left: 3px solid #2c5aa0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
        }
        
        table th {
            background: #2c5aa0;
            color: white;
            padding: 6px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
        }
        
        table td {
            padding: 6px;
            border-bottom: 1px solid #ddd;
            font-size: 10px;
        }
        
        table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .description-box {
            margin-top: 8px;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 3px;
            border-left: 3px solid #2c5aa0;
        }
        
        .description-box strong {
            color: #2c5aa0;
            font-size: 10px;
        }
        
        .summary-box {
            background: #f8f9fa;
            border: 2px solid #2c5aa0;
            border-radius: 5px;
            padding: 10px;
            margin: 10px 0;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #ddd;
        }
        
        .summary-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 13px;
            background: #fff3cd !important;
            padding: 8px;
            margin-top: 8px;
            border-radius: 3px;
        }
        
        .summary-label {
            font-weight: 600;
            color: #333;
            font-size: 11px;
        }
        
        .summary-value {
            font-weight: bold;
            color: #2c5aa0;
            font-size: 11px;
        }
        
        
        /* ✅ ESTILOS DEL FOOTER */
        .footer {
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 8px;
            line-height: 1.2;
        }
        
        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .footer-left {
            flex: 1;
            text-align: left;
        }
        
        .footer-right {
            flex: 1;
            text-align: right;
        }
        
        .footer-logo {
            max-height: 25px;
            max-width: 100px;
        }
        
        .footer-rif {
            font-size: 10px;
            font-weight: bold;
            color: #2c5aa0;
        }
        
        .footer-text {
            text-align: center;
            margin-top: 6px;
        }
        
        /* Optimizaciones críticas para impresión */
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Mostrar header y footer personalizados solo en impresión */
          .print-header,
          .print-footer {
            display: block !important;
          }
          
          /* Ajustar el contenido para dar espacio al header/footer fijos */
          body {
            margin-top: 50px !important;
            margin-bottom: 40px !important;
          }
          
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          
          body {
            font-size: 10px !important;
            padding: 8px !important;
          }
          
          .container {
            max-width: 100% !important;
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            page-break-inside: avoid;
          }
          
          .section {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            margin: 4px 0 !important;
            page-break-inside: avoid;
          }
          
          .header {
            margin-bottom: 6px !important;
            padding: 6px 0 !important;
            page-break-after: avoid;
          }
          
          .company-address {
            font-size: 9px !important;
            margin-bottom: 6px !important;
          }
          
          .document-title {
            font-size: 14px !important;
          }
          
          .section-content {
            padding: 6px 8px !important;
          }
          
          .two-columns {
            gap: 10px !important;
          }
          
          .column-title {
            font-size: 10px !important;
            margin-bottom: 6px !important;
          }
          
          .footer {
            margin-top: 6px !important;
            padding-top: 4px !important;
            page-break-before: avoid;
          }
          
          .footer-content {
            margin-bottom: 6px !important;
            padding: 6px 0 !important;
          }
          
          .footer-logo {
            max-height: 20px !important;
            max-width: 80px !important;
          }
          
          .footer-rif {
            font-size: 9px !important;
          }
          
          .footer-text {
            margin-top: 4px !important;
          }
          
          .field-row {
            margin-bottom: 3px !important;
            page-break-inside: avoid;
          }
          
          .document-info {
            margin: 6px 0 !important;
            padding: 6px !important;
            page-break-after: avoid;
          }
          
          .section-header {
            padding: 4px 8px !important;
            font-size: 10px !important;
          }
        }
        
        /* Configuración de página para impresión */
        @page {
          size: letter;
          margin: 0.2in 0.5in;
          padding: 0;
          /* Ocultar header y footer del navegador */
          @top-left { content: ""; }
          @top-center { content: ""; }
          @top-right { content: ""; }
          @bottom-left { content: ""; }
          @bottom-center { content: ""; }
          @bottom-right { content: ""; }
        }
        
        /* Header personalizado para impresión */
        .print-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: white;
          border-bottom: 1px solid #ddd;
          z-index: 1000;
          padding: 8px 20px;
          box-sizing: border-box;
        }
        
        .print-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }
        
        .print-header-logo {
          max-height: 30px;
          max-width: 80px;
        }
        
        .print-header-rif {
          font-size: 12px;
          font-weight: bold;
          color: #2c5aa0;
        }
        
        /* Footer personalizado para impresión */
        .print-footer {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30px;
          background: white;
          border-top: 1px solid #ddd;
          z-index: 1000;
          padding: 5px 20px;
          box-sizing: border-box;
        }
        
        .print-footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          font-size: 10px;
          color: #666;
        }
        
        /* Evitar cortes de página en elementos críticos */
        .header,
        .document-info,
        .section,
        .summary-box,
        .footer {
          page-break-inside: avoid;
        }
    </style>
    </head>
    <body>
    <!-- Header superior con logo y RIF -->
    <div class="top-header">
      <div class="top-header-left">
        <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="top-logo" onerror="this.style.display='none'">
      </div>
      <div class="top-header-right">
        <div class="top-rif">RIF: J-00291615-0</div>
      </div>
    </div>
    
    <!-- Header personalizado para impresión -->
    <div class="print-header">
      <div class="print-header-content">
        <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="print-header-logo" onerror="this.style.display='none'">
        <div class="print-header-rif">RIF: J-00291615-0</div>
      </div>
    </div>
    
    <!-- Footer personalizado para impresión -->
    <div class="print-footer">
      <div class="print-footer-content">
        <div></div>
        <div></div>
      </div>
    </div>
    
    <div class="container">
      <div class="header">
        <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="company-logo-img" onerror="this.style.display='none'">
        <div class="company-address">
          Urbanización El Rosal. Av. Francisco de Miranda<br>
          Edif. Centro Sudamérica PH-A Caracas. Edo. Miranda
        </div>
        <div class="document-title">PRESUPUESTO</div>
        <div class="document-subtitle">${presupuestoNumero}</div>
      </div>
      
      <div class="document-info">
        <div class="info-item">
          <div class="info-label">FECHA PRESUPUESTO</div>
          <div class="info-value">${formatDate(d.fechaPresupuesto)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">VALIDEZ</div>
          <div class="info-value">${safe(d.validez)}</div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="section">
          <div class="section-header">DATOS DE LA EMPRESA</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">NOMBRE:</div>
              <div class="field-value">INTELIGENSA</div>
            </div>
            <div class="field-row">
              <div class="field-label">DIRECCIÓN:</div>
              <div class="field-value">EL ROSAL</div>
            </div>
            <div class="field-row">
              <div class="field-label">TELÉFONO:</div>
              <div class="field-value">0212-9541004, 0212-9541013</div>
            </div>
            <div class="field-row">
              <div class="field-label">E-MAIL:</div>
              <div class="field-value">carlos.rodriguez@intelipunto.com</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">DATOS DEL CLIENTE</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">COMERCIO:</div>
              <div class="field-value">${safe(d.cliente.razonsocial || 'N/A')}</div>
            </div>
            <div class="field-row">
              <div class="field-label">DIRECCIÓN:</div>
              <div class="field-value">${safe(d.cliente.direccion || 'N/A')}</div>
            </div>
            <div class="field-row">
              <div class="field-label">RIF:</div>
              <div class="field-value">${safe(d.cliente.coddocumento || 'N/A')}</div>
            </div>
            <div class="field-row">
              <div class="field-label">TELÉFONOS:</div>
              <div class="field-value">${safe(d.cliente.telf1 || 'N/A')}</div>
            </div>
            <div class="field-row">
              <div class="field-label">E-MAIL:</div>
              <div class="field-value">${safe(d.cliente.email || 'N/A')}</div>
            </div>
            <div class="field-row">
              <div class="field-label">SERIAL POS:</div>
              <div class="field-value">${safe(d.cliente.serial_pos || 'N/A')}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">DESCRIPCIÓN DE REPARACIÓN</div>
          <div class="section-content">
            <table>
              <thead>
                <tr>
                  <th>UNIDADES</th>
                  <th>VALOR / UNID</th>
                  <th>VALOR TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>$${formatCurrency(d.montoTaller)}</td>
                  <td>$${formatCurrency(d.montoTaller)}</td>
                </tr>
              </tbody>
            </table>
            <div class="description-box">
              <strong>Descripción:</strong><br>
              ${safe(d.descripcion).replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>

        <div class="summary-box">
          <div class="summary-row">
            <span class="summary-label">SUB-TOTAL:</span>
            <span class="summary-value">$${formatCurrency(d.montoTaller)}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">ABONO:</span>
            <span class="summary-value">$${formatCurrency(d.montoPagadoUSD)}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">TOTAL A PAGAR:</span>
            <span class="summary-value">$${formatCurrency(d.diferenciaUSD)}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-header">OBSERVACIÓN</div>
          <div class="section-content">
            <ul style="margin-left: 20px; color: #2c5aa0;">
              <li>Una vez realizado el pago correspondiente, enviar el soporte del mismo para su validación</li>
              <li>Tomar en cuenta la tasa del BCV del día al momento de realizar el pago</li>
            </ul>
          </div>
        </div>

        <!-- ✅ FOOTER ACTUALIZADO CON LOGO Y RIF -->
        <div class="footer">
          <div class="footer-content">
            <div class="footer-left">
              <img src="app/public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="footer-logo" onerror="this.style.display='none'">
            </div>
            <div class="footer-right">
              <div class="footer-rif">RIF: J-00291615-0</div>
            </div>
          </div>
          <div class="footer-text">
            <p>Documento válido como constancia oficial del presupuesto especificado.</p>
            <p>Generado: ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>`;
}

function processEmailQueuePendiente() {
    if (isProcessingPendiente || emailQueuePendiente.length === 0) {
        return;
    }

    isProcessingPendiente = true;
    const emailData = emailQueuePendiente.shift();


    const xhrEmail = new XMLHttpRequest();
    xhrEmail.open("POST", emailData.endpoint);
    xhrEmail.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhrEmail.timeout = 10000; // Timeout de 10 segundos

    xhrEmail.onload = function() {
        if (xhrEmail.status === 200) {
            try {
                const responseEmail = JSON.parse(xhrEmail.responseText);
                
                if (responseEmail.success) {
                    // ✅ NOTIFICACIÓN TOAST DE ÉXITO - INMEDIATA
                    Swal.fire({
                        icon: "success",
                        title: "Correo Enviado",
                        text: `Correo de notificación (${emailData.type}) enviado exitosamente para el ticket #${emailData.ticketNumber} - Cliente: ${emailData.ticketData?.razonsocial_cliente || emailData.ticketData?.razon_social || 'N/A'} (${emailData.ticketData?.rif_cliente || emailData.ticketData?.rif || 'N/A'})`,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end',
                        color: 'black',
                        timer: 2500,
                        timerProgressBar: true
                    });
                    
                    // Recargar la página después del timer
                    setTimeout(() => {
                        window.location.reload();
                    }, 2500); // 2.5 segundos para dar tiempo al toast
                } else {
                    console.error(`❌ Error al enviar correo (${emailData.type}):`, responseEmail.message);
                    // Recargar la página incluso si hay error
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } catch (error) {
                console.error(`❌ Error al parsear respuesta del correo (${emailData.type}):`, error);
                // Recargar la página incluso si hay error
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } else {
            console.error(`❌ Error al solicitar el envío de correo (${emailData.type}):`, xhrEmail.status);
            // Recargar la página incluso si hay error
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

        // Procesar siguiente correo en la cola
        isProcessingPendiente = false;
        if (emailQueuePendiente.length > 0) {
            setTimeout(() => {
                processEmailQueuePendiente();
            }, 100); // Pausa mínima de 100ms entre correos
        }
    };

    xhrEmail.onerror = function() {
        console.error(`❌ Error de red al enviar correo (${emailData.type})`);
        isProcessingPendiente = false;
        if (emailQueuePendiente.length > 0) {
            setTimeout(() => {
                processEmailQueuePendiente();
            }, 200); // Pausa mínima en caso de error
        }
    };

    xhrEmail.ontimeout = function() {
        console.error(`⏰ Timeout al enviar correo (${emailData.type})`);
        isProcessingPendiente = false;
        if (emailQueuePendiente.length > 0) {
            setTimeout(() => {
                processEmailQueuePendiente();
            }, 200); // Pausa mínima en caso de timeout
        }
    };

    xhrEmail.send(emailData.params);
}

// ✅ FUNCIÓN PARA TICKET CERRADO (con cola de correos)
function enviarCorreoTicketCerrado(ticketData) {
    // Obtener datos necesarios
    const coordinador = ticketData.user_coordinator_id || ticketData.id_coordinator || '';
    const id_user = ticketData.user_id || ticketData.id_user_gestion || '';
    const ticketNumber = ticketData.nro_ticket || ticketData.Nr_ticket || 'N/A';
    
    
    // Agregar a la cola de correos
    emailQueuePendiente.push({
        endpoint: `${ENDPOINT_BASE}${APP_PATH}api/email/send_end_ticket`,
        params: `id_user=${encodeURIComponent(id_user)}`,
        type: 'Ticket Cerrado',
        ticketNumber: ticketNumber,
        ticketData: ticketData
    });

    // Procesar la cola
    processEmailQueuePendiente();
}

// ✅ FUNCIÓN PARA TICKET DEVUELTO (con cola de correos)
function enviarCorreoTicketDevuelto(ticketData) {
    // Obtener datos necesarios
    const coordinador = ticketData.user_coordinator_id || ticketData.id_coordinator || '';
    const id_user = ticketData.user_id || ticketData.id_user_gestion || '';
    const ticketNumber = ticketData.nro_ticket || ticketData.Nr_ticket || 'N/A';
    
    
    // Agregar a la cola de correos
    emailQueuePendiente.push({
        endpoint: `${ENDPOINT_BASE}${APP_PATH}api/email/send_devolution_ticket`,
        params: `id_coordinador=${encodeURIComponent(coordinador)}&id_user=${encodeURIComponent(id_user)}`,
        type: 'Ticket Devuelto',
        ticketNumber: ticketNumber,
        ticketData: ticketData
    });

    // Procesar la cola
    processEmailQueuePendiente();
}

// ✅ FUNCIÓN PARA MOSTRAR ESTADO DE COLA DE PENDIENTE_ENTREGA (opcional, para debugging)
function mostrarEstadoColaPendiente() {
    if (emailQueuePendiente.length > 0) {
    }
    
    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: 'info',
            title: 'Estado de Cola de Correos (Pendiente Entrega)',
            html: `
                <div style="text-align: left;">
                    <p><strong>Correos en cola:</strong> ${emailQueuePendiente.length}</p>
                    <p><strong>Procesando:</strong> ${isProcessingPendiente ? 'Sí' : 'No'}</p>
                    ${emailQueuePendiente.length > 0 ? `<p><strong>Próximo correo:</strong> ${emailQueuePendiente[0].type} - Ticket #${emailQueuePendiente[0].ticketNumber}</p>` : ''}
                </div>
            `,
            color: 'black',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#003594'
        });
    }
}

// Exponer funciones globalmente para debugging (opcional)
window.mostrarEstadoColaPendiente = mostrarEstadoColaPendiente;
window.enviarCorreoTicketCerrado = enviarCorreoTicketCerrado;
window.enviarCorreoTicketDevuelto = enviarCorreoTicketDevuelto;

// Event listeners para el modal de carga de PDF del presupuesto
const inputPresupuestoPDFFileGlobal = document.getElementById("presupuestoPDFFile");
if (inputPresupuestoPDFFileGlobal) {
    inputPresupuestoPDFFileGlobal.addEventListener('change', function() {
        const formatInfo = document.getElementById('presupuestoPDFFileFormatInfo');
        const input = this;
        
        // Obtener referencias a los mensajes de feedback
        const validFeedback = input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
        const invalidFeedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
        
        if (this.files.length > 0 && this.files[0].type === 'application/pdf') {
            const uploadPresupuestoPDFBtnGlobal = document.getElementById("uploadPresupuestoPDFBtn");
            if (uploadPresupuestoPDFBtnGlobal) {
                uploadPresupuestoPDFBtnGlobal.disabled = false;
            }
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            
            // OCULTAR el mensaje inválido
            if (invalidFeedback) {
                invalidFeedback.style.setProperty("display", "none", "important");
                invalidFeedback.style.setProperty("visibility", "hidden", "important");
                invalidFeedback.style.setProperty("opacity", "0", "important");
                invalidFeedback.style.setProperty("height", "0", "important");
                invalidFeedback.style.setProperty("margin", "0", "important");
                invalidFeedback.style.setProperty("padding", "0", "important");
            }
            if (typeof $ !== 'undefined') {
                $(invalidFeedback).hide();
            }
            
            // MOSTRAR el mensaje válido
            if (validFeedback) {
                validFeedback.style.setProperty("display", "block", "important");
                validFeedback.style.setProperty("visibility", "visible", "important");
                validFeedback.style.setProperty("opacity", "1", "important");
                validFeedback.style.removeProperty("height");
                validFeedback.style.removeProperty("margin");
                validFeedback.style.removeProperty("padding");
            }
            if (typeof $ !== 'undefined') {
                $(validFeedback).show();
            }
            
            // OCULTAR el mensaje informativo "Formato permitido: PDF" cuando hay validación activa
            if (formatInfo) {
                formatInfo.style.setProperty("display", "none", "important");
                formatInfo.style.setProperty("visibility", "hidden", "important");
                formatInfo.style.setProperty("opacity", "0", "important");
                formatInfo.style.setProperty("height", "0", "important");
                formatInfo.style.setProperty("margin", "0", "important");
                formatInfo.style.setProperty("padding", "0", "important");
            }
            if (typeof $ !== 'undefined') {
                $('#presupuestoPDFFileFormatInfo').hide();
            }
        } else {
            const uploadPresupuestoPDFBtnGlobal = document.getElementById("uploadPresupuestoPDFBtn");
            if (uploadPresupuestoPDFBtnGlobal) {
                uploadPresupuestoPDFBtnGlobal.disabled = true;
            }
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
            
            // OCULTAR el mensaje válido
            if (validFeedback) {
                validFeedback.style.setProperty("display", "none", "important");
                validFeedback.style.setProperty("visibility", "hidden", "important");
                validFeedback.style.setProperty("opacity", "0", "important");
                validFeedback.style.setProperty("height", "0", "important");
                validFeedback.style.setProperty("margin", "0", "important");
                validFeedback.style.setProperty("padding", "0", "important");
            }
            if (typeof $ !== 'undefined') {
                $(validFeedback).hide();
            }
            
            // MOSTRAR el mensaje inválido
            if (invalidFeedback) {
                invalidFeedback.style.setProperty("display", "block", "important");
                invalidFeedback.style.setProperty("visibility", "visible", "important");
                invalidFeedback.style.setProperty("opacity", "1", "important");
                invalidFeedback.style.removeProperty("height");
                invalidFeedback.style.removeProperty("margin");
                invalidFeedback.style.removeProperty("padding");
            }
            if (typeof $ !== 'undefined') {
                $(invalidFeedback).show();
            }
            
            // OCULTAR el mensaje informativo "Formato permitido: PDF" cuando hay validación activa
            if (formatInfo) {
                formatInfo.style.setProperty("display", "none", "important");
                formatInfo.style.setProperty("visibility", "hidden", "important");
                formatInfo.style.setProperty("opacity", "0", "important");
                formatInfo.style.setProperty("height", "0", "important");
                formatInfo.style.setProperty("margin", "0", "important");
                formatInfo.style.setProperty("padding", "0", "important");
            }
            if (typeof $ !== 'undefined') {
                $('#presupuestoPDFFileFormatInfo').hide();
            }
        }
    });
}

const uploadPresupuestoPDFBtnGlobal = document.getElementById("uploadPresupuestoPDFBtn");
if (uploadPresupuestoPDFBtnGlobal) {
    uploadPresupuestoPDFBtnGlobal.addEventListener('click', async function() {
        const nroTicket = document.getElementById("uploadPresupuestoNroTicketHidden")?.value;
        const serialPos = document.getElementById("uploadPresupuestoSerialPosHidden")?.value;
        const inputPresupuestoPDFFileGlobal = document.getElementById("presupuestoPDFFile");
        const file = inputPresupuestoPDFFileGlobal?.files[0];
        const id_user = document.getElementById("userId")?.value;

        if (!nroTicket) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener el número de ticket.',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#dc3545',
                color: 'black',
            });
            return;
        }

        if (!serialPos) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo obtener el serial del ticket.',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#dc3545',
                color: 'black',
            });
            return;
        }

        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: '¡Advertencia!',
                text: 'Por favor, selecciona un archivo PDF antes de subir.',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003594',
                color: 'black',
            });
            return;
        }

        if (file.type !== 'application/pdf') {
            Swal.fire({
                icon: 'error',
                title: 'Formato Inválido',
                text: 'Solo se permiten archivos PDF.',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#dc3545',
                color: 'black',
            });
            return;
        }

        Swal.fire({
            title: 'Subiendo PDF...',
            html: 'Por favor, espere mientras se carga el documento.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const formData = new FormData();
        formData.append("action", "UploadPresupuestoPDF");
        formData.append("nro_ticket", nroTicket);
        formData.append("serial_pos", serialPos);
        formData.append("presupuesto_pdf_file", file);
        formData.append("id_user", id_user);

        try {
            console.log('Iniciando subida de PDF del presupuesto...');
            const url = `${ENDPOINT_BASE}${APP_PATH}api/consulta/UploadPresupuestoPDF`;
            console.log('URL:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            console.log('Respuesta recibida. Status:', response.status, 'OK:', response.ok);

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error HTTP:', response.status, errorText);
                throw new Error(`Error del servidor (${response.status}): ${errorText}`);
            }

            // Intentar parsear la respuesta como JSON
            let result;
            const contentType = response.headers.get("content-type");
            console.log('Content-Type:', contentType);
            
            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
                console.log('Resultado parseado:', result);
            } else {
                // Si no es JSON, leer como texto
                const text = await response.text();
                console.error('Respuesta del servidor no es JSON:', text);
                throw new Error('El servidor no devolvió una respuesta JSON válida. Respuesta: ' + text.substring(0, 200));
            }

            Swal.close();

            if (result && result.success) {
                // Cerrar el modal primero
                const modalElement = document.getElementById("uploadPresupuestoPDFModal");
                if (modalElement) {
                    const bsModal = new bootstrap.Modal(modalElement);
                    bsModal.hide();
                }
                
                // Limpiar el input y sus clases después de cerrar el modal
                setTimeout(() => {
                    const inputPresupuestoPDFFileLocal = document.getElementById("presupuestoPDFFile");
                    if (inputPresupuestoPDFFileLocal) {
                        inputPresupuestoPDFFileLocal.value = '';
                        inputPresupuestoPDFFileLocal.classList.remove('is-invalid', 'is-valid');
                    }
                    
                    // Ocultar mensajes de validación
                    const formatInfo = document.getElementById('presupuestoPDFFileFormatInfo');
                    const validFeedback = inputPresupuestoPDFFileLocal && inputPresupuestoPDFFileLocal.parentElement ? inputPresupuestoPDFFileLocal.parentElement.querySelector('.valid-feedback') : null;
                    const invalidFeedback = inputPresupuestoPDFFileLocal && inputPresupuestoPDFFileLocal.parentElement ? inputPresupuestoPDFFileLocal.parentElement.querySelector('.invalid-feedback') : null;
                    
                    if (validFeedback) {
                        validFeedback.style.setProperty("display", "none", "important");
                    }
                    if (invalidFeedback) {
                        invalidFeedback.style.setProperty("display", "none", "important");
                    }
                    if (formatInfo) {
                        formatInfo.style.removeProperty("display");
                    }
                    
                    // Deshabilitar el botón de subir
                    const uploadPresupuestoPDFBtnLocal = document.getElementById("uploadPresupuestoPDFBtn");
                    if (uploadPresupuestoPDFBtnLocal) {
                        uploadPresupuestoPDFBtnLocal.disabled = true;
                    }
                }, 300);
                
                // Mostrar mensaje de éxito con temporizador
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: result.message || 'El PDF del presupuesto se ha cargado y guardado correctamente.',
                    color: 'black',
                    timer: 3500, // 3.5 segundos
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then((result) => {
                    // Recargar la página después de cerrar el SweetAlert automáticamente
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al subir',
                    text: (result && result.message) || 'Hubo un error al cargar el PDF del presupuesto. Por favor, intente nuevamente.',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#dc3545',
                    color: 'black',
                });
            }
        } catch (error) {
            console.error('Error completo al subir PDF:', error);
            console.error('Stack trace:', error.stack);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo conectar con el servidor para subir el PDF. Verifique su conexión.',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#dc3545',
                color: 'black',
            });
        }
    });
}

const modalElementUploadPresupuestoPDFGlobal = document.getElementById("uploadPresupuestoPDFModal");
if (modalElementUploadPresupuestoPDFGlobal) {
    modalElementUploadPresupuestoPDFGlobal.addEventListener('hidden.bs.modal', function () {
        const inputPresupuestoPDFFileLocal = document.getElementById("presupuestoPDFFile");
        if (inputPresupuestoPDFFileLocal) {
            inputPresupuestoPDFFileLocal.value = '';
            inputPresupuestoPDFFileLocal.classList.remove('is-invalid', 'is-valid');
        }
        const uploadPresupuestoPDFBtnLocal = document.getElementById("uploadPresupuestoPDFBtn");
        if (uploadPresupuestoPDFBtnLocal) {
            uploadPresupuestoPDFBtnLocal.disabled = true;
        }
        // Ocultar mensajes de validación y mostrar el texto informativo al cerrar
        setTimeout(function() {
            const formatInfo = document.getElementById('presupuestoPDFFileFormatInfo');
            const input = document.getElementById("presupuestoPDFFile");
            
            // Ocultar mensajes de feedback
            const validFeedback = input && input.parentElement ? input.parentElement.querySelector('.valid-feedback') : null;
            const invalidFeedback = input && input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;
            
            if (validFeedback) {
                validFeedback.style.setProperty("display", "none", "important");
                validFeedback.style.setProperty("visibility", "hidden", "important");
                validFeedback.style.setProperty("opacity", "0", "important");
                validFeedback.style.setProperty("height", "0", "important");
                validFeedback.style.setProperty("margin", "0", "important");
                validFeedback.style.setProperty("padding", "0", "important");
            }
            if (invalidFeedback) {
                invalidFeedback.style.setProperty("display", "none", "important");
                invalidFeedback.style.setProperty("visibility", "hidden", "important");
                invalidFeedback.style.setProperty("opacity", "0", "important");
                invalidFeedback.style.setProperty("height", "0", "important");
                invalidFeedback.style.setProperty("margin", "0", "important");
                invalidFeedback.style.setProperty("padding", "0", "important");
            }
            
            // MOSTRAR el mensaje informativo "Formato permitido: PDF" cuando no hay validación
            if (formatInfo) {
                formatInfo.style.removeProperty("display");
                formatInfo.style.removeProperty("visibility");
                formatInfo.style.removeProperty("opacity");
                formatInfo.style.removeProperty("height");
                formatInfo.style.removeProperty("margin");
                formatInfo.style.removeProperty("padding");
            }
            if (typeof $ !== 'undefined') {
                if (validFeedback) $(validFeedback).hide();
                if (invalidFeedback) $(invalidFeedback).hide();
                $('#presupuestoPDFFileFormatInfo').show();
            }
        }, 100);
    });
    
    // También mostrar el texto cuando se abre el modal
    modalElementUploadPresupuestoPDFGlobal.addEventListener('shown.bs.modal', function () {
        const formatInfo = document.getElementById('presupuestoPDFFileFormatInfo');
        if (formatInfo) {
            formatInfo.style.display = 'block';
        }
    });

// ========== FUNCIONES PARA MODAL DE AGREGAR ANTICIPO ==========

// Función para abrir el modal de agregar anticipo
function openAgregarAnticipoModal(nroTicket, serialPos = '') {
    // Si no se pasó el serial, intentar obtenerlo desde la tabla
    if (!serialPos) {
        const table = $('#ticketsTable').DataTable();
        if (table) {
            table.rows().every(function() {
                const rowData = this.data();
                if (rowData && rowData.nro_ticket === nroTicket) {
                    serialPos = rowData.serial_pos || '';
                    return false; // Salir del bucle
                }
            });
        }
    }
    
    // Establecer el serial en el campo
    const serialPosPagoInput = document.getElementById('serialPosPago');
    if (serialPosPagoInput) {
        serialPosPagoInput.value = serialPos || '';
    }
    
    // Establecer el nro_ticket en el campo oculto
    const nroTicketPagoInput = document.getElementById('nro_ticket_pago');
    if (nroTicketPagoInput) {
        nroTicketPagoInput.value = nroTicket;
    }
    
    // Establecer fecha de hoy en fechaCarga
    const fechaCargaInput = document.getElementById('fechaCarga');
    if (fechaCargaInput) {
        const today = new Date();
        const fechaFormateada = today.toISOString().split('T')[0];
        fechaCargaInput.value = fechaFormateada;
    }
    
    // Cargar métodos de pago y bancos
    if (typeof loadPaymentMethods === 'function') {
        loadPaymentMethods();
    }
    if (typeof loadBancos === 'function') {
        loadBancos();
    }
    
    // Cargar tasa de cambio
    if (typeof loadExchangeRateToday === 'function') {
        loadExchangeRateToday();
    }
    
    // Configurar generación automática del número de registro
    setupAutoRegistrationNumber();
    
    // Configurar validaciones numéricas
    setupNumericValidation();
    
    // Abrir el modal
    const modalElement = document.getElementById('modalAgregarDatosPago');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

// Función para guardar los datos de pago (adaptada de consulta_rif)
function savePaymentPendienteEntrega() {
    // Obtener todos los valores del formulario
    const serialPosPago = document.getElementById("serialPosPago");
    const idUser = document.getElementById("id_user_pago");
    const nroTicketPago = document.getElementById("nro_ticket_pago");
    const fechaPago = document.getElementById("fechaPago");
    const fechaCarga = document.getElementById("fechaCarga");
    const formaPago = document.getElementById("formaPago");
    const moneda = document.getElementById("moneda");
    const montoBs = document.getElementById("montoBs");
    const montoRef = document.getElementById("montoRef");
    const referencia = document.getElementById("referencia");
    const obsAdministracion = document.getElementById("obsAdministracion");
    const registro = document.getElementById("registro");
    const bancoOrigen = document.getElementById("bancoOrigen");
    const bancoDestino = document.getElementById("bancoDestino");
    const depositante = document.getElementById("depositante");
    
    // Validaciones básicas
    if (!fechaPago || !fechaPago.value || fechaPago.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe seleccionar la fecha de pago.',
            confirmButtonColor: '#3085d6'
        });
        if (fechaPago) fechaPago.focus();
        return;
    }
    
    if (!formaPago || !formaPago.value || formaPago.value === "" || formaPago.value === "0") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe seleccionar una forma de pago.',
            confirmButtonColor: '#3085d6'
        });
        if (formaPago) formaPago.focus();
        return;
    }

    // Obtener el ID y texto del método de pago seleccionado para validaciones condicionales
    const selectedPaymentMethodId = parseInt(formaPago.value);
    const paymentMethodText = formaPago.options[formaPago.selectedIndex].textContent;
    const selectedPaymentMethodName = paymentMethodText.toLowerCase();

    // Validaciones condicionales según el método de pago
    // Si es Transferencia (ID = 2), validar bancos
    if (selectedPaymentMethodId === 2) {
        if (!bancoOrigen || !bancoOrigen.value || bancoOrigen.value === "" || bancoOrigen.value === "0") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe seleccionar un banco de origen para Transferencia.',
                confirmButtonColor: '#3085d6'
            });
            if (bancoOrigen) bancoOrigen.focus();
            return;
        }

        if (!bancoDestino || !bancoDestino.value || bancoDestino.value === "" || bancoDestino.value === "0") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe seleccionar un banco de destino para Transferencia.',
                confirmButtonColor: '#3085d6'
            });
            if (bancoDestino) bancoDestino.focus();
            return;
        }
    }

    // Si es Pago Móvil (ID = 5), validar campos del origen
    if (selectedPaymentMethodId === 5) {
        const origenRifTipo = document.getElementById("origenRifTipo");
        const origenRifNumero = document.getElementById("origenRifNumero");
        const origenTelefono = document.getElementById("origenTelefono");
        const origenBanco = document.getElementById("origenBanco");

        if (!origenRifTipo || !origenRifTipo.value || origenRifTipo.value === "" || origenRifTipo.value === "0") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe seleccionar el tipo de RIF del origen para Pago Móvil.',
                confirmButtonColor: '#3085d6'
            });
            if (origenRifTipo) origenRifTipo.focus();
            return;
        }

        if (!origenRifNumero || !origenRifNumero.value || origenRifNumero.value.trim() === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe ingresar el número de RIF del origen para Pago Móvil.',
                confirmButtonColor: '#3085d6'
            });
            if (origenRifNumero) origenRifNumero.focus();
            return;
        }

        if (!origenTelefono || !origenTelefono.value || origenTelefono.value.trim() === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe ingresar el número telefónico del origen para Pago Móvil.',
                confirmButtonColor: '#3085d6'
            });
            if (origenTelefono) origenTelefono.focus();
            return;
        }

        if (!origenBanco || !origenBanco.value || origenBanco.value === "" || origenBanco.value === "0") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obligatorio',
                text: 'Debe seleccionar el banco del origen para Pago Móvil.',
                confirmButtonColor: '#3085d6'
            });
            if (origenBanco) origenBanco.focus();
            return;
        }
    }
    
    if (!moneda || !moneda.value || moneda.value === "" || moneda.value === "0") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe seleccionar una moneda.',
            confirmButtonColor: '#3085d6'
        });
        if (moneda) moneda.focus();
        return;
    }
    
    if (!montoBs || !montoBs.value || montoBs.value.trim() === "" || montoBs.value === "0" || montoBs.value === "0.00") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'El monto en Bolívares es obligatorio y debe ser mayor a 0.',
            confirmButtonColor: '#3085d6'
        });
        if (montoBs) montoBs.focus();
        return;
    }
    
    const montoBsValue = parseFloat(montoBs.value.replace(/,/g, ''));
    if (isNaN(montoBsValue) || montoBsValue <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Valor Inválido',
            text: 'El monto en Bolívares debe ser un número mayor a 0.',
            confirmButtonColor: '#3085d6'
        });
        if (montoBs) montoBs.focus();
        return;
    }
    
    if (!referencia || !referencia.value || referencia.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe ingresar el número de referencia.',
            confirmButtonColor: '#3085d6'
        });
        if (referencia) referencia.focus();
        return;
    }
    
    if (!depositante || !depositante.value || depositante.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obligatorio',
            text: 'Debe ingresar el nombre del depositante.',
            confirmButtonColor: '#3085d6'
        });
        if (depositante) depositante.focus();
        return;
    }
    
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
        Swal.fire({
            icon: 'error',
            title: 'Error de Configuración',
            text: 'Variables de entorno (ENDPOINT_BASE o APP_PATH) no definidas.',
            confirmButtonColor: '#d33'
        });
        return;
    }
    
    // Preparar datos para enviar
    // El campo fechaPago es type="date", así que ya viene en formato YYYY-MM-DD
    let fechaPagoValue = fechaPago.value;
    
    // Agregar hora a la fecha
    function addTimeToDate(dateString) {
        if (!dateString) return null;
        if (dateString.includes(' ') && dateString.includes(':')) {
            return dateString;
        }
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${dateString} ${hours}:${minutes}:${seconds}`;
    }
    
    // Obtener campos de Pago Móvil si están visibles
    const destinoRifTipo = document.getElementById("destinoRifTipo");
    const destinoRifNumero = document.getElementById("destinoRifNumero");
    const destinoTelefono = document.getElementById("destinoTelefono");
    const destinoBanco = document.getElementById("destinoBanco");
    
    // Determinar si es Pago Móvil (ID = 5 o por nombre)
    const isPagoMovil = selectedPaymentMethodId === 5 || selectedPaymentMethodName.includes("móvil") || selectedPaymentMethodName.includes("movil");
    
    // Reutilizar variables ya declaradas en validaciones
    let origenRifTipo, origenRifNumero, origenTelefono, origenBanco;
    if (isPagoMovil) {
        origenRifTipo = document.getElementById("origenRifTipo");
        origenRifNumero = document.getElementById("origenRifNumero");
        origenTelefono = document.getElementById("origenTelefono");
        origenBanco = document.getElementById("origenBanco");
    }
    
    // Determinar origen_bank y destination_bank según el tipo de pago
    let origenBankValue = null;
    let destinationBankValue = null;
    
    if (isPagoMovil) {
        // Para Pago Móvil, usar los bancos de los campos específicos
        origenBankValue = origenBanco && origenBanco.value ? origenBanco.options[origenBanco.selectedIndex].textContent : null;
        destinationBankValue = destinoBanco && destinoBanco.value ? destinoBanco.options[destinoBanco.selectedIndex].textContent : null;
    } else {
        // Para Transferencia, usar los campos de banco existentes
        origenBankValue = bancoOrigen && bancoOrigen.value ? bancoOrigen.options[bancoOrigen.selectedIndex].textContent : null;
        destinationBankValue = bancoDestino && bancoDestino.value ? bancoDestino.options[bancoDestino.selectedIndex].textContent : null;
    }
    
    const formData = new URLSearchParams();
    formData.append("serial_pos", serialPosPago ? serialPosPago.value : '');
    formData.append("nro_ticket", nroTicketPago ? nroTicketPago.value : '');
    formData.append("user_loader", idUser ? idUser.value : null);
    formData.append("payment_date", addTimeToDate(fechaPagoValue));
    formData.append("origen_bank", origenBankValue);
    formData.append("destination_bank", destinationBankValue);
    formData.append("payment_method", paymentMethodText);
    formData.append("currency", moneda.value === "bs" ? "BS" : "USD");
    formData.append("reference_amount", montoRef && montoRef.value ? parseFloat(montoRef.value) : null);
    formData.append("amount_bs", montoBsValue);
    formData.append("payment_reference", referencia ? referencia.value : null);
    formData.append("depositor", depositante.value ? depositante.value : null);
    formData.append("observations", obsAdministracion ? obsAdministracion.value : null);
    formData.append("record_number", registro ? registro.value : null);
    formData.append("loadpayment_date", fechaCarga && fechaCarga.value ? addTimeToDate(fechaCarga.value) : new Date().toISOString().slice(0, 19).replace('T', ' '));
    formData.append("confirmation_number", false);
    
    // Agregar campos de Pago Móvil si es ese método de pago
    if (isPagoMovil) {
        formData.append("destino_rif_tipo", destinoRifTipo ? destinoRifTipo.value : null);
        formData.append("destino_rif_numero", destinoRifNumero ? destinoRifNumero.value : null);
        formData.append("destino_telefono", destinoTelefono ? destinoTelefono.value : null);
        formData.append("destino_banco", destinoBanco && destinoBanco.value ? destinoBanco.options[destinoBanco.selectedIndex].textContent : null);
        formData.append("origen_rif_tipo", origenRifTipo ? origenRifTipo.value : null);
        formData.append("origen_rif_numero", origenRifNumero ? origenRifNumero.value : null);
        formData.append("origen_telefono", origenTelefono ? origenTelefono.value : null);
        formData.append("origen_banco", origenBanco && origenBanco.value ? origenBanco.options[origenBanco.selectedIndex].textContent : null);
    }
    
    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/SavePayment";
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                
                if (data.success) {
                    // Obtener valores formateados para el informe
                    const fechaPagoFormatted = fechaPago && fechaPago.value ? new Date(fechaPago.value).toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A';
                    const fechaCargaFormatted = fechaCarga && fechaCarga.value ? new Date(fechaCarga.value).toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A';
                    const montoBsFormatted = montoBsValue ? montoBsValue.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
                    const montoRefFormatted = montoRef && montoRef.value ? parseFloat(montoRef.value).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';
                    const monedaText = moneda && moneda.value === 'bs' ? 'Bolívares (Bs)' : moneda && moneda.value === 'usd' ? 'Dólares (USD)' : 'N/A';
                    
                    // Construir HTML del informe empresarial
                    const paymentReportHtml = `
                        <div style="text-align: left; padding: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 8px;">
                            <!-- Encabezado -->
                            <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #28a745;">
                                <h3 style="color: #28a745; margin: 0; font-size: 1.5em; font-weight: 700;">
                                    <i class="fas fa-check-circle" style="margin-right: 8px;"></i>Pago Registrado Exitosamente
                                </h3>
                                <p style="color: #6c757d; margin: 8px 0 0 0; font-size: 0.9em;">
                                    Registro temporal guardado correctamente
                                </p>
                            </div>
                            
                            <!-- Información Principal -->
                            <div style="background: #ffffff; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                    <i class="fas fa-fingerprint" style="color: #28a745; font-size: 1.2em; margin-right: 10px; width: 25px;"></i>
                                    <div>
                                        <strong style="color: #495057; font-size: 0.85em;">ID de Registro Temporal:</strong>
                                        <span style="color: #212529; font-weight: 700; font-size: 1.1em; margin-left: 8px;">#${data.id_payment_record || 'N/A'}</span>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <i class="fas fa-barcode" style="color: #007bff; font-size: 1.2em; margin-right: 10px; width: 25px;"></i>
                                    <div>
                                        <strong style="color: #495057; font-size: 0.85em;">Serial POS:</strong>
                                        <span style="color: #212529; font-weight: 600; margin-left: 8px;">${serialPosPago ? serialPosPago.value : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Detalles del Pago -->
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                                <h4 style="color: #495057; margin: 0 0 15px 0; font-size: 1.1em; font-weight: 600; border-bottom: 2px solid #dee2e6; padding-bottom: 8px;">
                                    <i class="fas fa-money-bill-wave" style="margin-right: 8px; color: #28a745;"></i>Detalles del Pago
                                </h4>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                    <div style="background: #ffffff; padding: 10px; border-radius: 4px;">
                                        <strong style="color: #6c757d; font-size: 0.8em; display: block; margin-bottom: 4px;">Método de Pago</strong>
                                        <span style="color: #212529; font-weight: 600; font-size: 0.95em;">${paymentMethodText || 'N/A'}</span>
                                    </div>
                                    <div style="background: #ffffff; padding: 10px; border-radius: 4px;">
                                        <strong style="color: #6c757d; font-size: 0.8em; display: block; margin-bottom: 4px;">Moneda</strong>
                                        <span style="color: #212529; font-weight: 600; font-size: 0.95em;">${monedaText}</span>
                                    </div>
                                    <div style="background: #ffffff; padding: 10px; border-radius: 4px;">
                                        <strong style="color: #6c757d; font-size: 0.8em; display: block; margin-bottom: 4px;">Monto en Bolívares</strong>
                                        <span style="color: #28a745; font-weight: 700; font-size: 1.1em;">Bs. ${montoBsFormatted}</span>
                                    </div>
                                    ${montoRef && montoRef.value ? `
                                    <div style="background: #ffffff; padding: 10px; border-radius: 4px;">
                                        <strong style="color: #6c757d; font-size: 0.8em; display: block; margin-bottom: 4px;">Monto de Referencia</strong>
                                        <span style="color: #007bff; font-weight: 700; font-size: 1.1em;">USD ${montoRefFormatted}</span>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- Información Adicional -->
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                                <h4 style="color: #495057; margin: 0 0 15px 0; font-size: 1.1em; font-weight: 600; border-bottom: 2px solid #dee2e6; padding-bottom: 8px;">
                                    <i class="fas fa-info-circle" style="margin-right: 8px; color: #007bff;"></i>Información Adicional
                                </h4>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-calendar-alt" style="margin-right: 5px;"></i>Fecha de Pago
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${fechaPagoFormatted}</span>
                                    </div>
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-calendar-check" style="margin-right: 5px;"></i>Fecha de Carga
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${fechaCargaFormatted}</span>
                                    </div>
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-hashtag" style="margin-right: 5px;"></i>Referencia
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${referencia ? referencia.value : 'N/A'}</span>
                                    </div>
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-user" style="margin-right: 5px;"></i>Depositante
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${depositante ? depositante.value : 'N/A'}</span>
                                    </div>
                                    ${registro && registro.value ? `
                                    <div>
                                        <strong style="color: #6c757d; font-size: 0.85em; display: block; margin-bottom: 4px;">
                                            <i class="fas fa-book" style="margin-right: 5px;"></i>Número de Registro
                                        </strong>
                                        <span style="color: #212529; font-weight: 500;">${registro.value}</span>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- Nota Informativa -->
                            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; border-radius: 4px; margin-top: 15px;">
                                <p style="margin: 0; color: #856404; font-size: 0.9em; line-height: 1.5;">
                                    <i class="fas fa-info-circle" style="margin-right: 6px;"></i>
                                    <strong>Nota:</strong> Este registro se guardará automáticamente en la tabla principal cuando se cree el ticket correspondiente. 
                                    <strong style="color: #dc3545;">Si no se carga el ticket correspondiente, este registro será eliminado.</strong>
                                </p>
                            </div>
                        </div>
                    `;
                    
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        html: paymentReportHtml,
                        width: '650px',
                        showConfirmButton: true,
                        confirmButtonText: '<i class="fas fa-check"></i> Aceptar',
                        confirmButtonColor: '#28a745',
                        customClass: {
                            popup: 'swal2-popup-custom',
                            htmlContainer: 'swal2-html-container-custom'
                        },
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        }
                    }).then(() => {
                        // Cerrar el modal de agregar datos de pago
                        const modalElement = document.getElementById("modalAgregarDatosPago");
                        if (modalElement) {
                            const modal = bootstrap.Modal.getInstance(modalElement);
                            if (modal) {
                                modal.hide();
                            }
                        }
                        
                        // Recargar los datos de pago y abrir el modal de presupuesto
                        if (nroTicketPago && nroTicketPago.value) {
                            // Obtener id_failure desde la tabla si es necesario
                            const table = $('#ticketsTable').DataTable();
                            let idFailure = null;
                            
                            if (table) {
                                table.rows().every(function() {
                                    const rowData = this.data();
                                    if (rowData && rowData.nro_ticket === nroTicketPago.value) {
                                        idFailure = rowData.id_failure || null;
                                        return false;
                                    }
                                });
                            }
                            
                            // Abrir el modal de presupuesto con los datos actualizados
                            openPresupuestoModal(nroTicketPago.value, idFailure);
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al Guardar',
                        text: 'Error al guardar el pago: ' + (data.message || "Error desconocido del servidor."),
                        confirmButtonColor: '#d33'
                    });
                }
            } catch (error) {
                console.error('Error al parsear respuesta del servidor:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Procesamiento',
                    text: 'Error al procesar la respuesta del servidor (JSON inválido).',
                    confirmButtonColor: '#d33'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: `Error al comunicarse con el servidor (HTTP Status: ${xhr.status}).`,
                confirmButtonColor: '#d33'
            });
        }
    };
    
    xhr.onerror = function() {
        Swal.fire({
            icon: 'error',
            title: 'Error de Red',
            text: 'Error de red al intentar guardar el pago.',
            confirmButtonColor: '#d33'
        });
    };
    
    xhr.send(formData.toString());
}

// Event listener para el botón de guardar
$(document).on('click', '#btnGuardarDatosPago', function() {
    savePaymentPendienteEntrega();
});

// Función para validar que solo se ingresen números (BLOQUEA completamente caracteres no numéricos)
function validateNumericInput(event) {
    // Permitir teclas de control (backspace, delete, tab, escape, enter, etc.)
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    
    if (allowedKeys.includes(event.key)) {
        return true;
    }
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (event.ctrlKey || event.metaKey) {
        if (['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())) {
            return true;
        }
    }
    
    // BLOQUEAR todo lo que no sea número (0-9)
    if (!/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    
    return true;
}

// Función para validar campos numéricos con decimales (monto Bs y Monto REF)
function validateNumericField(event) {
    const input = event.target;
    // Permitir teclas de control
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    
    if (allowedKeys.includes(event.key)) {
        return true;
    }
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (event.ctrlKey || event.metaKey) {
        if (['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())) {
            return true;
        }
    }
    
    // BLOQUEAR todo lo que no sea número (0-9) o punto decimal (.)
    if (!/^[0-9.]$/.test(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    
    // Evitar múltiples puntos decimales
    if (event.key === '.' && input.value.includes('.')) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    
    return true;
}

// Función para limpiar el input en tiempo real (elimina cualquier carácter no permitido)
function cleanNumericInput(event) {
    const input = event.target;
    const originalValue = input.value;
    // Eliminar todo lo que no sea número
    const cleaned = originalValue.replace(/\D/g, '');
    if (originalValue !== cleaned) {
        input.value = cleaned;
    }
}

// Función para limpiar el input de decimales en tiempo real
function cleanDecimalInput(event) {
    const input = event.target;
    const originalValue = input.value;
    // Eliminar todo lo que no sea número o punto
    let cleaned = originalValue.replace(/[^0-9.]/g, '');
    // Asegurar solo un punto decimal
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    if (originalValue !== cleaned) {
        input.value = cleaned;
    }
}

// Configurar validación de campos numéricos
function setupNumericValidation() {
    // Campo de referencia: solo números (BLOQUEA completamente)
    const referenciaInput = document.getElementById("referencia");
    if (referenciaInput) {
        referenciaInput.addEventListener("keydown", validateNumericInput);
        referenciaInput.addEventListener("input", cleanNumericInput);
        referenciaInput.addEventListener("paste", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const numericOnly = paste.replace(/\D/g, '');
            referenciaInput.value = numericOnly;
            referenciaInput.dispatchEvent(new Event('input'));
        });
    }

    // Campos de Monto Bs y Monto REF: solo números y punto decimal (BLOQUEA completamente)
    const montoBsInput = document.getElementById("montoBs");
    const montoRefInput = document.getElementById("montoRef");
    
    if (montoBsInput) {
        montoBsInput.addEventListener("keydown", validateNumericField);
        montoBsInput.addEventListener("input", cleanDecimalInput);
        montoBsInput.addEventListener("paste", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            // Permitir solo números y un punto decimal
            let numericOnly = paste.replace(/[^0-9.]/g, '');
            // Asegurar solo un punto decimal
            const parts = numericOnly.split('.');
            if (parts.length > 2) {
                numericOnly = parts[0] + '.' + parts.slice(1).join('');
            }
            montoBsInput.value = numericOnly;
            montoBsInput.dispatchEvent(new Event('input'));
        });
    }

    if (montoRefInput) {
        montoRefInput.addEventListener("keydown", validateNumericField);
        montoRefInput.addEventListener("input", cleanDecimalInput);
        montoRefInput.addEventListener("paste", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            // Permitir solo números y un punto decimal
            let numericOnly = paste.replace(/[^0-9.]/g, '');
            // Asegurar solo un punto decimal
            const parts = numericOnly.split('.');
            if (parts.length > 2) {
                numericOnly = parts[0] + '.' + parts.slice(1).join('');
            }
            montoRefInput.value = numericOnly;
            montoRefInput.dispatchEvent(new Event('input'));
        });
    }
}

// Función para limpiar todos los campos del formulario de datos de pago
function limpiarFormularioDatosPago() {
    const formAgregarDatosPago = document.getElementById("formAgregarDatosPago");
    if (formAgregarDatosPago) {
        // Limpiar todos los campos del formulario
        const fechaPago = document.getElementById("fechaPago");
        const formaPago = document.getElementById("formaPago");
        const moneda = document.getElementById("moneda");
        const montoRef = document.getElementById("montoRef");
        const montoBs = document.getElementById("montoBs");
        const referencia = document.getElementById("referencia");
        const depositante = document.getElementById("depositante");
        const obsAdministracion = document.getElementById("obsAdministracion");
        const registro = document.getElementById("registro");
        const fechaCarga = document.getElementById("fechaCarga");
        const estatus = document.getElementById("estatus");
        const serialPosPago = document.getElementById("serialPosPago");
        const montoEquipo = document.getElementById("montoEquipo");
        const montoBsSuffix = document.getElementById("montoBsSuffix");
        const montoRefSuffix = document.getElementById("montoRefSuffix");
        const bancoFieldsContainer = document.getElementById("bancoFieldsContainer");
        const pagoMovilFieldsContainer = document.getElementById("pagoMovilFieldsContainer");
        
        // Limpiar campos de texto e inputs
        if (fechaPago) fechaPago.value = "";
        if (formaPago) formaPago.value = "";
        if (referencia) referencia.value = "";
        if (depositante) depositante.value = "";
        if (obsAdministracion) obsAdministracion.value = "";
        if (registro) registro.value = "";
        // NO limpiar fechaCarga - debe mantener la fecha de hoy automáticamente
        if (estatus) estatus.value = "";
        if (serialPosPago) serialPosPago.value = "";
        
        // Resetear el select de moneda
        if (moneda) {
            moneda.value = "";
            moneda.disabled = false;
            moneda.removeAttribute("disabled");
            moneda.style.backgroundColor = "";
            moneda.style.cursor = "";
        }
        
        // Ocultar campos de banco y limpiarlos
        const bancoOrigen = document.getElementById("bancoOrigen");
        const bancoDestino = document.getElementById("bancoDestino");
        
        if (bancoFieldsContainer) {
            bancoFieldsContainer.style.display = "none";
        }
        if (bancoOrigen) {
            bancoOrigen.value = "";
            bancoOrigen.required = false;
        }
        if (bancoDestino) {
            bancoDestino.value = "";
            bancoDestino.required = false;
        }
        
        // Ocultar y limpiar campos de Pago Móvil
        if (pagoMovilFieldsContainer) {
            pagoMovilFieldsContainer.style.display = "none";
        }
        
        // Resetear campos de Monto Bs y Monto REF
        if (montoBs) {
            montoBs.value = "0.00";
            montoBs.disabled = true;
            montoBs.setAttribute("disabled", "disabled");
        }
        
        if (montoRef) {
            montoRef.value = "0.00";
            montoRef.disabled = true;
            montoRef.setAttribute("disabled", "disabled");
        }
        
        // Ocultar sufijos de moneda
        if (montoBsSuffix) {
            montoBsSuffix.style.display = "none";
        }
        if (montoRefSuffix) {
            montoRefSuffix.style.display = "none";
        }
        
        // Resetear el monto del equipo
        if (montoEquipo) {
            montoEquipo.textContent = "$0.00";
        }
        
        // Resetear el formulario
        formAgregarDatosPago.reset();
        
        // Asegurar que los valores se mantengan después del reset
        setTimeout(function() {
            if (montoBs) {
                montoBs.value = "0.00";
                montoBs.disabled = true;
                montoBs.setAttribute("disabled", "disabled");
            }
            if (montoRef) {
                montoRef.value = "0.00";
                montoRef.disabled = true;
                montoRef.setAttribute("disabled", "disabled");
            }
            if (moneda) {
                moneda.value = "";
            }
            if (montoBsSuffix) {
                montoBsSuffix.style.display = "none";
            }
            if (montoRefSuffix) {
                montoRefSuffix.style.display = "none";
            }
            if (montoEquipo) {
                montoEquipo.textContent = "$0.00";
            }
        }, 10);
    }
}

// Función para generar número de registro único
// Opciones de formato disponibles:
// 1. Pago{4 últimos de referencia}_{4 últimos de serial} (formato actual: Pago0945_4354)
// 2. REG-{4 últimos de referencia}-{4 últimos de serial}
// 3. {Año}-{4 últimos de referencia}-{4 últimos de serial}
// 4. {Fecha YYYYMMDD}-{4 últimos de referencia}-{4 últimos de serial}
// 5. PA-{Timestamp corto}-{4 últimos de serial}
function generateRegistrationNumber(formatType = 1) {
    const referenciaInput = document.getElementById("referencia");
    const serialPosPagoInput = document.getElementById("serialPosPago");
    const registroInput = document.getElementById("registro");
    
    if (!referenciaInput || !serialPosPagoInput || !registroInput) {
        return;
    }

    const referencia = referenciaInput.value.trim();
    const serial = serialPosPagoInput.value.trim();

    // Validar que ambos campos tengan al menos 4 caracteres
    if (!referencia || referencia.length < 4) {
        return;
    }

    if (!serial || serial.length < 4) {
        return;
    }

    // Obtener los últimos 4 dígitos/caracteres de referencia y serial
    // Para referencia: solo números, rellenar con ceros a la izquierda si es necesario
    const ultimos4Referencia = referencia.slice(-4).replace(/\D/g, ''); // Solo números
    const refFinal = ultimos4Referencia.length >= 4 
        ? ultimos4Referencia 
        : ultimos4Referencia.padStart(4, '0'); // Rellenar con ceros si tiene menos de 4 dígitos
    
    // Para serial: últimos 4 caracteres (pueden ser números o letras)
    const ultimos4Serial = serial.slice(-4);

    let numeroRegistro = "";

    switch(formatType) {
        case 1: // Pago{4 últimos de referencia}_{4 últimos de serial}
            numeroRegistro = `Pago${refFinal}_${ultimos4Serial}`;
            break;
        case 2: // REG-{4 últimos de referencia}-{4 últimos de serial}
            numeroRegistro = `REG-${refFinal}-${ultimos4Serial}`;
            break;
        case 3: // {Año}-{4 últimos de referencia}-{4 últimos de serial}
            const año = new Date().getFullYear();
            numeroRegistro = `${año}-${refFinal}-${ultimos4Serial}`;
            break;
        case 4: // {Fecha YYYYMMDD}-{4 últimos de referencia}-{4 últimos de serial}
            const fecha = new Date();
            const fechaStr = fecha.getFullYear() + 
                            String(fecha.getMonth() + 1).padStart(2, '0') + 
                            String(fecha.getDate()).padStart(2, '0');
            numeroRegistro = `${fechaStr}-${refFinal}-${ultimos4Serial}`;
            break;
        case 5: // PA-{Timestamp corto}-{4 últimos de serial}
            const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
            numeroRegistro = `PA-${timestamp}-${ultimos4Serial}`;
            break;
        default:
            numeroRegistro = `Pago${refFinal}_${ultimos4Serial}`;
    }

    registroInput.value = numeroRegistro;
}

// Configurar generación automática del número de registro
function setupAutoRegistrationNumber() {
    const referenciaInput = document.getElementById("referencia");
    const serialPosPagoInput = document.getElementById("serialPosPago");
    
    if (!referenciaInput || !serialPosPagoInput) {
        return;
    }

    // Función que se ejecuta cuando cambian los campos
    const updateRegistrationNumber = () => {
        // Usar formato 1 por defecto (Pago{ref}_{serial})
        // Cambiar este número (1-5) para usar otro formato
        generateRegistrationNumber(1);
    };

    // Agregar listeners a los campos
    referenciaInput.addEventListener("input", updateRegistrationNumber);
    referenciaInput.addEventListener("blur", updateRegistrationNumber);
    serialPosPagoInput.addEventListener("input", updateRegistrationNumber);
    serialPosPagoInput.addEventListener("blur", updateRegistrationNumber);
}

// Función para cerrar el modal y limpiar campos
function cerrarModalYLimpiar() {
    // Limpiar el formulario ANTES de cerrar el modal
    if (typeof limpiarFormularioDatosPago === 'function') {
        limpiarFormularioDatosPago();
    }
    
    // Asegurar que los sufijos estén ocultos y los campos estén en estado inicial
    setTimeout(function() {
        const montoBsSuffix = document.getElementById("montoBsSuffix");
        const montoRefSuffix = document.getElementById("montoRefSuffix");
        const montoBs = document.getElementById("montoBs");
        const montoRef = document.getElementById("montoRef");
        const moneda = document.getElementById("moneda");
        
        if (montoBsSuffix) {
            montoBsSuffix.style.display = "none";
            montoBsSuffix.style.visibility = "hidden";
        }
        if (montoRefSuffix) {
            montoRefSuffix.style.display = "none";
            montoRefSuffix.style.visibility = "hidden";
        }
        if (montoBs) {
            montoBs.value = "0.00";
            montoBs.disabled = true;
            montoBs.setAttribute("disabled", "disabled");
        }
        if (montoRef) {
            montoRef.value = "0.00";
            montoRef.disabled = true;
            montoRef.setAttribute("disabled", "disabled");
        }
        if (moneda) {
            moneda.value = "";
        }
    }, 50);
    
    // Cerrar el modal con transición suave
    const modalElement = document.getElementById("modalAgregarDatosPago");
    if (modalElement) {
        // Agregar estilos de transición directamente
        modalElement.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        modalElement.style.opacity = "0";
        modalElement.style.transform = "scale(0.95)";
        
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
            backdrop.style.transition = "opacity 0.5s ease-out";
            backdrop.style.opacity = "0";
        }
        
        // Esperar a que termine la animación (500ms) antes de cerrar completamente
        setTimeout(function() {
            // Usar método directo que siempre funciona
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                try {
                    // Crear nueva instancia y cerrar
                    const modal = new bootstrap.Modal(modalElement);
                    modal.hide();
                    // También forzar el cierre manualmente después de la transición
                    setTimeout(function() {
                        modalElement.style.display = "none";
                        modalElement.style.opacity = "";
                        modalElement.style.transform = "";
                        modalElement.style.transition = "";
                        modalElement.classList.remove("show");
                        document.body.classList.remove("modal-open");
                        const backdrop = document.querySelector(".modal-backdrop");
                        if (backdrop) {
                            backdrop.remove();
                        }
                    }, 150);
                } catch (error) {
                    // Fallback manual directo
                    modalElement.style.display = "none";
                    modalElement.style.opacity = "";
                    modalElement.style.transform = "";
                    modalElement.style.transition = "";
                    modalElement.classList.remove("show");
                    document.body.classList.remove("modal-open");
                    const backdrop = document.querySelector(".modal-backdrop");
                    if (backdrop) {
                        backdrop.remove();
                    }
                }
            } else if (typeof $ !== 'undefined' && $.fn.modal) {
                $(modalElement).modal('hide');
                setTimeout(function() {
                    modalElement.style.opacity = "";
                    modalElement.style.transform = "";
                    modalElement.style.transition = "";
                }, 150);
            } else {
                // Fallback manual - método más directo
                modalElement.style.display = "none";
                modalElement.style.opacity = "";
                modalElement.style.transform = "";
                modalElement.style.transition = "";
                modalElement.classList.remove("show");
                document.body.classList.remove("modal-open");
                const backdrop = document.querySelector(".modal-backdrop");
                if (backdrop) {
                    backdrop.remove();
                }
            }
        }, 500); // Duración de la animación de fade out (500ms para transición más suave)
    }
}

// Event listener para el botón de cancelar
const btnCancelarModalPagoFooter = document.getElementById("btnCancelarModalPagoFooter");
if (btnCancelarModalPagoFooter) {
    btnCancelarModalPagoFooter.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        cerrarModalYLimpiar();
    });
}

// Función para cargar métodos de pago
function loadPaymentMethods() {
    const formaPagoSelect = document.getElementById("formaPago");
    if (!formaPagoSelect) {
        return;
    }

    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
        return;
    }

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetPaymentMethods";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                
                if (data.success && data.payment_methods && data.payment_methods.length > 0) {
                    formaPagoSelect.innerHTML = '<option value="">Seleccione</option>';
                    
                    data.payment_methods.forEach(function(method) {
                        const option = document.createElement("option");
                        option.value = method.id_payment_method;
                        option.textContent = method.payment_method_name;
                        formaPagoSelect.appendChild(option);
                    });
                    
                    // Configurar listener para detectar cuando se selecciona "Transferencia" (id = 2) o "Pago Móvil" (id = 5)
                    setTimeout(function() {
                        setupFormaPagoListener();
                    }, 100);
                }
            } catch (error) {
                console.error('Error al parsear métodos de pago:', error);
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al cargar métodos de pago');
    };
    
    xhr.send();
}

// Función para cargar bancos
function loadBancos() {
    const bancoOrigenSelect = document.getElementById("bancoOrigen");
    const bancoDestinoSelect = document.getElementById("bancoDestino");
    const origenBancoSelect = document.getElementById("origenBanco");
    const destinoBancoSelect = document.getElementById("destinoBanco");
    
    if (!bancoOrigenSelect || !bancoDestinoSelect) {
        return;
    }

    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
        return;
    }

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetBancos";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                
                if (data.success && data.bancos && data.bancos.length > 0) {
                    bancoOrigenSelect.innerHTML = '<option value="">Seleccione</option>';
                    bancoDestinoSelect.innerHTML = '<option value="">Seleccione</option>';
                    if (origenBancoSelect) origenBancoSelect.innerHTML = '<option value="">Seleccione</option>';
                    if (destinoBancoSelect) destinoBancoSelect.innerHTML = '<option value="">Seleccione</option>';
                    
                    data.bancos.forEach(function(banco) {
                        const optionOrigen = document.createElement("option");
                        optionOrigen.value = banco.codigobanco;
                        optionOrigen.textContent = banco.ibp;
                        bancoOrigenSelect.appendChild(optionOrigen);
                        
                        const optionDestino = document.createElement("option");
                        optionDestino.value = banco.codigobanco;
                        optionDestino.textContent = banco.ibp;
                        bancoDestinoSelect.appendChild(optionDestino);
                        
                        if (origenBancoSelect) {
                            const optionOrigenPM = document.createElement("option");
                            optionOrigenPM.value = banco.codigobanco;
                            optionOrigenPM.textContent = banco.ibp;
                            origenBancoSelect.appendChild(optionOrigenPM);
                        }
                        
                        if (destinoBancoSelect) {
                            const optionDestinoPM = document.createElement("option");
                            optionDestinoPM.value = banco.codigobanco;
                            optionDestinoPM.textContent = banco.ibp;
                            destinoBancoSelect.appendChild(optionDestinoPM);
                        }
                    });
                }
            } catch (error) {
                console.error('Error al parsear bancos:', error);
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al cargar bancos');
    };
    
    xhr.send();
}

// Función para configurar el listener de forma de pago
function setupFormaPagoListener() {
    const formaPagoSelect = document.getElementById("formaPago");
    const bancoFieldsContainer = document.getElementById("bancoFieldsContainer");
    const pagoMovilFieldsContainer = document.getElementById("pagoMovilFieldsContainer");
    
    if (!formaPagoSelect) return;
    
    // Remover listener anterior si existe
    formaPagoSelect.removeEventListener('change', handleFormaPagoChange);
    
    // Agregar nuevo listener
    formaPagoSelect.addEventListener('change', handleFormaPagoChange);
    
    function handleFormaPagoChange() {
        const selectedId = parseInt(formaPagoSelect.value);
        
        // Ocultar todos los campos condicionales primero
        if (bancoFieldsContainer) bancoFieldsContainer.style.display = 'none';
        if (pagoMovilFieldsContainer) pagoMovilFieldsContainer.style.display = 'none';
        
        // Mostrar campos según el método de pago seleccionado
        if (selectedId === 2) {
            // Transferencia - mostrar campos de bancos
            if (bancoFieldsContainer) bancoFieldsContainer.style.display = 'block';
        } else if (selectedId === 5) {
            // Pago Móvil - mostrar campos de pago móvil
            if (pagoMovilFieldsContainer) pagoMovilFieldsContainer.style.display = 'block';
        }
    }
}

// Función para cargar tasa de cambio (simplificada)
function loadExchangeRateToday(fecha = null) {
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") {
        return;
    }

    let apiUrl;
    let dataToSend;
    
    if (fecha) {
        apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateByDate";
        dataToSend = "action=GetExchangeRateByDate&fecha=" + encodeURIComponent(fecha);
    } else {
        apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateToday";
        dataToSend = "action=GetExchangeRateToday";
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                const tasaDisplayValue = document.getElementById("tasaDisplayValue");
                const fechaTasaDisplay = document.getElementById("fechaTasaDisplay");
                
                if (data.success && data.exchange_rate && data.exchange_rate.tasa_dolar) {
                    const tasa = parseFloat(data.exchange_rate.tasa_dolar);
                    if (tasaDisplayValue) {
                        tasaDisplayValue.textContent = `Bs. ${tasa.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    }
                    if (fechaTasaDisplay && data.exchange_rate.fecha_tasa) {
                        const fecha = new Date(data.exchange_rate.fecha_tasa);
                        fechaTasaDisplay.innerHTML = `<i class="fas fa-calendar-day me-1"></i>Tasa: ${fecha.toLocaleDateString('es-VE')}`;
                    }
                    window.exchangeRate = tasa;
                } else {
                    if (tasaDisplayValue) tasaDisplayValue.textContent = "Error al cargar";
                }
            } catch (error) {
                console.error('Error al parsear tasa de cambio:', error);
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al cargar tasa de cambio');
    };
    
    xhr.send(dataToSend);
}

// Configurar listeners para fechaPago cuando se abre el modal
$(document).on('shown.bs.modal', '#modalAgregarDatosPago', function() {
    const fechaPagoInput = document.getElementById('fechaPago');
    
    // Agregar listener para cambios
    if (fechaPagoInput) {
        fechaPagoInput.addEventListener('change', function() {
            if (this.value) {
                loadExchangeRateToday(this.value);
            }
        });
        
        fechaPagoInput.addEventListener('click', function() {
            if (this.value) {
                loadExchangeRateToday(this.value);
            }
        });
    }
});

// Función para enviar correo con datos de anticipo y presupuesto
function sendAnticipoPresupuestoEmail(nroTicket) {
    try {
        console.log('Iniciando envío de correo de anticipo y presupuesto para ticket:', nroTicket);
        
        if (!nroTicket) {
            console.error('Error: nroTicket no está definido');
            return;
        }
        
        const data = new URLSearchParams();
        data.append('action', 'send_anticipo_presupuesto_email');
        data.append('nro_ticket', nroTicket);
        
        const url = `${ENDPOINT_BASE}${APP_PATH}api/email/send_anticipo_presupuesto_email`;
        console.log('URL del endpoint:', url);
        console.log('Datos a enviar:', data.toString());
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onload = function() {
            console.log('Respuesta recibida. Status:', xhr.status);
            console.log('Respuesta completa:', xhr.responseText);
            
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log('Respuesta parseada:', response);
                    
                    if (response.success) {
                        console.log('✅ Correo de anticipo y presupuesto enviado correctamente:', response.message);
                        if (response.emails_sent !== undefined) {
                            console.log(`📧 Correos enviados: ${response.emails_sent}/${response.total_emails}`);
                        }
                    } else {
                        console.error('❌ Error al enviar correo:', response.message);
                        // Mostrar alerta al usuario
                        Swal.fire({
                            icon: 'warning',
                            title: 'Aviso',
                            text: 'El presupuesto se guardó correctamente, pero hubo un problema al enviar el correo: ' + (response.message || 'Error desconocido'),
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#003594'
                        });
                    }
                } catch (e) {
                    console.error('Error al parsear respuesta del servidor:', e);
                    console.error('Respuesta recibida (texto):', xhr.responseText);
                }
            } else {
                console.error('❌ Error HTTP al enviar correo:', xhr.status, xhr.statusText);
                console.error('Respuesta del servidor:', xhr.responseText);
            }
        };
        
        xhr.onerror = function() {
            console.error('❌ Error de red al enviar correo');
        };
        
        xhr.ontimeout = function() {
            console.error('❌ Timeout al enviar correo');
        };
        
        // Configurar timeout de 30 segundos
        xhr.timeout = 30000;
        
        xhr.send(data);
        console.log('Petición enviada al servidor');
    } catch (error) {
        console.error('❌ Error en sendAnticipoPresupuestoEmail:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Configurar listener para cambios en moneda y forma de pago
$(document).on('change', '#moneda', function() {
    const monedaValue = this.value;
    const montoBs = document.getElementById('montoBs');
    const montoRef = document.getElementById('montoRef');
    const montoBsSuffix = document.getElementById('montoBsSuffix');
    const montoRefSuffix = document.getElementById('montoRefSuffix');
    
    if (monedaValue === 'bs') {
        if (montoBs) montoBs.disabled = false;
        if (montoRef) montoRef.disabled = true;
        if (montoBsSuffix) montoBsSuffix.style.display = 'inline';
        if (montoRefSuffix) montoRefSuffix.style.display = 'none';
    } else if (monedaValue === 'usd') {
        if (montoBs) montoBs.disabled = true;
        if (montoRef) montoRef.disabled = false;
        if (montoBsSuffix) montoBsSuffix.style.display = 'none';
        if (montoRefSuffix) montoRefSuffix.style.display = 'inline';
    }
    
    // Calcular conversión y actualizar montoEquipo
    calcularConversion();
});

// Función para calcular conversión entre monedas
function calcularConversion() {
    const moneda = document.getElementById('moneda');
    const montoBs = document.getElementById('montoBs');
    const montoRef = document.getElementById('montoRef');
    const montoEquipo = document.getElementById('montoEquipo');
    
    if (!moneda) return;
    
    let montoUSD = 0;
    
    if (moneda.value === 'bs' && montoBs && montoBs.value && window.exchangeRate) {
        const montoBsValue = parseFloat(montoBs.value);
        if (!isNaN(montoBsValue)) {
            montoUSD = montoBsValue / window.exchangeRate;
            if (montoRef) {
                montoRef.value = montoUSD.toFixed(2);
            }
        }
    } else if (moneda.value === 'usd' && montoRef && montoRef.value) {
        const montoUSDValue = parseFloat(montoRef.value);
        if (!isNaN(montoUSDValue)) {
            montoUSD = montoUSDValue;
            if (window.exchangeRate && montoBs) {
                const montoBS = montoUSDValue * window.exchangeRate;
                montoBs.value = montoBS.toFixed(2);
            }
        }
    }
    
    // Actualizar el campo montoEquipo con el monto en USD
    if (montoEquipo) {
        montoEquipo.textContent = "$" + montoUSD.toFixed(2);
    }
}

// Listener para cambios en montoBs cuando moneda es BS
$(document).on('input', '#montoBs', function() {
    const moneda = document.getElementById('moneda');
    if (moneda && moneda.value === 'bs') {
        calcularConversion();
    }
});

// Listener para cambios en montoRef cuando moneda es USD
$(document).on('input', '#montoRef', function() {
    const moneda = document.getElementById('moneda');
    if (moneda && moneda.value === 'usd') {
        calcularConversion();
    }
});
}