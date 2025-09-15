let currentSelectedTicket = null;
let currentTicketNroForImage = null;

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
        html: `${customWarningSvg}<p class="mt-3" id="textConfirm">¿Está seguro que desea aprobar el documento del ticket Nro <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> asociado al serial <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${serial}</span>?`,
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

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Aprobado!',
                        html: `El documento de  <span style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${documentType}</span> asociado al Nro Ticket <span style = "border-radius: 0.3rem; background-color: #e0f7fa; color: #007bff;">${nro_ticket}</span> ha sido aprobado correctamente.`,
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
    const id_user = document.getElementById("userId").value;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/reportes/tickets-pending-document-approval`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    const detailsPanel = document.getElementById("ticket-details-panel");
    const tableElement = document.getElementById("tabla-ticket");
    const theadElement = tableElement ? tableElement.getElementsByTagName("thead")[0] : null;
    const tbodyElement = tableElement ? tableElement.getElementsByTagName("tbody")[0] : null;
    const tableContainer = document.querySelector("#table-ticket-body");
    const viewDocumentsBtn = document.getElementById("viewDocumentsBtn");

    const columnTitles = {
        nro_ticket: "Nro Ticket",
        rif: "RIF",
        razonsocial_cliente: "Razón Social",
        serial_pos: "Serial POS",
        name_status_payment: "Estatus Pago",
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
                    currentTicketNroForImage = TicketData[0].nro_ticket;

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
                                    // --- NUEVO: AGREGAR RENDER PARA TRUNCAMIENTO ---
                                    render: function (data, type, row) {
                                        if (type === 'display' && data) {
                                            const displayLength = 25;
                                            const fullText = String(data);
                                            
                                            if (fullText.length > displayLength) {
                                                return `<span class="truncated-cell" data-full-text="${fullText.replace(/"/g, '&quot;')}">${fullText.substring(0, displayLength)}...</span>`;
                                            } else {
                                                return `<span class="expanded-cell" data-full-text="${fullText.replace(/"/g, '&quot;')}">${fullText}</span>`;
                                            }
                                        }
                                        return data || '';
                                    }
                                };
                                columnsConfig.push(columnDef);
                            }
                        }

                        // --- AÑADIR COLUMNA DE ACCIONES ---
                        // --- AÑADIR COLUMNA DE ACCIONES ---
                        columnsConfig.push({
                            data: null,
                            title: "Acciones",
                            orderable: false,
                            render: function (data, type, row) {
                                // Declara la variable actionButtons aquí, al inicio de la función
                                let actionButtons = '';

                                const idTicket = row.id_ticket;
                                const envio = row.envio;
                                const exoneracion = row.exoneracion;
                                const pago = row.pago;
                                const nro_ticket = row.nro_ticket;
                                const serial_pos = row.serial_pos;
                                
                                const documentType = row.document_type;
                                const originalFilename = row.original_filename;
                                const motivoRechazo = row.motivo_rechazo;
                                const uploadedAt = row.uploaded_at;
                                const idMotivoRechazo = row.id_motivo_rechazo;
                                const rechazado = row.documento_rechazado;
                                
                                const isRejected = idMotivoRechazo !== null && motivoRechazo !== null;
                                
                                if (row.name_status_payment === "Pendiente Por Cargar Documentos") {
                                    actionButtons = `<button class="btn btn-secondary btn-sm" title="Pendiente Por Cargar Documentos" disabled>Cargue Documentos</button>
                                                    <i class="fas fa-file-upload"></i>
                                                </button>`;
                                } else {
                                    actionButtons = `
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
                                            data-rechazado="${rechazado || ''}"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#visualizarImagenModal" 
                                            title="Visualizar Imágenes">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                        </svg>
                                    </button>
                                `;
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
                                }
                                return actionButtons;
                            },
                        });

                        const dataTableInstance = $(tableElement).DataTable({
                            responsive: false,
                            scrollX: "200px",
                            data: TicketData,
                            columns: columnsConfig,
                            order: [[1, 'desc']],
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
                                const api = this.api();

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
                                    $("#btn-por-asignar").removeClass("btn-primary").addClass("btn-secondary");
                                    $("#btn-asignados").removeClass("btn-primary").addClass("btn-secondary");
                                    $("#btn-recibidos").removeClass("btn-primary").addClass("btn-secondary");
                                    $(`#${activeButtonId}`).removeClass("btn-secondary").addClass("btn-primary");
                                }

                            // Función para verificar si hay datos en una búsqueda específica
                            function checkDataExists(searchTerm) {
                                api.columns().search('').draw(false);
                                api.column(5).search(searchTerm, true, false, true).draw();
                                const rowCount = api.rows({ filter: 'applied' }).count();
                                return rowCount > 0;
                            }

                            // Función para buscar automáticamente el primer botón con datos
                            function findFirstButtonWithData() {
                                const searchTerms = [
                                    { button: "btn-por-asignar", term: "Pago Anticipo Pendiente por Revision|Exoneracion Pendiente por Revision" },
                                    { button: "btn-recibidos", term: "Pendiente Por Cargar Documentos|Pendiente Por Cargar Documento\\(Pago anticipo o Exoneracion\\)|Pendiente Por Cargar Documento\\(PDF Envio ZOOM\\)" },
                                    { button: "btn-asignados", term: "Documento de Exoneracion Rechazado|Documento de Anticipo Rechazado|Documento de Envio Rechazado" }
                                ];

                                for (let i = 0; i < searchTerms.length; i++) {
                                    const { button, term } = searchTerms[i];
                                    
                                    if (checkDataExists(term)) {
                                        // Si hay datos, aplicar la búsqueda y activar el botón
                                        api.columns().search('').draw(false);
                                        api.column(5).search(term, true, false, true).draw();
                                        setActiveButton(button);

                                        // Lógica de visibilidad de columnas para la búsqueda automática
                                        if (button === "btn-por-asignar") {
                                            api.column(6).visible(false);
                                            api.column(7).visible(false);
                                            api.column(8).visible(false);
                                            api.column(9).visible(false);
                                        } else if (button === "btn-recibidos") {
                                            api.column(6).visible(false);
                                            api.column(7).visible(false);
                                            api.column(8).visible(false);
                                            api.column(9).visible(false);
                                        }else{
                                            api.column(6).visible(true);
                                            api.column(7).visible(true);    
                                            api.column(8).visible(true);
                                            api.column(9).visible(true);
                                        }
                                        return true; // Encontramos datos
                                    }
                                }
                                
                                // Si no hay datos en ningún botón, mostrar un mensaje
                                api.columns().search('').draw(false);
                                api.column(5).search("NO_DATA_FOUND").draw(); // Búsqueda que no devuelve resultados
                                setActiveButton("btn-por-asignar"); // Mantener el primer botón activo por defecto

                                const tbody = document.querySelector("#tabla-ticket tbody");
                                if (tbody) {
                                    tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">No hay tickets disponibles en ningún estado</td></tr>';
                                }
                                
                                return false;
                            }

                            // Ejecutar la búsqueda automática al inicializar
                            findFirstButtonWithData();

                            // Event listeners para los botones (mantener la funcionalidad manual)
                                $("#btn-por-asignar").on("click", function () {
                                if (checkDataExists("Pago Anticipo Pendiente por Revision|Exoneracion Pendiente por Revision")) {
                                    api.columns().search('').draw(false);
                                    api.column(6).visible(false);
                                    api.column(7).visible(false);
                                    api.column(8).visible(false);
                                    api.column(9).visible(false);
                                    api.column(5).search("Pago Anticipo Pendiente por Revision|Exoneracion Pendiente por Revision", true, false, true).draw();
                                    setActiveButton("btn-por-asignar");
                                } else {
                                    findFirstButtonWithData();
                                }
                                });

                                $("#btn-recibidos").on("click", function () {
                                if (checkDataExists("Pendiente Por Cargar Documentos|Pendiente Por Cargar Documento\\(Pago anticipo o Exoneracion\\)|Pendiente Por Cargar Documento\\(PDF Envio ZOOM\\)")) {
                                    api.columns().search('').draw(false);
                                    api.column(6).visible(false); // Se aseguran de que las columnas sean visibles
                                    api.column(7).visible(false); // Se aseguran de que las columnas sean visibless
                                    api.column(8).visible(false); // Se aseguran de que las columnas sean visibles
                                    api.column(9).visible(false);
                                    api.column(5).search("Pendiente Por Cargar Documentos|Pendiente Por Cargar Documento\\(Pago anticipo o Exoneracion\\)|Pendiente Por Cargar Documento\\(PDF Envio ZOOM\\)", true, false, true).draw();
                                    setActiveButton("btn-recibidos");
                                } else {
                                    findFirstButtonWithData();
                                }
                                });

                                $("#btn-asignados").on("click", function () {
                                if (checkDataExists("Documento de Exoneracion Rechazado|Documento de Anticipo Rechazado|Documento de Envio Rechazado")) {
                                    api.columns().search('').draw(false);
                                    api.column(6).visible(true); // Se aseguran de que las columnas sean visibles
                                    api.column(7).visible(true); // Se aseguran de que las columnas sean visibles
                                    api.column(8).visible(true); // Se aseguran de que las columnas sean visibles
                                    api.column(9).visible(true);
                                    api.column(5).search("Documento de Exoneracion Rechazado|Documento de Anticipo Rechazado|Documento de Envio Rechazado", true, false, true).draw();
                                    setActiveButton("btn-asignados");
                                } else {
                                    findFirstButtonWithData();
                                }
                                });
                            },
                        });

                        // --- NUEVO: EVENT LISTENER PARA TRUNCAMIENTO DE CELDAS ---
                        $("#tabla-ticket tbody")
                            .off("click", ".truncated-cell, .expanded-cell")
                            .on("click", ".truncated-cell, .expanded-cell", function (e) {
                                e.stopPropagation();
                                const $cellSpan = $(this);
                                const fullText = $cellSpan.data("full-text");
                                const displayLength = 25;

                                if ($cellSpan.hasClass("truncated-cell")) {
                                    // Si está truncado, expandirlo
                                    $cellSpan
                                        .removeClass("truncated-cell")
                                        .addClass("expanded-cell");
                                    $cellSpan.text(fullText);
                                } else if ($cellSpan.hasClass("expanded-cell")) {
                                    // Si está expandido, truncarlo (si es necesario)
                                    $cellSpan
                                        .removeClass("expanded-cell")
                                        .addClass("truncated-cell");

                                    if (fullText.length > displayLength) {
                                        $cellSpan.text(fullText.substring(0, displayLength) + "...");
                                    } else {
                                        $cellSpan.text(fullText);
                                    }
                                }
                            });

                        // Event listener para subir nuevo documento
                        $("#tabla-ticket tbody").on("click", ".upload-new-doc-btn", function () {
                            const ticketId = $(this).data("id");
                            const nroTicket = $(this).data("nro-ticket");
                            const serialPos = $(this).data("serial-pos");
                            const documentType = $(this).data("document-type");
                            const motivoRechazo = $(this).data("motivo-rechazo");
                            
                            showUploadNewDocumentModal(ticketId, nroTicket, serialPos, documentType, motivoRechazo);
                        });

                        // Event listener para filas de la tabla
                        $("#tabla-ticket tbody")
                            .off("click", "tr")
                            .on("click", "tr", function (e) {
                                if ($(e.target).hasClass('truncated-cell') || $(e.target).hasClass('expanded-cell') || $(e.target).is('button') || $(e.target).is('svg') || $(e.target).is('path') || $(e.target).is('input[type="checkbox"]')) {
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
                                    loadTicketHistory(ticketId, currentTicketNroForImage);
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
                            const documentoRechazado = $(this).data("rechazado");
                            
                            const envioValor = $(this).data("envio");
                            const exoValor = $(this).data("exoneracion");
                            const pagoValor = $(this).data("anticipo");

                            if (envioValor === 'No' && exoValor === 'No' && pagoValor === 'No') {
                                Swal.fire({
                                    title: 'No hay imagen disponible',
                                    text: 'El ticket no posee imagen en el sistema.',
                                    icon: 'info',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#003594',
                                    color: 'black'
                                });
                                return; 
                            }

                            currentTicketIdForImage = ticketId;
                            currentTicketNroForImage = nroTicket;
                            currentTicketSerialForImage = serialPos;

                            const VizualizarImage = document.getElementById('visualizarImagenModal');
                            VizualizarImage.setAttribute('data-ticket-id', nroTicket);
                            VizualizarImage.setAttribute('data-serial-pos', serialPos);
                            VizualizarImage.setAttribute('data-rechazado', documentoRechazado);
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
                                    visualizarImagenModal.hide();
                                });
                            }

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
                            
                            if (envioValor === 'Sí') {
                                EnvioInputModal.checked = true;
                            } else if (exoValor === 'Sí') {
                                ExoInputModal.checked = true;
                            } else if (pagoValor === 'Sí') {
                                PagoInputModal.checked = true;
                            }

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
                tableContainer.innerHTML = `<tr>
        <td colspan="14" class="text-center text-muted py-5">
          <div class="d-flex flex-column align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
              <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
            <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
            <p class="text-muted mb-0">No hay tickets para aprobar documentos en este momento.</p>
          </div>
        </td>
      </tr>`
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

    // LIMPIAR TODOS LOS RADIO BUTTONS PRIMERO
    const radioButtons = document.querySelectorAll('input[name="opcionImagen"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });

    // SELECCIONAR AUTOMÁTICAMENTE EL DOCUMENTO CORRECTO (NO ENVIO)
    if (documentType && documentType !== 'Envio') {
        // Si el documento rechazado es Exoneracion, seleccionar Exoneracion
        if (documentType === 'Exoneracion') {
            const radioExoneracion = document.getElementById('imagenExoneracion');
            if (radioExoneracion) {
                radioExoneracion.checked = true;
            }
        }
        // Si el documento rechazado es Anticipo, seleccionar Anticipo
        else if (documentType === 'Anticipo') {
            const radioPago = document.getElementById('imagenPago');
            if (radioPago) {
                radioPago.checked = true;
            }
        }
    } else {
        // Si no hay documentoType o es Envio, seleccionar Exoneracion por defecto
        const radioExoneracion = document.getElementById('imagenExoneracion');
        if (radioExoneracion) {
            radioExoneracion.checked = true;
        }
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
        <div class="alert mb-3" id="CartWrong" role="alert" style="background: linear-gradient(135deg, #6f42c1, #007bff); color: white; border: none;">
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
    };

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
        
        // LIMPIAR RADIO BUTTONS AL CERRAR
        const radioButtons = document.querySelectorAll('input[name="opcionImagen"]');
        radioButtons.forEach(radio => {
            radio.checked = false;
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const visualizarImagenModalElement = document.getElementById('visualizarImagenModal');
    const closeImagevisualizarModalBtn = document.getElementById('closeImagevisualizarModalBtn');
    const btnVisualizarImagen = document.getElementById('btnVisualizarImagen');
      
    const ticketImagePreview = document.getElementById('ticketImagePreview'); // El elemento img
    const mediaViewerContainer = document.getElementById('mediaViewerContainer'); // El div contenedor
    const botonCerrarmotivo = document.getElementById('CerrarModalMotivoRechazo');

    const currentTicketIdDisplay = document.getElementById('currentTicketIdDisplay');
    const currentImageTypeDisplay = document.getElementById('currentImageTypeDisplay');
    const approveTicketFromImage = document.getElementById('approveTicketFromImage');
    
    const rechazoDocumentoBtn = document.getElementById('RechazoDocumento');
    const modalConfirmacionRechazoBtn = document.getElementById('modalConfirmacionRechazoBtn');
   const confirmarRechazoModal = new bootstrap.Modal(document.getElementById('modalConfirmacionRechazo'), {keyboard: false});


    const modalRechazoInstance = new bootstrap.Modal(document.getElementById('modalRechazo'));

      // Instancias de Bootstrap Modal
    const visualizarImagenModal = new bootstrap.Modal(visualizarImagenModalElement);

    // 1. Manejar el evento de clic en el botón "Rechazar Documento"
    // La lógica es: cerrar el modal actual y luego abrir el nuevo.
    if (rechazoDocumentoBtn) {
        rechazoDocumentoBtn.addEventListener('click', function () {
        // Cierra el modal de visualización
        visualizarImagenModal.hide();

        // Abre el modal de rechazo
        modalRechazoInstance.show();
        });
    }

    if(modalConfirmacionRechazoBtn){
        modalConfirmacionRechazoBtn.addEventListener('click', function () {
        confirmarRechazoModal.hide();
        });
    }

    document.getElementById("confirmarRechazoBtn").addEventListener("click", function() {
        // Opcional: Obtén el texto del motivo seleccionado para mostrarlo en el modal
        const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");
        const motivoSeleccionadoTexto = motivoRechazoSelect.options[motivoRechazoSelect.selectedIndex].text;


        document.getElementById("motivoSeleccionadoTexto").textContent = motivoSeleccionadoTexto;
    });

    if (botonCerrarmotivo) {
        botonCerrarmotivo.addEventListener('click', function () {
        // Ocultar el modal de rechazo
        modalRechazoInstance.hide();
        })
    }

    // Evento click para el botón "Confirmar Rechazo"
  $("#confirmarRechazoBtn").off("click").on("click", function() {
    const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");

    if (!motivoRechazoSelect.value) {
      // Si no hay motivo seleccionado, muestra una alerta de SweetAlert2
      Swal.fire({
        icon: 'warning',
        title: 'No puede haber campos vacíos.',
        text: `Seleccione un motivo de rechazo.`,
        confirmButtonText: 'Ok',
        color: 'black',
        confirmButtonColor: '#003594'
      });
    } else {
      const motivoSeleccionadoTexto = motivoRechazoSelect.options[motivoRechazoSelect.selectedIndex].text;
      document.getElementById("motivoSeleccionadoTexto").textContent = motivoSeleccionadoTexto;
      confirmarRechazoModal.show();
    }
  });
  

    // Event listener para el botón "Aprobar Documento"
    btnVisualizarImagen.addEventListener('click', function() {
        const selectedOption = document.querySelector('input[name="opcionImagen"]:checked').value;
        const ticketId = visualizarImagenModalElement.getAttribute('data-ticket-id');
        const serialPos = visualizarImagenModalElement.getAttribute('data-serial-pos');
        const documentoRechazado = visualizarImagenModalElement.getAttribute('data-rechazado'); // AGREGAR ESTA LÍNEA

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
                        showApprovalModal(ticketId, selectedOption, filePath, mimeType, fileName, serialPos, documentoRechazado);
                        getMotivos(selectedOption);

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

const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");

// Crea una instancia del modal de confirmación de rechazo (si no lo has hecho ya)
const confirmarRechazoModal = new bootstrap.Modal(document.getElementById('modalConfirmacionRechazo'));

// Evento para el botón de confirmar la acción de rechazo dentro del modal
document.getElementById('btnConfirmarAccionRechazo').addEventListener('click', function () {
    const ticketId = currentTicketIdForImage; // Usamos el ID del ticket actual
    const nroticket = currentTicketNroForImage; // Usamos el número de ticket actual
    const motivoId = motivoRechazoSelect.value; // Obtenemos el ID del motivo seleccionado
    const id_user = document.getElementById('userId').value; // Obtenemos el ID del usuario
    const documentType = DocumentType; // Aquí usamos la variable global


    // Opcional: Cerrar el modal de confirmación mientras se procesa la solicitud
    confirmarRechazoModal.hide();

    // Verificación final para asegurar que tenemos los datos necesarios
    if (!ticketId || !motivoId || !nroticket || !id_user || !documentType) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Datos incompletos para el rechazo.',
            confirmButtonColor: '#003594'
        });
        return;
    }

    const xhr = new XMLHttpRequest();
    const datos = `action=rechazarDocumento&ticketId=${encodeURIComponent(ticketId)}&motivoId=${encodeURIComponent(motivoId)}&nroTicket=${encodeURIComponent(nroticket)}&id_user=${encodeURIComponent(id_user)}&documentType=${encodeURIComponent(documentType)}`; // Ajusta los datos a tu script de backend
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/rechazarDocumento`); // Ajusta la URL a tu script de backend
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                     (function sendRejectionEmails() {
                    try {
                      const xhrEmail = new XMLHttpRequest();
                      xhrEmail.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/email/send_reject_document`);
                      xhrEmail.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                      xhrEmail.onload = function () {
                        if (xhrEmail.status === 200) {
                          try {
                            const responseEmail = JSON.parse(xhrEmail.responseText);
                            if (responseEmail.success) {
                              console.log('Correo rechazo enviado:', responseEmail.message || 'OK');
                            } else {
                              console.error('Error correo rechazo:', responseEmail.message);
                            }
                          } catch (e) {
                            console.error('Error parseando respuesta correo rechazo:', e, xhrEmail.responseText);
                          }
                        } else {
                          console.error('Error HTTP correo rechazo:', xhrEmail.status, xhrEmail.responseText);
                        }
                      };

                      xhrEmail.onerror = function () {
                        console.error('Error de red al enviar correo de rechazo');
                      };
                      // Parámetros necesarios para PHP
                      const params =  `action=send_reject_document&id_user=${encodeURIComponent(id_user)}&documentType=${encodeURIComponent(documentType)}`

                      xhrEmail.send(params);
                    } catch (err) {
                      console.error('Fallo al disparar correo rechazo:', err);
                    }
                  })();
                    Swal.fire({
                        icon: 'success',
                        title: '¡Rechazado!',
                        text: response.message,
                        confirmButtonColor: '#003594',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        keydownListenerCapture: true,
                        color: 'black'
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message,
                        confirmButtonColor: '#003594'
                    });
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Respuesta del servidor no válida.',
                    confirmButtonColor: '#003594'
                });
            }
        } else {
            console.error("Error:", xhr.status, xhr.statusText);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un problema al conectar con el servidor.',
                confirmButtonColor: '#003594'
            });
        }
    };
    xhr.onerror = function () {
        console.error("Error de red");
        Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'Verifique su conexión a internet.',
            confirmButtonColor: '#003594'
        });
    };
    xhr.send(datos);
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

function downloadImageModal(serial) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPhotoDashboard`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        //console.log(response);
        if (response.success) {
          const srcImagen = response.rutaImagen;
          const claseImagen = response.claseImagen; // Obtener la clase CSS
          const imgElement = document.getElementById("device-ticket-image");
            if (imgElement) {
            imgElement.src = srcImagen;
            imgElement.className = claseImagen; // Aplicar la clase CSS
          } else {
            console.error("No se encontró el elemento img en el modal.");
          }
          if (imgElement) {
            imgElement.src = rutaImagen;
                        imgElement.className = claseImagen; // Aplicar la clase CSS

          } else {
            console.error("No se encontró el elemento img en el modal.");
          }
        } else {
          console.error("Error al obtener la imagen:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    console.error("Error de red");
  };

  const datos = `action=GetPhotoDashboard&serial=${encodeURIComponent(serial)}`;
  xhr.send(datos);
}

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
                      <img id="device-ticket-image" src="${initialImageUrl}" alt="${initialImageAlt}">
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
                          ${d.fecha_instalacion || 'No posee'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Fecha último ticket:</div></strong>
                          ${d.fecha_cierre_anterior || 'No posee'}
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

// Función para cargar y mostrar el historial de tickets.// Función para cargar el historial de un ticket
function loadTicketHistory(ticketId, currentTicketNroForImage) {
    const historyPanel = $("#ticket-history-content");
    historyPanel.html('<p class="text-center text-muted">Cargando historial...</p>');

    const parseCustomDate = (dateStr) => {
        const parts = dateStr.split(' ');
        if (parts.length !== 2) return null;
        const [day, month, year] = parts[0].split('-');
        const [hours, minutes] = parts[1].split(':');
        return new Date(year, month - 1, day, hours, minutes);
    };

    const calculateTimeElapsed = (startDateStr, endDateStr) => {
        if (!startDateStr || !endDateStr) return null;

        const start = parseCustomDate(startDateStr);
        const end = parseCustomDate(endDateStr);

        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            return null;
        }

        const diffMs = end - start;
        if (diffMs <= 0) {
            return null;
        }

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30.44);

        const calculateBusinessDays = (startDateObj, endDateObj) => {
            const holidays2025 = [
                '2025-01-01', '2025-01-06', '2025-02-17', '2025-02-18', '2025-03-24', '2025-03-25', '2025-03-26', '2025-03-27', '2025-03-28', '2025-04-19', '2025-05-01', '2025-06-24', '2025-07-05', '2025-07-24', '2025-10-12', '2025-12-25'
            ];
            let businessDays = 0;
            const current = new Date(startDateObj);
            const end = new Date(endDateObj);

            while (current <= end) {
                const dayOfWeek = current.getDay();
                const dateString = current.toISOString().split('T')[0];
                if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holidays2025.includes(dateString)) {
                    businessDays++;
                }
                current.setDate(current.getDate() + 1);
            }
            return businessDays;
        };

        const businessDays = calculateBusinessDays(start, end);
        let timeText = '';

        if (diffMonths > 0) {
            const remainingDays = diffDays % 30.44;
            timeText = `${diffMonths}M ${Math.floor(remainingDays)}D`;
        } else if (diffWeeks > 0) {
            const remainingDays = diffDays % 7;
            timeText = `${diffWeeks}W ${remainingDays}D`;
        } else if (diffDays > 0) {
            const remainingHours = diffHours % 24;
            const remainingMinutes = diffMinutes % 60;
            timeText = `${diffDays}D ${remainingHours}H ${remainingMinutes}M`;
        } else if (diffHours > 0) {
            const remainingMinutes = diffMinutes % 60;
            timeText = `${diffHours}H ${remainingMinutes}M`;
        } else if (diffMinutes > 0) {
            timeText = `${diffMinutes}M`;
        } else {
            return null;
        }

        return {
            text: timeText,
            ms: diffMs,
            minutes: diffMinutes,
            hours: diffHours,
            days: diffDays,
            weeks: diffWeeks,
            months: diffMonths,
            businessDays: businessDays
        };
    };

    $.ajax({
        url: `${ENDPOINT_BASE}${APP_PATH}api/historical/GetTicketHistory`,
        type: "POST",
        data: {
            action: "GetTicketHistory",
            id_ticket: ticketId,
        },
        dataType: "json",
        success: function(response) {
            if (response.success && response.history && response.history.length > 0) {
                let historyHtml = `
                    <div class="d-flex justify-content-end mb-2">
                        <button class="btn btn-secondary" onclick="printHistory('${ticketId}', '${encodeURIComponent(JSON.stringify(response.history))}', '${currentTicketNroForImage}')">
                            <i class="fas fa-print"></i> Imprimir Historial
                        </button>
                    </div>
                    <div class="accordion" id="ticketHistoryAccordion">
                `;

                response.history.forEach((item, index) => {
                    const collapseId = `collapseHistoryItem_${ticketId}_${index}`;
                    const headingId = `headingHistoryItem_${ticketId}_${index}`;
                    const isLatest = index === 0;
                    const prevItem = response.history[index + 1] || {};

                    let timeElapsed = null;
                    let timeBadge = '';

                    if (prevItem.fecha_de_cambio && item.fecha_de_cambio) {
                        timeElapsed = calculateTimeElapsed(prevItem.fecha_de_cambio, item.fecha_de_cambio);
                        if (timeElapsed) {
                            let badgeColor = 'success';
                            if (timeElapsed.months > 0 || timeElapsed.businessDays > 5) {
                                badgeColor = 'danger';
                            } else if (timeElapsed.weeks > 0 || timeElapsed.businessDays > 2) {
                                badgeColor = 'warning';
                            } else if (timeElapsed.days > 0 || timeElapsed.hours > 8) {
                                badgeColor = 'orange';
                            } else if (timeElapsed.hours >= 1) {
                                badgeColor = 'purple';
                            }

                            let backgroundColor = '#28a745';
                            if (badgeColor === 'purple') backgroundColor = '#6f42c1';
                            else if (badgeColor === 'orange') backgroundColor = '#fd7e14';
                            else if (badgeColor === 'warning') backgroundColor = '#ffc107';
                            else if (badgeColor === 'danger') backgroundColor = '#dc3545';

                            timeBadge = `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; cursor: pointer; background-color: ${backgroundColor} !important; color: white !important;" title="Click para ver agenda" onclick="showElapsedLegend(event)">${timeElapsed.text}</span>`;
                        }
                    }
                    
                    const cleanString = (str) => str && str.replace(/\s/g, ' ').trim() || null;
                    const getChange = (itemVal, prevVal) => (cleanString(itemVal) !== cleanString(prevVal));

                    const isCreation = cleanString(item.name_accion_ticket) === 'Ticket Creado';
                    const creationBadge = isCreation && item.fecha_de_cambio ? 
                        `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; cursor: help; background-color: #17a2b8 !important; color: white !important;" title="Fecha de creación">${item.fecha_de_cambio}</span>` : '';

                    const accionChanged = getChange(item.name_accion_ticket, prevItem.name_accion_ticket);
                    const coordChanged = getChange(item.full_name_coordinador, prevItem.full_name_coordinador);
                    const usuarioGestionChanged = getChange(item.usuario_gestion, prevItem.usuario_gestion);
                    const tecnicoChanged = getChange(item.full_name_tecnico_n2_history, prevItem.full_name_tecnico_n2_history);
                    const statusLabChanged = getChange(item.name_status_lab, prevItem.name_status_lab);
                    const statusDomChanged = getChange(item.name_status_domiciliacion, prevItem.name_status_domiciliacion);
                    const statusPaymentChanged = getChange(item.name_status_payment, prevItem.name_status_payment);
                    const estatusTicketChanged = getChange(item.name_status_ticket, prevItem.name_status_ticket);
                    const componentsChanged = getChange(item.components_list, prevItem.components_list);
                    const motivoRechazoChanged = getChange(item.name_motivo_rechazo, prevItem.name_motivo_rechazo);
                    const pagoChanged = getChange(item.pago, prevItem.pago);
                    const exoneracionChanged = getChange(item.exoneracion, prevItem.exoneracion);
                    const envioChanged = getChange(item.envio, prevItem.envio);
                    const envioDestinoChanged = getChange(item.envio_destino, prevItem.envio_destino);

                    const showComponents = cleanString(item.name_accion_ticket) === 'Actualización de Componentes' && cleanString(item.components_list);
                    const shouldHighlightComponents = showComponents && (accionChanged || componentsChanged);

                    const rejectedActions = ['Documento de Exoneracion Rechazado', 'Documento de Anticipo Rechazado'];
                    const showMotivoRechazo = rejectedActions.includes(cleanString(item.name_status_payment)) && cleanString(item.name_motivo_rechazo);

                    const showCommentDevolution = cleanString(item.name_accion_ticket) === 'En espera de Confirmar Devolución' && cleanString(item.comment_devolution) && cleanString(item.envio_destino) !== 'Sí';
                    const showCommentReasignation = cleanString(item.name_accion_ticket) === 'Reasignado al Técnico' && cleanString(item.comment_reasignation);

                    const headerStyle = isLatest ? "background-color: #ffc107;" : "background-color: #5d9cec;";
                    const textColor = isLatest ? "color: #343a40;" : "color: #ffffff;";

                    let statusHeaderText = cleanString(item.name_status_ticket) || "Desconocido";
                    if (cleanString(item.name_accion_ticket) === "Enviado a taller" || cleanString(item.name_accion_ticket) === "En Taller") {
                        statusHeaderText = cleanString(item.name_status_lab) || "Desconocido";
                    }

                    // Se define el texto del botón aquí con la condición ternaria
                    const buttonText = isCreation
                        ? `${cleanString(item.name_accion_ticket) || "N/A"} (${statusHeaderText})`
                        : `${item.fecha_de_cambio || "N/A"} - ${cleanString(item.name_accion_ticket) || "N/A"} (${statusHeaderText})`;

                    historyHtml += `
                        <div class="card mb-3 custom-history-card position-relative">
                            <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                ${creationBadge}
                                ${timeBadge}
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                        data-toggle="collapse" data-target="#${collapseId}"
                                        aria-expanded="false" aria-controls="${collapseId}"
                                        style="${textColor}">
                                        ${buttonText}
                                    </button>
                                </h2>
                            </div>
                            <div id="${collapseId}" class="collapse" aria-labelledby="${headingId}" data-parent="#ticketHistoryAccordion">
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
                                                    <td class="${accionChanged ? "highlighted-change" : ""}">${cleanString(item.name_accion_ticket) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Operador Ticket:</th>
                                                    <td>${cleanString(item.operador_ticket) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Usuario Gestión:</th>
                                                    <td class="${usuarioGestionChanged ? "highlighted-change" : ""}">${cleanString(item.usuario_gestion) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinador:</th>
                                                    <td class="${coordChanged ? "highlighted-change" : ""}">${cleanString(item.full_name_coordinador) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Coordinación:</th>
                                                    <td>${cleanString(item.nombre_coordinacion) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Técnico Asignado:</th>
                                                    <td class="${tecnicoChanged ? "highlighted-change" : ""}">
                                                        ${cleanString(item.full_name_tecnico_n2_history) || "Pendiente por Asignar"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Ticket:</th>
                                                    <td class="${estatusTicketChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_ticket) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Laboratorio:</th>
                                                    <td class="${statusLabChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_lab) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Domiciliación:</th>
                                                    <td class="${statusDomChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_domiciliacion) || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th class="text-start">Estatus Pago:</th>
                                                    <td class="${statusPaymentChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_payment) || "N/A"}</td>
                                                </tr>
                                                ${showComponents ? `
                                                    <tr>
                                                        <th class="text-start">Componentes Asociados:</th>
                                                        <td class="${shouldHighlightComponents ? "highlighted-change" : ""}">${cleanString(item.components_list)}</td>
                                                    </tr>
                                                ` : ''}
                                                ${showMotivoRechazo ? `
                                                    <tr>
                                                        <th class="text-start">Motivo Rechazo Documento:</th>
                                                        <td class="${motivoRechazoChanged ? "highlighted-change" : ""}">${cleanString(item.name_motivo_rechazo) || "N/A"}</td>
                                                    </tr>
                                                ` : ''}
                                                ${showCommentDevolution ? `
                                                    <tr>
                                                        <th class="text-start">Comentario de Devolución:</th>
                                                        <td class="highlighted-change">${cleanString(item.comment_devolution) || "N/A"}</td>
                                                    </tr>
                                                ` : ''}
                                                ${showCommentReasignation ? `
                                                    <tr>
                                                        <th class="text-start">Comentario de Reasignación:</th>
                                                        <td class="highlighted-change">${cleanString(item.comment_reasignation) || "N/A"}</td>
                                                    </tr>
                                                ` : ''}
                                                ${cleanString(item.pago) === 'Sí' ? `
                                                    <tr>
                                                        <th class="text-start">Documento de Pago:</th>
                                                        <td class="${pagoChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                    </tr>
                                                ` : ''}
                                                ${cleanString(item.exoneracion) === 'Sí' ? `
                                                    <tr>
                                                        <th class="text-start">Documento de Exoneración:</th>
                                                        <td class="${exoneracionChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                    </tr>
                                                ` : ''}
                                                ${cleanString(item.envio) === 'Sí' ? `
                                                    <tr>
                                                        <th class="text-start">Documento de Envío:</th>
                                                        <td class="${envioChanged ? "highlighted-change" : ""}">✓ Cargado</td>
                                                    </tr>
                                                ` : ''}
                                                ${cleanString(item.envio_destino) === 'Sí' ? `
                                                    <tr>
                                                        <th class="text-start">Documento de Envío a Destino:</th>
                                                        <td class="${envioDestinoChanged ? "highlighted-change" : ""}">✓ Cargado</td>
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
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error completo de AJAX:", { jqXHR, textStatus, errorThrown });
            let errorMessage = '<p class="text-center text-danger">Error al cargar el historial.</p>';
            if (jqXHR.status === 0) {
                errorMessage = '<p class="text-center text-danger">Error de red: No se pudo conectar al servidor.</p>';
            } else if (jqXHR.status == 404) {
                errorMessage = `<div class="text-center text-muted py-5">
                    <div class="d-flex flex-column align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#6c757d" class="bi bi-inbox mb-3" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.196L1.302 8.83l-.046.486A2 2 0 0 0 4.018 11h7.964a2 2 0 0 0 1.762-1.766l-.046-.486L11.02 4.196A.5.5 0 0 0 10.63 4H4.98zm3.072 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                        <h5 class="text-muted mb-2">Sin Datos Disponibles</h5>
                        <p class="text-muted mb-0">No hay datos en el historial.</p>
                    </div>
                </div>`;
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

function printHistory(ticketId, historyEncoded, currentTicketNroForImage) {
    const decodeHistorySafe = (encoded) => {
        try {
            if (!encoded) return [];
            return JSON.parse(decodeURIComponent(encoded));
        } catch (e) {
            console.error('Error decoding history:', e);
            return [];
        }
    };

    const cleanString = (str) => (typeof str === 'string' ? str.replace(/\s/g, ' ').trim() : (str ?? ''));

    const parseCustomDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = String(dateStr).split(' ');
        if (parts.length !== 2) return null;
        const [day, month, year] = parts[0].split('-');
        const [hours, minutes] = parts[1].split(':');
        const d = new Date(year, (Number(month) || 1) - 1, Number(day) || 1, Number(hours) || 0, Number(minutes) || 0);
        return isNaN(d.getTime()) ? null : d;
    };

    const calculateTimeElapsed = (startDateStr, endDateStr) => {
        if (!startDateStr || !endDateStr) return null;
        const start = parseCustomDate(startDateStr);
        const end = parseCustomDate(endDateStr);
        if (!start || !end) return null;
        const diffMs = end - start;
        if (diffMs <= 0) return null;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30.44);
        let text = '';
        if (diffMonths > 0) {
            const remainingDays = Math.floor(diffDays % 30.44);
            text = `${diffMonths}M ${remainingDays}D`;
        } else if (diffWeeks > 0) {
            text = `${diffWeeks}W ${diffDays % 7}D`;
        } else if (diffDays > 0) {
            text = `${diffDays}D ${diffHours % 24}H ${diffMinutes % 60}M`;
        } else if (diffHours > 0) {
            text = `${diffHours}H ${diffMinutes % 60}M`;
        } else {
            // Si es menos de 1 minuto, mostrar N/A según requerimiento de impresión
            text = `N/A`;
        }
        return { text, ms: diffMs, minutes: diffMinutes, hours: diffHours, days: diffDays, weeks: diffWeeks, months: diffMonths };
    };

    const history = decodeHistorySafe(historyEncoded);

    let itemsHtml = '';
    history.forEach((item, index) => {
        const previous = history[index + 1] || null;
        const elapsed = previous ? calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio) : null;
        const elapsedText = elapsed ? elapsed.text : 'N/A';

        itemsHtml += `
            <div style="border: 1px solid #ddd; border-radius: 6px; margin: 10px 0; padding: 12px;">
                <div style="font-weight: bold; color: #003594; margin-bottom: 6px;">${cleanString(item.fecha_de_cambio) || 'N/A'} - ${cleanString(item.name_accion_ticket) || 'N/A'} (${cleanString(item.name_status_ticket) || 'N/A'})</div>
                <table style="width:100%; border-collapse: collapse; font-size: 12px;">
                    <tbody>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Ticket</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.nro_ticket) || nro_ticket}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Acción</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_accion_ticket) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Ticket</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_ticket) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Fecha Cambio</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.fecha_de_cambio) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Tiempo desde gestión anterior</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${elapsedText}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Coordinador</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.full_name_coordinador) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Coordinación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.nombre_coordinacion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Operador Ticket (Técnico N1)</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.operador_ticket) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Usuario Gestión</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.usuario_gestion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Rol en Gestión</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.full_name_tecnico_gestion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Técnico Asignado (N2)</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.full_name_tecnico_n2_history) || 'No Asignado'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Laboratorio</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_lab) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Domiciliación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_domiciliacion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Pago</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_payment) || 'N/A'}</td></tr>
                        ${cleanString(item.components_list) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Componentes</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.components_list)}</td></tr>` : ''}
                        ${cleanString(item.name_motivo_rechazo) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Motivo Rechazo</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.name_motivo_rechazo)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Pago</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.pago) || 'No'}</td></tr>
                        ${cleanString(item.pago_fecha) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Pago Fecha</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.pago_fecha)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Exoneración</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.exoneracion) || 'No'}</td></tr>
                        ${cleanString(item.exoneracion_fecha) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Exoneración Fecha</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.exoneracion_fecha)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Envío</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.envio) || 'No'}</td></tr>
                        ${cleanString(item.envio_fecha) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Envío Fecha</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.envio_fecha)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Envío a Destino</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.envio_destino) || 'No'}</td></tr>
                        ${cleanString(item.envio_destino_fecha) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Envío Destino Fecha</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.envio_destino_fecha)}</td></tr>` : ''}
                        ${cleanString(item.comment_devolution) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Comentario Devolución</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.comment_devolution)}</td></tr>` : ''}
                        ${cleanString(item.comment_reasignation) ? `<tr><td style=\"padding:4px; border-bottom:1px solid #eee;\"><strong>Comentario Reasignación</strong></td><td style=\"padding:4px; border-bottom:1px solid #eee;\">${cleanString(item.comment_reasignation)}</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        `;
    });

    const printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="text-align:center;">
                <h2 style="color: #003594; margin-bottom: 6px;">Historial del Ticket</h2>
                <p style="margin: 0 0 8px 0;"><strong>Ticket Nro:</strong> ${currentTicketNroForImage}</p>
                <p style="margin: 0 0 14px 0; color: #555;">Fecha de Impresión: ${new Date().toLocaleString()}</p>
                <p style="margin: 0 0 14px 0; color: #6c757d; font-size: 12px;">Nota: En la columna "Tiempo desde gestión anterior" con un valor "N/A" indica que la gestión se realizó en menos de 1 minuto.</p>
            </div>
            ${itemsHtml || '<p style="text-align:center; color:#666;">Sin historial disponible.</p>'}
        </div>
    `;

    const printWindow = window.open('', '', 'height=800,width=1024');
    printWindow.document.write('<html><head><title>Historial del Ticket</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000; }');
    printWindow.document.write('h2 { color: #003594; }');
    printWindow.document.write('@media print { body { -webkit-print-color-adjust: exact; } }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

function showElapsedLegend(e) {
    try { if (e && e.stopPropagation) e.stopPropagation(); } catch (_) {}
    const legendHtml = `
        <div style="font-size: 0.95rem; text-align: left;">
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#28a745; color:#fff; min-width:64px;">Verde</span><span class="ml-2">Menos de 1 hora</span></div>
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#6f42c1; color:#fff; min-width:64px;">Morado</span><span class="ml-2">Entre 1 y 8 horas</span></div>
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#fd7e14; color:#fff; min-width:64px;">Naranja</span><span class="ml-2">Más de 8 horas o al menos 1 día</span></div>
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#ffc107; color:#212529; min-width:64px;">Amarillo</span><span class="ml-2">Una semana o más, o más de 2 días hábiles</span></div>
            <div class="d-flex align-items-center"><span class="badge" style="background-color:#dc3545; color:#fff; min-width:64px;">Rojo</span><span class="ml-2">Un mes o más, o más de 5 días hábiles</span></div>
        </div>`;

    Swal.fire({
        title: 'Agenda de colores',
        html: legendHtml,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#003594',
        color: 'black',
        width: 520,
    });
}

function showApprovalModal(ticketId, documentType, filePath, mimeType, fileName, serialPos, documentoRechazado) {
    // Obtener elementos del modal de aprobación
    const imageApprovalModalElement = document.getElementById("imageApprovalModal");
    const currentTicketIdDisplay = document.getElementById("currentTicketIdDisplay");
    const currentImageTypeDisplay = document.getElementById("currentImageTypeDisplay");
    const currentDocumentNameDisplay = document.getElementById("currentNombreDocumento");
    const ticketImagePreview = document.getElementById("ticketImagePreview");
  const pdfViewViewer = document.getElementById("pdfViewViewer");
    const mediaViewerContainer = document.getElementById("mediaViewerContainer");
    const closeImageApprovalModalBtn = document.getElementById("closeImageApprovalModalBtn");
    const currentSerialDisplay = document.getElementById("currentSerialDisplay");
    const approveTicketFromImageBtn = document.getElementById("approveTicketFromImage");

    // LIMPIEZA COMPLETA Y FORZADA
    if (mediaViewerContainer) {
        // Remover todos los elementos hijos excepto los elementos fijos
        const elementsToKeep = [ticketImagePreview, pdfViewViewer];
        const elementsToRemove = [];
        
        for (let child of mediaViewerContainer.children) {
            if (!elementsToKeep.includes(child)) {
                elementsToRemove.push(child);
            }
        }
        
        elementsToRemove.forEach(element => {
            mediaViewerContainer.removeChild(element);
        });
    }
    
    // Resetear completamente la imagen y el PDF viewer
    if (ticketImagePreview) {
        ticketImagePreview.style.display = "none";
        ticketImagePreview.src = "";
        ticketImagePreview.alt = "Vista previa del documento";
    }
    
    if (pdfViewViewer) {
  pdfViewViewer.style.display = "none";
        pdfViewViewer.innerHTML = "";
    }

    // Establecer información del ticket
    currentTicketIdDisplay.textContent = ticketId;
    currentImageTypeDisplay.textContent = documentType;
    currentDocumentNameDisplay.textContent = fileName || 'Sin nombre';
    currentSerialDisplay.textContent = serialPos || 'Sin posición';

    // Controlar la visibilidad del botón de aprobar
    if (approveTicketFromImageBtn) {
        const allowedTypes = ['Exoneracion', 'Anticipo'];
        const isRejected = documentoRechazado === 'Sí';

        if (allowedTypes.includes(documentType) && !isRejected) {
            approveTicketFromImageBtn.style.display = 'block';
        } else {
            approveTicketFromImageBtn.style.display = 'none';
        }
    }

  // Función para limpiar la ruta del archivo
  function cleanFilePath(filePath) {
    if (!filePath) return null;
    let cleanPath = filePath.replace(/\\/g, '/');
    const pathSegments = cleanPath.split('Documentos_SoportePost/');
    if (pathSegments.length > 1) {
      cleanPath = pathSegments[1];
    }
    return `http://localhost/Documentos/${cleanPath}`;
  }

    // CONFIGURAR EL CONTENIDO CON MANEJO DE ERRORES
    const fullUrl = cleanFilePath(filePath);
    
    if (mimeType && mimeType.startsWith('image/')) {
    // Es una imagen
        if (ticketImagePreview) {
            ticketImagePreview.src = fullUrl;
            ticketImagePreview.style.display = "block";
            ticketImagePreview.alt = `Vista previa de ${fileName || 'documento'}`;
        }
        
        if (pdfViewViewer) {
            pdfViewViewer.style.display = "none";
        }
    } else if (mimeType === 'application/pdf') {
    // Es un PDF
        if (ticketImagePreview) {
            ticketImagePreview.style.display = "none";
        }

        if (pdfViewViewer) {
    pdfViewViewer.style.display = "block";
            pdfViewViewer.innerHTML = `<iframe src="${fullUrl}" width="100%" height="100%" style="border:none;" title="PDF: ${fileName || 'documento'}"></iframe>`;
        }
  } else {
        // Tipo de archivo no soportado
        if (ticketImagePreview) {
            ticketImagePreview.style.display = "none";
        }
        
        if (pdfViewViewer) {
            pdfViewViewer.style.display = "block";
            pdfViewViewer.innerHTML = `
                <div class="text-center p-4">
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        Tipo de archivo no soportado: ${mimeType}
                    </div>
                </div>
            `;
        }
    }

    // Mostrar el modal de aprobación
    const imageApprovalModal = new bootstrap.Modal(imageApprovalModalElement);
    
    // LIMPIAR Y AGREGAR EVENT LISTENERS
    if (closeImageApprovalModalBtn) {
        // Remover listeners previos
        const newCloseBtn = closeImageApprovalModalBtn.cloneNode(true);
        closeImageApprovalModalBtn.parentNode.replaceChild(newCloseBtn, closeImageApprovalModalBtn);
        
        newCloseBtn.addEventListener('click', function() {
            imageApprovalModal.hide();
        });
    }

    imageApprovalModal.show();

    // LIMPIAR CUANDO SE CIERRE EL MODAL
    const cleanupHandler = function() {
        if (ticketImagePreview) {
            ticketImagePreview.style.display = "none";
            ticketImagePreview.src = "";
            ticketImagePreview.alt = "Vista previa del documento";
        }
        
        if (pdfViewViewer) {
            pdfViewViewer.style.display = "none";
            pdfViewViewer.innerHTML = "";
        }
        imageApprovalModalElement.removeEventListener('hidden.bs.modal', cleanupHandler);
    };
    imageApprovalModalElement.addEventListener('hidden.bs.modal', cleanupHandler);
}

function getMotivos(documentType) {
  const xhr = new XMLHttpRequest();

  // Muestra un mensaje de carga en el select
  const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");
  motivoRechazoSelect.innerHTML = '<option value="">Cargando...</option>';

  DocumentType = documentType;

  // Aquí cambiamos el endpoint para apuntar a la API de motivos
  xhr.open("POST", `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetMotivos`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          // Apuntamos al select de motivos
          const select = document.getElementById("motivoRechazoSelect");

          // Limpiamos el select antes de agregar nuevas opciones
          select.innerHTML = '<option value="">Seleccione</option>';

          // La respuesta debe tener un array llamado 'motivos'
          if (Array.isArray(response.motivos) && response.motivos.length > 0) {
            response.motivos.forEach((motivo) => {
              const option = document.createElement("option");
              option.value = motivo.id_motivo_rechazo;
              option.textContent = motivo.name_motivo_rechazo;
              select.appendChild(option);
            });
          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay Motivos Disponibles";
            select.appendChild(option);
          }
        } else {
          console.error("Error al obtener los motivos:", response.message);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error:", xhr.status, xhr.statusText);
    }
  };

  // ¡Aquí se envía el documentType!
  const datos = `action=GetMotivos&documentType=${documentType}`;
  xhr.send(datos);
}