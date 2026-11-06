import 'package:flutter/material.dart';

class TeacherBottomNavigation extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const TeacherBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  static const Color primaryColor = Color(0xFF1955EC);

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      type: BottomNavigationBarType.fixed,
      selectedItemColor: primaryColor,
      unselectedItemColor: Colors.grey,
      backgroundColor: Colors.white,
      elevation: 10,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.directions_bus),
          label: 'Chuyến xe',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.map),
          label: 'Lộ trình',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.qr_code_scanner),
          label: 'Điểm danh',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.warning_amber_rounded),
          label: 'SOS',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: 'Hồ sơ',
        ),
      ],
    );
  }
}