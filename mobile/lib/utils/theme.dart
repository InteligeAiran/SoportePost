import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryNeon = Color(0xFF00FFF2); // Cyan Neon
  static const Color secondaryNeon = Color(0xFFFF00FF); // Magenta Neon
  static const Color backgroundDark = Color(0xFF0A0A12); // Deep Space Blue
  static const Color surfaceDark = Color(0xFF1A1A2E); // Dark Navy

  static ThemeData get cyberpunkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: backgroundDark,
      colorScheme: const ColorScheme.dark(
        primary: primaryNeon,
        secondary: secondaryNeon,
        surface: surfaceDark,
        background: backgroundDark,
      ),
      textTheme: GoogleFonts.orbitronTextTheme(ThemeData.dark().textTheme).copyWith(
        bodyLarge: GoogleFonts.inter(color: Colors.white70),
        bodyMedium: GoogleFonts.inter(color: Colors.white70),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryNeon,
          foregroundColor: backgroundDark,
          textStyle: GoogleFonts.orbitron(fontWeight: FontWeight.bold),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          elevation: 10,
          shadowColor: primaryNeon.withOpacity(0.5),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceDark,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: primaryNeon.withOpacity(0.3)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: primaryNeon),
        ),
        labelStyle: const TextStyle(color: primaryNeon),
        prefixIconColor: primaryNeon,
      ),
      expansionTileTheme: ExpansionTileThemeData(
        iconColor: primaryNeon,
        collapsedIconColor: Colors.white54,
        textColor: primaryNeon,
        collapsedTextColor: Colors.white,
        backgroundColor: surfaceDark.withOpacity(0.3),
        collapsedBackgroundColor: Colors.transparent,
      ),
    );
  }
}
