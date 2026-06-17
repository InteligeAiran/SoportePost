function formatTicketDetailsPanel(d) {
  // d es el objeto `data` completo del ticket o de la solicitud administrativa

  const initialImageUrl = "assets/img/loading-placeholder.png";
  const initialImageAlt = "Cargando imagen del dispositivo...";

  // Propiedades unificadas (Fallback para Solicitudes Administrativas)
  const isAdminReq = !d.nro_ticket && d.nro_solicitud;
  const numToDisplay = d.nro_ticket || d.nro_solicitud || "N/A";
  const serialToDisplay = d.serial_pos || (isAdminReq ? "No aplica" : "No disponible");
  const estatusPosToDisplay = d.estatus_inteliservices || (isAdminReq ? "No aplica" : "N/A");
  const estatusTicketToDisplay = d.name_status_ticket || d.status_name || "Desconocido";
  const observacionToDisplay = d.name_failure || d.observacion || "Sin registro";
  let rawFecha = d.create_ticket || d.created_at || "Desconocido";
  let fechaToDisplay = rawFecha;
  if (rawFecha !== "Desconocido" && typeof rawFecha === 'string') {
      let parts = rawFecha.split(' ');
      if (parts.length >= 2) {
          let timeParts = parts[1].split(':');
          if (timeParts.length >= 2) {
              fechaToDisplay = parts[0] + ' ' + timeParts[0] + ':' + timeParts[1];
          }
      }
  }
  const userToDisplay = d.full_name_tecnico || d.full_name_tecnico1 || d.user_creation || "Sin asignar";
  const addressToDisplay = d.nombre_estado_cliente || d.estado_cliente || d.estado || d.direccion || d.direccion_cliente || d.razon_social || "Sin datos";

  // Determina el mensaje de garantía
  let garantiaMessage = 'No aplica Garantía';
  const idStatusPayment = d.id_status_payment ? parseInt(d.id_status_payment) : null;
  
  if (idStatusPayment === 1 || d.garantia_instalacion === true || d.garantia_instalacion === 't' || d.garantia_instalacion === 'true' || d.garantia_instalacion === 1 || d.garantia_instalacion === '1') {
    garantiaMessage = 'Aplica Garantía de Instalación';
  } else if (idStatusPayment === 3 || d.garantia_reingreso === true || d.garantia_reingreso === 't' || d.garantia_reingreso === 'true' || d.garantia_reingreso === 3 || d.garantia_reingreso === '3') {
    garantiaMessage = 'Aplica Garantía por Reingreso';
  }


  if (isAdminReq) {
      garantiaMessage = "No aplica (Solicitud Adm.)";
  }

  // Define status colors purely by ID as requested
  const statusId = parseInt(d.id_status_administrativo || 0);
  let estatusColorStyle = '#64748b'; // default slate color
  
  if (statusId === 1) {
    estatusColorStyle = '#f59e0b'; // amber/orange
  } else if (statusId === 2) {
    estatusColorStyle = '#3b82f6'; // blue
  } else if (statusId === 3) {
    estatusColorStyle = '#10b981'; // green
  } else if (statusId === 4) {
    estatusColorStyle = '#ef4444'; // red
  }

  // Detecta si el ticket está cerrado
  const isTicketClosed = (
    (d.name_status_ticket && d.name_status_ticket.trim().toLowerCase() === 'cerrado') ||
    (d.name_accion_ticket && (
      d.name_accion_ticket.trim().toLowerCase() === 'cerrado' ||
      d.name_accion_ticket.trim().toLowerCase() === 'ticket cerrado'
    ))
  );

  return `
        <div class="container-fluid">
            <div class="row mb-3 align-items-center">
                ${!isAdminReq ? `
                <div class="col-md-3 text-center">
                    <div id="device-image-container" class="p-2">
                      <img id="device-ticket-image" src="${initialImageUrl}" alt="${initialImageAlt}">
                    </div>
                </div>
                ` : ''}
                <div class="${!isAdminReq ? 'col-md-9' : 'col-md-12'}">
                    <h4 style = "color: black;">${isAdminReq ? 'Solicitud' : 'Ticket'} #${numToDisplay}</h4>
                    <hr class="mt-2 mb-3">
                    <div class="row">
                        ${!isAdminReq ? `
                        <div class="col-sm-6 mb-2">
                          <strong><div>Serial POS:</div></strong>
                          ${serialToDisplay}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <strong><div>Estatus POS:</div></strong>
                          ${estatusPosToDisplay}
                        </div><br>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Fecha Instalación:</div></strong>
                          ${d.fecha_instalacion || d.fechainstalacion || 'No posee'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Fecha último ticket:</div></strong>
                          ${d.fecha_cierre_anterior || d.fechacierreanterior || 'No posee'}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Garantía:</div></strong>
                          <span style="font-weight: bold; color: ${garantiaMessage.includes('Aplica') ? 'red' : 'green'};">${garantiaMessage}</span>
                        </div>
                        ` : ''}
                        
                        ${isAdminReq ? `
                        <!-- Rich Layout optimized for Solicitud -->
                        <style>
                          .neon-card {
                            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                          }
                          .neon-card:hover {
                            transform: translateY(-5px);
                            box-shadow: 0px 8px 25px rgba(0, 212, 255, 0.7), 0px 6px 15px rgba(0, 212, 255, 0.4) !important;
                            cursor: pointer;
                          }
                        </style>
                        <div class="row g-3 px-2 w-100 pb-3">
                          <div class="col-md-4">
                            <div class="card h-100 neon-card" style="background: #ffffff; border-radius: 12px; border: none; box-shadow: 0px 0px 15px rgba(0, 212, 255, 0.4), 0px 4px 8px rgba(0, 212, 255, 0.2);">
                              <div class="card-body p-3 text-center align-content-center">
                                <h6 style="color: #111827; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Fecha Creaci&oacuten</h6>
                                <p style="color: #64748b; font-size: 0.9rem; font-weight: 500; margin-bottom: 0;">${fechaToDisplay}</p>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="card h-100 neon-card" style="background: #ffffff; border-radius: 12px; border: none; box-shadow: 0px 0px 15px rgba(0, 212, 255, 0.4), 0px 4px 8px rgba(0, 212, 255, 0.2);">
                              <div class="card-body p-3 text-center align-content-center">
                                <h6 style="color: #111827; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Usuario Creaci&oacuten</h6>
                                <p style="color: #64748b; font-size: 0.9rem; font-weight: 500; margin-bottom: 0;">${userToDisplay}</p>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="card h-100 neon-card" style="background: #ffffff; border-radius: 12px; border: none; box-shadow: 0px 0px 15px rgba(0, 212, 255, 0.4), 0px 4px 8px rgba(0, 212, 255, 0.2);">
                              <div class="card-body p-3 text-center align-content-center">
                                <h6 style="color: #111827; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Estatus</h6>
                                <p style="color: ${estatusColorStyle}; font-size: 0.95rem; font-weight: 700; margin-bottom: 0;">${estatusTicketToDisplay}</p>
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12">
                            <div class="card mt-2 neon-card" style="background: #ffffff; border-radius: 12px; border: none; box-shadow: 0px 0px 15px rgba(0, 212, 255, 0.4), 0px 4px 8px rgba(0, 212, 255, 0.2);">
                              <div class="card-body p-3 text-center">
                                <h6 style="color: #111827; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Cliente Raz&oacuten Social</h6>
                                <p style="color: #64748b; font-size: 0.95rem; font-weight: 500; margin-bottom: 0;">${addressToDisplay}</p>
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12">
                            <div class="card mt-2 mb-2 neon-card" style="background: #ffffff; border-radius: 12px; border: none; box-shadow: 0px 0px 15px rgba(0, 212, 255, 0.4), 0px 4px 8px rgba(0, 212, 255, 0.2);">
                              <div class="card-body p-3 text-center">
                                <h6 style="color: #111827; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Observaci&oacuten</h6>
                                <p style="color: #64748b; font-size: 1rem; font-weight: 500; margin-bottom: 0; word-break: break-word;">${observacionToDisplay}</p>
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12 text-center mt-3">
                            ${d.envio === 'Si' || d.exoneracion === 'Si' || d.pago === 'Si' ? `
                              <button id="botonMostarImage" class="btn btn-view-image shadow-sm" style="background: #ffffff; border-radius: 50px; border: 2px solid #00d4ff; padding: 10px 25px; color: #111827; font-weight: 700; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;"
                                data-ticket-id="${d.id_solicitud}"
                                data-nro-ticket="${d.nro_solicitud}"
                                data-envio="${d.envio}"
                                data-exoneracion="${d.exoneracion}"
                                data-pago="${d.pago}"
                                data-presupuesto="${d.presupuesto || 'No'}"
                                data-anticipo="${d.anticipo || 'No'}"
                                data-pago-taller="${d.pago_taller || 'No'}"
                                data-rechazado="${d.rechazado || 'f'}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#00d4ff" class="bi bi-images" viewBox="0 0 16 16">
                                  <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                  <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8zM14 5a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5z"/>
                                </svg>
                                Visualizar Documentos
                              </button>
                            ` : ''}
                          </div>
                        </div>
                        ` : `
                        <!-- Original layout for Ticket -->
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Creación:</div></strong>
                          ${fechaToDisplay}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Usuario Creación:</div></strong>
                          ${userToDisplay}
                        </div>
                        <div class="col-sm-6 mb-2">
                          <br><strong><div>Cliente / Instalación:</div></strong>
                          ${addressToDisplay}
                        </div><br>
                         <div class="col-sm-6 mb-2">
                            <br><strong><div>Estatus:</div></strong>
                            <span style="font-weight: bold; color: ${estatusColorStyle};">${estatusTicketToDisplay}</span>
                        </div><br>
                        <br><div class="col-sm-6 mb-2">
                              <br><strong><div>Falla Reportada:</div></strong>
                             <span class="falla-reportada-texto">${observacionToDisplay}</span>
                        </div>
                        <div class="col-12 mt-3 mb-1" style="display: ${
                            isTicketClosed ||
                            (window.location.pathname.toLowerCase().includes('asignar_tecnico') &&
                             (!d.full_name_tecnico_n2_actual || 
                              d.full_name_tecnico_n2_actual.trim() === '' || 
                              d.full_name_tecnico_n2_actual.trim().toLowerCase() === 'no asignado'))
                            ? 'none' : 'block'
                        };">
                            <button type="button"
                                id="btnCerrarTicketGlobal"
                                class="btn btn-danger w-100 fw-semibold shadow-sm"
                                data-id-ticket="${d.id_ticket || d.id || ''}"
                                data-nro-ticket="${d.nro_ticket || ''}"
                                data-serial-pos="${d.serial_pos || ''}"
                                style="background: linear-gradient(135deg,#c0392b,#e74c3c); border:none; border-radius:10px; letter-spacing:.5px; transition:all .25s;">
                                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-x-octagon-fill me-2' viewBox='0 0 16 16'>
                                    <path d='M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zm-6.106 4.5L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 9l2.647 2.646a.5.5 0 0 1-.708.708L8 9.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 9 4.646 6.354a.5.5 0 1 1 .708-.708'/>
                                </svg>
                                Cerrar Ticket
                            </button>
                        </div>
                        <div class="col-sm-6 mb-2" style="display: ${(isTicketClosed || isAdminReq || d.name_accion_ticket === 'En espera de confirmar recibido en Región') ? 'none' : 'block'};">
                          <button type="button" class="btn btn-link p-0" id="hiperbinComponents" data-id-ticket = "${d.id_ticket || d.id || ""}" data-serial-pos = "${d.serial_pos || ""}">
                            <i class="bi bi-box-seam-fill me-1"></i> Cargar Periféricos del Dispositivo
                          </button>
                        </div>    
                        `}
                    </div>
                </div>
            </div>
            <hr class="mt-2 mb-3">
            <div class="row">
                <div class="col-12">
                    <h5 style = "color: black;" >Gestión / Historial:</h5>
                    <div id="ticket-history-content">
                        <p>Selecciona un ${isAdminReq ? 'registro' : 'ticket'} para cargar su historial.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}



function loadTicketHistory(ticketId, currentTicketNroForImage, serialPos = '', idCliente = '') {
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
            timeText = `${diffWeeks}S ${remainingDays}D`;
        } else if (diffDays > 0) {
            const remainingHours = diffHours % 24;
            const remainingMinutes = diffMinutes % 60;
            timeText = `${diffDays}D ${remainingHours}H ${remainingMinutes}Min`;
        } else if (diffHours > 0) {
            const remainingMinutes = diffMinutes % 60;
            timeText = `${diffHours}H ${remainingMinutes}Min`;
        } else if (diffMinutes > 0) {
            timeText = `${diffMinutes}Min`;
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
            id_cliente: idCliente,
            search_by_client: (!serialPos && idCliente) ? true : false,
        },
        dataType: "json",
        success: function(response) {
            if (response.success && response.history && response.history.length > 0) {
                let historyHtml = `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <div title="Leyenda de Colores y Tiempo de Gestiones">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#17a2b8" class="bi bi-info-square-fill" viewBox="0 0 16 16" style="cursor: pointer;" data-toggle="collapse" data-target="#colorLegend_${ticketId}" aria-expanded="false" aria-controls="colorLegend_${ticketId}" title="Leyenda de Colores">
                            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                      </div>
                        <button style = "background-color: #17a2b8;" class="btn btn-secondary" title = "Imprimir Historial" onclick="printHistory('${ticketId}', '${encodeURIComponent(JSON.stringify(response.history))}', '${currentTicketNroForImage}', '${serialPos}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
                              <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/>
                              <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                            </svg>
                        </button>
                    </div>
                    <div class="collapse mb-3" id="colorLegend_${ticketId}">
                            <div class="alert alert-info" role="alert">
                                <div class="d-flex flex-wrap gap-3">
                                    <div class="d-flex align-items-center">
                                        <span class="badge me-2" style="background-color: #ffc107; color: #ffffff; min-width: 80px; padding: 6px 12px;">Amarillo</span>
                                        <span style="color: #ffffff; font-weight: 600;">Gestión actual</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge me-2" style="background-color: #5d9cec; color: #ffffff; min-width: 80px; padding: 6px 12px;">Azul</span>
                                        <span style="color: #ffffff; font-weight: 600;">Gestiones anteriores</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge me-2" style="background-color: #fd7e14; color: #ffffff; min-width: 80px; padding: 6px 12px;">Naranja</span>
                                        <span style="color: #ffffff; font-weight: 600;">Cambio de Estatus Taller</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge me-2" style="background-color: #28a745; color: #ffffff; min-width: 80px; padding: 6px 12px;">Verde</span>
                                        <span style="color: #ffffff; font-weight: 600;">Cambio de Estatus Domiciliación</span>
                                    </div>
                                </div>
                                <div class="mt-3 pt-3 border-top border-light">
                                    <div class="d-flex flex-wrap gap-3">
                                        <div class="d-flex align-items-center">
                                            <span style="color: #ffffff; font-weight: 700; font-size: 1.1em; margin-right: 8px;">TG:</span>
                                            <span style="color: #ffffff; font-weight: 600;">Tiempo Duración Gestión Anterior</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span style="color: #ffffff; font-weight: 700; font-size: 1.1em; margin-right: 8px;">TR:</span>
                                            <span style="color: #ffffff; font-weight: 600;">Tiempo Duración Revisión Domiciliación</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span style="color: #ffffff; font-weight: 700; font-size: 1.1em; margin-right: 8px;">TT:</span>
                                            <span style="color: #ffffff; font-weight: 600;">Tiempo Duración en Taller</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3 pt-3 border-top border-light">
                                    <div style="text-align: center; margin-bottom: 12px;">
                                        <h5 style="color: #ffffff; font-weight: 700; font-size: 1.1em; margin-bottom: 10px;">LEYENDA DE TIEMPO</h5>
                            </div>
                                    <div class="d-flex flex-wrap gap-3 justify-content-center">
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #8b5cf6; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">M</span>
                                            <span style="color: #ffffff; font-weight: 600;">Mes(es)</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #10b981; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">S</span>
                                            <span style="color: #ffffff; font-weight: 600;">Semana(s)</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #10b981; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">D</span>
                                            <span style="color: #ffffff; font-weight: 600;">Día(s)</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #3b82f6; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">H</span>
                                            <span style="color: #ffffff; font-weight: 600;">Hora(s)</span>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" style="background-color: #f59e0b; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">Min</span>
                                            <span style="color: #ffffff; font-weight: 600;">Minuto(s)</span>
                                        </div>
                                    </div>
                                    <div style="text-align: center; margin-top: 10px;">
                                        <p style="color: #ffffff; font-size: 0.85em; font-style: italic; margin: 0;">
                                            Ejemplo: <strong>1M 2S 3D 6H 11Min</strong> significa 1 mes, 2 semanas, 3 días, 6 horas y 11 minutos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    
                    const cleanString = (str) => str && str.replace(/\s/g, ' ').trim() || null;
                    const getChange = (itemVal, prevVal) => (cleanString(itemVal) !== cleanString(prevVal));
                    
                    // Verificar si hay cambio de domiciliación o taller para calcular TG/TR o TG/TT
                    const statusDomChanged = getChange(item.name_status_domiciliacion, prevItem.name_status_domiciliacion);
                    const statusLabChanged = getChange(item.name_status_lab, prevItem.name_status_lab);
                    let durationFromPreviousText = '';
                    let durationFromCreationText = '';
                    let durationLabFromPreviousText = '';
                    let durationLabFromTallerText = '';
                    
                    // Calcular tiempos para Domiciliación
                    if (statusDomChanged && cleanString(item.name_status_domiciliacion)) {
                        // Tiempo 1: Desde la gestión anterior (ya calculado como elapsed)
                        if (prevItem && prevItem.fecha_de_cambio) {
                            const elapsedFromPrevious = calculateTimeElapsed(prevItem.fecha_de_cambio, item.fecha_de_cambio);
                            if (elapsedFromPrevious) {
                                durationFromPreviousText = elapsedFromPrevious.text;
                            }
                        }
                        
                        // Tiempo 2: Desde la creación del ticket
                        let ticketCreationDate = null;
                        const lastHistoryItem = response.history[response.history.length - 1];
                        if (lastHistoryItem && lastHistoryItem.fecha_de_cambio) {
                            ticketCreationDate = lastHistoryItem.fecha_de_cambio;
                        } else {
                            // Buscar el elemento con "Ticket Creado"
                            for (let i = response.history.length - 1; i >= 0; i--) {
                                const histItem = response.history[i];
                                if (histItem && cleanString(histItem.name_accion_ticket) === 'Ticket Creado' && histItem.fecha_de_cambio) {
                                    ticketCreationDate = histItem.fecha_de_cambio;
                                    break;
                                }
                            }
                        }
                        
                        if (ticketCreationDate) {
                            // Calcular duración desde la creación del ticket hasta el cambio actual
                            const duration = calculateTimeElapsed(ticketCreationDate, item.fecha_de_cambio);
                            if (duration) {
                                durationFromCreationText = duration.text;
                            }
                        }
                    }
                    
                    // Calcular tiempos para Taller (solo cuando la acción es "En el Rosal" - terminó la estadía en taller)
                    const currentAccionForLab = cleanString(item.name_accion_ticket);
                    const isEnElRosalForLab = currentAccionForLab && currentAccionForLab.toLowerCase().includes('en el rosal') && !currentAccionForLab.toLowerCase().includes('en espera de confirmar recibido');
                    
                    if (isEnElRosalForLab && statusLabChanged && cleanString(item.name_status_lab)) {
                        // Tiempo 1: Desde la gestión anterior (TG)
                        if (prevItem && prevItem.fecha_de_cambio) {
                            const elapsedFromPrevious = calculateTimeElapsed(prevItem.fecha_de_cambio, item.fecha_de_cambio);
                            if (elapsedFromPrevious) {
                                durationLabFromPreviousText = elapsedFromPrevious.text;
                            }
                        }
                        
                        // Tiempo 2: Sumar todos los tiempos de las gestiones marcadas en naranja (En Taller)
                        // Las gestiones naranjas son aquellas con estatus "En proceso de Reparación" o "Reparado"
                        let totalTallerMinutes = 0;
                        for (let i = index + 1; i < response.history.length; i++) {
                            const histItem = response.history[i];
                            const nextHistItem = response.history[i - 1] || null;
                            
                            if (histItem && histItem.fecha_de_cambio && nextHistItem && nextHistItem.fecha_de_cambio) {
                                const histStatusLab = cleanString(histItem.name_status_lab);
                                const isReparacionStatus = histStatusLab && 
                                    (histStatusLab.toLowerCase().includes('en proceso de reparación') || 
                                     histStatusLab.toLowerCase().includes('reparado'));
                                const isRecibidoEnTaller = histStatusLab && 
                                    histStatusLab.toLowerCase().includes('recibido en taller');
                                
                                // Si es una gestión naranja (taller con reparación), sumar su tiempo
                                if (isReparacionStatus && !isRecibidoEnTaller) {
                                    const duration = calculateTimeElapsed(histItem.fecha_de_cambio, nextHistItem.fecha_de_cambio);
                                    if (duration && duration.minutes) {
                                        totalTallerMinutes += duration.minutes;
                                    }
                                }
                            }
                        }
                        
                        // Convertir el total de minutos a formato legible
                        if (totalTallerMinutes > 0) {
                            const totalHours = Math.floor(totalTallerMinutes / 60);
                            const remainingMinutes = totalTallerMinutes % 60;
                            const totalDays = Math.floor(totalHours / 24);
                            const remainingHours = totalHours % 24;
                            const totalWeeks = Math.floor(totalDays / 7);
                            const remainingDaysAfterWeeks = totalDays % 7;
                            const totalMonths = Math.floor(totalDays / 30.44);
                            
                            if (totalMonths > 0) {
                                const remainingDaysAfterMonths = Math.floor(totalDays % 30.44);
                                durationLabFromTallerText = `${totalMonths}M ${remainingDaysAfterMonths}D`;
                            } else if (totalWeeks > 0) {
                                durationLabFromTallerText = `${totalWeeks}S ${remainingDaysAfterWeeks}D`;
                            } else if (totalDays > 0) {
                                durationLabFromTallerText = `${totalDays}D ${remainingHours}H ${remainingMinutes}Min`;
                            } else if (totalHours > 0) {
                                durationLabFromTallerText = `${totalHours}H ${remainingMinutes}Min`;
                            } else {
                                durationLabFromTallerText = `${remainingMinutes}Min`;
                            }
                        }
                    }
                    
                    // Prioridad: Si la acción es "En el Rosal" (terminó la estadía en taller), mostrar TG y TT; si no, mostrar TG y TR si hay cambio de Domiciliación; si no, tiempo normal
                    if (isEnElRosalForLab && statusLabChanged && cleanString(item.name_status_lab) && (durationLabFromPreviousText || durationLabFromTallerText)) {
                        let tgTtText = '';
                        if (durationLabFromPreviousText && durationLabFromTallerText) {
                            tgTtText = `TG: ${durationLabFromPreviousText}<br>TT: ${durationLabFromTallerText}`;
                        } else if (durationLabFromPreviousText) {
                            tgTtText = `TG: ${durationLabFromPreviousText}`;
                        } else if (durationLabFromTallerText) {
                            tgTtText = `TT: ${durationLabFromTallerText}`;
                        }
                        timeBadge = `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; background-color: #fd7e14 !important; color: white !important; white-space: normal; overflow: visible; line-height: 1.2;">${tgTtText}</span>`;
                    } else if (statusDomChanged && cleanString(item.name_status_domiciliacion)) {
                        // Si hay cambio de domiciliación, mostrar TG y TR en el badge en formato vertical (uno arriba del otro)
                        // Solo mostrar las líneas que tienen valores (no mostrar "N/A")
                        let tdTrText = '';
                        if (durationFromPreviousText && durationFromCreationText) {
                            tdTrText = `TG: ${durationFromPreviousText}<br>TR: ${durationFromCreationText}`;
                        } else if (durationFromPreviousText) {
                            tdTrText = `TG: ${durationFromPreviousText}`;
                        } else if (durationFromCreationText) {
                            tdTrText = `TR: ${durationFromCreationText}`;
                        }
                        if (tdTrText) {
                            timeBadge = `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; background-color: #28a745 !important; color: white !important; white-space: normal; overflow: visible; line-height: 1.2; text-align: center; display: inline-block; min-width: 80px;">${tdTrText}</span>`;
                        }
                    } else if (prevItem.fecha_de_cambio && item.fecha_de_cambio) {
                        // Si no hay cambio de domiciliación ni taller, mostrar el tiempo normal
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

                            timeBadge = `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; cursor: pointer; background-color: ${backgroundColor} !important; color: white !important; white-space: nowrap; overflow: visible;" title="Click para ver agenda" onclick="showElapsedLegend(event)">${timeElapsed.text}</span>`;
                        }
                    }

                    const isCreation = cleanString(item.name_accion_ticket) === 'Ticket Creado';
                    const creationBadge = isCreation && item.fecha_de_cambio ? 
                        `<span class="badge position-absolute" style="top: 8px; right: 8px; font-size: 0.75rem; z-index: 10; cursor: help; background-color: #17a2b8 !important; color: white !important;" title="Fecha de creación">${item.fecha_de_cambio}</span>` : '';

                    const accionChanged = getChange(item.name_accion_ticket, prevItem.name_accion_ticket);
                    const coordChanged = getChange(item.full_name_coordinador, prevItem.full_name_coordinador);
                    const usuarioGestionChanged = getChange(item.usuario_gestion, prevItem.usuario_gestion);
                    const tecnicoChanged = getChange(item.full_name_tecnico_n2_history, prevItem.full_name_tecnico_n2_history);
                    // statusLabChanged y statusDomChanged ya están declarados arriba cuando se calculan TG/TT y TG/TR para el badge
                    const statusPaymentChanged = getChange(item.name_status_payment, prevItem.name_status_payment);
                    
                    // Calcular duración del estatus de Taller (solo cuando la acción es "En el Rosal" - terminó la estadía en taller)
                    // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde "Recibido en Taller"
                    // Nota: durationLabFromPreviousText y durationLabFromTallerText ya se calcularon arriba para el badge (solo cuando es "En el Rosal")
                    // isEnElRosalForLab ya está declarado arriba
                    
                    // Calcular duración del estatus de Domiciliación (solo cuando hay cambio)
                    // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde la creación del ticket
                    // Nota: durationFromPreviousText y durationFromCreationText ya se calcularon arriba para el badge
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

                    // Robust check for Rejection Details: show if there's a rejection reason, a record number, or if the status implies rejection
                    const itemStatusPayment = cleanString(item.name_status_payment) || "";
                    const hasRejectionStatus = itemStatusPayment.toLowerCase().includes('rechazado');
                    const showMotivoRechazo = hasRejectionStatus || cleanString(item.name_motivo_rechazo) || cleanString(item.record_number);

                    const showCommentDevolution = cleanString(item.name_accion_ticket) === 'En espera de Confirmar Devolución' && cleanString(item.comment_devolution) && cleanString(item.envio_destino) !== 'Sí';
                    const showCommentReasignation = cleanString(item.name_accion_ticket) === 'Reasignado al Técnico' && cleanString(item.comment_reasignation);

                    const isAdminRequest = item.is_admin_request === true || item.is_admin_request === 't';

                    // Cambiar color del header si hay cambios en Estatus Taller o Domiciliación
                    let headerStyle = isLatest ? "background-color: #ffc107;" : "background-color: #5d9cec;";
                    let textColor = isLatest ? "color: #343a40;" : "color: #ffffff;";
                    
                    if (isAdminRequest) {
                        headerStyle = "background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 15px rgba(37, 117, 252, 0.4);";
                        textColor = "color: #ffffff; font-weight: 700; text-shadow: 0px 0px 5px rgba(0,0,0,0.2);";
                    }
                    // Si hay cambio en Estatus Taller, solo cambiar color en gestiones anteriores (no en la actual)
                    // La gestión actual ya es amarilla por defecto
                    // Solo aplicar color naranja cuando el estatus es "En proceso de Reparación" o "Reparado", no "Recibido en Taller"
                    else {
                        const currentStatusLabForColor = cleanString(item.name_status_lab);
                        const isReparacionStatus = currentStatusLabForColor && 
                            (currentStatusLabForColor.toLowerCase().includes('en proceso de reparación') || 
                             currentStatusLabForColor.toLowerCase().includes('reparado'));
                        const isRecibidoEnTaller = currentStatusLabForColor && 
                            currentStatusLabForColor.toLowerCase().includes('recibido en taller');
                        
                        if (statusLabChanged && !isLatest && isReparacionStatus && !isRecibidoEnTaller) {
                            headerStyle = "background-color: #fd7e14;"; // Naranja para cambios de Taller en gestiones anteriores
                            textColor = "color: #ffffff;";
                        }
                        // Si hay cambio en Estatus Domiciliación, usar verde (solo en gestiones anteriores)
                        else if (statusDomChanged && !isLatest) {
                            headerStyle = "background-color: #28a745;"; // Verde para destacar cambios de domiciliación
                            textColor = "color: #ffffff;";
                        }
                    }

                    let statusHeaderText = cleanString(item.name_status_ticket) || "Desconocido";
                    if (cleanString(item.name_accion_ticket) === "Enviado a taller" || cleanString(item.name_accion_ticket) === "En Taller") {
                        statusHeaderText = cleanString(item.name_status_lab) || "Desconocido";
                    }

                    // Se define el texto del botón aquí con la condición ternaria
                    let buttonText = isCreation
                        ? `${cleanString(item.name_accion_ticket) || "N/A"} (${statusHeaderText})`
                        : `${item.fecha_de_cambio || "N/A"} - ${cleanString(item.name_accion_ticket) || "N/A"} (${statusHeaderText})`;

                    if (isAdminRequest) {
                        buttonText = `<i class="fas fa-file-invoice-dollar mr-2"></i> ${item.fecha_de_cambio || "N/A"} - <span style="text-transform: uppercase;">SOLICITUD ADM.:</span> ${cleanString(item.name_accion_ticket) || "N/A"} (${statusHeaderText})`;
                    }

                    // Calcular el padding derecho para evitar que el badge trunque el texto
                    const hasTimeBadge = timeBadge && timeBadge.trim() !== '';
                    const hasCreationBadge = creationBadge && creationBadge.trim() !== '';
                    const buttonPaddingRight = (hasTimeBadge || hasCreationBadge) ? '120px' : '15px';

                    historyHtml += `
                        <div class="card mb-3 custom-history-card position-relative">
                            <div class="card-header p-0" id="${headingId}" style="${headerStyle}">
                                ${creationBadge}
                                ${timeBadge}
                                <h2 class="mb-0">
                                    <button class="btn btn-link w-100 text-left py-2 px-3" type="button"
                                        data-toggle="collapse" data-target="#${collapseId}"
                                        aria-expanded="false" aria-controls="${collapseId}"
                                        style="${textColor}; padding-right: ${buttonPaddingRight} !important;">
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
                                                ${!isAdminRequest ? `
                                                    <tr>
                                                        <th class="text-start">Operador Ticket:</th>
                                                        <td>${cleanString(item.operador_ticket) || "N/A"}</td>
                                                    </tr>
                                                ` : ''}
                                                <tr>
                                                    <th class="text-start">Usuario Gestión:</th>
                                                    <td class="${usuarioGestionChanged ? "highlighted-change" : ""}">${cleanString(item.usuario_gestion) || "N/A"}</td>
                                                </tr>
                                                ${!isAdminRequest ? `
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
                                                ` : ''}
                                                <tr>
                                                    <th class="text-start">Estatus ${isAdminRequest ? 'Solicitud' : 'Ticket'}:</th>
                                                    <td class="${estatusTicketChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_ticket) || "N/A"}</td>
                                                </tr>
                                                ${!isAdminRequest ? `
                                                    <tr>
                                                        <th class="text-start">Estatus Taller:</th>
                                                        <td class="${statusLabChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_lab) || "N/A"}</td>
                                                    </tr>
                                                    ${isEnElRosalForLab && statusLabChanged && cleanString(item.name_status_lab) ? `
                                                        ${durationLabFromPreviousText ? `
                                                            <tr>
                                                                <th class="text-start">Tiempo Duración Gestión Anterior:</th>
                                                                <td class="highlighted-change">${durationLabFromPreviousText}</td>
                                                            </tr>
                                                        ` : ''}
                                                        ${durationLabFromTallerText ? `
                                                            <tr>
                                                                <th class="text-start">Tiempo Duración en Taller:</th>
                                                                <td class="highlighted-change">${durationLabFromTallerText}</td>
                                                            </tr>
                                                        ` : ''}
                                                    ` : ''}
                                                    <tr>
                                                        <th class="text-start">Estatus Domiciliación:</th>
                                                        <td class="${statusDomChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_domiciliacion) || "N/A"}</td>
                                                    </tr>
                                                    ${statusDomChanged && cleanString(item.name_status_domiciliacion) ? `
                                                        ${durationFromCreationText ? `
                                                            <tr>
                                                                <th class="text-start">Tiempo Duración Revisión Domiciliación:</th>
                                                                <td class="highlighted-change"><strong>${durationFromCreationText}</strong></td>
                                                            </tr>
                                                        ` : ''}
                                                    ` : ''}
                                                    <tr>
                                                        <th class="text-start">Estatus Pago:</th>
                                                        <td class="${statusPaymentChanged ? "highlighted-change" : ""}">${cleanString(item.name_status_payment) || "N/A"}</td>
                                                    </tr>
                                                ` : ''}
                                                ${isAdminRequest ? `
                                                    <tr>
                                                        <th class="text-start">Nro de Solicitud:</th>
                                                        <td><span class="badge" style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: #ffffff; padding: 5px 10px; border-radius: 6px;">${item.nro_solicitud || "N/A"}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <th class="text-start">Observación Adm.:</th>
                                                        <td>${item.observacion || "Sin observación"}</td>
                                                    </tr>
                                                ` : ''}
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
                                                    ${(cleanString(item.name_motivo_rechazo) && cleanString(item.name_motivo_rechazo) !== 'N/A') ? `
                                                        <tr>
                                                            <th class="text-start">Motivo Rechazo Documento:</th>
                                                            <td class="${motivoRechazoChanged ? "highlighted-change" : ""}"><strong>${cleanString(item.name_motivo_rechazo)}</strong></td>
                                                        </tr>
                                                    ` : ''}
                                                    ${cleanString(item.nro_payment_reference) ? `
                                                        <tr>
                                                            <th class="text-start">Nro de Pago:</th>
                                                            <td class="highlighted-change"><strong>${cleanString(item.nro_payment_reference)}</strong></td>
                                                        </tr>
                                                    ` : ''}
                                                    ${cleanString(item.record_number) ? `
                                                        <tr>
                                                            <th class="text-start">Nro de Registro:</th>
                                                            <td class="highlighted-change"><strong>${cleanString(item.record_number)}</strong></td>
                                                        </tr>
                                                    ` : ''}
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
            text = `${diffDays}D ${diffHours % 24}H ${diffMinutes % 60}Min`;
        } else if (diffHours > 0) {
            text = `${diffHours}H ${diffMinutes % 60}Min`;
        } else if (diffMinutes > 0) {
            // Mostrar minutos cuando es al menos 1 minuto
            text = `${diffMinutes}Min`;
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

    const getChange = (itemVal, prevVal) => {
        const cleanItem = cleanString(itemVal);
        const cleanPrev = cleanString(prevVal);
        return cleanItem !== cleanPrev;
    };

    let itemsHtml = '';
    history.forEach((item, index) => {
        const previous = history[index + 1] || null;
        const elapsed = previous ? calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio) : null;
        const elapsedText = elapsed ? elapsed.text : 'N/A';
        
        // Calcular duración del estatus de Taller
        // Calcular duración del estatus de Taller
        // Solo mostrar duración cuando la acción es "En el Rosal" (terminó la estadía en el taller)
        // Calcular desde "Recibido en Taller" hasta el estatus actual
        let statusLabDuration = '';
        const currentAccion = cleanString(item.name_accion_ticket);
        const currentStatusLab = cleanString(item.name_status_lab);
        
        // Solo calcular y mostrar duración cuando la acción es exactamente "En el Rosal" (no "En espera de confirmar recibido en el Rosal")
        if (currentAccion && currentAccion.toLowerCase().includes('en el rosal') && 
            !currentAccion.toLowerCase().includes('en espera de confirmar recibido')) {
            // Buscar la fecha cuando entró al taller (primer "Recibido en Taller")
            let fechaEntradaTaller = null;
            
            // El historial está ordenado de más reciente a más antiguo (índice 0 = más reciente)
            // Buscar desde el índice actual hacia adelante (más antiguo) para encontrar cuando entró al taller
            for (let i = index + 1; i < history.length; i++) {
                const histItem = history[i];
                if (histItem && histItem.fecha_de_cambio) {
                    const statusLab = cleanString(histItem.name_status_lab);
                    // Buscar el primer "Recibido en Taller" (cuando entró al taller)
                    if (statusLab && statusLab.toLowerCase().includes('recibido en taller') && !fechaEntradaTaller) {
                        fechaEntradaTaller = histItem.fecha_de_cambio;
                    }
                }
            }
            
            // Si no encontramos "Recibido en Taller", buscar desde el final del historial
            if (!fechaEntradaTaller) {
                for (let i = history.length - 1; i > index; i--) {
                    const histItem = history[i];
                    if (histItem && histItem.fecha_de_cambio) {
                        const statusLab = cleanString(histItem.name_status_lab);
                        if (statusLab && statusLab.toLowerCase().includes('recibido en taller')) {
                            fechaEntradaTaller = histItem.fecha_de_cambio;
                            break;
                        }
                    }
                }
            }
            
            // Buscar el último estatus de taller antes de "En el Rosal"
            let fechaSalidaTaller = null;
            // Buscar desde el índice actual hacia atrás (más reciente) para encontrar el último estatus de taller
            for (let i = index - 1; i >= 0; i--) {
                const histItem = history[i];
                if (histItem && histItem.fecha_de_cambio) {
                    const statusLab = cleanString(histItem.name_status_lab);
                    const accion = cleanString(histItem.name_accion_ticket);
                    // Si encontramos un estatus de taller y no es "En el Rosal", usar esa fecha
                    if (statusLab && statusLab !== '' && statusLab !== 'N/A' && 
                        !accion.toLowerCase().includes('en el rosal')) {
                        fechaSalidaTaller = histItem.fecha_de_cambio;
                        break;
                    }
                }
            }
            
            // Si no encontramos fecha de salida, usar la fecha del item actual
            if (!fechaSalidaTaller) {
                fechaSalidaTaller = item.fecha_de_cambio;
            }
            
            // Calcular la duración desde "Recibido en Taller" hasta el estatus actual
            if (fechaEntradaTaller && fechaSalidaTaller) {
                const duration = calculateTimeElapsed(fechaEntradaTaller, fechaSalidaTaller);
                if (duration) {
                    statusLabDuration = ` <span style="color: #6c757d; font-size: 0.75em;">(<strong>Tiempo en este cambio:</strong> ${duration.text})</span>`;
                }
            }
        }
        
        // Calcular duración del estatus de Domiciliación (solo cuando hay cambio)
        // Mostrar dos tiempos en columnas separadas: 1) tiempo desde la gestión anterior, 2) tiempo total desde la creación del ticket
        let durationFromPreviousText = '';
        let durationFromCreationText = '';
        if (previous) {
            const statusDomChanged = getChange(item.name_status_domiciliacion, previous.name_status_domiciliacion);
            if (statusDomChanged && cleanString(item.name_status_domiciliacion)) {
                // Tiempo 1: Desde la gestión anterior (ya calculado como elapsed)
                if (previous && previous.fecha_de_cambio) {
                    const elapsedFromPrevious = calculateTimeElapsed(previous.fecha_de_cambio, item.fecha_de_cambio);
                    if (elapsedFromPrevious) {
                        durationFromPreviousText = elapsedFromPrevious.text;
                    }
                }
                
                // Tiempo 2: Desde la creación del ticket
                let ticketCreationDate = null;
                const lastHistoryItem = history[history.length - 1];
                if (lastHistoryItem && lastHistoryItem.fecha_de_cambio) {
                    ticketCreationDate = lastHistoryItem.fecha_de_cambio;
                } else {
                    // Buscar el elemento con "Ticket Creado"
                    for (let i = history.length - 1; i >= 0; i--) {
                        const histItem = history[i];
                        if (histItem && cleanString(histItem.name_accion_ticket) === 'Ticket Creado' && histItem.fecha_de_cambio) {
                            ticketCreationDate = histItem.fecha_de_cambio;
                            break;
                        }
                    }
                }
                
                if (ticketCreationDate) {
                    // Calcular duración desde la creación del ticket hasta el cambio actual
                    const duration = calculateTimeElapsed(ticketCreationDate, item.fecha_de_cambio);
                    if (duration) {
                        durationFromCreationText = duration.text;
                    }
                }
            }
        }

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
                        ${(() => {
                            const currentAccion = cleanString(item.name_accion_ticket);
                            const isEnElRosal = currentAccion && currentAccion.toLowerCase().includes('en el rosal') && !currentAccion.toLowerCase().includes('en espera de confirmar recibido');
                            return isEnElRosal && durationLabFromTallerText ? `
                                <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Tiempo Total Duración en Taller</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${durationLabFromTallerText}</td></tr>
                            ` : '';
                        })()}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Domiciliación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_domiciliacion) || 'N/A'}</td></tr>
                        ${previous && getChange(item.name_status_domiciliacion, previous.name_status_domiciliacion) && cleanString(item.name_status_domiciliacion) ? `
                            ${durationFromCreationText ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Tiempo Duración Revisión Domiciliación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;"><strong>${durationFromCreationText}</strong></td></tr>` : ''}
                        ` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Estatus Pago</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.name_status_payment) || 'N/A'}</td></tr>
                        ${cleanString(item.components_list) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Periféricos</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.components_list)}</td></tr>` : ''}
                        ${cleanString(item.components_changes) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Cambios en Periféricos</strong></td><td style="padding:4px; border-bottom:1px solid #eee; color: #dc3545;">${cleanString(item.components_changes)}</td></tr>` : ''}
                        ${cleanString(item.name_motivo_rechazo) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Motivo Rechazo Documento:</strong></td><td style="padding:4px; border-bottom:1px solid #eee;"><strong>${cleanString(item.name_motivo_rechazo)}</strong></td></tr>` : ''}
                        ${cleanString(item.nro_payment_reference) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Nro de Pago:</strong></td><td style="padding:4px; border-bottom:1px solid #eee;"><strong>${cleanString(item.nro_payment_reference)}</strong></td></tr>` : ''}
                        ${cleanString(item.record_number) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Nro de Registro:</strong></td><td style="padding:4px; border-bottom:1px solid #eee;"><strong>${cleanString(item.record_number)}</strong></td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Pago</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.pago) || 'No'}</td></tr>
                        ${cleanString(item.pago_fecha) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Pago Fecha</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.pago_fecha)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Exoneración</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.exoneracion) || 'No'}</td></tr>
                        ${cleanString(item.exoneracion_fecha) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Exoneración Fecha</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.exoneracion_fecha)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Envío</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.envio) || 'No'}</td></tr>
                        ${cleanString(item.envio_fecha) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Envío Fecha</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.envio_fecha)}</td></tr>` : ''}
                        <tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Envío a Destino</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.envio_destino) || 'No'}</td></tr>
                        ${cleanString(item.envio_destino_fecha) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Envío Destino Fecha</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.envio_destino_fecha)}</td></tr>` : ''}
                        ${cleanString(item.comment_devolution) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Comentario Devolución</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.comment_devolution)}</td></tr>` : ''}
                        ${cleanString(item.comment_reasignation) ? `<tr><td style="padding:4px; border-bottom:1px solid #eee;"><strong>Comentario Reasignación</strong></td><td style="padding:4px; border-bottom:1px solid #eee;">${cleanString(item.comment_reasignation)}</td></tr>` : ''}
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
            <div style="display: flex; justify-content: center; gap: 15px; font-size: 11px; font-weight: 500; flex-wrap: wrap;">
                <span style="color: #7c3aed;">
                    <strong style="background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">M</strong> Mes(es)
                </span>
                <span style="color: #059669;">
                    <strong style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">S</strong> Semana(s)
                </span>
                <span style="color: #059669;">
                    <strong style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">D</strong> Día(s)
                </span>
                <span style="color: #1e40af;">
                    <strong style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">H</strong> Hora(s)
                </span>
                <span style="color: #9a3412;">
                    <strong style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">Min</strong> Minuto(s)
                </span>
            </div>
            <p style="font-size: 10px; color: #6b7280; margin-top: 8px;">
                *Ejemplo: **1M 2S 3D 6H 11Min** significa 1 mes, 2 semanas, 3 días, 6 horas y 11 minutos.
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

function getTicketStatusVisual(statusTicket, accionTicket) {
  let statusClass = '';
  let statusText = '';
  let statusIcon = '';
  
  if (statusTicket === 'Abierto' || 
      accionTicket === 'Asignado a la Coordinación' ||
      accionTicket === 'Pendiente por revisar domiciliacion') {
    statusClass = 'status-open';
    statusText = 'ABIERTO';
    statusIcon = '🟢';
  } else if (statusTicket === 'En proceso' || 
             accionTicket === 'Asignado al Técnico' || 
             accionTicket === 'Recibido por el Técnico' ||
             accionTicket === 'Enviado a taller' ||
             accionTicket === 'En Taller' ||
             accionTicket === 'En espera de Confirmar Devolución' ||
             accionTicket === 'Pago Anticipo Pendiente por Revision' ||
             accionTicket === 'Rechazado') {
    statusClass = 'status-process';
    statusText = 'EN PROCESO';
    statusIcon = '🟡';
  } else if (statusTicket === 'Cerrado' || 
             accionTicket === 'Entregado a Cliente') {
    statusClass = 'status-closed';
    statusText = 'CERRADO';
    statusIcon = '🔴';
  }
  
  return { statusClass, statusText, statusIcon };
}

// Función para mostrar el indicador de estado
function showTicketStatusIndicator(statusTicket, accionTicket) {
  const container = document.getElementById('ticket-status-indicator-container');
  if (!container) return;
  
  // Si accionTicket es un array, usar el primer elemento
  const actionToUse = Array.isArray(accionTicket) ? accionTicket[0] : accionTicket;
  
  const { statusClass, statusText, statusIcon } = getTicketStatusVisual(statusTicket, actionToUse);
  
  container.innerHTML = `
    <div class="ticket-status-indicator ${statusClass}">
      <div class="status-content">
        <span class="status-icon">${statusIcon}</span>
        <span class="status-text">${statusText}</span>
      </div>
    </div>
  `;
}
// Función para ocultar el indicador
function hideTicketStatusIndicator() {
  const container = document.getElementById('ticket-status-indicator-container');
  if (container) {
    container.innerHTML = '';
  }
}

// Cuando se selecciona un ticket específico
function onTicketSelect(ticketData) {
  showTicketStatusIndicator(ticketData.name_status_ticket, ticketData.name_accion_ticket);
  // ... resto de tu código para mostrar detalles del ticket ...
}

function showElapsedLegend(e) {
    try { if (e && e.stopPropagation) e.stopPropagation(); } catch (_) {}
    const legendHtml = `
        <div style="font-size: 0.95rem; text-align: left;">
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#28a745; color:#fff; min-width:64px;">Verde</span><span class="ml-2">Menos de 1 hora</span></div>
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#6f42c1; color:#fff; min-width:64px;">Morado</span><span class="ml-2">Entre 1 y 8 horas</span></div>
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#fd7e14; color:#fff; min-width:64px;">Naranja</span><span class="ml-2">Más de 8 horas o al menos 1 día</span></div>
            <div class="d-flex align-items-center mb-2"><span class="badge" style="background-color:#ffc107; color:#212529; min-width:64px;">Amarillo</span><span class="ml-2">1 semana o más (1S+), o más de 2 días hábiles</span></div>
            <div class="d-flex align-items-center"><span class="badge" style="background-color:#dc3545; color:#fff; min-width:64px;">Rojo</span><span class="ml-2">1 mes o más (1M+), o más de 5 días hábiles</span></div>
        </div>`;

    Swal.fire({
        title: 'Leyenda',
        html: legendHtml,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#003594',
        color: 'black',
        width: 520,
    });
}

// ===================================================================
// FUNCIÓN GENÉRICA: Cerrar Ticket con Comentario
// Disponible en TODOS los módulos a través de ticket-utils.js
// ===================================================================

/**
 * Muestra un diálogo SweetAlert2 pidiendo un comentario y luego cierra el ticket.
 * @param {string|number} ticketId  - id_ticket (PK)
 * @param {string}        nroTicket - número visible del ticket
 * @param {string}        serialPos - serial del POS (para el mensaje)
 */
function closeTicketWithComment(ticketId, nroTicket, serialPos) {
    // Validación básica
    if (!ticketId) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin ticket seleccionado',
            text: 'Por favor selecciona un ticket antes de cerrarlo.',
            confirmButtonColor: '#003594',
            color: 'black'
        });
        return;
    }

    const id_user = (
        document.getElementById('userId') ||
        document.getElementById('id_user') ||
        document.getElementById('iduser') ||
        document.getElementById('id_user_pago')
    )?.value || '';

    // --- Paso 1: Confirmación ---
    Swal.fire({
        icon: 'warning',
        iconColor: '#f43f5e',
        title: '<span style="font-family: \'Outfit\', \'Inter\', sans-serif; font-weight: 700; color: #1f2937; font-size: 1.45rem;">¿Cerrar Ticket?</span>',
        html: `
            <div style="font-family: 'Inter', sans-serif; text-align: center; color: #4b5563; font-size: 0.95rem; line-height: 1.6; padding: 0 5px;">
                <p style="margin-bottom: 20px;">
                    ¿Estás seguro de que deseas cerrar el ticket 
                    <span class="swal-badge swal-badge-ticket">#${nroTicket || ticketId}</span>
                    ${serialPos ? `con serial <span class="swal-badge swal-badge-ticket">${serialPos}</span>` : ''}?
                </p>
                <div class="swal-warning-box">
                    <span class="swal-warning-icon">⚠️</span>
                    <span class="swal-warning-text">
                        Esta acción <strong>no se puede deshacer</strong> y registrará de forma permanente el estado final del ticket en la bitácora del sistema.
                    </span>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e11d48',
        cancelButtonColor: '#6b7280',
        color: '#1f2937',
        background: '#ffffff',
        focusConfirm: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        keydownListenerCapture: true,
        customClass: {
            popup: 'premium-swal-popup premium-swal-danger-theme',
            confirmButton: 'premium-swal-confirm-btn-danger',
            cancelButton: 'premium-swal-cancel-btn'
        },
        didOpen: () => {
            if (!document.getElementById('premium-swal-styles')) {
                const style = document.createElement('style');
                style.id = 'premium-swal-styles';
                style.innerHTML = `
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800&display=swap');
                    
                    .premium-swal-popup {
                        border-radius: 16px !important;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                        padding: 32px 24px 24px 24px !important;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    /* Accent top border */
                    .premium-swal-popup::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 6px;
                        border-top-left-radius: 16px;
                        border-top-right-radius: 16px;
                    }
                    
                    .premium-swal-danger-theme::before {
                        background: linear-gradient(90deg, #f43f5e, #e11d48) !important;
                    }
                    
                    .premium-swal-primary-theme::before {
                        background: linear-gradient(90deg, #3b82f6, #2563eb) !important;
                    }
                    
                    /* Badges */
                    .swal-badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 3px 10px;
                        border-radius: 20px;
                        font-weight: 600;
                        font-size: 0.88rem;
                        font-family: 'Inter', sans-serif;
                        margin: 0 2px;
                        vertical-align: middle;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.02);
                    }
                    .swal-badge-ticket {
                        background: #eff6ff;
                        color: #2563eb;
                        border: 1px solid #dbeafe;
                    }
                    
                    /* Warning box */
                    .swal-warning-box {
                        background: #fef2f2;
                        border: 1px solid #fee2e2;
                        padding: 14px 16px;
                        border-radius: 12px;
                        display: flex;
                        align-items: start;
                        gap: 12px;
                        text-align: left;
                        margin-top: 20px;
                    }
                    .swal-warning-icon {
                        font-size: 1.25rem;
                        line-height: 1;
                        margin-top: 1px;
                    }
                    .swal-warning-text {
                        font-size: 0.88rem;
                        color: #991b1b;
                        line-height: 1.5;
                        font-weight: 500;
                    }
                    
                    /* Textarea style */
                    .swal-textarea-container {
                        position: relative;
                        margin-top: 15px;
                    }
                    .swal-textarea {
                        width: 100% !important;
                        border-radius: 10px !important;
                        border: 1.5px solid #e5e7eb !important;
                        padding: 14px !important;
                        font-size: 0.95rem !important;
                        line-height: 1.5 !important;
                        resize: none !important;
                        box-sizing: border-box !important;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        font-family: 'Inter', sans-serif !important;
                        background-color: #f9fafb !important;
                        color: #1f2937 !important;
                    }
                    .swal-textarea:focus {
                        background-color: #ffffff !important;
                        border-color: #2563eb !important;
                        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) !important;
                        outline: none !important;
                    }
                    
                    /* Buttons styling */
                    .premium-swal-confirm-btn-danger, .premium-swal-confirm-btn-primary, .premium-swal-cancel-btn {
                        padding: 11px 24px !important;
                        font-family: 'Inter', sans-serif !important;
                        font-size: 0.95rem !important;
                        font-weight: 600 !important;
                        border-radius: 8px !important;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        letter-spacing: 0.01em !important;
                        border: none !important;
                        outline: none !important;
                    }
                    
                    .premium-swal-confirm-btn-danger {
                        background: linear-gradient(135deg, #f43f5e, #e11d48) !important;
                        color: #ffffff !important;
                        box-shadow: 0 4px 6px -1px rgba(225, 29, 72, 0.2) !important;
                    }
                    .premium-swal-confirm-btn-danger:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 16px -2px rgba(225, 29, 72, 0.35) !important;
                        background: linear-gradient(135deg, #e11d48, #be123c) !important;
                    }
                    .premium-swal-confirm-btn-danger:active {
                        transform: translateY(0);
                    }
                    
                    .premium-swal-confirm-btn-primary {
                        background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
                        color: #ffffff !important;
                        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2) !important;
                    }
                    .premium-swal-confirm-btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 16px -2px rgba(37, 99, 235, 0.35) !important;
                        background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
                    }
                    .premium-swal-confirm-btn-primary:active {
                        transform: translateY(0);
                    }
                    
                    .premium-swal-cancel-btn {
                        background: #f3f4f6 !important;
                        color: #4b5563 !important;
                        border: 1px solid #e5e7eb !important;
                    }
                    .premium-swal-cancel-btn:hover {
                        background: #e5e7eb !important;
                        color: #1f2937 !important;
                        transform: translateY(-2px);
                    }
                    .premium-swal-cancel-btn:active {
                        transform: translateY(0);
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }).then((result) => {
        if (!result.isConfirmed) return;

        // --- Paso 2: Solicitar comentario ---
        Swal.fire({
            icon: 'question',
            iconColor: '#2563eb',
            title: '<span style="font-family: \'Outfit\', \'Inter\', sans-serif; font-weight: 700; color: #1f2937; font-size: 1.45rem;">Motivo de Cierre</span>',
            html: `
                <div style="font-family: 'Inter', sans-serif; text-align: left; color: #4b5563; font-size: 0.95rem; line-height: 1.6; padding: 0 5px;">
                    <p style="margin-bottom: 16px; text-align: center;">
                        Por favor ingresa el motivo o comentario del cierre para el ticket 
                        <span class="swal-badge swal-badge-ticket">#${nroTicket || ticketId}</span>:
                    </p>
                    <div class="swal-textarea-container">
                        <textarea id="comentarioCierreTicket" class="swal-textarea" rows="4" 
                            placeholder="Ej: Equipo no reparable, cliente solicitó cierre, falla en camino..."></textarea>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Confirmar Cierre',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            color: '#1f2937',
            background: '#ffffff',
            focusConfirm: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            keydownListenerCapture: true,
            width: '520px',
            customClass: {
                popup: 'premium-swal-popup premium-swal-primary-theme',
                confirmButton: 'premium-swal-confirm-btn-primary',
                cancelButton: 'premium-swal-cancel-btn'
            },
            preConfirm: () => {
                const comentario = Swal.getPopup().querySelector('#comentarioCierreTicket').value.trim();
                if (!comentario) {
                    Swal.showValidationMessage('El comentario de cierre no puede estar vacío.');
                    return false;
                }
                return { comentario };
            }
        }).then((res) => {
            if (!res.isConfirmed) return;

            const comentario = res.value.comentario;

            // --- Paso 3: Llamar al API ---
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/consulta/EntregarTicketGenerico`);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            // Mostrar loader
            Swal.fire({
                title: 'Procesando...',
                text: 'Cerrando el ticket, por favor espere.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading()
            });

            xhr.onload = function () {
                Swal.close();
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            const ticketData = (response.ticket_data || [])[0] || null;

                            const detallesHtml = ticketData ? `
                                <div style="text-align:left;padding:10px;">
                                    <h3 style="color:#c0392b;text-align:center;margin-bottom:15px;">❌ Ticket Cerrado ❌</h3>
                                    <p><strong>🎫 Nro. Ticket:</strong> <span style="color:#c0392b;font-weight:bold;">${ticketData.nro_ticket || nroTicket}</span></p>
                                    <p><strong>⚙️ Serial:</strong> <span style="padding:2px 8px;border-radius:6px;background:#e0f7fa;color:#007bff;">${ticketData.serial_pos || serialPos || 'N/A'}</span></p>
                                    <p><strong>📋 Acción:</strong> <span style="color:#007bff;font-weight:bold;">${ticketData.name_accion_ticket || 'Cerrado'}</span></p>
                                    <p><strong>🔄 Estatus:</strong> <span style="color:#c0392b;font-weight:bold;">${ticketData.name_status_ticket || 'Cerrado'}</span></p>
                                    <p><strong>📝 Motivo:</strong> ${comentario}</p>
                                    <p style="font-size:.88rem;color:green;text-align:center;margin-top:15px;">
                                        El ticket ha sido cerrado y registrado en el historial del sistema.
                                    </p>
                                </div>` : `<p style="color:green;">El ticket #${nroTicket || ticketId} ha sido cerrado exitosamente.</p>`;

                            Swal.fire({
                                icon: 'success',
                                title: 'Ticket Cerrado',
                                html: detallesHtml,
                                color: 'black',
                                confirmButtonText: 'Cerrar',
                                confirmButtonColor: '#003594',
                                showClass: { popup: 'animate__animated animate__fadeInDown' },
                                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                width: '620px'
                            }).then(() => {
                                window.location.reload();
                            });
                        } else {
                            Swal.fire('Error', response.message || 'No se pudo cerrar el ticket.', 'error');
                        }
                    } catch (e) {
                        Swal.fire('Error', 'Error al procesar la respuesta del servidor.', 'error');
                    }
                } else {
                    Swal.fire('Error', `Error de servidor: ${xhr.status} ${xhr.statusText}`, 'error');
                }
            };

            xhr.onerror = function () {
                Swal.fire('Error de red', 'No se pudo conectar con el servidor.', 'error');
            };

            const params = `action=EntregarTicketGenerico&id_ticket=${encodeURIComponent(ticketId)}&id_user=${encodeURIComponent(id_user)}&comentario=${encodeURIComponent(comentario)}`;
            xhr.send(params);
        });
    });
}

// ===================================================================
// EVENT DELEGATION GLOBAL para #btnCerrarTicketGlobal
// Se inicializa una sola vez en DOMContentLoaded.
// ===================================================================
document.addEventListener('click', function (e) {
    const btn = e.target.closest('#btnCerrarTicketGlobal');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const idTicket  = btn.dataset.idTicket  || btn.getAttribute('data-id-ticket')  || '';
    const nroTicket = btn.dataset.nroTicket  || btn.getAttribute('data-nro-ticket') || idTicket;
    const serialPos = btn.dataset.serialPos  || btn.getAttribute('data-serial-pos') || '';

    closeTicketWithComment(idTicket, nroTicket, serialPos);
});

// Exponer al scope global por si algún módulo la llama directamente
window.closeTicketWithComment = closeTicketWithComment;
