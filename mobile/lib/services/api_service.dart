import 'dart:convert';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:crypto/crypto.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:soporte_post/utils/constants.dart';

class ApiService {
  late Dio _dio;
  late CookieJar _cookieJar;

  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.apiBase,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      validateStatus: (status) => status! < 500,
    ));
    _cookieJar = CookieJar();
    _dio.interceptors.add(CookieManager(_cookieJar));
  }

  /// Hashes the password using sha1(md5(password)) to match the PHP backend
  String hashPassword(String password) {
    var md5Hash = md5.convert(utf8.encode(password)).toString();
    var sha1Hash = sha1.convert(utf8.encode(md5Hash)).toString();
    return sha1Hash;
  }

  /// Generic POST request
  Future<Response> post(String endpoint, Map<String, dynamic> data) async {
    try {
      final response = await _dio.post(endpoint, data: FormData.fromMap(data));
      return response;
    } on DioException catch (e) {
      return Response(
        requestOptions: RequestOptions(path: endpoint),
        statusCode: 500,
        data: {'success': false, 'message': e.message},
      );
    }
  }

  /// Generic GET request
  Future<Response> get(String endpoint, {Map<String, dynamic>? queryParameters}) async {
    try {
      final response = await _dio.get(endpoint, queryParameters: queryParameters);
      return response;
    } on DioException catch (e) {
      return Response(
        requestOptions: RequestOptions(path: endpoint),
        statusCode: 500,
        data: {'success': false, 'message': e.message},
      );
    }
  }

  /// Specialized method for ticket timeline
  Future<Response> getTicketTimeline(int ticketId) async {
    return post(AppConstants.ticketTimeline, {'ticket_id': ticketId});
  }

  /// Specialized method for ticket delivery/status update
  Future<Response> updateTicketStatus(int ticketId, int userId, String comment) async {
    return post(AppConstants.entregarTicket, {
      'id_ticket': ticketId,
      'id_user': userId,
      'comentario': comment,
    });
  }

  /// Specialized method for photo upload
  Future<Response> uploadPhoto(int ticketId, int userId, String nroTicket, String documentType, List<int> fileBytes, String fileName) async {
    try {
      final formData = FormData.fromMap({
        'id_ticket': ticketId,
        'id_user': userId,
        'nro_ticket': nroTicket,
        'action': 'uploadDocumentTec',
        'document_type': documentType,
        'documento': MultipartFile.fromBytes(fileBytes, filename: fileName),
      });
      final response = await _dio.post(AppConstants.uploadPhoto, data: formData);
      return response;
    } on DioException catch (e) {
      return Response(
        requestOptions: RequestOptions(path: AppConstants.uploadPhoto),
        statusCode: 500,
        data: {'success': false, 'message': e.message},
      );
    }
  }

  /// Verify Client RIF
  Future<Response> validateRif(String rif) async {
    return post(AppConstants.validateRif, {'rif': rif});
  }

  /// Search devices by RIF
  Future<Response> searchByRif(String rif) async {
    return post(AppConstants.searchByRif, {'rif': rif});
  }

  /// Search devices by Serial
  Future<Response> searchBySerial(String serial) async {
    return post(AppConstants.searchBySerial, {'serial': serial});
  }

  /// Search devices by Razon Social
  Future<Response> searchByRazon(String razon) async {
    return post(AppConstants.searchByRazon, {'razonsocial': razon});
  }

  /// Get detailed info for a specific Serial
  Future<Response> searchSerialDetails(String serial) async {
    return post(AppConstants.searchSerialDetails, {'serial': serial});
  }

  /// Global search for a ticket by number or other criteria
  Future<Response> globalSearchTicket(String query) async {
    return post(AppConstants.globalSearchTicket, {'ticket_nro': query});
  }

  /// Get all ticket documents list
  Future<List<dynamic>> getAllTicketDocuments(String ticketId, String nroTicket) async {
    try {
      final response = await _dio.post(
        AppConstants.getAttachments,
        data: FormData.fromMap({
          'ticketId': ticketId,
          'nroTicket': nroTicket,
        }),
      );

      if (response.data['success'] == true) {
        return response.data['attachments'] ?? [];
      }
      return [];
    } catch (e) {
      print('Error fetching attachments: $e');
      return [];
    }
  }

  /// Download a document as bytes
  Future<List<int>?> downloadDocument(String ticketId, String documentType) async {
    try {
      final response = await _dio.post(
        AppConstants.streamAttachment,
        data: FormData.fromMap({
          'ticketId': ticketId,
          'documentType': documentType,
        }),
        options: Options(responseType: ResponseType.bytes),
      );

      if (response.statusCode == 200) {
        return response.data as List<int>;
      }
      return null;
    } catch (e) {
      print('Error downloading document: $e');
      return null;
    }
  }
}
