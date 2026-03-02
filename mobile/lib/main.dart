import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:soporte_post/providers/auth_provider.dart';
import 'package:soporte_post/providers/ticket_provider.dart';
import 'package:soporte_post/ui/screens/home_screen.dart';
import 'package:soporte_post/ui/screens/login_screen.dart';
import 'package:soporte_post/utils/theme.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => TicketProvider()),
      ],
      child: const SoportePostApp(),
    ),
  );
}

class SoportePostApp extends StatelessWidget {
  const SoportePostApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Soporte Post',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.cyberpunkTheme,
      initialRoute: '/login', // Fixed for now, usually checks auth status first
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
      },
      // Optional: Handle auto-login redirect
      builder: (context, child) {
        final auth = Provider.of<AuthProvider>(context, listen: false);
        if (auth.isAuthenticated && ModalRoute.of(context)?.settings.name == '/login') {
          return const HomeScreen();
        }
        return child!;
      },
    );
  }
}
