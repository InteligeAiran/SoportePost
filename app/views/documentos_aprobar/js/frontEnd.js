let currentSelectedTicket = null;

document.addEventListener('DOMContentLoaded', function() {
    const approveTicketFromImageBtn = document.getElementById('approveTicketFromImage');
    
    if (approveTicketFromImageBtn) {
        approveTicketFromImageBtn.addEventListener('click', handleTicketApprovalFromImage);
    }
});

function handleTicketApprovalFromImage() {
    const nro_ticket = document.getElementById('currentTicketIdDisplay').textContent;
    const documentType = document.getElementById('currentImageTypeDisplay').textContent;
    const serial = document.getElementById('currentSerialDisplay').textContent;
    const id_ticket = currentTicketIdForImage;

    
    if (!id_ticket ) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el ID del ticket.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    if (!documentType) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el tipo de documento.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    if (!serial) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el serial del documento.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    if(!nro_ticket) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el número de ticket.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#003594'
        });
        return;
    }

    const customWarningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" class="bi bi-question-triangle-fill custom-icon-animation" viewBox="0 0 16 16"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/></svg>`;

    Swal.fire({
        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
            <div class="custom-modal-header-content">Confirmar Aprobación</div>
            </div>`,
        html: `${customWarningSvg}<p class="mt-3" id="textConfirm">¿Está seguro que desea aprobar el Nro ticket <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> asociado al serial <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serial}</span>?`,
        showCancelButton: true,
        confirmButtonColor: '#003594',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Aprobar',
        cancelButtonText: 'Cancelar',
        color: 'black',
        focusConfirm: false,
        allowOutsideClick: false, 
        allowEscapeKey: false,
        keydownListenerCapture: true,
        didOpen: () => {
            // Aplicar estilos personalizados después de que se abra el modal
            const backdrop = document.querySelector('.swal2-backdrop-show');
            const popup = document.querySelector('.swal2-popup');
            
            if (backdrop) {
                backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                backdrop.style.backdropFilter = 'blur(8px)';
            }
            
            if (popup) {
                popup.style.background = 'rgba(255, 255, 255, 0.95)';
                popup.style.backdropFilter = 'blur(10px)';
                popup.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                popup.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la aprobación
            approveTicket(nro_ticket, documentType, id_ticket);
        }
    });
}

// Función para enviar la solicitud de aprobación
function approveTicket(nro_ticket, documentType, id_ticket) {
    const id_user = document.getElementById('userId').value;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/approve-document`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Mostrar indicador de carga
    Swal.fire({
        title: 'Procesando...',
        text: 'Aprobando documento del ticket',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Aprobado!',
                        html: `El documento ${documentType} asociado al Nro Ticket <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> ha sido aprobado correctamente.`,
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#003594',
                        color: 'black'
                    }).then(() => {
                       window.location.reload();
                        
                        // Recargar la tabla de tickets
                        if (typeof getTicketAprovalDocument === 'function') {
                            getTicketAprovalDocument();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al aprobar el documento',
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
        console.error('Error de red al intentar aprobar el ticket');
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
    const data = `action=approve-document&nro_ticket=${encodeURIComponent(nro_ticket)}&document_type=${encodeURIComponent(documentType)}&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(id_ticket)}`;
    xhr.send(data);
}

function getTicketAprovalDocument() {
    const id_user = document.getElementById("userId").value; // Obtener el ID del usuario

    const xhr = new XMLHttpRequest();
    // Pasa el id_user como parámetro de consulta a tu endpoint
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/tickets-pending-document-approval`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    const detailsPanel = document.getElementById("ticket-details-panel");

    const tableElement = document.getElementById("tabla-ticket");
    const theadElement = tableElement
        ? tableElement.getElementsByTagName("thead")[0]
        : null;
    const tbodyElement = tableElement
        ? tableElement.getElementsByTagName("tbody")[0]
        : null;
    const tableContainer = document.querySelector(".table-responsive");
    // Asumiendo que 'viewDocumentsBtn' es un botón fuera de la tabla si lo usas
    const viewDocumentsBtn = document.getElementById("viewDocumentsBtn"); 

    // Actualiza columnTitles con las nuevas columnas disponibles
    const columnTitles = {
        nro_ticket: "Nro Ticket",
        serial_pos: "Serial POS",
        name_status_payment: "Estatus Pago",
        // NUEVAS COLUMNAS DISPONIBLES
        document_type: "Tipo Documento",
        original_filename: "Nombre Archivo",
        motivo_rechazo: "Motivo Rechazo",
        uploaded_at: "Fecha Subida"
    };

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    const TicketData = response.tickets;

                    if (TicketData && TicketData.length > 0) {
                        if ($.fn.DataTable.isDataTable("#tabla-ticket")) {
                            $("#tabla-ticket").DataTable().destroy();
                            if (theadElement) theadElement.innerHTML = "";
                            if (tbodyElement) tbodyElement.innerHTML = "";
                        }

                        const allDataKeys = Object.keys(TicketData[0] || {});
                        const columnsConfig = [];

                        // --- AGREGAR COLUMNA DE NUMERACIÓN AL PRINCIPIO ---
                        columnsConfig.push({
                            title: "N°",
                            orderable: false,
                            searchable: false,
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            },
                        });
                        // --- FIN DE COLUMNA DE NUMERACIÓN ---

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
                                columnsConfig.push(columnDef);
                            }
                        }

                        // --- AÑADIR COLUMNA DE ACCIONES ---
                        columnsConfig.push({
                            data: null, // No se asocia a una columna de datos directa
                            title: "Acciones",
                            orderable: false, // No permitir ordenar por esta columna
                            render: function (data, type, row) {
                                const idTicket = row.id_ticket;
                                const envio = row.envio;
                                const exoneracion = row.exoneracion;
                                const pago = row.pago;
                                const nro_ticket = row.nro_ticket;
                                const serial_pos = row.serial_pos;
                                
                                // NUEVAS COLUMNAS DISPONIBLES
                                const documentType = row.document_type;
                                const originalFilename = row.original_filename;
                                const motivoRechazo = row.motivo_rechazo;
                                const uploadedAt = row.uploaded_at;
                                const idMotivoRechazo = row.id_motivo_rechazo;
                                
                                // Determinar si es un documento rechazado
                                const isRejected = idMotivoRechazo !== null && motivoRechazo !== null;
                                
                                let actionButtons = `
                                    <button class="btn btn-info btn-sm view-image-btn" 
                                            data-serial-pos="${serial_pos}" 
                                            data-nro-ticket="${nro_ticket}" 
                                            data-id="${idTicket}" 
                                            data-envio="${envio}" 
                                            data-exoneracion="${exoneracion}" 
                                            data-anticipo="${pago}"
                                            data-document-type="${documentType || ''}"
                                            data-original-filename="${originalFilename || ''}"
                                            data-motivo-rechazo="${motivoRechazo || ''}"
                                            data-uploaded-at="${uploadedAt || ''}"
                                            data-id-motivo-rechazo="${idMotivoRechazo || ''}"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#visualizarImagenModal" 
                                            title="Visualizar Imágenes">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                        </svg>
                                    </button>
                                `;
                                
                                // Si es un documento rechazado, agregar botón para subir nuevo documento
                                if (isRejected) {
                                    actionButtons += `
                                        <button class="btn btn-warning btn-sm upload-new-doc-btn ms-1" 
                                                data-id="${idTicket}" 
                                                data-nro-ticket="${nro_ticket}" 
                                                data-serial-pos="${serial_pos}"
                                                data-document-type="${documentType || ''}"
                                                data-motivo-rechazo="${motivoRechazo || ''}"
                                                title="Subir Nuevo Documento">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                                                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                        </button>
                                    `;
                                }
                                
                                return actionButtons;
                            },
                        });
                        // --- FIN DE AÑADIR COLUMNA ---

                        const dataTableInstance = $(tableElement).DataTable({
                            responsive: false,
                            scrollX: "200px",
                            data: TicketData,
                            columns: columnsConfig,
                            order: [[1, 'desc']], // Cambiar a [1, 'desc'] porque ahora la columna 0 es N°
                            pagingType: "simple_numbers",
                            lengthMenu: [5, 10, 25, 50, 100],
                            autoWidth: false,
                            language: {
                                lengthMenu: "Mostrar _MENU_",
                                emptyTable: "No hay datos disponibles en la tabla",
                                zeroRecords: "No se encontraron resultados para la búsqueda",
                                info: "(_PAGE_/_PAGES_) _TOTAL_ Registros",
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
                            },
                            dom: '<"top d-flex justify-content-between align-items-center"l<"dt-buttons-container">f>rt<"bottom"ip><"clear">',
                                initComplete: function (settings, json) {
                                // Dentro de initComplete, 'this' se refiere a la tabla jQuery
                                // y 'this.api()' devuelve la instancia de la API de DataTables.
                                const api = this.api(); // <--- Correcto: Obtener la instancia de la API aquí

                                // Esto es parte de tu inicialización de DataTables, probablemente dentro de 'initComplete'
                                // o en un script que se ejecuta después de que la tabla está lista.
                                const buttonsHtml = `
                                    <button id="btn-por-asignar" class="btn btn-primary me-2" title="Pendientes por revisión Documentos">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                    </svg>
                                    </button>

                                    <button id="btn-recibidos" class="btn btn-secondary me-2" title="Pendiente por cargar Documentos">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                                            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
                                    </svg>
                                    </button>

                                    <button id="btn-asignados" class="btn btn-secondary me-2" title="Documentos Rechazados">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                    </svg>
                                    </button>
                                `;
                                $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

                                function setActiveButton(activeButtonId) {
                                    $("#btn-por-asignar")
                                    .removeClass("btn-primary")
                                    .addClass("btn-secondary");
                                    $("#btn-asignados")
                                    .removeClass("btn-primary")
                                    .addClass("btn-secondary");
                                    $("#btn-recibidos")
                                    .removeClass("btn-primary")
                                    .addClass("btn-secondary");
                                    $("#btn-reasignado")
                                    .removeClass("btn-primary")
                                    .addClass("btn-secondary");
                                    $(`#${activeButtonId}`)
                                    .removeClass("btn-secondary")
                                    .addClass("btn-primary");
                                }

                                api.columns().search('').draw(false);
                                api // <--- Usar 'api' en lugar de 'dataTableInstance'
                                    .column(3)
                                    .search("Pago Anticipo Pendiente por Revision|Exoneracion Pendiente por Revision", true, true) // CAMBIO AQUÍ
                                    .draw();
                                setActiveButton("btn-por-asignar"); // Activa el botón "Por Asignar" al inicio // CAMBIO AQUÍ

                                $("#btn-por-asignar").on("click", function () {
                                    api.columns().search('').draw(false);
                                    api
                                    .column(3)
                                    .search("Pago Anticipo Pendiente por Revision|Exoneracion Pendiente por Revision", true, true) // CAMBIO AQUÍ
                                    .draw();
                                    setActiveButton("btn-por-asignar");
                                });

                                
                                $("#btn-recibidos").on("click", function () {
                                    api.columns().search('').draw(false);
                                    api
                                        .column(3)
                                        .search("Pendiente Por Cargar Documentos|Pendiente Por Cargar Documento\\(Pago anticipo o Exoneracion\\)|Pendiente Por Cargar Documento\\(PDF Envio ZOOM\\)", true, false, true)
                                        .draw();
                                    setActiveButton("btn-recibidos");
                                });

                                $("#btn-asignados").on("click", function () {
                                    api.columns().search('').draw(false);
                                    api
                                        .column(3)
                                        .search("Documento de Exoneracion Rechazado|Documento de Anticipo Rechazado|Documento de Envio Rechazado", true, false, true)
                                        .draw();
                                    setActiveButton("btn-asignados");
                                });    
                            },
                        });

                        // Event listener para subir nuevo documento (NUEVO)
                        $("#tabla-ticket tbody").on("click", ".upload-new-doc-btn", function () {
                            const ticketId = $(this).data("id");
                            const nroTicket = $(this).data("nro-ticket");
                            const serialPos = $(this).data("serial-pos");
                            const documentType = $(this).data("document-type");
                            const motivoRechazo = $(this).data("motivo-rechazo");
                            
                            showUploadNewDocumentModal(ticketId, nroTicket, serialPos, documentType, motivoRechazo);
                        });

                        $("#tabla-ticket tbody")
                            .off("click", "tr") // .off() para prevenir múltiples enlaces si se llama varias veces
                            .on("click", "tr", function (e) {
                                // Asegúrate de que el clic no proviene de una celda de acción (botones, SVG, etc.)
                                if ($(e.target).hasClass('truncated-cell') || $(e.target).hasClass('full-text-cell') || $(e.target).is('button') || $(e.target).is('svg') || $(e.target).is('path') || $(e.target).is('input[type="checkbox"]')) {
                                    return;
                                }

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

                                    if (viewDocumentsBtn) {
                                        viewDocumentsBtn.style.display = "block";
                                    }

                                } else {
                                    detailsPanel.innerHTML =
                                        "<p>No se encontraron detalles para este ticket.</p>";
                                    if (viewDocumentsBtn) {
                                        viewDocumentsBtn.style.display = "none";
                                    }
                                }
                            });

                        $("#tabla-ticket tbody").on("click", ".view-image-btn", function () {
                            const ticketId = $(this).data("id");
                            const nroTicket = $(this).data("nro-ticket");
                            const serialPos = $(this).data("serial-pos");
                            
                            // Asume que los valores 'Sí' o 'No' están en los data attributes del botón.
                            const envioValor = $(this).data("envio");
                            const exoValor = $(this).data("exoneracion");
                            const pagoValor = $(this).data("anticipo");

                            // Lógica de validación
                            if (envioValor === 'No' && exoValor === 'No' && pagoValor === 'No') {
                                Swal.fire({
                                    title: 'No hay imagen disponible',
                                    text: 'El ticket no posee imagen en el sistema.',
                                    icon: 'info',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#003594',
                                    color: 'black'
                                });
                                // Detener la ejecución de la función aquí.
                                return; 
                            }

                            // Si al menos una imagen existe, el código continúa aquí.
                            currentTicketIdForImage = ticketId;
                            currentTicketNroForImage = nroTicket;
                            currentTicketSerialForImage = serialPos;

                            const VizualizarImage = document.getElementById('visualizarImagenModal');
                            // Establecer el data-ticket-id en el modal para que esté disponible en el listener del botón
                            VizualizarImage.setAttribute('data-ticket-id', nroTicket);
                            VizualizarImage.setAttribute('data-serial-pos', serialPos);
                            const visualizarImagenModal = new bootstrap.Modal(VizualizarImage, { keyboard: false });

                            const EnvioInputModal = document.getElementById('imagenEnvio');
                            const EnvioLabelModal = document.getElementById('labelEnvio');
                            const ExoInputModal = document.getElementById('imagenExoneracion');
                            const ExoLabelModal = document.getElementById('labelExo');
                            const PagoInputModal = document.getElementById('imagenPago');
                            const PagoLabelModal = document.getElementById('labelPago');
                            const botonCerrarVizualizacion = document.getElementById('closeImagevisualizarModalBtn');

                            if(botonCerrarVizualizacion) {
                                botonCerrarVizualizacion.addEventListener('click', function() {
                                    visualizarImagenModal.hide(); // Oculta el modal de visualización de imagen
                                });
                            }

                            // Muestra u oculta los radio buttons basándose en los valores del botón
                            if (envioValor === 'Sí') {
                                EnvioLabelModal.style.display = 'block';
                                EnvioInputModal.style.display = 'block';
                            } else {
                                EnvioLabelModal.style.display = 'none';
                                EnvioInputModal.style.display = 'none';
                            }

                            if (exoValor === 'Sí') {
                                ExoInputModal.style.display = 'block';
                                ExoLabelModal.style.display = 'block';
                            } else {
                                ExoInputModal.style.display = 'none';
                                ExoLabelModal.style.display = 'none';
                            }

                            if (pagoValor === 'Sí') {
                                PagoInputModal.style.display = 'block';
                                PagoLabelModal.style.display = 'block';
                            } else {
                                PagoInputModal.style.display = 'none';
                                PagoLabelModal.style.display = 'none';
                            }
                            
                            // Set a sensible default checked radio button
                            if (envioValor === 'Sí') {
                                EnvioInputModal.checked = true;
                            } else if (exoValor === 'Sí') {
                                ExoInputModal.checked = true;
                            } else if (pagoValor === 'Sí') {
                                PagoInputModal.checked = true;
                            }

                            // Mostrar el modal
                            visualizarImagenModal.show();
                        });
                        if (tableContainer) {
                            tableContainer.style.display = "";
                        }
                    } else {
                        if (tableContainer) {
                            tableContainer.innerHTML = "<p>No hay datos disponibles.</p>";
                            tableContainer.style.display = "";
                        }
                        if (viewDocumentsBtn) {
                            viewDocumentsBtn.style.display = "none";
                        }
                    }

                    $("#tabla-ticket tbody").on("click", ".upload-new-doc-btn", function () {
                        const ticketId = $(this).data("id");
                        const nroTicket = $(this).data("nro-ticket");
                        const serialPos = $(this).data("serial-pos");
                        const documentType = $(this).data("document-type");
                        const motivoRechazo = $(this).data("motivo-rechazo");
                        
                        showUploadNewDocumentModal(ticketId, nroTicket, serialPos, documentType, motivoRechazo);
                    });
                } else {
                    if (tableContainer) {
                        tableContainer.innerHTML =
                            "<p>Error al cargar los datos: " +
                            (response.message || "Mensaje desconocido") +
                            "</p>";
                        tableContainer.style.display = "";
                    }
                    console.error("Error desde la API:", response.message);
                    if (viewDocumentsBtn) {
                        viewDocumentsBtn.style.display = "none";
                    }
                }
            } catch (error) {
                if (tableContainer) {
                    tableContainer.innerHTML = "<p>Error al procesar la respuesta.</p>";
                    tableContainer.style.display = "";
                }
                console.error("Error al parsear JSON:", error);
                if (viewDocumentsBtn) {
                    viewDocumentsBtn.style.display = "none";
                }
            }
        } else if (xhr.status === 404) {
            if (tableContainer) {
                tableContainer.innerHTML = "<p>No se encontraron datos.</p>";
                tableContainer.style.display = "";
            }
            if (viewDocumentsBtn) {
                viewDocumentsBtn.style.display = "none";
            }
        } else {
            if (tableContainer) {
                tableContainer.innerHTML = `<p>Error de conexión: ${xhr.status} ${xhr.statusText}</p>`;
                tableContainer.style.display = "";
            }
            console.error("Error:", xhr.status, xhr.statusText);
            if (viewDocumentsBtn) {
                viewDocumentsBtn.style.display = "none";
            }
        }
    };
    xhr.onerror = function () {
        if (tableContainer) {
            tableContainer.innerHTML = "<p>Error de red.</p>";
            tableContainer.style.display = "";
        }
        console.error("Error de red");
        if (viewDocumentsBtn) {
            viewDocumentsBtn.style.display = "none";
        }
    };
    const datos = `action=tickets-pending-document-approval&id_user=${encodeURIComponent(id_user)}`;
    xhr.send(datos);
}

document.addEventListener("DOMContentLoaded", getTicketAprovalDocument);

function showUploadNewDocumentModal(ticketId, nroTicket, serialPos, documentType, motivoRechazo) {
    // Obtener elementos del modal
    const modal = document.getElementById('uploadDocumentModal');
    const modalTicketIdSpan = document.getElementById('modalTicketId');
    const idTicketInput = document.getElementById('id_ticket');
    const documentFileInput = document.getElementById('documentFile');
    const imagePreview = document.getElementById('imagePreview');
    const uploadMessage = document.getElementById('uploadMessage');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    const cerrarBoton = document.getElementById('CerrarBoton');
    const uploadForm = document.getElementById('uploadForm');
    const DocumentTypeInput = document.getElementById('document_type');
    const nro_ticket = document.getElementById('nro_ticket');

    // Verificar que todos los elementos necesarios existan
    if (!modal || !modalTicketIdSpan || !idTicketInput || !documentFileInput || 
        !imagePreview || !uploadMessage || !uploadFileBtn || !cerrarBoton || !uploadForm) {
        console.error('Elementos del modal no encontrados:', {
            modal: !!modal,
            modalTicketIdSpan: !!modalTicketIdSpan,
            idTicketInput: !!idTicketInput,
            documentFileInput: !!documentFileInput,
            imagePreview: !!imagePreview,
            uploadMessage: !!uploadMessage,
            uploadFileBtn: !!uploadFileBtn,
            cerrarBoton: !!cerrarBoton,
            uploadForm: !!uploadForm
        });
        
        Swal.fire({
            icon: 'error',
            title: 'Error del Modal',
            text: 'No se pudo cargar el modal de subida de documentos. Verifique que todos los elementos estén disponibles.',
            confirmButtonText: 'Ok',
            color: 'black',
            confirmButtonColor: '#dc3545'
        });
        return;
    }

    // Limpiar formulario anterior
    uploadForm.reset();
    imagePreview.style.display = 'none';
    uploadMessage.innerHTML = '';
    uploadMessage.classList.add('hidden');

    // Establecer información del ticket
    modalTicketIdSpan.textContent = nroTicket;
    idTicketInput.value = ticketId;
    DocumentTypeInput.value = documentType;


    // Mostrar información del documento rechazado
    const infoHtml = `
        <div class="alert mb-3" id = "CartWrong" role="alert">
            <h6 class="alert-heading">Documento Rechazado</h6>
            <p class="mb-1"><strong>Serial POS:</strong> ${serialPos}</p>
            <p class="mb-1"><strong>Tipo de Documento:</strong> ${documentType || 'No especificado'}</p>
            <p class="mb-0"><strong>Motivo de Rechazo:</strong> <span class="motivo-rechazo-highlight">${motivoRechazo || 'No especificado'}</span></p>
        </div>
    `;
    
    // Insertar la información antes del formulario
    const existingInfo = uploadForm.querySelector('#CartWrong');
    if (existingInfo) {
        existingInfo.remove();
    }
    uploadForm.insertAdjacentHTML('afterbegin', infoHtml);

    // Mostrar el modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // Event listener para previsualización de imagen
    const handleFileChange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Tipo de archivo no permitido',
                    text: 'Solo se permiten imágenes (JPG, PNG, GIF) o PDF.',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#003594'
                });
                this.value = '';
                imagePreview.style.display = 'none';
                return;
            }

            // Validar tamaño del archivo (10MB máximo)
            const maxSize = 10 * 1024 * 1024; // 10MB en bytes
            if (file.size > maxSize) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo demasiado grande',
                    text: 'El archivo excede el tamaño máximo permitido de 10MB.',
                    confirmButtonText: 'Ok',
                    color: 'black',
                    confirmButtonColor: '#003594'
                });
                this.value = '';
                imagePreview.style.display = 'none';
                return;
            }

            // Mostrar previsualización si es imagen
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                // Si es PDF, ocultar previsualización
                imagePreview.style.display = 'none';
            }

            // Habilitar botón de subida
            uploadFileBtn.disabled = false;
        } else {
            imagePreview.style.display = 'none';
            uploadFileBtn.disabled = true;
        }
    };

    // Event listener para el botón de subida
    const handleUploadClick = function() {
        const file = documentFileInput.files[0];
        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivo requerido',
                text: 'Por favor seleccione un archivo para subir.',
                confirmButtonText: 'Ok',
                color: 'black',
                confirmButtonColor: '#003594'
            });
            return;
        }

        // Mostrar indicador de carga
        Swal.fire({
            title: 'Subiendo documento...',
            text: 'Por favor espere mientras se procesa el archivo.',
            allowOutsideClick: false,
            color: 'black',
            didOpen: () => {
                Swal.showLoading();
            }
        });

    }
    // Event listener para cerrar modal
    const handleCerrarClick = function() {
        bootstrapModal.hide();
    };

    // Agregar event listeners
    documentFileInput.addEventListener('change', handleFileChange);
    uploadFileBtn.addEventListener('click', handleUploadClick);
    cerrarBoton.addEventListener('click', handleCerrarClick);

    // Limpiar al cerrar el modal
    modal.addEventListener('hidden.bs.modal', function() {
        // Remover event listeners
        documentFileInput.removeEventListener('change', handleFileChange);
        uploadFileBtn.removeEventListener('click', handleUploadClick);
        cerrarBoton.removeEventListener('click', handleCerrarClick);
        
        // Limpiar formulario
        uploadForm.reset();
        imagePreview.style.display = 'none';
        uploadMessage.innerHTML = '';
        uploadMessage.classList.add('hidden');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const visualizarImagenModalElement = document.getElementById('visualizarImagenModal');
    const closeImagevisualizarModalBtn = document.getElementById('closeImagevisualizarModalBtn');
    const btnVisualizarImagen = document.getElementById('btnVisualizarImagen');
      
    const ticketImagePreview = document.getElementById('ticketImagePreview'); // El elemento img
    const mediaViewerContainer = document.getElementById('mediaViewerContainer'); // El div contenedor

    const currentTicketIdDisplay = document.getElementById('currentTicketIdDisplay');
    const currentImageTypeDisplay = document.getElementById('currentImageTypeDisplay');
    const approveTicketFromImage = document.getElementById('approveTicketFromImage');

    // Instancias de Bootstrap Modal
    const visualizarImagenModal = new bootstrap.Modal(visualizarImagenModalElement);

    // Event listener para el botón "Aprobar Documento"
    btnVisualizarImagen.addEventListener('click', function() {
        const selectedOption = document.querySelector('input[name="opcionImagen"]:checked').value;
        const ticketId = visualizarImagenModalElement.getAttribute('data-ticket-id');
        const serialPos = visualizarImagenModalElement.getAttribute('data-serial-pos');

        if (!selectedOption) {
            Swal.fire({
                icon: 'warning',
                title: 'Selección Requerida',
                text: 'Por favor, elija un tipo de documento para aprobar.',
                confirmButtonText: 'Ok',
                color: 'black',
                confirmButtonColor: '#003594'
            });
            return;
        }

        // Llamar a la API usando XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetDocumentByType`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        const document = data.document;
                        const filePath = document.file_path;
                        const mimeType = document.mime_type;
                        const fileName = document.original_filename;

                        // Mostrar el documento en el modal de aprobación
                        showApprovalModal(ticketId, selectedOption, filePath, mimeType, fileName, serialPos);

                        // Ocultar el modal de selección
                        visualizarImagenModal.hide();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message || 'Error al obtener el documento.',
                            confirmButtonText: 'Ok',
                            color: 'black',
                            confirmButtonColor: '#003594'
                        });
                    }
                } catch (error) {
                    console.error('Error al parsear la respuesta JSON:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Respuesta',
                        text: 'Error al procesar la respuesta del servidor.',
                        confirmButtonText: 'Ok',
                        color: 'black',
                        confirmButtonColor: '#003594'
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
                    confirmButtonColor: '#003594'
                });
            }
        };
        xhr.onerror = function() {
            console.error('Error de red al intentar cargar el documento.');
            Swal.fire({
                icon: 'error',
                title: 'Error de Red',
                text: 'Error de conexión con el servidor.',
                confirmButtonText: 'Ok',
                color: 'black',
                confirmButtonColor: '#003594'
            });
        };
        const data = `action=GetDocumentByType&ticketId=${ticketId}&documentType=${selectedOption}`;
        xhr.send(data);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Obtén las referencias a los elementos del DOM que SÍ ESTÁN PRESENTES AL CARGAR LA PÁGINA
  const cerrarBoton = document.getElementById("CerrarBoton");
  const iconoCerrar = document.getElementById("icon-close");
  const inputFile = document.getElementById("documentFile");
  const modalElement = document.getElementById("uploadDocumentModal");
  const modalTicketIdSpan = document.getElementById("modalTicketId");

    document.addEventListener("click", function (event) {
        // Verifica si el elemento que fue clickeado (o su ancestro) tiene el ID 'openModalButton'
        // Puedes usar event.target o event.closest()
        const clickedButton = event.target.closest("#openModalButton");

        if (clickedButton) {
            // Se hizo clic en un botón con el ID 'openModalButton'
            event.preventDefault(); // Opcional: evita el comportamiento por defecto si es necesario

            const idTicket = clickedButton.dataset.idTicket; // Accede al data-id-ticket

            if (modalTicketIdSpan) {
                modalTicketIdSpan.textContent = idTicket;
            }

            // Si el modal no se abre automáticamente con data-bs-toggle, puedes hacerlo manualmente:
            const uploadDocumentModal = new bootstrap.Modal(modalElement);
            uploadDocumentModal.show();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {


  document.addEventListener("click", function (event) {
    // Verifica si el elemento que fue clickeado (o su ancestro) tiene el ID 'openModalButton'
    // Puedes usar event.target o event.closest()
    const clickedButton = event.target.closest("#viewimage");

    if (clickedButton) {
      // Se hizo clic en un botón con el ID 'openModalButton'
      event.preventDefault(); // Opcional: evita el comportamiento por defecto si es necesario

      const idTicket = clickedButton.dataset.idTicket; // Accede al data-id-ticket

      if (modalTicketIdSpan) {
        modalTicketIdSpan.textContent = idTicket;
      }

      // Si el modal no se abre automáticamente con data-bs-toggle, puedes hacerlo manualmente:
      const viewDocumentModal1 = new bootstrap.Modal(modalElement1);
      viewDocumentModal1.show();
    }
  });
});

$(document).ready(function () {
  // 1. Declaración de referencias a elementos del DOM usando jQuery
  // Deben estar declaradas al inicio de $(document).ready para que sean accesibles en todo el bloque.
  const $uploadDocumentModalElement = $("#uploadDocumentModal"); // <-- Este es el modal DIV
  const $modalTicketIdSpan = $("#modalTicketId");
  const $documentFileInput = $("#documentFile");
  const $imagePreview = $("#imagePreview");
  const $uploadFileBtn = $("#uploadFileBtn"); // <-- Este es el botón "Subir" dentro del modal
  const $uploadMessage = $("#uploadMessage");


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

  // 3. Listener para el clic en los botones "Subir Documento" en la tabla
  // Usamos delegación de eventos con $(document).on('click', ...)
  // para los botones generados dinámicamente por DataTables.
  $(document).on("click", ".upload-document-btn", function () {
    // Verifica si la instancia del modal se creó correctamente
    if (uploadDocumentModalInstance) {
      const idTicket = $(this).data("id-ticket"); // Obtiene data-id-ticket del botón clicado

      // Rellena el modal con los datos del ticket
      if ($modalTicketIdSpan.length) $modalTicketIdSpan.text(idTicket);

      // Limpia campos del modal
      if ($documentFileInput.length) $documentFileInput.val("");
      if ($imagePreview.length) {
        $imagePreview.hide();
        $imagePreview.attr("src", "#"); // Limpiar src de la imagen
      }
      if ($uploadMessage.length) {
        $uploadMessage.text("");
        $uploadMessage.hide(); // Ocultar mensaje
      }

      // ABRIR EL MODAL EXPLICITAMENTE
      uploadDocumentModalInstance.show();
    } else {
      console.error(
        "Error: Instancia de modal 'uploadDocumentModal' no encontrada. Asegúrate de que el elemento HTML del modal existe y Bootstrap JS está cargado."
      );
    }
  });

  // 4. Previsualización de la imagen seleccionada (ya estaba bien estructurado)
  if ($documentFileInput.length) {
    $documentFileInput.on("change", function () {
      const file = this.files[0];

      if (file) {
        if (file.type.startsWith("image/") || file.type === "application/pdf") {
          const reader = new FileReader();
          reader.onload = function (e) {
            if (file.type.startsWith("image/")) {
              $imagePreview.attr("src", e.target.result);
              $imagePreview.show();
            } else {
              $imagePreview.hide();
              $imagePreview.attr("src", "#");
              showMessage(
                "Archivo PDF seleccionado. No se muestra previsualización.",
                "info"
              );
            }
          };
          reader.readAsDataURL(file);
          $uploadMessage.hide(); // Limpiar mensajes si el archivo es válido
        } else {
          $documentFileInput.val("");
          $imagePreview.attr("src", "#");
          showMessage(
            "Tipo de archivo no permitido. Solo imágenes (JPG, PNG, GIF) o PDF.",
            "error"
          );
        }
      } else {
        $imagePreview.hide();
        $imagePreview.attr("src", "#");
        $uploadMessage.hide();
      }
    });
  }

  if ($uploadFileBtn.length) {
        $uploadFileBtn.on("click", function () {
            const id_user = document.getElementById("userId").value;
            const documentFileInput = document.getElementById("documentFile");
            const uploadMessage = document.getElementById("uploadMessage");
            const file = documentFileInput.files[0];
            const id_ticket = document.getElementById("id_ticket").value;
            const documentType = document.getElementById("document_type").value;

            // Clear previous messages and check for file
            uploadMessage.classList.add("hidden");
            uploadMessage.textContent = "";

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
            formData.append("ticket_id", id_ticket);           // Tu API espera "ticket_id"
            formData.append("document_type", documentType);    // Tu API espera "document_type"
            formData.append("document_file", file);            // Tu API espera "document_file"
            formData.append("id_user", id_user);               // Tu API espera "id_user"
            formData.append("nro_ticket", $modalTicketIdSpan.text());

            const xhr = new XMLHttpRequest();
            const url = `${ENDPOINT_BASE}${APP_PATH}api/reportes/uploadDocumentnNew`;

            xhr.open("POST", url);

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
                            confirmButtonText: 'OK',
                            color: 'black',
                        }).then(() => {
                        location.reload();
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
        });
    }

    // Función para obtener el ID del usuario actual
    function getCurrentUserId() {
        // Opción 1: Si tienes un elemento hidden en el HTML
        const userIdElement = document.getElementById('userId');
        if (userIdElement) {
            return userIdElement.value;
        }
        
        // Opción 2: Si tienes una variable global
        if (typeof currentUserId !== 'undefined') {
            return currentUserId;
        }
        
        // Opción 3: Si tienes un atributo data en algún elemento
        const userElement = document.querySelector('[data-user-id]');
        if (userElement) {
            return userElement.getAttribute('data-user-id');
        }
        
        // Opción 4: Si tienes localStorage
        if (localStorage.getItem('userId')) {
            return localStorage.getItem('userId');
        }
        
        // Si no se encuentra, mostrar error
        console.error("No se pudo obtener el ID del usuario");
        showMessage("Error: No se pudo identificar al usuario.", "error");
        return null;
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
});

function formatTicketDetailsPanel(d) {
  // d es el objeto `data` completo del ticket
  // Ahora, 'd' también incluirá d.garantia_instalacion y d.garantia_reingreso

  const initialImageUrl = "assets/img/loading-placeholder.png"; // Asegúrate de tener esta imagen
  const initialImageAlt = "Cargando imagen del dispositivo...";

  // Determina el mensaje de garantía
  let garantiaMessage = '';
  if (d.garantia_instalacion !== null && d.garantia_instalacion !== '' && d.garantia_instalacion !== false && d.garantia_instalacion !== 'f') {
    garantiaMessage = 'Aplica Garantía de Instalación';
  } else if (d.garantia_reingreso !== null && d.garantia_reingreso !== '' && d.garantia_reingreso !== false && d.garantia_reingreso !== 'f') {
    garantiaMessage = 'Aplica Garantía por Reingreso';
  } else {
    garantiaMessage = 'No aplica Garantía'; // O simplemente dejarlo vacío si no hay garantía
  }

  return `
        <div class="container-fluid">
            <div class="row mb-3 align-items-center">
                <div class="col-md-3 text-center">
                    <div id="device-image-container" class="p-2">
                      <img id="device-ticket-image" src="${initialImageUrl}" alt="${initialImageAlt}" class="img-fluid rounded" style="max-width: 120px; height: auto; object-fit: contain;">
                    </div>
                </div>
                <div class="col-md-9">
                    <h4 style = "color: black;">Ticket #${d.nro_ticket}</h4>
                    <hr class="mt-2 mb-3">
                    <div class="row">
                        <div class="col-sm-6 mb-2">
                          <strong><div>Serial POS:</div></strong>
                          ${d.serial_pos}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <strong><div>Estatus POS:</div></strong>
                          ${d.estatus_inteliservices}
                        </div><br>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Fecha Instalación:</div></strong>
                          ${d.fecha_instalacion || 'Sin datos'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div  style = "font-size: 77%;" >Fecha de Cierre ultimo Ticket:</div></strong>
                          ${d.fecha_cierre_anterior || 'Sin datos'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Garantía:</div></strong>
                          <span style="font-weight: bold; color: ${garantiaMessage.includes('Aplica') ? 'red' : 'green'};">${garantiaMessage}</span>
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Creación ticket:</div></strong>
                          ${d.create_ticket}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Usuario Gestión:</div></strong>
                          ${d.full_name_tecnico}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Dirección Instalación:</div></strong>
                          ${d.nombre_estado_cliente || 'Sin datos'}
                        </div><br>
                         <div class="col-sm-6 mb-2">
                            <br><strong><div>Estatus Ticket:</div></strong>
                            ${d.name_status_ticket}
                        </div><br>
                        <br><div class="col-sm-6 mb-2">
                              <br><strong><div>Falla Reportada:</div></strong>
                             <span class="falla-reportada-texto">${d.name_failure}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mb-3" style="margin-top: -7%; positipn: relative;">
                <div class="col-12">
                    <div class="row">
                        <div class="col-sm-4 mb-2">
                            <strong><div>Acción:</div></strong>
                            <span class = "Accion-ticket">${d.name_accion_ticket}</span>
                        </div>
                           
                    </div>
                </div>
            </div>

            <hr class="mt-2 mb-3">

            <div class="row">
                <div class="col-12">
                    <h5 style = "color: black;" >Gestión / Historial:</h5>
                    <div id="ticket-history-content">
                        <p>Selecciona un ticket para cargar su historial.</p>
                    </div>
                </div>
            </div>
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
  const historyPanel = $("#ticket-history-content");
  historyPanel.html('<p class="text-center text-muted">Cargando historial...</p>');

  $.ajax({
    url: `${ENDPOINT_BASE}${APP_PATH}api/historical/GetTicketHistory`,
    type: "POST",
    data: {
      action: "GetTicketHistory",
      id_ticket: ticketId,
    },
    dataType: "json",
    success: function (response) {
      if (response.success && response.history && response.history.length > 0) {
        let historyHtml = '<div class="accordion" id="ticketHistoryAccordion">';

        response.history.forEach((item, index) => {
          const collapseId = `collapseHistoryItem_${ticketId}_${index}`;
          const headingId = `headingHistoryItem_${ticketId}_${index}`;

          const isLatest = index === 0;
          const isExpanded = false;

          const prevItem = response.history[index + 1] || {};

          const cleanString = (str) => str ? str.replace(/\s/g, ' ').trim() : null;

          const itemAccion = cleanString(item.name_accion_ticket);
          const itempago = cleanString(item.name_status_payment);
          const prevAccion = cleanString(prevItem.name_accion_ticket);
          const accionChanged = prevAccion && itemAccion !== prevAccion;

          const itemTecnico = cleanString(item.full_name_tecnico_n2_history);
          const prevTecnico = cleanString(prevItem.full_name_tecnico_n2_history);
          const tecnicoChanged = prevTecnico && itemTecnico !== prevTecnico;

          const itemStatusLab = cleanString(item.name_status_lab);
          const prevStatusLab = cleanString(prevItem.name_status_lab);
          const statusLabChanged = prevStatusLab && itemStatusLab !== prevStatusLab;

          const itemStatusDom = cleanString(item.name_status_domiciliacion);
          const prevStatusDom = cleanString(prevItem.name_status_domiciliacion);
          const statusDomChanged = prevStatusDom && itemStatusDom !== prevStatusDom;

          const itemStatusPayment = cleanString(item.name_status_payment);
          const prevStatusPayment = cleanString(prevItem.name_status_payment);
          const statusPaymentChanged = prevStatusPayment && itemStatusPayment !== prevStatusPayment;

          const itemStatusTicket = cleanString(item.name_status_ticket);
          const prevStatusTicket = cleanString(prevItem.name_status_ticket);
          const estatusTicketChanged = prevStatusTicket && itemStatusTicket !== prevStatusTicket;

          const itemComponents = cleanString(item.components_list);
          const prevComponents = cleanString(prevItem.components_list);
          const componentsChanged = prevComponents && itemComponents !== prevComponents;

          // --- NUEVO CÓDIGO PARA COMPARAR EL MOTIVO DE RECHAZO ---
          const itemMotivoRechazo = cleanString(item.name_motivo_rechazo);
          const prevMotivoRechazo = cleanString(prevItem.name_motivo_rechazo);
          const motivoRechazoChanged = prevMotivoRechazo && itemMotivoRechazo !== prevMotivoRechazo;

          const showComponents = itemAccion === 'Actualización de Componentes' && itemComponents;
          
          // --- LÓGICA CORREGIDA PARA MOSTRAR EL MOTIVO DE RECHAZO ---
          // Define los tipos de rechazo que activan la visualización del motivo.
          const rejectedActions = [
            'Documento de Exoneracion Rechazado',
            'Documento de Anticipo Rechazado',
            'Documento de Envio Rechazado'
          ];

          // La fila se mostrará solo si la acción del ticket coincide con una de las acciones de rechazo definidas.
          const showMotivoRechazo = rejectedActions.includes(itempago) && item.name_motivo_rechazo;

          // --- NUEVA LÓGICA PARA COMPONENTES ---
          // El componente se mostrará en negrita si:
          // 1. La acción cambió Y es "Actualización de Componentes" Y hay componentes
          // 2. Los componentes cambiaron Y hay componentes
          const shouldHighlightComponents = showComponents && (accionChanged || componentsChanged);

          let headerStyle = isLatest ? "background-color: #ffc107;" : "background-color: #5d9cec;";
          let textColor = isLatest ? "color: #343a40;" : "color: #ffffff;";
          const statusHeaderText = ` (${item.name_status_ticket || "Desconocido"})`;

          historyHtml += `
                        <div class="card mb-3 custom-history-card">
                            <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                        data-toggle="collapse" data-target="#${collapseId}"
                                        aria-expanded="${isExpanded}" aria-controls="${collapseId}"
                                        style="${textColor}">
                                        ${item.fecha_de_cambio} - ${item.name_accion_ticket}${statusHeaderText}
                                    </button>
                                </h2>
                            </div>
                            <div id="${collapseId}" class="collapse"
                                aria-labelledby="${headingId}" data-parent="#ticketHistoryAccordion">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <th class="text-start" style="width: 40%;">Fecha y Hora:</th>
                                                    <td>${item.fecha_de_cambio || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Acción:</th>
                                                    <td class="${accionChanged ? "highlighted-change" : ""}">${item.name_accion_ticket || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Operador de Gestión:</th>
                                                    <td>${item.full_name_tecnico_gestion || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td>${item.full_name_coordinador || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Tecnico Asignado:</th>
                                                    <td class="${tecnicoChanged ? "highlighted-change" : ""}">${item.full_name_tecnico_n2_history || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Ticket:</th>
                                                    <td class="${estatusTicketChanged ? "highlighted-change" : ""}">${item.name_status_ticket || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Laboratorio:</th>
                                                    <td class="${statusLabChanged ? "highlighted-change" : ""}">${item.name_status_lab || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Domiciliación:</th>
                                                    <td class="${statusDomChanged ? "highlighted-change" : ""}">${item.name_status_domiciliacion || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Pago:</th>
                                                    <td class="${statusPaymentChanged ? "highlighted-change" : ""}">${item.name_status_payment || "N/A"}</td>
                                                </tr>
                                                ${showComponents ? `
                                                    <tr>
                                                        <th class="text-start">Componentes Asociados:</th>
                                                        <td class="${shouldHighlightComponents ? "highlighted-change" : ""}">${item.components_list}</td>
                                                    </tr>
                                                ` : ''}
                                                ${showMotivoRechazo ? `
                                                  <tr>
                                                    <th class="text-start">Motivo Rechazo Documento:</th>
                                                    <td class="${statusPaymentChanged ? "highlighted-change" : ""}">${item.name_motivo_rechazo || "N/A"}</td>
                                                  </tr>
                                             ` : ''}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        });

        historyHtml += "</div>";
        historyPanel.html(historyHtml);
      } else {
        historyPanel.html('<p class="text-center text-muted">No hay historial disponible para este ticket.</p>');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error completo de AJAX:", {
        jqXHR: jqXHR,
        textStatus: textStatus,
        errorThrown: errorThrown,
      });
      let errorMessage = '<p class="text-center text-danger">Error al cargar el historial.</p>';
      if (jqXHR.status === 0) {
        errorMessage = '<p class="text-center text-danger">Error de red: No se pudo conectar al servidor.</p>';
      } else if (jqXHR.status == 404) {
        errorMessage = '<p class="text-center text-danger">Recurso no encontrado. (Error 404)</p>';
      } else if (jqXHR.status == 500) {
        errorMessage = '<p class="text-center text-danger">Error interno del servidor. (Error 500)</p>';
      } else if (textStatus === "parsererror") {
        errorMessage = '<p class="text-center text-danger">Error al procesar la respuesta del servidor (JSON inválido).</p>';
      } else if (textStatus === "timeout") {
        errorMessage = '<p class="text-center text-danger">Tiempo de espera agotado al cargar el historial.</p>';
      } else if (textStatus === "abort") {
        errorMessage = '<p class="text-center text-danger">Solicitud de historial cancelada.</p>';
      }
      historyPanel.html(errorMessage);
      console.error("Error AJAX:", textStatus, errorThrown, jqXHR.responseText);
    },
  });
}

function showApprovalModal(ticketId, documentType, filePath, mimeType, fileName, serialPos) {
  // Obtener elementos del modal de aprobación
  const imageApprovalModalElement = document.getElementById("imageApprovalModal");
  const currentTicketIdDisplay = document.getElementById("currentTicketIdDisplay");
  const currentImageTypeDisplay = document.getElementById("currentImageTypeDisplay");
  const currentDocumentNameDisplay = document.getElementById("currentNombreDocumento");
  const ticketImagePreview = document.getElementById("ticketImagePreview");
  const mediaViewerContainer = document.getElementById("mediaViewerContainer");
  const closeImageApprovalModalBtn = document.getElementById("closeImageApprovalModalBtn");
  const currentSerialDisplay = document.getElementById("currentSerialDisplay");
  const approveTicketFromImageBtn = document.getElementById("approveTicketFromImage");

  // Establecer información del ticket
  currentTicketIdDisplay.textContent = ticketId;
  currentImageTypeDisplay.textContent = documentType;
  currentDocumentNameDisplay.textContent = fileName || 'Sin nombre';
  currentSerialDisplay.textContent = serialPos || 'Sin posición';

  // Controlar la visibilidad del botón de aprobar basado en el tipo de documento
  if (approveTicketFromImageBtn) {
    const allowedTypes = ['Exoneracion', 'Anticipo']; // Tipos que permiten aprobación
    if (allowedTypes.includes(documentType)) {
      approveTicketFromImageBtn.style.display = 'block';
    } else {
      approveTicketFromImageBtn.style.display = 'none';
    }
  }

  // Función para limpiar la ruta del archivo
  function cleanFilePath(filePath) {
    if (!filePath) return null;

    // Reemplazar barras invertidas con barras normales
    let cleanPath = filePath.replace(/\\/g, '/');

    // Extraer la parte después de 'Documentos_SoportePost/'
    const pathSegments = cleanPath.split('Documentos_SoportePost/');
    if (pathSegments.length > 1) {
      cleanPath = pathSegments[1];
    }

    // Construir la URL completa
    return `http://localhost/Documentos/${cleanPath}`;
  }

  // Limpiar contenedor y mostrar imagen
  mediaViewerContainer.innerHTML = '';
  
  // Asegurarse de que la imagen esté disponible
  if (ticketImagePreview) {
    ticketImagePreview.style.display = "none";
    ticketImagePreview.src = "";
    ticketImagePreview.alt = "Vista previa del documento";
  }
  
  if (mimeType && mimeType.startsWith('image/')) {
    // Es una imagen
    const fullUrl = cleanFilePath(filePath);
    
    if (ticketImagePreview) {
      ticketImagePreview.src = fullUrl;
      ticketImagePreview.style.display = "block";
      mediaViewerContainer.appendChild(ticketImagePreview);
    }
  } else if (mimeType === 'application/pdf') {
    // Es un PDF
    if (ticketImagePreview) {
      ticketImagePreview.style.display = "none";
    }
    const pdfViewer = document.createElement('iframe');
    pdfViewer.src = cleanFilePath(filePath);
    pdfViewer.style.width = '100%';
    pdfViewer.style.height = '100%';
    pdfViewer.style.border = 'none';
    mediaViewerContainer.appendChild(pdfViewer);
  } else {
    // Tipo de archivo no soportado
    if (ticketImagePreview) {
      ticketImagePreview.style.display = "none";
    }
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `Tipo de archivo no soportado: ${mimeType}`;
    messageDiv.style.color = 'red';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.padding = '20px';
    mediaViewerContainer.appendChild(messageDiv);
  }

  // Mostrar el modal de aprobación
  const imageApprovalModal = new bootstrap.Modal(imageApprovalModalElement);
  
  // Agregar event listener para el botón de cerrar
  if (closeImageApprovalModalBtn) {
    // Remover listeners previos para evitar duplicados
    closeImageApprovalModalBtn.removeEventListener('click', closeModalHandler);
    closeImageApprovalModalBtn.addEventListener('click', closeModalHandler);
  }

  imageApprovalModal.show();

  // Función para cerrar el modal
  function closeModalHandler() {
    imageApprovalModal.hide();
  }

  // Agregar listener para cuando el modal se cierre
  imageApprovalModalElement.addEventListener('hidden.bs.modal', function() {
    // Limpiar el contenedor cuando se cierre el modal
    if (mediaViewerContainer) {
      mediaViewerContainer.innerHTML = '';
    }
    // Restaurar la imagen original
    if (ticketImagePreview) {
      ticketImagePreview.style.display = "none";
      ticketImagePreview.src = "";
      ticketImagePreview.alt = "Vista previa del documento";
    }
  }, { once: true }); // El { once: true } asegura que el listener se ejecute solo una vez
}