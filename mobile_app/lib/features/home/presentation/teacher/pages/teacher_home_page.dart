
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:mobile_app/features/authentication/domain/entities/app_user.dart';
import 'package:mobile_app/features/authentication/presentation/providers/auth_providers.dart';
import 'package:mobile_app/features/authentication/presentation/pages/login_page.dart';

class TeacherHomePage extends ConsumerStatefulWidget {
  final AppUser user;

  const TeacherHomePage({
    super.key,
    required this.user,
  });

  static const Color primaryColor = Color(0xFF2563EB);

  @override
  ConsumerState<TeacherHomePage> createState() =>
      _TeacherHomePageState();
}

class _TeacherHomePageState extends ConsumerState<TeacherHomePage> {
  bool isLoggingOut = false;

  // =========================================================
  // ĐĂNG XUẤT
  // =========================================================

  Future<void> logout() async {
    if (isLoggingOut) return;

    setState(() {
      isLoggingOut = true;
    });

    try {
      // 1. Đăng xuất khỏi Supabase
      await Supabase.instance.client.auth.signOut();

      if (!mounted) return;

      // 2. Làm mới thông tin tài khoản
      ref.invalidate(currentUserProvider);

      // 3. Quay về LoginPage, xóa lịch sử điều hướng
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
          builder: (_) => const LoginPage(),
        ),
        (route) => false,
      );
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Đăng xuất thất bại: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          isLoggingOut = false;
        });
      }
    }
  }

  // =========================================================
  // BUILD
  // =========================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),

              const SizedBox(height: 20),

              _buildOfflineBanner(),

              const SizedBox(height: 20),

              _buildSectionTitle('Chuyến xe hiện tại'),

              const SizedBox(height: 12),

              _buildCurrentTripCard(),

              const SizedBox(height: 24),

              _buildSectionTitle('Chuyến xe sắp tới'),

              const SizedBox(height: 12),

              _buildUpcomingTripCard(
                title: 'Trả học sinh buổi trưa',
                route: 'Tuyến 05',
                time: '11:00 - 12:00',
                icon: Icons.home_outlined,
              ),

              const SizedBox(height: 12),

              _buildUpcomingTripCard(
                title: 'Đón học sinh buổi chiều',
                route: 'Tuyến 03',
                time: '16:00 - 17:00',
                icon: Icons.directions_bus_outlined,
              ),

              const SizedBox(height: 30),

              // NÚT ĐĂNG XUẤT
              _buildLogoutButton(),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  // =========================================================
  // HEADER
  // =========================================================

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: TeacherHomePage.primaryColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 28,
            backgroundColor: Colors.white,
            child: Icon(
              Icons.person,
              size: 32,
              color: TeacherHomePage.primaryColor,
            ),
          ),

          const SizedBox(width: 14),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Xin chào,',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),

                const SizedBox(height: 4),

                Text(
                  widget.user.fullName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 4),

                const Text(
                  'Giáo viên',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),

          const Icon(
            Icons.notifications_none,
            color: Colors.white,
            size: 28,
          ),
        ],
      ),
    );
  }

  // =========================================================
  // OFFLINE BANNER
  // =========================================================

  Widget _buildOfflineBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.orange.shade200,
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.wifi_off,
            color: Colors.orange.shade800,
          ),

          const SizedBox(width: 10),

          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Đang ở chế độ offline',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),

                SizedBox(height: 3),

                Text(
                  'Dữ liệu sẽ được đồng bộ khi có kết nối mạng.',
                  style: TextStyle(fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // SECTION TITLE
  // =========================================================

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  // =========================================================
  // CURRENT TRIP CARD
  // =========================================================

  Widget _buildCurrentTripCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.directions_bus,
                color: TeacherHomePage.primaryColor,
                size: 26,
              ),

              const SizedBox(width: 8),

              const Expanded(
                child: Text(
                  'Đón sáng • Tuyến 05',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),

              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Đang chạy',
                  style: TextStyle(
                    color: Colors.green.shade700,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          _buildInfoRow(
            Icons.directions_bus_outlined,
            'Biển số xe',
            '43B-123.45',
          ),

          const SizedBox(height: 10),

          _buildInfoRow(
            Icons.access_time,
            'Thời gian',
            '06:30 - 07:30',
          ),

          const SizedBox(height: 18),

          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Tiến độ điểm danh',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                ),
              ),

              Text(
                '28/32 học sinh',
                style: TextStyle(
                  color: TeacherHomePage.primaryColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: 28 / 32,
              minHeight: 9,
              backgroundColor: Color(0xFFE5E7EB),
              valueColor: const AlwaysStoppedAnimation(
                TeacherHomePage.primaryColor,
              ),
            ),
          ),

          const SizedBox(height: 8),

          Text(
            'Còn 4 học sinh chưa được điểm danh.',
            style: TextStyle(
              color: Colors.grey.shade600,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // INFO ROW
  // =========================================================

  Widget _buildInfoRow(
    IconData icon,
    String label,
    String value,
  ) {
    return Row(
      children: [
        Icon(
          icon,
          size: 19,
          color: Colors.grey.shade600,
        ),

        const SizedBox(width: 10),

        Expanded(
          child: Text(
            label,
            style: TextStyle(
              color: Colors.grey.shade600,
            ),
          ),
        ),

        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  // =========================================================
  // UPCOMING TRIP CARD
  // =========================================================

  Widget _buildUpcomingTripCard({
    required String title,
    required String route,
    required String time,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icon,
              color: TeacherHomePage.primaryColor,
              size: 24,
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),

                const SizedBox(height: 5),

                Text(
                  route,
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 12,
                  ),
                ),

                const SizedBox(height: 3),

                Text(
                  time,
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),

          Icon(
            Icons.chevron_right,
            color: Colors.grey.shade500,
          ),
        ],
      ),
    );
  }

  // =========================================================
  // LOGOUT BUTTON
  // =========================================================

  Widget _buildLogoutButton() {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton.icon(
        onPressed: isLoggingOut ? null : logout,

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
}
