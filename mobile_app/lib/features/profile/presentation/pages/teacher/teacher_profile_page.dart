
import 'package:flutter/material.dart';

import 'package:mobile_app/features/authentication/domain/entities/app_user.dart';

class TeacherProfilePage extends StatelessWidget {
  final AppUser user;

  const TeacherProfilePage({
    super.key,
    required this.user,
  });

  static const Color primaryColor = Color(0xFF2563EB);

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
            user.fullName,
          ),
          _buildInfoTile(
            Icons.email_outlined,
            'Email',
            user.email,
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
            () {},
          ),
          _buildActionTile(
            Icons.notifications_outlined,
            'Cài đặt thông báo',
            () {},
          ),
          _buildActionTile(
            Icons.help_outline,
            'Trợ giúp',
            () {},
          ),

          const SizedBox(height: 20),

          OutlinedButton.icon(
            onPressed: () => _showLogoutDialog(context),
            icon: const Icon(Icons.logout, color: Colors.red),
            label: const Text(
              'Đăng xuất',
              style: TextStyle(color: Colors.red),
            ),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              side: const BorderSide(color: Colors.red),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

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
            user.fullName,
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

  Widget _buildInfoTile(
    IconData icon,
    String title,
    String value,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: primaryColor),
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
      ),
    );
  }

  Widget _buildActionTile(
    IconData icon,
    String title,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: primaryColor),
        title: Text(title),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
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
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Hủy'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(
                      'Cần kết nối chức năng Supabase Auth để đăng xuất.',
                    ),
                  ),
                );
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
}
