class Attachment {
  final int? id;
  final String? ticketId;
  final String? nroTicket;
  final String? originalFilename;
  final String? storedFilename;
  final String? filePath;
  final String? mimeType;
  final int? fileSize;
  final String? documentType;
  final String? createdAt;

  Attachment({
    this.id,
    this.ticketId,
    this.nroTicket,
    this.originalFilename,
    this.storedFilename,
    this.filePath,
    this.mimeType,
    this.fileSize,
    this.documentType,
    this.createdAt,
  });

  factory Attachment.fromJson(Map<String, dynamic> json) {
    return Attachment(
      id: json['id'] != null ? int.tryParse(json['id'].toString()) : null,
      ticketId: json['ticket_id']?.toString(),
      nroTicket: json['nro_ticket']?.toString(),
      originalFilename: json['original_filename']?.toString(),
      storedFilename: json['stored_filename']?.toString(),
      filePath: json['file_path']?.toString(),
      mimeType: json['mime_type']?.toString(),
      fileSize: json['file_size'] != null ? int.tryParse(json['file_size'].toString()) : null,
      documentType: json['document_type']?.toString(),
      createdAt: json['created_at']?.toString(),
    );
  }
}
