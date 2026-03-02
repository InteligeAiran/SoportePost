class Ticket {
  final int id;
  final String nroTicket;
  final String serialPos;
  final String rif;
  final String razonSocial;
  final String failure;
  final String status;
  final String process;
  final String action;
  final String date;
  final String technician;
  final String? dateInstallation;
  final String? dateClosing;

  Ticket({
    required this.id,
    required this.nroTicket,
    required this.serialPos,
    required this.rif,
    required this.razonSocial,
    required this.failure,
    required this.status,
    required this.process,
    required this.action,
    required this.date,
    required this.technician,
    this.dateInstallation,
    this.dateClosing,
  });

  factory Ticket.fromJson(Map<String, dynamic> json) {
    return Ticket(
      id: json['id_ticket'] != null ? int.tryParse(json['id_ticket'].toString()) ?? 0 : 0,
      nroTicket: json['nro_ticket']?.toString() ?? '',
      serialPos: json['serial_pos']?.toString() ?? '',
      rif: json['rif']?.toString() ?? '',
      razonSocial: json['razonsocial_cliente']?.toString() ?? '',
      failure: json['name_failure']?.toString() ?? '',
      status: json['name_status_ticket']?.toString() ?? '',
      process: json['name_process_ticket']?.toString() ?? '',
      action: json['name_accion_ticket']?.toString() ?? '',
      date: json['fecha']?.toString() ?? '',
      technician: json['full_name_tecnico']?.toString() ?? '',
      dateInstallation: json['fecha_instalacion']?.toString(),
      dateClosing: json['fecha_cierre']?.toString(),
    );
  }
}
