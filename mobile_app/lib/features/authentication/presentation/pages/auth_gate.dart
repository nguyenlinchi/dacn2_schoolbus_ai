
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/auth_providers.dart';
import 'package:mobile_app/features/authentication/presentation/pages/admin_home_page.dart';
import 'package:mobile_app/features/authentication/presentation/pages/driver_home_page.dart';
import 'package:mobile_app/features/authentication/presentation/pages/parent_home_page.dart';
import 'login_page.dart';
import '../../domain/entities/app_user.dart';

class AuthGate extends ConsumerWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);

    return userAsync.when(
      loading: () => const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      ),

      error: (error, stack) => Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Không thể tải thông tin tài khoản'),
                const SizedBox(height: 8),
                Text('$error'),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    ref.invalidate(currentUserProvider);
                  },
                  child: const Text('Thử lại'),
                ),
              ],
            ),
          ),
        ),
      ),

      data: (user) {
        if (user == null) {
          return const LoginPage();
        }

        switch (user.role) {
          case UserRole.admin:
            return AdminHomePage(user: user);

          case UserRole.driver:
            return DriverHomePage(user: user);

          case UserRole.parent:
            return ParentHomePage(user: user);
        }
      },
    );
  }
}
