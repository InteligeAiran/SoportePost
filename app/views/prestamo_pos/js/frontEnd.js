/**
 * SoportePost - Sistema de Gestion de Tickets
 * Modulo: Prestamo de POS
 */

const PRESTAMO_API_BASE = `${ENDPOINT_BASE}${APP_PATH}api/prestamo_pos/`;

const NOMBRES_ESTATUS_POOL = { 0: 'Disponible', 1: 'Prestado', 2: 'Sustituido', 3: 'Intelipunto' };
const NOMBRES_ESTATUS_SOLICITUD = { 1: 'Pendiente por Aprobar', 2: 'Pendiente por Gestionar', 3: 'Aprobada', 4: 'Rechazado' };

// El navbar compartido carga 4 builds de Bootstrap distintos y en conflicto
// (ver frontEnd.js del modulo Tecnico para el mismo problema con las
// pestañas), por lo que bootstrap.Modal.getInstance() puede devolver null
// para un modal abierto con new bootstrap.Modal(...).show() momentos antes.
// Se maneja el show/hide de los modales a mano, sin depender del rastreo de
// instancias de Bootstrap.
function showModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('show');
    el.style.display = 'block';
    el.removeAttribute('aria-hidden');
    el.setAttribute('aria-modal', 'true');
    document.body.classList.add('modal-open');
    if (!document.getElementById(id + '-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.id = id + '-backdrop';
        backdrop.className = 'modal-backdrop fade show';
        backdrop.addEventListener('click', () => hideModal(id));
        document.body.appendChild(backdrop);
    }
}

function hideModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('show');
    el.style.display = 'none';
    el.setAttribute('aria-hidden', 'true');
    el.removeAttribute('aria-modal');
    document.body.classList.remove('modal-open');
    const backdrop = document.getElementById(id + '-backdrop');
    if (backdrop) backdrop.remove();
}

function prestamoApiPost(action, params) {
    return fetch(PRESTAMO_API_BASE + action, {
        method: 'POST',
        body: new URLSearchParams(params || {})
    }).then(async (resp) => {
        let data;
        try {
            data = await resp.json();
        } catch (e) {
            data = { success: false, message: 'Respuesta invalida del servidor.' };
        }
        return data;
    });
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function fmtFecha(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return fecha;
    return d.toLocaleDateString('es-VE') + ' ' + d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
}

// ==========================================================================
// Solicitar prestamo (tecnico)
// ==========================================================================

// El navbar compartido carga 4 builds de Bootstrap distintos y en conflicto
// (bootstrap.bundle.min.js, bootstrap.min.js, bootstrap.bundle.js,
// bootstrap.js), por lo que el manejo automatico de pestañas
// (data-bs-toggle="tab") no cambia de panel de forma confiable. Se maneja
// el cambio de pestaña a mano aqui, sin depender de bootstrap.Tab.
function inicializarTabsManual() {
    const botones = document.querySelectorAll('#prestamoTabs .nav-link[data-bs-target]');
    botones.forEach((btn) => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSelector = btn.getAttribute('data-bs-target');
            const targetPane = document.querySelector(targetSelector);
            if (!targetPane) return;

            botones.forEach((b) => b.classList.remove('active'));
            document.querySelectorAll('#prestamoTabsContent .tab-pane').forEach((p) => {
                p.classList.remove('show', 'active');
            });

            btn.classList.add('active');
            targetPane.classList.add('show', 'active');
            btn.dispatchEvent(new CustomEvent('shown.bs.tab'));
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    inicializarTabsManual();

    const btnBuscarPos = document.getElementById('btnBuscarPosIntelipunto');
    if (btnBuscarPos) {
        btnBuscarPos.addEventListener('click', buscarPosIntelipunto);
    }

    const btnConfirmarAprobar = document.getElementById('btnConfirmarAprobar');
    if (btnConfirmarAprobar) {
        btnConfirmarAprobar.addEventListener('click', confirmarAprobar);
    }

    const btnConfirmarRechazar = document.getElementById('btnConfirmarRechazar');
    if (btnConfirmarRechazar) {
        btnConfirmarRechazar.addEventListener('click', confirmarRechazar);
    }

    const btnConfirmarSustituido = document.getElementById('btnConfirmarSustituido');
    if (btnConfirmarSustituido) {
        btnConfirmarSustituido.addEventListener('click', confirmarSustituido);
    }

    document.getElementById('btnCancelarAprobar')?.addEventListener('click', () => hideModal('modalAprobar'));
    document.getElementById('btnCancelarRechazar')?.addEventListener('click', () => hideModal('modalRechazar'));
    document.getElementById('btnCancelarSustituido')?.addEventListener('click', () => hideModal('modalSustituido'));

    cargarMisSolicitudes();

    const tabAprobaciones = document.getElementById('tab-btn-aprobaciones');
    if (tabAprobaciones) {
        tabAprobaciones.addEventListener('shown.bs.tab', cargarAprobaciones);
        cargarAprobaciones();
    }

    const tabPool = document.getElementById('tab-btn-pool');
    if (tabPool) {
        tabPool.addEventListener('shown.bs.tab', cargarPool);
        cargarPool();
    }
});

function cargarMisSolicitudes() {
    prestamoApiPost('ListarSolicitudes', {}).then((data) => {
        const tbody = document.getElementById('tbody-mis-solicitudes');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!data.success || !data.data.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Sin solicitudes registradas.</td></tr>';
            return;
        }
        data.data.forEach((row) => {
            const badgeClass = 'badge-solicitud-' + row.id_status_solicitud;
            tbody.innerHTML += `<tr>
                <td>${escapeHtml(row.nro_solicitud)}</td>
                <td>${escapeHtml(row.nro_ticket)}</td>
                <td>${escapeHtml(row.razonsocial)}</td>
                <td><span class="badge ${badgeClass}">${escapeHtml(row.status_name)}</span></td>
                <td>${fmtFecha(row.fecha_creacion)}</td>
                <td>${escapeHtml(row.serial_asignado || '-')}</td>
            </tr>`;
        });
    });
}

// ==========================================================================
// Aprobaciones (Coordinador/Administrador/SuperAdmin)
// ==========================================================================

function cargarAprobaciones() {
    prestamoApiPost('ListarSolicitudes', { solo_pendientes: 1 }).then((data) => {
        const tbody = document.getElementById('tbody-aprobaciones');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!data.success || !data.data.length) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay solicitudes pendientes.</td></tr>';
            return;
        }
        data.data.forEach((row) => {
            tbody.innerHTML += `<tr>
                <td>${escapeHtml(row.nro_solicitud)}</td>
                <td>${escapeHtml(row.nro_ticket)}</td>
                <td>${escapeHtml(row.rif)}</td>
                <td>${escapeHtml(row.razonsocial)}</td>
                <td>${escapeHtml(row.nombre_solicitante)}</td>
                <td>${escapeHtml(row.observacion)}</td>
                <td>${fmtFecha(row.fecha_creacion)}</td>
                <td>
                    <button class="btn btn-sm btn-success btn-abrir-aprobar" data-id="${row.id_solicitud}">Aprobar</button>
                    <button class="btn btn-sm btn-danger btn-abrir-rechazar" data-id="${row.id_solicitud}">Rechazar</button>
                </td>
            </tr>`;
        });

        tbody.querySelectorAll('.btn-abrir-aprobar').forEach((btn) => {
            btn.addEventListener('click', () => abrirModalAprobar(btn.dataset.id));
        });
        tbody.querySelectorAll('.btn-abrir-rechazar').forEach((btn) => {
            btn.addEventListener('click', () => abrirModalRechazar(btn.dataset.id));
        });
    });
}

function abrirModalAprobar(idSolicitud) {
    document.getElementById('aprobarIdSolicitud').value = idSolicitud;
    const select = document.getElementById('aprobarSelectPos');
    select.innerHTML = '<option>Cargando...</option>';

    prestamoApiPost('ListarPoolDisponible', {}).then((data) => {
        select.innerHTML = '';
        if (!data.success || !data.data.length) {
            select.innerHTML = '<option value="">No hay unidades disponibles en el pool</option>';
        } else {
            data.data.forEach((u) => {
                const opt = document.createElement('option');
                opt.value = u.id_prestamo_pos;
                opt.textContent = `${u.serialpos} - ${u.marcapos || ''} ${u.tipopos || ''}`;
                select.appendChild(opt);
            });
        }
        showModal('modalAprobar');
    });
}

function confirmarAprobar() {
    const idSolicitud = document.getElementById('aprobarIdSolicitud').value;
    const idPrestamoPos = document.getElementById('aprobarSelectPos').value;

    if (!idPrestamoPos) {
        Swal.fire('Atencion', 'No hay una unidad seleccionada.', 'warning');
        return;
    }

    prestamoApiPost('AprobarSolicitud', { id_solicitud: idSolicitud, id_prestamo_pos: idPrestamoPos }).then((data) => {
        if (!data.success) {
            Swal.fire('Error', data.message || 'No se pudo aprobar la solicitud.', 'error');
            return;
        }
        hideModal('modalAprobar');
        Swal.fire('Listo', data.message || 'Solicitud aprobada.', 'success');
        cargarAprobaciones();
        cargarPool();
    });
}

function abrirModalRechazar(idSolicitud) {
    document.getElementById('rechazarIdSolicitud').value = idSolicitud;
    document.getElementById('inputMotivoRechazo').value = '';
    showModal('modalRechazar');
}

function confirmarRechazar() {
    const idSolicitud = document.getElementById('rechazarIdSolicitud').value;
    const motivo = document.getElementById('inputMotivoRechazo').value.trim();

    prestamoApiPost('RechazarSolicitud', { id_solicitud: idSolicitud, motivo: motivo }).then((data) => {
        if (!data.success) {
            Swal.fire('Error', data.message || 'No se pudo rechazar la solicitud.', 'error');
            return;
        }
        hideModal('modalRechazar');
        Swal.fire('Listo', data.message || 'Solicitud rechazada.', 'success');
        cargarAprobaciones();
    });
}

// ==========================================================================
// Pool de prestamo (Coordinador/Administrador/SuperAdmin)
// ==========================================================================

function buscarPosIntelipunto() {
    const serial = document.getElementById('inputSerialPool').value.trim();
    if (!serial) {
        Swal.fire('Atencion', 'Ingrese un serial.', 'warning');
        return;
    }

    prestamoApiPost('BuscarPosIntelipunto', { serial: serial }).then((data) => {
        if (!data.success) {
            mostrarModalPosNoDisponible(data.message || 'No se pudo encontrar el POS.');
            return;
        }
        mostrarModalPosEncontrado(data.data);
    });
}

function mostrarModalPosNoDisponible(mensaje) {
    const customErrorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="#f5365c" class="bi bi-x-octagon custom-icon-animation" viewBox="0 0 16 16"><path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zm.6.854L1 5.14v5.72l4.14 4.14h5.72l4.14-4.14V5.14L10.86 1z"/><path d="M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/></svg>`;

    Swal.fire({
        title: `<div class="custom-modal-header-title bg-gradient-danger text-white">
                  <div class="custom-modal-header-content">POS No Disponible</div>
                </div>`,
        html: `
            <div class="custom-modal-body-content">
                <div class="mb-3">${customErrorSvg}</div>
                <p class="h5 text-muted">${escapeHtml(mensaje)}</p>
            </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#003594',
        customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            actions: 'custom-swal-actions',
            confirmButton: 'btn btn-primary btn-lg custom-confirm-button',
        }
    });
}

function mostrarModalPosEncontrado(pos) {
    const customCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="#6f42c1" class="bi bi-credit-card custom-icon-animation" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/></svg>`;

    Swal.fire({
        title: `<div class="custom-modal-header-title bg-gradient-primary text-white">
                  <div class="custom-modal-header-content">POS Disponible en Intelipunto</div>
                </div>`,
        html: `
            <div class="custom-modal-body-content">
                <div class="mb-3">${customCardSvg}</div>
                <p class="h4 mb-1">${escapeHtml(pos.serial)}</p>
                <p class="h5 text-muted mb-3">${escapeHtml(pos.marcapos || '')} ${escapeHtml(pos.tipopos || '')}</p>
                <p class="h5 text-muted">Se transferira al pool de prestamo de SoportePost y su estatus en Intelipunto pasara a "Prestamo".</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Transferir al Pool',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#003594',
        showLoaderOnConfirm: true,
        customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            actions: 'custom-swal-actions',
            confirmButton: 'btn btn-primary btn-lg custom-confirm-button',
            cancelButton: 'btn btn-secondary btn-lg custom-cancel-button',
        },
        preConfirm: () => {
            return prestamoApiPost('TransferirPosAlPool', { serial: pos.serial }).then((data) => {
                if (!data.success) {
                    Swal.showValidationMessage(data.message || 'No se pudo transferir el POS.');
                    return false;
                }
                return data;
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            document.getElementById('inputSerialPool').value = '';
            Swal.fire('Listo', result.value.message || 'POS transferido.', 'success');
            cargarPool();
        }
    });
}

function cargarPool() {
    prestamoApiPost('ListarPool', {}).then((data) => {
        const tbody = document.getElementById('tbody-pool');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!data.success || !data.data.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">El pool de prestamo esta vacio.</td></tr>';
            return;
        }
        data.data.forEach((row) => {
            const badgeClass = 'badge-estatus-' + row.estatus;
            let acciones = '';
            if (row.estatus == 1) {
                acciones += `<button class="btn btn-sm btn-warning btn-sustituir" data-id="${row.id_prestamo_pos}">Sustituido</button> `;
            }
            if (row.estatus == 0 || row.estatus == 1 || row.estatus == 2) {
                acciones += `<button class="btn btn-sm btn-outline-success btn-retornar" data-id="${row.id_prestamo_pos}">Retornar a Intelipunto</button>`;
            }

            tbody.innerHTML += `<tr>
                <td>${escapeHtml(row.serialpos)}</td>
                <td>${escapeHtml(row.marcapos)}</td>
                <td>${escapeHtml(row.tipopos)}</td>
                <td><span class="badge ${badgeClass}">${escapeHtml(row.name_status_prestamo_pos)}</span></td>
                <td>${escapeHtml(row.nro_solicitud || '-')}</td>
                <td>${fmtFecha(row.fecha_ingreso)}</td>
                <td>${acciones}</td>
            </tr>`;
        });

        tbody.querySelectorAll('.btn-sustituir').forEach((btn) => {
            btn.addEventListener('click', () => abrirModalSustituido(btn.dataset.id));
        });
        tbody.querySelectorAll('.btn-retornar').forEach((btn) => {
            btn.addEventListener('click', () => retornarAIntelipunto(btn.dataset.id));
        });
    });
}

function abrirModalSustituido(idPrestamoPos) {
    document.getElementById('sustituidoIdPrestamoPos').value = idPrestamoPos;
    document.getElementById('inputObsSustituido').value = '';
    showModal('modalSustituido');
}

function confirmarSustituido() {
    const idPrestamoPos = document.getElementById('sustituidoIdPrestamoPos').value;
    const observacion = document.getElementById('inputObsSustituido').value.trim();

    prestamoApiPost('MarcarSustituido', { id_prestamo_pos: idPrestamoPos, observacion: observacion }).then((data) => {
        if (!data.success) {
            Swal.fire('Error', data.message || 'No se pudo marcar como sustituido.', 'error');
            return;
        }
        hideModal('modalSustituido');
        Swal.fire('Listo', data.message || 'Unidad marcada como Sustituida.', 'success');
        cargarPool();
    });
}

function retornarAIntelipunto(idPrestamoPos) {
    Swal.fire({
        title: 'Confirmar devolucion',
        text: 'Esta unidad volvera a estar Disponible en Intelipunto.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, devolver',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (!result.isConfirmed) return;

        prestamoApiPost('RetornarAIntelipunto', { id_prestamo_pos: idPrestamoPos }).then((data) => {
            if (!data.success) {
                Swal.fire('Error', data.message || 'No se pudo devolver la unidad.', 'error');
                return;
            }
            Swal.fire('Listo', data.message || 'Unidad devuelta a Intelipunto.', 'success');
            cargarPool();
        });
    });
}
