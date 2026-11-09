import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:mobile_app/features/authentication/domain/entities/app_user.dart';
import 'package:mobile_app/features/authentication/presentation/providers/auth_providers.dart';
import 'package:mobile_app/features/authentication/presentation/pages/auth_gate.dart';

class TeacherProfilePage extends ConsumerStatefulWidget {
  final AppUser user;

  const TeacherProfilePage({
    super.key,
    required this.user,
  });

  @override
  ConsumerState<TeacherProfilePage> createState() =>
      _TeacherProfilePageState();
}

class _TeacherProfilePageState extends ConsumerState<TeacherProfilePage> {
  static const Color primaryColor = Color(0xFF2563EB);

  bool isLoggingOut = false;

  // =====================================================
  // LOGOUT
  // =====================================================

  Future<void> logout() async {
    if (isLoggingOut) return;

    setState(() {
      isLoggingOut = true;
    });

    // Lấy sẵn MỌI thứ cần dùng TRƯỚC khi await.
    // Sau signOut(), AuthGate rebuild và trang này bị dispose,
    // nên sau đó không được dùng context / ref / setState của State này nữa.
    final navigator = Navigator.of(context, rootNavigator: true);
    final messenger = ScaffoldMessenger.of(context);
    final container = ProviderScope.containerOf(context, listen: false);

    try {
      // 1. Đăng xuất khỏi Supabase (xóa session)
      await Supabase.instance.client.auth.signOut();

      debugPrint(
        'LOGOUT OK -> session = ${Supabase.instance.client.auth.currentSession}',
      );

      // 2. Làm mới thông tin user bằng container (an toàn dù widget đã dispose)
      container.invalidate(currentUserProvider);

      // 3. Thay toàn bộ stack bằng AuthGate mới -> hiện LoginPage.
      //    Không gọi setState ở đây vì trang này sắp bị gỡ bỏ.
      navigator.pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const AuthGate()),
        (route) => false,
      );
    } catch (error) {
      messenger.showSnackBar(
        SnackBar(
          content: Text('Đăng xuất thất bại: $error'),
          backgroundColor: Colors.red,
        ),
      );

      // Chỉ trong nhánh lỗi (trang vẫn còn) mới setState, và phải kiểm tra mounted
      if (mounted) {
        setState(() {
          isLoggingOut = false;
        });
      }
    }
  }

  // =====================================================
  // LOGOUT CONFIRMATION
  // =====================================================

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Đăng xuất'),
          content: const Text(
            'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
              },
              child: const Text('Hủy'),
            ),
            TextButton(
              onPressed: isLoggingOut
                  ? null
                  : () {
                      Navigator.pop(dialogContext);
                      logout();
                    },
              child: const Text(
                'Đăng xuất',
                style: TextStyle(color: Colors.red),
              ),
            ),
          ],
        );
      },
    );
  }

  // =====================================================
  // BUILD
  // =====================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Hồ sơ cá nhân',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildProfileHeader(),

          const SizedBox(height: 24),

          const Text(
            'Thông tin tài khoản',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 17,
            ),
          ),

          const SizedBox(height: 12),

          _buildInfoTile(
            Icons.person_outline,
            'Họ và tên',
            widget.user.fullName,
          ),

          _buildInfoTile(
            Icons.email_outlined,
            'Email',
            widget.user.email,
          ),

          _buildInfoTile(
            Icons.badge_outlined,
            'Vai trò',
            'Giáo viên / Bảo mẫu',
          ),

          const SizedBox(height: 20),

          const Text(
            'Cài đặt',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 17,
            ),
          ),

          const SizedBox(height: 10),

          _buildActionTile(
            Icons.lock_outline,
            'Đổi mật khẩu',
            () {
              _showComingSoon('Đổi mật khẩu');
            },
          ),

          _buildActionTile(
            Icons.notifications_outlined,
            'Cài đặt thông báo',
            () {
              _showComingSoon('Cài đặt thông báo');
            },
          ),

          _buildActionTile(
            Icons.help_outline,
            'Trợ giúp',
            () {
              _showComingSoon('Trợ giúp');
            },
          ),

          const SizedBox(height: 24),

          // LOGOUT BUTTON
          _buildLogoutButton(),
        ],
      ),
    );
  }

  // =====================================================
  // PROFILE HEADER
  // =====================================================

  Widget _buildProfileHeader() {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: primaryColor,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          const CircleAvatar(
            radius: 42,
            backgroundColor: Colors.white,
            child: Icon(
              Icons.person,
              size: 48,
              color: primaryColor,
            ),
          ),

          const SizedBox(height: 12),

          Text(
            widget.user.fullName,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),

          const SizedBox(height: 5),

          const Text(
            'Giáo viên / Bảo mẫu',
            style: TextStyle(color: Colors.white70),
          ),
        ],
      ),
    );
  }

  // =====================================================
  // INFO TILE
  // =====================================================

  Widget _buildInfoTile(
    IconData icon,
    String title,
    String value,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: const Icon(
          Icons.person_outline,
          color: primaryColor,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
          ),
        ),
        subtitle: Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
        trailing: Icon(
          icon,
          color: primaryColor,
          size: 20,
        ),
      ),
    );
  }

  // =====================================================
  // ACTION TILE
  // =====================================================

  Widget _buildActionTile(
    IconData icon,
    String title,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(
          icon,
          color: primaryColor,
        ),
        title: Text(title),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }

  // =====================================================
  // LOGOUT BUTTON
  // =====================================================

  Widget _buildLogoutButton() {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton.icon(
        onPressed: isLoggingOut ? null : _showLogoutDialog,

        icon: isLoggingOut
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              )
            : const Icon(Icons.logout),

        label: Text(
          isLoggingOut
              ? 'Đang đăng xuất...'
              : 'Đăng xuất tài khoản',
        ),

        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.red,
          foregroundColor: Colors.white,
          disabledBackgroundColor: Colors.red.shade200,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  // =====================================================
  // COMING SOON
  // =====================================================

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature đang được phát triển.'),
      ),
    );
  }
}