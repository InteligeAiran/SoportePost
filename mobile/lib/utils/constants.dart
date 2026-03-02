class AppConstants {
  static const String baseUrl = 'http://192.168.1.103/SoportePost'; // Change this to your server IP for testing on physical devices
  static const String apiBase = '$baseUrl/api';

  // Endpoints
  static const String login = '/users/access';
  static const String tickets = '/consulta/GetTicketData'; // Changed from /reportes/GetTicketDataFinal
  static const String ticketTimeline = '/reportes/GetTicketTimeline';
  static const String uploadPhoto = '/reportes/uploadDocumentTec';
  static const String entregarTicket = '/consulta/entregar_ticket';
  static const String validateRif = '/consulta/ValidateRif';
  static const String searchByRif = '/consulta/SearchRif';
  static const String searchBySerial = '/consulta/SearchSerialData';
  static const String searchByRazon = '/consulta/SearchRazonData';
  static const String searchSerialDetails = '/consulta/SearchSerial';
  static const String globalSearchTicket = '/consulta/globalSearchTicket';
  static const String getAttachments = '/consulta/GetAllTicketDocuments';
  static const String streamAttachment = '/consulta/StreamAttachment';
  static const String userPermissions = '/users/permissions';
  static const String logout = '/users/logout';

  // Storage Keys
  static const String tokenKey = 'session_id';
  static const String userIdKey = 'id_user';
  static const String userDataKey = 'user_data';
}
