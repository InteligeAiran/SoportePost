let currentSelectedTicket = null;
let currentTicketNroForImage = null;
let paymentAgreementModalInstance = null;
let detailedPaymentModalInstance = null;
let currentIdPaymentRecord = null; // Para seguimiento de aprobación individual
let currentTicketIdForImage = null; // Variable global para el ID del ticket en el visor de imágenes
let viewedPayments = new Set(); // Para rastrear pagos ya visualizados por el usuario
let modalAgregarDatosPagoInstance = null; // Instancia global para el modal de carga de pagos


document.addEventListener('DOMContentLoaded', function() {
    const approveTicketFromImageBtn = document.getElementById('approveTicketFromImage');
    paymentAgreementModalInstance = new bootstrap.Modal(document.getElementById("paymentAgreementModal"));
    const modalPagoEl = document.getElementById("modalAgregarDatosPago");
    if (modalPagoEl) {
        modalAgregarDatosPagoInstance = new bootstrap.Modal(modalPagoEl);
    }
    
    if (approveTicketFromImageBtn) {
        approveTicketFromImageBtn.addEventListener('click', handleTicketApprovalFromImage);
    }

    // --- INICIALIZACIÓN DE LOGICA DE PAGO ---
    if (typeof setupPaymentMethodsLoader === 'function') {
        setupPaymentMethodsLoader();
    }
    if (typeof setupCurrencyListener === 'function') {
        setupCurrencyListener();
    }
    if (typeof setupFormaPagoListener === 'function') {
        setupFormaPagoListener();
    }
    // ----------------------------------------

    // Listener para restaurar el modal de detalles al cerrar el de imagen
    const imageApprovalModalElement = document.getElementById("imageApprovalModal");
    if (imageApprovalModalElement) {
        imageApprovalModalElement.addEventListener('hidden.bs.modal', function () {
            // Ya no es necesario restaurar manualmente porque ahora usamos modales apilados (stacked)
            console.log('Imagen cerrada, el modal de detalles debería seguir visible debajo.');
        });
    }

    // Listener para los botones cerrar del modal de detalles de pagos (la X y el botón Cerrar)
    const modalPagosDetalleElement = document.getElementById('modalPagosDetalle');
    if (modalPagosDetalleElement) {
        const closeButtons = modalPagosDetalleElement.querySelectorAll('.btn-close, [data-bs-dismiss="modal"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (detailedPaymentModalInstance) {
                    detailedPaymentModalInstance.hide();
                }
            });
        });

        // Al ocultar el modal de detalles, resetear el seguimiento de pago individual
        modalPagosDetalleElement.addEventListener('hidden.bs.modal', function() {
            currentIdPaymentRecord = null;
        });
    }
});

// Función centralizada para validar campos de corrección de pago si están visibles
function validatePaymentCorrectionFields() {
    const missingFields = [];
    
    // Validar Referencia
    const referenceCorrectionField = document.getElementById('referenceCorrectionField');
    if (referenceCorrectionField && window.getComputedStyle(referenceCorrectionField).display !== 'none') {
        const referenceCorrectOnly = document.getElementById('paymentReferenceCorrectOnly');
        if (!referenceCorrectOnly || referenceCorrectOnly.value.trim() === '') {
            missingFields.push('Nro de Referencia Correcto');
        }
    }
    
    // Validar Fecha
    const dateCorrectionField = document.getElementById('dateCorrectionField');
    if (dateCorrectionField && window.getComputedStyle(dateCorrectionField).display !== 'none') {
        const dateCorrectOnly = document.getElementById('paymentDateCorrectOnly');
        if (!dateCorrectOnly || dateCorrectOnly.value.trim() === '') {
            missingFields.push('Fecha de Pago Correcta');
        }
    }

    // Validar Monto
    const amountCorrectionField = document.getElementById('amountCorrectionField');
    if (amountCorrectionField && window.getComputedStyle(amountCorrectionField).display !== 'none') {
        const amountCorrectOnly = document.getElementById('paymentAmountCorrectOnly');
        if (!amountCorrectOnly || amountCorrectOnly.value.trim() === '') {
            missingFields.push('Monto de Pago Correcto');
        }
    }
    
    return missingFields;
}

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
            const container = document.querySelector('.swal2-container');
            const popup = document.querySelector('.swal2-popup');
            
            if (container) {
                container.style.zIndex = '2060';
                container.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                container.style.backdropFilter = 'blur(8px)';
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
            // Si es un tipo de pago, validar campos antes de aprobar
            const isPaymentDoc = ['Anticipo', 'pago', 'Pago', 'comprobante_pago'].includes(documentType);
            
            if (isPaymentDoc) {
                const missingFields = validatePaymentCorrectionFields();
                
                // Si hay campos visibles vacíos, mostrar alerta y detener
                if (missingFields.length > 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campos Requeridos',
                        html: `Por favor, complete los siguientes campos antes de aprobar:<br><strong>${missingFields.join('<br>')}</strong>`,
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#003594',
                        color: 'black',
                        didOpen: () => {
                            const container = document.querySelector('.swal2-container');
                            if (container) {
                                container.style.zIndex = '2060';
                            }
                        }
                    });
                    return; // Detener la ejecución
                }
            }
            
            // Caputrar datos verificados
            const referenceCorrectOnly = document.getElementById('paymentReferenceCorrectOnly');
            const dateCorrectOnly = document.getElementById('paymentDateCorrectOnly');
            const amountCorrectOnly = document.getElementById('paymentAmountCorrectOnly');
            
            const refVerified = referenceCorrectOnly ? referenceCorrectOnly.value.trim() : '';
            const dateVerified = dateCorrectOnly ? dateCorrectOnly.value.trim() : '';
            const amountVerifiedValue = amountCorrectOnly ? amountCorrectOnly.value.trim() : '';

            // Si llegamos aquí, los campos están completos o no son visibles, realizar la aprobación
            approveTicket(nro_ticket, documentType, id_ticket, refVerified, dateVerified, amountVerifiedValue);
        }
    });
}

// Función para enviar la solicitud de aprobación
function approveTicket(nro_ticket, documentType, id_ticket, refPassed = '', datePassed = '', amountPassed = '') {
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
                        color: 'black',
                        didOpen: () => {
                            const container = document.querySelector('.swal2-container');
                            if (container) {
                                container.style.zIndex = '2060';
                            }
                        }
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
                        confirmButtonColor: '#dc3545',
                        didOpen: () => {
                            const container = document.querySelector('.swal2-container');
                            if (container) {
                                container.style.zIndex = '2060';
                            }
                        }
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
                    confirmButtonColor: '#dc3545',
                    didOpen: () => {
                        const container = document.querySelector('.swal2-container');
                        if (container) {
                            container.style.zIndex = '2060';
                        }
                    }
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
                confirmButtonColor: '#dc3545',
                didOpen: () => {
                    const container = document.querySelector('.swal2-container');
                    if (container) {
                        container.style.zIndex = '2060';
                    }
                }
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
            confirmButtonColor: '#dc3545',
            didOpen: () => {
                const container = document.querySelector('.swal2-container');
                if (container) {
                    container.style.zIndex = '2060';
                }
            }
        });
    };

    // Si es documento de Anticipo, validar y obtener los datos verificados
    let verifiedReference = refPassed;
    let verifiedDate = datePassed;
    let verifiedAmount = amountPassed;
    
    if (documentType === 'Anticipo' || documentType === 'pago' || documentType === 'Pago' || documentType === 'comprobante_pago') {
        console.log('Documento es de tipo Pago/Anticipo, validando campos verificados...');
        
        // Verificar si hay datos en los campos de corrección individuales
        const referenceCorrectNo = document.getElementById('referenceCorrectNo');
        const dateCorrectNo = document.getElementById('dateCorrectNo');
        const referenceCorrectionField = document.getElementById('referenceCorrectionField');
        const dateCorrectionField = document.getElementById('dateCorrectionField');
        
        // Verificar si los campos están visibles
        const isReferenceFieldVisible = referenceCorrectionField && 
                                       window.getComputedStyle(referenceCorrectionField).display !== 'none';
        const isDateFieldVisible = dateCorrectionField && 
                                  window.getComputedStyle(dateCorrectionField).display !== 'none';
        
        console.log('Campo de referencia visible:', isReferenceFieldVisible);
        console.log('Campo de fecha visible:', isDateFieldVisible);
        
        // Validar campos visibles
        const missingFields = [];
        
        if (isReferenceFieldVisible) {
            const referenceCorrectOnly = document.getElementById('paymentReferenceCorrectOnly');
            if (!referenceCorrectOnly || referenceCorrectOnly.value.trim() === '') {
                missingFields.push('Nro de Referencia Correcto');
            }
        }
        
        if (isDateFieldVisible) {
            const dateCorrectOnly = document.getElementById('paymentDateCorrectOnly');
            if (!dateCorrectOnly || dateCorrectOnly.value.trim() === '') {
                missingFields.push('Fecha de Pago Correcta');
            }
        }

        const amountCorrectNo = document.getElementById('amountCorrectNo');
        const amountCorrectionField = document.getElementById('amountCorrectionField');
        const isAmountFieldVisible = amountCorrectionField && window.getComputedStyle(amountCorrectionField).display !== 'none';
        
        if (isAmountFieldVisible) {
            const amountCorrectOnly = document.getElementById('paymentAmountCorrectOnly');
            if (!amountCorrectOnly || amountCorrectOnly.value.trim() === '') {
                missingFields.push('Monto de Pago Correcto');
            }
        }
        
        // Si hay campos visibles vacíos, mostrar alerta y detener
        if (missingFields.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Requeridos',
                html: `Por favor, complete los siguientes campos antes de aprobar:<br><strong>${missingFields.join('<br>')}</strong>`,
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003594',
                color: 'black',
                didOpen: () => {
                    const container = document.querySelector('.swal2-container');
                    if (container) {
                        container.style.zIndex = '2060';
                    }
                }
            });
            return; // Detener la ejecución
        }
        
        // Si llegamos aquí, los campos están completos o no son visibles
        // Si el radio de referencia está en "No", usar el valor corregido
        if (referenceCorrectNo && referenceCorrectNo.checked) {
            const referenceCorrectOnly = document.getElementById('paymentReferenceCorrectOnly');
            if (referenceCorrectOnly && referenceCorrectOnly.value.trim() !== '') {
                verifiedReference = referenceCorrectOnly.value.trim();
                console.log('Nro de referencia verificado capturado:', verifiedReference);
            }
        }
        
        // Si el radio de fecha está en "No", usar el valor corregido
        if (dateCorrectNo && dateCorrectNo.checked) {
            const dateCorrectOnly = document.getElementById('paymentDateCorrectOnly');
            if (dateCorrectOnly && dateCorrectOnly.value.trim() !== '') {
                verifiedDate = dateCorrectOnly.value.trim();
                console.log('Fecha de pago verificada capturada:', verifiedDate);
            }
        }
        
        // Si el radio de monto está en "No", usar el valor corregido
        if (amountCorrectNo && amountCorrectNo.checked) {
            const amountCorrectOnly = document.getElementById('paymentAmountCorrectOnly');
            if (amountCorrectOnly && amountCorrectOnly.value.trim() !== '') {
                verifiedAmount = amountCorrectOnly.value.trim();
                console.log('Monto de pago verificado capturado:', verifiedAmount);
            }
        }
        
        console.log('Datos verificados finales - Referencia:', verifiedReference, 'Fecha:', verifiedDate, 'Monto:', verifiedAmount);
    }
    
    // Enviar los datos
    let data = `action=approve-document&nro_ticket=${encodeURIComponent(nro_ticket)}&document_type=${encodeURIComponent(documentType)}&id_user=${encodeURIComponent(id_user)}&id_ticket=${encodeURIComponent(id_ticket)}`;
    
    if (typeof currentIdPaymentRecord !== 'undefined' && currentIdPaymentRecord !== null) {
        data += `&id_payment_record=${encodeURIComponent(currentIdPaymentRecord)}`;
    }
    
    // Agregar datos verificados si es un tipo de pago y hay valores
    if (documentType === 'Anticipo' || documentType === 'pago' || documentType === 'Pago' || documentType === 'comprobante_pago') {
        if (verifiedReference) {
            data += `&nro_payment_reference_verified=${encodeURIComponent(verifiedReference)}`;
        }
        if (verifiedDate) {
            data += `&payment_date_verified=${encodeURIComponent(verifiedDate)}`;
        }
        if (verifiedAmount) {
            data += `&amount_verified=${encodeURIComponent(verifiedAmount)}`;
        }
        console.log('Datos a enviar:', data);
    }
    
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
        //name_status_payment: "Estatus Pago",
        name_status_domiciliacion: "Estatus Domiciliación",
        id_status_domiciliacion: "Id Estatus Domiciliacion",
        //document_type: "Tipo Documento",
        original_filename: "Nombre Archivo",
        //motivo_rechazo: "Motivo Rechazo",
        uploaded_at: "Fecha Subida",
        info: "Info"
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
                                name: 'id_status_payment', // ✅ AÑADIR NOMBRE
                                title: 'ID Status Payment',
                                visible: false, // ✅ OCULTA PERO DISPONIBLE PARA BÚSQUEDA
                                searchable: true
                            });
                        }
                        
                        if (allDataKeys.includes('id_status_domiciliacion')) {
                            columnsConfig.push({
                                data: 'id_status_domiciliacion',
                                name: 'id_status_domiciliacion', // ✅ AÑADIR NOMBRE
                                title: 'ID Status Domiciliación',
                                visible: false,
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
                                    name: key, // ✅ AÑADIR NOMBRE
                                    title: columnTitles[key],
                                    defaultContent: "",
                                    visible: isVisible,
                                    render: function (data, type, row) {
                                        if (type === 'display') {
                                            // Lógica especial para Estatus Pago
                                            if (key === 'name_status_payment') {
                                                const idStatus = parseInt(row.id_status_payment);
                                                const hasRejectedDocs = row.ticket_tiene_documentos_rechazados === 'Sí';
                                                
                                                if (idStatus === 12 || idStatus === 13 || idStatus === 14 || hasRejectedDocs) { // Rechazado
                                                    return `<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i>${hasRejectedDocs ? 'Documento Rechazado' : data}</span>`;
                                                } else if (idStatus === 6) { // Aprobado
                                                    return `<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>${data}</span>`;
                                                } else if (idStatus === 17) { // Pendiente por Revisión
                                                    return `<span class="badge bg-info text-dark"><i class="fas fa-clock me-1"></i>${data}</span>`;
                                                } else {
                                                    return `<span class="badge bg-warning text-dark">${data}</span>`;
                                                }
                                            }

                                            // Lógica para columnas Sí/No y Rechazos
                                            if (['pago', 'exoneracion', 'envio', 'envio_destino', 'ticket_tiene_documentos_rechazados', 'anticipo_rechazado', 'exoneracion_rechazado', 'envio_rechazado', 'envio_destino_rechazado'].includes(key)) {
                                                if (data === 'Sí') {
                                                    const isRedBadge = key.includes('rechazado') || key === 'ticket_tiene_documentos_rechazados';
                                                    return `<span class="badge ${isRedBadge ? 'bg-danger' : 'bg-success'}">${data}</span>`;
                                                } else {
                                                    return `<span class="badge bg-secondary text-white">${data}</span>`;
                                                }
                                            }

                                            // Lógica para Garantías y Confirmaciones (booleanos -> Sí/No)
                                            if (['garantia_instalacion', 'garantia_reingreso', 'confirmcoord', 'confirmtecn'].includes(key)) {
                                                const val = (data === true || data === 'true' || data === 't' || data === 1);
                                                return `<span class="badge ${val ? 'bg-success' : 'bg-secondary'}">${val ? 'Sí' : 'No'}</span>`;
                                            }
                                            
                                            // Truncamiento para otras columnas
                                            if (data) {
                                                const displayLength = 25;
                                                const fullText = String(data);
                                                
                                                if (fullText.length > displayLength) {
                                                    return `<span class="truncated-cell" data-full-text="${fullText.replace(/"/g, '&quot;')}">${fullText.substring(0, displayLength)}...</span>`;
                                                } else {
                                                    return `<span class="expanded-cell" data-full-text="${fullText.replace(/"/g, '&quot;')}">${fullText}</span>`;
                                                }
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
                                const idStatusPayment = row.id_status_payment || '';
                                
                                const isRejected = idMotivoRechazo !== null && motivoRechazo !== null;
                                
                                if (row.name_status_payment === "Pendiente Por Cargar Documentos") {
                                    actionButtons = `<button class="btn btn-secondary btn-sm" title="Pendiente Por Cargar Documentos" disabled>
                                                        Cargue Documentos <i class="fas fa-file-upload"></i>
                                                     </button>`;
                                } else {
                                    actionButtons = '';
                                
                                // AGREGAR BOTÓN DE INFO SI ES ANTICIPO (O SIEMPRE SI SE PREFIERE)
                                if (documentType === 'Anticipo' || pago === 'Sí') {
                                    const rif = row.rif || '';
                                    const razonSocial = row.razonsocial_cliente || '';
                                    
                                    actionButtons += `
                                        <button class="btn btn-secondary btn-sm view-payments-info-btn ms-1" 
                                                data-nro-ticket="${nro_ticket}" 
                                                data-rif="${rif}"
                                                data-razon-social="${razonSocial}"
                                                data-serial-pos="${serial_pos || ''}"
                                                data-id-status-payment="${idStatusPayment}"
                                                data-estatus-pos="${row.estatus_inteliservices || 'No disponible'}"
                                                title="Detalle de Pagos">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                            </svg>
                                        </button>
                                    `;
                                }
                                const isRejectedStatus = [12, 13].includes(parseInt(idStatusPayment));
                                
                                if (isRejectedStatus) {
                                    actionButtons += `
                                        <button class="btn btn-warning btn-sm upload-new-doc-btn ms-1" 
                                                data-id="${idTicket}" 
                                                data-nro-ticket="${nro_ticket}" 
                                                data-serial-pos="${serial_pos}"
                                                data-document-type="${documentType || ''}"
                                                data-motivo-rechazo="${motivoRechazo || ''}"
                                                data-estatus-pos="${row.estatus_inteliservices || 'No disponible'}"
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

                                const id_area = document.getElementById('id_area').value;
                                const id_rol = document.getElementById('id_rol').value;

                                let buttonsHtml = '';

                                // Lógica de visualización de filtros según Area y Rol
                                if (id_rol == 1) {
                                    // Super Admin: Ver TODOS los filtros
                                     buttonsHtml += `
                                    <button id="btn-por-asignar" class="btn btn-primary me-2" title="Anticipos Pendientes por Revisión">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                        </svg>
                                    </button>

                                    <button id="btn-anticipos-aprobados" class="btn btn-secondary me-2" title="Anticipos Aprobados">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                        </svg>
                                    </button>

                                    <button id="btn-asignados" class="btn btn-secondary me-2" title="Anticipos Rechazados">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                        </svg>
                                    </button>

                                    <button id="btn-recibidos" class="btn btn-secondary me-2" title="Exoneraciones Pendientes por Revisión"> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                        </svg>
                                    </button>

                                    <button id="btn-aprobado_exoneracion" class="btn btn-secondary me-2" title="Exoneraciones Aprobadas">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                        </svg>
                                    </button>

                                    <button id="btn-rechazado_exoneracion" class="btn btn-secondary me-2" title="Exoneraciones Rechazadas">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                        </svg>
                                    </button>
                                    `;    
                                    /* id_area = 2 (Tesoreria) || id_rol = 5 (Administrativo) */ /* id_area = 6 (El rosal) || id_rol = 4 (Coordinador) */
                                } else if ((id_area == 2 && id_rol == 5) || (id_area == 5 && id_rol == 4)){
                                    // Filtros de Anticipos
                                    buttonsHtml += `
                                    <button id="btn-por-asignar" class="btn btn-primary me-2" title="Anticipos Pendientes por Revisión">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                        </svg>
                                    </button>

                                    <button id="btn-anticipos-aprobados" class="btn btn-secondary me-2" title="Anticipos Aprobados">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                        </svg>
                                    </button>

                                    <button id="btn-asignados" class="btn btn-secondary me-2" title="Anticipos Rechazados">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                        </svg>
                                    </button>
                                    `;
                                       /* id_area = 3 (Taller Boleita) || id_rol = 5 (Administrativo) */ /* id_area = 1 (Finanzas) || id_rol = 6 (Analista Financiero) */
                                } else if ((id_area == 3 && id_rol == 5) || (id_area == 1 && id_rol == 6)) {
                                    // Filtros de Exoneración (OCULTOS POR SOLICITUD)
                                      buttonsHtml += `
                                    <button id="btn-recibidos" class="btn btn-secondary me-2" title="Exoneraciones Pendientes"> <!-- Título asumido, ajustar si es necesario -->
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                        </svg>
                                    </button>

                                    <button id="btn-aprobado_exoneracion" class="btn btn-secondary me-2" title="Exoneraciones Aprobadas">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                        </svg>
                                    </button>

                                    <button id="btn-rechazado_exoneracion" class="btn btn-secondary me-2" title="Exoneraciones Rechazadas">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                        </svg>
                                    </button>
                                    `;
                                } else {
                                    // Default behavior: Show Anticipos (or maybe nothing? Staying safe and showing Anticipos as fallback or if user matches neither but has access)
                                    // For now, let's show Anticipos as default to avoid empty UI for other roles, or hide everything if strict?
                                    // User requirement was specific "Display... ONLY when".
                                    // So for others, buttonsHtml will be empty.
                                    // However, to avoid confusion if I misconfigured roles, I will leave it empty.
                                }

                                /*
                                const buttonsHtml = `
                                    <button id="btn-por-asignar" class="btn btn-primary me-2" title="Anticipos Pendientes por Revisión">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                        </svg>
                                    </button>

                                    <button id="btn-anticipos-aprobados" class="btn btn-secondary me-2" title="Anticipos Aprobados">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                        </svg>
                                    </button>

                                    <button id="btn-asignados" class="btn btn-secondary me-2" title="Anticipos Rechazados">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                        </svg>
                                    </button>
                                `;
                                */

                                $(".dt-buttons-container").addClass("d-flex").html(buttonsHtml);

                                function setActiveButton(activeButtonId) {
                                    const allButtons = [
                                        "#btn-por-asignar", 
                                        "#btn-anticipos-aprobados", 
                                        "#btn-asignados",
                                        "#btn-recibidos",
                                        "#btn-aprobado_exoneracion",
                                        "#btn-rechazado_exoneracion"
                                    ];

                                    allButtons.forEach(btnId => {
                                        $(btnId).removeClass("btn-primary").addClass("btn-secondary");
                                    });

                                    $(`#${activeButtonId}`).removeClass("btn-secondary").addClass("btn-primary");
                                }

                                // ✅ FUNCIÓN CENTRALIZADA PARA APLICAR FILTROS
                                function applyFilters(buttonId) {
                                    // 1. Limpiar filtros anteriores
                                    $.fn.dataTable.ext.search.pop();
                                    api.columns().search('').draw(false);
                                    
                                    // 2. Configurar el filtro por tipo de documento si aplica
                                    let allowedTypes = [];
                                    if (["btn-por-asignar", "btn-anticipos-aprobados", "btn-asignados"].includes(buttonId)) {
                                        allowedTypes = ['Anticipo', 'Pago', 'Envio', 'Envio_Destino'];
                                    } else if (["btn-recibidos", "btn-aprobado_exoneracion", "btn-rechazado_exoneracion"].includes(buttonId)) {
                                        allowedTypes = ['Exoneracion'];
                                    }

                                    if (allowedTypes.length > 0) {
                                        $.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData) {
                                            if (settings.nTable.id !== 'tabla-ticket') return true;
                                            const docType = rowData.document_type; 
                                            return allowedTypes.includes(docType);
                                        });
                                    }

                                    // 3. Aplicar filtros de estatus específicos por botón
                                    if (buttonId === "btn-por-asignar") {
                                        // Incluir 7 (Pendiente), 17 (Pago Pendiente) y 13 (Rechazado)
                                        api.column('id_status_payment:name').search('^7$|^17$|^13$', true, false, true);
                                        api.column('original_filename:name').visible(false);
                                    } else if (buttonId === "btn-anticipos-aprobados") {
                                        api.column('id_status_payment:name').search('^6$', true, false, true);
                                        api.column('original_filename:name').visible(false);
                                    } else if (buttonId === "btn-recibidos") {
                                        api.column('id_status_payment:name').search('^5$', true, false, true);
                                        api.column('original_filename:name').visible(false);
                                    } else if (buttonId === "btn-aprobado_exoneracion") {
                                        api.column('id_status_payment:name').search('^4$', true, false, true);
                                        api.column('original_filename:name').visible(false);
                                    } else if (buttonId === "btn-rechazado_exoneracion") {
                                        api.column('id_status_payment:name').search('^12$', true, false, true);
                                        api.column('motivo_rechazo:name').visible(true);
                                    } else if (buttonId === "btn-asignados") {
                                        api.column('motivo_rechazo:name').visible(true);
                                        api.column('original_filename:name').visible(true);
                                        api.column('document_type:name').visible(true);
                                        api.column('id_status_payment:name').visible(false);
                                        
                                        // Modificar el filtro de búsqueda para incluir lógica de rechazados
                                        const originalSearch = $.fn.dataTable.ext.search.pop(); // Sacar el de tipos para combinarlo
                                        $.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData) {
                                            if (settings.nTable.id !== 'tabla-ticket') return true;
                                            
                                            const idPayment = parseInt(rowData.id_status_payment || searchData[1]);
                                            const hasRejectedDocs = rowData.ticket_tiene_documentos_rechazados === 'Sí';
                                            const isRejected = idPayment === 13 || hasRejectedDocs;
                                            const docType = rowData.document_type;
                                            const isAllowedType = ['Anticipo', 'Pago', 'Envio', 'Envio_Destino'].includes(docType);

                                            return isRejected && isAllowedType;
                                        });
                                    }

                                    // 4. Dibujar la tabla y marcar el botón activo
                                    api.draw();
                                    setActiveButton(buttonId);
                                }

                            // ✅ FUNCIÓN MEJORADA: Verificar si hay datos considerando el tipo de documento
                            function checkDataExistsDetailed(buttonId, searchTerms) {
                                // Limpiar filtros para el conteo
                                api.columns().search('').draw(false);
                                $.fn.dataTable.ext.search.pop();

                                // Definir tipos permitidos para este botón
                                let allowedTypes = [];
                                if (["btn-por-asignar", "btn-anticipos-aprobados", "btn-asignados"].includes(buttonId)) {
                                    allowedTypes = ['Anticipo', 'Pago', 'Envio', 'Envio_Destino'];
                                } else if (["btn-recibidos", "btn-aprobado_exoneracion", "btn-rechazado_exoneracion"].includes(buttonId)) {
                                    allowedTypes = ['Exoneracion'];
                                }

                                // Aplicar filtro de tipo temporalmente
                                if (allowedTypes.length > 0) {
                                    $.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData) {
                                        if (settings.nTable.id !== 'tabla-ticket') return true;
                                        return allowedTypes.includes(rowData.document_type);
                                    });
                                }

                                let hasData = false;
                                searchTerms.forEach(searchTerm => {
                                    if (searchTerm.column === 'id_status_payment') {
                                        api.column('id_status_payment:name').search(searchTerm.value, true, false, true).draw();
                                        if (api.rows({ filter: 'applied' }).count() > 0) hasData = true;
                                        api.column('id_status_payment:name').search('').draw(false);
                                    }
                                });
                                
                                // Limpiar filtro temporal
                                $.fn.dataTable.ext.search.pop();
                                return hasData;
                            }

                            // ✅ FUNCIÓN MEJORADA: Buscar automáticamente el primer botón con datos
                            function findFirstButtonWithData() {
                                const searchConfigs = [
                                    { 
                                        button: "btn-por-asignar", 
                                        searchTerms: [{ column: 'id_status_payment', value: '^7$|^17$|^13$' }]
                                    },
                                    { 
                                        button: "btn-anticipos-aprobados", 
                                        searchTerms: [{ column: 'id_status_payment', value: '^6$' }]
                                    },
                                    { 
                                        button: "btn-asignados", 
                                        searchTerms: [{ column: 'id_status_payment', value: '^13$' }]
                                    },
                                    {
                                        button: "btn-recibidos",
                                        searchTerms: [{ column: 'id_status_payment', value: '^5$' }]
                                    },
                                    {
                                        button: "btn-aprobado_exoneracion",
                                        searchTerms: [{ column: 'id_status_payment', value: '^4$' }]
                                    },
                                    {
                                        button: "btn-rechazado_exoneracion",
                                        searchTerms: [{ column: 'id_status_payment', value: '^12$' }]
                                    }
                                ];

                                for (let i = 0; i < searchConfigs.length; i++) {
                                    const { button, searchTerms } = searchConfigs[i];
                                    
                                    if ($(`#${button}`).length === 0) continue;

                                    if (checkDataExistsDetailed(button, searchTerms)) {
                                        applyFilters(button);
                                        return true;
                                    }
                                }
                                
                                // Si no hay datos, mostrar mensaje
                                api.columns().search('').draw(false);
                                api.column('id_status_payment:name').search("NO_DATA_FOUND").draw();

                                const tbody = document.querySelector("#tabla-ticket tbody");
                                if (tbody) {
                                    tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">No hay tickets disponibles en ningún estado</td></tr>';
                                }
                                
                                return false;
                            }

                            // Ejecutar la búsqueda automática al inicializar
                            findFirstButtonWithData();

                            // ✅ EVENT LISTENERS SIMPLIFICADOS
                            $("#btn-por-asignar").on("click", function () { applyFilters("btn-por-asignar"); });
                            $("#btn-anticipos-aprobados").on("click", function () { applyFilters("btn-anticipos-aprobados"); });
                            $("#btn-recibidos").on("click", function () { applyFilters("btn-recibidos"); });
                            $("#btn-aprobado_exoneracion").on("click", function () { applyFilters("btn-aprobado_exoneracion"); });
                            $("#btn-rechazado_exoneracion").on("click", function () { applyFilters("btn-rechazado_exoneracion"); });
                            $("#btn-asignados").on("click", function () { applyFilters("btn-asignados"); });
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
                            const ticketData = {
                                id: $(this).data("id"),
                                nroTicket: $(this).data("nro-ticket"),
                                serialPos: $(this).data("serial-pos"),
                                documentType: $(this).data("document-type"),
                                motivoRechazo: $(this).data("motivo-rechazo"),
                                estatusPos: $(this).data("estatus-pos")
                            };
                            
                            currentSelectedTicket = ticketData.id;

                            if (ticketData.documentType === 'Anticipo') {
                                if (typeof openDetailedPaymentModal === 'function') {
                                    openDetailedPaymentModal(this);
                                } else {
                                    // Fallback si no está definida aún
                                    showUploadNewDocumentModal(ticketData.id, ticketData.nroTicket, ticketData.serialPos, ticketData.documentType, ticketData.motivoRechazo, ticketData.estatusPos);
                                }
                            } else {
                                showUploadNewDocumentModal(ticketData.id, ticketData.nroTicket, ticketData.serialPos, ticketData.documentType, ticketData.motivoRechazo, ticketData.estatusPos);
                            }
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
                            // Obtener la instancia de DataTable
                            const table = $('#tabla-ticket').DataTable();
                            const tr = $(this).closest('tr');
                            const row = table.row(tr);
                            const rowData = row.data();

                            const ticketId = rowData.id_ticket; // Obtener ID directo de los datos
                            const nroTicket = rowData.nro_ticket;
                            const serialPos = rowData.serial_pos;
                            const documentoRechazado = rowData.motivo_rechazo !== null;
                            const idStatusPayment = rowData.id_status_payment;
                            
                            const envioValor = $(this).data("envio");
                            const exoValor = $(this).data("exoneracion");
                            const pagoValor = $(this).data("anticipo");
                            
                            // Resetear ID de pago individual por si venimos del botón de la tabla principal
                            currentIdPaymentRecord = null;

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
                            VizualizarImage.setAttribute('data-ticket-pk', ticketId);
                            VizualizarImage.setAttribute('data-serial-pos', serialPos);
                            VizualizarImage.setAttribute('data-rechazado', documentoRechazado ? 'true' : 'false');
                            VizualizarImage.setAttribute('data-id-status-payment', idStatusPayment || '');
                            const visualizarImagenModal = new bootstrap.Modal(VizualizarImage, { keyboard: false });

                            const EnvioInputModal = document.getElementById('imagenEnvio');
                            const EnvioLabelModal = document.getElementById('labelEnvio');
                            const ExoInputModal = document.getElementById('imagenExoneracion');
                            const ExoLabelModal = document.getElementById('labelExo');
                            const PagoInputModal = document.getElementById('imagenPago');
                            const PagoLabelModal = document.getElementById('labelPago');
                            const VizualizarImageElement = document.getElementById('visualizarImagenModal');
                            const closeVizButtons = VizualizarImageElement.querySelectorAll('.btn-close, [data-bs-dismiss="modal"]');
                            closeVizButtons.forEach(btn => {
                                btn.addEventListener('click', function() {
                                    visualizarImagenModal.hide();
                                });
                            });

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

document.addEventListener("DOMContentLoaded", function() {
    getTicketAprovalDocument();
    
    // Iniciar listeners de pagos
    if (typeof setupPaymentMethodsLoader === 'function') setupPaymentMethodsLoader();
    if (typeof setupCurrencyListener === 'function') setupCurrencyListener();
    if (typeof setupFormaPagoListener === 'function') setupFormaPagoListener();
});

function showUploadNewDocumentModal(ticketId, nroTicket, serialPos, documentType, motivoRechazo, estatusPos = 'No disponible') {
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
    const btnRegistrarPagoModal = document.getElementById('btnRegistrarPagoModal');

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

    // Lógica para el botón de Registro de Pago (Solo para Anticipos)
    if (btnRegistrarPagoModal) {
        if (documentType === 'Anticipo') {
            btnRegistrarPagoModal.style.display = 'block';
            $(btnRegistrarPagoModal).off('click').on('click', function() {
                // Preparar datos para el modal de pago
                const serialPosInput = document.getElementById('serialPosPago');
                if (serialPosInput) {
                    serialPosInput.value = serialPos;
                }
                
                // Abrir el modal de pago
                const modalPagoElement = document.getElementById('modalAgregarDatosPago');
                if (modalPagoElement) {
                    const modalPago = new bootstrap.Modal(modalPagoElement);
                    modalPago.show();
                }
            });
        } else {
            btnRegistrarPagoModal.style.display = 'none';
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
    // COMENTADO: Este event listener está vacío y bloquea el real que está en la línea 2497
    // uploadFileBtn.addEventListener('click', handleUploadClick);
    cerrarBoton.addEventListener('click', handleCerrarClick);

    // Limpiar al cerrar el modal
    modal.addEventListener('hidden.bs.modal', function() {
        // Remover event listeners usando jQuery
        $(documentFileInput).off("change");
        // COMENTADO: Corresponde al listener comentado arriba
        // uploadFileBtn.removeEventListener('click', handleUploadClick);
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
            // Validar campos de corrección si es un documento de pago
            const currentDocumentType = document.getElementById('currentImageTypeDisplay').textContent;
            const isPaymentDoc = ['Anticipo', 'pago', 'Pago', 'comprobante_pago'].includes(currentDocumentType);
            
            if (isPaymentDoc) {
                const missingFields = validatePaymentCorrectionFields();
                if (missingFields.length > 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campos Requeridos',
                        html: `Por favor, complete los siguientes campos antes de rechazar:<br><strong>${missingFields.join('<br>')}</strong>`,
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#003594',
                        color: 'black',
                        didOpen: () => {
                            const container = document.querySelector('.swal2-container');
                            if (container) {
                                container.style.zIndex = '2060';
                            }
                        }
                    });
                    return; // Detener si hay campos vacíos
                }
            }

            // Cierra el modal de visualización
            visualizarImagenModal.hide();

            // Obtener el tipo de documento actual y llamar a getMotivos
            console.log("RechazoDocumento click - calling getMotivos with:", currentDocumentType);
            getMotivos(currentDocumentType);

            // Abre el modal de rechazo
            document.getElementById('modalRechazo').style.zIndex = '2055';
            modalRechazoInstance.show();
            
            // Ajustamos también el backdrop
            setTimeout(() => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                if (backdrops.length > 0) {
                    backdrops[backdrops.length - 1].style.zIndex = '2050';
                }
            }, 100);
        });
    }

    const modalConfirmacionRechazoElement = document.getElementById('modalConfirmacionRechazo');
    if (modalConfirmacionRechazoElement) {
        const closeConfButtons = modalConfirmacionRechazoElement.querySelectorAll('.btn-close, [data-bs-dismiss="modal"]');
        closeConfButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                confirmarRechazoModal.hide();
            });
        });
    }

    document.getElementById("confirmarRechazoBtn").addEventListener("click", function() {
        // Opcional: Obtén el texto del motivo seleccionado para mostrarlo en el modal
        const motivoRechazoSelect = document.getElementById("motivoRechazoSelect");
        const motivoSeleccionadoTexto = motivoRechazoSelect.options[motivoRechazoSelect.selectedIndex].text;


        document.getElementById("motivoSeleccionadoTexto").textContent = motivoSeleccionadoTexto;
    });

    const modalRechazoElement = document.getElementById('modalRechazo');
    if (modalRechazoElement) {
        const closeRechazoButtons = modalRechazoElement.querySelectorAll('.btn-close, [data-bs-dismiss="modal"]');
        closeRechazoButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                modalRechazoInstance.hide();
            });
        });
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
      
      // Forzar z-index superior para el modal de confirmación
      const modalElement = document.getElementById('modalConfirmacionRechazo');
      modalElement.style.zIndex = '2060';
      
      confirmarRechazoModal.show();
      
      // Ajustar backdrop
      setTimeout(() => {
          const backdrops = document.querySelectorAll('.modal-backdrop');
          if (backdrops.length > 0) {
              backdrops[backdrops.length - 1].style.zIndex = '2059';
          }
      }, 100);
    }
  });
  

    // Event listener para el botón "Aprobar Documento"
    btnVisualizarImagen.addEventListener('click', function() {
        const selectedOption = document.querySelector('input[name="opcionImagen"]:checked').value;
        const ticketId = visualizarImagenModalElement.getAttribute('data-ticket-id');
        const serialPos = visualizarImagenModalElement.getAttribute('data-serial-pos');
        const documentoRechazado = visualizarImagenModalElement.getAttribute('data-rechazado') === 'true';
        const idStatusPayment = parseInt(visualizarImagenModalElement.getAttribute('data-id-status-payment')) || 0;

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
                        try {
                            showApprovalModal(ticketId, selectedOption, filePath, mimeType, fileName, serialPos, documentoRechazado, idStatusPayment);
                        } catch (e) {
                            console.error("Error in showApprovalModal:", e);
                        }
                        
                        try {
                            getMotivos(selectedOption);
                        } catch (e) {
                            console.error("Error in getMotivos:", e);
                        }

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
            confirmButtonColor: '#003594',
            didOpen: () => {
                const container = document.querySelector('.swal2-container');
                if (container) {
                    container.style.zIndex = '2060';
                }
            }
        });
        return;
    }

    const xhr = new XMLHttpRequest();
    // ✅ Agregamos currentIdPaymentRecord para que el rechazo sea quirúrgico
    let datos = `action=rechazarDocumento&ticketId=${encodeURIComponent(ticketId)}&motivoId=${encodeURIComponent(motivoId)}&nroTicket=${encodeURIComponent(nroticket)}&id_user=${encodeURIComponent(id_user)}&documentType=${encodeURIComponent(documentType)}`;
    
    if (typeof currentIdPaymentRecord !== 'undefined' && currentIdPaymentRecord) {
        datos += `&id_payment_record=${encodeURIComponent(currentIdPaymentRecord)}`;
    }

    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/rechazarDocumento`); 
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
                        color: 'black',
                        didOpen: () => {
                            const container = document.querySelector('.swal2-container');
                            if (container) {
                                container.style.zIndex = '2060';
                            }
                        }
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message,
                        confirmButtonColor: '#003594',
                        didOpen: () => {
                            const container = document.querySelector('.swal2-container');
                            if (container) {
                                container.style.zIndex = '2060';
                            }
                        }
                    });
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Respuesta del servidor no válida.',
                    confirmButtonColor: '#003594',
                    didOpen: () => {
                        const container = document.querySelector('.swal2-container');
                        if (container) {
                            container.style.zIndex = '2060';
                        }
                    }
                });
            }
        } else {
            console.error("Error:", xhr.status, xhr.statusText);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un problema al conectar con el servidor.',
                confirmButtonColor: '#003594',
                didOpen: () => {
                    const container = document.querySelector('.swal2-container');
                    if (container) {
                        container.style.zIndex = '2060';
                    }
                }
            });
        }
    };
    xhr.onerror = function () {
        console.error("Error de red");
        Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'Verifique su conexión a internet.',
            confirmButtonColor: '#003594',
            didOpen: () => {
                const container = document.querySelector('.swal2-container');
                if (container) {
                    container.style.zIndex = '2060';
                }
            }
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
            
            // Usar la variable global currentSelectedTicket en lugar de buscar en el DOM
            const id_ticket = currentSelectedTicket;
            if (!id_ticket) {
                console.error("No hay ticket seleccionado");
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

function showApprovalModal(ticketId, documentType, filePath, mimeType, fileName, serialPos, documentoRechazado, idStatusPayment = 0, paymentReference = null, recordNumber = null) {
    console.log("showApprovalModal called with ticketId (Display/ID):", ticketId);
    currentTicketIdForImage = ticketId; // Usar el ID recibido (puede ser el nro_ticket, el backend lo resolverá si es necesario)
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
    const rejectDocumentBtn = document.getElementById("RechazoDocumento");
    const paymentValidationContainer = document.getElementById("paymentValidationContainer");
    
    // ✅ Verificar si el documento está aprobado (id_status_payment = 6)
    const isDocumentApproved = parseInt(idStatusPayment) === 6;

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

    // ✅ Controlar la visibilidad del botón de aprobar (solo si NO está aprobado)
    if (approveTicketFromImageBtn && !isDocumentApproved) {
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
    return `http://${HOST}/Documentos/${cleanPath}`;
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
    
    // Si el documento es de tipo "Anticipo" (pago), obtener y mostrar los datos de pago
    console.log('showApprovalModal - documentType:', documentType, 'ticketId:', ticketId, 'idStatusPayment:', idStatusPayment);
    
    // ✅ Si el documento está aprobado, ocultar validación de pago y botones de acción
    if (isDocumentApproved) {
        console.log('Documento aprobado (id_status_payment = 6), ocultando validación de pago y botones de acción');
        if (paymentValidationContainer) {
            paymentValidationContainer.style.display = 'none';
        }
        if (approveTicketFromImageBtn) {
            approveTicketFromImageBtn.style.display = 'none';
        }
        if (rejectDocumentBtn) {
            rejectDocumentBtn.style.display = 'none';
        }
    } else if (documentType === 'Anticipo' || documentType === 'Pago' || documentType === 'pago') {
        console.log('Es documento de Anticipo/Pago, cargando datos de pago...');
        // El ticketId que viene aquí es el nro_ticket (se establece en el atributo data-ticket-id)
        // Asegurarse de que sea el nro_ticket correcto
        const nroTicketToUse = ticketId || currentTicketIdDisplay.textContent;
        console.log('nroTicketToUse para consulta:', nroTicketToUse);
        loadPaymentDataForEnvio(nroTicketToUse, currentIdPaymentRecord, paymentReference, recordNumber);
        
        // Mostrar botones de acción si no está aprobado
        if (approveTicketFromImageBtn) {
            approveTicketFromImageBtn.style.display = 'block';
        }
        if (rejectDocumentBtn) {
            rejectDocumentBtn.style.display = documentoRechazado ? 'none' : 'block';
        }
    } else {
        console.log('No es documento de Anticipo, ocultando contenedor de validación');
        // Ocultar el contenedor de validación de pago si no es Anticipo
        if (paymentValidationContainer) {
            paymentValidationContainer.style.display = 'none';
        }
        // Mostrar botones de acción para otros tipos de documentos
        if (approveTicketFromImageBtn) {
            approveTicketFromImageBtn.style.display = 'block';
        }
        if (rejectDocumentBtn) {
            rejectDocumentBtn.style.display = documentoRechazado ? 'none' : 'block';
        }
    }
    
    // Mostrar el modal de aprobacin
    const imageApprovalModal = new bootstrap.Modal(imageApprovalModalElement);
    
    // Mostrar el modal de aprobación
    // Forzamos un z-index más alto para que aparezca sobre el modal de detalles
    imageApprovalModalElement.style.zIndex = '2000';
    imageApprovalModal.show();
    
    // Ajustar el backdrop (el fondo oscuro) para que también esté sobre el primer modal
    setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (backdrops.length > 1) {
            // El último backdrop creado es el de este modal
            backdrops[backdrops.length - 1].style.zIndex = '1999';
        }
    }, 50);
    
    // LIMPIAR Y AGREGAR EVENT LISTENERS
    const closeImageApprovalModalBtns = imageApprovalModalElement.querySelectorAll('.btn-close, [data-bs-dismiss="modal"], #closeImageApprovalModalBtn');
    closeImageApprovalModalBtns.forEach(btn => {
        // Remover listeners previos clonando (si es necesario forzar limpieza, aunque para listeners simples no siempre es crucial)
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function() {
            imageApprovalModal.hide();
        });
    });
    
    // Agregar event listeners para los radio buttons de validación de pago
    setupPaymentValidationListeners();

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
        
        // Limpiar campos de validación de pago
        const paymentValidationContainer = document.getElementById('paymentValidationContainer');
        if (paymentValidationContainer) {
            paymentValidationContainer.style.display = 'none';
        }
        
        // Limpiar todos los campos y radio buttons
        const paymentReferenceOriginal = document.getElementById('paymentReferenceOriginal');
        const paymentDateOriginal = document.getElementById('paymentDateOriginal');
        const paymentReferenceCorrectOnly = document.getElementById('paymentReferenceCorrectOnly');
        const paymentDateCorrectOnly = document.getElementById('paymentDateCorrectOnly');
        
        if (paymentReferenceOriginal) paymentReferenceOriginal.value = '';
        if (paymentDateOriginal) paymentDateOriginal.value = '';
        if (paymentReferenceCorrectOnly) paymentReferenceCorrectOnly.value = '';
        if (paymentDateCorrectOnly) paymentDateCorrectOnly.value = '';
        const paymentAmountCorrectOnly = document.getElementById('paymentAmountCorrectOnly');
        if (paymentAmountCorrectOnly) paymentAmountCorrectOnly.value = '';
        const paymentAmountOriginal = document.getElementById('paymentAmountOriginal');
        if (paymentAmountOriginal) paymentAmountOriginal.value = '';
        
        // Desmarcar todos los radio buttons
        const referenceCorrectYes = document.getElementById('referenceCorrectYes');
        const referenceCorrectNo = document.getElementById('referenceCorrectNo');
        const dateCorrectYes = document.getElementById('dateCorrectYes');
        const dateCorrectNo = document.getElementById('dateCorrectNo');
        
        if (referenceCorrectYes) referenceCorrectYes.checked = false;
        if (referenceCorrectNo) referenceCorrectNo.checked = false;
        if (dateCorrectYes) dateCorrectYes.checked = false;
        if (dateCorrectNo) dateCorrectNo.checked = false;
        const amountCorrectYes = document.getElementById('amountCorrectYes');
        const amountCorrectNo = document.getElementById('amountCorrectNo');
        if (amountCorrectYes) amountCorrectYes.checked = false;
        if (amountCorrectNo) amountCorrectNo.checked = false;
        
        // Ocultar campos de corrección
        const referenceCorrectionField = document.getElementById('referenceCorrectionField');
        const dateCorrectionField = document.getElementById('dateCorrectionField');
        
        if (referenceCorrectionField) referenceCorrectionField.style.display = 'none';
        if (dateCorrectionField) dateCorrectionField.style.display = 'none';
        const amountCorrectionField = document.getElementById('amountCorrectionField');
        if (amountCorrectionField) amountCorrectionField.style.display = 'none';
        
        imageApprovalModalElement.removeEventListener('hidden.bs.modal', cleanupHandler);
    };
    imageApprovalModalElement.addEventListener('hidden.bs.modal', cleanupHandler);
}

// Función para cargar los datos de pago cuando el documento es de tipo "Anticipo" (pago)
function loadPaymentDataForEnvio(nroTicket, idPaymentRecord = null, paymentReference = null, recordNumber = null) {
    console.log('loadPaymentDataForEnvio llamado con nroTicket:', nroTicket, 'idPaymentRecord:', idPaymentRecord, 'paymentReference:', paymentReference, 'recordNumber:', recordNumber);
    
    const paymentValidationContainer = document.getElementById('paymentValidationContainer');
    const paymentReferenceOriginal = document.getElementById('paymentReferenceOriginal');
    const paymentDateOriginal = document.getElementById('paymentDateOriginal');
    const paymentAmountOriginal = document.getElementById('paymentAmountOriginal');
    
    if (!paymentValidationContainer) {
        console.error('paymentValidationContainer no encontrado');
        return;
    }
    
    if (!paymentReferenceOriginal) {
        console.error('paymentReferenceOriginal no encontrado');
        return;
    }
    
    if (!paymentDateOriginal) {
        console.error('paymentDateOriginal no encontrado');
        return;
    }
    
    // Mostrar el contenedor primero (aunque esté vacío) para que el usuario vea que se está cargando
    paymentValidationContainer.style.display = 'block';
    
    // Mostrar mensaje de carga
    paymentReferenceOriginal.value = 'Cargando...';
    paymentDateOriginal.value = 'Cargando...';
    if (paymentAmountOriginal) paymentAmountOriginal.value = 'Cargando...';
    
    // Llamar a la API para obtener los datos de pago
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPaymentData`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onload = function() {
        console.log('Respuesta de GetPaymentData:', xhr.status, xhr.responseText);
        
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const data = JSON.parse(xhr.responseText);
                console.log('Datos parseados:', data);
                
                // El repositorio devuelve un objeto, no un array
                if (data.success && data.data && typeof data.data === 'object') {
                    const paymentRecord = data.data;
                    const paymentReference = paymentRecord.payment_reference || '';
                    const paymentDate = paymentRecord.payment_date || '';
                    
                    console.log('paymentReference:', paymentReference);
                    console.log('paymentDate:', paymentDate);
                    
                    // Formatear la fecha si existe
                    let formattedDate = '';
                    if (paymentDate) {
                        // La fecha puede venir en formato timestamp o date
                        const date = new Date(paymentDate);
                        if (!isNaN(date.getTime())) {
                            formattedDate = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
                        } else {
                            formattedDate = paymentDate; // Si ya viene formateada
                        }
                    }
                    
                    // Mostrar los datos en los campos
                    paymentReferenceOriginal.value = paymentReference || 'No disponible';
                    paymentDateOriginal.value = formattedDate || 'No disponible';
                    if (paymentAmountOriginal) paymentAmountOriginal.value = paymentRecord.amount_bs || 'No disponible';
                    
                    // Seleccionar "Sí" por defecto en todos los radio buttons
                    const amountCorrectYes = document.getElementById('amountCorrectYes');
                    const amountCorrectNo = document.getElementById('amountCorrectNo');
                    if (amountCorrectYes) amountCorrectYes.checked = true;
                    if (amountCorrectNo) amountCorrectNo.checked = false;
                    const amountCorrectionField = document.getElementById('amountCorrectionField');
                    if (amountCorrectionField) amountCorrectionField.style.display = 'none';
                    const paymentAmountCorrectOnly = document.getElementById('paymentAmountCorrectOnly');
                    if (paymentAmountCorrectOnly) paymentAmountCorrectOnly.value = '';
                    
                    // Seleccionar "Sí" por defecto en ambos radio buttons
                    const referenceCorrectYes = document.getElementById('referenceCorrectYes');
                    const dateCorrectYes = document.getElementById('dateCorrectYes');
                    const referenceCorrectNo = document.getElementById('referenceCorrectNo');
                    const dateCorrectNo = document.getElementById('dateCorrectNo');
                    
                    if (referenceCorrectYes) referenceCorrectYes.checked = true;
                    if (referenceCorrectNo) referenceCorrectNo.checked = false;
                    if (dateCorrectYes) dateCorrectYes.checked = true;
                    if (dateCorrectNo) dateCorrectNo.checked = false;
                    
                    // Asegurar que los campos de corrección estén ocultos
                    const referenceCorrectionField = document.getElementById('referenceCorrectionField');
                    const dateCorrectionField = document.getElementById('dateCorrectionField');
                    if (referenceCorrectionField) referenceCorrectionField.style.display = 'none';
                    if (dateCorrectionField) dateCorrectionField.style.display = 'none';
                    
                    // Limpiar los campos de corrección
                    const paymentReferenceCorrectOnly = document.getElementById('paymentReferenceCorrectOnly');
                    const paymentDateCorrectOnly = document.getElementById('paymentDateCorrectOnly');
                    if (paymentReferenceCorrectOnly) paymentReferenceCorrectOnly.value = '';
                    if (paymentDateCorrectOnly) paymentDateCorrectOnly.value = '';
                    
                    // Mostrar el contenedor de validación
                    paymentValidationContainer.style.display = 'block';
                    console.log('Datos de pago cargados correctamente');
                } else {
                    // No hay datos de pago, pero mostrar el contenedor con mensaje
                    paymentReferenceOriginal.value = 'No disponible';
                    paymentDateOriginal.value = 'No disponible';
                    paymentValidationContainer.style.display = 'block';
                    console.warn('No se encontraron datos de pago para el ticket:', nroTicket);
                }
            } catch (error) {
                console.error('Error al parsear la respuesta JSON:', error);
                paymentReferenceOriginal.value = 'Error al cargar';
                paymentDateOriginal.value = 'Error al cargar';
                paymentValidationContainer.style.display = 'block';
            }
        } else {
            console.error(`Error HTTP ${xhr.status}: ${xhr.statusText}`);
            paymentReferenceOriginal.value = 'Error al cargar';
            paymentDateOriginal.value = 'Error al cargar';
            paymentValidationContainer.style.display = 'block';
        }
    };
    
    xhr.onerror = function() {
        console.error('Error de red al intentar cargar los datos de pago.');
        paymentReferenceOriginal.value = 'Error de conexión';
        paymentDateOriginal.value = 'Error de conexión';
        paymentValidationContainer.style.display = 'block';
    };
    
    let data = `nro_ticket=${encodeURIComponent(nroTicket)}`;
    if (idPaymentRecord) {
        data += `&id_payment_record=${encodeURIComponent(idPaymentRecord)}`;
    }
    if (paymentReference) {
        data += `&payment_reference=${encodeURIComponent(paymentReference)}`;
    }
    if (recordNumber) {
        data += `&record_number=${encodeURIComponent(recordNumber)}`;
    }
    console.log('Enviando datos a GetPaymentData:', data);
    xhr.send(data);
}

// Función para configurar los event listeners de los radio buttons de validación
function setupPaymentValidationListeners() {
    // Radio: ¿Nro de referencia correcto?
    const referenceCorrectYes = document.getElementById('referenceCorrectYes');
    const referenceCorrectNo = document.getElementById('referenceCorrectNo');
    const referenceCorrectionField = document.getElementById('referenceCorrectionField');
    
    if (referenceCorrectYes && referenceCorrectNo && referenceCorrectionField) {
        referenceCorrectYes.addEventListener('change', function() {
            if (this.checked) {
                referenceCorrectionField.style.display = 'none';
                const refCorrectOnly = document.getElementById('paymentReferenceCorrectOnly');
                if (refCorrectOnly) refCorrectOnly.value = '';
            }
        });
        
        referenceCorrectNo.addEventListener('change', function() {
            if (this.checked) {
                referenceCorrectionField.style.display = 'block';
            }
        });
    }
    
    // Radio: ¿Fecha de pago correcta?
    const dateCorrectYes = document.getElementById('dateCorrectYes');
    const dateCorrectNo = document.getElementById('dateCorrectNo');
    const dateCorrectionField = document.getElementById('dateCorrectionField');
    
    if (dateCorrectYes && dateCorrectNo && dateCorrectionField) {
        dateCorrectYes.addEventListener('change', function() {
            if (this.checked) {
                dateCorrectionField.style.display = 'none';
                const dateCorrectOnly = document.getElementById('paymentDateCorrectOnly');
                if (dateCorrectOnly) dateCorrectOnly.value = '';
            }
        });
        
        dateCorrectNo.addEventListener('change', function() {
            if (this.checked) {
                dateCorrectionField.style.display = 'block';
            }
        });
    }
    // Radio: ¿Monto de pago correcto?
    const amountCorrectYes = document.getElementById('amountCorrectYes');
    const amountCorrectNo = document.getElementById('amountCorrectNo');
    const amountCorrectionField = document.getElementById('amountCorrectionField');
    
    if (amountCorrectYes && amountCorrectNo && amountCorrectionField) {
        amountCorrectYes.addEventListener('change', function() {
            if (this.checked) {
                amountCorrectionField.style.display = 'none';
                const amountCorrectOnly = document.getElementById('paymentAmountCorrectOnly');
                if (amountCorrectOnly) amountCorrectOnly.value = '';
            }
        });
        
        amountCorrectNo.addEventListener('change', function() {
            if (this.checked) {
                amountCorrectionField.style.display = 'block';
            }
        });
    }
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

// --- LÓGICA DE DETALLES DE PAGO (PORTADA DE CONSULTA_RIF) ---

let exchangeRate = null;

function loadExchangeRateToday(fecha = null) {
  if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") return;
  
  // Si no se proporciona fecha, intentar obtenerla del input
  if (!fecha) {
    const fechaPagoInput = document.getElementById("fechaPago");
    if (fechaPagoInput && fechaPagoInput.value) {
      fecha = fechaPagoInput.value;
    }
  }

  let apiUrl;
  let dataToSend;
  
  if (fecha) {
    apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateByDate";
    dataToSend = "action=GetExchangeRateByDate&fecha=" + encodeURIComponent(fecha);
  } else {
    apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetExchangeRateToday";
    dataToSend = null;
  }

  const tasaDisplayValue = document.getElementById("tasaDisplayValue");
  if (tasaDisplayValue) tasaDisplayValue.textContent = "Cargando...";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", apiUrl);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        const data = JSON.parse(xhr.responseText);
        if (data.success && data.exchange_rate) {
          const tasaValue = data.exchange_rate.tasa_dolar || data.exchange_rate.tasa;
          if (tasaValue) {
            exchangeRate = parseFloat(tasaValue);
            if (tasaDisplayValue) {
                tasaDisplayValue.textContent = "Bs. " + exchangeRate.toLocaleString('es-VE', { minimumFractionDigits: 2 });
            }
            // Actualizar montos si ya hay valores
            const montoBs = document.getElementById('montoBs');
            const montoRef = document.getElementById('montoRef');
            if (montoBs && montoBs.value && !montoBs.disabled) $(montoBs).trigger('input');
            else if (montoRef && montoRef.value && !montoRef.disabled) $(montoRef).trigger('input');
          }
        } else {
            if (tasaDisplayValue) tasaDisplayValue.textContent = "N/D";
        }
      } catch (e) {
          if (tasaDisplayValue) tasaDisplayValue.textContent = "Error";
      }
    }
  };
  xhr.send(dataToSend);
}

function formatDateToDDMMYYYY(dateString) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateString;
}

function formatBsDecimal(input) {
  let value = input.value.replace(/[^\d.,]/g, "");
  input.value = value;
}

function formatUsdDecimal(input) {
  let value = input.value.replace(/[^\d.,]/g, "");
  input.value = value;
}

function loadBancos() {
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") return;
    const selects = ['bancoOrigen', 'bancoDestino', 'origenBanco', 'destinoBanco'];
    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetBancos";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                if (data.success && data.bancos) {
                    selects.forEach(id => {
                        const select = document.getElementById(id);
                        if (select) {
                            select.innerHTML = '<option value="">Seleccione</option>';
                            data.bancos.forEach(banco => {
                                const option = document.createElement("option");
                                option.value = banco.codigobanco;
                                option.textContent = banco.ibp;
                                select.appendChild(option);
                            });
                            // For 'destinoBanco' in Pago Móvil, pre-select Banesco and disable
                            if (id === 'destinoBanco') {
                                const banescoOption = Array.from(select.options).find(opt => opt.textContent.toLowerCase().includes("banesco"));
                                if (banescoOption) banescoOption.selected = true;
                                select.disabled = true;
                            }
                        }
                    });
                }
            } catch (e) { console.error('Error parse bancos:', e); }
        }
    };
    xhr.send();
}

function loadPaymentMethods() {
    if (typeof ENDPOINT_BASE === "undefined" || typeof APP_PATH === "undefined") return;
    const formaPagoSelect = document.getElementById("formaPago");
    if (!formaPagoSelect) return;

    const apiUrl = ENDPOINT_BASE + APP_PATH + "api/consulta/GetPaymentMethods";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                if (data.success && data.payment_methods) {
                    formaPagoSelect.innerHTML = '<option value="">Seleccione</option>';
                    data.payment_methods.forEach(method => {
                        const option = document.createElement("option");
                        option.value = method.id_payment_method;
                        option.textContent = method.payment_method_name;
                        formaPagoSelect.appendChild(option);
                    });
                    
                    // Asegurar que el listener de cambios esté activo
                    formaPagoSelect.onchange = function() {
                        const id = parseInt(this.value);
                        const moneda = document.getElementById("moneda");
                        const bancoCont = document.getElementById("bancoFieldsContainer");
                        const pmCont = document.getElementById("pagoMovilFieldsContainer");

                        if (bancoCont) bancoCont.style.display = (id === 2) ? 'flex' : 'none'; // Transferencia
                        if (pmCont) {
                            pmCont.style.display = (id === 5) ? 'block' : 'none'; // Pago Móvil
                            
                            if (id === 5) {
                                // Ocultar campos de RIF y Teléfono en Origen (Solicitud Usuario)
                                const $rifCont = $("#origenRifTipo").closest(".mb-2");
                                const $tlfCont = $("#origenTelefono").closest(".mb-2");
                                
                                $rifCont.hide();
                                $tlfCont.hide();
                                
                                // Deshabilitar para evitar validación HTML5
                                $rifCont.find("input, select").prop("required", false).prop("disabled", true);
                                $tlfCont.find("input, select").prop("required", false).prop("disabled", true);
                            }
                        }

                        if (id === 2 || id === 5) { // Transferencia or Pago Móvil
                            if (moneda) {
                                moneda.value = "bs";
                                moneda.disabled = true;
                                $(moneda).trigger('change'); // Trigger change to update monto fields
                            }
                        } else {
                            if (moneda) {
                                moneda.disabled = false;
                            }
                        }
                    };
                }
            } catch (e) { console.error('Error parse payment methods:', e); }
        }
    };
    xhr.send();
}

/**
 * Abre el modal de detalles de pago (Implementación unificada con carga de archivo)
 */
function openDetailedPaymentModal(element) {
    const ticketId = element.getAttribute('data-id') || element.dataset.id;
    const nroTicket = element.getAttribute('data-nro-ticket') || element.dataset.nroTicket;
    const serialPos = element.getAttribute('data-serial-pos') || element.dataset.serialPos;
    const documentType = element.getAttribute('data-document-type') || element.dataset.documentType;

    if (!ticketId) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo obtener la información del ticket.', confirmButtonColor: '#003594' });
        return;
    }

    // Establecer los valores en los campos del modal
    const serialPosPagoInput = document.getElementById('serialPosPago');
    const nroTicketPagoInput = document.getElementById('nro_ticket_pago');
    const documentTypePagoInput = document.getElementById('document_type_pago');
    const fechaCargaInput = document.getElementById('fechaCarga');
    const montoEquipoLabel = document.getElementById('montoEquipo');

    if (serialPosPagoInput) serialPosPagoInput.value = serialPos || '';
    if (nroTicketPagoInput) nroTicketPagoInput.value = nroTicket || '';
    if (documentTypePagoInput) documentTypePagoInput.value = documentType || '';
    
    if (fechaCargaInput) {
        const today = new Date();
        fechaCargaInput.value = today.toISOString().split('T')[0];
    }

    if (montoEquipoLabel) montoEquipoLabel.textContent = "$0.00";

    // Inicializar campos de monto
    const montoBsInput = document.getElementById('montoBs');
    const montoRefInput = document.getElementById('montoRef');
    const monedaSelect = document.getElementById('moneda');
    if (montoBsInput) { montoBsInput.readOnly = true; montoBsInput.disabled = true; montoBsInput.style.backgroundColor = '#e9ecef'; montoBsInput.value = ''; }
    if (montoRefInput) { montoRefInput.readOnly = true; montoRefInput.disabled = true; montoRefInput.style.backgroundColor = '#e9ecef'; montoRefInput.value = ''; }
    if (monedaSelect) monedaSelect.value = '';

    // Cargar catálogos
    loadPaymentMethods();
    loadBancos();
    loadExchangeRateToday();

    // Obtener y establecer el estatus del pago
    getPagoEstatus(nroTicket, documentType);
    // Configurar ayudas visuales
    setupAutoRegistrationNumber();
    setupNumericValidation();

    // Mostrar el modal
    const modalElement = document.getElementById('modalAgregarDatosPago');
    if (modalElement) {
        if (!detailedPaymentModalInstance) {
            detailedPaymentModalInstance = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
        }
        detailedPaymentModalInstance.show();
    }
}

function getPagoEstatus(nroTicket, documentType = null) {
    const estatusInput = document.getElementById("estatus");
    if (!estatusInput) return;

    // Si tenemos el tipo de documento (flujo de rechazo), establecemos el estatus directamente
    if (documentType) {
        if (documentType === 'Anticipo') {
            estatusInput.value = "Anticipo Pendiente por Revision";
            return;
        } else if (documentType === 'Pago') {
            estatusInput.value = "Pago Pendiente por Revision";
            return;
        }
    }

    estatusInput.value = "Cargando...";

    const apiUrl = `${ENDPOINT_BASE}${APP_PATH}api/consulta/GetEstatusPagoAutomatizado`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                const responseData = response.estatus_pago || response.data;
                if (response.success && Array.isArray(responseData) && responseData.length > 0) {
                    const statusId = parseInt(responseData[0].id_status_payment);
                    estatusInput.value = (statusId === 17) ? "Pago Pendiente por Revision" : "Pago Anticipo Pendiente por Revision";
                } else {
                    estatusInput.value = "Pago Anticipo Pendiente por Revision"; 
                }
            } catch (error) {
                estatusInput.value = 'Pago Anticipo Pendiente por Revision';
            }
        }
    };
    xhr.send(`action=GetEstatusPagoAutomatizado&nro_ticket=${encodeURIComponent(nroTicket || "")}`);
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

    // También generar cuando el modal se muestra si ya hay valores
    const modal = document.getElementById("modalAgregarDatosPago");
    if (modal) {
        modal.addEventListener("shown.bs.modal", function() {
            // Cargar la tasa de cambio del día de hoy cuando se abre el modal
            if (typeof loadExchangeRateToday === 'function') {
                loadExchangeRateToday();
            }
            
            // Pequeño delay para asegurar que los valores estén cargados
            setTimeout(() => {
                if (referenciaInput.value && serialPosPagoInput.value) {
                    updateRegistrationNumber();
                }
            }, 100);
        });
    }
}

function setupNumericValidation() {
    const numericFields = ["referencia", "montoBs", "montoRef"];
    numericFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("keypress", function(e) {
                if (!/[0-9.]/.test(e.key)) e.preventDefault();
                if (e.key === '.' && this.value.includes('.')) e.preventDefault();
            });
        }
    });
}

async function savePayment() {
    // 1. Validaciones
    const required = ["fechaPago", "formaPago", "moneda", "referencia", "depositante", "montoBs", "montoRef"];
    for (const id of required) {
        const el = document.getElementById(id);
        if (!el || !el.value || (el.disabled && el.value === '')) { // Check for disabled fields with empty values
            Swal.fire({ 
                icon: 'warning', 
                title: 'Atención', 
                text: `El campo ${id} es obligatorio.`,
                target: document.getElementById('modalAgregarDatosPago'),
                customClass: { container: 'payment-alert-modal' }
            });
            return;
        }
    }

    const fileInput = document.getElementById("documentFileDetailed");
    if (!fileInput || !fileInput.files.length) {
        Swal.fire({ 
            icon: 'warning', 
            title: 'Atención', 
            text: 'Debe cargar el comprobante de pago.',
            target: document.getElementById('modalAgregarDatosPago'),
            customClass: { container: 'payment-alert-modal' }
        });
        return;
    }

    const idMethod = parseInt(document.getElementById("formaPago").value);
    if (idMethod === 2) { // Transferencia
        if (!document.getElementById("bancoOrigen").value || !document.getElementById("bancoDestino").value) {
            Swal.fire({ 
                icon: 'warning', 
                title: 'Atención', 
                text: 'Debe seleccionar los bancos de origen y destino.',
                target: document.getElementById('modalAgregarDatosPago'),
                customClass: { container: 'payment-alert-modal' }
            });
            return;
        }
    } else if (idMethod === 5) { // Pago Móvil
        if (!document.getElementById("origenBanco").value || !document.getElementById("destinoBanco").value) {
            Swal.fire({ 
                icon: 'warning', 
                title: 'Atención', 
                text: 'Debe seleccionar los bancos para el Pago Móvil.',
                target: document.getElementById('modalAgregarDatosPago'),
                customClass: { container: 'payment-alert-modal' }
            });
            return;
        }
    }

    // --- NUEVO: Validación de Presupuesto antes de Guardar ---
    if (!validateEditBudget(true)) {
        return;
    }
    // ---------------------------------------------------------

    Swal.fire({
        title: 'Guardando datos...', 
        allowOutsideClick: false, 
        target: document.getElementById('modalAgregarDatosPago'),
        customClass: { container: 'payment-alert-modal' },
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // 2. Preparar datos para SavePayment
    const getValue = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
    };

    const nroTicket = getValue("nro_ticket_pago");
    const serialPos = getValue("serialPosPago");
    const recordNumber = getValue("registro");
    const idUser = getValue("userId") || getValue("id_user_pago");

    const dataPayment = new URLSearchParams();
    dataPayment.append("serial_pos", serialPos);
    dataPayment.append("nro_ticket", nroTicket);
    dataPayment.append("user_loader", idUser);
    dataPayment.append("payment_date", getValue("fechaPago"));
    
    const formaPagoEl = document.getElementById("formaPago");
    dataPayment.append("payment_method", (formaPagoEl && formaPagoEl.selectedIndex >= 0) ? formaPagoEl.options[formaPagoEl.selectedIndex].text : '');
    dataPayment.append("currency", getValue("moneda") === 'bs' ? 'BS' : 'USD');
    dataPayment.append("amount_bs", getValue("montoBs"));
    dataPayment.append("reference_amount", getValue("montoRef"));
    dataPayment.append("payment_reference", getValue("referencia"));
    dataPayment.append("depositor", getValue("depositante"));
    dataPayment.append("record_number", recordNumber);
    dataPayment.append("observations", getValue("obsAdministracion"));
    dataPayment.append("loadpayment_date", getValue("fechaCarga"));
    dataPayment.append("confirmation_number", "false");

    if (idMethod === 2) {
        dataPayment.append("origen_bank", document.getElementById("bancoOrigen").options[document.getElementById("bancoOrigen").selectedIndex].text);
        dataPayment.append("destination_bank", document.getElementById("bancoDestino").options[document.getElementById("bancoDestino").selectedIndex].text);
    } else if (idMethod === 5) {
        dataPayment.append("origen_bank", document.getElementById("origenBanco").options[document.getElementById("origenBanco").selectedIndex].text);
        dataPayment.append("destination_bank", document.getElementById("destinoBanco").options[document.getElementById("destinoBanco").selectedIndex].text);
    }

    const idPaymentRecord = getValue("id_payment_record_loading");
    const isUpdate = (idPaymentRecord && idPaymentRecord !== "");

    try {
        let id_payment_record_result = null;

        if (isUpdate) {
            // FLUJO ACTUALIZACIÓN (Sustitución de rechazo)
            Swal.update({ title: 'Actualizando datos del pago...' });
            
            const dataUpdate = new URLSearchParams();
            dataUpdate.append("id_payment", idPaymentRecord);
            dataUpdate.append("amount_bs", getValue("montoBs"));
            dataUpdate.append("reference_amount", getValue("montoRef"));
            dataUpdate.append("payment_method", (formaPagoEl && formaPagoEl.selectedIndex >= 0) ? formaPagoEl.options[formaPagoEl.selectedIndex].text : '');
            dataUpdate.append("currency", getValue("moneda") === 'bs' ? 'BS' : 'USD');
            dataUpdate.append("payment_reference", getValue("referencia"));
            dataUpdate.append("depositor", getValue("depositante"));
            if (recordNumber) {
                dataUpdate.append("record_number", recordNumber);
            }

            // ---------------------------------------------------------
            // ACTUALIZACIÓN DE ESTATUS AUTOMÁTICA (Solicitud Usuario)
            // ---------------------------------------------------------
            // Si se está corrigiendo un pago (Update), se debe cambiar el estatus 
            // de rechazo (13) a pendiente (7 u 17) según el tipo.
            const docTypeForStatus = getValue("document_type_pago");
            let newStatus = 17; // Por defecto: Pago Pendiente por Revisión
            
            if (docTypeForStatus === 'Anticipo' || docTypeForStatus === 'anticipo') {
                newStatus = 7; // Anticipo Pendiente por Revisión
            }
            
            dataUpdate.append("payment_status", newStatus);
            // ---------------------------------------------------------
            
            // Si es transferencia/pago movil, actualizar bancos también (si el repositorio lo permite)
            if (idMethod === 2) {
                dataUpdate.append("origen_bank", document.getElementById("bancoOrigen").options[document.getElementById("bancoOrigen").selectedIndex].text);
                dataUpdate.append("destination_bank", document.getElementById("bancoDestino").options[document.getElementById("bancoDestino").selectedIndex].text);
            } else if (idMethod === 5) {
                dataUpdate.append("origen_bank", document.getElementById("origenBanco").options[document.getElementById("origenBanco").selectedIndex].text);
                dataUpdate.append("destination_bank", document.getElementById("destinoBanco").options[document.getElementById("destinoBanco").selectedIndex].text);
            }

            const resUpdate = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/SubstitutePayment`, {
                method: 'POST',
                body: dataUpdate.toString(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const dataUpdateRes = await resUpdate.json();
            if (!dataUpdateRes.success) throw new Error(dataUpdateRes.message || "Error al actualizar el pago.");
            
            id_payment_record_result = dataUpdateRes.id_payment_record;
        } else {
            // FLUJO INSERCIÓN (Nuevo pago)
            const resSave = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/SavePayment`, {
                method: 'POST',
                body: dataPayment.toString(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const dataSave = await resSave.json();
            if (!dataSave.success) throw new Error(dataSave.message || "Error al guardar el pago.");
            
            id_payment_record_result = dataSave.id_payment_record || dataSave.data;
        }

        // PASO 2: Subir documento
        Swal.update({ title: 'Subiendo comprobante...' });
        const formDataDoc = new FormData();
        formDataDoc.append("payment_doc", fileInput.files[0]);
        formDataDoc.append("nro_ticket", nroTicket);
        formDataDoc.append("record_number", recordNumber);
        formDataDoc.append("user_loader", idUser);
        formDataDoc.append("document_type", getValue("document_type_pago"));

        const resUpload = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/UploadPaymentDoc`, {
            method: 'POST',
            body: formDataDoc
        });
        const dataUpload = await resUpload.json();

        if (dataUpload.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Pago y comprobante registrados correctamente.',
                confirmButtonColor: '#003594',
                target: document.getElementById('modalAgregarDatosPago'),
                customClass: { container: 'payment-alert-modal' }
            }).then(() => {
                if (detailedPaymentModalInstance) detailedPaymentModalInstance.hide();
                location.reload();
            });
        } else {
            throw new Error(dataUpload.message || "Error al subir el comprobante.");
        }
    } catch (e) {
        Swal.fire({ 
            icon: 'error', 
            title: 'Error', 
            text: e.message,
            target: document.getElementById('modalAgregarDatosPago'),
            customClass: { container: 'payment-alert-modal' }
        });
    }
}

function limpiarFormularioDatosPago() {
    const form = document.getElementById("formAgregarDatosPago");
    if (form) form.reset();

    // Limpiar campos ocultos de control
    const idRec = document.getElementById("id_payment_record_loading");
    if (idRec) idRec.value = "";
    
    const regNum = document.getElementById("registro");
    if (regNum) regNum.value = "";

    const nroTicketPago = document.getElementById("nro_ticket_pago");
    if (nroTicketPago) nroTicketPago.value = "";

    const docTypePago = document.getElementById("document_type_pago");
    if (docTypePago) docTypePago.value = "";
    const pmFields = document.getElementById("pagoMovilFieldsContainer");
    const bFields = document.getElementById("bancoFieldsContainer");
    if (pmFields) pmFields.style.display = "none";
    if (bFields) bFields.style.display = "none";
    const display = document.getElementById("montoEquipo");
    if (display) display.textContent = "$0.00";

    // Reset validation context
    window.currentOldAmount = 0;

    // Re-enable moneda select and clear monto fields
    const monedaSelect = document.getElementById('moneda');
    const montoBsInput = document.getElementById('montoBs');
    const montoRefInput = document.getElementById('montoRef');
    if (monedaSelect) {
        monedaSelect.disabled = false;
        monedaSelect.value = '';
    }
    if (montoBsInput) {
        montoBsInput.readOnly = true;
        montoBsInput.disabled = true;
        montoBsInput.style.backgroundColor = '#e9ecef';
        montoBsInput.value = '';
    }
    if (montoRefInput) {
        montoRefInput.readOnly = true;
        montoRefInput.disabled = true;
        montoRefInput.style.backgroundColor = '#e9ecef';
        montoRefInput.style.borderColor = ""; // Reset border color
        montoRefInput.value = '';
    }
    if (montoBsInput) {
        montoBsInput.readOnly = true;
        montoBsInput.disabled = true;
        montoBsInput.style.backgroundColor = '#e9ecef';
        montoBsInput.style.borderColor = ""; // Reset border color
        montoBsInput.value = '';
    }

    // Reset Soporte Digital UI
    if (typeof resetDocumentoPagoUI === 'function') resetDocumentoPagoUI();
}

// Listeners finales
$(document).on("click", "#btnGuardarDatosPago", function(e) {
    e.preventDefault();
    savePayment();
});

// Asegurar limpieza total al cerrar el modal por cualquier medio (Cancel, X, clicking outside, ESC)
$(document).on('hidden.bs.modal', '#modalAgregarDatosPago', function () {
    if (typeof limpiarFormularioDatosPago === 'function') {
        limpiarFormularioDatosPago();
    }
});

// Listener para los botones cancelar/cerrar del modal de agregar pago
$(document).on("click", "#modalAgregarDatosPago .btn-close, #btnCancelarModalPagoFooter, #btnCerrarModalPagoHeader", function() {
    const modalPagoElement = document.getElementById('modalAgregarDatosPago');
    if (modalPagoElement) {
        // Limpiar formulario antes de cerrar
        if (typeof limpiarFormularioDatosPago === 'function') {
            limpiarFormularioDatosPago();
        }
        
        if (modalAgregarDatosPagoInstance) {
            modalAgregarDatosPagoInstance.hide();
        } else if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modalPagoInstance = new bootstrap.Modal(modalPagoElement);
            modalPagoInstance.hide();
        } else {
            // Fallback para versiones antiguas o si bootstrap no está global
            $(modalPagoElement).modal('hide');
        }
    }
});

/**
 * Listener para cambios de moneda
 */
$(document).on('change', '#moneda', function() {
    const bs = document.getElementById('montoBs');
    const ref = document.getElementById('montoRef');
    const val = this.value;

    if (val === 'bs') {
        if (bs) { bs.disabled = false; bs.readOnly = false; bs.style.backgroundColor = '#fff'; }
        if (ref) { ref.disabled = true; ref.readOnly = true; ref.style.backgroundColor = '#e9ecef'; ref.value = ''; }
    } else if (val === 'usd') {
        if (bs) { bs.disabled = true; bs.readOnly = true; bs.style.backgroundColor = '#e9ecef'; bs.value = ''; }
        if (ref) { ref.disabled = false; ref.readOnly = false; ref.style.backgroundColor = '#fff'; }
    } else {
        if (bs) { bs.disabled = true; bs.readOnly = true; bs.style.backgroundColor = '#e9ecef'; bs.value = ''; }
        if (ref) { ref.disabled = true; ref.readOnly = true; ref.style.backgroundColor = '#e9ecef'; ref.value = ''; }
    }
    const display = document.getElementById('montoEquipo');
    if (display) display.textContent = "$0.00";
});

/**
 * Listener para conversión de montos
 */
$(document).on('input', '#montoBs, #montoRef', function() {
    const moneda = document.getElementById('moneda').value;
    const bs = document.getElementById('montoBs');
    const ref = document.getElementById('montoRef');
    const display = document.getElementById('montoEquipo');
    const rate = exchangeRate || 0;

    if (!rate) return;

    if (this.id === 'montoBs' && moneda === 'bs') {
        const val = parseFloat(bs.value.replace(',', '.')) || 0;
        ref.value = (val / rate).toFixed(2);
        if (display) display.textContent = `$${ref.value}`;
    } else if (this.id === 'montoRef' && moneda === 'usd') {
        const val = parseFloat(ref.value) || 0;
        bs.value = (val * rate).toFixed(2);
        if (display) display.textContent = `$${val.toFixed(2)}`;
    }
});

/**
 * Muestra el detalle de todos los pagos asociados a un ticket
 */
function showPaymentsDetail(nroTicket, payments, serialPos = 'Sin posición', idStatusPayment = null, clientInfo = null, budgetData = null, estatusPos = 'No disponible') {
    console.log('showPaymentsDetail called with:', { nroTicket, serialPos, clientInfo, budgetData });
    const modalElement = document.getElementById('modalPagosDetalle');
    const ticketLabel = document.getElementById('paymentDetailTicketNro');
    const tableBody = document.getElementById('bodyPagosDetalle');
    
    // Nuevos elementos
    const razSocialElem = document.getElementById('detailRazonSocial');
    const rifElem = document.getElementById('detailRif');
    const serialElem = document.getElementById('detailSerialPos');
    const budgetElem = document.getElementById('detailMontoPresupuesto');
    const paidElem = document.getElementById('detailMontoAbonado');
    const remainingElem = document.getElementById('detailMontoRestante');

    if (!modalElement || !ticketLabel || !tableBody) {
        console.error('Elementos del modal de detalle de pagos no encontrados');
        return;
    }

    ticketLabel.textContent = nroTicket;
    tableBody.innerHTML = '';

    // Llenar información del cliente si está disponible
    if (clientInfo) {
        if (razSocialElem) razSocialElem.textContent = clientInfo.razonSocial || '-';
        if (rifElem) rifElem.textContent = clientInfo.rif || '-';
        if (serialElem) serialElem.textContent = serialPos || '-';
    } else {
        if (serialElem) serialElem.textContent = serialPos || '-';
    }

    // Llenar resumen de montos si está disponible
    if (budgetData) {
        const totalBudget = parseFloat(budgetData.total_budget || 0);
        const totalPaid = parseFloat(budgetData.total_paid || 0);
        // Si no hay presupuesto cargado, el restante es 0 según solicitud del usuario
        const diff = totalBudget > 0 ? (totalBudget - totalPaid) : 0;

        if (budgetElem) budgetElem.textContent = `$${totalBudget.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        if (paidElem) paidElem.textContent = `$${totalPaid.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        if (remainingElem) {
            remainingElem.textContent = `Restante: $${diff.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            // Cambiar color según el restante: verde solo si hay presupuesto y está pagado/excedido
            if (totalBudget > 0 && diff <= 0) {
                remainingElem.style.color = '#38ef7d';
            } else {
                remainingElem.style.color = 'rgba(255, 255, 255, 0.9)';
            }
        }
    }
    
    // Parsear payments si vienen como string (por el atributo data-payments)
    let paymentsObj = payments;
    
    // Si es un string, intentar parsear. Manejar posible doble-stringificación.
    if (typeof paymentsObj === 'string') {
        try {
            // Limpiar posibles escapes de comillas dobles si viene de un atributo HTML mangled
            let cleanStr = paymentsObj.trim();
            if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
                cleanStr = JSON.parse(cleanStr); // Unescape una vez
            }
            
            if (typeof cleanStr === 'string' && (cleanStr.startsWith('[') || cleanStr.startsWith('{'))) {
                paymentsObj = JSON.parse(cleanStr);
            } else if (typeof cleanStr === 'object') {
                paymentsObj = cleanStr;
            }
        } catch (e) {
            console.error('Error al parsear pagos en showPaymentsDetail:', e, paymentsObj);
            paymentsObj = [];
        }
    }
    
    // Asegurar que sea un array
    if (!Array.isArray(paymentsObj)) {
        console.warn('paymentsObj no era un array, forzando a array vacío:', paymentsObj);
        paymentsObj = [];
    }
    
    if (!paymentsObj || paymentsObj.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-muted">No hay pagos registrados para este ticket</td></tr>';
    } else {
        paymentsObj.forEach(p => {
            const isRejectedStatus = p.payment_status == 12 || p.payment_status == 13 || p.payment_status == 14;
            const statusBadge = p.payment_status == 6 ? '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>Aprobado</span>' : 
                               isRejectedStatus ? '<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i>Rechazado</span>' : 
                               '<span class="badge bg-warning"><i class="fas fa-clock me-1"></i>Pendiente</span>';
            
            const isViewed = p.id_payment_record && viewedPayments.has(String(p.id_payment_record));
            const viewedClass = isViewed ? 'viewed' : '';
            
            let actionBtn = '';
            
            if (isRejectedStatus) {
                 actionBtn = `
                <button class="btn btn-outline-danger btn-sm reupload-payment-btn" 
                        data-nro-ticket="${nroTicket}"
                        data-serial-pos="${serialPos}"
                        data-razon-social="${clientInfo ? (clientInfo.razonSocial || '') : ''}"
                        data-rif="${clientInfo ? (clientInfo.rif || '') : ''}"
                        data-estatus-pos="${estatusPos}"
                        data-id-payment-record="${p.id_payment_record}"
                        data-record-number="${p.record_number || ''}"
                        data-document-type="${p.document_type || ''}"
                        data-reference-amount="${p.reference_amount || 0}"
                        data-payment-status="${p.payment_status}"
                        title="Corregir Pago / Subir Nuevo Comprobante"
                        style="width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; padding: 0;">
                    <i class="fas fa-cloud-upload-alt"></i>
                </button>`;
            } else if (p.file_path) {
                actionBtn = `
                <button class="btn btn-outline-primary btn-sm view-individual-payment-btn ${viewedClass}" 
                        data-payment-data='${JSON.stringify(p).replace(/'/g, "&apos;")}' 
                        data-serial-pos="${serialPos}"
                        title="Ver Comprobante"
                        style="width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; padding: 0;">
                    <i class="fas fa-eye"></i>
                </button>`;
            } else {
                actionBtn = `
                <button class="btn btn-outline-secondary btn-sm view-individual-payment-fallback-btn ${viewedClass}" 
                        data-record-number="${p.record_number}" 
                        data-payment-status="${p.payment_status}"
                        data-nro-ticket="${nroTicket}"
                        data-serial-pos="${serialPos}"
                        data-id-payment-record="${p.id_payment_record}"
                        title="Buscar Comprobante"
                        style="width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; padding: 0;">
                    <i class="fas fa-search"></i>
                </button>`;
            }

            const row = `
                <tr>
                    <td class="fw-medium">${p.payment_reference || 'N/A'}</td>
                    <td class="text-center text-muted">${p.payment_date || 'N/A'}</td>
                    <td class="text-end fw-bold">${p.amount_bs ? p.amount_bs + ' Bs' : '0.00 Bs'}</td>
                    <td class="text-end fw-bold text-primary">${p.reference_amount ? '$' + p.reference_amount : '$0.00'}</td>
                    <td class="text-center">${statusBadge}</td>
                    <td class="text-center">${actionBtn}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }
    
    // ✅ Habilitar/Deshabilitar botón de Finalizar Revisión
    const btnFinalizar = document.getElementById('btnFinalizarRevision');
    if (btnFinalizar) {
        // Si el ticket ya tiene estatus 6 (Anticipo aprobado), ocultamos el botón
        if (idStatusPayment == 6) {
            btnFinalizar.style.display = 'none';
        } else {
            btnFinalizar.style.display = 'inline-block'; 

            const totalBudget = budgetData ? parseFloat(budgetData.total_budget || 0) : 0;
            const totalPaid = budgetData ? parseFloat(budgetData.total_paid || 0) : 0;

            // NUEVA LÓGICA: Un pago se considera "revisado" si ya no está en estatus Pendiente.
            // Los iconos de advertencia (reloj) aparecen cuando el estatus no es 6 (Aprobado) 
            // ni uno de los de rechazo (12, 13, 14).
            const allReviewed = paymentsObj.length > 0 && paymentsObj.every(p => {
                const isApproved = p.payment_status == 6;
                const isRejected = p.payment_status == 12 || p.payment_status == 13 || p.payment_status == 14;
                return isApproved || isRejected;
            });

            // Se habilita solo si se ha pagado el total del presupuesto con pagos APROBADOS
            // y TODOS los registros han sido revisados (sin iconos de advertencia).
            const isFullyPaid = totalBudget > 0 && totalPaid >= totalBudget;
            
            btnFinalizar.disabled = !(allReviewed && isFullyPaid);
            btnFinalizar.setAttribute('data-nro-ticket', nroTicket);
            
            if (!allReviewed) {
                btnFinalizar.title = "Todos los pagos deben ser revisados (Aprobados o Rechazados) para finalizar";
            } else if (!isFullyPaid) {
                btnFinalizar.title = `El presupuesto ($${totalBudget.toFixed(2)}) debe estar cubierto por pagos APROBADOS para finalizar`;
            } else {
                btnFinalizar.title = "Finalizar revisión y permitir que el ticket siga su curso";
            }
        }
    }
    
    if (!detailedPaymentModalInstance) {
        detailedPaymentModalInstance = new bootstrap.Modal(modalElement);
    }
    detailedPaymentModalInstance.show();
}

/**
 * Evento para finalizar la revisión global del ticket
 */
$(document).on('click', '#btnFinalizarRevision', function() {
    const nroTicket = $(this).attr('data-nro-ticket');
    const id_user = document.getElementById('userId').value;

    if (!nroTicket || !id_user) {
        Swal.fire('Error', 'No se pudo identificar el ticket o el usuario', 'error');
        return;
    }

    const customQuestionSvg = `
    <div class="custom-icon-wrapper" style="margin-bottom: 20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#003594" class="bi bi-question-circle-fill custom-icon-animation" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.24-2.673-2.24-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
        </svg>
    </div>`;

    Swal.fire({
        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                    <div class="custom-modal-header-content">¿Finalizar Revisión?</div>
                </div>`,
        html: `
            ${customQuestionSvg}
            <div style="font-size: 1.1rem; color: #495057; margin-top: 15px;">
                Esta acción cambiará el estatus del ticket <span style="font-weight: bold; color: #003594; background: rgba(0, 53, 148, 0.1); padding: 2px 8px; border-radius: 4px;">${nroTicket}</span> 
                para que pueda seguir su curso.
            </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#003594',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="fas fa-check-circle me-2"></i> Finalizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        color: 'black',
        backdrop: `rgba(0, 0, 0, 0.4)`,
        allowOutsideClick: false,
        didOpen: () => {
            const container = document.querySelector('.swal2-container');
            const popup = document.querySelector('.swal2-popup');
            const htmlContainer = document.querySelector('.swal2-html-container');
            
            if (container) {
                container.style.zIndex = '2060';
                container.style.backdropFilter = 'blur(8px)';
            }
            
            if (popup) {
                popup.style.background = 'rgba(255, 255, 255, 0.95)';
                popup.style.backdropFilter = 'blur(10px)';
                popup.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                popup.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                popup.style.borderRadius = '16px';
            }

            if (htmlContainer) {
                htmlContainer.style.setProperty('overflow', 'hidden', 'important');
                htmlContainer.style.setProperty('overflow-y', 'hidden', 'important');
                htmlContainer.style.paddingRight = '0';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Procesando...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            $.ajax({
                url: `${ENDPOINT_BASE}${APP_PATH}api/consulta/finalizarRevisionTicket`,
                type: 'POST',
                data: { nroTicket: nroTicket, id_user: id_user },
                dataType: 'json',
                success: function(response) {
                    Swal.close();
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Finalizado!',
                            text: response.message,
                            confirmButtonColor: '#003594',
                            color: 'black'
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire('Error', response.message || 'Error al finalizar la revisión', 'error');
                    }
                },
                error: function() {
                    Swal.close();
                    Swal.fire('Error', 'Error de conexión con el servidor', 'error');
                }
            });
        }
    });
});

/**
 * Eventos para manejar la interacción con los nuevos botones
 */
$(document).ready(function() {
    // Botón de Info en la tabla principal
    $(document).on('click', '.view-payments-info-btn', async function() {
        // Usar la API de DataTable para obtener los datos de la fila de forma segura
        const table = $('#tabla-ticket').DataTable();
        const rowData = table.row($(this).closest('tr')).data();
        
        if (!rowData) {
            console.error('No se pudo obtener la data de la fila');
            const nroTicketAttr = $(this).attr('data-nro-ticket');
            if (nroTicketAttr) {
                // Fallback a los atributos si falla la API
                fetchDataAndShowModal(nroTicketAttr, 
                    $(this).attr('data-rif'), 
                    $(this).attr('data-razon-social'), 
                    $(this).attr('data-serial-pos') || 'Sin posición',
                    $(this).attr('data-id-status-payment'),
                    $(this).attr('data-estatus-pos') || 'No disponible');
            }
            return;
        }

        const nroTicket = rowData.nro_ticket;
        const rif = rowData.rif;
        const razonSocial = rowData.razonsocial_cliente;
        const serialPos = rowData.serial_pos || 'Sin posición';
        const estatusPos = rowData.estatus_inteliservices || 'No disponible';
        const idStatusPayment = rowData.id_status_payment;
        
        console.log('Detalle de Pagos Clicked (DataTable Data):', { nroTicket, rif, razonSocial, serialPos, estatusPos });
        
        if (!nroTicket) {
            Swal.fire('Error', 'No se pudo obtener el número de ticket', 'error');
            return;
        }

        fetchDataAndShowModal(nroTicket, rif, razonSocial, serialPos, idStatusPayment, estatusPos);
    });

    async function fetchDataAndShowModal(nroTicket, rif, razonSocial, serialPos, idStatusPayment, estatusPos = 'No disponible') {
        // Mostrar loading
        Swal.fire({
            title: 'Cargando información...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Parallel fetch for payments and budget data
            const [respPayments, respBudget] = await Promise.all([
                fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/GetPaymentsByTicket`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `nro_ticket=${encodeURIComponent(nroTicket)}`
                }),
                fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/handleGetTotalPaidByTicket`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `nro_ticket=${encodeURIComponent(nroTicket)}`
                })
            ]);

            const resultPayments = await respPayments.json();
            const resultBudget = await respBudget.json();
            
            Swal.close();

            if (resultPayments.success && resultPayments.payments) {
                // Extract serial_pos from first payment record if available, fallback to provided data
                const serialPosFromApi = resultPayments.payments.length > 0 && resultPayments.payments[0].serial_pos 
                    ? resultPayments.payments[0].serial_pos 
                    : serialPos;
                
                // Convert resultPayments.payments to standardized payments array
                const payments = resultPayments.payments.map(p => ({
                    id_payment_record: p.id_payment_record,
                    record_number: p.record_number,
                    payment_date: p.payment_date,
                    payment_method: p.payment_method,
                    currency: p.currency,
                    amount_bs: p.amount_bs,
                    reference_amount: p.reference_amount,
                    payment_reference: p.payment_reference,
                    depositor: p.depositor,
                    origen_bank: p.origen_bank,
                    destination_bank: p.destination_bank,
                    confirmation_number: p.confirmation_number,
                    payment_status: p.payment_status,
                    file_path: p.file_path || p.receipt_path,
                    mime_type: p.receipt_mime,
                    original_filename: p.receipt_name,
                    nro_ticket: nroTicket,
                    document_type: p.document_type
                }));

                const clientInfo = { rif, razonSocial };
                const budgetData = resultBudget.success ? {
                    total_paid: resultBudget.total_paid,
                    total_budget: resultBudget.total_budget,
                    presupuesto_diferencia: resultBudget.presupuesto_diferencia
                } : null;

                // Store global context for validation
                if (budgetData) {
                    window.currentBudgetAmount = parseFloat(budgetData.total_budget || 0);
                    // Remaining for NEW payments is total_budget - total_paid
                    window.currentRemaining = window.currentBudgetAmount > 0 
                        ? (window.currentBudgetAmount - parseFloat(budgetData.total_paid || 0)) 
                        : 0;
                } else {
                    window.currentBudgetAmount = 0;
                    window.currentRemaining = 0;
                }

                showPaymentsDetail(nroTicket, payments, serialPosFromApi, idStatusPayment, clientInfo, budgetData, estatusPos);
            } else {
                Swal.fire('Error', 'No se pudieron cargar los pagos', 'error');
            }
        } catch (error) {
            Swal.close();
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'Error al cargar la información: ' + error.message, 'error');
        }
    }

    // Botón de Ver Comprobante dentro del modal de detalle
    $(document).on('click', '.view-individual-payment-btn', function() {
        const p = JSON.parse($(this).attr('data-payment-data'));
        const serialPos = $(this).attr('data-serial-pos');
        
        // Marcar como visualizado
        if (p.id_payment_record) {
            viewedPayments.add(String(p.id_payment_record));
            $(this).addClass('viewed');
        }
        
        // Establecer ID global para la aprobación itemizada
        currentIdPaymentRecord = p.id_payment_record;
        currentTicketNroForImage = p.nro_ticket;
        
        if (typeof showApprovalModal === 'function') {
            showApprovalModal(
                p.nro_ticket, 
                p.document_type || 'Anticipo', 
                p.file_path, 
                p.mime_type || 'image/jpeg', 
                p.original_filename, 
                serialPos || 'Sin posicin', 
                p.payment_status == 13, 
                p.payment_status
            );
        } else {
            Swal.fire('Error', 'No se pudo cargar el visor de imágenes', 'error');
        }
    });

    // Botón de Búsqueda Fallback dentro del modal de detalle
    $(document).on('click', '.view-individual-payment-fallback-btn', function() {
        const recordNumber = $(this).attr('data-record-number');
        const paymentStatus = $(this).attr('data-payment-status');
        const nroTicket = $(this).attr('data-nro-ticket');
        const serialPos = $(this).attr('data-serial-pos');
        const idPaymentRecord = $(this).attr('data-id-payment-record');

        // Marcar como visualizado
        if (idPaymentRecord) {
            viewedPayments.add(String(idPaymentRecord));
            $(this).addClass('viewed');
        }

        Swal.fire({
            title: 'Buscando comprobante...',
            text: 'Espere un momento, por favor.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        $.ajax({
            url: `${ENDPOINT_BASE}get-payment-attachment`,
            type: 'POST',
            data: { record_number: recordNumber },
            dataType: 'json',
            success: function(response) {
                Swal.close();
                if (response.success && response.data) {
                    const att = response.data;
                    
                    // Actualizar ID global para la aprobación
                    currentIdPaymentRecord = att.id_payment_record || null;
                    currentTicketNroForImage = nroTicket;

                    if (typeof showApprovalModal === 'function') {
                        showApprovalModal(
                            nroTicket,
                            att.document_type || 'Anticipo',
                            att.file_path,
                            att.mime_type || 'image/jpeg',
                            att.original_filename,
                            serialPos || 'Sin posicin',
                            paymentStatus == 13,
                            paymentStatus
                        );
                    }
                } else {
                    Swal.fire('No encontrado', response.message || 'No se encontró el archivo adjunto para este registro.', 'warning');
                }
            },
            error: function(err) {
                Swal.fire('Error', 'Error al realizar la búsqueda del comprobante', 'error');
                console.error('Error fallback search:', err);
            }
        });
    });

    // Listener para el botón de Re-upload / Corregir Pago (Status 12)
    // Listener para el botón de Re-upload / Corregir Pago (Status 12)
    $(document).on('click', '.reupload-payment-btn', function() {
        // Reset the form first to clear previous values
        const form = document.getElementById('formAgregarDatosPago');
        if (form) form.reset();

        const nroTicket = $(this).attr('data-nro-ticket');
        const serialPos = $(this).attr('data-serial-pos');
        const documentType = $(this).attr('data-document-type');
        const razonSocial = $(this).attr('data-razon-social');
        const rif = $(this).attr('data-rif');
        
        // Store Original Context for validation
        window.currentOldAmount = parseFloat($(this).attr('data-reference-amount')) || 0;
        window.currentOldStatus = parseInt($(this).attr('data-payment-status')) || 0;
        
        // 1. Llenar los campos del modal
        const serialInput = document.getElementById('serialPosPago');
        if (serialInput) serialInput.value = serialPos || '';

        const ticketInput = document.getElementById('nro_ticket_pago');
        if (ticketInput) ticketInput.value = nroTicket || '';

        const docTypeInput = document.getElementById('document_type_pago');
        if (docTypeInput && documentType) docTypeInput.value = documentType;

        const idRecInput = document.getElementById('id_payment_record_loading');
        const idRec = $(this).attr('data-id-payment-record');
        if (idRecInput) idRecInput.value = idRec || '';

        const recordNumberInput = document.getElementById('registro');
        const recordNumber = $(this).attr('data-record-number');
        if (recordNumberInput) recordNumberInput.value = recordNumber || '';

        // Poblar sección de Información del Cliente
        const razorSocialInput = document.getElementById('displayRazonSocial');
        if (razorSocialInput) razorSocialInput.value = razonSocial || '';

        const rifInput = document.getElementById('displayRif');
        if (rifInput) rifInput.value = rif || '';

        const estatusPosInput = document.getElementById('displayEstatusPos');
        const estatusPosValue = $(this).attr('data-estatus-pos');
        if (estatusPosInput) estatusPosInput.value = estatusPosValue || 'No disponible';

        // Depositante por defecto es la razón social
        const depositanteInput = document.getElementById('depositante');
        if (depositanteInput && razonSocial) depositanteInput.value = razonSocial;
        
        // 2. Abrir el modal
        const modalElement = document.getElementById('modalAgregarDatosPago');
        
        // Cargar listas desplegables
        if (typeof loadPaymentMethods === 'function') loadPaymentMethods();
        if (typeof loadBancos === 'function') loadBancos();

        // Establecer estatus dinámicamente
        if (typeof getPagoEstatus === 'function') {
            getPagoEstatus(nroTicket, documentType);
        } else {
             const estatusInput = document.getElementById('estatus');
             if (estatusInput) estatusInput.value = 'Por Aprobar'; // Fallback
        }

        // --- NUEVO: Setear Fecha de Carga (Hoy) ---
        const fechaCargaInput = document.getElementById('fechaCarga');
        if (fechaCargaInput) {
            const today = new Date().toISOString().split('T')[0];
            fechaCargaInput.value = today;
        }
        // -----------------------------------------

        if (modalElement) {
            // FIX: Forzar z-index superior para que se vea sobre el otro modal
            modalElement.style.zIndex = '2060';
            
            if (modalAgregarDatosPagoInstance) {
                modalAgregarDatosPagoInstance.show();
            } else {
                const modalInstance = new bootstrap.Modal(modalElement);
                modalInstance.show();
            }

            // Ajustar el backdrop que se crea dinámicamente
            setTimeout(() => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                if (backdrops.length > 1) {
                    // El último backdrop creado (para este modal) debe estar justo debajo del modal (2059)
                    // Bootstrap usa 1050 por defecto.
                    backdrops[backdrops.length - 1].style.zIndex = '2059';
                }
            }, 100);
        } else {
            console.error('Modal modalAgregarDatosPago no encontrado en el DOM');
            Swal.fire('Error', 'No se puede abrir el formulario de carga. Contacte soporte.', 'error');
        }
    });

    // Configurar generación automática del número de registro cuando el DOM esté listo
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            setupAutoRegistrationNumber();
            setupNumericValidation();
            setupBudgetValidationListeners();
        });
    } else {
        setupAutoRegistrationNumber();
        setupNumericValidation();
        setupBudgetValidationListeners();
    }

});

// --- BUDGET VALIDATION LOGIC FOR SUBSTITUTIONS ---

function setupBudgetValidationListeners() {
    $('#montoBs, #montoRef').on('input keyup change', function() {
        validateEditBudget();
    });
}

function showOverBudgetAlert(inputAmount, limit, isEdit = false) {
    Swal.fire({
        icon: 'warning',
        title: 'Límite de Presupuesto Excedido',
        html: `
            <div style="text-align: left;">
                <p>El monto ingresado <b>($${inputAmount.toFixed(2)})</b> excede el presupuesto disponible.</p>
                <p><b>Presupuesto Disponible:</b> $${limit.toFixed(2)}</p>
                <hr>
                <small>Por favor, ajuste el monto para continuar.</small>
            </div>
        `,
        confirmButtonColor: '#003594',
        target: document.getElementById('modalAgregarDatosPago'),
        customClass: { container: 'payment-alert-modal' }
    });
}

function validateEditBudget(showModal = false) {
    const montoRefInput = document.getElementById("montoRef");
    const btnGuardar = document.getElementById("btnGuardarDatosPago");
    
    // Only valid if we have budget data
    if (typeof window.currentBudgetAmount === 'undefined' || window.currentBudgetAmount <= 0) {
        if(btnGuardar) btnGuardar.disabled = false;
        return true;
    }

    const inputAmount = parseFloat(montoRefInput.value) || 0;
    const currentRemaining = window.currentRemaining || 0;
    
    // Check if we are in "Substitute" mode (have an old amount)
    const idRec = document.getElementById("id_payment_record_loading") ? document.getElementById("id_payment_record_loading").value : "";
    
    // --- LÓGICA CRÍTICA: Definir si sumamos el originalAmount al presupuesto disponible ---
    // El backend (total_paid) ya suma los estatus: 1, 3, 4, 5, 6, 7, 17.
    // Si el pago que estamos sustituyendo YA estaba en uno de esos estatus, debemos sumarlo 
    // al "restante efectivo" porque lo estamos reemplazando.
    // Si era un estatus RECHAZADO (12, 13, 14), el backend NO lo sumó, así que NO debemos sumarlo aquí.
    const accountedStatuses = [1, 3, 4, 5, 6, 7, 17];
    const wasAccounted = accountedStatuses.includes(window.currentOldStatus);
    
    const originalAmount = (idRec && idRec !== "" && wasAccounted) ? (window.currentOldAmount || 0) : 0;
    
    // The "True Remaining" for THIS edit/substitute is (Current Remaining + Original Amount of this record if it was paid)
    const effectiveRemaining = currentRemaining + originalAmount;
    
    const isOverBudget = inputAmount > (effectiveRemaining + 0.001);

    if (isOverBudget) {
        if (btnGuardar) {
            btnGuardar.disabled = true;
            btnGuardar.title = "El monto excede el presupuesto disponible";
        }
        montoRefInput.style.borderColor = "#dc3545";
        montoRefInput.style.backgroundColor = "#fff5f5";

        if (showModal) {
            showOverBudgetAlert(inputAmount, effectiveRemaining, true);
        }
        return false;
    } else {
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.title = "";
        }
        montoRefInput.style.borderColor = "";
        montoRefInput.style.backgroundColor = "";
        return true;
    }
}

/**
 * Función para resetear la interfaz de Soporte Digital
 */
function resetDocumentoPagoUI() {
    const input = document.getElementById("documentFileDetailed");
    const fileNameDisplay = document.getElementById("fileNameDocumentFileDetailed");
    const textDisplay = document.getElementById("textDocumentFileDetailed");
    const iconDisplay = document.getElementById("iconDocumentFileDetailed");
    const labelDisplay = document.getElementById("labelDocumentFileDetailed");
    
    if (input) input.value = "";
    
    if (fileNameDisplay) {
        fileNameDisplay.textContent = "";
        fileNameDisplay.classList.add("d-none");
    }
    if (textDisplay) textDisplay.classList.remove("d-none");
    
    if (iconDisplay) {
        iconDisplay.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-camera text-secondary" viewBox="0 0 16 16"><path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/><path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/></svg>';
    }
    if (labelDisplay) {
        labelDisplay.style.borderColor = "#cbd5e0"; 
        labelDisplay.style.backgroundColor = "#f8f9fa";
    }
}

// Escuchador para el input de archivo de Soporte Digital
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'documentFileDetailed') {
        const fileNameDisplay = document.getElementById("fileNameDocumentFileDetailed");
        const textDisplay = document.getElementById("textDocumentFileDetailed");
        const iconDisplay = document.getElementById("iconDocumentFileDetailed");
        const labelDisplay = document.getElementById("labelDocumentFileDetailed");
        
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (fileNameDisplay) {
                fileNameDisplay.textContent = file.name;
                fileNameDisplay.classList.remove("d-none");
            }
            if (textDisplay) textDisplay.classList.add("d-none");
            
            if (iconDisplay) {
                iconDisplay.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-check-circle text-success" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>';
            }
            if (labelDisplay) {
                labelDisplay.style.borderColor = "#28a745";
                labelDisplay.style.backgroundColor = "#e8f5e9";
            }
        } else {
            resetDocumentoPagoUI();
        }
    }
});
