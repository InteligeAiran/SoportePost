// Variable global para la instancia de DataTables si la necesitas fuera de la función
let dataTableInstance;
// Variable global para el ID del ticket actual si es necesario para otros modales
let currentTicketId;
// Variable global para la instancia del modal, si se usa para cerrar/abrir
let modalInstance;


function getTicketData() {
    const tbody = document.getElementById('tabla-ticket').getElementsByTagName('tbody')[0];
    const detailsPanel = document.getElementById("ticket-details-panel");
    const modalElement = document.getElementById('staticBackdrop'); // Este parece ser el modal para "Enviar a Taller"

    // Modales de carga y visualización
    const uploadDocumentModalElement = document.getElementById('uploadDocumentModal');
    const viewDocumentModalElement = document.getElementById('viewDocumentModal');

    // Limpia la tabla y destruye DataTables si ya está inicializado
    if ($.fn.DataTable.isDataTable('#tabla-ticket')) {
        $('#tabla-ticket').DataTable().destroy();
        tbody.innerHTML = ''; // Limpiar el tbody después de destruir
    } else {
        tbody.innerHTML = ''; // Limpiar el tbody si es la primera vez
    }

    fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetTicketData1`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No se encontraron usuarios (404)');
                }
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.ticket) {
                const TicketData = data.ticket;

                detailsPanel.innerHTML = "<p>Selecciona un ticket de la tabla para ver sus detalles aquí.</p>";

                const dataForDataTable = TicketData.map(ticket => {
                    let actionButtonsHTML = '';

                    // 1. Botón de la llave inglesa (Enviar a Taller)
                    actionButtonsHTML += `
                        <button class="btn btn-sm btn-wrench-custom"
                            data-bs-toggle="tooltip" data-bs-placement="top"
                            title="Enviar a Taller"
                            data-ticket-id="${ticket.id_ticket}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-wrench-adjustable-circle" viewBox="0 0 16 16"><path d="M12.496 8a4.5 4.5 0 0 1-1.703 3.526L9.497 8.5l2.959-1.11q.04.3.04.61"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1 0a7 7 0 1 0-13.202 3.249l1.988-1.657a4.5 4.5 0 0 1 7.537-4.623L7.497 6.5l1 2.5 1.333 3.11c-.56.251-1.18.39-1.833.39a4.5 4.5 0 0 1-1.592-.29L4.747 14.2A7 7 0 0 0 15 8m-8.295.139a.25.25 0 0 0-.288-.376l-1.5.5.159.474.808-.27-.595.894a.25.25 0 0 0 .287.376l.808-.27-.595.894a.25.25 0 0 0 .287.376l1.5-.5-.159-.474-.808.27.596-.894a.25.25 0 0 0-.288-.376l-.808.27z"/></svg>
                        </button>
                    `;

                    // 2. Lógica para añadir los botones adicionales basada en id_status_payment
                    if (ticket.id_status_payment == 11) {
                        actionButtonsHTML += `
                            <button class="btn btn-sm btn-info btn-zoom-pdf ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="PDF de envio de ZOOM"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${ticket.id_status_payment}"
                                data-document-type="zoom">
                                Cargar PDF ZOOM
                            </button>
                            <button class="btn btn-sm btn-secondary btn-view-document ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Ver PDF de envio de ZOOM"
                                data-ticket-id="${ticket.id_ticket}"
                                data-document-type="zoom"
                                data-file-url="${ticket.pdf_zoom_url || ''}">
                                Ver PDF ZOOM
                            </button>
                        `;
                    } else if (ticket.id_status_payment == 10) {
                        actionButtonsHTML += `
                            <button class="btn btn-sm btn-primary btn-exoneracion-img ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Cargar Imagen del Correo de Exoneracion"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${ticket.id_status_payment}"
                                data-document-type="exoneracion">
                                Cargar Img Exoneracion
                            </button>
                            <button class="btn btn-sm btn-success btn-pago-pdf ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Carge el pdf o Imagen de pago"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${ticket.id_status_payment}"
                                data-document-type="pago">
                                Cargar PDF de pago
                            </button>
                            <button class="btn btn-sm btn-secondary btn-view-document ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Ver Documento de Exoneración o Pago"
                                data-ticket-id="${ticket.id_ticket}"
                                data-document-type="exoneracion_pago"
                                data-file-url="${ticket.img_exoneracion_url || ticket.pdf_pago_url || ''}">
                                Ver Documento
                            </button>
                        `;
                    } else if (ticket.id_status_payment == 9) {
                        actionButtonsHTML += `
                            <button class="btn btn-sm btn-info btn-zoom-pdf ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="PDF de envio de ZOOM"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${ticket.id_status_payment}"
                                data-document-type="zoom">
                                Cargar PDF ZOOM
                            </button>
                            <button class="btn btn-sm btn-primary btn-exoneracion-img ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Cargar Imagen del Correo de Exoneracion"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${ticket.id_status_payment}"
                                data-document-type="exoneracion">
                                Cargar Img Exoneracion
                            </button>
                            <button class="btn btn-sm btn-success btn-pago-pdf ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Carge el pdf o Imagen de pago"
                                data-ticket-id="${ticket.id_ticket}"
                                data-status-payment="${ticket.id_status_payment}"
                                data-document-type="pago">
                                Cargar PDF de pago
                            </button>
                            <button class="btn btn-sm btn-secondary btn-view-document ml-2"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Ver Documento"
                                data-ticket-id="${ticket.id_ticket}"
                                data-document-type="all"
                                data-file-url="${ticket.img_exoneracion_url || ticket.pdf_pago_url || ticket.pdf_zoom_url || ''}">
                                Ver Documento
                            </button>
                        `;
                    }

                    const finalActionColumnHTML = `<div class="acciones-container">${actionButtonsHTML}</div>`;

                    return [
                        ticket.id_ticket,
                        ticket.rif,
                        ticket.razonsocial_cliente,
                        ticket.create_ticket,
                        ticket.serial_pos,
                        ticket.full_name_tecnico,
                        ticket.name_accion_ticket,
                        ticket.nro_ticket,
                        finalActionColumnHTML
                    ];
                });

                dataTableInstance = $('#tabla-ticket').DataTable({
                    responsive: false,
                    scrollX: true,
                    pagingType: "simple_numbers",
                    lengthMenu: [5],
                    autoWidth: false,
                    data: dataForDataTable,
                    columns: [
                        { title: "ID ticket" },
                        { title: "RIF" },
                        { title: "Razón Social" },
                        { title: "Fecha Creación" },
                        { title: "Serial POS" },
                        { title: "Técnico Asignado" },
                        { title: "Acción Ticket" },
                        { title: "Nro Ticket" },
                        { title: "Acciones", orderable: false, width: "15%" }
                    ],
                    language: {
                        "lengthMenu": "Mostrar _MENU_ registros",
                        "emptyTable": "No hay datos disponibles en la tabla",
                        "zeroRecords": "No se encontraron resultados para la búsqueda",
                        "info": "Mostrando página _PAGE_ de _PAGES_ ( _TOTAL_ registro(s) )",
                        "infoEmpty": "No hay datos disponibles",
                        "infoFiltered": "(Filtrado de _MAX_ datos disponibles)",
                        "search": "Buscar:",
                        "loadingRecords": "Cargando...",
                        "processing": "Procesando...",
                        "paginate": {
                            "first": "Primero", "last": "Último", "next": "Siguiente", "previous": "Anterior"
                        }
                    },
                    initComplete: function(settings, json) {
                        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
                    }
                });

                if ($.fn.tooltip) {
                    $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }

                $('#tabla-ticket').resizableColumns();

                $("#tabla-ticket tbody")
                    .off("click", "tr")
                    .on("click", "tr", function () {
                        const tr = $(this);
                        const rowData = dataTableInstance.row(tr).data();

                        if (!rowData) {
                            return;
                        }

                        $("#tabla-ticket tbody tr").removeClass("table-active");
                        tr.addClass("table-active");

                        const ticketId = rowData[0];

                        const selectedTicketDetails = TicketData.find(
                            (t) => t.id_ticket == ticketId
                        );

                        if (selectedTicketDetails) {
                            detailsPanel.innerHTML = formatTicketDetailsPanel(
                                selectedTicketDetails
                            );
                            loadTicketHistory(ticketId);
                            if (selectedTicketDetails.serial_pos) {
                                downloadImageModal(selectedTicketDetails.serial_pos);
                            } else {
                                const imgElement = document.getElementById(
                                    "device-ticket-image"
                                );
                                if (imgElement) {
                                    imgElement.src = '/public/img/consulta_rif/POS/mantainment.png';
                                    imgElement.alt = "Serial no disponible";
                                }
                            }
                        } else {
                            detailsPanel.innerHTML =
                                "<p>No se encontraron detalles para este ticket.</p>";
                        }
                    });

                // --- Lógica de Event Listeners para los botones de acción específicos (Delegación de eventos) ---

                // Listener para el botón "Cargar Img Exoneracion"
                $('#tabla-ticket tbody')
                    .off('click', '.btn-exoneracion-img')
                    .on('click', '.btn-exoneracion-img', function(e) {
                        e.stopPropagation();
                        const ticketId = $(this).data('ticket-id');
                        // const statusPayment = $(this).data('status-payment'); // No lo necesitas aquí, ya lo tienes en la lógica del modal
                        const documentType = $(this).data('document-type'); // 'exoneracion'
                        console.log(`Clic en Cargar Img Exoneracion para Ticket ID: ${ticketId}, Tipo: ${documentType}`);
                        openUploadModal(ticketId, documentType); // Llama a la función para abrir el modal de subida
                    });

                // Listener para el botón "Cargar PDF de pago"
                $('#tabla-ticket tbody')
                    .off('click', '.btn-pago-pdf')
                    .on('click', '.btn-pago-pdf', function(e) {
                        e.stopPropagation();
                        const ticketId = $(this).data('ticket-id');
                        // const statusPayment = $(this).data('status-payment');
                        const documentType = $(this).data('document-type'); // 'pago'
                        console.log(`Clic en Cargar PDF de pago para Ticket ID: ${ticketId}, Tipo: ${documentType}`);
                        openUploadModal(ticketId, documentType); // Llama a la función para abrir el modal de subida
                    });

                // Listener para el botón "Cargar PDF ZOOM"
                $('#tabla-ticket tbody')
                    .off('click', '.btn-zoom-pdf')
                    .on('click', '.btn-zoom-pdf', function(e) {
                        e.stopPropagation();
                        const ticketId = $(this).data('ticket-id');
                        // const statusPayment = $(this).data('status-payment');
                        const documentType = $(this).data('document-type'); // 'zoom'
                        console.log(`Clic en Cargar PDF ZOOM para Ticket ID: ${ticketId}, Tipo: ${documentType}`);
                        openUploadModal(ticketId, documentType); // Llama a la función para abrir el modal de subida
                    });

                // Listener para el botón "Ver Documento"
                $('#tabla-ticket tbody')
                    .off('click', '.btn-view-document')
                    .on('click', '.btn-view-document', function(e) {
                        e.stopPropagation();
                        const ticketId = $(this).data('ticket-id');
                        const documentType = $(this).data('document-type');
                        const fileUrl = $(this).data('file-url'); // URL del archivo a visualizar
                        console.log(`Clic en Ver Documento para Ticket ID: ${ticketId}, Tipo: ${documentType}, URL: ${fileUrl}`);
                        openViewModal(ticketId, fileUrl, documentType); // Llama a la función para abrir el modal de visualización
                    });


                // Listener para el botón de la llave inglesa (Enviar a Taller)
                $('#tabla-ticket tbody')
                    .off('click', '.btn-wrench-custom')
                    .on('click', '.btn-wrench-custom', function(e) {
                        e.stopPropagation();
                        const ticketId = $(this).data('ticket-id');
                        currentTicketId = ticketId; // Asigna al currentTicketId para el modal de taller

                        if (modalElement && typeof bootstrap !== 'undefined' && typeof bootstrap.Modal !== 'undefined') {
                            const modalBootstrap = new bootstrap.Modal(modalElement, { backdrop: 'static' });
                            modalInstance = modalBootstrap;
                            modalBootstrap.show();
                        } else {
                            console.error("No se pudo inicializar el modal: modalElement o Bootstrap Modal no están disponibles.");
                        }
                    });

            } else {
                console.error('Error en la respuesta del servidor: No hay datos de ticket o respuesta no exitosa.');
                tbody.innerHTML = '<tr><td colspan="11" class="text-center text-danger">Error de conexión o al procesar la respuesta</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error en la petición o al procesar datos:', error);
            tbody.innerHTML = '<tr><td colspan="11" class="text-center text-danger">Error de conexión o al procesar la respuesta</td></tr>';
        });
}

// ===============================================
// Lógica para el Modal de Carga de Documentos (uploadDocumentModal)
// ===============================================

function openUploadModal(ticketId, documentType) {
    const uploadDocumentModalElement = document.getElementById('uploadDocumentModal');
    const modalTicketIdSpan = document.getElementById('modalTicketId');
    const documentFileInput = document.getElementById('documentFile');
    const imagePreview = document.getElementById('imagePreview');
    const uploadMessage = document.getElementById('uploadMessage');
    const uploadFileBtn = document.getElementById('uploadFileBtn');

    if (uploadDocumentModalElement && typeof bootstrap !== 'undefined' && typeof bootstrap.Modal !== 'undefined') {
        const uploadModalBootstrap = new bootstrap.Modal(uploadDocumentModalElement, { backdrop: 'static' });

        // Limpiar el formulario y mensajes previos
        documentFileInput.value = ''; // Limpiar el input file
        imagePreview.style.display = 'none'; // Ocultar previsualización
        imagePreview.src = '#'; // Restablecer la fuente de la imagen
        uploadMessage.classList.add('hidden'); // Ocultar mensaje
        uploadMessage.textContent = ''; // Limpiar texto del mensaje

        // Establecer el ID del ticket en el modal
        modalTicketIdSpan.textContent = ticketId;

        // Mostrar el modal
        uploadModalBootstrap.show();

        // Eliminar listeners previos para evitar duplicados
        documentFileInput.removeEventListener('change', handleFileSelectForUpload);
        uploadFileBtn.removeEventListener('click', handleUploadButtonClick);

        // Añadir el listener para previsualizar la imagen seleccionada
        documentFileInput.addEventListener('change', handleFileSelectForUpload);

        // Añadir listener para el botón "Subir"
        // Usa una función anónima para pasar documentType y ticketId
        uploadFileBtn.addEventListener('click', function() {
            handleUploadButtonClick(ticketId, documentType, uploadModalBootstrap);
        });

    } else {
        console.error("No se pudo inicializar el modal de carga: uploadDocumentModalElement o Bootstrap Modal no están disponibles.");
    }
}

function handleFileSelectForUpload(event) {
    const file = event.target.files[0];
    const imagePreview = document.getElementById('imagePreview');
    const uploadMessage = document.getElementById('uploadMessage');

    imagePreview.style.display = 'none';
    uploadMessage.classList.add('hidden');
    uploadMessage.textContent = '';

    if (file) {
        const fileType = file.type;
        if (fileType.startsWith('image/') || fileType === 'application/pdf') {
            if (fileType.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else if (fileType === 'application/pdf') {
                // Para PDFs, no hay previsualización de imagen directa
                imagePreview.style.display = 'none';
                uploadMessage.textContent = 'PDF seleccionado. No se muestra previsualización.';
                uploadMessage.classList.remove('hidden');
            }
        } else {
            uploadMessage.textContent = 'Tipo de archivo no permitido. Seleccione una imagen o un PDF.';
            uploadMessage.classList.remove('hidden');
            event.target.value = ''; // Limpiar el input file
            imagePreview.style.display = 'none';
        }
    }
}

async function handleUploadButtonClick(ticketId, documentType, uploadModalBootstrap) {
    const documentFileInput = document.getElementById('documentFile');
    const uploadMessage = document.getElementById('uploadMessage');
    const file = documentFileInput.files[0];

    uploadMessage.classList.add('hidden');
    uploadMessage.textContent = '';

    if (!file) {
        uploadMessage.textContent = 'Por favor, seleccione un archivo para subir.';
        uploadMessage.classList.remove('hidden');
        return;
    }

    const formData = new FormData();
    formData.append('ticket_id', ticketId);
    formData.append('document_type', documentType); // 'zoom', 'exoneracion', 'pago'
    formData.append('document_file', file);

    try {
        const response = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/uploadDocument`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
            uploadMessage.textContent = result.message;
            uploadMessage.classList.remove('hidden');
            uploadMessage.style.color = 'green';
            // Opcional: Cerrar el modal después de un tiempo o recargar la tabla
            setTimeout(() => {
                uploadModalBootstrap.hide();
                getTicketData(); // Recargar la tabla para reflejar los cambios
            }, 1500);
        } else {
            uploadMessage.textContent = result.message || 'Error al subir el documento.';
            uploadMessage.classList.remove('hidden');
            uploadMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al subir el documento:', error);
        uploadMessage.textContent = 'Error de red o del servidor al subir el documento.';
        uploadMessage.classList.remove('hidden');
        uploadMessage.style.color = 'red';
    }
}

// ===============================================
// Lógica para el Modal de Visualización de Documentos (viewDocumentModal)
// ===============================================

function openViewModal(ticketId, fileUrl, documentType) {
    const viewDocumentModalElement = document.getElementById('viewDocumentModal');
    const viewModalTicketIdSpan = document.getElementById('viewModalTicketId');
    const imageViewPreview = document.getElementById('imageViewPreview');
    const pdfViewViewer = document.getElementById('pdfViewViewer');
    const viewDocumentMessage = document.getElementById('viewDocumentMessage');

    if (viewDocumentModalElement && typeof bootstrap !== 'undefined' && typeof bootstrap.Modal !== 'undefined') {
        const viewModalBootstrap = new bootstrap.Modal(viewDocumentModalElement);

        // Limpiar y ocultar elementos de previsualización
        imageViewPreview.style.display = 'none';
        imageViewPreview.src = '#';
        pdfViewViewer.style.display = 'none';
        pdfViewViewer.innerHTML = ''; // Limpiar contenido previo del visor de PDF
        viewDocumentMessage.classList.add('hidden');
        viewDocumentMessage.textContent = '';

        // Establecer el ID del ticket en el modal
        viewModalTicketIdSpan.textContent = ticketId;

        if (fileUrl) {
            const fileExtension = fileUrl.split('.').pop().toLowerCase();

            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                imageViewPreview.src = fileUrl;
                imageViewPreview.style.display = 'block';
            } else if (fileExtension === 'pdf') {
                // Usar un visor de PDF (por ejemplo, pdf.js o un iframe simple)
                // Para un iframe simple:
                pdfViewViewer.innerHTML = `<iframe src="${fileUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
                pdfViewViewer.style.display = 'block';

                // Si necesitas algo más robusto como pdf.js, tendrías que integrarlo
                // Ejemplo con pdf.js (requiere la librería):
                /*
                pdfViewViewer.innerHTML = ''; // Asegúrate de que esté vacío
                const loadingTask = pdfjsLib.getDocument(fileUrl);
                loadingTask.promise.then(function(pdf) {
                    pdf.getPage(1).then(function(page) {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale: scale });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        pdfViewViewer.appendChild(canvas);

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                        pdfViewViewer.style.display = 'block';
                    });
                }).catch(function(error) {
                    console.error('Error al cargar el PDF:', error);
                    viewDocumentMessage.textContent = 'Error al cargar el PDF.';
                    viewDocumentMessage.classList.remove('hidden');
                });
                */
            } else {
                viewDocumentMessage.textContent = 'Formato de archivo no soportado para previsualización.';
                viewDocumentMessage.classList.remove('hidden');
            }
        } else {
            viewDocumentMessage.textContent = 'No se ha subido ningún documento para este tipo.';
            viewDocumentMessage.classList.remove('hidden');
        }

        // Mostrar el modal
        viewModalBootstrap.show();
    } else {
        console.error("No se pudo inicializar el modal de visualización: viewDocumentModalElement o Bootstrap Modal no están disponibles.");
    }
}


// Llama a la función para cargar los datos cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', getTicketData);


function formatTicketDetailsPanel(d) {
  // d es el objeto `data` completo del ticket

  // La imageUrl inicial puede ser una imagen de "cargando" o un placeholder.
  // La imagen real se cargará después vía AJAX.
  const initialImageUrl = "assets/img/loading-placeholder.png"; // Asegúrate de tener esta imagen
  const initialImageAlt = "Cargando imagen del dispositivo...";

  return `
<div class="col-3 text-end">
            <div id="device-image-container" style="width: 120px; height: 120px; margin-left: auto;">
                <img id="device-ticket-image" src="${initialImageUrl}" alt="${initialImageAlt}"
                     class="img-fluid rounded" style="width: 100%; height: 100%; margin-right: -302%; object-fit: fill;">
                     </div>
        </div>
            <div class="col-9" style = "margin-top: -21%;"> <h4>Ticket #${d.id_ticket}</h4>
                <hr>
                <div class="row mb-2">
                    <div class="col-sm-6 text-muted">Serial POS:</div>
                    <div class="col-sm-6"><strong>${d.serial_pos}</strong></div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-6 text-muted">Estatus POS:</div>
                    <div class="col-sm-6">${d.estatus_inteliservices}</div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-6 text-muted">Fecha Instalación POS:</div>
                    <div class="col-sm-6">${d.fecha_instalacion}</div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-6 text-muted">Fecha Creación ticket:</div>
                    <div class="col-sm-6">${d.create_ticket}</div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-6 text-muted">Usuario Gestión:</div>
                    <div class="col-sm-6">${d.full_name_tecnico}</div>
                </div>
            </div>
        <div class="row mb-2">
            <div class="col-sm-4 text-muted">Acción:</div>
            <div class="col-sm-8">${d.name_accion_ticket}</div>
        </div>
        <div class="row mb-2">
            <div class="col-sm-4 text-muted">Falla:</div>
            <div class="col-sm-8">${d.name_failure}</div>
        </div>
        <div class="row mb-2">
            <div class="col-sm-4 text-muted">Proceso:</div>
            <div class="col-sm-8">${d.name_process_ticket}</div>
        </div>
        <div class="row mb-2">
            <div class="col-sm-4 text-muted">Estatus Ticket:</div>
            <div class="col-sm-8">${d.name_status_ticket}</div>
        </div>
        <hr>

        <h5>Gestión / Historial:</h5>
         <div id="ticket-history-content">
            <p>Selecciona un ticket para cargar su historial.</p>
        </div>
    `;
}

function downloadImageModal(serial) {
  // Considera renombrar a loadDeviceImage(serial) para mayor claridad
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPhoto`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        //console.log("Respuesta de GetPhoto:", response); // Descomenta para depuración

        // ***** CAMBIO CLAVE AQUÍ *****
        // Selecciona el elemento de imagen en el panel de detalles, NO en un modal
        const imgElement = document.getElementById("device-ticket-image");

        if (imgElement) {
          if (response.success && response.rutaImagen) {
            const srcImagen = response.rutaImagen;
            const claseImagen = response.claseImagen || ""; // Obtener la clase CSS, si no hay, usar cadena vacía

            imgElement.src = srcImagen;
            imgElement.alt = `Imagen del dispositivo ${serial}`; // Actualiza el alt text

            // Opcional: Si 'claseImagen' trae clases CSS específicas que quieres añadir
            // y no colisionan con img-fluid o rounded, puedes hacer:
            // if (claseImagen) {
            //     imgElement.classList.add(claseImagen);
            // }
            // Si 'claseImagen' es una clase para reemplazar el estilo (lo cual no es común aquí),
            // entonces tendrías que asegurarte de que la clase de tu backend incluya
            // las propiedades de img-fluid y rounded, o volver a añadirlas.
            // Para este caso, con Bootstrap, probablemente no necesites asignar `className` aquí
            // ya que `max-height` y `width: auto` en el style ya controlan el tamaño.
          } else {
            // Si no hay éxito o rutaImagen, carga una imagen de "no disponible"
            imgElement.src = "assets/img/image-not-found.png"; // Crea esta imagen
            imgElement.alt = `Imagen no disponible para serial ${serial}`;
            console.warn(
              "No se obtuvo ruta de imagen o éxito de la API para el serial:",
              serial,
              response.message
            );
          }
        } else {
          console.error(
            'Error: No se encontró el elemento <img> con ID "device-ticket-image" en el DOM.'
          );
        }
      } catch (error) {
        console.error("Error parsing JSON response for image:", error);
        const imgElement = document.getElementById("device-ticket-image");
        if (imgElement) {
          imgElement.src = "assets/img/error-loading-image.png"; // Crea esta imagen
          imgElement.alt = "Error al cargar imagen";
        }
      }
    } else {
      console.error(
        "Error al obtener la imagen (HTTP):",
        xhr.status,
        xhr.statusText
      );
      const imgElement = document.getElementById("device-ticket-image");
      if (imgElement) {
        imgElement.src = "assets/img/error-loading-image.png";
        imgElement.alt = "Error de servidor al cargar imagen";
      }
    }
  };

  xhr.onerror = function () {
    console.error(
      "Error de red al intentar obtener la imagen para el serial:",
      serial
    );
    const imgElement = document.getElementById("device-ticket-image");
    if (imgElement) {
      imgElement.src = "assets/img/network-error-image.png"; // Crea esta imagen
      imgElement.alt = "Error de red";
    }
  };

  const datos = `action=GetPhoto&serial=${encodeURIComponent(serial)}`;
  xhr.send(datos);
}

function loadTicketHistory(ticketId) {
  // 1. Obtener el contenedor del historial y mostrar mensaje de carga (usando jQuery)
  const historyPanel = $("#ticket-history-content");
  historyPanel.html(
    '<p class="text-center text-muted">Cargando historial...</p>'
  ); // Usar .html() de jQuery

  // 2. Crear y configurar la solicitud AJAX (usando jQuery.ajax)
  $.ajax({
    url: `${ENDPOINT_BASE}${APP_PATH}api/historical/GetTicketHistory`,
    type: "POST",
    data: {
      // jQuery formatea esto automáticamente a 'application/x-www-form-urlencoded'
      action: "GetTicketHistory",
      id_ticket: ticketId,
    },
    dataType: "json", // Le decimos a jQuery que esperamos una respuesta JSON
    success: function (response) {

      // Verificar si la respuesta es exitosa y contiene historial
      if (response.success && response.history && response.history.length > 0) {
        let historyHtml = '<div class="accordion" id="ticketHistoryAccordion">'; // Contenedor del acordeón

        // Iterar sobre cada item del historial para construir el HTML
        response.history.forEach((item, index) => {
          const collapseId = `collapseHistoryItem_${ticketId}_${index}`;
          const headingId = `headingHistoryItem_${ticketId}_${index}`;

          let statusHeaderClass = "";
          let statusHeaderText = "";

          // **Colores por defecto si no hay coincidencia o si el estado es nulo/vacío**
          headerStyle = "background-color: #212529;"; // Gris claro de Bootstrap 'light'
          textColor = "color: #212529;"; // Texto oscuro de Bootstrap 'dark'
          statusHeaderText = ""; // Sin texto extra por defecto

          if (item.name_status_ticket) {
            console.log(item.name_status_ticket);
            const statusLower = item.name_status_ticket.toLowerCase();
            if (statusLower.includes("abierto")) {
              headerStyle = "background-color: #5d9cec;"; // Azul claro/celeste
              textColor = "color: #ffffff;"; // Texto blanco
              statusHeaderText = " (Abierto)";
            } else if (
              statusLower.includes("cerrado") ||
              statusLower.includes("resuelto")
            ) {
              headerStyle = "background-color: #28a745;"; // Verde
              textColor = "color: #ffffff;"; // Texto blanco
              statusHeaderText = " (Cerrado)";
            } else if (
              statusLower.includes("pendiente") ||
              statusLower.includes("en proceso")
            ) {
              headerStyle = "background-color: #ffc107;"; // Amarillo
              textColor = "color: #343a40;"; // Texto oscuro
              statusHeaderText = " (En Proceso)";
            } else if (
              statusLower.includes("cancelado") ||
              statusLower.includes("rechazado")
            ) {
              headerStyle = "background-color: #dc3545;"; // Rojo
              textColor = "color: #ffffff;"; // Texto blanco
              statusHeaderText = " (Cancelado)";
            } else if (statusLower.includes("espera")) {
              headerStyle = "background-color: #6c757d;"; // Gris
              textColor = "color: #ffffff;"; // Texto blanco
              statusHeaderText = " (En Espera)";
            }
          }

          historyHtml += `
                        <div class="card mb-3 custom-history-card"> <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                            data-toggle="collapse" data-target="#${collapseId}"
                                            aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="${collapseId}"
                                            style="${textColor}">
                                        ${item.fecha_de_cambio} - ${item.name_accion_ticket}${statusHeaderText}
                                    </button>
                                </h2>
                            </div>
                            <div id="${collapseId}" class="collapse ${index === 0 ? 'show' : ''}"
                                aria-labelledby="${headingId}" data-parent="#ticketHistoryAccordion">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <th class="text-start" style="width: 40%;">Fecha y Hora:</th>
                                                    <td>${item.fecha_de_cambio || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Acción:</th>
                                                    <td>${item.name_accion_ticket || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Operador de Gestión:</th>
                                                    <td>${item.full_name_tecnico_gestion || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td>${item.full_name_coordinador || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Ticket:</th>
                                                    <td>${item.name_status_ticket || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Laboratorio:</th>
                                                    <td>${item.name_status_lab || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Domiciliación:</th>
                                                    <td>${item.name_status_domiciliacion || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start" style = " word-wrap: break-word; overflow-wrap: break-word;"">Estatus Pago:</th>
                                                    <td>${item.name_status_payment || 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        });

        historyHtml += "</div>"; // Cierre del acordeón principal
        historyPanel.html(historyHtml); // Insertar el HTML generado (con jQuery)

        // === IMPORTANTE: RE-INICIALIZAR COMPONENTES DE BOOTSTRAP SI ES NECESARIO ===
        // Para Bootstrap 4, los atributos data-toggle/data-parent usualmente se "enganchan"
        // automáticamente si jQuery y Bootstrap JS están cargados.
        // No necesitas una inicialización explícita como en Bootstrap 5.
        // El problema suele ser que los atributos data-toggle/data-parent están mal,
        // o jQuery/Bootstrap JS no están cargados.

        // Reiniciar tooltips (si usas Bootstrap 4, la sintaxis es diferente para dispose/init)
        if ($.fn && $.fn.tooltip) {
          // Para Bootstrap 4, los tooltips se manejan así:
          $('[data-toggle="tooltip"]').tooltip("dispose"); // Asegúrate de que el atributo es data-toggle
          $('[data-toggle="tooltip"]').tooltip(); // Y se inicializan con data-toggle
        }

        // Aquí no se necesita `new bootstrap.Collapse` porque eso es para JS nativo de Bootstrap 5.
        // Con jQuery y Bootstrap 4, la magia ocurre a través de los atributos data-toggle y data-parent
        // una vez que el HTML está en el DOM y las librerías cargadas.
      } else {
        historyPanel.html(
          '<p class="text-center text-muted">No hay historial disponible para este ticket.</p>'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      let errorMessage =
        '<p class="text-center text-danger">Error al cargar el historial.</p>';
      if (jqXHR.status === 0) {
        errorMessage =
          '<p class="text-center text-danger">Error de red: No se pudo conectar al servidor.</p>';
      } else if (jqXHR.status == 404) {
        errorMessage =
          '<p class="text-center text-danger">Recurso no encontrado. (Error 404)</p>';
      } else if (jqXHR.status == 500) {
        errorMessage =
          '<p class="text-center text-danger">Error interno del servidor. (Error 500)</p>';
      } else if (textStatus === "parsererror") {
        errorMessage =
          '<p class="text-center text-danger">Error al procesar la respuesta del servidor (JSON inválido).</p>';
      } else if (textStatus === "timeout") {
        errorMessage =
          '<p class="text-center text-danger">Tiempo de espera agotado al cargar el historial.</p>';
      } else if (textStatus === "abort") {
        errorMessage =
          '<p class="text-center text-danger">Solicitud de historial cancelada.</p>';
      }
      historyPanel.html(errorMessage);
      console.error("Error AJAX:", textStatus, errorThrown, jqXHR.responseText);
    },
  });
}


document.addEventListener('DOMContentLoaded', function() {
    const cerrar = document.getElementById('close-button');
    const icon = document.getElementById('Close-icon');
    
    // CAMBIO AQUI: Usa un nombre diferente para la variable del botón, por ejemplo, `sendToTallerButton`
    const sendToTallerButton = document.getElementById('SendToTaller-button');

    // Agrega el event listener al botón cerrar
    if (cerrar) { // Siempre es buena práctica verificar si el elemento existe antes de añadir un listener
        cerrar.addEventListener('click', function() {
            if (modalInstance) {
                modalInstance.hide();
                currentTicketId = null;
            }
            document.getElementById('idSelectionTec').value = '';
        });
    } else {
        console.error("Elemento con ID 'close-button' no encontrado.");
    }

    if (icon) {
        icon.addEventListener('click', function() {
            if (modalInstance) {
                modalInstance.hide();
                currentTicketId = null;
            }
            document.getElementById('idSelectionTec').value = '';
        });
    } else {
        console.error("Elemento con ID 'Close-icon' no encontrado.");
    }

    // Agrega el event listener al botón "Enviar a Taller"
    if (sendToTallerButton) { // Verifica si el botón existe antes de añadir el listener
        sendToTallerButton.addEventListener('click', handleSendToTallerClick); // Llama a una función con otro nombre
    } else {
        console.error("Elemento con ID 'SendToTaller-button' no encontrado. Esto está causando el TypeError.");
    }
});

// CAMBIO AQUI: Renombra la función para que no haya conflicto con el nombre de la variable del botón
function handleSendToTallerClick() {
    const idTicket = currentTicketId; // Usa la variable global para obtener el ID del ticket

    if (idTicket) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/SendToTaller`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'El ticket del Dispostitivo POS fue enviado a Taller',
                        text: response.message,
                        color: 'black',
                        timer: 3500,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        willClose: () => {
                            setTimeout(() => {
                                location.reload();
                            }, 3500);
                        }
                    });
                    modalInstance.hide(); // Cierra el modal
                    getTicketData(); // Recarga los datos de la tabla
                } else {
                    alert('Error al enviar el ticket: ' + response.message);
                }
            } else {
                alert('Error de conexión: ' + xhr.statusText);
            }
        };
        xhr.onerror = function() {
            alert('Error de red');
        };

        const data = `action=SendToTaller&id_ticket=${encodeURIComponent(idTicket)}`;
        xhr.send(data);
    } else {
        alert('Por favor, selecciona un ticket.');
    }
}