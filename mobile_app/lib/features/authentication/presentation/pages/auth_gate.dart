import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/auth_providers.dart';
import '../../domain/entities/app_user.dart';

import 'login_page.dart';

import 'package:mobile_app/features/authentication/presentation/pages/admin_home_page.dart';
import 'package:mobile_app/features/authentication/presentation/pages/driver_home_page.dart';
import 'package:mobile_app/features/authentication/presentation/pages/parent_home_page.dart';

// Gọi TeacherShell thay vì TeacherHomePage trực tiếp
import 'package:mobile_app/features/home/presentation/teacher/layouts/teacher_shell.dart';

class AuthGate extends ConsumerWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);

    return userAsync.when(
      // Đang kiểm tra tài khoản
      loading: () {
        return const Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        );
      },

      // Có lỗi khi lấy thông tin tài khoản
      error: (error, stack) {
        return Scaffold(
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.error_outline,
                    color: Colors.red,
                    size: 48,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Không thể tải thông tin tài khoản',
                  ),
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
        );
      },

      // Kiểm tra tài khoản và phân quyền
      data: (user) {
        // Chưa đăng nhập
        if (user == null) {
          return const LoginPage();
        }

        // Đã đăng nhập: điều hướng theo role
        switch (user.role) {
          case UserRole.admin:
            return AdminHomePage(user: user);

          case UserRole.schoolManager:
            return AdminHomePage(user: user);

          case UserRole.teacher:
            return TeacherShell(user: user); // Phân quyền mở khung 5 tab của Giáo viên

          case UserRole.driver:
            return DriverHomePage(user: user);

          case UserRole.parent:
            return ParentHomePage(user: user);
        }
      },
    );
  }
}