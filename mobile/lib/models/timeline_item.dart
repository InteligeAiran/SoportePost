class TimelineItem {
  final String status;
  final String? date;
  final String? user;
  final String? comment;

  TimelineItem({
    required this.status,
    this.date,
    this.user,
    this.comment,
  });

  factory TimelineItem.fromJson(Map<String, dynamic> json) {
    return TimelineItem(
      status: json['name_status_ticket']?.toString() ?? json['status']?.toString() ?? 'N/A',
      date: json['date_create_history']?.toString() ?? json['fecha']?.toString(),
      user: json['full_name_user']?.toString() ?? json['usuario']?.toString(),
      comment: json['comment_history']?.toString() ?? json['comentario']?.toString(),
    );
  }
}
