import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  const supabaseUrl = 'https://zimlasyxfrgtsmftadjy.supabase.co';
  const supabaseKey = 'sb_publishable_pCeypEOyk1lPUwVrRfGSdA_wk-3gJ5S';

  if (supabaseUrl.isEmpty || supabaseKey.isEmpty) {
    throw Exception(
      'Thiếu SUPABASE_URL hoặc SUPABASE_ANON_KEY',
    );
  }

  await Supabase.initialize(
    url: supabaseUrl,
    anonKey: supabaseKey,
  );

  runApp(
    const ProviderScope(
      child: SchoolBusApp(),
    ),
  );
}