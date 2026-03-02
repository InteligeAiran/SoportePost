import 'dart:typed_data';
import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class DocumentViewerScreen extends StatelessWidget {
  final String ticketId;
  final String documentType;
  final String title;

  const DocumentViewerScreen({
    Key? key,
    required this.ticketId,
    required this.documentType,
    required this.title,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: const Color(0xFF1A237E),
      ),
      body: FutureBuilder<List<int>?>(
        future: ApiService().downloadDocument(ticketId, documentType),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          
          if (snapshot.hasError || snapshot.data == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  Text(
                    'Error al cargar el documento',
                    style: TextStyle(color: Colors.grey[700], fontSize: 18),
                  ),
                ],
              ),
            );
          }

          final bytes = snapshot.data!;
          
          return Center(
            child: InteractiveViewer(
              minScale: 0.5,
              maxScale: 4.0,
              child: Image.memory(
                Uint8List.fromList(bytes),
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) {
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.insert_drive_file, size: 80, color: Colors.grey),
                      const SizedBox(height: 20),
                      const Text(
                        'El archivo no es una imagen previsualizable.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 10),
                      ElevatedButton.icon(
                        onPressed: () {
                          // TODO: Implement actual download to local storage if needed
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Descarga no implementada en esta versión')),
                          );
                        },
                        icon: const Icon(Icons.download),
                        label: const Text('Descargar archivo'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF1A237E),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
          );
        },
      ),
    );
  }
}
