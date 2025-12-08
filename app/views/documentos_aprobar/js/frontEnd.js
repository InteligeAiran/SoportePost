let currentSelectedTicket = null;
let currentTicketNroForImage = null;
let paymentAgreementModalInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    const approveTicketFromImageBtn = document.getElementById('approveTicketFromImage');
    paymentAgreementModalInstance = new bootstrap.Modal(document.getElementById("paymentAgreementModal"));
    
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
        id_status_payment: "Id Estatus Pago",
        name_status_domiciliacion: "Estatus Domiciliación",
        id_status_domiciliacion: "Id Estatus Domiciliacion",
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

                        // ✅ AGREGAR COLUMNAS OCULTAS PARA BÚSQUEDA POR ID
                        if (allDataKeys.includes('id_status_payment')) {
                            columnsConfig.push({
                                data: 'id_status_payment',
                                title: 'ID Status Payment',
                                visible: false, // ✅ OCULTA PERO DISPONIBLE PARA BÚSQUEDA
                                searchable: true
                            });
                        }
                        
                        if (allDataKeys.includes('id_status_domiciliacion')) {
                            columnsConfig.push({
                                data: 'id_status_domiciliacion',
                                title: 'ID Status Domiciliación',
                                visible: false, // ✅ OCULTA PERO DISPONIBLE PARA BÚSQUEDA
                                searchable: true
                            });
                        }

                        for (const key in columnTitles) {
                            if (allDataKeys.includes(key)) {
                                // ✅ EXCLUIR LAS COLUMNAS DE ID DEL LOOP PRINCIPAL
                                if (key === 'id_status_payment' || key === 'id_status_domiciliacion') {
                                    continue; // Saltar estas columnas ya que se agregaron arriba
                                }

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
                                            data-rechazado="${isRejected ? 'true' : 'false'}"
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

                            // ✅ FUNCIÓN MEJORADA: Verificar si hay datos por ID
                            function checkDataExistsById(searchTerms) {
                                api.columns().search('').draw(false);
                                
                                let hasData = false;
                                searchTerms.forEach(searchTerm => {
                                    if (searchTerm.column === 'id_status_payment') {
                                        // Buscar en columna de ID status payment (índice 1)
                                        api.column(1).search(searchTerm.value, true, false, true).draw();
                                        const rowCount = api.rows({ filter: 'applied' }).count();
                                        if (rowCount > 0) hasData = true;
                                        api.columns().search('').draw(false);
                                    } else if (searchTerm.column === 'id_status_domiciliacion') {
                                        // Buscar en columna de ID status domiciliación (índice 2)
                                        api.column(2).search(searchTerm.value, true, false, true).draw();
                                        const rowCount = api.rows({ filter: 'applied' }).count();
                                        if (rowCount > 0) hasData = true;
                                        api.columns().search('').draw(false);
                                    }
                                });
                                
                                return hasData;
                            }

                            // ✅ FUNCIÓN MEJORADA: Buscar automáticamente el primer botón con datos
                            function findFirstButtonWithData() {
                                const searchConfigs = [
                                    { 
                                        button: "btn-por-asignar", 
                                        searchTerms: [
                                            { column: 'id_status_payment', value: '7|5' }
                                        ]
                                    },
                                    { 
                                        button: "btn-recibidos", 
                                        searchTerms: [
                                            { column: 'id_status_payment', value: '9|10|11' }
                                        ]
                                    },
                                    { 
                                        button: "btn-asignados", 
                                        searchTerms: [
                                            { column: 'id_status_payment', value: '12|13|14' },
                                            { column: 'id_status_domiciliacion', value: '7' }
                                        ]
                                    }
                                ];

                                for (let i = 0; i < searchConfigs.length; i++) {
                                    const { button, searchTerms } = searchConfigs[i];
                                    
                                    if (checkDataExistsById(searchTerms)) {
                                        // Si hay datos, aplicar la búsqueda y activar el botón
                                        api.columns().search('').draw(false);
                                        
                                        if (button === "btn-por-asignar") {
                                            api.column(1).search('7|5', true, false, true).draw();
                                            api.column(11).visible(false);
                                        } else if (button === "btn-recibidos") {
                                            api.column(1).search('9|10|11', true, false, true).draw();
                                            api.column(11).visible(false);
                                            api.column(12).visible(false);
                                            api.column(10).visible(false);
                                            api.column(9).visible(false);
                                        } else if (button === "btn-asignados") {
                                            api.search('').draw(false);
                                            api.column(11).visible(true);
                                            api.column(12).visible(true);
                                            api.column(10).visible(true);
                                            api.column(9).visible(true);
                                            // Filtrar manualmente para mostrar rechazados de payment Y domiciliación
                                            api.rows().every(function() {
                                                const data = this.data();
                                                const idPayment = data.id_status_payment;
                                                const idDomiciliacion = data.id_status_domiciliacion;
                                                
                                                const isPaymentRejected = [12, 13, 14].includes(parseInt(idPayment));
                                                const isDomiciliacionRejected = parseInt(idDomiciliacion) === 7;
                                                
                                                if (isPaymentRejected || isDomiciliacionRejected) {
                                                    $(this.node()).show();
                                                } else {
                                                    $(this.node()).hide();
                                                }
                                            });
                                        }
                                  
                                        setActiveButton(button);
                                        return true; // Encontramos datos
                                    }
                                }
                                
                                // Si no hay datos en ningún botón, mostrar un mensaje
                                api.columns().search('').draw(false);
                                api.column(1).search("NO_DATA_FOUND").draw();
                                setActiveButton("btn-por-asignar");

                                const tbody = document.querySelector("#tabla-ticket tbody");
                                if (tbody) {
                                    tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">No hay tickets disponibles en ningún estado</td></tr>';
                                }
                                
                                return false;
                            }

                            // Ejecutar la búsqueda automática al inicializar
                            findFirstButtonWithData();

                            // ✅ EVENT LISTENERS MEJORADOS: Usar búsqueda por ID
                                $("#btn-por-asignar").on("click", function () {
                                    // ✅ LIMPIAR FILTROS PERSONALIZADOS
                                    $.fn.dataTable.ext.search.pop();
                                    
                                    const searchTerms = [{ column: 'id_status_payment', value: '^7$|^5$' }];
                                    if (checkDataExistsById(searchTerms)) {
                                        api.columns().search('').draw(false);
                                        api.column(1).search('^7$|^5$', true, false, true).draw();
                                        api.column(11).visible(false);
                                        setActiveButton("btn-por-asignar");
                                    } else {
                                        findFirstButtonWithData();
                                    }
                                });

                                $("#btn-recibidos").on("click", function () {
                                    // ✅ LIMPIAR FILTROS PERSONALIZADOS
                                    $.fn.dataTable.ext.search.pop();
                                    
                                    const searchTerms = [{ column: 'id_status_payment', value: '^9$|^10$|^11$' }];
                                    if (checkDataExistsById(searchTerms)) {
                                        api.columns().search('').draw(false);
                                        api.column(1).search('^9$|^10$|^11$', true, false, true).draw();
                                        api.column(11).visible(false);
                                        api.column(12).visible(false);
                                        api.column(10).visible(false);
                                        api.column(9).visible(false);
                                        setActiveButton("btn-recibidos");
                                    } else {
                                        findFirstButtonWithData();
                                    }
                                });

                                $("#btn-asignados").on("click", function () {
                                    // ✅ LIMPIAR COMPLETAMENTE TODOS LOS FILTROS
                                    api.columns().search('').draw(false);
                                    api.search('').draw(false);

                                    api.column(11).visible(true);
                                    api.column(12).visible(true);
                                    api.column(10).visible(true);
                                    api.column(9).visible(true);
                                    
                                    // ✅ MOSTRAR TODAS LAS FILAS PRIMERO
                                    api.rows().every(function() {
                                        $(this.node()).show();
                                    });
                                    
                                    // ✅ USAR FILTRO PERSONALIZADO DE DATATABLE PARA OR LÓGICO
                                    // Limpiar filtros personalizados anteriores
                                    $.fn.dataTable.ext.search.pop();
                                    
                                    // Agregar filtro personalizado para rechazados
                                    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
                                        // Solo aplicar este filtro en nuestra tabla
                                        if (settings.nTable.id !== 'tabla-ticket') {
                                            return true;
                                        }
                                        
                                        const idPayment = parseInt(data[1]); // Columna 1: id_status_payment
                                        const idDomiciliacion = parseInt(data[2]); // Columna 2: id_status_domiciliacion
                                        
                                        const isPaymentRejected = [12, 13, 14].includes(idPayment);
                                        const isDomiciliacionRejected = idDomiciliacion === 7;
                                        
                                        return isPaymentRejected || isDomiciliacionRejected;
                                    });
                                    
                                    // ✅ APLICAR EL FILTRO PERSONALIZADO
                                    api.draw();
                                    
                                    setActiveButton("btn-asignados");
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
                            currentSelectedTicket = ticketId;
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
                                // Verificar si el clic fue en un botón, enlace o input
                                const clickedElement = $(e.target);
                                const isButton = clickedElement.is('button') || 
                                                clickedElement.closest('button').length > 0 ||
                                                clickedElement.is('a') || 
                                                clickedElement.closest('a').length > 0 ||
                                                clickedElement.is('input') || 
                                                clickedElement.closest('input').length > 0 ||
                                                clickedElement.is('svg') || 
                                                clickedElement.closest('svg').length > 0 ||
                                                clickedElement.is('path') || 
                                                clickedElement.closest('path').length > 0 ||
                                                clickedElement.hasClass('truncated-cell') ||
                                                clickedElement.hasClass('expanded-cell');
                                
                                // Si el clic fue en un botón/enlace, permitir que el evento continúe normalmente
                                if (isButton) {
                                    return; // No hacer nada, dejar que el botón maneje su propio evento
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
                            const documentoRechazado = $(this).data("rechazado") === true || $(this).data("rechazado") === 'true';
                            
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
                            VizualizarImage.setAttribute('data-rechazado', documentoRechazado ? 'true' : 'false');
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
    const uploadMessage = document.getElementById('uploadMessage');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    const cerrarBoton = document.getElementById('CerrarBoton');
    const uploadForm = document.getElementById('uploadForm');
    const DocumentTypeInput = document.getElementById('document_type');
    const nro_ticket = document.getElementById('nro_ticket');

    // Verificar que todos los elementos necesarios existan
    if (!modal || !modalTicketIdSpan || !idTicketInput || !documentFileInput  || !uploadMessage || !uploadFileBtn || !cerrarBoton || !uploadForm) {
        console.error('Elementos del modal no encontrados:', {
            modal: !!modal,
            modalTicketIdSpan: !!modalTicketIdSpan,
            idTicketInput: !!idTicketInput,
            documentFileInput: !!documentFileInput,
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
    /*imagePreview.style.display = 'none';*/
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

    if(documentType === 'convenio_firmado') {
        const botonConvenio = document.getElementById('generateNotaEntregaBtn');
        const botonEnvio = document.getElementById('generateNotaEntregaBtn2');
        if(botonConvenio && botonEnvio) {
            botonConvenio.style.display = 'block';
            botonEnvio.style.display = 'none';
        }
    }else if(documentType === 'Envio') {
        const botonConvenio = document.getElementById('generateNotaEntregaBtn');
        const botonEnvio = document.getElementById('generateNotaEntregaBtn2');
        if(botonConvenio && botonEnvio) {
            botonConvenio.style.display = 'none';
            botonEnvio.style.display = 'block';
        }
    }else {
        const botonConvenio = document.getElementById('generateNotaEntregaBtn');
        const botonEnvio = document.getElementById('generateNotaEntregaBtn2');
        if(botonConvenio && botonEnvio) {
            botonConvenio.style.display = 'none';
            botonEnvio.style.display = 'none';
        }
    }
    
    // Insertar la información antes del formulario
    const existingInfo = uploadForm.querySelector('#CartWrong');
    if (existingInfo) {
        existingInfo.remove();
    }
    uploadForm.insertAdjacentHTML('afterbegin', infoHtml);

    // Mostrar el modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // Limpiar estados de validación al abrir el modal
    documentFileInput.classList.remove("is-valid", "is-invalid");
    if (uploadForm) {
        uploadForm.classList.remove("was-validated");
    }
    
    // Mostrar el mensaje informativo
    const fileFormatInfo = document.getElementById("fileFormatInfo");
    if (fileFormatInfo) {
        fileFormatInfo.style.display = "block";
        fileFormatInfo.style.visibility = "visible";
    }
    
    // Deshabilitar el botón de subir al abrir el modal
            uploadFileBtn.disabled = true;
    
    // Restaurar visibilidad de los mensajes de feedback
    if (documentFileInput && documentFileInput.parentElement) {
        const validFeedback = documentFileInput.parentElement.querySelector('.valid-feedback');
        const invalidFeedback = documentFileInput.parentElement.querySelector('.invalid-feedback');
        if (validFeedback) {
            validFeedback.style.display = '';
            validFeedback.style.visibility = '';
        }
        if (invalidFeedback) {
            invalidFeedback.style.display = '';
            invalidFeedback.style.visibility = '';
        }
    }
    
    // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
    const imagePreview = document.getElementById("imagePreview");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    if (imagePreview) {
        imagePreview.style.display = "none";
        imagePreview.src = "#";
    }
    if (imagePreviewContainer) {
        imagePreviewContainer.style.display = "none";
    }

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
        /*Swal.fire({
            title: 'Subiendo documento...',
            text: 'Por favor espere mientras se procesa el archivo.',
            allowOutsideClick: false,
            color: 'black',
            didOpen: () => {
                Swal.showLoading();
            }
        });*/
    };

    // Event listener para cerrar modal
    const handleCerrarClick = function() {
        bootstrapModal.hide();
    };

    // Agregar event listeners
    // Usar la función handleFileSelectForUpload para validación con Bootstrap
    // Remover cualquier listener previo y agregar el nuevo
    // Usar jQuery para asegurar que se ejecute correctamente
    $(documentFileInput).off("change").on("change", function(e) {
        // Usar la función global handleFileSelectForUpload si está disponible
        if (typeof window.handleFileSelectForUpload !== 'undefined') {
            window.handleFileSelectForUpload.call(this, e);
        } else {
            // Si no está disponible, esperar un poco y volver a intentar
            setTimeout(() => {
                if (typeof window.handleFileSelectForUpload !== 'undefined') {
                    window.handleFileSelectForUpload.call(this, e);
                } else {
                    console.warn("handleFileSelectForUpload no está disponible");
                }
            }, 100);
        }
    });
    uploadFileBtn.addEventListener('click', handleUploadClick);
    cerrarBoton.addEventListener('click', handleCerrarClick);

    // Limpiar al cerrar el modal
    modal.addEventListener('hidden.bs.modal', function() {
        // Remover event listeners usando jQuery
        $(documentFileInput).off("change");
        uploadFileBtn.removeEventListener('click', handleUploadClick);
        cerrarBoton.removeEventListener('click', handleCerrarClick);
        
        // Limpiar formulario y estados de validación
        uploadForm.reset();
        documentFileInput.classList.remove("is-valid", "is-invalid");
        documentFileInput.style.removeProperty("background-image");
        documentFileInput.style.removeProperty("background-position");
        documentFileInput.style.removeProperty("background-repeat");
        documentFileInput.style.removeProperty("background-size");
        documentFileInput.style.removeProperty("padding-right");
        
        if (uploadForm) {
            uploadForm.classList.remove("was-validated");
        }
        
        // Mostrar el mensaje informativo
        const fileFormatInfo = document.getElementById("fileFormatInfo");
        if (fileFormatInfo) {
            fileFormatInfo.style.display = "block";
            fileFormatInfo.style.visibility = "visible";
        }
        
        // Deshabilitar el botón de subir
        uploadFileBtn.disabled = true;
        
        // Restaurar visibilidad de los mensajes de feedback
        if (documentFileInput && documentFileInput.parentElement) {
            const validFeedback = documentFileInput.parentElement.querySelector('.valid-feedback');
            const invalidFeedback = documentFileInput.parentElement.querySelector('.invalid-feedback');
            if (validFeedback) {
                validFeedback.style.display = '';
                validFeedback.style.visibility = '';
            }
            if (invalidFeedback) {
                invalidFeedback.style.display = '';
                invalidFeedback.style.visibility = '';
            }
        }
        
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
        const documentoRechazado = visualizarImagenModalElement.getAttribute('data-rechazado') === 'true';

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

        const BotonRechazo = document.getElementById('RechazoDocumento');
        BotonRechazo.style.display = documentoRechazado ? 'none' : 'block';

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

      // Limpiar campos del modal y estados de validación
      const documentFileInput = document.getElementById("documentFile");
      const uploadForm = document.getElementById("uploadForm");
      const fileFormatInfo = document.getElementById("fileFormatInfo");
      const uploadFileBtn = document.getElementById("uploadFileBtn");
      
      if (documentFileInput) {
        documentFileInput.value = "";
        documentFileInput.classList.remove("is-valid", "is-invalid");
        // Limpiar estilos de background-image
        documentFileInput.style.removeProperty("background-image");
        documentFileInput.style.removeProperty("background-position");
        documentFileInput.style.removeProperty("background-repeat");
        documentFileInput.style.removeProperty("background-size");
        documentFileInput.style.removeProperty("padding-right");
      }
      
      if (uploadForm) {
        uploadForm.classList.remove("was-validated");
      }
      
      // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
      if ($imagePreview.length) {
        $imagePreview.hide();
        $imagePreview.attr("src", "#");
      }
      const imagePreviewContainer = document.getElementById("imagePreviewContainer");
      if (imagePreviewContainer) {
        imagePreviewContainer.style.display = "none";
      }
      
      // Verificar que uploadMessage existe antes de usarlo
      if ($uploadMessage.length) {
        $uploadMessage.text("");
        $uploadMessage.hide();
      }
      
      // Mostrar el mensaje informativo
      if (fileFormatInfo) {
        fileFormatInfo.style.display = "block";
        fileFormatInfo.style.visibility = "visible";
      }
      
      // Deshabilitar el botón de subir al abrir el modal
      if (uploadFileBtn) {
        uploadFileBtn.disabled = true;
      }
      
      // Restaurar visibilidad de los mensajes de feedback
      if (documentFileInput && documentFileInput.parentElement) {
        const validFeedback = documentFileInput.parentElement.querySelector('.valid-feedback');
        const invalidFeedback = documentFileInput.parentElement.querySelector('.invalid-feedback');
        if (validFeedback) {
          validFeedback.style.display = '';
          validFeedback.style.visibility = '';
        }
        if (invalidFeedback) {
          invalidFeedback.style.display = '';
          invalidFeedback.style.visibility = '';
        }
      }

      // Configurar el listener para el input de archivo usando jQuery (más confiable)
      // Remover cualquier listener previo y agregar el nuevo
      $documentFileInput.off("change").on("change", handleFileSelectForUpload);

      // ABRIR EL MODAL EXPLICITAMENTE
      uploadDocumentModalInstance.show();
    } else {
      console.error(
        "Error: Instancia de modal 'uploadDocumentModal' no encontrada. Asegúrate de que el elemento HTML del modal existe y Bootstrap JS está cargado."
      );
    }
  });

  // 4. Función de validación de archivos (reemplaza la previsualización antigua)
  // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
  // Hacer la función disponible globalmente para que pueda ser usada desde otras funciones
  window.handleFileSelectForUpload = function(event) {
    const input = event.target || this; // Compatible con jQuery y addEventListener
    const file = input.files ? input.files[0] : null;
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
    const validMimeTypes = ["image/jpg", "image/png", "image/gif", "application/pdf"];
    
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
        input.style.removeProperty("border-color");
        input.style.removeProperty("box-shadow");
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

  if ($uploadFileBtn.length) {
        $uploadFileBtn.on("click", function () {
            const userIdElement = document.getElementById("userId");
            if (!userIdElement) {
                console.error("Elemento userId no encontrado");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener el ID del usuario.',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#003594',
                    color: 'black',
                });
                return;
            }
            const id_user = userIdElement.value;
            
            const documentFileInput = document.getElementById("documentFile");
            if (!documentFileInput) {
                console.error("Elemento documentFile no encontrado");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener el input de archivo.',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#003594',
                    color: 'black',
                });
                return;
            }
            
            const uploadMessage = document.getElementById("uploadMessage");
            const file = documentFileInput.files[0];
            
            const idTicketElement = document.getElementById("id_ticket");
            if (!idTicketElement) {
                console.error("Elemento id_ticket no encontrado");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener el ID del ticket.',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#003594',
                    color: 'black',
                });
                return;
            }
            const id_ticket = idTicketElement.value;
            
            const documentTypeElement = document.getElementById("document_type");
            if (!documentTypeElement) {
                console.error("Elemento document_type no encontrado");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener el tipo de documento.',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#003594',
                    color: 'black',
                });
                return;
            }
            const documentType = documentTypeElement.value;

            // Clear previous messages and check for file
            if (uploadMessage) {
            uploadMessage.classList.add("hidden");
            uploadMessage.textContent = "";
            }

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
      const documentFileInput = document.getElementById("documentFile");
      const uploadForm = document.getElementById("uploadForm");
      const fileFormatInfo = document.getElementById("fileFormatInfo");
      const uploadFileBtn = document.getElementById("uploadFileBtn");
      
      if ($modalTicketIdSpan.length) $modalTicketIdSpan.text("");
      
      if (documentFileInput) {
        documentFileInput.value = "";
        documentFileInput.classList.remove("is-valid", "is-invalid");
        // Limpiar estilos de background-image
        documentFileInput.style.removeProperty("background-image");
        documentFileInput.style.removeProperty("background-position");
        documentFileInput.style.removeProperty("background-repeat");
        documentFileInput.style.removeProperty("background-size");
        documentFileInput.style.removeProperty("padding-right");
      }
      
      if (uploadForm) {
        uploadForm.classList.remove("was-validated");
      }
      
      // PREVISUALIZACIÓN DESACTIVADA POR MOTIVOS DE SEGURIDAD
      if ($imagePreview.length) {
        $imagePreview.hide();
        $imagePreview.attr("src", "#");
      }
      const imagePreviewContainer = document.getElementById("imagePreviewContainer");
      if (imagePreviewContainer) {
        imagePreviewContainer.style.display = "none";
      }
      
      // Verificar que uploadMessage existe antes de usarlo
      if ($uploadMessage.length) {
        $uploadMessage.text("");
        $uploadMessage.hide();
      }
      
      // Mostrar el mensaje informativo
      if (fileFormatInfo) {
        fileFormatInfo.style.display = "block";
        fileFormatInfo.style.visibility = "visible";
      }
      
      // Deshabilitar el botón de subir
      if (uploadFileBtn) {
        uploadFileBtn.disabled = true;
      }
      
      // Restaurar visibilidad de los mensajes de feedback
      if (documentFileInput && documentFileInput.parentElement) {
        const validFeedback = documentFileInput.parentElement.querySelector('.valid-feedback');
        const invalidFeedback = documentFileInput.parentElement.querySelector('.invalid-feedback');
        if (validFeedback) {
          validFeedback.style.display = '';
          validFeedback.style.visibility = '';
        }
        if (invalidFeedback) {
          invalidFeedback.style.display = '';
          invalidFeedback.style.visibility = '';
        }
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
function loadTicketHistory(ticketId, currentTicketNroForImage, serialPos = '') {
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
                        <button class="btn btn-secondary" onclick="printHistory('${ticketId}', '${encodeURIComponent(JSON.stringify(response.history))}', '${currentTicketNroForImage}', '${serialPos}')">
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
                    const showComponentsChanges = cleanString(item.components_changes); // Nuevo campo con cambios específicos
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
                                                    <th class="text-start">Estatus Taller:</th>
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
                                                        <th class="text-start">Periféricos Asociados:</th>
                                                        <td class="${shouldHighlightComponents ? "highlighted-change" : ""}">${cleanString(item.components_list)}</td>
                                                    </tr>
                                                ` : ''}
                                                ${showComponentsChanges ? `
                                                    <tr>
                                                        <th class="text-start">Cambios en Periféricos:</th>
                                                        <td class="highlighted-change" style="color: #dc3545;">
                                                            ${cleanString(item.components_changes)}
                                                        </td>
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

function printHistory(ticketId, historyEncoded, currentTicketNroForImage, serialPos = '') {
    // ... (Mantener las funciones auxiliares: decodeHistorySafe, cleanString, parseCustomDate, calculateTimeElapsed, generateFileName)
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
            text = `${diffWeeks}S ${diffDays % 7}D`;
        } else if (diffDays > 0) {
            text = `${diffDays}D ${diffHours % 24}H ${diffMinutes % 60}M`;
        } else if (diffHours > 0) {
            text = `${diffHours}H ${diffMinutes % 60}M`;
        } else if (diffMinutes > 0) {
            // Mostrar minutos cuando es al menos 1 minuto
            text = `${diffMinutes}M`;
        } else {
            // Si es menos de 1 minuto, mostrar N/A según requerimiento de impresión
            text = `N/A`;
        }
        return { text, ms: diffMs, minutes: diffMinutes, hours: diffHours, days: diffDays, weeks: diffWeeks, months: diffMonths };
    };

    const history = decodeHistorySafe(historyEncoded);

    const generateFileName = (ticketNumber, serial) => {
        let fileName = `Historial_Ticket_${ticketNumber}`;
        if (serial && serial.length >= 4) {
            const lastFourDigits = serial.slice(-4);
            fileName += `-${lastFourDigits}`;
        }
        return `${fileName}.pdf`;
    };

    const fileName = generateFileName(currentTicketNroForImage, serialPos);

    let itemsHtml = '';
    history.forEach((item, index) => {
        const previous = history[index + 1] || null;
        const elapsed = previous ? calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio) : null;
        const elapsedText = elapsed ? elapsed.text : 'N/A';

        itemsHtml += `
            <div style="border: 1px solid #ddd; border-radius: 8px; margin: 15px 0; padding: 0; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%); color: white; padding: 12px 15px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${cleanString(item.fecha_de_cambio) || 'N/A'} - ${cleanString(item.name_accion_ticket) || 'N/A'} (${cleanString(item.name_status_ticket) || 'N/A'})
                </div>
                <div style="padding: 15px; background: #fafafa;">
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
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Taller</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_lab) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Domiciliación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_domiciliacion) || 'N/A'}</td></tr>
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Pago</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_payment) || 'N/A'}</td></tr>
                        ${cleanString(item.components_list) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Periféricos</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.components_list)}</td></tr>` : ''}
                        ${cleanString(item.components_changes) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Cambios en Periféricos</strong></td><td style="padding:4px; border-bottom:1px solid #eee; color: #dc3545;">${cleanString(item.components_changes)}</td></tr>` : ''}
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
            </div>
        `;
    });

    const legendHTML_Integrated = `
        <div class="legend-integrated" style="margin: 10px 0; padding: 10px; background: #e0f2fe; border: 1px solid #93c5fd; border-radius: 6px; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <p style="font-size: 13px; font-weight: bold; color: #1e40af; margin-bottom: 8px;">
                LEYENDA DE TIEMPO
            </p>
            <div style="display: flex; justify-content: center; gap: 15px; font-size: 11px; font-weight: 500;">
                <span style="color: #059669;">
                    <strong style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">D</strong> Día(s)
                </span>
                <span style="color: #1e40af;">
                    <strong style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">H</strong> Hora(s)
                </span>
                <span style="color: #9a3412;">
                    <strong style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">M</strong> Minuto(s)
                </span>
                <span style="color: #b91c1c;">
                    <strong style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">S</strong> Semana(s)
                </span>
            </div>
            <p style="font-size: 10px; color: #6b7280; margin-top: 8px;">
                *Ejemplo: **1D 6H 11M** significa 1 día, 6 horas y 11 minutos.
            </p>
        </div>
    `;


    const printContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${fileName}</title>
            <style>
                /* ... (Mantener todos los estilos CSS anteriores, asegurando que la clase .legend-float NO exista para no confundir) ... */
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
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    min-height: 100vh;
                }
                
                .container {
                    max-width: 800px;
                    width: 100%;
                    margin: 0 auto;
                    background: white;
                    min-height: calc(100vh - 40px);
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    border-radius: 8px;
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
                
                .document-info {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    padding: 8px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    border-left: 3px solid #2c5aa0;
                    gap: 10px;
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: 1;
                    min-width: 0;
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
                
                .history-section {
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
                
                .history-item {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin: 15px 0;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    background: #fafafa;
                }
                
                .history-item-header {
                    background: linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%);
                    color: white;
                    padding: 12px 15px;
                    font-weight: bold;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin: 0;
                }
                
                .history-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }
                
                .history-table td {
                    padding: 4px;
                    border-bottom: 1px solid #eee;
                }
                
                .history-table td:first-child {
                    font-weight: bold;
                    color: #555;
                    width: 40%;
                }
                
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
                
                /* Estilos para la leyenda integrada */
                .legend-integrated {
                    margin: 10px 0;
                    padding: 10px;
                    background: #e0f2fe;
                    border: 1px solid #93c5fd;
                    border-radius: 6px;
                    text-align: center;
                    page-break-inside: avoid; /* Evita que la leyenda se rompa entre páginas */
                }
                
                /* Optimizaciones para impresión */
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

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
                        display: block !important;
                    }
                    
                    body {
                        font-size: 10px !important;
                        padding: 8px !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-height: 100vh !important;
                    }
                    
                    .container {
                        max-width: 800px !important;
                        width: 100% !important;
                        min-height: auto !important;
                        height: auto !important;
                        page-break-inside: avoid;
                        margin: 0 auto !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
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
                    
                    .history-item {
                        margin: 10px 0 !important;
                        padding: 0 !important;
                        page-break-inside: avoid;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                    }
                    
                    .history-item-header {
                        padding: 10px 12px !important;
                        font-size: 12px !important;
                    }
                    
                    .history-table {
                        font-size: 10px !important;
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
                }
                
                @page {
                    size: letter;
                    margin: 0.2in 0.5in;
                    padding: 0;
                    @top-left { content: ""; }
                    @top-center { content: ""; }
                    @top-right { content: ""; }
                    @bottom-left { content: ""; }
                    @bottom-center { content: ""; }
                    @bottom-right { content: ""; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="../../../public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="company-logo-img" onerror="this.style.display='none'">
                    <div class="company-address">
                        Urbanización El Rosal. Av. Francisco de Miranda<br>
                        Edif. Centro Sudamérica PH-A Caracas. Edo. Miranda
                </div>
                    <div class="document-title">Historial del Ticket</div>
                </div>
                
                <div class="document-info">
                    <div class="info-item">
                        <div class="info-label">Ticket Nro</div>
                        <div class="info-value">${currentTicketNroForImage}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Fecha de Impresión</div>
                        <div class="info-value">${new Date().toLocaleString()}</div>
                    </div>
                </div>
                
                ${legendHTML_Integrated}

                <div class="content-wrapper">
                    <div class="history-section">
                        <div class="section-header">Detalle del Historial</div>
                        <div class="section-content">
                            <p style="margin: 0 0 14px 0; color: #6c757d; font-size: 12px; text-align: center;">
                                <strong>Nota:</strong> En la columna "Tiempo desde gestión anterior" con un valor "N/A" indica que la gestión se realizó en menos de 1 minuto.
                            </p>
            ${itemsHtml || '<p style="text-align:center; color:#666;">Sin historial disponible.</p>'}
        </div>
                    </div>
                </div>

                <div class="footer">
                    <div class="footer-content">
                        <div class="footer-left">
                            <img src="../../../public/img/Nota_Entrega/INTELIGENSA.PNG" alt="Logo Inteligensa" class="footer-logo" onerror="this.style.display='none'">
                        </div>
                        <div class="footer-right">
                            <div class="footer-rif">RIF: J-00291615-0</div>
                        </div>
                    </div>
                    <div class="footer-text">
                        <p>Documento generado automáticamente por el sistema de gestión de tickets de Inteligensa.</p>
                        <p>Generado: ${new Date().toLocaleString("es-ES")}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '', 'height=800,width=1024');
    printWindow.document.write(printContent);
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

document.addEventListener("DOMContentLoaded", function () {
  // Función para forzar saltos de línea cada cierto número de caracteres

  function addLineBreaks(text, maxCharsPerLine = 25) {
    if (!text) return text;

    // Remover saltos de línea existentes para procesar todo el texto

    const cleanText = text.replace(/\n/g, " ");

    let result = "";

    let currentLine = "";

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];

      if (currentLine.length >= maxCharsPerLine) {
        result += currentLine + "\n";

        currentLine = char;
      } else {
        currentLine += char;
      }
    }

    if (currentLine) {
      result += currentLine;
    }

    return result;
  }

  // Aplicar saltos de línea automáticos a los campos de texto

  function setupAutoLineBreaks() {
    const textFields = ["pa_propuesta", "pa_observaciones", "pa_acuerdo"];

    textFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);

      if (field) {
        // Aplicar estilos adicionales

        field.style.wordBreak = "break-all";

        field.style.overflowWrap = "break-word";

        field.style.whiteSpace = "pre-wrap";

        field.addEventListener("input", function (e) {
          const originalValue = e.target.value;

          const withLineBreaks = addLineBreaks(originalValue, 25);

          if (originalValue !== withLineBreaks) {
            const cursorPosition = e.target.selectionStart;

            e.target.value = withLineBreaks;

            // Ajustar posición del cursor

            const newPosition = Math.min(cursorPosition, withLineBreaks.length);

            e.target.setSelectionRange(newPosition, newPosition);
          }
        });

        field.addEventListener("blur", function (e) {
          const originalValue = e.target.value;

          const withLineBreaks = addLineBreaks(originalValue, 25);

          if (originalValue !== withLineBreaks) {
            e.target.value = withLineBreaks;
          }
        });

        field.addEventListener("paste", function (e) {
          setTimeout(() => {
            const originalValue = e.target.value;

            const withLineBreaks = addLineBreaks(originalValue, 25);

            if (originalValue !== withLineBreaks) {
              e.target.value = withLineBreaks;
            }
          }, 10);
        });
      }
    });
  }

  // Formatear campo de saldo deudor mientras se escribe

  const saldoDeudorField = document.getElementById("pa_saldo_deudor");

  if (saldoDeudorField) {
    // Formatear al perder el foco

    saldoDeudorField.addEventListener("blur", function (e) {
      let value = e.target.value;

      if (value && !isNaN(parseFloat(value))) {
        const numValue = parseFloat(value);

        e.target.value = numValue.toFixed(2);
      }
    });

    // Formatear al escribir para mostrar el $ después

    saldoDeudorField.addEventListener("input", function (e) {
      let value = e.target.value.replace(/[^0-9.]/g, ""); // Solo números y punto

      // Permitir solo un punto decimal

      const parts = value.split(".");

      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }

      // Limitar a 2 decimales

      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + "." + parts[1].substring(0, 2);
      }

      e.target.value = value;
    });
  }

  // Configurar saltos de línea automáticos

  setupAutoLineBreaks();

  // Aplicar estilos cuando se abra el modal

  const modal = document.getElementById("paymentAgreementModal");

  if (modal) {
    modal.addEventListener("shown.bs.modal", function () {
      // Re-aplicar configuración cuando se abra el modal

      setTimeout(() => {
        setupAutoLineBreaks();

        // Asegurar que el scroll funcione correctamente

        const modalBody = modal.querySelector(".modal-body");

        if (modalBody) {
          modalBody.style.overflowY = "auto";

          modalBody.style.overflowX = "hidden";

          modalBody.style.maxHeight = "calc(95vh - 120px)";

          // Forzar el scroll si es necesario

          modalBody.scrollTop = 0;
        }
      }, 100);
    });

    // Prevenir que el modal se cierre al hacer scroll

    modal.addEventListener("wheel", function (e) {
      const modalBody = modal.querySelector(".modal-body");

      if (modalBody && modalBody.scrollHeight > modalBody.clientHeight) {
        e.stopPropagation();
      }
    });
  }

  // Botón de previsualizar

  const previewBtn = document.getElementById("previewPaymentAgreementBtn");

  if (previewBtn) {
    previewBtn.addEventListener("click", function () {
      // Validar monto mínimo

      const saldoDeudor = document.getElementById("pa_saldo_deudor").value;

      if (
        saldoDeudor &&
        parseFloat(saldoDeudor.replace(/[^0-9.-]/g, "")) < 10
      ) {
        Swal.fire({
          icon: "warning",

          title: "Monto inválido",

          text: "El saldo deudor debe ser mínimo $10.00",

          confirmButtonColor: "#003594",
        });

        return;
      }

      const data = getPaymentAgreementFormData();

      // Usar la variable global del número de convenio
      const convenioNumero = window.currentConvenioNumero || data.nro_ticket;
      const html = buildPaymentAgreementHtml(data, convenioNumero);

      const preview = document.getElementById("paymentAgreementPreview");

      preview.src = "data:text/html;charset=utf-8," + encodeURIComponent(html);
    });
  }

  // Botón de imprimir

  const printBtn = document.getElementById("printPaymentAgreementBtn");

  if (printBtn) {
    // 1. Añadir el Listener de Clic al botón principal

    printBtn.addEventListener("click", function () {
      // Validar monto mínimo

      const saldoDeudor = document.getElementById("pa_saldo_deudor").value;

      if (
        saldoDeudor &&
        parseFloat(saldoDeudor.replace(/[^0-9.-]/g, "")) < 10
      ) {
        Swal.fire({
          icon: "warning",

          title: "Monto inválido",

          text: "El saldo deudor debe ser mínimo $10.00",

          confirmButtonColor: "#003594",
        });

        return;
      }

      const data = getPaymentAgreementFormData();

      // Usar la variable global del número de convenio
      const convenioNumero = window.currentConvenioNumero || data.nro_ticket;
      const html = buildPaymentAgreementHtml(data, convenioNumero);

      // 2. Mostrar la alerta de éxito

      Swal.fire({
        title: "¡Acuerdo de Pago generado!",

        text: "El acuerdo de pago ha sido generado correctamente y está listo para imprimir.",

        icon: "success",

        confirmButtonText: "Imprimir",

        confirmButtonColor: "#003594",

        cancelButtonText: "Cerrar",

        cancelButtonColor: "#6c757d",

        color: "black",

        showCancelButton: true,

        allowOutsideClick: false,

        allowEscapeKey: true,
      }).then((result) => {
        // 3. Ejecutar la lógica de impresión SÓLO si el usuario presiona el botón de Confirmación ('Imprimir')

        if (result.isConfirmed) {
          // Crear una nueva ventana para imprimir

          const printWindow = window.open("", "_blank", "width=800,height=600");

          if (printWindow) {
            printWindow.document.open();

            // Agregar script para cerrar automáticamente después de guardar

            const htmlWithScript = html.replace(
              "</body>",
              `

                        <script>

                            // Función para cerrar la ventana y recargar la página principal

                            function closeAndReload() {
                                if (window.opener) {
                                    window.opener.location.reload();
                                }

                                window.close();
                            }

                            
                            
                            // Detectar cuando se completa la impresión/guardado

                            window.addEventListener('afterprint', function() {
                                setTimeout(closeAndReload, 1000);
                            });

                            
                            
                            // Detectar cuando se pierde el foco (usuario interactúa con diálogo)

                            window.addEventListener('blur', function() {
                                setTimeout(function() {

                                    if (document.hidden) {

                                        closeAndReload();

                                    }

                                }, 3000);

                            });

                            
                            
                            // Botón manual de cierre (visible solo si es necesario)

                            setTimeout(function() {

                                if (!document.querySelector('.close-btn')) {

                                    const closeBtn = document.createElement('button');

                                    closeBtn.innerHTML = '✓ Documento Guardado - Cerrar';

                                    closeBtn.className = 'close-btn';

                                    closeBtn.style.cssText = \`

                                        position: fixed;

                                        top: 10px;

                                        right: 10px;

                                        background: #28a745;

                                        color: white;

                                        border: none;

                                        padding: 10px 15px;

                                        border-radius: 5px;

                                        cursor: pointer;

                                        font-size: 12px;

                                        z-index: 9999;

                                        box-shadow: 0 2px 5px rgba(0,0,0,0.3);

                                    \`;

                                    closeBtn.onclick = closeAndReload;

                                    document.body.appendChild(closeBtn);

                                }

                            }, 5000); // Mostrar botón después de 5 segundos

                        </script>

                    </body>`
            );

            printWindow.document.write(htmlWithScript);

            printWindow.document.close();

            // Esperar a que se cargue el contenido y luego imprimir

            printWindow.onload = function () {
              printWindow.focus();

              printWindow.print();

              let reloadExecuted = false; // Flag para evitar recargas múltiples

              let checkInterval = null;

              // Función para recargar la página

              const reloadPage = () => {
                if (!reloadExecuted) {
                  reloadExecuted = true;

                  // Cerrar la ventana de impresión si aún está abierta

                  if (printWindow && !printWindow.closed) {
                    printWindow.close();
                  }

                  // Limpiar el intervalo

                  if (checkInterval) {
                    clearInterval(checkInterval);
                  }

                  // Recargar la página principal

                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              };

              // Método principal: Verificar periódicamente si la ventana se cerró

              checkInterval = setInterval(() => {
                try {
                  if (printWindow.closed) {
                    reloadPage();
                  }
                } catch (e) {
                  // Si hay error accediendo a la ventana, asumir que se cerró
                  reloadPage();
                }
              }, 500); // Verificar cada 500ms

              // Método alternativo: Detectar cuando se completa la impresión

              printWindow.addEventListener("afterprint", function () {
                reloadPage();
              });

              // Método alternativo: Detectar cuando se pierde el foco

              printWindow.addEventListener("blur", function () {
                // Esperar un poco y verificar si la ventana sigue abierta

                setTimeout(() => {
                  try {
                    if (printWindow.closed) {
                      reloadPage();
                    }
                  } catch (e) {
                    reloadPage();
                  }
                }, 3000);
              });

              // Método de respaldo: Detectar cuando se cierra la ventana

              printWindow.addEventListener("beforeunload", function () {
                reloadPage();
              });

              // Limpiar el intervalo después de 60 segundos para evitar loops infinitos

              setTimeout(() => {
                if (checkInterval) {
                  clearInterval(checkInterval);
                }
              }, 60000);
            };
          } else {
            // Manejo si el navegador bloquea la nueva ventana (pop-up)

            console.error("El navegador bloqueó la ventana de impresión.");

            Swal.fire(
              "Error",
              "El navegador bloqueó la ventana de impresión. Por favor, permita pop-ups.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // El usuario hizo clic en "Cerrar"
        }
      });
    });
  }

  // Botón de cerrar

  const closeBtn = document.getElementById("closePaymentAgreementBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      // Usar la instancia global o crear una nueva si no existe
      paymentAgreementModalInstance.hide();
    });
  }
});

function getPaymentAgreementFormData() {
  return {
    id_ticket: document.getElementById("pa_ticket_id").value,

    fecha_actual: document.getElementById("pa_fecha").value,

    nro_ticket: document.getElementById("pa_numero_ticket").value,

    coddocumento: document.getElementById("pa_rif").value,

    razonsocial: document.getElementById("pa_razon_social").value,

    ejecutivo: document.getElementById("pa_ejecutivo_venta").value,

    desc_modelo: document.getElementById("pa_marca_equipo").value,

    fecha_instalacion: document.getElementById("pa_fecha_instalacion").value,

    serialpos: document.getElementById("pa_serial").value,

    desc_estatus: document.getElementById("pa_status_pos").value,

    saldo_deudor: document.getElementById("pa_saldo_deudor").value,

    propuesta: document.getElementById("pa_propuesta").value,

    observaciones: document.getElementById("pa_observaciones").value,

    acuerdo: document.getElementById("pa_acuerdo").value,

    // Nuevos campos de configuración bancaria

    numero_cuenta: document.getElementById("pa_numero_cuenta").value,

    nombre_empresa: document.getElementById("pa_nombre_empresa").value,

    rif_empresa: document.getElementById("pa_rif_empresa").value,

    banco: document.getElementById("pa_banco").value,

    correo: document.getElementById("pa_correo").value,
  };
}

function buildPaymentAgreementHtml(d, convenioNumero = null) {
  const safe = (s) => (s || "").toString();

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString("es-ES");

    try {
      return new Date(dateStr).toLocaleDateString("es-ES");
    } catch (e) {
      return dateStr;
    }
  };

  // Función para formatear moneda

  const formatCurrency = (amount) => {
    if (!amount || amount === "") return "____.__$";

    const numericAmount = parseFloat(amount.replace(/[^0-9.-]/g, ""));

    if (isNaN(numericAmount)) return "____.__$";

    return `${numericAmount.toFixed(2)}$`;
  };

  return `

    <!DOCTYPE html>

    <html lang="es">

    <head>

        <meta charset="utf-8">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>Acuerdo de Pago - Inteligensa</title>

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

            display: flex;

            justify-content: center;

            align-items: flex-start;

            min-height: 100vh;

        }

        
        
        .container {

            max-width: 600px;

            width: 100%;

            margin: 0 auto;

            background: white;

            min-height: calc(100vh - 40px);

            display: flex;

            flex-direction: column;

            box-shadow: 0 0 20px rgba(0,0,0,0.1);

            border-radius: 8px;

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

            gap: 10px;

        }

        
        
        .info-item {

            display: flex;

            flex-direction: column;

            align-items: center;

            flex: 1;

            min-width: 0;

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

            min-height: 60px;

            align-items: flex-start;

            padding-top: 5px;

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

                display: block !important;

            }

            
            
            body {

                font-size: 10px !important;

                padding: 8px !important;

                display: flex !important;

                justify-content: center !important;

                align-items: flex-start !important;

                min-height: 100vh !important;

            }

            
            
            .container {

                max-width: 600px !important;

                width: 100% !important;

                min-height: auto !important;

                height: auto !important;

                page-break-inside: avoid;

                margin: 0 auto !important;

                box-shadow: none !important;

                border-radius: 0 !important;

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

                gap: 8px !important;

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

                <div class="document-title">Acuerdo de Pago</div>

                <div class="document-subtitle"></div>

            </div>

            
            
            <div class="document-info">

                <div class="info-item">

                    <div class="info-label">Fecha</div>

                    <div class="info-value">${formatDate(
                      d.fecha_actual || new Date()
                    )}</div>

                </div>

                <div class="info-item">

                    <div class="info-label">N° de Ticket</div>

                    <div class="info-value">${safe(d.nro_ticket)}</div>

                </div>

                <div class="info-item">

                    <div class="info-label">N° de Acuerdo</div>

                    <div class="info-value">${
                      convenioNumero || "No generado"
                    }</div>

                </div>

            </div>



            <div class="content-wrapper">

                <div class="section">

                    <div class="section-header">Datos del Cliente</div>

                    <div class="section-content">

                        <div class="field-row">

                            <div class="field-label">R.I.F. / Identificación:</div>

                            <div class="field-value">${
                              safe(d.coddocumento) || "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Razón Social:</div>

                            <div class="field-value">${
                              safe(d.razonsocial) || "_____________________"
                            }</div>

                        </div>

                    </div>

                </div>



                <div class="section">

                    <div class="section-header">Antecedentes del Equipo</div>

                    <div class="section-content">

                        <div class="field-row">

                            <div class="field-label">Ejecutivo de Venta:</div>

                            <div class="field-value">${
                              safe(d.ejecutivo) || "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Equipo MARCA:</div>

                            <div class="field-value">${
                              safe(d.desc_modelo) || "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Fecha de Instalación:</div>

                            <div class="field-value">${
                              safe(d.fecha_instalacion) ||
                              "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Serial N°:</div>

                            <div class="field-value">${
                              safe(d.serialpos) || "_____________________"
                            }</div>

                        </div>

                        <div class="field-row">

                            <div class="field-label">Status del POS:</div>

                            <div class="field-value">${
                              safe(d.desc_estatus) || "_____________________"
                            }</div>

                        </div>

                    </div>

                </div>



                <div class="section">

                    <div class="section-header">Información del Acuerdo</div>

                    <div class="section-content">

                        <div class="two-columns">

                            <div class="column">

                                <div class="column-title">Saldo deudor</div>

                                <div class="field-value">${formatCurrency(
                                  d.saldo_deudor
                                )}</div>

                            </div>

                            <div class="column">

                                <div class="column-title">Propuesta</div>

                                <div class="field-value large">${
                                  safe(d.propuesta) || "_____________________"
                                }</div>

                            </div>

                        </div>

                        <div class="two-columns">

                            <div class="column">

                                <div class="column-title">Observaciones</div>

                                <div class="field-value large">${
                                  safe(d.observaciones) ||
                                  "_____________________"
                                }</div>

                            </div>

                            <div class="column">

                                <div class="column-title">Acuerdo</div>

                                <div class="field-value large">${
                                  safe(d.acuerdo) || "_____________________"
                                }</div>

                            </div>

                        </div>

                    </div>

                </div>



                <div class="constancy">

                    <h3 style="color: #2c5aa0; margin-bottom: 10px; font-size: 12px;">INSTRUCCIONES DE PAGO</h3>

                    <p style="margin-bottom: 8px; font-size: 10px; line-height: 1.4; text-align: justify;">

                        Los pagos aquí acordados, deberán realizarse a través de depósitos a la cuenta N° <strong>${
                          safe(d.numero_cuenta) || "XXXX-XXXX-XX-XXXX"
                        }</strong> a nombre de <strong>${
    safe(d.nombre_empresa) ||
    "Informática y Telecomunicaciones Integradas Inteligen, SA"
  }</strong> ${safe(d.rif_empresa) || "J-00291615-0"} en el Banco <strong>${
    safe(d.banco) || "XXXX"
  }</strong> y notificar a través de este correo los siguientes datos: nombre y número de RIF de su comercio, número de referencia, nombre del titular de la cuenta y monto del pago <strong>${
    safe(d.correo) || "domiciliación.intelipunto@inteligensa.com"
  }</strong>. Recordar que cada vez que se realice un pago debe ser a la Tasa del BCV del día.

                    </p>

                </div>



                <div class="signature-section">

                    <div class="signature-box">

                        <div class="signature-label">Firma del Cliente</div>

                        <div class="signature-space"></div>

                        <div class="signature-line"></div>

                        <div class="signature-field">Nombre: _____________________</div>

                        <div class="signature-field">C.I.: _____________________</div>

                    </div>

                    
                    
                    <div class="signature-box">

                        <div class="signature-label">Firma de Inteligensa</div>

                        <div class="signature-space"></div>

                        <div class="signature-line"></div>

                        <div class="signature-field">Nombre: ${
                          safe(d.ejecutivo) || "_____________________"
                        }</div>

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

                            <div class="footer-rif">RIF: J-00291615-0'</div>

                        </div>

                    </div>

                    <div class="footer-text">

                        <p>El cliente certifica su responsabilidad de cumplir con los términos y condiciones del acuerdo de pago establecido en este documento.</p>

                        <p>Generado: ${new Date().toLocaleString("es-ES")}</p>

                    </div>

                </div>

            </div>

        </div>

    </body>

    </html>`;
}

  const generateNotaEntregaBtn = document.getElementById(
      "generateNotaEntregaBtn"
    );

    if (generateNotaEntregaBtn) {
      generateNotaEntregaBtn.addEventListener("click", function () {
        if (!currentSelectedTicket) {
          Swal.fire({
            icon: "warning",

            title: "Ticket no disponible",

            text: "No se encontró el ID del ticket para generar el acuerdo de pago.",
          });

          return;
        }

        // Obtener datos del ticket para el acuerdo de pago

        const xhr = new XMLHttpRequest();

        xhr.open(
          "POST",
          `${ENDPOINT_BASE}${APP_PATH}api/documents/GetPaymentAgreementData`
        );

        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );

        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);

              if (!res || !res.success || !res.rows) {
                Swal.fire({
                  icon: "warning",

                  title: "No se encontraron datos",

                  text: "No se pudieron obtener los datos del ticket para generar el acuerdo de pago.",
                });

                return;
              }

              const d = res.rows[0];

              window.currentPaymentAgreementData = d;

              // Llenar el modal con los datos del ticket

              fillPaymentAgreementModal(d);

              // Cerrar el modal actual y abrir el modal de acuerdo de pago
                const modal = document.getElementById('uploadDocumentModal');
                const bootstrapModal = new bootstrap.Modal(modal);

              bootstrapModal.hide();

              setTimeout(() => {
                // Usar la instancia global o crear una nueva si no existe

                if (!paymentAgreementModalInstance) {
                  paymentAgreementModalInstance = new bootstrap.Modal(
                    document.getElementById("paymentAgreementModal")
                  );
                }

                paymentAgreementModalInstance.show();
              }, 300);
            } catch (error) {
              console.error("Error parsing JSON:", error);

              Swal.fire({
                icon: "error",

                title: "Error al procesar datos",

                text: "Hubo un error al procesar los datos del ticket.",
              });
            }
          } else {
            Swal.fire({
              icon: "error",

              title: "Error del servidor",

              text: `Error ${xhr.status}: ${xhr.statusText}`,
            });
          }
        };

        xhr.onerror = function () {
          Swal.fire({
            icon: "error",

            title: "Error de conexión",

            text: "No se pudo conectar al servidor para obtener los datos del ticket.",
          });
        };

        const data = `action=GetPaymentAgreementData&id_ticket=${currentSelectedTicket}`;

        xhr.send(data);
      });
    }

    
function fillPaymentAgreementModal(d) {
  // Verificar que d existe

  if (!d) {
    console.error("No data provided to fillPaymentAgreementModal");

    return;
  }

  const safe = (s) => (s || "").toString();

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString("es-ES");

    try {
      return new Date(dateStr).toLocaleDateString("es-ES");
    } catch (e) {
      return dateStr;
    }
  };

  // Llenar campos del modal

  document.getElementById("pa_ticket_id").value = safe(d.id_ticket);

  document.getElementById("pa_fecha").value = formatDate(d.fecha_actual);

  const numeroTicketValue = window.currentConvenioNumero || safe(d.nro_ticket);
  document.getElementById("pa_numero_ticket").value = numeroTicketValue;

  document.getElementById("pa_rif").value = safe(d.coddocumento);

  document.getElementById("pa_razon_social").value = safe(d.razonsocial);

  document.getElementById("pa_ejecutivo_venta").value = safe(d.ejecutivo) || "";

  document.getElementById("pa_marca_equipo").value =
    safe(d.desc_modelo) || safe(d.tipo_pos) || "";

  document.getElementById("pa_fecha_instalacion").value =
    safe(d.fechainstalacion) || "";

  document.getElementById("pa_serial").value = safe(d.serialpos);

  document.getElementById("pa_status_pos").value = safe(d.desc_estatus) || "";

  // Limpiar campos editables

  document.getElementById("pa_saldo_deudor").value = "";

  document.getElementById("pa_propuesta").value = "";

  document.getElementById("pa_observaciones").value = "";

  document.getElementById("pa_acuerdo").value = "";

  // Limpiar campos de configuración bancaria (opcional - mantener valores por defecto)

  // document.getElementById('pa_numero_cuenta').value = 'XXXX-XXXX-XX-XXXX';

  // document.getElementById('pa_nombre_empresa').value = 'Informática y Telecomunicaciones Integradas Inteligen, SA';

  // document.getElementById('pa_rif_empresa').value = 'J-00291615-0';

  // document.getElementById('pa_banco').value = 'XXXX';

  // document.getElementById('pa_correo').value = 'domiciliación.intelipunto@inteligensa.com';
}


$(document).on('click', '#generateNotaEntregaBtn2', function () {
    const ticketId = document.getElementById('id_ticket').value;
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
                $('#ne_region_origen').val(d.estado_final || d.estado || '');
                $('#ne_region_destino').val(regDes);
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
                  <div class="field-label">Periféricos:</div>
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